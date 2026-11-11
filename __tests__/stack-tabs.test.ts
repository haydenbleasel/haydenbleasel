import { describe, expect, test } from "bun:test";

import { initStackTabs } from "../src/lib/stack-tabs";
import {
  flush,
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

// Panel heights, so switching between AI and Design changes the container's.
const HEIGHTS: Record<string, number> = { AI: 100, Design: 160, Other: 160 };

const tab = (name: string) =>
  query<HTMLButtonElement>(`[data-stack-tab="${name}"]`);
const panel = (name: string) => query(`[data-stack-panel="${name}"]`);

// The parts of about.astro's stack section the script reads. Tabs sit 100px
// apart on one 40px row.
const setup = ({
  extraTab = "",
  reducedMotion = false,
  selected = "AI",
}: { extraTab?: string; reducedMotion?: boolean; selected?: string } = {}) => {
  const names = ["AI", "Design", "Other"];
  document.body.innerHTML = `
    <div class="stack-tabs">
      ${names
        .map(
          (name) =>
            `<button aria-selected="${name === selected}" data-stack-tab="${name}" tabindex="${name === selected ? 0 : -1}">${name}</button>`
        )
        .join("")}
      ${extraTab}
      <span class="stack-indicator"></span>
    </div>
    <div class="stack-panels">
      ${names
        .map(
          (name) =>
            `<ul data-stack-panel="${name}"${name === "AI" ? "" : " hidden"}></ul>`
        )
        .join("")}
    </div>
  `;
  const tabList = query(".stack-tabs");
  const container = query(".stack-panels");
  setRect(tabList, { height: 40, left: 0, top: 0, width: 300 });
  // The container is as tall as whichever panel is showing.
  setRect(container, () => {
    const shown = [...container.children].find(
      (child) => !(child as HTMLElement).hidden
    ) as HTMLElement;
    return {
      height: HEIGHTS[shown.dataset.stackPanel ?? ""],
      left: 0,
      top: 50,
      width: 300,
    };
  });
  for (const [index, name] of names.entries()) {
    setRect(tab(name), { height: 40, left: index * 100, top: 0, width: 80 });
  }
  return {
    animations: stubAnimations(),
    container,
    indicator: query(".stack-indicator"),
    loadFonts: stubFonts(),
    media: stubMatchMedia({ [REDUCED_MOTION]: reducedMotion }),
    resize: stubResizeObserver(),
    tabList,
  };
};

const start = async (options?: Parameters<typeof setup>[0]) => {
  const tabs = setup(options);
  tabs.loadFonts();
  await initStackTabs();
  return tabs;
};

// A mouse click reports how many times it was clicked; a keyboard "click" on a
// button (Enter or Space) reports 0.
const click = (target: HTMLElement, detail = 1) =>
  target.dispatchEvent(new MouseEvent("click", { bubbles: true, detail }));

const press = (target: HTMLElement, key: string) => {
  const event = new KeyboardEvent("keydown", {
    bubbles: true,
    cancelable: true,
    key,
  });
  target.dispatchEvent(event);
  return event;
};

const expectSelected = (name: string) => {
  for (const other of ["AI", "Design", "Other"]) {
    const isSelected = other === name;
    expect(tab(other).getAttribute("aria-selected")).toBe(String(isSelected));
    expect(tab(other).tabIndex).toBe(isSelected ? 0 : -1);
    expect(panel(other).inert).toBe(!isSelected);
  }
  expect(panel(name).hidden).toBe(false);
};

// Before any switch, panels are only `hidden`; `inert` comes with the first one.
const expectUntouched = () => {
  for (const name of ["AI", "Design", "Other"]) {
    expect(tab(name).getAttribute("aria-selected")).toBe(String(name === "AI"));
    expect(panel(name).hidden).toBe(name !== "AI");
  }
};

const settle = async (animations: { end: () => void }[]) => {
  for (const animation of animations) {
    animation.end();
  }
  await flush();
};

describe("stack tabs", () => {
  test("does nothing without the tab markup", async () => {
    document.body.innerHTML = '<div class="stack-tabs"></div>';

    await initStackTabs();

    expect(query(".stack-tabs").dataset.enhanced).toBeUndefined();
  });

  test("does nothing when no tab is selected", async () => {
    const { tabList } = await start({ selected: "none" });

    expect(tabList.dataset.enhanced).toBeUndefined();
  });

  test("puts the indicator under the selected tab, then re-measures once fonts load", async () => {
    const tabs = setup();
    const ready = initStackTabs();

    expect(tabs.tabList.dataset.enhanced).toBe("true");
    expect(tabs.indicator.style.transform).toBe(
      "translate(0px, 39px) scaleX(80)"
    );

    setRect(tab("AI"), { height: 40, left: 0, top: 0, width: 90 });
    tabs.loadFonts();
    await ready;

    expect(tabs.indicator.style.transform).toBe(
      "translate(0px, 39px) scaleX(90)"
    );
  });

  test("arrow keys move between tabs and wrap; Home and End jump to the ends", async () => {
    const tabs = await start();

    const event = press(tab("AI"), "ArrowRight");
    expect(event.defaultPrevented).toBe(true);
    expectSelected("Design");
    expect(document.activeElement).toBe(tab("Design"));
    expect(panel("AI").hidden).toBe(true);

    press(tab("AI"), "ArrowLeft");
    expectSelected("Other");

    press(tab("Other"), "ArrowRight");
    expectSelected("AI");

    press(tab("AI"), "End");
    expectSelected("Other");

    press(tab("Other"), "Home");
    expectSelected("AI");

    // Keyboard navigation switches instantly.
    expect(tabs.animations).toHaveLength(0);
  });

  test("other keys are left to the browser", async () => {
    await start();

    expect(press(tab("AI"), "Enter").defaultPrevented).toBe(false);
    expectUntouched();
  });

  test("keyboard clicks (Enter or Space) switch without animating", async () => {
    const tabs = await start();

    click(tab("Design"), 0);

    expectSelected("Design");
    expect(tabs.animations).toHaveLength(0);
  });

  test("clicks cross-fade the panels, animate the height and slide the indicator", async () => {
    const tabs = await start();

    click(tab("Design"));

    expectSelected("Design");
    // The old panel stays visible, hidden from assistive tech, while it fades.
    expect(panel("AI").hidden).toBe(false);
    expect(panel("AI").dataset.exiting).toBe("true");
    expect(panel("AI").getAttribute("aria-hidden")).toBe("true");
    expect(tabs.container.dataset.animating).toBe("true");

    const [indicator, exit, enter, height] = tabs.animations;
    expect(indicator.element).toBe(tabs.indicator);
    expect(indicator.keyframes.at(-1)).toEqual({
      transform: "translate(100px, 39px) scaleX(80)",
    });
    expect(exit.element).toBe(panel("AI"));
    expect(exit.keyframes.at(-1)).toEqual({
      filter: "blur(1.5px)",
      opacity: 0,
    });
    expect(enter.element).toBe(panel("Design"));
    expect(enter.options.duration).toBe(160);
    expect(height.element).toBe(tabs.container);
    expect(height.keyframes).toEqual([
      { height: "100px" },
      { height: "160px" },
    ]);

    await settle([exit, enter, height]);

    expect(panel("AI").hidden).toBe(true);
    expect(panel("AI").dataset.exiting).toBeUndefined();
    expect(tabs.container.dataset.animating).toBeUndefined();
    expect(exit.cancel).toHaveBeenCalled();
  });

  test("panels of the same height don't animate the container", async () => {
    const tabs = await start();
    click(tab("Design"), 0);

    click(tab("Other"));

    expect(tabs.container.dataset.animating).toBeUndefined();
    expect(tabs.animations.map((a) => a.element)).not.toContain(tabs.container);
  });

  test("reduced motion fades without blur, and skips the height and indicator animations", async () => {
    const tabs = await start({ reducedMotion: true });

    click(tab("Design"));

    const [exit, enter] = tabs.animations;
    expect(tabs.animations).toHaveLength(2);
    expect(exit.keyframes.at(-1)).toEqual({ opacity: 0 });
    expect(enter.keyframes).toEqual([{ opacity: 0 }, { opacity: 1 }]);
    expect(enter.options.duration).toBe(100);
    expect(tabs.container.dataset.animating).toBeUndefined();
  });

  test("the indicator jumps rather than slides when the tabs wrap onto another row", async () => {
    const tabs = await start();
    setRect(tab("Other"), { height: 40, left: 0, top: 40, width: 80 });

    click(tab("Other"));

    expect(tabs.indicator.style.transform).toBe(
      "translate(0px, 79px) scaleX(80)"
    );
    expect(tabs.animations.map((a) => a.element)).not.toContain(tabs.indicator);
  });

  test("a newer selection takes over from one still animating", async () => {
    const tabs = await start();

    click(tab("Design"));
    const first = [...tabs.animations];
    click(tab("Other"));

    for (const animation of first) {
      expect(animation.cancel).toHaveBeenCalled();
    }
    expectSelected("Other");
    expect(panel("Design").dataset.exiting).toBe("true");

    // The first switch finishing late must not tidy up after the second.
    await settle(first);
    expect(panel("Design").hidden).toBe(false);

    await settle(tabs.animations.slice(first.length));
    expect(panel("Design").hidden).toBe(true);
    expect(panel("AI").hidden).toBe(true);
  });

  test("clicking the selected tab, or a tab without a panel, does nothing", async () => {
    const tabs = await start({
      extraTab:
        '<button aria-selected="false" data-stack-tab="Missing">Missing</button>',
    });

    click(tab("AI"));
    click(tab("Missing"));

    expectUntouched();
    expect(tab("Missing").getAttribute("aria-selected")).toBe("false");
    expect(tabs.animations).toHaveLength(0);
  });

  test("re-measures the indicator on resize", async () => {
    const tabs = await start();

    setRect(tab("AI"), { height: 40, left: 10, top: 0, width: 80 });
    tabs.resize();

    expect(tabs.indicator.style.transform).toBe(
      "translate(10px, 39px) scaleX(80)"
    );
  });

  test("turning on reduced motion finishes running animations", async () => {
    const tabs = await start();
    click(tab("Design"));
    const [indicator, ...panels] = tabs.animations;

    tabs.media[REDUCED_MOTION].change(true);

    for (const animation of panels) {
      expect(animation.finish).toHaveBeenCalled();
    }
    expect(indicator.cancel).toHaveBeenCalled();
    expect(tabs.indicator.style.transform).toBe(
      "translate(100px, 39px) scaleX(80)"
    );
  });
});
