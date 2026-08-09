export interface PressItem {
  // Whether the article itself names me. Articles that only cover a company
  // milestone must not claim Article.about person in the JSON-LD.
  mentionsMe: boolean;
  note: string;
  outlet: string;
  title: string;
  url: string;
  year: number;
}

export const press: PressItem[] = [
  {
    mentionsMe: true,
    note: "Write-up on migrating the Logixlysia docs to Blume, the documentation framework I created.",
    outlet: "PunGrumpy",
    title: "Docs are content again: moving Logixlysia from Fumadocs to Blume",
    url: "https://www.pungrumpy.com/blog/moving-logixlysia-from-fumadocs-to-blume",
    year: 2026,
  },
  {
    mentionsMe: false,
    note: "Coverage of Cellebrite's $170M acquisition of Corellium, where I was Chief Product Officer.",
    outlet: "TechCrunch",
    title:
      "Phone unlocking firm Cellebrite to acquire mobile testing startup Corellium for $170M",
    url: "https://techcrunch.com/2025/06/05/phone-unlocking-firm-cellebrite-to-acquire-mobile-testing-startup-corellium-for-170m/",
    year: 2025,
  },
  {
    mentionsMe: true,
    note: "Announcement of shadcnblocks acquiring Kibo UI, the component library I created.",
    outlet: "shadcnblocks",
    title: "Announcing the Kibo UI acquisition",
    url: "https://www.shadcnblocks.com/blog/announcing-kibo-ui-acquisition/",
    year: 2025,
  },
  {
    mentionsMe: false,
    note: "Coverage of eToro acquiring Spaceship, where I was Head of Product and Design.",
    outlet: "Australian Financial Review",
    title: "Cannon-Brookes-backed Spaceship acquired in $80m deal",
    url: "https://www.afr.com/technology/cannon-brookes-backed-spaceship-acquired-in-80m-deal-20240926-p5kdo9",
    year: 2024,
  },
  {
    mentionsMe: true,
    note: "The Node.js team on the website redesign I worked on, including a conversation about the design process.",
    outlet: "Node.js",
    title: "Diving into the Node.js Website Redesign",
    url: "https://nodejs.org/en/blog/announcements/diving-into-the-nodejs-website-redesign",
    year: 2024,
  },
  {
    mentionsMe: true,
    note: "Announcement of Raw Studio acquiring Jellypepper, the digital agency I founded.",
    outlet: "Raw Studio",
    title:
      "Raw Studio acquires Jellypepper to expand its reach to the startup ecosystem",
    url: "https://raw.studio/blog/raw-studio-acquires-jellypepper-to-expand-its-reach-to-the-startup-ecosystem/",
    year: 2023,
  },
  {
    mentionsMe: true,
    note: "Untitled UI lists me as a designer to follow in their guide to improving UI design skills.",
    outlet: "Untitled UI",
    title: "How to Improve Your UI Design Skills",
    url: "https://www.untitledui.com/blog/ui-design-skills#hayden-bleasel",
    year: 2023,
  },
  {
    mentionsMe: true,
    note: "Coverage of Timberland's TimbsTrails experience via R/GA Australia, crediting me as Senior Experience Designer.",
    outlet: "Campaign Brief",
    title:
      "Timberland launches new TimbsTrails immersive digital storytelling experience via R/GA Australia",
    url: "https://campaignbrief.com/timberland-launches-new-timbstrails-immersive-digital-storytelling-experience-via-r-ga-australia/",
    year: 2022,
  },
  {
    mentionsMe: true,
    note: "Profile of Presumi, the resume analytics product I created.",
    outlet: "Startup Daily",
    title:
      "Sydney startup Presumi helps job seekers see how employers interact with their resume",
    url: "https://www.startupdaily.net/advice/sydney-startup-presumi-helps-job-seekers-see-employers-interact-resume/",
    year: 2016,
  },
  {
    mentionsMe: true,
    note: "University of Technology Sydney profile on my early startup work.",
    outlet: "UTS Newsroom",
    title: "Hard Slog and Serendipity on the Path to Overnight Success",
    url: "https://www.uts.edu.au/news/2016/06/hard-slog-and-serendipity-path-overnight-success",
    year: 2016,
  },
  {
    mentionsMe: true,
    note: "Profile feature in Sydney Views, the magazine of the International Convention Centre Sydney.",
    outlet: "Sydney Views (ICC Sydney)",
    title: "Sydney Views — Edition 3",
    url: "https://iccsydney.com.au/wp-content/uploads/2023/05/160909_Sydney-Views_Edition-3_FINAL.pdf",
    year: 2016,
  },
];
