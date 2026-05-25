"use client";

import dynamic from "next/dynamic";

const Studio = dynamic(
  async () => {
    const m = await import("@/components/studio");
    return m.Studio;
  },
  { ssr: false }
);

const PatternPage = () => <Studio />;

export default PatternPage;
