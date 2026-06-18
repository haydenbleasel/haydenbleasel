import { DesignSystemServerProvider } from "@haydenbleasel/design-system/components/provider/server";
import { fonts } from "@haydenbleasel/design-system/fonts";
import { cn } from "@haydenbleasel/design-system/lib/utils";

import "./globals.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";

import { url } from "@/lib/url";

const title = "Open source software | Hayden Bleasel";
const description =
  "A live directory of Hayden Bleasel's open source software, recent GitHub releases, repository stats, npm download trends, and former projects.";
const ogImage = new URL("/opengraph-image", url).toString();

export const metadata: Metadata = {
  alternates: {
    canonical: url,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title,
  },
  applicationName: "Hayden Bleasel OSS",
  authors: [
    {
      name: "Hayden Bleasel",
      url: "https://haydenbleasel.com",
    },
  ],
  category: "technology",
  creator: "Hayden Bleasel",
  description,
  keywords: [
    "Hayden Bleasel",
    "open source software",
    "GitHub repositories",
    "npm packages",
    "Ultracite",
    "Files SDK",
    "Batchwork",
  ],
  metadataBase: new URL(url),
  openGraph: {
    description,
    images: [
      {
        alt: "Hayden Bleasel open source software",
        height: 630,
        url: ogImage,
        width: 1200,
      },
    ],
    locale: "en_US",
    siteName: "Hayden Bleasel OSS",
    title,
    type: "website",
    url,
  },
  publisher: "Hayden Bleasel",
  robots: {
    follow: true,
    googleBot: {
      follow: true,
      index: true,
    },
    index: true,
  },
  title,
  twitter: {
    card: "summary_large_image",
    creator: "@haydenbleasel",
    description,
    images: [
      {
        alt: "Hayden Bleasel open source software",
        height: 630,
        url: ogImage,
        width: 1200,
      },
    ],
    title,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  about: "Open source software",
  author: {
    "@type": "Person",
    name: "Hayden Bleasel",
    sameAs: [
      "https://github.com/haydenbleasel",
      "https://x.com/haydenbleasel",
      "https://www.linkedin.com/in/haydenbleasel/",
    ],
    url: "https://haydenbleasel.com",
  },
  description,
  name: title,
  url,
};

interface RootLayoutProps {
  children: ReactNode;
}

const RootLayout = ({ children }: RootLayoutProps) => (
  <html lang="en" suppressHydrationWarning>
    <body className={cn(fonts, "min-h-dvh bg-background text-foreground")}>
      {children}
      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      <DesignSystemServerProvider />
    </body>
  </html>
);

export default RootLayout;
