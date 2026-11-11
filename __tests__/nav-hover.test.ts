import { describe, expect, test } from "bun:test";

import { initNavHover } from "../src/lib/nav-hover";
import {
  query,
  setRect,
  stubAnimations,
  stubFonts,
  stubMatchMedia,
  stubResizeObserver,
  useDom,
} from "./support/dom";

useDom();

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";
const HOVER = "(hover: hover) and (pointer: fine)";

// The parts of site-nav.astro the script reads, in nav order. The nav spans
// 100–500px and each link is 80px wide, 100px apart.
const LINKS = ["about", "writing", "speaking"] as const;

const setup = ({
  current = "writing",
  reducedMotion = false,
}: { current?: string; reducedMotion?: boolean } = {}) => {
  document.body.innerHTML = `
    <button id="outside">Outside</button>
    <nav class="site-nav">
      <span class="site-nav-hover"></span>
      ${LINKS.map(
        (id) =>
          `<a href="/${id}" id="${id}"${id === current ? ' aria-current="page"' : ""}>${id}</a>`
      ).join("")}
    </nav>
  `;
  const nav = query(".site-nav");
  setRect(nav, { height: 40, left: 100, top: 0, width: 400 });
  const links = Object.fromEntries(
    LINKS.map((id, index) => {
      const link = query<HTMLAnchorElement>(`#${id}`);
      setRect(link, { height: 40, left: 100 + index * 100, top: 0, width: 80 });
      return [id, link];
    })
  ) as Record<(typeof LINKS)[number], HTMLAnchorElement>;
  return {
    animations: stubAnimations(),
    highlight: query(".site-nav-hover"),
    links,
    loadFonts: stubFonts(),
    media: stubMatchMedia({ [HOVER]: true, [REDUCED_MOTION]: reducedMotion }),
    nav,
    resize: stubResizeObserver(),
  };
};

// The clip-path that frames the link at that index (see setup).
const clip = (index: number) =>
  `inset(0 ${400 - index * 100 - 80}px 0 ${index * 100}px round 999px)`;

const hover = (target: Element, pointerType = "mouse") =>
  target.dispatchEvent(
    new PointerEvent("pointermove", { bubbles: true, pointerType })
  );

describe("nav hover highlight", () => {
  test("does nothing without the nav", async () => {
    document.body.innerHTML = '<nav class="site-nav"></nav>';

    await initNavHover();

    expect(query(".site-nav").dataset.enhanced).toBeUndefined();
  });

  test("starts on the current page without animating, then re-measures once fonts load", async () => {
    const { animations, highlight, links, loadFonts, nav } = setup();

    const ready = initNavHover();

    expect(nav.dataset.enhanced).toBe("true");
    expect(highlight.dataset.visible).toBe("true");
    expect(highlight.style.clipPath).toBe(clip(1));

    setRect(links.writing, { height: 40, left: 110, top: 0, width: 80 });
    loadFonts();
    await ready;

    expect(highlight.style.clipPath).toBe("inset(0 310px 0 10px round 999px)");
    expect(animations).toHaveLength(0);
  });

  test("slides between hovered links and back to the current page", async () => {
    const { animations, highlight, links, loadFonts, nav } = setup();
    loadFonts();
    await initNavHover();

    hover(links.about);
    expect(highlight.style.clipPath).toBe(clip(0));
    expect(animations).toHaveLength(1);
    expect(animations[0].keyframes.at(-1)).toEqual({ clipPath: clip(0) });
    expect(animations[0].options).toMatchObject({ duration: 180 });

    // Moving within the same link, or over the gaps between links, does nothing.
    hover(links.about);
    hover(nav);
    expect(animations).toHaveLength(1);

    nav.dispatchEvent(new PointerEvent("pointerleave"));
    expect(highlight.style.clipPath).toBe(clip(1));
    expect(animations).toHaveLength(2);
    expect(animations[0].cancel).toHaveBeenCalled();
  });

  test("ignores touch and pointers that can't hover", async () => {
    const { highlight, links, loadFonts, media } = setup();
    loadFonts();
    await initNavHover();

    hover(links.about, "touch");
    expect(highlight.style.clipPath).toBe(clip(1));

    media[HOVER].change(false);
    hover(links.about);
    expect(highlight.style.clipPath).toBe(clip(1));
  });

  test("moves without animating under reduced motion", async () => {
    const { animations, highlight, links, loadFonts } = setup({
      reducedMotion: true,
    });
    loadFonts();
    await initNavHover();

    hover(links.about);

    expect(highlight.style.clipPath).toBe(clip(0));
    expect(animations).toHaveLength(0);
  });

  test("cancels a running slide when reduced motion turns on", async () => {
    const { animations, links, loadFonts, media } = setup();
    loadFonts();
    await initNavHover();

    hover(links.about);
    media[REDUCED_MOTION].change(true);

    expect(animations[0].cancel).toHaveBeenCalled();
  });

  test("follows keyboard focus, and returns to the current page when focus leaves", async () => {
    const { animations, highlight, links, loadFonts, nav } = setup();
    loadFonts();
    await initNavHover();

    links.speaking.focus();
    expect(highlight.style.clipPath).toBe(clip(2));

    // A key press settles on the focused link rather than the hovered one.
    hover(links.about);
    nav.dispatchEvent(new KeyboardEvent("keydown", { bubbles: true }));
    expect(highlight.style.clipPath).toBe(clip(2));

    // Focus moving between links stays put until the next focus lands.
    links.speaking.dispatchEvent(
      new FocusEvent("focusout", { bubbles: true, relatedTarget: links.about })
    );
    expect(highlight.style.clipPath).toBe(clip(2));

    query("#outside").focus();
    expect(highlight.style.clipPath).toBe(clip(1));
    expect(animations.filter((a) => a.keyframes.length > 0)).toHaveLength(1);
  });

  test("ignores focus that isn't keyboard focus", async () => {
    const { highlight, links, loadFonts } = setup();
    loadFonts();
    await initNavHover();

    links.about.dispatchEvent(new FocusEvent("focusin", { bubbles: true }));

    expect(highlight.style.clipPath).toBe(clip(1));
  });

  test("hides when the pointer leaves a nav with no current page", async () => {
    const { highlight, links, loadFonts, nav } = setup({ current: "none" });
    loadFonts();
    await initNavHover();
    expect(highlight.dataset.visible).toBeUndefined();

    hover(links.about);
    expect(highlight.dataset.visible).toBe("true");

    nav.dispatchEvent(new PointerEvent("pointerleave"));
    expect(highlight.dataset.visible).toBeUndefined();
  });

  test("picks up a link that's already hovered when the script loads", async () => {
    const { highlight, links, loadFonts, nav } = setup({ current: "none" });
    loadFonts();
    // happy-dom doesn't track :hover, so report the link a real browser would.
    const select = nav.querySelector.bind(nav);
    nav.querySelector = ((selector: string) =>
      selector === "a:hover"
        ? links.speaking
        : select(selector)) as typeof nav.querySelector;

    await initNavHover();

    expect(highlight.style.clipPath).toBe(clip(2));
  });

  test("re-measures on resize and when hover support changes", async () => {
    const { highlight, links, loadFonts, media, resize } = setup();
    loadFonts();
    await initNavHover();

    setRect(links.writing, { height: 40, left: 120, top: 0, width: 80 });
    resize();
    expect(highlight.style.clipPath).toBe("inset(0 300px 0 20px round 999px)");

    // Losing hover support (say, a mouse unplugged) drops back to the current page.
    hover(links.about);
    media[HOVER].change(false);
    expect(highlight.style.clipPath).toBe("inset(0 300px 0 20px round 999px)");
  });

  test("a resize with nothing highlighted does nothing", async () => {
    const { highlight, loadFonts, resize } = setup({ current: "none" });
    loadFonts();
    await initNavHover();

    resize();

    expect(highlight.dataset.visible).toBeUndefined();
    expect(highlight.style.clipPath).toBe("");
  });
});
