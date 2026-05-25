import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@haydenbleasel/design-system/components/ui/breadcrumb";
import { Button } from "@haydenbleasel/design-system/components/ui/button";
import { Separator } from "@haydenbleasel/design-system/components/ui/separator";
import { SidebarTrigger } from "@haydenbleasel/design-system/components/ui/sidebar";
import { PanelRight, Play, Save, Square, Trash2 } from "lucide-react";
import { Fragment } from "react";

import type { PatternRef } from "@/lib/patterns";

interface Props {
  active: PatternRef | null;
  playing: boolean;
  dirty: boolean;
  chatOpen: boolean;
  onPlay: () => void;
  onStop: () => void;
  onSave: () => void;
  onDelete: () => void;
  onToggleChat: () => void;
}

export const Toolbar = ({
  active,
  playing,
  dirty,
  chatOpen,
  onPlay,
  onStop,
  onSave,
  onDelete,
  onToggleChat,
}: Props) => {
  const segments = active ? active.split("/") : [];

  return (
    <div className="flex h-12 shrink-0 items-center justify-between gap-2 border-border border-b bg-background px-3">
      <div className="flex items-center gap-2">
        <SidebarTrigger />
        <Separator className="mr-1" orientation="vertical" />
        {active ? (
          <Breadcrumb>
            <BreadcrumbList>
              {segments.map((seg, i) => {
                const isLast = i === segments.length - 1;
                return (
                  <Fragment key={`${i}-${seg}`}>
                    {i > 0 ? <BreadcrumbSeparator /> : null}
                    <BreadcrumbItem>
                      {isLast ? (
                        <BreadcrumbPage>
                          {seg}
                          {dirty ? " •" : ""}
                        </BreadcrumbPage>
                      ) : (
                        seg
                      )}
                    </BreadcrumbItem>
                  </Fragment>
                );
              })}
            </BreadcrumbList>
          </Breadcrumb>
        ) : (
          <span className="text-muted-foreground text-xs">no pattern</span>
        )}
      </div>
      <div className="flex items-center gap-1">
        <Button
          aria-label="Play"
          disabled={!active}
          onClick={onPlay}
          size="icon-sm"
          variant={playing ? "secondary" : "outline"}
        >
          <Play />
        </Button>
        <Button
          aria-label="Stop"
          disabled={!playing}
          onClick={onStop}
          size="icon-sm"
          variant="outline"
        >
          <Square />
        </Button>
        <Button
          aria-label="Save"
          disabled={!(active && dirty)}
          onClick={onSave}
          size="icon-sm"
          variant="outline"
        >
          <Save />
        </Button>
        <Separator className="mx-1" orientation="vertical" />
        <Button
          aria-label="Delete pattern"
          disabled={!active}
          onClick={onDelete}
          size="icon-sm"
          variant="outline"
        >
          <Trash2 />
        </Button>
        <Separator className="mx-1" orientation="vertical" />
        <Button
          aria-label="Toggle assistant"
          onClick={onToggleChat}
          size="icon-sm"
          variant={chatOpen ? "secondary" : "outline"}
        >
          <PanelRight />
        </Button>
      </div>
    </div>
  );
};
