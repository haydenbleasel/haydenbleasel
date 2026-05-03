import { Instrument_Serif as createSerif } from "next/font/google";
import localFont from "next/font/local";

import { cn } from "../lib/utils";

const sans = localFont({
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

const serif = createSerif({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-serif",
  weight: "400",
});

export const fonts = cn(
  sans.variable,
  serif.variable,
  "touch-manipulation font-sans antialiased"
);
