// Bump when the card design or copy changes so previews request fresh images.
const version = "4";

export const portraitImage = {
  alt: "Portrait of Hayden Bleasel",
  height: 1024,
  path: "/photo-1x1.jpg",
  type: "image/jpeg",
  width: 1024,
};

export const socialImageSlug = (path: string) =>
  path.replaceAll(/^\/+|\/+$/gu, "") || "home";

export const socialImage = (path: string) =>
  path === "/" || path === "/about"
    ? portraitImage
    : {
        alt: undefined,
        height: 630,
        path: `/og/${socialImageSlug(path)}.png?v=${version}`,
        type: "image/png",
        width: 1200,
      };

export const socialImagePath = (path: string) => socialImage(path).path;
