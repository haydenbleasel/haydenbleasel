"use client";

import {
  SidebarInset,
  SidebarProvider,
} from "@haydenbleasel/design-system/components/ui/sidebar";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { Editor } from "@/components/editor";
import { NewPatternDialog } from "@/components/new-pattern-dialog";
import { PatternList } from "@/components/pattern-list";
import { PromptBar } from "@/components/prompt-bar";
import { SettingsDialog } from "@/components/settings-dialog";
import { Toolbar } from "@/components/toolbar";
import {
  deletePattern,
  listPatterns,
  loadPattern,
  patternExists,
  savePattern,
} from "@/lib/patterns";
import type { PatternRef } from "@/lib/patterns";
import { play, setEditorView, stop } from "@/lib/strudel";

export const Studio = () => {
  const router = useRouter();
  const params = useParams<{ path?: string[] }>();
  const active = useMemo<PatternRef | null>(() => {
    if (!params.path || params.path.length === 0) {
      return null;
    }
    return params.path.join("/");
  }, [params.path]);

  const [patterns, setPatterns] = useState<PatternRef[]>([]);
  const [code, setCode] = useState("");
  const [dirty, setDirty] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [errorMessage, setError] = useState<string | null>(null);
  const [newOpen, setNewOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const lastEvaluatedRef = useRef<string | null>(null);

  const refresh = useCallback(async () => {
    setPatterns(await listPatterns());
  }, []);

  // List patterns and, when landing on "/", jump to the first one.
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const refs = await listPatterns();
        if (cancelled) {
          return;
        }
        setPatterns(refs);
        if (!active && refs.length > 0) {
          router.replace(`/${refs[0]}`);
        }
      } catch (error) {
        if (!cancelled) {
          setError(String(error));
        }
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [active, router]);

  // Load the active pattern's code.
  useEffect(() => {
    stop();
    setPlaying(false);
    if (!active) {
      setCode("");
      setDirty(false);
      return;
    }
    const load = async () => {
      try {
        const src = await loadPattern(active);
        setCode(src);
        setDirty(false);
        setError(null);
      } catch (error) {
        setError(String(error));
      }
    };
    load();
  }, [active]);

  useEffect(
    () => () => {
      stop();
    },
    []
  );

  const handlePlay = useCallback(async () => {
    try {
      await play(code);
      lastEvaluatedRef.current = code;
      setPlaying(true);
      setError(null);
    } catch (error) {
      setError(String(error));
    }
  }, [code]);

  useEffect(() => {
    if (!playing) {
      return;
    }
    if (lastEvaluatedRef.current === code) {
      return;
    }
    const timer = setTimeout(async () => {
      try {
        await play(code);
        lastEvaluatedRef.current = code;
        setError(null);
      } catch (error) {
        setError(String(error));
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [code, playing]);

  const handleStop = useCallback(() => {
    try {
      stop();
      setPlaying(false);
    } catch (error) {
      setError(String(error));
    }
  }, []);

  const handleSave = useCallback(async () => {
    if (!active) {
      return;
    }
    try {
      await savePattern(active, code);
      setDirty(false);
      setError(null);
      await refresh();
    } catch (error) {
      setError(String(error));
    }
  }, [active, code, refresh]);

  const handleChange = useCallback((next: string) => {
    setCode(next);
    setDirty(true);
  }, []);

  const handleAiCode = useCallback((next: string) => {
    setCode(next);
    setDirty(true);
    setError(null);
  }, []);

  const handleCreate = useCallback(
    async (name: PatternRef) => {
      try {
        if (!(await patternExists(name))) {
          await savePattern(name, "");
        }
        router.push(`/${name}`);
      } catch (error) {
        setError(String(error));
      }
    },
    [router]
  );

  const handleDelete = useCallback(async () => {
    if (!active) {
      return;
    }
    try {
      await deletePattern(active);
      router.replace("/");
    } catch (error) {
      setError(String(error));
    }
  }, [active, router]);

  return (
    <SidebarProvider>
      <PatternList
        active={active}
        onNewPattern={() => setNewOpen(true)}
        onOpenSettings={() => setSettingsOpen(true)}
        patterns={patterns}
      />
      <SidebarInset className="flex h-svh min-w-0 flex-col">
        <Toolbar
          active={active}
          dirty={dirty}
          onDelete={handleDelete}
          onPlay={handlePlay}
          onSave={handleSave}
          onStop={handleStop}
          playing={playing}
        />
        <div className="min-h-0 flex-1 overflow-hidden">
          <Editor
            onChange={handleChange}
            onCreateEditor={setEditorView}
            onPlay={handlePlay}
            onSave={handleSave}
            value={code}
          />
        </div>
        {errorMessage ? (
          <div className="border-border border-t bg-destructive/10 px-3 py-2 font-mono text-destructive text-xs">
            {errorMessage}
          </div>
        ) : null}
      </SidebarInset>
      <PromptBar
        activePath={active}
        currentCode={code}
        onCodeUpdate={handleAiCode}
        onRequestToken={() => setSettingsOpen(true)}
      />
      <NewPatternDialog
        onCreate={handleCreate}
        onOpenChange={setNewOpen}
        open={newOpen}
      />
      <SettingsDialog onOpenChange={setSettingsOpen} open={settingsOpen} />
    </SidebarProvider>
  );
};
