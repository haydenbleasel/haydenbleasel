const ease = "cubic-bezier(0.25, 1, 0.5, 1)";

export const initStackTabs = async () => {
  const tabList = document.querySelector<HTMLElement>(".stack-tabs");
  const container = document.querySelector<HTMLElement>(".stack-panels");
  const indicator = tabList?.querySelector<HTMLElement>(".stack-indicator");
  if (!(tabList && container && indicator)) {
    return;
  }

  const tabs = [
    ...tabList.querySelectorAll<HTMLButtonElement>("[data-stack-tab]"),
  ];
  const panels = [
    ...container.querySelectorAll<HTMLElement>("[data-stack-panel]"),
  ];
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
  const initial = tabs.find(
    (tab) => tab.getAttribute("aria-selected") === "true"
  );
  if (!initial) {
    return;
  }
  let selected: HTMLButtonElement = initial;
  let running: Animation[] = [];
  let indicatorAnimation: Animation | undefined;
  let indicatorY: number | undefined;
  let revision = 0;

  const moveIndicator = (animate: boolean) => {
    const before = getComputedStyle(indicator).transform;
    const bounds = selected.getBoundingClientRect();
    const origin = tabList.getBoundingClientRect();
    const x = bounds.left - origin.left;
    const y = bounds.bottom - origin.top - 1;
    const after = `translate(${x}px, ${y}px) scaleX(${bounds.width})`;
    indicatorAnimation?.cancel();
    indicator.style.transform = after;
    if (
      animate &&
      !reducedMotion.matches &&
      indicatorY !== undefined &&
      Math.abs(indicatorY - y) < 1
    ) {
      indicatorAnimation = indicator.animate(
        [{ transform: before }, { transform: after }],
        { duration: 180, easing: ease }
      );
    }
    indicatorY = y;
  };

  const activate = async (tab: HTMLButtonElement, animate: boolean) => {
    if (selected === tab) {
      return;
    }
    const current = panels.find(
      (panel) => panel.dataset.stackPanel === selected.dataset.stackTab
    );
    const next = panels.find(
      (panel) => panel.dataset.stackPanel === tab.dataset.stackTab
    );
    if (!(current && next)) {
      return;
    }
    const fromHeight = container.getBoundingClientRect().height;
    const fromOpacity = getComputedStyle(current).opacity;
    revision += 1;
    const thisRevision = revision;
    for (const animation of running) {
      animation.cancel();
    }
    running = [];
    delete container.dataset.animating;
    for (const panel of panels) {
      panel.hidden = panel !== next;
      panel.inert = panel !== next;
      delete panel.dataset.exiting;
      panel.removeAttribute("aria-hidden");
    }
    selected = tab;
    for (const other of tabs) {
      other.setAttribute("aria-selected", String(other === tab));
      other.tabIndex = other === tab ? 0 : -1;
    }
    moveIndicator(animate);
    if (!animate) {
      return;
    }

    const toHeight = container.getBoundingClientRect().height;
    current.dataset.exiting = "true";
    current.setAttribute("aria-hidden", "true");
    current.hidden = false;
    const exitFrames: Keyframe[] = reducedMotion.matches
      ? [{ opacity: fromOpacity }, { opacity: 0 }]
      : [
          { filter: "blur(0px)", opacity: fromOpacity },
          { filter: "blur(1.5px)", opacity: 0 },
        ];
    const enterFrames: Keyframe[] = reducedMotion.matches
      ? [{ opacity: 0 }, { opacity: 1 }]
      : [
          { filter: "blur(1.5px)", opacity: 0 },
          { filter: "blur(0px)", opacity: 1 },
        ];
    running.push(
      current.animate(exitFrames, {
        duration: 90,
        easing: "ease-out",
        fill: "forwards",
      }),
      next.animate(enterFrames, {
        duration: reducedMotion.matches ? 100 : 160,
        easing: ease,
      })
    );
    if (!reducedMotion.matches && Math.abs(fromHeight - toHeight) > 1) {
      container.dataset.animating = "true";
      running.push(
        container.animate(
          [{ height: `${fromHeight}px` }, { height: `${toHeight}px` }],
          {
            duration: 180,
            easing: ease,
          }
        )
      );
    }
    await Promise.allSettled(running.map((animation) => animation.finished));
    if (revision !== thisRevision) {
      return;
    }
    current.hidden = true;
    delete current.dataset.exiting;
    delete container.dataset.animating;
    for (const animation of running) {
      animation.cancel();
    }
    running = [];
  };

  for (const [index, tab] of tabs.entries()) {
    tab.addEventListener("click", (event) => activate(tab, event.detail > 0));
    tab.addEventListener("keydown", (event) => {
      const destinations: Record<string, number> = {
        ArrowLeft: (index - 1 + tabs.length) % tabs.length,
        ArrowRight: (index + 1) % tabs.length,
        End: tabs.length - 1,
        Home: 0,
      };
      const next = destinations[event.key];
      if (next === undefined) {
        return;
      }
      event.preventDefault();
      activate(tabs[next], false);
      tabs[next].focus();
    });
  }
  tabList.dataset.enhanced = "true";
  moveIndicator(false);
  new ResizeObserver(() => moveIndicator(false)).observe(tabList);
  reducedMotion.addEventListener("change", () => {
    for (const animation of running) {
      animation.finish();
    }
    indicatorAnimation?.cancel();
    moveIndicator(false);
  });
  await document.fonts.ready;
  moveIndicator(false);
};
