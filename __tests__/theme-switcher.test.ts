import { describe, expect, test } from "bun:test";

import { initThemeSwitcher } from "../src/lib/theme-switcher";
import { query, useDom } from "./support/dom";

useDom();

const setup = () => {
  document.body.innerHTML =
    '<button data-theme-switcher type="button">Switch theme</button>';
  initThemeSwitcher();
  return query("[data-theme-switcher]");
};

describe("theme switcher", () => {
  test("does nothing on pages without the button", () => {
    expect(() => initThemeSwitcher()).not.toThrow();
  });

  test("flips the theme and remembers the choice", () => {
    const button = setup();

    button.click();
    expect(document.documentElement.classList.contains("dark")).toBe(true);
    expect(localStorage.getItem("theme")).toBe("dark");

    button.click();
    expect(document.documentElement.classList.contains("dark")).toBe(false);
    expect(localStorage.getItem("theme")).toBe("light");
  });

  test("still switches when storage is unavailable", () => {
    const button = setup();
    Object.defineProperty(globalThis, "localStorage", {
      configurable: true,
      value: {
        setItem: () => {
          throw new Error("SecurityError");
        },
      },
    });

    button.click();

    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });
});
