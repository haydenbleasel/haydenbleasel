import type { Metadata } from "next";

import { PageBody, PageHeader } from "@/components/page-header";

export const metadata: Metadata = {
  description: "Talks, interviews and judging I've done.",
  title: "Speaking | OS1",
};

interface SpeakingItem {
  title: string;
  url: string;
  year: number;
  type: "Interview" | "Speaking" | "Judging";
  additionalLinks?: { label: string; url: string }[];
}

const speakingItems: SpeakingItem[] = [
  {
    title: "Resend DevTools Meetup",
    type: "Speaking",
    url: "https://events.ycombinator.com/resend-devtools-26",
    year: 2026,
  },
  {
    title: "Ship & Secure Panel",
    type: "Speaking",
    url: "https://luma.com/oq93k631?tk=h7jCoO",
    year: 2026,
  },
  {
    title: "Hamed Bahram Podcast",
    type: "Interview",
    url: "https://www.youtube.com/watch?v=hRzOnEe65u0",
    year: 2026,
  },
  {
    title: "Agentic Orchestration and Collaboration Hackathon",
    type: "Judging",
    url: "https://cerebralvalley.ai/e/agentic-orchestration-hackathon",
    year: 2026,
  },
  {
    title: "Clerk Hackathon for Next.js Conf",
    type: "Judging",
    url: "https://luma.com/e4cdjt3u",
    year: 2025,
  },
  {
    title: "Resilient UI",
    type: "Interview",
    url: "https://www.resilient-ui.com/interviews/hayden-bleasel",
    year: 2025,
  },
  {
    title: "NextDev.fm",
    type: "Interview",
    url: "https://www.youtube.com/watch?v=kHny7Y-HZcc",
    year: 2025,
  },
  {
    title: "Lovers Magazine",
    type: "Interview",
    url: "https://spaces.is/loversmagazine/interviews/hayden-bleasel",
    year: 2024,
  },
  {
    title: "Ducks in a Row by Lookahead",
    type: "Interview",
    url: "https://createsend.com/t/t-995C46D3D8BF87EC2540EF23F30FEDED",
    year: 2024,
  },
  {
    title: "WDX Sydney",
    type: "Speaking",
    url: "https://www.wdx.design/wdx23-conference",
    year: 2023,
  },
  {
    title: "Balancing the Grind",
    type: "Interview",
    url: "https://balancethegrind.co/interviews/hayden-bleasel-director-of-jellypepper/",
    year: 2020,
  },
  {
    title: "Workflow",
    type: "Interview",
    url: "https://balancethegrind.co/workflow/workflow-with-hayden-bleasel-director-of-jellypepper/",
    year: 2020,
  },
  {
    title: "Sydney Views, ICC 2016",
    type: "Interview",
    url: "https://iccsydney.com.au/wp-content/uploads/2023/05/160909_Sydney-Views_Edition-3_FINAL.pdf",
    year: 2016,
  },
  {
    title: "Startup Daily",
    type: "Interview",
    url: "https://www.startupdaily.net/advice/sydney-startup-presumi-helps-job-seekers-see-employers-interact-resume/",
    year: 2016,
  },
];

const getAppender = (type: SpeakingItem["type"]) => {
  switch (type) {
    case "Interview": {
      return "on";
    }
    case "Speaking": {
      return "at";
    }
    case "Judging": {
      return "for";
    }
    default: {
      return "on";
    }
  }
};

const SpeakingPage = () => (
  <>
    <PageHeader
      title="Speaking"
      description="Talks, interviews and judging I've done."
    />

    <PageBody>
      <section className="flex flex-col gap-2 rounded-2xl bg-sidebar p-2">
        <div className="px-4 pt-2 pb-1">
          <h2 className="text-sm font-medium text-muted-foreground">
            Appearances
          </h2>
        </div>
        <div className="grid gap-2 rounded-2xl bg-background p-2 shadow-sm/5">
          {speakingItems.map((item) => (
            <a
              key={item.title}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between gap-4 rounded-lg px-3 py-2 no-underline transition-colors hover:bg-accent"
            >
              <span className="min-w-0 truncate text-muted-foreground">
                {item.type} {getAppender(item.type)}{" "}
                <span className="font-medium text-foreground">
                  {item.title}
                </span>
              </span>
              <span className="shrink-0 text-sm text-muted-foreground tabular-nums">
                {item.year}
              </span>
            </a>
          ))}
        </div>
      </section>
    </PageBody>
  </>
);

export default SpeakingPage;
