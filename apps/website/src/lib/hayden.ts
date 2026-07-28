import { defineLifeline } from "./lifeline/define";

/**
 * Sourced from the os1 work/projects pages and the public facts in the
 * dossier — work, projects, education, awards, and talks only.
 *
 * Extras the renderer already supports:
 * - `companies`: ids with a mark in company-icon.astro (openai, vercel,
 *   palantir, corellium, jellypepper) render the logo; anything else
 *   falls back to an initial in a ring.
 * - `mentors` / `met`: people rows with photos (or initials) and the
 *   blue/pink legend dots.
 * - Events can be plain strings or segment arrays with links, as below.
 */
const record = defineLifeline({
  birthYear: 1993,
  description:
    "The life and career of Hayden Bleasel — from Sydney to San Francisco.",
  milestones: {
    1993: {
      events: ["I was born in Sydney, Australia."],
      id: "born",
    },
    2000: {
      events: ["Started primary school."],
      id: "primary-school",
    },
    2006: {
      events: ["Started high school."],
      id: "high-school",
    },
    2012: {
      events: [
        "Started a double degree at the University of Technology Sydney — business and information technology.",
      ],
      id: "university",
    },
    2015: {
      companies: [{ id: "palantir", name: "Palantir" }],
      events: ["Interned at Palantir as a Product Designer in Palo Alto, CA."],
      id: "palantir",
    },
    2016: {
      events: [
        "Graduated from UTS.",
        [
          { type: "text", value: "Launched " },
          {
            href: "https://www.producthunt.com/products/presumi-beta/launches/presumi-beta",
            type: "link",
            value: "Presumi",
          },
          {
            type: "text",
            value:
              ", my first product — #4 Product of the Day on Product Hunt.",
          },
        ],
        [
          {
            type: "text",
            value: "Joined Spaceship as Head of Product and Design (later ",
          },
          {
            href: "https://www.afr.com/technology/cannon-brookes-backed-spaceship-acquired-in-80m-deal-20240926-p5kdo9",
            type: "link",
            value: "acquired by eToro",
          },
          { type: "text", value: ")." },
        ],
      ],
      id: "spaceship",
    },
    2017: {
      companies: [{ id: "jellypepper", name: "Jellypepper" }],
      events: [
        "Founded Jellypepper, a digital agency for startups in self-driving cars, AI, biotech, crypto, drone delivery, cybersecurity and orbital logistics.",
        "Visited Reno.",
      ],
      id: "jellypepper",
    },
    2018: {
      events: ["Visited Brisbane."],
      id: "brisbane",
    },
    2019: {
      events: ["Visited Melbourne."],
      id: "melbourne",
    },
    2021: {
      companies: [{ id: "corellium", name: "Corellium" }],
      events: [
        "Joined Corellium as Chief Product Officer — started the frontend engineering team, then led Product, Design and Support.",
      ],
      id: "corellium",
    },
    2022: {
      events: [
        "Moved to Delray Beach, FL.",
        [
          { type: "text", value: "Rebranded " },
          {
            href: "https://eslint.org/blog/2022/08/redesigning-eslint/",
            type: "link",
            value: "ESLint",
          },
          {
            type: "text",
            value: " — new identity, website, docs and playground.",
          },
        ],
        [
          { type: "text", value: "Created " },
          {
            href: "https://www.ultracite.ai",
            type: "link",
            value: "Ultracite",
          },
          {
            type: "text",
            value: ", a zero-config linter and formatter preset.",
          },
        ],
        "Visited Las Vegas.",
      ],
      id: "eslint",
    },
    2023: {
      events: [
        [
          { type: "text", value: "Jellypepper was " },
          {
            href: "https://raw.studio/blog/raw-studio-acquires-jellypepper-to-expand-its-reach-to-the-startup-ecosystem/",
            type: "link",
            value: "acquired by Raw Studio",
          },
          { type: "text", value: "." },
        ],
        [
          { type: "text", value: "Sold " },
          {
            href: "https://x.com/haydenbleasel/status/1678770475647012864",
            type: "link",
            value: "Refraction",
          },
          {
            type: "text",
            value: ", my AI code-generation tool, to Twistag.",
          },
        ],
        [
          { type: "text", value: "Designed the new " },
          {
            href: "https://nodejs.org/en/blog/announcements/diving-into-the-nodejs-website-redesign",
            type: "link",
            value: "Node.js website",
          },
          { type: "text", value: " for the OpenJS Foundation." },
        ],
        [
          { type: "text", value: "Spoke at " },
          {
            href: "https://www.wdx.design/wdx23-conference",
            type: "link",
            value: "WDX'23",
          },
          {
            type: "text",
            value: " in Sydney on shipping products at lightspeed.",
          },
        ],
        "Visited Sydney, New York, the Bahamas, Colorado and Boston.",
      ],
      id: "acquisitions",
    },
    2024: {
      events: [
        [
          { type: "text", value: "Created " },
          {
            href: "https://www.next-forge.com/",
            type: "link",
            value: "next-forge",
          },
          {
            type: "text",
            value: ", a production-grade Turborepo template for Next.js.",
          },
        ],
        "Visited Minnesota, South Dakota, New York, South Korea, Texas, Bali, Sydney, Las Vegas and Germany.",
      ],
      id: "next-forge",
    },
    2025: {
      companies: [{ id: "vercel", name: "Vercel" }],
      events: [
        [
          {
            type: "text",
            value: "Joined Vercel's DX team. next-forge ",
          },
          {
            href: "https://x.com/haydenbleasel/status/1929625673586598148",
            type: "link",
            value: "acquired",
          },
          { type: "text", value: " and " },
          {
            href: "https://x.com/haydenbleasel/status/1931033287851675688",
            type: "link",
            value: "donated",
          },
          { type: "text", value: " Orate." },
        ],
        "Moved to San Francisco, CA.",
        [
          { type: "text", value: "Created " },
          {
            href: "https://streamdown.ai/",
            type: "link",
            value: "Streamdown",
          },
          { type: "text", value: ", " },
          {
            href: "https://elements.ai-sdk.dev/",
            type: "link",
            value: "AI Elements",
          },
          { type: "text", value: ", " },
          {
            href: "https://github.com/vercel-labs/tersa",
            type: "link",
            value: "Tersa",
          },
          { type: "text", value: ", " },
          {
            href: "https://github.com/vercel-labs/openreview",
            type: "link",
            value: "OpenReview",
          },
          { type: "text", value: ", " },
          {
            href: "https://github.com/vercel-labs/vectr",
            type: "link",
            value: "Vectr",
          },
          { type: "text", value: ", " },
          {
            href: "https://www.components.build/",
            type: "link",
            value: "components.build",
          },
          { type: "text", value: " and " },
          {
            href: "https://www.npmjs.com/package/remend",
            type: "link",
            value: "Remend",
          },
          { type: "text", value: ". Helped launch " },
          {
            href: "https://chat-sdk.dev/",
            type: "link",
            value: "Chat SDK",
          },
          { type: "text", value: "." },
        ],
        [
          { type: "text", value: "Corellium " },
          {
            href: "https://techcrunch.com/2025/06/05/phone-unlocking-firm-cellebrite-to-acquire-mobile-testing-startup-corellium-for-170m/",
            type: "link",
            value: "acquired",
          },
          { type: "text", value: " for $170M." },
        ],
        [
          { type: "text", value: "Created Kibo UI, " },
          {
            href: "https://www.shadcnblocks.com/blog/announcing-kibo-ui-acquisition/",
            type: "link",
            value: "acquired",
          },
          { type: "text", value: " by shadcnblocks." },
        ],
        "Visited Sydney, Alaska and Texas.",
      ],
      id: "vercel",
    },
    2026: {
      companies: [{ id: "openai", name: "OpenAI" }],
      events: [
        "Joined OpenAI as a Member of Technical Staff.",
        [
          { type: "text", value: "Launched " },
          {
            href: "https://github.com/haydenbleasel/blume",
            type: "link",
            value: "Blume",
          },
          { type: "text", value: " (a docs framework) and " },
          {
            href: "https://files-sdk.dev",
            type: "link",
            value: "Files SDK",
          },
          { type: "text", value: " (a unified storage SDK)." },
        ],
        [
          {
            type: "text",
            value: "Ghost, my dedicated game server project, hit ",
          },
          {
            href: "https://www.producthunt.com/products/ghost-8",
            type: "link",
            value: "#1 Product of the Day",
          },
          { type: "text", value: " on Product Hunt." },
        ],
        "Visited New York and Alaska.",
      ],
      id: "openai",
    },
  },
  name: "Hayden Bleasel",
  slug: "hayden",
});

export const haydenLifeline = record;
