"use client";

import { Button } from "@haydenbleasel/design-system/components/ui/button";
import { ArrowUp, Loader2 } from "lucide-react";
import { useCallback, useRef, useState } from "react";

import { AI_TOKEN_HEADER, getAiToken, hasAiToken } from "@/lib/ai-token";

interface Props {
  activePath: string | null;
  currentCode: string;
  onCodeUpdate: (next: string) => void;
  onRequestToken: () => void;
}

// The server now returns the full merged pattern. Strip a wrapping code fence
// defensively in case the model adds one despite being told not to.
const FENCE_RE = /^```(?:js|javascript|strudel)?\s*\n([\s\S]*?)\n```\s*$/u;

const cleanMergedCode = (text: string): string => {
  const fenced = text.match(FENCE_RE);
  return (fenced?.[1] ?? text).trim();
};

export const PromptBar = ({
  activePath,
  currentCode,
  onCodeUpdate,
  onRequestToken,
}: Props) => {
  const [value, setValue] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const codeRef = useRef(currentCode);
  const pathRef = useRef(activePath);
  codeRef.current = currentCode;
  pathRef.current = activePath;

  const submit = useCallback(async () => {
    const prompt = value.trim();
    if (!prompt || pending) {
      return;
    }
    if (!hasAiToken()) {
      setError("Add your AI Gateway key in Settings to use the AI.");
      onRequestToken();
      return;
    }
    setPending(true);
    setError(null);
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
      });
      if (!res.ok) {
        const body = await res.text();
        setError(body.trim() || `Request failed: ${res.status}`);
        return;
      }
      const merged = cleanMergedCode(await res.text());
      if (merged.length === 0) {
        setError("Model returned no usable edit.");
        return;
      }
      onCodeUpdate(merged);
      setValue("");
    } catch (error_) {
      setError(String(error_));
    } finally {
      setPending(false);
    }
  }, [onCodeUpdate, onRequestToken, pending, value]);

  return (
    <div className="-translate-x-1/2 pointer-events-none fixed bottom-6 left-1/2 z-50 flex w-full max-w-xl flex-col items-center gap-2 px-4">
      {error ? (
        <div className="pointer-events-auto rounded-md border border-destructive/30 bg-destructive/10 px-3 py-1.5 text-destructive text-xs">
          {error}
        </div>
      ) : null}
      <form
        className="pointer-events-auto flex w-full items-center gap-2 rounded-full border border-border bg-background/80 px-2 py-1.5 shadow-lg backdrop-blur-md"
        onSubmit={(event) => {
          event.preventDefault();
          submit();
        }}
      >
        <input
          aria-label="Edit the pattern"
          autoComplete="off"
          className="min-w-0 flex-1 bg-transparent px-3 py-1.5 text-sm outline-none placeholder:text-muted-foreground disabled:opacity-60"
          disabled={pending}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Edit the pattern…"
          value={value}
        />
        <Button
          aria-label="Send"
          disabled={pending || !value.trim()}
          size="icon-sm"
          type="submit"
        >
          {pending ? <Loader2 className="animate-spin" /> : <ArrowUp />}
        </Button>
      </form>
    </div>
  );
};
