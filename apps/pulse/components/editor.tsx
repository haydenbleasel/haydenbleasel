"use client";

import { javascript } from "@codemirror/lang-javascript";
import { Prec } from "@codemirror/state";
import type { EditorView } from "@codemirror/view";
import { keymap } from "@codemirror/view";
import { flashField, highlightExtension } from "@strudel/codemirror";
import CodeMirror from "@uiw/react-codemirror";
import { vitesseDark } from "codemirror-theme-vitesse";

interface Props {
  value: string;
  onChange: (next: string) => void;
  onPlay: () => void;
  onSave: () => void;
  onCreateEditor?: (view: EditorView) => void;
}

export const Editor = ({
  value,
  onChange,
  onPlay,
  onSave,
  onCreateEditor,
}: Props) => {
  const shortcuts = Prec.highest(
    keymap.of([
      {
        key: "Mod-Enter",
        run: () => {
          onPlay();
          return true;
        },
      },
      {
        key: "Mod-s",
        run: () => {
          onSave();
          return true;
        },
      },
    ])
  );

  return (
    <CodeMirror
      basicSetup={{
        bracketMatching: true,
        closeBrackets: true,
        foldGutter: true,
        highlightActiveLine: true,
        lineNumbers: true,
      }}
      className="h-full text-sm"
      extensions={[javascript(), highlightExtension, flashField, shortcuts]}
      height="100%"
      onChange={onChange}
      onCreateEditor={onCreateEditor}
      theme={vitesseDark}
      value={value}
    />
  );
};
