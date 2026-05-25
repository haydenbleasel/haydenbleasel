import {
  createGateway,
  createUIMessageStream,
  createUIMessageStreamResponse,
  isTextUIPart,
  streamText,
} from "ai";
import type { UIMessage } from "ai";

import { AI_TOKEN_HEADER } from "@/lib/ai-token";
import { NEW_PATTERN_SYSTEM } from "@/lib/prompts/generate";
import { PLAN_SYSTEM } from "@/lib/prompts/morph";
import { STRUDEL_SKILL } from "@/lib/prompts/strudel";

export const maxDuration = 60;

const PLAN_MODEL = "openai/gpt-5.5";
const APPLY_MODEL = "morph/morph-v3-fast";

// Strudel is a niche DSL and the lazy-marker format is unforgiving (an unmarked
// region gets deleted on merge), so the planning model needs real reasoning.
// GPT-5.5 runs with reasoning enabled and emits summaries that we forward to the
// client as reasoning parts so they show up in the chat.
const PLAN_PROVIDER_OPTIONS = {
  openai: {
    reasoningEffort: "medium",
    reasoningSummary: "auto",
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

// useChat sends the whole transcript; this pipeline only acts on the latest
// instruction, so pull the text out of the final user message.
const latestInstruction = (messages: UIMessage[]): string => {
  const last = messages.at(-1);
  if (!last || last.role !== "user") {
    return "";
  }
  return last.parts
    .filter(isTextUIPart)
    .map((part) => part.text)
    .join("")
    .trim();
};

export const POST = async (req: Request) => {
  const apiKey = req.headers.get(AI_TOKEN_HEADER)?.trim();
  if (!apiKey) {
    return new Response("Add your AI Gateway key in Settings to use the AI.", {
      status: 401,
    });
  }

  const {
    messages = [],
    currentCode,
    activePath,
  }: {
    messages?: UIMessage[];
    currentCode?: string;
    activePath?: string | null;
  } = await req.json();

  const prompt = latestInstruction(messages);
  const gateway = createGateway({ apiKey });
  const source = currentCode ?? "";

  const stream = createUIMessageStream({
    execute: async ({ writer }) => {
      writer.write({ type: "start" });

      // New / empty pattern: nothing to diff, so the planning model writes the
      // whole pattern. Forward both its reasoning and the resulting code.
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

        for await (const part of result.fullStream) {
          if (part.type === "reasoning-start") {
            writer.write({ id: part.id, type: "reasoning-start" });
          } else if (part.type === "reasoning-delta") {
            writer.write({
              delta: part.text,
              id: part.id,
              type: "reasoning-delta",
            });
          } else if (part.type === "reasoning-end") {
            writer.write({ id: part.id, type: "reasoning-end" });
          } else if (part.type === "text-start") {
            writer.write({ id: part.id, type: "text-start" });
          } else if (part.type === "text-delta") {
            writer.write({ delta: part.text, id: part.id, type: "text-delta" });
          } else if (part.type === "text-end") {
            writer.write({ id: part.id, type: "text-end" });
          }
        }

        writer.write({ type: "finish" });
        return;
      }

      // Existing pattern: the planning model writes a lazy snippet. Stream its
      // reasoning, but hold back its text — the snippet is an intermediate
      // artifact. Morph then merges the snippet into the full file, and that
      // becomes the visible code.
      const planning = streamText({
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
        system: `${PLAN_SYSTEM}\n\n${STRUDEL_SKILL}`,
      });

      for await (const part of planning.fullStream) {
        if (part.type === "reasoning-start") {
          writer.write({ id: part.id, type: "reasoning-start" });
        } else if (part.type === "reasoning-delta") {
          writer.write({
            delta: part.text,
            id: part.id,
            type: "reasoning-delta",
          });
        } else if (part.type === "reasoning-end") {
          writer.write({ id: part.id, type: "reasoning-end" });
        }
      }

      const snippet = stripFences(await planning.text);
      if (snippet.length === 0) {
        throw new Error("Model returned no edit.");
      }

      // Morph wants the instruction, the full original file, and the lazy
      // snippet as a single user message, with deterministic sampling.
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

      for await (const part of merged.fullStream) {
        if (part.type === "text-start") {
          writer.write({ id: part.id, type: "text-start" });
        } else if (part.type === "text-delta") {
          writer.write({ delta: part.text, id: part.id, type: "text-delta" });
        } else if (part.type === "text-end") {
          writer.write({ id: part.id, type: "text-end" });
        }
      }

      writer.write({ type: "finish" });
    },
    onError: (error) =>
      error instanceof Error ? error.message : String(error),
  });

  return createUIMessageStreamResponse({ stream });
};
