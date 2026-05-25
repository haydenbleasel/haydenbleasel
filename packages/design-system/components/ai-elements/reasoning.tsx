"use client";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@haydenbleasel/design-system/components/ui/collapsible";
import { cn } from "@haydenbleasel/design-system/lib/utils";
import { BrainIcon, ChevronDownIcon } from "lucide-react";
import type { ComponentProps } from "react";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { MessageResponse } from "@haydenbleasel/design-system/components/ai-elements/message";

const AUTO_CLOSE_DELAY = 1000;
const MS_IN_SECOND = 1000;

interface ReasoningContextValue {
  isStreaming: boolean;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  duration: number;
}

const ReasoningContext = createContext<ReasoningContextValue | null>(null);

const useReasoning = () => {
  const context = useContext(ReasoningContext);
  if (!context) {
    throw new Error("Reasoning components must be used within <Reasoning>");
  }
  return context;
};

export type ReasoningProps = ComponentProps<typeof Collapsible> & {
  isStreaming?: boolean;
  duration?: number;
};

export const Reasoning = ({
  className,
  isStreaming = false,
  duration: durationProp,
  defaultOpen = false,
  children,
  ...props
}: ReasoningProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [duration, setDuration] = useState(durationProp ?? 0);
  const [hasAutoOpened, setHasAutoOpened] = useState(false);
  const startedAt = useRef<number | null>(null);

  // Time the reasoning across the streaming window so we can report how long
  // the model thought once it finishes.
  useEffect(() => {
    if (durationProp !== undefined) {
      return;
    }
    if (isStreaming) {
      startedAt.current ??= Date.now();
    } else if (startedAt.current !== null) {
      setDuration(Math.round((Date.now() - startedAt.current) / MS_IN_SECOND));
      startedAt.current = null;
    }
  }, [isStreaming, durationProp]);

  // Open while the model is thinking, then collapse shortly after it stops.
  useEffect(() => {
    if (isStreaming && !(isOpen || hasAutoOpened)) {
      setIsOpen(true);
      setHasAutoOpened(true);
    }
    if (!isStreaming && isOpen && hasAutoOpened) {
      const timer = setTimeout(() => setIsOpen(false), AUTO_CLOSE_DELAY);
      return () => clearTimeout(timer);
    }
  }, [isStreaming, isOpen, hasAutoOpened]);

  const value = useMemo<ReasoningContextValue>(
    () => ({ duration, isOpen, isStreaming, setIsOpen }),
    [duration, isOpen, isStreaming]
  );

  return (
    <ReasoningContext.Provider value={value}>
      <Collapsible
        className={cn("flex flex-col gap-2", className)}
        onOpenChange={setIsOpen}
        open={isOpen}
        {...props}
      >
        {children}
      </Collapsible>
    </ReasoningContext.Provider>
  );
};

export type ReasoningTriggerProps = ComponentProps<typeof CollapsibleTrigger>;

export const ReasoningTrigger = ({
  className,
  children,
  ...props
}: ReasoningTriggerProps) => {
  const { isStreaming, isOpen, duration } = useReasoning();

  return (
    <CollapsibleTrigger
      className={cn(
        "flex items-center gap-2 text-muted-foreground text-sm hover:text-foreground",
        className
      )}
      {...props}
    >
      {children ?? (
        <>
          <BrainIcon className="size-4 shrink-0" />
          <span>
            {isStreaming || duration === 0
              ? "Thinking…"
              : `Thought for ${duration} second${duration === 1 ? "" : "s"}`}
          </span>
          <ChevronDownIcon
            className={cn(
              "size-4 shrink-0 transition-transform",
              isOpen && "rotate-180"
            )}
          />
        </>
      )}
    </CollapsibleTrigger>
  );
};

export type ReasoningContentProps = Omit<
  ComponentProps<typeof CollapsibleContent>,
  "children"
> & {
  children: string;
};

export const ReasoningContent = ({
  className,
  children,
  ...props
}: ReasoningContentProps) => (
  <CollapsibleContent
    className={cn(
      "border-border border-l pl-3 text-muted-foreground text-sm",
      className
    )}
    {...props}
  >
    <MessageResponse>{children}</MessageResponse>
  </CollapsibleContent>
);
