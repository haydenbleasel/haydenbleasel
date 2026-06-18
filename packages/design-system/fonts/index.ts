import { Geist_Mono as createMono } from "next/font/google";
import localFont from "next/font/local";

import { cn } from "../lib/utils";

export const sans = localFont({
  display: "swap",
  src: [
    {
      path: "./soehne-buch.woff2",
      style: "normal",
      weight: "400",
    },
    {
      path: "./soehne-kraftig.woff2",
      style: "normal",
      weight: "500",
    },
  ],
  variable: "--font-sans",
});

export const mono = createMono({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-mono",
  weight: "400",
});

export const fonts = cn(
  sans.variable,
  mono.variable,
  "touch-manipulation font-sans antialiased"
);
