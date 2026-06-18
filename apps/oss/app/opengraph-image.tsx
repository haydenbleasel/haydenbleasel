import { ImageResponse } from "next/og";

export const alt = "Hayden Bleasel open source software";
export const contentType = "image/png";
export const size = {
  height: 630,
  width: 1200,
};

const OpengraphImage = () =>
  new ImageResponse(
    <div
      style={{
        alignItems: "center",
        backgroundColor: "#0a0a0a",
        backgroundImage:
          "radial-gradient(circle at 15% 18%, #10b981 0, transparent 28%), radial-gradient(circle at 54% 34%, #2dd4bf 0, transparent 30%), radial-gradient(circle at 82% 72%, #172554 0, transparent 36%), linear-gradient(115deg, #10b981 0%, #18181b 58%, #0a0a0a 100%)",
        color: "white",
        display: "flex",
        height: "100%",
        justifyContent: "center",
        padding: 72,
        width: "100%",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 28,
          width: "100%",
        }}
      >
        <div
          style={{
            color: "rgba(255,255,255,0.64)",
            fontFamily: "monospace",
            fontSize: 32,
            letterSpacing: 0,
          }}
        >
          haydenbleasel/oss
        </div>
        <div
          style={{
            fontSize: 86,
            fontWeight: 500,
            letterSpacing: 0,
            lineHeight: 1,
            maxWidth: 920,
          }}
        >
          Open source software updates
        </div>
        <div
          style={{
            color: "rgba(255,255,255,0.72)",
            fontSize: 34,
            lineHeight: 1.25,
            maxWidth: 860,
          }}
        >
          GitHub releases, repository stats, npm downloads, and former projects.
        </div>
      </div>
    </div>,
    size
  );

export default OpengraphImage;
