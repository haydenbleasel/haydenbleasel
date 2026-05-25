import { createGateway, streamText } from "ai";

import { AI_TOKEN_HEADER } from "@/lib/ai-token";

export const maxDuration = 60;

const SYSTEM_PROMPT = `You are a code-editing engine for a live-coding music studio that uses Strudel — a JavaScript-based pattern language built on Tidal Cycles.

Each request gives you the current Strudel pattern and an edit instruction. You emit *only* edits to the code. Never describe what you're doing. Never write prose. Never wrap your output in extra fences.

Strudel basics:
- Mini-notation strings drive sounds: \`s("bd hh sd hh")\`
- Common functions: \`stack\`, \`cat\`, \`seq\`, \`note\`, \`n\`, \`s\`, \`gain\`, \`room\`, \`delay\`, \`lpf\`, \`hpf\`, \`fast\`, \`slow\`, \`rev\`, \`every\`, \`chop\`, \`jux\`.
- Use \`setcps\` or \`setcpm\` for tempo.
- Compose patterns with \`stack(...)\` for layers, \`.fast(2)\`, \`.slow(2)\`, etc.

Output format — strict:

- For edits to an existing pattern, emit one or more SEARCH/REPLACE blocks. Each block must look EXACTLY like this, including the marker lines:

\`\`\`
<<<<<<< SEARCH
<lines copied verbatim from the current pattern>
=======
<the replacement lines>
>>>>>>> REPLACE
\`\`\`

- SEARCH must match the current pattern byte-for-byte (whitespace, quotes, punctuation).
- Keep each SEARCH chunk small — just the lines that change, plus enough surrounding context to make the match unique.
- Emit multiple blocks for disjoint edits.
- To insert new code, SEARCH for a unique nearby line and REPLACE it with itself plus the new lines. To delete code, SEARCH for the lines and REPLACE with nothing.
- ONLY when the current pattern is empty (a brand-new file), emit the complete pattern as a single fenced \`js\` code block instead.
- Do not emit anything else. No commentary, no headings, no greetings, no trailing explanation.`;

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

  const context = [
    activePath ? `Active pattern: ${activePath}` : "No pattern open.",
    "",
    "Current pattern:",
    "```js",
    currentCode ?? "",
    "```",
    "",
    "Edit instruction:",
    prompt,
  ].join("\n");

  const gateway = createGateway({ apiKey });

  const result = streamText({
    model: gateway("anthropic/claude-opus-4.7"),
    prompt: context,
    system: SYSTEM_PROMPT,
  });

  return result.toTextStreamResponse();
};
