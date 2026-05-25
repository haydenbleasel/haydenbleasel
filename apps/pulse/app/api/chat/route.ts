import { createAgentUIStreamResponse } from "ai";
import type { UIMessage } from "ai";

import { pulseAgent } from "@/lib/agent";
import { AI_TOKEN_HEADER } from "@/lib/ai-token";

export const maxDuration = 60;

export const POST = async (req: Request) => {
  const apiKey = req.headers.get(AI_TOKEN_HEADER)?.trim();
  if (!apiKey) {
    return new Response("Add your AI Gateway key in Settings to use the AI.", {
      status: 401,
    });
  }

  const {
    messages = [],
    currentCode = "",
    activePath = null,
  }: {
    messages?: UIMessage[];
    currentCode?: string;
    activePath?: string | null;
  } = await req.json();

  // The conversation agent talks to the user and only calls its editPattern tool
  // (backed by Morph) when an actual change is requested. The current pattern is
  // injected into the agent's context per request via the call options.
  return createAgentUIStreamResponse({
    abortSignal: req.signal,
    agent: pulseAgent,
    onError: (error) =>
      error instanceof Error ? error.message : String(error),
    options: { activePath, apiKey, currentCode },
    uiMessages: messages,
  });
};
