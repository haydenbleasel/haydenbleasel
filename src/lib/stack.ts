export interface StackItem {
  category: string;
  description: string;
  name: string;
  url: string;
}

export const categories = [
  "Development",
  "Productivity",
  "Travel",
  "Personal",
] as const;

export const stack: StackItem[] = [
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
    description: "Pretty code snippet screenshots.",
    name: "Ray.so",
    url: "https://ray.so/",
  },
  {
    category: "Development",
    description: "Losslessly compress images.",
    name: "ImageOptim",
    url: "https://imageoptim.com/mac",
  },
  {
    category: "Productivity",
    description: "Your AI chatbot for everyday use.",
    name: "ChatGPT",
    url: "https://chatgpt.com/download/",
  },
  {
    category: "Productivity",
    description: "AI speech synthesis and voice cloning.",
    name: "ElevenLabs",
    url: "https://try.elevenlabs.io/5fxrqtrzwdfu",
  },
  {
    category: "Productivity",
    description: "The better way to schedule your meetings.",
    name: "Cal.com",
    url: "https://refer.cal.com/haydenbleasel",
  },
  {
    category: "Productivity",
    description: "Scheduling and analytics for X.",
    name: "Typefully",
    url: "https://typefully.com/?via=haydenbleasel",
  },
  {
    category: "Productivity",
    description: "A camera in your menu bar.",
    name: "Hand Mirror",
    url: "https://handmirror.app/",
  },
  {
    category: "Productivity",
    description: "Mechanical keystroke sounds.",
    name: "Klack",
    url: "https://tryklack.com/",
  },
  {
    category: "Travel",
    description: "Your ticket to stress-free flying.",
    name: "Flighty",
    url: "https://flighty.com/?via=haydenbleasel",
  },
  {
    category: "Travel",
    description: "Summon a self-driving car.",
    name: "Waymo",
    url: "https://waymo.smart.link/4pcoqniy5?code=HAYDEN5S6L",
  },
  {
    category: "Travel",
    description: "Premium Australian luggage.",
    name: "July",
    url: "https://go.shopmy.us/p-5598980",
  },
  {
    category: "Travel",
    description: "Low FX international transfers.",
    name: "Wise",
    url: "https://wise.com/invite/dic/haydenb95",
  },
  {
    category: "Personal",
    description: "Grow your wealth with automated investing.",
    name: "Wealthfront",
    url: "https://www.wealthfront.com/c/affiliates/invited/AFFA-NU3D-C5WC-2CWU",
  },
  {
    category: "Personal",
    description: "The next-generation digital clinic.",
    name: "Superpower",
    url: "https://superpower.com/welcome?via=hayden",
  },
  {
    category: "Personal",
    description: "Enjoy and curate the world's music.",
    name: "Spotify",
    url: "https://open.spotify.com/",
  },
  {
    category: "Personal",
    description: "Groceries delivered in minutes.",
    name: "Instacart",
    url: "https://inst.cr/t/9aea6b7f0",
  },
  {
    category: "Personal",
    description: "Food delivery and takeout.",
    name: "Doordash",
    url: "https://drd.sh/3tlNYpAjiQU9hq96",
  },
];
