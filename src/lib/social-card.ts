import { container, image, text } from "takumi-js/helpers";

export interface SocialCard {
  date?: string;
  description: string;
  title: string;
}

const ink = "#171717";
const muted = "#767676";
const rule = "1px solid rgba(23, 23, 23, 0.12)";

const titleSize = (title: string) => {
  if (title.length > 55) {
    return 48;
  }

  if (title.length > 32) {
    return 52;
  }

  return 56;
};

// Rules extend through the 72px margins to the canvas edges. The original
// portrait fills its grid cell, with no additional mat or retouching.
export const socialCard = (page: SocialCard, portrait: string) =>
  container({
    children: [
      container({
        children: [
          container({
            children: [
              text("Hayden Bleasel", { fontSize: 24, fontWeight: 500 }),
              container({
                children: [
                  text(page.title, {
                    fontSize: titleSize(page.title),
                    fontWeight: 500,
                    letterSpacing: "-0.035em",
                    lineHeight: 1.12,
                    textWrap: "balance",
                  }),
                  text(page.description, {
                    color: muted,
                    fontSize: 22,
                    lineHeight: 1.4,
                    textWrap: "balance",
                  }),
                ],
                style: {
                  display: "flex",
                  flexDirection: "column",
                  gap: 24,
                  minWidth: 0,
                },
              }),
              container({
                children: [
                  text("haydenbleasel.com", { color: muted, fontSize: 20 }),
                  ...(page.date
                    ? [text(page.date, { color: muted, fontSize: 20 })]
                    : []),
                ],
                style: {
                  alignItems: "center",
                  display: "flex",
                  justifyContent: "space-between",
                },
              }),
            ],
            style: {
              display: "flex",
              flexDirection: "column",
              flexGrow: 1,
              justifyContent: "space-between",
              minWidth: 0,
              padding: 40,
            },
          }),
          image({
            src: portrait,
            style: {
              flexShrink: 0,
              height: "100%",
              objectFit: "cover",
              objectPosition: "50% 50%",
              width: 377,
            },
          }),
        ],
        style: {
          display: "flex",
          height: 486,
          width: 1056,
        },
      }),
      container({
        style: {
          borderTop: rule,
          left: 0,
          position: "absolute",
          top: 72,
          width: "100%",
        },
      }),
      container({
        style: {
          borderTop: rule,
          bottom: 72,
          left: 0,
          position: "absolute",
          width: "100%",
        },
      }),
      container({
        style: {
          borderLeft: rule,
          height: "100%",
          left: 72,
          position: "absolute",
          top: 0,
        },
      }),
      container({
        style: {
          borderLeft: rule,
          height: "100%",
          position: "absolute",
          right: 72,
          top: 0,
        },
      }),
    ],
    style: {
      backgroundColor: "#fafafa",
      color: ink,
      display: "flex",
      fontFamily: "Soehne",
      height: "100%",
      padding: 72,
      position: "relative",
      width: "100%",
    },
  });
