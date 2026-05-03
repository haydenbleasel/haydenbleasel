import {
  SiC,
  SiClojure,
  SiCplusplus,
  SiCss,
  SiDart,
  SiElixir,
  SiErlang,
  SiGnubash,
  SiGo,
  SiHaskell,
  SiHtml5,
  SiJavascript,
  SiKotlin,
  SiLua,
  SiMdx,
  SiPhp,
  SiPython,
  SiR,
  SiRuby,
  SiRust,
  SiScala,
  SiShell,
  SiSvelte,
  SiSwift,
  SiTypescript,
  SiZig,
} from "@icons-pack/react-simple-icons";
import type { ComponentType, SVGProps } from "react";

const languageIcons: Record<string, ComponentType<SVGProps<SVGSVGElement>>> = {
  C: SiC,
  "C++": SiCplusplus,
  CSS: SiCss,
  Clojure: SiClojure,
  Dart: SiDart,
  Elixir: SiElixir,
  Erlang: SiErlang,
  Go: SiGo,
  HTML: SiHtml5,
  Haskell: SiHaskell,
  JavaScript: SiJavascript,
  Kotlin: SiKotlin,
  Lua: SiLua,
  MDX: SiMdx,
  PHP: SiPhp,
  Python: SiPython,
  R: SiR,
  Ruby: SiRuby,
  Rust: SiRust,
  Scala: SiScala,
  Shell: SiGnubash,
  ShellScript: SiShell,
  Svelte: SiSvelte,
  Swift: SiSwift,
  TypeScript: SiTypescript,
  Zig: SiZig,
};

export const LanguageIcon = ({ language }: { language: string | null }) => {
  if (!language) {
    return <span className="text-sm text-muted-foreground">—</span>;
  }

  const Icon = languageIcons[language];

  if (!Icon) {
    return <span className="text-sm text-muted-foreground">{language}</span>;
  }

  return (
    <Icon className="size-4 text-muted-foreground" aria-label={language} />
  );
};
