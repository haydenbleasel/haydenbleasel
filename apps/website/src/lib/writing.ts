export interface WritingItem {
  description: string;
  publisher: string;
  title: string;
  url: string;
  year: number;
}

export const writing: WritingItem[] = [
  {
    description:
      "A co-authored guide to designing and building composable component libraries.",
    publisher: "components.build",
    title: "components.build",
    url: "https://www.components.build/",
    year: 2025,
  },
  {
    description:
      "Introducing Corellium's redesigned platform, written while leading Product and Design as Chief Product Officer.",
    publisher: "Corellium",
    title: "A Brief Look at the New Corellium",
    url: "https://www.corellium.com/blog/a-brief-look-at-the-new-corellium",
    year: 2023,
  },
  {
    description:
      "The story behind ESLint's new brand identity, website, documentation and playground.",
    publisher: "ESLint",
    title: "Redesigning ESLint",
    url: "https://eslint.org/blog/2022/08/redesigning-eslint/",
    year: 2022,
  },
];
