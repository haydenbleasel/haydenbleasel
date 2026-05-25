import { TooltipProvider } from "@haydenbleasel/design-system/components/ui/tooltip";
import { fonts } from "@haydenbleasel/design-system/fonts";
import { cn } from "@haydenbleasel/design-system/lib/utils";

import "./globals.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  description: "A Strudel live-coding studio.",
  robots: {
    follow: false,
    index: false,
  },
  title: "Pulse",
};

interface RootLayoutProps {
  children: ReactNode;
}

const RootLayout = ({ children }: RootLayoutProps) => (
  <html className="dark h-full" lang="en">
    <body className={cn(fonts, "flex min-h-full flex-col")}>
      <TooltipProvider>{children}</TooltipProvider>
    </body>
  </html>
);

export default RootLayout;
