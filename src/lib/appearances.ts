export interface Appearance {
  title: string;
  type: "Interview" | "Judging" | "Panel" | "Podcast" | "Talk";
  url?: string;
  year: number;
  // Optional for older appearances whose exact dates are unknown. Use ISO
  // timestamps with an offset and the event's IANA timezone for display.
  event?: {
    startDate: string;
    endDate: string;
    timeZone: string;
    location: string;
    description?: string;
    image?: string;
    video?: string;
  };
}

export const appearances: Appearance[] = [
  {
    // Schedule from Cerebral Valley's official event listing.
    event: {
      endDate: "2026-10-11T22:00:00-07:00",
      location: "San Francisco, CA",
      startDate: "2026-10-11T09:00:00-07:00",
      timeZone: "America/Los_Angeles",
      video: "https://cdn.cerebralvalley.ai/2026-10-05T22:36:59_158Z-upload",
    },
    title: "The Harness Engineering & Model Wrangling #SFTechWeek Hackathon",
    type: "Judging",
    url: "https://cerebralvalley.ai/e/mongodb-sftw-hackathon",
    year: 2026,
  },
  {
    // Dates and artwork from the organizer's linked Partiful event.
    event: {
      description:
        "A rooftop conversation with Sentry, Neon and Exa, followed by the Blue Angels over the Bay.",
      endDate: "2026-10-09T16:00:00-07:00",
      image: "/events/tech-week-flyover.jpg",
      location: "Kaiyō Rooftop, San Francisco",
      startDate: "2026-10-09T12:00:00-07:00",
      timeZone: "America/Los_Angeles",
    },
    title: "The Tech Week Flyover #SFTechWeek",
    type: "Panel",
    url: "https://partiful.com/e/yvoeWd6BJMUB12yutJLl",
    year: 2026,
  },
  {
    title: "The APP Funeral: Photon Dev Day",
    type: "Panel",
    url: "https://luma.com/ilzaamqb",
    year: 2026,
  },
  {
    title:
      "Open Source Agent Tools at the Resend DevTools Meetup, Y Combinator",
    type: "Talk",
    url: "https://www.youtube.com/watch?v=VQCNVpzrR5Q",
    year: 2026,
  },
  {
    title: "Ship & Secure at Vercel — lightning talk and panel",
    type: "Panel",
    url: "https://luma.com/oq93k631",
    year: 2026,
  },
  {
    title: "Shipping Products at Lightspeed at WDX '23, Sydney",
    type: "Talk",
    url: "https://www.wdx.design/wdx23-conference",
    year: 2023,
  },
  {
    title:
      "How To Break into the UX/UI Design Industry (Panel) at UTS Careers Panel",
    type: "Panel",
    url: "https://www.linkedin.com/feed/update/urn:li:activity:6848867048190296064/",
    year: 2021,
  },
  {
    title: "Xero Roadshow Breakfast Panel Session at Xero",
    type: "Panel",
    url: "https://x.com/haydenbleasel/status/1225231600058679296",
    year: 2020,
  },
  {
    title: "Using Gatsby Inside of a Digital Agency at Gatsby Arvos",
    type: "Talk",
    url: "https://x.com/PooleyAllan/status/1189674966125436928",
    year: 2019,
  },
  {
    title: "Branding for Disruptive Startups at Sydney UX/UI Meetup",
    type: "Talk",
    url: "https://www.meetup.com/en-AU/Sydney-UX-UI-Meetup/events/266629688/",
    year: 2019,
  },
  {
    title: "Branding for Disruptive Startups at Sydney Designers",
    type: "Talk",
    url: "https://www.meetup.com/en-AU/sydney-designers/events/266880417/",
    year: 2019,
  },
  {
    title: "Branding Startups at UNSW 10x Accelerator",
    type: "Talk",
    year: 2018,
  },
  {
    title:
      "Learning to unlearn: how to design for disruptive startups at Sydney Designers",
    type: "Talk",
    url: "https://www.slideshare.net/slideshow/learning-to-unlearn-how-to-design-for-disruptive-startups/92165864",
    year: 2018,
  },
  {
    title: "Design stories behind our iconic startups at Sydney Designers",
    type: "Panel",
    url: "https://www.meetup.com/en-AU/sydney-designers/events/253805856/",
    year: 2018,
  },
  {
    title: "Building Products at UTS Tech Thursdays",
    type: "Talk",
    url: "https://www.slideshare.net/slideshow/tech-thursdays-building-products/78362851",
    year: 2017,
  },
  {
    title: "Product, Growth and Raising Funds at Hatchery Masterclass",
    type: "Talk",
    url: "https://www.slideshare.net/HaydenBleasel/hatchery-masterclass-with-spaceship",
    year: 2017,
  },
  {
    title: "Designing for Growth at Academy Xi",
    type: "Talk",
    url: "https://www.slideshare.net/slideshow/designing-for-growth-academy-xi/78362740",
    year: 2017,
  },
  {
    title:
      "Designing Products for the World's Biggest Tech Companies at AcademyXi Panel",
    type: "Panel",
    year: 2017,
  },
  {
    title: "Talks at Spaceship (Host) at Spaceship x Sydney Designers Meetup",
    type: "Talk",
    url: "https://www.meetup.com/en-AU/sydney-designers/events/240356226/",
    year: 2017,
  },
  {
    title: "Spaceship Panel at Lean Startup Sydney",
    type: "Panel",
    year: 2016,
  },
  {
    title: "UTS Start-up / Entrepreneur Insight Event",
    type: "Panel",
    year: 2016,
  },
  {
    title: "Code Quality",
    type: "Talk",
    url: "https://www.slideshare.net/slideshow/how-to-write-good-quality-code/78362973",
    year: 2016,
  },
  {
    title: "STEM Panel",
    type: "Panel",
    year: 2015,
  },
  {
    title: "Scalable front-end architecture with Atomic CSS",
    type: "Talk",
    url: "https://www.slideshare.net/slideshow/scalable-frontend-architecture-with-bootstrap-3-atomic-css/78362762",
    year: 2015,
  },
  {
    title: "Hamed Bahram Podcast",
    type: "Podcast",
    url: "https://www.youtube.com/watch?v=hRzOnEe65u0",
    year: 2026,
  },
  {
    title: "NextDev.fm",
    type: "Podcast",
    url: "https://www.youtube.com/watch?v=kHny7Y-HZcc",
    year: 2025,
  },
  {
    title: "Resilient UI",
    type: "Interview",
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
    title: "How Creative Agencies Can Use Analytics to Prove Success",
    type: "Interview",
    year: 2023,
  },
  {
    title: "Balancing the Grind",
    type: "Interview",
    url: "https://balancethegrind.co/interviews/hayden-bleasel-director-of-jellypepper/",
    year: 2020,
  },
  {
    title: "Workflow by Balance the Grind",
    type: "Interview",
    url: "https://balancethegrind.co/workflow/workflow-with-hayden-bleasel-director-of-jellypepper/",
    year: 2020,
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
];
