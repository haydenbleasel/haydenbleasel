export const initThemeSwitcher = () => {
  const button = document.querySelector("[data-theme-switcher]");

  button?.addEventListener("click", () => {
    const root = document.documentElement;
    const isDark = root.classList.toggle("dark");

    try {
      localStorage.setItem("theme", isDark ? "dark" : "light");
    } catch {
      // Storage can be unavailable (private mode); the toggle still works.
    }
  });
};
