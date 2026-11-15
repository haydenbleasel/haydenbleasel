export const initThemeSwitcher = () => {
  const button = document.querySelector("[data-theme-switcher]");

  button?.addEventListener("click", () => {
    const root = document.documentElement;
    const isDark = root.classList.toggle("dark");
    // Browser chrome follows the page background (see layout.astro).
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", isDark ? "#111" : "#fff");

    try {
      localStorage.setItem("theme", isDark ? "dark" : "light");
    } catch {
      // Storage can be unavailable (private mode); the toggle still works.
    }
  });
};
