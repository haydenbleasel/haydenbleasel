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

const CODE_BLOCK_RE = /```(?:js|javascript|strudel)?\s*\n([\s\S]*?)```/gu;
const SEARCH_REPLACE_RE =
  /<{7} SEARCH\r?\n([\s\S]*?)\r?\n={7}\r?\n([\s\S]*?)\r?\n>{7} REPLACE/gu;

type PatchResult =
  | { kind: "patches"; code: string }
  | { kind: "full"; code: string }
  | { kind: "noop" }
  | { kind: "error"; message: string };

const extractFullCode = (text: string): string | null => {
  const matches = [...text.matchAll(CODE_BLOCK_RE)];
  if (matches.length === 0) {
    return null;
  }
  return matches.at(-1)?.[1]?.trimEnd() ?? null;
};

const applyPatches = (source: string, text: string): PatchResult => {
  const blocks = [...text.matchAll(SEARCH_REPLACE_RE)];
  if (blocks.length > 0) {
    let result = source;
    for (const [, search, replace] of blocks) {
      if (search === undefined || replace === undefined) {
        continue;
      }
      if (!result.includes(search)) {
        const preview = search.split("\n")[0]?.slice(0, 60) ?? "";
        return {
          kind: "error",
          message: `Patch did not match current code near: "${preview}"`,
        };
      }
      result = result.replace(search, replace);
    }
    return { code: result, kind: "patches" };
  }
  const full = extractFullCode(text);
  if (full !== null) {
    return { code: full, kind: "full" };
  }
  return { kind: "noop" };
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
        setError(`Request failed: ${res.status}`);
        return;
      }
      const text = await res.text();
      const result = applyPatches(codeRef.current, text);
      if (result.kind === "patches" || result.kind === "full") {
        onCodeUpdate(result.code);
        setValue("");
      } else if (result.kind === "error") {
        setError(result.message);
      } else {
        setError("Model returned no usable edit.");
      }
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
