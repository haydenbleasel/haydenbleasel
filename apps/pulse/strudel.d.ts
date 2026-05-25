declare module "@strudel/web" {
  export interface StrudelMeta {
    miniLocations?: [number, number][];
    widgets?: unknown[];
  }
  export interface StrudelRepl {
    scheduler: unknown;
    state: { miniLocations?: [number, number][] };
    evaluate: (code: string, autostart?: boolean) => Promise<unknown>;
    stop: () => void;
  }
  export interface InitStrudelOptions {
    prebake?: () => Promise<unknown> | undefined;
    afterEval?: (info: {
      code: string;
      pattern: unknown;
      meta?: StrudelMeta;
    }) => void;
    onToggle?: (started: boolean) => void;
    [key: string]: unknown;
  }
  export const initStrudel: (
    options?: InitStrudelOptions
  ) => Promise<StrudelRepl>;
  export const evaluate: (code: string, autoplay?: boolean) => Promise<unknown>;
  export const hush: () => void;
}

declare module "@strudel/codemirror/themes/strudel-theme.mjs" {
  import type { Extension } from "@codemirror/state";
  const theme: Extension;
  export default theme;
}

declare module "@strudel/codemirror" {
  import type { Extension } from "@codemirror/state";
  import type { EditorView } from "@codemirror/view";
  export const highlightExtension: Extension;
  export const flashField: Extension;
  export const flash: (view: EditorView, ms?: number) => void;
  export const updateMiniLocations: (
    view: EditorView,
    locations: [number, number][]
  ) => void;
  export const highlightMiniLocations: (
    view: EditorView,
    atTime: number,
    haps: unknown[]
  ) => void;
}

declare module "@strudel/webaudio" {
  import type { StrudelRepl } from "@strudel/web";
  export const initAudio: (options?: unknown) => Promise<void>;
  export const initAudioOnFirstClick: (options?: unknown) => Promise<void>;
  export const getAudioContext: () => AudioContext;
  export const registerSynthSounds: () => Promise<unknown>;
  export const registerZZFXSounds: () => void;
  export const samples: (
    sampleMap: unknown,
    baseUrl?: string,
    options?: { prebake?: boolean; tag?: string }
  ) => Promise<unknown>;
  export const aliasBank: (source: string | Record<string, string>) => unknown;
  export const webaudioOutput: (...args: unknown[]) => unknown;
  export const webaudioRepl: (options?: Record<string, unknown>) => StrudelRepl;
}

declare module "@strudel/core" {
  export const evalScope: (...args: unknown[]) => Promise<unknown[]>;
  export const setTime: (getTime: () => number) => void;
  export const repl: (options?: Record<string, unknown>) => unknown;
}

declare module "@strudel/mini" {
  export const miniAllStrings: () => void;
}

declare module "@strudel/soundfonts" {
  export const registerSoundfonts: () => Promise<unknown>;
}

declare module "@strudel/tonal";

declare module "@strudel/transpiler" {
  export const transpiler: unknown;
  export const evaluate: (
    code: string,
    options?: Record<string, unknown>
  ) => Promise<unknown>;
}

declare module "@strudel/draw" {
  export class Drawer {
    constructor(
      onDraw: (
        haps: { isActive: (t: number) => boolean }[],
        time: number,
        drawer: Drawer,
        painters: unknown[]
      ) => void,
      drawTime: [number, number]
    );
    start(scheduler: unknown): void;
    stop(): void;
    invalidate(scheduler?: unknown, t?: number): void;
    setDrawTime(drawTime: [number, number]): void;
  }
}
