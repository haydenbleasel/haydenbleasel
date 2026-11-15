import { portraitImage } from "./social-image";

// Identity URLs are permanent — keep them on the production origin so the
// @ids never change between environments.
export const identity = "https://haydenbleasel.com";

export const personId = `${identity}/#person`;

export const primaryPortrait = {
  "@id": `${identity}/#portrait`,
  "@type": "ImageObject",
  caption: portraitImage.alt,
  contentUrl: `${identity}${portraitImage.path}`,
  height: portraitImage.height,
  url: `${identity}${portraitImage.path}`,
  width: portraitImage.width,
};

/**
 * The canonical Person entity. Every page embeds this full object under the
 * same @id so crawlers resolve one consistent identity across the site.
 */
export const person = {
  "@id": personId,
  "@type": "Person",
  // Education and past employers, as on the About page.
  alternateName: "@haydenbleasel",
  alumniOf: [
    {
      "@type": "CollegeOrUniversity",
      name: "University of Technology Sydney",
      url: "https://www.uts.edu.au",
    },
    { "@type": "Organization", name: "Vercel", url: "https://vercel.com" },
    {
      "@type": "Organization",
      name: "Corellium",
      url: "https://www.corellium.com",
    },
    { "@type": "Organization", name: "R/GA", url: "https://rga.com" },
    { "@type": "Organization", name: "Jellypepper" },
    {
      "@type": "Organization",
      name: "Spaceship",
      url: "https://www.spaceship.com.au",
    },
    {
      "@type": "Organization",
      name: "Palantir",
      url: "https://www.palantir.com",
    },
  ],
  description:
    "Software engineer and product designer at OpenAI, originally from Sydney, Australia and now based in San Francisco, California.",
  familyName: "Bleasel",
  givenName: "Hayden",
  homeLocation: {
    "@type": "City",
    name: "San Francisco, California, United States",
  },
  image: [
    `${identity}/photo-1x1.jpg`,
    `${identity}/photo-4x3.jpg`,
    `${identity}/photo-16x9.jpg`,
  ],
  jobTitle: "Member of Technical Staff",
  knowsAbout: [
    "Software engineering",
    "Product design",
    "Developer tools",
    "Design systems",
    "Open source software",
  ],
  name: "Hayden Bleasel",
  nationality: { "@type": "Country", name: "Australia" },
  sameAs: [
    "https://x.com/haydenbleasel",
    "https://www.linkedin.com/in/haydenbleasel/",
    "https://github.com/haydenbleasel",
    "https://bsky.app/profile/haydenbleasel.com",
    "https://mastodon.social/@haydenbleasel",
    "https://dribbble.com/haydenbleasel",
    "https://dev.to/haydenbleasel",
    "https://www.youtube.com/@haydenbleasel1",
    "https://www.npmjs.com/~haydenbleasel",
    "https://www.figma.com/@haydenbleasel",
    "https://www.producthunt.com/@haydenbleasel",
  ],
  url: identity,
  worksFor: {
    "@id": "https://openai.com/#organization",
    "@type": "Organization",
    name: "OpenAI",
    url: "https://openai.com",
  },
};

/** Reference to the Person by @id, for nodes that shouldn't re-embed it. */
export const personRef = { "@id": personId };
