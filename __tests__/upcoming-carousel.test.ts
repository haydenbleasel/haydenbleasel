import {
  afterEach,
  describe,
  expect,
  mock,
  setSystemTime,
  spyOn,
  test,
} from "bun:test";

import { initUpcomingCarousel } from "../src/lib/upcoming-carousel";
import {
  flush,
  query,
  stubMatchMedia,
  stubResizeObserver,
  useDom,
} from "./support/dom";

useDom();

afterEach(() => {
  setSystemTime();
});

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";
const COMPACT = "(max-width: 540px)";

// Three events in date order. Only the second has a video.
const EVENTS = [
  {
    end: "2026-10-09T23:00:00Z",
    id: "first",
    start: "2026-10-09T19:00:00Z",
  },
  {
    end: "2026-10-12T05:00:00Z",
    id: "second",
    start: "2026-10-11T16:00:00Z",
    video: true,
  },
  {
    end: "2026-10-20T20:00:00Z",
    id: "third",
    start: "2026-10-20T16:00:00Z",
  },
];

const VIDEO = `
  <video controls data-event-video></video>
  <button aria-label="Play event animation" data-video-toggle hidden>
    <span data-video-play></span>
    <span data-video-pause hidden></span>
  </button>
`;

// The parts of upcoming-appearances.astro the script reads. Cards sit 500px
// apart in the scrolling track.
const setup = ({
  compact = false,
  now = "2026-10-01T00:00:00Z",
  readyState = 0,
  reducedMotion = false,
}: {
  compact?: boolean;
  now?: string;
  readyState?: number;
  reducedMotion?: boolean;
} = {}) => {
  setSystemTime(new Date(now));
  document.body.innerHTML = `
    <section data-upcoming-events>
      <div data-event-controls hidden>
        <button data-event-previous type="button"></button>
        <span data-event-count></span>
        <button data-event-next type="button"></button>
      </div>
      <div data-event-track>
        ${EVENTS.map(
          (event) => `
            <article data-end="${event.end}" data-event-card data-start="${event.start}" id="${event.id}">
              <p><span data-event-status>Panel</span></p>
              <a href="https://example.com/${event.id}">View event</a>
              ${event.video ? VIDEO : ""}
            </article>
          `
        ).join("")}
      </div>
    </section>
  `;
  const cards = EVENTS.map(({ id }, index) => {
    const card = query(`#${id}`);
    Object.defineProperty(card, "offsetLeft", { value: index * 500 });
    return card;
  });
  const track = query("[data-event-track]");
  const scrollTo = mock((options: ScrollToOptions) => {
    track.scrollLeft = options.left ?? 0;
  });
  track.scrollTo = scrollTo as unknown as typeof track.scrollTo;
  const video = query<HTMLVideoElement>("video");
  Object.defineProperty(video, "readyState", { value: readyState });
  const ticks: (() => void)[] = [];
  spyOn(globalThis, "setInterval").mockImplementation(((onTick: () => void) => {
    ticks.push(onTick);
    return 0;
  }) as unknown as typeof setInterval);
  return {
    cards,
    controls: query("[data-event-controls]"),
    count: query("[data-event-count]"),
    media: stubMatchMedia({
      [COMPACT]: compact,
      [REDUCED_MOTION]: reducedMotion,
    }),
    next: query<HTMLButtonElement>("[data-event-next]"),
    previous: query<HTMLButtonElement>("[data-event-previous]"),
    region: query("[data-upcoming-events]"),
    resize: stubResizeObserver(),
    scrollTo,
    tick: () => {
      for (const tick of ticks) {
        tick();
      }
    },
    toggle: query<HTMLButtonElement>("[data-video-toggle]"),
    track,
    video,
  };
};

const click = (button: HTMLElement, detail = 1) =>
  button.dispatchEvent(new MouseEvent("click", { detail }));

const press = (target: Element, key: string, init: KeyboardEventInit = {}) =>
  target.dispatchEvent(
    new KeyboardEvent("keydown", {
      bubbles: true,
      cancelable: true,
      key,
      ...init,
    })
  );

const lastScroll = (scrollTo: ReturnType<typeof mock>) =>
  scrollTo.mock.calls.at(-1)?.[0];

describe("upcoming appearances carousel", () => {
  test("does nothing without the region or its controls", () => {
    expect(() => initUpcomingCarousel()).not.toThrow();

    document.body.innerHTML = "<section data-upcoming-events></section>";
    initUpcomingCarousel();

    expect(query("[data-upcoming-events]").dataset.carouselReady).toBe(
      undefined
    );
  });

  test("shows the first card and hides the rest from assistive technology", () => {
    const { cards, controls, count, next, previous, region, scrollTo } =
      setup();

    initUpcomingCarousel();

    expect(region.dataset.carouselReady).toBe("");
    expect(region.getAttribute("aria-roledescription")).toBe("carousel");
    expect(region.hidden).toBe(false);
    expect(controls.hidden).toBe(false);
    expect(count.textContent).toBe("1 of 3");
    expect(previous.disabled).toBe(true);
    expect(next.disabled).toBe(false);
    expect(cards.map((card) => card.inert)).toEqual([false, true, true]);
    expect(cards.map((card) => card.getAttribute("aria-hidden"))).toEqual([
      "false",
      "true",
      "true",
    ]);
    expect(lastScroll(scrollTo)).toEqual({ behavior: "instant", left: 0 });
  });

  test("moves between cards with the buttons, animating pointer clicks", () => {
    const { count, next, previous, scrollTo } = setup();
    initUpcomingCarousel();

    click(next);
    expect(count.textContent).toBe("2 of 3");
    expect(previous.disabled).toBe(false);
    expect(lastScroll(scrollTo)).toEqual({ behavior: "smooth", left: 500 });

    click(next, 0);
    expect(count.textContent).toBe("3 of 3");
    expect(next.disabled).toBe(true);
    expect(lastScroll(scrollTo)).toEqual({ behavior: "instant", left: 1000 });

    // Past the last card, it stays put.
    click(next);
    expect(count.textContent).toBe("3 of 3");

    click(previous);
    expect(count.textContent).toBe("2 of 3");
    expect(lastScroll(scrollTo)).toEqual({ behavior: "smooth", left: 500 });
  });

  test("doesn't animate with reduced motion, and realigns when it changes", () => {
    const { media, next, scrollTo } = setup({ reducedMotion: true });
    initUpcomingCarousel();

    click(next);
    expect(lastScroll(scrollTo)).toEqual({ behavior: "instant", left: 500 });

    scrollTo.mockClear();
    media[REDUCED_MOTION].change(false);
    expect(lastScroll(scrollTo)).toEqual({ behavior: "instant", left: 500 });
  });

  test("realigns the selected card when the track resizes", () => {
    const { next, resize, scrollTo } = setup();
    initUpcomingCarousel();
    click(next);
    scrollTo.mockClear();

    resize();

    expect(lastScroll(scrollTo)).toEqual({ behavior: "instant", left: 500 });
  });

  test("marks events in progress and expires them at their end", () => {
    const { cards, controls, count, region, scrollTo, tick } = setup({
      now: "2026-10-09T20:00:00Z",
    });
    const status = (index: number) =>
      query("[data-event-status]", cards[index]).textContent;
    initUpcomingCarousel();

    expect(status(0)).toBe("Happening now");
    expect(status(1)).toBe("Panel");

    setSystemTime(new Date("2026-10-09T23:00:00Z"));
    tick();
    expect(cards.map((card) => card.hidden)).toEqual([true, false, false]);
    expect(count.textContent).toBe("1 of 2");
    expect(cards[1].inert).toBe(false);
    expect(lastScroll(scrollTo)).toEqual({ behavior: "instant", left: 500 });

    // Nothing changes while the same cards remain.
    scrollTo.mockClear();
    tick();
    expect(scrollTo).not.toHaveBeenCalled();

    setSystemTime(new Date("2026-10-11T16:00:00Z"));
    document.dispatchEvent(new Event("visibilitychange"));
    expect(status(1)).toBe("Happening now");

    setSystemTime(new Date("2026-10-12T05:00:00Z"));
    window.dispatchEvent(new Event("pageshow"));
    expect(count.textContent).toBe("1 of 1");
    expect(controls.hidden).toBe(true);

    setSystemTime(new Date("2026-10-21T00:00:00Z"));
    tick();
    expect(region.hidden).toBe(true);
  });

  test("selects the card a swipe settles on", async () => {
    const { count, track } = setup();
    initUpcomingCarousel();

    track.scrollLeft = 1100;
    track.dispatchEvent(new Event("scrollend"));
    expect(count.textContent).toBe("3 of 3");

    // Browsers without scrollend settle after scrolling pauses.
    track.scrollLeft = 480;
    track.dispatchEvent(new Event("scroll"));
    expect(count.textContent).toBe("3 of 3");
    await Bun.sleep(200);
    expect(count.textContent).toBe("2 of 3");
  });

  test("moves with the arrow, Home and End keys", () => {
    const { cards, count, region } = setup();
    initUpcomingCarousel();

    expect(press(region, "ArrowRight")).toBe(false);
    expect(count.textContent).toBe("2 of 3");
    press(region, "End");
    expect(count.textContent).toBe("3 of 3");
    press(region, "ArrowLeft");
    expect(count.textContent).toBe("2 of 3");
    press(region, "Home");
    expect(count.textContent).toBe("1 of 3");

    // Focus inside the card follows it to the next one.
    query<HTMLAnchorElement>("a", cards[0]).focus();
    press(region, "ArrowRight");
    expect(document.activeElement).toBe(query("a", cards[1]));
  });

  test("leaves other keys, modified keys and single cards alone", () => {
    const { count, region, tick } = setup();
    initUpcomingCarousel();

    expect(press(region, "ArrowRight", { shiftKey: true })).toBe(true);
    expect(press(region, "Enter")).toBe(true);
    expect(count.textContent).toBe("1 of 3");

    setSystemTime(new Date("2026-10-13T00:00:00Z"));
    tick();
    expect(press(region, "ArrowRight")).toBe(true);
  });

  test("plays the selected card's video behind a play/pause toggle", async () => {
    const { next, previous, toggle, video } = setup();
    initUpcomingCarousel();

    // Native controls stay until the toggle can replace them.
    expect(video.controls).toBe(true);
    expect(toggle.hidden).toBe(true);
    video.dispatchEvent(new Event("loadedmetadata"));
    expect(video.controls).toBe(false);
    expect(toggle.hidden).toBe(false);
    expect(video.paused).toBe(true);

    click(next);
    await flush();
    expect(video.paused).toBe(false);
    expect(toggle.getAttribute("aria-label")).toBe("Pause event animation");
    expect(query("[data-video-play]", toggle).hidden).toBe(true);
    expect(query("[data-video-pause]", toggle).hidden).toBe(false);

    click(toggle);
    expect(video.paused).toBe(true);
    expect(video.dataset.userPaused).toBe("true");
    expect(toggle.getAttribute("aria-label")).toBe("Play event animation");

    // A video the visitor paused stays paused when its card comes back.
    click(previous);
    click(next);
    await flush();
    expect(video.paused).toBe(true);

    click(toggle);
    await flush();
    expect(video.paused).toBe(false);
    expect(video.dataset.userPaused).toBe("false");
  });

  test("shows the toggle straight away when the video's metadata already loaded", () => {
    const { toggle, video } = setup({ readyState: 1 });

    initUpcomingCarousel();

    expect(toggle.hidden).toBe(false);
    expect(video.controls).toBe(false);
  });

  test("keeps native controls on a video that fails to load", () => {
    const { toggle, video } = setup({ reducedMotion: true });
    initUpcomingCarousel();

    video.dispatchEvent(new Event("error"));

    expect(video.controls).toBe(true);
    expect(toggle.hidden).toBe(true);
  });

  test("keeps native controls on a video without a toggle, but still plays it", async () => {
    const { next, toggle, video } = setup();
    toggle.remove();
    initUpcomingCarousel();

    expect(video.controls).toBe(true);
    click(next);
    await flush();
    expect(video.paused).toBe(false);
  });

  test("pauses videos in compact layouts and hidden tabs", async () => {
    const { media, next, video } = setup();
    initUpcomingCarousel();
    click(next);
    await flush();
    expect(video.paused).toBe(false);

    media[COMPACT].change(true);
    expect(video.paused).toBe(true);
    media[COMPACT].change(false);
    await flush();
    expect(video.paused).toBe(false);

    Object.defineProperty(document, "hidden", {
      configurable: true,
      value: true,
    });
    document.dispatchEvent(new Event("visibilitychange"));
    expect(video.paused).toBe(true);
  });

  test("only plays with reduced motion once the visitor starts the video", async () => {
    const { next, toggle, video } = setup({ reducedMotion: true });
    initUpcomingCarousel();

    click(next);
    await flush();
    expect(video.paused).toBe(true);

    click(toggle);
    await flush();
    expect(video.paused).toBe(false);
  });

  test("keeps the toggle usable when autoplay is blocked", async () => {
    const { next, video } = setup();
    const play = mock(() => Promise.reject(new Error("NotAllowedError")));
    video.play = play;
    initUpcomingCarousel();

    click(next);
    await flush();

    expect(play).toHaveBeenCalled();
    expect(video.paused).toBe(true);
  });
});
