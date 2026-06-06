import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@haydenbleasel/design-system/components/ui/tabs";
import type { Metadata } from "next";

import { PageBody, PageHeader } from "@/components/page-header";

export const metadata: Metadata = {
  description: "Talks, interviews, judging and writing I've done.",
  title: "Appearances | OS1",
};

interface AppearanceItem {
  title: string;
  url?: string;
  year: number;
  type: "Interview" | "Speaking" | "Judging" | "Writing";
  additionalLinks?: { label: string; url: string }[];
}

const appearanceItems: AppearanceItem[] = [
  {
    title: "A Brief Look at the New Corellium",
    type: "Writing",
    url: "https://www.corellium.com/blog/a-brief-look-at-the-new-corellium",
    year: 2023,
  },
  {
    title: "Redesigning ESLint",
    type: "Writing",
    url: "https://eslint.org/blog/2022/08/redesigning-eslint/",
    year: 2022,
  },
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
    title: "Diving into the Node.js Website Redesign",
    type: "Interview",
    url: "https://nodejs.org/en/blog/announcements/diving-into-the-nodejs-website-redesign",
    year: 2024,
  },
  {
    title: "How to Improve Your UI Design Skills by Untitled UI",
    type: "Interview",
    url: "https://www.untitledui.com/blog/ui-design-skills#hayden-bleasel",
    year: 2023,
  },
  {
    title: "How Creative Agencies Can Use Analytics to Prove Success",
    type: "Interview",
    url: "https://jellypepper.com/blog/how-creative-agencies-can-use-analytics-to-prove-su",
    year: 2023,
  },
  {
    title: "Timberland TimbsTrails via R/GA Australia",
    type: "Interview",
    url: "https://campaignbrief.com/timberland-launches-new-timbstrails-immersive-digital-",
    year: 2022,
  },
  {
    title: "WDX Sydney",
    type: "Speaking",
    url: "https://www.wdx.design/wdx23-conference",
    year: 2023,
  },
  {
    title:
      "How To Break into the UX/UI Design Industry (Panel) at UTS Careers Panel",
    type: "Speaking",
    url: "https://www.linkedin.com/feed/update/urn:li:activity:6848867048190296064/",
    year: 2021,
  },
  {
    title: "Xero Roadshow Breakfast Panel Session at Xero",
    type: "Speaking",
    url: "https://x.com/haydenbleasel/status/1225231600058679296",
    year: 2020,
  },
  {
    title: "Using Gatsby Inside of a Digital Agency at Gatsby Arvos",
    type: "Speaking",
    url: "https://x.com/PooleyAllan/status/1189674966125436928",
    year: 2019,
  },
  {
    title: "Branding for Disruptive Startups at Sydney UX/UI Meetup",
    type: "Speaking",
    url: "https://www.meetup.com/en-AU/Sydney-UX-UI-Meetup/events/266629688/",
    year: 2019,
  },
  {
    title: "Branding for Disruptive Startups at Sydney Designers",
    type: "Speaking",
    url: "https://www.meetup.com/en-AU/sydney-designers/events/266880417/",
    year: 2019,
  },
  {
    title: "Branding Startups at UNSW 10x Accelerator",
    type: "Speaking",
    year: 2018,
  },
  {
    title:
      "Learning to unlearn: how to design for disruptive startups at Sydney Designers",
    type: "Speaking",
    url: "https://www.slideshare.net/slideshow/learning-to-unlearn-how-to-design-for-disruptive-startups/92165864",
    year: 2018,
  },
  {
    title: "Design stories behind our iconic startups at Sydney Designers",
    type: "Speaking",
    url: "https://www.meetup.com/en-AU/sydney-designers/events/253805856/",
    year: 2018,
  },
  {
    title: "Building Products at UTS Tech Thursdays",
    type: "Speaking",
    url: "https://www.slideshare.net/slideshow/tech-thursdays-building-products/78362851",
    year: 2017,
  },
  {
    title: "Product, Growth and Raising Funds at Hatchery Masterclass",
    type: "Speaking",
    url: "https://www.slideshare.net/HaydenBleasel/hatchery-masterclass-with-spaceship",
    year: 2017,
  },
  {
    title: "Designing for Growth",
    type: "Speaking",
    url: "https://www.slideshare.net/slideshow/designing-for-growth-academy-xi/78362740",
    year: 2017,
  },
  {
    title:
      "Designing Products for the World's Biggest Tech Companies at AcademyXi Panel",
    type: "Speaking",
    year: 2017,
  },
  {
    title: "Talks at Spaceship (Host) at Spaceship x Sydney Designers Meetup",
    type: "Speaking",
    url: "https://www.meetup.com/en-AU/sydney-designers/events/240356226/",
    year: 2017,
  },
  {
    title: "Spaceship Panel at Lean Startup Sydney",
    type: "Speaking",
    year: 2016,
  },
  {
    title: "UTS Start-up / Entrepreneur Insight Event",
    type: "Speaking",
    year: 2016,
  },
  {
    title: "Code Quality",
    type: "Speaking",
    url: "https://www.slideshare.net/slideshow/how-to-write-good-quality-code/78362973",
    year: 2016,
  },
  {
    title: "STEM Panel",
    type: "Speaking",
    year: 2015,
  },
  {
    title: "Scalable front-end architecture with Atomic CSS",
    type: "Speaking",
    url: "https://www.slideshare.net/slideshow/scalable-frontend-architecture-with-bootstrap-3-atomic-css/78362762",
    year: 2015,
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
    title: "Hard Slog and Serendipity on the Path to Overnight Success",
    type: "Interview",
    url: "https://www.uts.edu.au/news/2016/06/hard-slog-and-serendipity-path-overnight-success",
    year: 2016,
  },
  {
    title: "Startup Daily",
    type: "Interview",
    url: "https://www.startupdaily.net/advice/sydney-startup-presumi-helps-job-seekers-see-employers-interact-resume/",
    year: 2016,
  },
];

const AppearanceList = ({ items }: { items: AppearanceItem[] }) => (
  <div className="-ml-3 -mt-2 grid gap-2">
    {items.map((item) => {
      const content = (
        <>
          <span className="min-w-0 truncate font-medium text-foreground">
            {item.title}
          </span>
          <span className="shrink-0 text-sm text-muted-foreground tabular-nums">
            {item.year}
          </span>
        </>
      );

      if (!item.url) {
        return (
          <div
            key={item.title}
            className="flex items-center justify-between gap-4 rounded-lg px-3 py-2"
          >
            {content}
          </div>
        );
      }

      return (
        <a
          key={item.title}
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center justify-between gap-4 rounded-lg px-3 py-2 no-underline transition-colors hover:bg-accent"
        >
          {content}
        </a>
      );
    })}
  </div>
);

const AppearancesPage = () => {
  const speakingItems = appearanceItems.filter(
    (item) => item.type === "Speaking"
  );
  const interviewItems = appearanceItems.filter(
    (item) => item.type === "Interview"
  );
  const judgingItems = appearanceItems.filter(
    (item) => item.type === "Judging"
  );
  const writingItems = appearanceItems.filter(
    (item) => item.type === "Writing"
  );

  return (
    <Tabs defaultValue="speaking">
      <PageHeader title="Appearances" withTabs>
        <TabsList className="gap-4" variant="line">
          <TabsTrigger className="flex-none px-0 font-normal" value="speaking">
            Speaking
          </TabsTrigger>
          <TabsTrigger className="flex-none px-0 font-normal" value="interview">
            Interview
          </TabsTrigger>
          <TabsTrigger className="flex-none px-0 font-normal" value="judging">
            Judging
          </TabsTrigger>
          <TabsTrigger className="flex-none px-0 font-normal" value="writing">
            Writing
          </TabsTrigger>
        </TabsList>
      </PageHeader>

      <PageBody>
        <TabsContent value="speaking">
          <AppearanceList items={speakingItems} />
        </TabsContent>

        <TabsContent value="interview">
          <AppearanceList items={interviewItems} />
        </TabsContent>

        <TabsContent value="judging">
          <AppearanceList items={judgingItems} />
        </TabsContent>

        <TabsContent value="writing">
          <AppearanceList items={writingItems} />
        </TabsContent>
      </PageBody>
    </Tabs>
  );
};

export default AppearancesPage;
