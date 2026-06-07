import { DesignSystemServerProvider } from "@haydenbleasel/design-system/components/provider/server";
import { sans } from "@haydenbleasel/design-system/fonts";

import "./globals.css";
import { cn } from "@haydenbleasel/design-system/lib/utils";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Toaster } from "sonner";

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

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  image: "https://haydenbleasel.com/opengraph-image.png",
  jobTitle: "Member of Technical Staff",
  name: "Hayden Bleasel",
  sameAs: [
    "https://x.com/haydenbleasel",
    "https://www.linkedin.com/in/haydenbleasel/",
    "https://github.com/haydenbleasel",
  ],
  url: "https://haydenbleasel.com",
  worksFor: {
    "@type": "Organization",
    name: "OpenAI",
  },
};

const RootLayout = ({ children }: RootLayoutProps) => (
  <html lang="en" suppressHydrationWarning>
    <body
      className={cn(
        sans.variable,
        "font-sans antialiased min-h-dvh bg-background text-foreground text-lg -tracking-[0.01em]"
      )}
    >
      {children}
      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      <DesignSystemServerProvider />
      <Toaster />
    </body>
  </html>
);

export default RootLayout;
