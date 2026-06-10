import {
  createGateway,
  generateText,
  jsonSchema,
  stepCountIs,
  tool,
  ToolLoopAgent,
} from "ai";
import type { UIDataTypes, UIMessage } from "ai";

import { AGENT_SYSTEM } from "@/lib/prompts/agent";
import { STRUDEL_SKILL } from "@/lib/prompts/strudel";

// The conversation model writes the lazy edit snippet (it reasons, so we forward
// its reasoning summaries to the client); Morph merges that snippet into the
// full file deterministically.
const PLAN_MODEL = "openai/gpt-5.5";
const APPLY_MODEL = "morph/morph-v3-fast";

// GPT-5.5 runs with reasoning enabled and emits summaries that the UI shows as
// "Thinking…". The lazy-marker format is unforgiving, so the planning needs it.
// `reasoningSummary: "detailed"` (rather than "auto") forces a summary even on
// turns that end in a tool call — "auto" often emits none there, which showed up
// as an empty "Thought for Ns" panel.
const PLAN_PROVIDER_OPTIONS = {
  openai: {
    reasoningEffort: "medium",
    reasoningSummary: "detailed",
  },
};

// Per-request configuration. The user supplies their own AI Gateway key, so the
// gateway (and therefore every model) is request-scoped and injected via
// prepareCall rather than baked into the module-level agent.
interface CallOptions {
  apiKey: string;
  currentCode: string;
  activePath: string | null;
}

// Passed to the editPattern tool via experimental_context. `currentCode` is
// mutable so sequential edits in one turn merge against the latest version.
interface EditContext {
  gateway: ReturnType<typeof createGateway>;
  currentCode: string;
}

interface EditPatternInput {
  summary: string;
  snippet: string;
}
interface EditPatternOutput {
  code: string;
}

// The server tells the model not to fence its output, but strip a wrapping fence
// defensively so a stray ```js never leaks into the snippet or the merged code.
const stripFences = (text: string): string => {
  const fenced = text.match(
    /^```(?:js|javascript|strudel)?\s*\n(?<body>[\s\S]*?)\n```\s*$/u
  );
  return (fenced?.groups?.body ?? text).trim();
};

const buildInstructions = (
  currentCode: string,
  activePath: string | null
): string => {
  const heading = activePath
    ? `# Current pattern (${activePath})`
    : "# Current pattern";
  const body =
    currentCode.trim().length > 0
      ? `\`\`\`js\n${currentCode}\n\`\`\``
      : "(empty — the editor has no code yet)";
  return [AGENT_SYSTEM, STRUDEL_SKILL, `${heading}\n${body}`].join("\n\n");
};

const editPattern = tool({
  description:
    "Apply a code edit to the current Strudel pattern. Provide a lazy edit snippet — or, when the pattern is empty, the complete new pattern — in `snippet`, and a one-sentence plain-language description of the change in `summary`. Call this only when the user wants to create or change the music, never for questions, explanations, or suggestions.",
  execute: async (
    { summary, snippet }: EditPatternInput,
    { experimental_context, abortSignal }
  ): Promise<EditPatternOutput> => {
    const ctx = experimental_context as EditContext;
    const update = stripFences(snippet);
    if (update.length === 0) {
      throw new Error("The edit was empty.");
    }

    // Empty pattern: nothing to merge, the snippet is the whole new pattern.
    if (ctx.currentCode.trim().length === 0) {
      ctx.currentCode = update;
      return { code: update };
    }

    // Morph wants the instruction, the full original file, and the lazy snippet
    // as one user message, with deterministic sampling.
    const { text } = await generateText({
      abortSignal,
      messages: [
        {
          content: `<instruction>${summary}</instruction>\n<code>${ctx.currentCode}</code>\n<update>${update}</update>`,
          role: "user",
        },
      ],
      model: ctx.gateway(APPLY_MODEL),
      topP: 1,
    });

    const merged = stripFences(text);
    if (merged.length === 0) {
      throw new Error("The merge produced no code.");
    }

    // Keep context fresh so a follow-up edit in the same turn builds on this one.
    ctx.currentCode = merged;
    return { code: merged };
  },
  inputSchema: jsonSchema<EditPatternInput>({
    additionalProperties: false,
    properties: {
      snippet: {
        description:
          "The lazy edit snippet (or, for an empty pattern, the complete new pattern). Code only, no Markdown fences.",
        type: "string",
      },
      summary: {
        description:
          "One short sentence describing the musical change, in plain language for the user.",
        type: "string",
      },
    },
    required: ["summary", "snippet"],
    type: "object",
  }),
  // The merged file lives in the editor; the main agent only needs to know the
  // edit landed, not re-ingest the whole pattern.
  toModelOutput: ({ input }) => ({
    type: "text",
    value: `Applied edit: ${input.summary}`,
  }),
});

export const pulseAgent = new ToolLoopAgent({
  callOptionsSchema: jsonSchema<CallOptions>({
    additionalProperties: false,
    properties: {
      activePath: { type: ["string", "null"] },
      apiKey: { type: "string" },
      currentCode: { type: "string" },
    },
    required: ["apiKey", "currentCode", "activePath"],
    type: "object",
  }),
  model: PLAN_MODEL,
  // The user's gateway key arrives per request, so resolve the model, inject the
  // current pattern into the instructions, and hand the gateway + code to the
  // editPattern tool via context here (overriding the construction-time values).
  prepareCall: ({ options, ...rest }) => {
    const { apiKey, currentCode, activePath } = options;
    const gateway = createGateway({ apiKey });
    return {
      ...rest,
      experimental_context: { currentCode, gateway } satisfies EditContext,
      instructions: buildInstructions(currentCode, activePath),
      model: gateway(PLAN_MODEL),
    };
  },
  providerOptions: PLAN_PROVIDER_OPTIONS,
  // Bound multi-edit turns: a typical turn is one edit then a short reply.
  stopWhen: stepCountIs(6),
  tools: { editPattern },
});

// End-to-end type for the chat UI: assistant messages may carry text, reasoning,
// and `tool-editPattern` parts whose output is the merged code.
export type PulseUIMessage = UIMessage<
  unknown,
  UIDataTypes,
  { editPattern: { input: EditPatternInput; output: EditPatternOutput } }
>;
