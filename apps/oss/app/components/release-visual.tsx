import { cn } from "@haydenbleasel/design-system/lib/utils";
import type { CSSProperties } from "react";

import type { FeaturedRelease } from "@/lib/github";

const meshPalettes: Record<FeaturedRelease["tone"], string[]> = {
  blue: ["#0ea5e9", "#2563eb", "#172554", "#18181b"],
  green: ["#10b981", "#2dd4bf", "#064e3b", "#18181b"],
  violet: ["#8b5cf6", "#ec4899", "#312e81", "#18181b"],
};

const getMeshGradient = (tone: FeaturedRelease["tone"]) => {
  const [a, b, c, d] = meshPalettes[tone];

  return [
    `radial-gradient(circle at 16% 20%, ${a} 0, transparent 34%)`,
    `radial-gradient(circle at 50% 34%, ${b} 0, transparent 30%)`,
    `radial-gradient(circle at 82% 72%, ${c} 0, transparent 38%)`,
    `linear-gradient(115deg, ${a} 0%, ${d} 54%, #0a0a0a 100%)`,
  ].join(", ");
};

interface ReleaseVisualProps {
  label: string;
  prominence?: "primary" | "secondary";
  tone: FeaturedRelease["tone"];
}

export const ReleaseVisual = ({
  label,
  prominence = "secondary",
  tone,
}: ReleaseVisualProps) => {
  const style = {
    backgroundImage: getMeshGradient(tone),
  } satisfies CSSProperties;

  return (
    <div
      className={cn(
        "relative flex overflow-hidden rounded-lg bg-zinc-950 text-white [container-type:inline-size]",
        prominence === "primary"
          ? "aspect-[770/435] lg:aspect-auto lg:h-full lg:min-h-0"
          : "aspect-[367/173]"
      )}
      style={style}
    >
      <div className="absolute inset-0 bg-black/20 backdrop-blur-[24px]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-size-[56px_56px] opacity-25" />
      <div className="relative flex size-full items-center justify-center p-6">
        <span
          className={cn(
            "max-w-full whitespace-nowrap text-center font-normal font-mono leading-none tracking-normal",
            prominence === "primary"
              ? "text-[clamp(2rem,9cqw,3.75rem)]"
              : "text-[clamp(1.25rem,8cqw,2rem)]"
          )}
        >
          {label}
        </span>
      </div>
    </div>
  );
};
