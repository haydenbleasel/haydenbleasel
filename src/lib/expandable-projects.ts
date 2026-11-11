export const initExpandableProjects = () => {
  const container = document.querySelector<HTMLElement>(
    "[data-expandable-projects]"
  );
  const content = container?.querySelector<HTMLElement>(
    "[data-project-content]"
  );
  const fade = container?.querySelector<HTMLElement>("[data-project-fade]");
  const button = container?.querySelector<HTMLButtonElement>(
    "[data-project-expand]"
  );
  const rows = [
    ...(content?.querySelectorAll<HTMLElement>("[data-project]") ?? []),
  ];
  const cutoff = rows.findIndex((row) => row.dataset.project === "Orate");

  if (
    !(container && content && fade && button) ||
    cutoff === -1 ||
    cutoff >= rows.length - 1
  ) {
    return;
  }
  const concealed = rows.slice(cutoff);
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
  let expanded = false;
  let animation: Animation | undefined;

  const measure = () => {
    if (expanded) {
      return;
    }
    const { top } = container.getBoundingClientRect();
    const boundary = rows[cutoff].getBoundingClientRect();
    container.style.height = `${boundary.bottom - top + 28}px`;
    container.style.setProperty(
      "--projects-fade-start",
      `${boundary.top - top - 8}px`
    );
  };

  // Keep the complete list available when JavaScript is disabled.
  container.dataset.collapsed = "";
  for (const row of concealed) {
    row.inert = true;
  }
  measure();
  fade.hidden = false;
  button.hidden = false;

  // Re-measure the Orate boundary after fonts load or the layout wraps.
  const observer = new ResizeObserver(measure);
  observer.observe(content);

  button.addEventListener("click", (event) => {
    if (expanded) {
      return;
    }
    expanded = true;
    observer.disconnect();
    const fromHeight = container.getBoundingClientRect().height;
    button.setAttribute("aria-expanded", "true");
    button.hidden = true;
    fade.hidden = true;
    for (const row of concealed) {
      row.inert = false;
    }
    delete container.dataset.collapsed;
    container.style.removeProperty("height");
    const toHeight = container.getBoundingClientRect().height;

    if (event.detail === 0) {
      concealed[0]
        .querySelector<HTMLAnchorElement>("a")
        ?.focus({ preventScroll: true });
    }

    if (!reducedMotion.matches && event.detail !== 0) {
      container.dataset.expanding = "";
      animation = container.animate(
        [{ height: `${fromHeight}px` }, { height: `${toHeight}px` }],
        { duration: 280, easing: "cubic-bezier(0.25, 1, 0.5, 1)" }
      );
      const finish = () => {
        delete container.dataset.expanding;
      };
      animation.addEventListener("finish", finish, { once: true });
      animation.addEventListener("cancel", finish, { once: true });
    }
  });

  reducedMotion.addEventListener("change", () => {
    if (reducedMotion.matches) {
      animation?.cancel();
    }
  });
};
