import type { Metadata } from "next";

import { PageHeader } from "@/components/page-header";

export const metadata: Metadata = {
  description: "The tools and services I use daily.",
  title: "Stack | OS1",
};

const stackItems = [
  {
    category: "AI",
    description: "Your AI chatbot for everyday use.",
    name: "ChatGPT",
    url: "https://chatgpt.com/",
  },
  {
    category: "AI",
    description: "Focused desktop app for agentic development.",
    name: "Codex App",
    url: "https://developers.openai.com/codex/app",
  },
  {
    category: "AI",
    description: "AI speech synthesis and voice cloning.",
    name: "ElevenLabs",
    url: "https://try.elevenlabs.io/5fxrqtrzwdfu",
  },
  {
    category: "AI",
    description: "The AI notepad for people in back-to-back meetings.",
    name: "Granola",
    url: "https://granola.ai/",
  },
  {
    category: "AI",
    description: "AI image generation.",
    name: "Midjourney",
    url: "https://www.midjourney.com/",
  },
  {
    category: "AI",
    description: "AI-powered, photo-realistic image generation.",
    name: "Visual Electric",
    url: "https://visualelectric.com/referral/590ee5a7-700f-4c53-8047-8893f7c9e176",
  },
  {
    category: "Development",
    description: "The AI code editor.",
    name: "Cursor",
    url: "https://www.cursor.com/",
  },
  {
    category: "Development",
    description: "Claude in your terminal.",
    name: "Claude Code",
    url: "https://www.claude.com/product/claude-code",
  },
  {
    category: "Development",
    description: "A modern, Rust-based terminal.",
    name: "Warp",
    url: "https://app.warp.dev/referral/24YEQY",
  },
  {
    category: "Development",
    description: "Simple repository management.",
    name: "GitHub Desktop",
    url: "https://github.com/apps/desktop",
  },
  {
    category: "Development",
    description: ".local development, simplified.",
    name: "LocalCan",
    url: "https://www.localcan.com?aff=VMdMv",
  },
  {
    category: "Development",
    description: "Build and test APIs.",
    name: "Postman",
    url: "https://www.postman.com/",
  },
  {
    category: "Development",
    description: "Simple compute, storage, and networking.",
    name: "DigitalOcean",
    url: "https://m.do.co/c/be5c7246ae8b",
  },
  {
    category: "Design",
    description: "Collaborative interface design tool.",
    name: "Figma",
    url: "https://www.figma.com/",
  },
  {
    category: "Design",
    description: "The ultimate UI Kit for Figma.",
    name: "Untitled UI",
    url: "https://store.untitledui.com?aff=VMdMv",
  },
  {
    category: "Design",
    description: "Losslessly compress images.",
    name: "ImageOptim",
    url: "https://imageoptim.com/mac",
  },
  {
    category: "Design",
    description: "Free, high-quality photos.",
    name: "Unsplash",
    url: "https://unsplash.com/",
  },
  {
    category: "Design",
    description: "Premium mockups.",
    name: "LS Graphics",
    url: "https://www.ls.graphics/",
  },
  {
    category: "Design",
    description: "Pretty code snippet screenshots.",
    name: "Ray.so",
    url: "https://ray.so/",
  },
  {
    category: "Productivity",
    description: "The better way to schedule your meetings.",
    name: "Cal.com",
    url: "https://refer.cal.com/haydenbleasel",
  },
  {
    category: "Productivity",
    description: "Where customer knowledge lives.",
    name: "Dovetail",
    url: "https://dovetailapp.com/",
  },
  {
    category: "Productivity",
    description: "The interpersonal CRM.",
    name: "Clay",
    url: "https://clay.earth/invite/hello115",
  },
  {
    category: "Productivity",
    description: "A camera in your menu bar.",
    name: "Hand Mirror",
    url: "https://handmirror.app/",
  },
  {
    category: "Productivity",
    description: "Fast, reliable email delivery.",
    name: "Postmark",
    url: "https://www.postmarkapp.com?via=8240a3",
  },
  {
    category: "Productivity",
    description: "Your ticket to stress-free flying.",
    name: "Flighty",
    url: "https://flighty.com/?via=haydenbleasel",
  },
  {
    category: "Marketing",
    description: "Scheduling and analytics for X.",
    name: "Typefully",
    url: "https://typefully.com/?via=haydenbleasel",
  },
  {
    category: "Marketing",
    description: "Simple scheduling for Instagram.",
    name: "Buffer",
    url: "https://buffer.com/join/821e9d12d4f4c3bda42d6ee6d328e9a937032f6a760f16aa5dae6b37ee60ef6b",
  },
  {
    category: "Finance",
    description: "Grow your wealth with automated investing.",
    name: "Wealthfront",
    url: "https://www.wealthfront.com/c/affiliates/invited/AFFA-NU3D-C5WC-2CWU",
  },
  {
    category: "Finance",
    description: "Simple banking for U.S. startups.",
    name: "Mercury",
    url: "https://mercury.com/",
  },
  {
    category: "Finance",
    description: "Low FX international transfers.",
    name: "Wise",
    url: "https://wise.com/invite/dic/haydenb95",
  },
  {
    category: "Finance",
    description: "Commission-free stock trading.",
    name: "Robinhood",
    url: "https://join.robinhood.com/haydenb-e0f142",
  },
  {
    category: "Finance",
    description: "Redeem daily rewards on Amazon.",
    name: "Amazon Prime Visa",
    url: "https://www.amazon.com/dp/BT00LN946S?externalReferenceId=2b2e7144-1a4e-4475-afb1-03214dac74c1",
  },
  {
    category: "Finance",
    description: "Trade U.S. stocks from Australia.",
    name: "Stake",
    url: "https://hellostake.com/",
  },
  {
    category: "Finance",
    description: "File your U.S. taxes with ease.",
    name: "Intuit TurboTax",
    url: "https://refer.intuit.com/f2a4w",
  },
  {
    category: "Other",
    description: "Summon a self-driving car.",
    name: "Waymo",
    url: "https://waymo.smart.link/4pcoqniy5?code=HAYDEN5S6L",
  },
  {
    category: "Other",
    description: "Premium Australian luggage.",
    name: "July",
    url: "https://go.shopmy.us/p-5598980",
  },
  {
    category: "Other",
    description: "The next-generation digital clinic.",
    name: "Superpower",
    url: "https://superpower.com/welcome?via=hayden",
  },
  {
    category: "Other",
    description: "Enjoy and curate the world's music.",
    name: "Spotify",
    url: "https://open.spotify.com/",
  },
  {
    category: "Other",
    description: "Mechanical keystroke sounds.",
    name: "Klack",
    url: "https://tryklack.com/",
  },
  {
    category: "Other",
    description: "Groceries delivered in minutes.",
    name: "Instacart",
    url: "https://inst.cr/t/9aea6b7f0",
  },
  {
    category: "Other",
    description: "Food delivery and takeout.",
    name: "Doordash",
    url: "https://drd.sh/3tlNYpAjiQU9hq96",
  },
  {
    category: "Other",
    description: "Food and grocery delivery, powered by Uber.",
    name: "Uber EATS",
    url: "https://ubereats.com/feed?promoCode=eats-haydenb85",
  },
];

const categories = [
  "AI",
  "Development",
  "Design",
  "Productivity",
  "Marketing",
  "Finance",
  "Other",
] as const;

const StackPage = () => (
  <div className="flex flex-col gap-8">
    <PageHeader
      title="Stack"
      description="The tools and services I use daily."
    />

    {categories.map((category) => {
      const items = stackItems.filter((item) => item.category === category);
      if (items.length === 0) {
        return null;
      }

      return (
        <section
          key={category}
          className="flex flex-col gap-2 bg-sidebar rounded-2xl p-2"
        >
          <div className="pt-2 pb-1 px-4">
            <h2 className="text-sm font-medium text-muted-foreground">
              {category}
            </h2>
          </div>
          <div className="grid gap-2 bg-background shadow-sm/5 rounded-2xl p-2">
            {items.map((item) => (
              <a
                className="group flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 rounded-lg px-3 py-2 no-underline transition-colors hover:bg-accent"
                href={item.url}
                key={item.name}
                rel="noopener noreferrer"
                target="_blank"
              >
                <p className="font-medium text-foreground">{item.name}</p>
                <p className="text-sm text-muted-foreground">
                  {item.description}
                </p>
              </a>
            ))}
          </div>
        </section>
      );
    })}
  </div>
);

export default StackPage;
