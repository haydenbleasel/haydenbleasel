// Identity URLs are permanent — keep them on the production origin so the
// @ids never change between environments.
export const identity = "https://haydenbleasel.com";

export const personId = `${identity}/#person`;

/**
 * The canonical Person entity. Every page embeds this full object under the
 * same @id so crawlers resolve one consistent identity across the site.
 */
export const person = {
  "@id": personId,
  "@type": "Person",
  alternateName: "@haydenbleasel",
  description:
    "Software engineer and product designer at OpenAI, originally from Sydney, Australia and now based in San Francisco, California.",
  familyName: "Bleasel",
  givenName: "Hayden",
  image: [
    `${identity}/photo-1x1.jpg`,
    `${identity}/photo-4x3.jpg`,
    `${identity}/photo-16x9.jpg`,
  ],
  jobTitle: "Member of Technical Staff",
  name: "Hayden Bleasel",
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
