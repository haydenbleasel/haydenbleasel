import { trackProgressAtTime } from "@/lib/lifeline/intro-timing";
/**
 * Vanilla-JS port of the Lifeline interaction hooks
 * (use-lifeline-scroll / use-lifeline-vertical-scroll) from
 * https://github.com/evilrabbit/lifeline — page mode only, since here
 * the timeline is the page.
 *
 * Desktop: the track moves by transform; wheel, drag, and arrow keys
 * scrub it, with momentum. The intro sweeps the rail from birth to the
 * present while markers fade in as the tip passes them.
 *
 * Mobile: the vertical list lives in the stage's own scroller; the
 * intro auto-scrolls it to the present with user scroll locked, then
 * hands it back.
 */
import {
  clamp,
  LIFELINE_MOBILE_BREAKPOINT,
  LIFELINE_STICKY_LEFT,
  LIFELINE_STICKY_SHIELD_WIDTH,
} from "@/lib/lifeline/layout";

const FADE_ZONE = 200;
const FADE_ZONE_COARSE = 72;
const LEFT_EXIT_FADE_ZONE = 400;
const LEFT_EXIT_FADE_ZONE_COARSE = 160;
const WHEEL_SPEED = 1.4;
const WHEEL_VELOCITY_FRAME_MS = 16.67;
const WHEEL_MOMENTUM_BLEND = 0.65;
const DRAG_SPEED = 1;
const TOUCH_DRAG_SPEED = 1.15;
const TOUCH_GESTURE_LOCK_PX = 8;
const NAV_HORIZONTAL_PADDING = 24;
const MOMENTUM_FRICTION = 0.94;
const MOMENTUM_MIN_VELOCITY = 0.025;
const MOMENTUM_MIN_START = 0.08;
const DEFAULT_START_INSET = 24;

interface LifelineConfig {
  /** Estimated marker slot sizes — px widths (desktop) or heights (vertical). */
  sizes: number[];
  railMs: number;
}

const readConfig = (element: HTMLElement): LifelineConfig | null => {
  try {
    return JSON.parse(element.dataset.lifelineConfig ?? "");
  } catch {
    return null;
  }
};

const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * A composited layer resting on a fractional offset resamples its whole
 * subtree — text goes soft. Snapping to the device pixel grid (not whole
 * CSS pixels) keeps half-pixel steps on retina, so motion stays smooth.
 */
const snapToDevicePixel = (value: number) => {
  const dpr = window.devicePixelRatio || 1;
  return Math.round(value * dpr) / dpr;
};

const normalizeWheelDelta = (event: WheelEvent) => {
  const dominant =
    Math.abs(event.deltaX) > Math.abs(event.deltaY)
      ? event.deltaX
      : event.deltaY;

  // DOM_DELTA_LINE / DOM_DELTA_PAGE arrive in lines/pages, not px.
  if (event.deltaMode === 1) {
    return dominant * 16;
  }
  if (event.deltaMode === 2) {
    return dominant * 100;
  }
  return dominant;
};

const isInteractiveTarget = (target: EventTarget | null) =>
  target instanceof Element &&
  Boolean(
    target.closest(
      "a, button, input, textarea, select, [data-lifeline-interactive]"
    )
  );

const isEditableTarget = (target: EventTarget | null) =>
  target instanceof HTMLElement &&
  (target.isContentEditable ||
    ["INPUT", "SELECT", "TEXTAREA"].includes(target.tagName));

const initDesktop = (section: HTMLElement) => {
  const track = section.querySelector<HTMLElement>("[data-lifeline-track]");
  const labels = section.querySelector<HTMLElement>("[data-lifeline-labels]");
  const rail = section.querySelector<HTMLElement>("[data-lifeline-rail]");
  const markers = [
    ...section.querySelectorAll<HTMLElement>("[data-lifeline-marker]"),
  ];
  const config = readConfig(section);
  if (!track || !labels || !rail || !config) {
    section.classList.remove("invisible");
    return;
  }

  const isCoarsePointer = window.matchMedia("(pointer: coarse)").matches;

  let startInset = DEFAULT_START_INSET;
  let endInset = 0;
  let maxTranslate = 0;
  let translatePx = 0;
  let introLocked = false;

  let momentumId = 0;
  let dragVelocity = 0;
  let dragging = false;
  let gestureAxis: "x" | "y" | null = null;
  const gestureStart = { x: 0, y: 0 };
  let dragOrigin = { translate: 0, x: 0 };
  let lastPointerSample = { t: 0, x: 0 };
  let activePointerId: number | null = null;

  const applyLabelSticky = (translate: number) => {
    const naturalLeft = startInset - translate;
    const isSticky = naturalLeft <= LIFELINE_STICKY_LEFT;

    if (isSticky) {
      // Derived from the track's snapped offset so the two transforms
      // cancel to exactly LIFELINE_STICKY_LEFT without sub-pixel drift.
      const labelExtra =
        LIFELINE_STICKY_LEFT - snapToDevicePixel(startInset - translate);
      labels.style.transform = `translate3d(${labelExtra}px, 0, 0)`;
      labels.classList.add("is-pinned");
    } else {
      labels.style.transform = "";
      labels.classList.remove("is-pinned");
    }
  };

  const updateFades = () => {
    const stageRect = section.getBoundingClientRect();
    const fadeZone = isCoarsePointer ? FADE_ZONE_COARSE : FADE_ZONE;
    const leftFadeZone = isCoarsePointer
      ? LEFT_EXIT_FADE_ZONE_COARSE
      : LEFT_EXIT_FADE_ZONE;

    for (const marker of markers) {
      const rect = marker.getBoundingClientRect();
      const markerLeft = rect.left - stageRect.left;
      const center = markerLeft + rect.width / 2;

      let opacity = 1;

      // Fade a marker out only as scrubbing carries it left of where it
      // rests at translate 0 — the first markers naturally live inside
      // the fade zone and must not open dimmed.
      const naturalLeft = markerLeft + translatePx;
      const restLeft = Math.min(naturalLeft, leftFadeZone);
      if (markerLeft < restLeft) {
        opacity = markerLeft <= 0 ? 0 : markerLeft / restLeft;
      }

      if (center > stageRect.width - fadeZone) {
        opacity = Math.min(opacity, (stageRect.width - center) / fadeZone);
      }

      if (isCoarsePointer) {
        const readableLeft = LIFELINE_STICKY_SHIELD_WIDTH;
        const readableRight = stageRect.width - 12;
        const markerRight = rect.right - stageRect.left;
        const visibleWidth =
          Math.min(markerRight, readableRight) -
          Math.max(markerLeft, readableLeft);
        const visibility = rect.width > 0 ? visibleWidth / rect.width : 0;

        if (visibility >= 0.5) {
          opacity = 1;
        }
      }

      marker.style.opacity = String(clamp(opacity, 0, 1));
    }
  };

  const applyTranslate = (value: number) => {
    translatePx = clamp(value, 0, maxTranslate);

    // Snapped only at the DOM boundary — translatePx stays float so
    // wheel/drag physics never accumulate rounding.
    track.style.transform = `translate3d(${snapToDevicePixel(
      startInset - translatePx
    )}px, 0, 0)`;

    applyLabelSticky(translatePx);
    updateFades();
  };

  const measureLayout = () => {
    const stageRect = section.getBoundingClientRect();

    const navLogo = document.querySelector("[data-site-nav-logo]");
    const navInner = document.querySelector("[data-site-nav-inner]");

    const logoLeft = navLogo
      ? navLogo.getBoundingClientRect().left - stageRect.left
      : null;
    const navRight = navInner
      ? navInner.getBoundingClientRect().right -
        stageRect.left -
        NAV_HORIZONTAL_PADDING
      : null;

    startInset = logoLeft ?? DEFAULT_START_INSET;
    endInset = navRight ?? stageRect.width - NAV_HORIZONTAL_PADDING;

    const lastMarker = markers.at(-1);
    const lastMarkerRight = lastMarker
      ? LIFELINE_STICKY_SHIELD_WIDTH +
        lastMarker.offsetLeft +
        lastMarker.offsetWidth
      : track.scrollWidth;

    maxTranslate = Math.max(0, startInset + lastMarkerRight - endInset);
    return maxTranslate;
  };

  const stopMomentum = () => {
    cancelAnimationFrame(momentumId);
    momentumId = 0;
  };

  const startMomentum = () => {
    if (Math.abs(dragVelocity) < MOMENTUM_MIN_START) {
      return;
    }

    stopMomentum();
    let lastFrameTime = performance.now();

    const step = (now: number) => {
      const dt = Math.min(now - lastFrameTime, 32);
      lastFrameTime = now;

      if (Math.abs(dragVelocity) < MOMENTUM_MIN_VELOCITY) {
        dragVelocity = 0;
        momentumId = 0;
        return;
      }

      const next = clamp(translatePx + dragVelocity * dt, 0, maxTranslate);
      if (next !== translatePx) {
        applyTranslate(next);
      }

      if (next <= 0 || next >= maxTranslate) {
        dragVelocity = 0;
        momentumId = 0;
        return;
      }

      dragVelocity *= MOMENTUM_FRICTION ** (dt / 16.67);
      momentumId = requestAnimationFrame(step);
    };

    momentumId = requestAnimationFrame(step);
  };

  const scrub = (movement: number, target: number) => {
    applyTranslate(target);

    const impulse = (movement / WHEEL_VELOCITY_FRAME_MS) * 0.35;
    dragVelocity =
      dragVelocity * (1 - WHEEL_MOMENTUM_BLEND) +
      impulse * WHEEL_MOMENTUM_BLEND;

    if (momentumId === 0) {
      startMomentum();
    }
  };

  const runIntro = () => {
    if (prefersReducedMotion() || maxTranslate <= 0) {
      // Skipped intros park the rail where the sweep would have settled
      // it — the end, the present.
      applyTranslate(maxTranslate);
      section.classList.remove("invisible");
      return;
    }

    introLocked = true;

    // Arm the CSS choreography before first visible paint: the rail
    // draws with --lifeline-intro-progress, each marker fades in on its
    // pre-computed delay.
    section.style.setProperty("--lifeline-intro-progress", "0");
    rail.classList.add("lifeline-rail-intro");
    labels.firstElementChild?.classList.add("lifeline-labels-intro");
    for (const marker of markers) {
      marker.firstElementChild?.classList.add("lifeline-marker-intro");
    }

    applyTranslate(0);
    section.classList.remove("invisible");

    let start = 0;
    const step = (now: number) => {
      if (start === 0) {
        start = now;
      }

      const progress = clamp(
        trackProgressAtTime(now - start, config.sizes, config.railMs),
        0,
        1
      );

      section.style.setProperty("--lifeline-intro-progress", String(progress));
      applyTranslate(progress * maxTranslate);

      if (progress < 1) {
        requestAnimationFrame(step);
        return;
      }

      // Settled: hand the rail back and drop the intro plumbing. The
      // marker fades are `forwards` animations, so removing the class
      // after the last fade ends leaves everything at rest.
      window.setTimeout(() => {
        introLocked = false;
        section.style.removeProperty("--lifeline-intro-progress");
        rail.classList.remove("lifeline-rail-intro");
        labels.firstElementChild?.classList.remove("lifeline-labels-intro");
        for (const marker of markers) {
          marker.firstElementChild?.classList.remove("lifeline-marker-intro");
          marker.style.opacity = "";
        }
        updateFades();
      }, 900);
    };

    requestAnimationFrame(step);
  };

  const onWheel = (event: WheelEvent) => {
    if (introLocked) {
      event.preventDefault();
      return;
    }
    if (maxTranslate <= 0) {
      return;
    }

    /**
     * The two axes are not the same gesture and do not share a sign.
     * Vertical is page scrolling: the intro leaves the rail at the
     * present, and scrolling down walks back through it. Horizontal is
     * a drag by another name: the rail follows the fingers.
     */
    const horizontalIntent = Math.abs(event.deltaX) > Math.abs(event.deltaY);
    const delta = normalizeWheelDelta(event);
    const movement = (horizontalIntent ? delta : -delta) * WHEEL_SPEED;

    event.preventDefault();
    scrub(movement, translatePx + movement);
  };

  // The rail moves by transform; any native scroll on the section is
  // the browser chasing a focused link deep in the track.
  const onSectionScroll = () => {
    if (section.scrollLeft !== 0) {
      section.scrollLeft = 0;
    }
    if (section.scrollTop !== 0) {
      section.scrollTop = 0;
    }
  };

  const beginDrag = (event: PointerEvent) => {
    stopMomentum();
    dragVelocity = 0;
    dragging = true;
    activePointerId = event.pointerId;
    dragOrigin = { translate: translatePx, x: event.clientX };
    lastPointerSample = { t: performance.now(), x: event.clientX };

    section.setPointerCapture?.(event.pointerId);
    section.style.cursor = "grabbing";
    section.style.touchAction = "none";
  };

  const onPointerDown = (event: PointerEvent) => {
    if (introLocked) {
      return;
    }
    if (isInteractiveTarget(event.target)) {
      return;
    }
    if (maxTranslate <= 0 || activePointerId !== null) {
      return;
    }

    gestureAxis = null;
    gestureStart.x = event.clientX;
    gestureStart.y = event.clientY;

    if (event.pointerType === "touch") {
      activePointerId = event.pointerId;
      return;
    }

    beginDrag(event);
  };

  const onPointerMove = (event: PointerEvent) => {
    if (activePointerId !== null && event.pointerId !== activePointerId) {
      return;
    }

    if (!dragging && event.pointerType === "touch") {
      const deltaX = event.clientX - gestureStart.x;
      const deltaY = event.clientY - gestureStart.y;

      if (gestureAxis === null) {
        if (
          Math.abs(deltaX) < TOUCH_GESTURE_LOCK_PX &&
          Math.abs(deltaY) < TOUCH_GESTURE_LOCK_PX
        ) {
          return;
        }

        gestureAxis = Math.abs(deltaX) >= Math.abs(deltaY) ? "x" : "y";

        if (gestureAxis === "y") {
          activePointerId = null;
          return;
        }

        beginDrag(event);
      }
    }

    if (!dragging) {
      return;
    }

    if (event.pointerType === "touch") {
      event.preventDefault();
    }

    const now = performance.now();
    const elapsed = now - lastPointerSample.t;
    const dragSpeed =
      event.pointerType === "touch" ? TOUCH_DRAG_SPEED : DRAG_SPEED;

    if (elapsed > 0 && elapsed < 80) {
      const instantVelocity =
        (-(event.clientX - lastPointerSample.x) / elapsed) * dragSpeed;
      dragVelocity = instantVelocity * 0.65 + dragVelocity * 0.35;
    }

    lastPointerSample = { t: now, x: event.clientX };

    const deltaX = event.clientX - dragOrigin.x;
    applyTranslate(dragOrigin.translate - deltaX * dragSpeed);
  };

  const endDrag = (event: PointerEvent) => {
    if (activePointerId !== null && event.pointerId !== activePointerId) {
      return;
    }

    const wasDragging = dragging;

    dragging = false;
    gestureAxis = null;
    activePointerId = null;

    if (section.hasPointerCapture(event.pointerId)) {
      section.releasePointerCapture(event.pointerId);
    }

    section.style.cursor = "";
    section.style.touchAction = "";

    if (wasDragging) {
      startMomentum();
    }
  };

  const onKeyDown = (event: KeyboardEvent) => {
    if (introLocked || maxTranslate <= 0) {
      return;
    }
    if (isEditableTarget(event.target)) {
      return;
    }
    // The desktop rail is display: none below md — keys belong to the
    // vertical scroller there.
    if (section.offsetParent === null) {
      return;
    }

    stopMomentum();
    dragVelocity = 0;

    if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      event.preventDefault();
      applyTranslate(translatePx - maxTranslate * 0.05);
    }

    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      event.preventDefault();
      applyTranslate(translatePx + maxTranslate * 0.05);
    }
  };

  let measureFrame = 0;
  const scheduleMeasure = () => {
    cancelAnimationFrame(measureFrame);
    measureFrame = requestAnimationFrame(() => {
      measureLayout();
      if (!introLocked) {
        applyTranslate(translatePx);
      }
    });
  };

  measureLayout();
  runIntro();

  new ResizeObserver(scheduleMeasure).observe(track);
  window.addEventListener("resize", scheduleMeasure);

  section.addEventListener("scroll", onSectionScroll, { passive: true });
  section.addEventListener("wheel", onWheel, { passive: false });
  section.addEventListener("pointerdown", onPointerDown);
  section.addEventListener("pointermove", onPointerMove, { passive: false });
  section.addEventListener("pointerup", endDrag);
  section.addEventListener("pointercancel", endDrag);
  window.addEventListener("keydown", onKeyDown);
};

const initVertical = (article: HTMLElement) => {
  const config = readConfig(article);
  const entries = [
    ...article.querySelectorAll<HTMLElement>("[data-lifeline-entry]"),
  ];
  const rail = article.querySelector<HTMLElement>("[data-lifeline-rail]");

  const getScrollParent = (): HTMLElement | null => {
    let node = article.parentElement;
    while (node) {
      const { overflowY } = window.getComputedStyle(node);
      if (["auto", "overlay", "scroll"].includes(overflowY)) {
        return node;
      }
      node = node.parentElement;
    }
    return (document.scrollingElement as HTMLElement | null) ?? null;
  };

  const scrollParent = getScrollParent();
  if (!config || !rail || !scrollParent) {
    article.classList.remove("invisible");
    return;
  }

  const maxScroll = () =>
    Math.max(0, scrollParent.scrollHeight - scrollParent.clientHeight);

  // The vertical rail only runs the sweep when it's the visible layout.
  const isActive = window.innerWidth < LIFELINE_MOBILE_BREAKPOINT;

  if (!isActive || prefersReducedMotion()) {
    scrollParent.scrollTop = isActive ? maxScroll() : 0;
    article.classList.remove("invisible");
    return;
  }

  let introLocked = true;
  const preventScroll = (event: Event) => {
    if (introLocked) {
      event.preventDefault();
    }
  };
  scrollParent.addEventListener("wheel", preventScroll, { passive: false });
  scrollParent.addEventListener("touchmove", preventScroll, { passive: false });

  article.style.setProperty("--lifeline-intro-progress", "0");
  rail.classList.add("lifeline-rail-intro-vertical");
  article
    .querySelector("[data-lifeline-vertical-labels]")
    ?.classList.add("lifeline-labels-intro");
  for (const entry of entries) {
    entry.firstElementChild?.classList.add("lifeline-marker-intro");
  }

  scrollParent.scrollTop = 0;
  article.classList.remove("invisible");

  let start = 0;
  const step = (now: number) => {
    if (start === 0) {
      start = now;
    }

    const progress = clamp(
      trackProgressAtTime(now - start, config.sizes, config.railMs),
      0,
      1
    );

    article.style.setProperty("--lifeline-intro-progress", String(progress));
    scrollParent.scrollTop = progress * maxScroll();

    if (progress < 1) {
      requestAnimationFrame(step);
      return;
    }

    window.setTimeout(() => {
      introLocked = false;
      article.style.removeProperty("--lifeline-intro-progress");
      rail.classList.remove("lifeline-rail-intro-vertical");
      for (const entry of entries) {
        entry.firstElementChild?.classList.remove("lifeline-marker-intro");
      }
    }, 900);
  };

  requestAnimationFrame(step);
};

const desktop = document.querySelector<HTMLElement>("[data-lifeline-desktop]");
if (desktop) {
  initDesktop(desktop);
}

const vertical = document.querySelector<HTMLElement>(
  "[data-lifeline-vertical]"
);
if (vertical) {
  initVertical(vertical);
}
