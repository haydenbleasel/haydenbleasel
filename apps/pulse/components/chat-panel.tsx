"use client";

import { useChat } from "@ai-sdk/react";
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@haydenbleasel/design-system/components/ai-elements/conversation";
import {
  Message,
  MessageContent,
  MessageResponse,
} from "@haydenbleasel/design-system/components/ai-elements/message";
import {
  PromptInput,
  PromptInputBody,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
} from "@haydenbleasel/design-system/components/ai-elements/prompt-input";
import type { PromptInputMessage } from "@haydenbleasel/design-system/components/ai-elements/prompt-input";
import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from "@haydenbleasel/design-system/components/ai-elements/reasoning";
import {
  Suggestion,
  Suggestions,
} from "@haydenbleasel/design-system/components/ai-elements/suggestion";
import { Button } from "@haydenbleasel/design-system/components/ui/button";
import { DefaultChatTransport } from "ai";
import { Loader2, Sparkles, X } from "lucide-react";
import { useCallback, useMemo, useRef } from "react";

import { AI_TOKEN_HEADER, getAiToken, hasAiToken } from "@/lib/ai-token";

interface Props {
  activePath: string | null;
  currentCode: string;
  onCodeUpdate: (next: string) => void;
  onRequestToken: () => void;
  onClose: () => void;
}

// The server returns plain code (no fences), but strip a wrapping code fence
// defensively in case the model adds one despite being told not to.
const FENCE_RE = /^```(?:js|javascript|strudel)?\s*\n([\s\S]*?)\n```\s*$/u;

const cleanMergedCode = (text: string): string => {
  const fenced = text.match(FENCE_RE);
  return (fenced?.[1] ?? text).trim();
};

const textOf = (parts: { type: string; text?: string }[]): string =>
  parts.map((part) => (part.type === "text" ? (part.text ?? "") : "")).join("");

// Starter prompts shown before the conversation begins.
const SUGGESTIONS = [
  "Add a drum beat",
  "Add a bassline",
  "Make it more melodic",
  "Add reverb and delay",
  "Speed up the tempo",
  "Make it sound darker",
  "Add a hi-hat pattern",
  "Simplify this pattern",
];

export const ChatPanel = ({
  activePath,
  currentCode,
  onCodeUpdate,
  onRequestToken,
  onClose,
}: Props) => {
  const codeRef = useRef(currentCode);
  const pathRef = useRef(activePath);
  codeRef.current = currentCode;
  pathRef.current = activePath;

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/chat",
        headers: () => ({ [AI_TOKEN_HEADER]: getAiToken() }),
      }),
    []
  );

  const { messages, sendMessage, status, stop, error } = useChat({
    onFinish: ({ message, isAbort, isError }) => {
      if (isAbort || isError) {
        return;
      }
      const merged = cleanMergedCode(textOf(message.parts));
      if (merged.length > 0) {
        onCodeUpdate(merged);
      }
    },
    transport,
  });

  const isGenerating = status === "submitted" || status === "streaming";

  const handleSubmit = useCallback(
    (message: PromptInputMessage) => {
      const prompt = message.text.trim();
      if (!prompt || isGenerating) {
        return;
      }
      if (!hasAiToken()) {
        onRequestToken();
        // Throw so PromptInput keeps the typed prompt instead of clearing it.
        throw new Error("Add your AI Gateway key in Settings to use the AI.");
      }
      sendMessage(
        { text: prompt },
        { body: { activePath: pathRef.current, currentCode: codeRef.current } }
      );
    },
    [isGenerating, onRequestToken, sendMessage]
  );

  const handleSuggestion = useCallback(
    (suggestion: string) => {
      if (isGenerating) {
        return;
      }
      if (!hasAiToken()) {
        onRequestToken();
        return;
      }
      sendMessage(
        { text: suggestion },
        { body: { activePath: pathRef.current, currentCode: codeRef.current } }
      );
    },
    [isGenerating, onRequestToken, sendMessage]
  );

  return (
    <aside className="flex h-full w-full flex-col bg-background">
      <div className="flex h-12 shrink-0 items-center justify-between gap-2 border-border border-b px-3">
        <div className="flex items-center gap-2">
          <Sparkles className="size-4 shrink-0 text-muted-foreground" />
          <p className="font-medium text-sm">Assistant</p>
        </div>
        <Button
          aria-label="Close assistant"
          onClick={onClose}
          size="icon-sm"
          variant="ghost"
        >
          <X />
        </Button>
      </div>

      <Conversation className="flex-1">
        <ConversationContent>
          {messages.length === 0 ? (
            <ConversationEmptyState
              description="Describe a change and the assistant will edit the current pattern."
              icon={<Sparkles className="size-5" />}
              title="Edit with AI"
            />
          ) : (
            messages.map((message) => (
              <Message from={message.role} key={message.id}>
                {message.parts.map((part, index) => {
                  if (part.type === "reasoning") {
                    return (
                      <Reasoning
                        className="w-full"
                        isStreaming={part.state === "streaming"}
                        key={`${message.id}-${index}`}
                      >
                        <ReasoningTrigger />
                        <ReasoningContent>{part.text}</ReasoningContent>
                      </Reasoning>
                    );
                  }
                  if (part.type === "text") {
                    return (
                      <MessageContent key={`${message.id}-${index}`}>
                        <MessageResponse>
                          {message.role === "assistant"
                            ? `\`\`\`js\n${part.text}\n\`\`\``
                            : part.text}
                        </MessageResponse>
                      </MessageContent>
                    );
                  }
                  return null;
                })}
              </Message>
            ))
          )}
          {status === "submitted" ? (
            <Message from="assistant">
              <MessageContent>
                <Loader2 className="size-4 animate-spin text-muted-foreground" />
              </MessageContent>
            </Message>
          ) : null}
          {error ? (
            <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-destructive text-xs">
              {error.message}
            </div>
          ) : null}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      <div className="flex shrink-0 flex-col gap-2 p-3">
        {messages.length === 0 ? (
          <Suggestions>
            {SUGGESTIONS.map((suggestion) => (
              <Suggestion
                key={suggestion}
                onClick={handleSuggestion}
                suggestion={suggestion}
              />
            ))}
          </Suggestions>
        ) : null}
        <PromptInput onSubmit={handleSubmit}>
          <PromptInputBody>
            <PromptInputTextarea placeholder="Edit the pattern…" />
          </PromptInputBody>
          <PromptInputFooter>
            <PromptInputTools>
              {activePath ? (
                <span className="truncate px-1 text-muted-foreground text-xs">
                  {activePath}
                </span>
              ) : null}
            </PromptInputTools>
            <PromptInputSubmit onStop={stop} status={status} />
          </PromptInputFooter>
        </PromptInput>
      </div>
    </aside>
  );
};
