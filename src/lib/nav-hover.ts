export const initNavHover = async () => {
  const nav = document.querySelector<HTMLElement>(".site-nav");
  const highlight = nav?.querySelector<HTMLElement>(".site-nav-hover");
  if (!(nav && highlight)) {
    return;
  }

  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
  const hover = matchMedia("(hover: hover) and (pointer: fine)");
  const active = nav.querySelector<HTMLAnchorElement>("a[aria-current]");
  let selected: HTMLAnchorElement | undefined;
  let movement: Animation | undefined;

  const move = (link: HTMLAnchorElement, animate: boolean) => {
    const origin = nav.getBoundingClientRect();
    const bounds = link.getBoundingClientRect();
    const left = bounds.left - origin.left;
    const right = origin.right - bounds.right;
    const before = getComputedStyle(highlight).clipPath;
    const after = `inset(0 ${right}px 0 ${left}px round 999px)`;
    movement?.cancel();
    highlight.style.clipPath = after;
    if (animate && !reducedMotion.matches) {
      movement = highlight.animate(
        [{ clipPath: before }, { clipPath: after }],
        {
          duration: 180,
          easing: "cubic-bezier(.25, 1, .5, 1)",
        }
      );
    }
    highlight.dataset.visible = "true";
    selected = link;
  };

  const restore = (animate: boolean) => {
    const focused = nav.querySelector<HTMLAnchorElement>("a:focus-visible");
    const target = focused ?? active;
    if (target) {
      if (target !== selected) {
        move(target, animate && !focused && Boolean(selected));
      }
    } else {
      delete highlight.dataset.visible;
      selected = undefined;
    }
  };

  nav.addEventListener("pointermove", (event) => {
    if (event.pointerType === "touch" || !hover.matches) {
      return;
    }
    const link = (event.target as Element).closest<HTMLAnchorElement>("a");
    if (link && link !== selected) {
      move(link, Boolean(selected));
    }
  });
  nav.addEventListener("pointerleave", () => restore(true));
  nav.addEventListener("keydown", () => {
    movement?.cancel();
    restore(false);
  });
  nav.addEventListener("focusin", (event) => {
    const link = event.target as HTMLAnchorElement;
    if (link.matches("a:focus-visible")) {
      move(link, false);
    }
  });
  nav.addEventListener("focusout", (event) => {
    if (!nav.contains(event.relatedTarget as Node | null)) {
      restore(false);
    }
  });
  reducedMotion.addEventListener("change", () => movement?.cancel());
  hover.addEventListener("change", () => restore(false));
  new ResizeObserver(() => {
    if (selected) {
      move(selected, false);
    }
  }).observe(nav);
  if (active) {
    move(active, false);
  }
  const hovered = nav.querySelector<HTMLAnchorElement>("a:hover");
  if (hover.matches && hovered && !hovered.matches(":focus-visible")) {
    move(hovered, false);
  }
  nav.dataset.enhanced = "true";
  await document.fonts.ready;
  if (selected) {
    move(selected, false);
  }
};
