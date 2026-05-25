"use client";

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
import { Button } from "@haydenbleasel/design-system/components/ui/button";
import type { ChatStatus } from "ai";
import { Loader2, Sparkles, X } from "lucide-react";
import { useCallback, useRef, useState } from "react";

import { AI_TOKEN_HEADER, getAiToken, hasAiToken } from "@/lib/ai-token";

interface Props {
  activePath: string | null;
  currentCode: string;
  onCodeUpdate: (next: string) => void;
  onRequestToken: () => void;
  onClose: () => void;
}

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

// The server returns plain code (no fences), but strip a wrapping code fence
// defensively in case the model adds one despite being told not to.
const FENCE_RE = /^```(?:js|javascript|strudel)?\s*\n([\s\S]*?)\n```\s*$/u;

const cleanMergedCode = (text: string): string => {
  const fenced = text.match(FENCE_RE);
  return (fenced?.[1] ?? text).trim();
};

export const ChatPanel = ({
  activePath,
  currentCode,
  onCodeUpdate,
  onRequestToken,
  onClose,
}: Props) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [status, setStatus] = useState<ChatStatus>("ready");
  const codeRef = useRef(currentCode);
  const pathRef = useRef(activePath);
  const abortRef = useRef<AbortController | null>(null);
  codeRef.current = currentCode;
  pathRef.current = activePath;

  const isGenerating = status === "submitted" || status === "streaming";

  const handleSubmit = useCallback(
    async (message: PromptInputMessage) => {
      const prompt = message.text.trim();
      if (!prompt || isGenerating) {
        return;
      }
      if (!hasAiToken()) {
        onRequestToken();
        // Throw so PromptInput keeps the typed prompt instead of clearing it.
        throw new Error("Add your AI Gateway key in Settings to use the AI.");
      }

      // Commit the user turn; PromptInput clears the textarea on success.
      const assistantId = crypto.randomUUID();
      setMessages((prev) => [
        ...prev,
        { content: prompt, id: crypto.randomUUID(), role: "user" },
        { content: "", id: assistantId, role: "assistant" },
      ]);
      setStatus("submitted");

      const controller = new AbortController();
      abortRef.current = controller;

      const updateAssistant = (content: string) =>
        setMessages((prev) =>
          prev.map((m) => (m.id === assistantId ? { ...m, content } : m))
        );

      try {
        const res = await fetch("/api/chat", {
          body: JSON.stringify({
            activePath: pathRef.current,
            currentCode: codeRef.current,
            prompt,
          }),
          headers: {
            "Content-Type": "application/json",
            [AI_TOKEN_HEADER]: getAiToken(),
          },
          method: "POST",
          signal: controller.signal,
        });

        if (!res.ok) {
          const body = await res.text();
          throw new Error(body.trim() || `Request failed: ${res.status}`);
        }
        if (!res.body) {
          throw new Error("No response from the model.");
        }

        setStatus("streaming");
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let raw = "";
        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            break;
          }
          raw += decoder.decode(value, { stream: true });
          updateAssistant(`\`\`\`js\n${raw}\n\`\`\``);
        }

        const merged = cleanMergedCode(raw);
        if (merged.length === 0) {
          throw new Error("Model returned no usable edit.");
        }
        onCodeUpdate(merged);
        setStatus("ready");
      } catch (error) {
        if (controller.signal.aborted) {
          setStatus("ready");
          return;
        }
        const text = error instanceof Error ? error.message : String(error);
        updateAssistant(`⚠️ ${text}`);
        setStatus("error");
      } finally {
        abortRef.current = null;
      }
    },
    [isGenerating, onCodeUpdate, onRequestToken]
  );

  const handleStop = useCallback(() => {
    abortRef.current?.abort();
  }, []);

  return (
    <aside className="flex h-svh w-96 shrink-0 flex-col border-border border-l bg-background">
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
            messages.map((m) => (
              <Message from={m.role} key={m.id}>
                <MessageContent>
                  {m.content ? (
                    <MessageResponse>{m.content}</MessageResponse>
                  ) : (
                    <Loader2 className="size-4 animate-spin text-muted-foreground" />
                  )}
                </MessageContent>
              </Message>
            ))
          )}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      <div className="shrink-0 p-3">
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
            <PromptInputSubmit onStop={handleStop} status={status} />
          </PromptInputFooter>
        </PromptInput>
      </div>
    </aside>
  );
};
