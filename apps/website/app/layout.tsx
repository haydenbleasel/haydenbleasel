import { DesignSystemProvider } from "@haydenbleasel/design-system/components/provider/client";
import { DesignSystemServerProvider } from "@haydenbleasel/design-system/components/provider/server";
import { fonts } from "@haydenbleasel/design-system/fonts";

import "./globals.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";

import { url } from "@/lib/url";

const title = "Software engineer and product designer | Hayden Bleasel";
const description =
  "I design and build software on the internet. I’m originally from Sydney, Australia and currently living in San Francisco, California.";

export const metadata: Metadata = {
  alternates: {
    canonical: url,
  },

  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title,
  },

  authors: [
    {
      name: "Hayden Bleasel",
      url,
    },
  ],
  creator: "Hayden Bleasel",

  description,

  metadataBase: new URL(url),

  openGraph: {
    description,
    images: [
      {
        alt: "Hayden Bleasel",
        height: 630,
        url: new URL("/opengraph-image.png", url).toString(),
        width: 1200,
      },
    ],
    locale: "en_US",
    siteName: "Hayden Bleasel",
    title,
    type: "website",
    url,
  },

  title,

  twitter: {
    card: "summary_large_image",
    creatorId: "@haydenbleasel",
    description,
    images: [
      {
        alt: "Hayden Bleasel",
        height: 630,
        url: new URL("/opengraph-image.png", url).toString(),
        width: 1200,
      },
    ],
    title,
  },
};

interface RootLayoutProps {
  children: ReactNode;
}

const RootLayout = ({ children }: RootLayoutProps) => (
  <html lang="en" suppressHydrationWarning>
    <body className={fonts}>
      <DesignSystemProvider>
        <main className="relative z-10 mx-auto grid w-full max-w-2xl gap-16 sm:gap-24 px-4 py-16 sm:py-32">
          {children}
        </main>
      </DesignSystemProvider>
      <DesignSystemServerProvider />
    </body>
  </html>
);

export default RootLayout;
