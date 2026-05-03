"use client";

import { Toaster } from "@haydenbleasel/design-system/components/ui/sonner";
import { TooltipProvider } from "@haydenbleasel/design-system/components/ui/tooltip";
import { ThemeProvider } from "next-themes";
import type { PropsWithChildren } from "react";

const DesignSystemProvider = ({ children }: PropsWithChildren) => (
  <ThemeProvider
    attribute="class"
    defaultTheme="system"
    disableTransitionOnChange
    enableSystem
  >
    <TooltipProvider delayDuration={0}>
      {children}
      <Toaster />
    </TooltipProvider>
  </ThemeProvider>
);

export { DesignSystemProvider };
