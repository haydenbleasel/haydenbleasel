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
import { Check, Loader2, Sparkles, Trash2, X } from "lucide-react";
import type { ReactNode } from "react";
import { useCallback, useMemo, useRef, useState } from "react";

import type { PulseUIMessage } from "@/lib/agent";
import { AI_TOKEN_HEADER, getAiToken, hasAiToken } from "@/lib/ai-token";

interface Props {
  activePath: string | null;
  currentCode: string;
  onCodeUpdate: (next: string) => void;
  onRequestToken: () => void;
  onClose: () => void;
}

// Starter prompts shown before the conversation begins — a mix of edits and
// questions, since the assistant now answers as well as edits.
const SUGGESTIONS = [
  "Add a drum beat",
  "What should I add next?",
  "Add a bassline",
  "Explain this pattern",
  "Make it sound darker",
  "Add reverb and delay",
  "Speed up the tempo",
  "Simplify this pattern",
];

// Each proposed edit is approved or rejected on its own. We don't apply
// anything until the user approves it.
type Decision = "approved" | "rejected";

// Renders a completed editPattern proposal: the merged pattern plus the
// approve/reject controls, or the resolved status once decided.
const ProposedEdit = ({
  summary,
  code,
  decision,
  onApprove,
  onReject,
}: {
  summary: string;
  code: string;
  decision: Decision | undefined;
  onApprove: () => void;
  onReject: () => void;
}) => {
  let footer: ReactNode;
  if (decision === "approved") {
    footer = (
      <div className="flex items-center gap-1.5 text-emerald-500 text-xs">
        <Check className="size-3.5" />
        <span>Applied to editor</span>
      </div>
    );
  } else if (decision === "rejected") {
    footer = (
      <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
        <X className="size-3.5" />
        <span>Discarded</span>
      </div>
    );
  } else {
    footer = (
      <div className="flex items-center gap-1.5">
        <Button onClick={onApprove} size="xs">
          <Check />
          Approve
        </Button>
        <Button onClick={onReject} size="xs" variant="ghost">
          <X />
          Reject
        </Button>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-2 rounded-md border border-border bg-muted/40 p-2">
      <p className="text-muted-foreground text-xs">{summary}</p>
      <pre className="max-h-64 overflow-auto rounded bg-background p-2 font-mono text-xs leading-relaxed">
        <code>{code}</code>
      </pre>
      {footer}
    </div>
  );
};

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
      new DefaultChatTransport<PulseUIMessage>({
        api: "/api/chat",
        headers: () => ({ [AI_TOKEN_HEADER]: getAiToken() }),
      }),
    []
  );

  const { messages, sendMessage, setMessages, status, stop, error } =
    useChat<PulseUIMessage>({ transport });

  // Approve/reject decision per proposed edit, keyed by message id + part index.
  // The editor only changes when an edit is approved.
  const [decisions, setDecisions] = useState<Record<string, Decision>>({});

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

  const handleClear = useCallback(() => {
    if (isGenerating) {
      stop();
    }
    setMessages([]);
    setDecisions({});
  }, [isGenerating, stop, setMessages]);

  const decide = useCallback(
    (key: string, decision: Decision, code?: string) => {
      if (decision === "approved" && code !== undefined) {
        onCodeUpdate(code);
      }
      setDecisions((prev) => ({ ...prev, [key]: decision }));
    },
    [onCodeUpdate]
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
        <div className="flex items-center gap-1">
          <Button
            aria-label="Clear conversation"
            disabled={messages.length === 0}
            onClick={handleClear}
            size="icon-sm"
            variant="ghost"
          >
            <Trash2 />
          </Button>
          <Button
            aria-label="Close assistant"
            onClick={onClose}
            size="icon-sm"
            variant="ghost"
          >
            <X />
          </Button>
        </div>
      </div>

      <Conversation className="flex-1">
        <ConversationContent>
          {messages.length === 0 ? (
            <ConversationEmptyState
              description="Ask about the track or describe a change — the assistant proposes edits you can approve before they hit the editor."
              icon={<Sparkles className="size-5" />}
              title="Chat & edit with AI"
            />
          ) : (
            messages.map((message) => (
              <Message from={message.role} key={message.id}>
                {message.parts.map((part, index) => {
                  const key = `${message.id}-${index}`;

                  if (part.type === "reasoning") {
                    // Some turns (often those ending in a tool call) stream a
                    // reasoning part with no summary text; skip it rather than
                    // show an empty "Thought for Ns" panel that expands to
                    // nothing.
                    if (!part.text.trim()) {
                      return null;
                    }
                    return (
                      <Reasoning
                        className="w-full wrap-anywhere"
                        isStreaming={part.state === "streaming"}
                        key={key}
                      >
                        <ReasoningTrigger />
                        <ReasoningContent>{part.text}</ReasoningContent>
                      </Reasoning>
                    );
                  }

                  if (part.type === "text") {
                    return (
                      <MessageContent key={key}>
                        <MessageResponse>{part.text}</MessageResponse>
                      </MessageContent>
                    );
                  }

                  if (part.type === "tool-editPattern") {
                    if (part.state === "output-error") {
                      return (
                        <div
                          className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-destructive text-xs"
                          key={key}
                        >
                          {part.errorText ?? "The edit failed."}
                        </div>
                      );
                    }
                    if (part.state !== "output-available") {
                      return (
                        <div
                          className="flex items-center gap-2 text-muted-foreground text-xs"
                          key={key}
                        >
                          <Loader2 className="size-3.5 animate-spin" />
                          <span>Editing pattern…</span>
                        </div>
                      );
                    }

                    const proposed = part.output.code;
                    return (
                      <ProposedEdit
                        code={proposed}
                        decision={decisions[key]}
                        key={key}
                        onApprove={() => decide(key, "approved", proposed)}
                        onReject={() => decide(key, "rejected")}
                        summary={part.input.summary}
                      />
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
            <PromptInputTextarea placeholder="Ask or edit…" />
          </PromptInputBody>
          <PromptInputFooter>
            <PromptInputTools />
            <PromptInputSubmit onStop={stop} status={status} />
          </PromptInputFooter>
        </PromptInput>
      </div>
    </aside>
  );
};
