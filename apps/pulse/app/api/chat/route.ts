import { createGateway, generateText, streamText } from "ai";

import { AI_TOKEN_HEADER } from "@/lib/ai-token";
import { NEW_PATTERN_SYSTEM } from "@/lib/prompts/generate";
import { PLAN_SYSTEM } from "@/lib/prompts/morph";

export const maxDuration = 60;

const PLAN_MODEL = "anthropic/claude-sonnet-4.6";
const APPLY_MODEL = "morph/morph-v3-fast";

// Strudel is a niche DSL and the lazy-marker format is unforgiving (an unmarked
// region gets deleted on merge), so the planning model needs real reasoning.
// Sonnet runs with extended thinking enabled; the AI SDK keeps thinking out of
// `.text` (and out of the text stream), so only the snippet flows on to Morph.
const THINKING_BUDGET = 4096;

const PLAN_PROVIDER_OPTIONS = {
  anthropic: {
    thinking: { budgetTokens: THINKING_BUDGET, type: "enabled" },
  },
};

// The model is told not to fence its output, but strip a wrapping fence
// defensively so a stray ```js never leaks into the snippet or the new pattern.
const stripFences = (text: string): string => {
  const fenced = text.match(
    /^```(?:js|javascript|strudel)?\s*\n([\s\S]*?)\n```\s*$/u
  );
  return (fenced?.[1] ?? text).trim();
};

export const POST = async (req: Request) => {
  const apiKey = req.headers.get(AI_TOKEN_HEADER)?.trim();
  if (!apiKey) {
    return new Response("Add your AI Gateway key in Settings to use the AI.", {
      status: 401,
    });
  }

  const {
    prompt,
    currentCode,
    activePath,
  }: {
    prompt: string;
    currentCode?: string;
    activePath?: string | null;
  } = await req.json();

  const gateway = createGateway({ apiKey });
  const source = currentCode ?? "";

  // New / empty pattern: nothing to diff, so generate the whole pattern directly.
  if (source.trim().length === 0) {
    const result = streamText({
      model: gateway(PLAN_MODEL),
      prompt: [
        activePath ? `New pattern: ${activePath}` : "New pattern.",
        "",
        "Instruction:",
        prompt,
      ].join("\n"),
      providerOptions: PLAN_PROVIDER_OPTIONS,
      system: NEW_PATTERN_SYSTEM,
    });
    return result.toTextStreamResponse();
  }

  // Existing pattern: Claude plans a lazy snippet, Morph applies it.
  let snippet: string;
  try {
    const planned = await generateText({
      model: gateway(PLAN_MODEL),
      prompt: [
        activePath ? `Active pattern: ${activePath}` : "",
        "Current pattern:",
        "```js",
        source,
        "```",
        "",
        "Edit instruction:",
        prompt,
      ].join("\n"),
      providerOptions: PLAN_PROVIDER_OPTIONS,
      system: PLAN_SYSTEM,
    });
    snippet = stripFences(planned.text);
  } catch (error) {
    return new Response(`Planning step failed: ${String(error)}`, {
      status: 502,
    });
  }

  if (snippet.length === 0) {
    return new Response("Model returned no edit.", { status: 422 });
  }

  // Morph wants the instruction, the full original file, and the lazy snippet
  // as a single user message, with deterministic sampling.
  const merged = streamText({
    messages: [
      {
        content: `<instruction>${prompt}</instruction>\n<code>${source}</code>\n<update>${snippet}</update>`,
        role: "user",
      },
    ],
    model: gateway(APPLY_MODEL),
    topP: 1,
  });

  return merged.toTextStreamResponse();
};
