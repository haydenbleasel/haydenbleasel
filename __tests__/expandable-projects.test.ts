import { describe, expect, test } from "bun:test";

import { initExpandableProjects } from "../src/lib/expandable-projects";
import {
  query,
  setRect,
  stubAnimations,
  stubMatchMedia,
  stubResizeObserver,
  useDom,
} from "./support/dom";

useDom();

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

// The parts of expandable-projects.astro the script reads.
const markup = (names: string[]) => `
  <div data-expandable-projects>
    <div data-project-content>
      <ul>
        ${names
          .map(
            (name) =>
              `<li data-project="${name}"><a href="/${name}">${name}</a></li>`
          )
          .join("")}
      </ul>
    </div>
    <div data-project-fade hidden></div>
    <button aria-expanded="false" data-project-expand hidden type="button">Show more</button>
  </div>
`;

// Rows are 40px tall from the container's top at 100px; the container is
// 300px tall once nothing is collapsed.
const setup = ({ reducedMotion = false } = {}) => {
  document.body.innerHTML = markup(["Ultracite", "Orate", "Refraction"]);
  const container = query("[data-expandable-projects]");
  setRect(container, () => ({
    height: container.style.height ? 108 : 300,
    left: 0,
    top: 100,
    width: 600,
  }));
  const rows = [...container.querySelectorAll<HTMLElement>("[data-project]")];
  for (const [index, row] of rows.entries()) {
    setRect(row, { height: 40, left: 0, top: 100 + index * 40, width: 600 });
  }

  return {
    animations: stubAnimations(),
    button: query<HTMLButtonElement>("[data-project-expand]"),
    container,
    fade: query("[data-project-fade]"),
    media: stubMatchMedia({ [REDUCED_MOTION]: reducedMotion }),
    resize: stubResizeObserver(),
    rows,
  };
};

const click = (button: HTMLElement, detail = 1) =>
  button.dispatchEvent(new MouseEvent("click", { detail }));

describe("expandable projects", () => {
  test.each([
    ["the list is missing", ""],
    ["Orate isn't listed", markup(["Ultracite", "Refraction"])],
    ["nothing follows Orate", markup(["Ultracite", "Orate"])],
  ])("leaves the list alone when %s", (_label, html) => {
    document.body.innerHTML = html;

    initExpandableProjects();

    expect(document.querySelector("[data-collapsed]")).toBeNull();
  });

  test("collapses the list just below Orate, keeping hidden rows out of reach", () => {
    const { button, container, fade, rows } = setup();

    initExpandableProjects();

    expect(container.dataset.collapsed).toBe("");
    expect(rows.map((row) => row.inert)).toEqual([false, true, true]);
    expect(container.style.height).toBe("108px");
    expect(container.style.getPropertyValue("--projects-fade-start")).toBe(
      "32px"
    );
    expect(fade.hidden).toBe(false);
    expect(button.hidden).toBe(false);
  });

  test("re-measures when the layout changes", () => {
    const { container, resize, rows } = setup();
    initExpandableProjects();

    setRect(rows[1], { height: 60, left: 0, top: 150, width: 600 });
    resize();

    expect(container.style.height).toBe("138px");
    expect(container.style.getPropertyValue("--projects-fade-start")).toBe(
      "42px"
    );
  });

  test("expands with an animation on click, then stops measuring", () => {
    const { animations, button, container, fade, resize, rows } = setup();
    initExpandableProjects();

    click(button);

    expect(button.getAttribute("aria-expanded")).toBe("true");
    expect(button.hidden).toBe(true);
    expect(fade.hidden).toBe(true);
    expect(rows.map((row) => row.inert)).toEqual([false, false, false]);
    expect(container.dataset.collapsed).toBeUndefined();
    expect(container.style.height).toBe("");
    expect(animations).toHaveLength(1);
    expect(animations[0].keyframes).toEqual([
      { height: "108px" },
      { height: "300px" },
    ]);
    expect(container.dataset.expanding).toBe("");
    animations[0].end();
    expect(container.dataset.expanding).toBeUndefined();

    // A resize queued before expanding doesn't collapse the list again, and
    // neither does another click.
    resize({ queued: true });
    click(button);
    expect(container.style.height).toBe("");
    expect(animations).toHaveLength(1);
  });

  test("moves keyboard focus to the first revealed project without animating", () => {
    const { animations, button, rows } = setup();
    initExpandableProjects();

    click(button, 0);

    expect(document.activeElement).toBe(query("a", rows[1]));
    expect(animations).toHaveLength(0);
  });

  test("doesn't animate with reduced motion, and stops when it's turned on", () => {
    const reduced = setup({ reducedMotion: true });
    initExpandableProjects();
    click(reduced.button);
    expect(reduced.animations).toHaveLength(0);

    const { animations, button, container, media } = setup();
    initExpandableProjects();
    click(button);
    media[REDUCED_MOTION].change(false);
    expect(animations[0].cancel).not.toHaveBeenCalled();
    media[REDUCED_MOTION].change(true);
    expect(animations[0].cancel).toHaveBeenCalled();
    expect(container.dataset.expanding).toBeUndefined();
  });
});
