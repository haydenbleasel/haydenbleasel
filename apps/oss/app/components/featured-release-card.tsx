import { cn } from "@haydenbleasel/design-system/lib/utils";
import { ArrowUpRight } from "lucide-react";

import type { FeaturedRelease } from "@/lib/github";

import { ReleaseVisual } from "./release-visual";

interface FeaturedReleaseCardProps {
  prominence?: "primary" | "secondary";
  release: FeaturedRelease;
}

export const FeaturedReleaseCard = ({
  prominence = "secondary",
  release,
}: FeaturedReleaseCardProps) => (
  <a
    className={cn(
      "group grid gap-5",
      prominence === "primary" && "lg:h-full lg:grid-rows-[minmax(0,1fr)_auto]"
    )}
    href={release.url}
    rel="noopener noreferrer"
    target="_blank"
  >
    <ReleaseVisual
      label={release.packageLabel}
      prominence={prominence}
      tone={release.tone}
    />
    <div className="grid gap-2">
      <div className="flex items-start justify-between gap-4">
        <h2
          className={cn(
            "font-medium",
            prominence === "primary" ? "text-xl" : "text-base"
          )}
        >
          {release.title}
        </h2>
        <ArrowUpRight className="mt-1 size-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" />
      </div>
    </div>
  </a>
);
