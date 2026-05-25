"use client";

import { javascript } from "@codemirror/lang-javascript";
import { EditorView } from "@codemirror/view";
import CodeMirror from "@uiw/react-codemirror";
import { vitesseDark } from "codemirror-theme-vitesse";

// A read-only, syntax-highlighted preview of a Strudel pattern that mirrors the
// editor's language and theme. basicSetup is off (no line numbers, gutter, or
// keymaps) — vitesseDark still supplies the highlight style — and lines wrap so
// a long pattern doesn't scroll horizontally in the narrow chat panel.
const extensions = [javascript(), EditorView.lineWrapping];

export const CodePreview = ({ code }: { code: string }) => (
  <CodeMirror
    basicSetup={false}
    className="overflow-hidden rounded-lg text-xs [&_.cm-content]:py-4! [&_.cm-line]:px-4! border"
    editable={false}
    extensions={extensions}
    maxHeight="16rem"
    theme={vitesseDark}
    value={code}
  />
);
