const playVideo = async (video: HTMLVideoElement) => {
  try {
    await video.play();
  } catch {
    // If autoplay is blocked or interrupted, the play control stays usable.
  }
};

// Without JavaScript the video keeps its native controls. With it, a compact
// play/pause toggle replaces them once the video can play.
const enhanceVideo = (card: HTMLElement, video: HTMLVideoElement) => {
  const toggle = card.querySelector<HTMLButtonElement>("[data-video-toggle]");
  if (!toggle) {
    return;
  }
  video.controls = false;
  const updateToggle = () => {
    toggle.setAttribute(
      "aria-label",
      video.paused ? "Play event animation" : "Pause event animation"
    );
    toggle
      .querySelector<HTMLElement>("[data-video-play]")
      ?.toggleAttribute("hidden", !video.paused);
    toggle
      .querySelector<HTMLElement>("[data-video-pause]")
      ?.toggleAttribute("hidden", video.paused);
  };
  video.addEventListener("play", updateToggle);
  video.addEventListener("pause", updateToggle);
  video.addEventListener("loadeddata", () => {
    toggle.hidden = false;
  });
  if (video.readyState >= 2) {
    toggle.hidden = false;
  }
  toggle.addEventListener("click", () => {
    video.dataset.userPaused = String(!video.paused);
    if (video.paused) {
      playVideo(video);
    } else {
      video.pause();
    }
  });
};

export const initUpcomingCarousel = () => {
  const region = document.querySelector<HTMLElement>("[data-upcoming-events]");
  if (!region) {
    return;
  }
  const cards = [...region.querySelectorAll<HTMLElement>("[data-event-card]")];
  const controls = region.querySelector<HTMLElement>("[data-event-controls]");
  const count = region.querySelector<HTMLElement>("[data-event-count]");
  const previous = region.querySelector<HTMLButtonElement>(
    "[data-event-previous]"
  );
  const next = region.querySelector<HTMLButtonElement>("[data-event-next]");
  const track = region.querySelector<HTMLElement>("[data-event-track]");
  if (!(controls && count && previous && next && track)) {
    return;
  }
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
  const compactLayout = matchMedia("(max-width: 540px)");
  let available: HTMLElement[] = [];
  let current: HTMLElement | undefined;
  let scrollTimer: ReturnType<typeof setTimeout> | undefined;
  // Each card's video, looked up once rather than on every selection change.
  const videos = new Map<HTMLElement, HTMLVideoElement>();
  for (const card of cards) {
    const video = card.querySelector<HTMLVideoElement>("[data-event-video]");
    if (video) {
      videos.set(card, video);
      enhanceVideo(card, video);
    }
  }

  // Only the selected card's video plays, and with reduced motion only once
  // the visitor starts it.
  const syncVideos = () => {
    for (const [card, video] of videos) {
      const { userPaused } = video.dataset;
      const shouldPlay =
        card === current &&
        !document.hidden &&
        !compactLayout.matches &&
        (!reducedMotion.matches || userPaused === "false") &&
        userPaused !== "true";
      if (shouldPlay) {
        playVideo(video);
      } else {
        video.pause();
      }
    }
  };

  const updateControls = () => {
    const index = current ? available.indexOf(current) : -1;
    region.hidden = available.length === 0;
    controls.hidden = available.length < 2;
    const label = `${index + 1} of ${available.length}`;
    if (count.textContent !== label) {
      count.textContent = label;
    }
    previous.disabled = index <= 0;
    next.disabled = index >= available.length - 1;
    for (const card of cards) {
      card.inert = card !== current;
      card.setAttribute("aria-hidden", String(card !== current));
    }
    syncVideos();
  };

  const alignCurrent = (animate = false) => {
    if (!current) {
      return;
    }
    track.scrollTo({
      behavior: animate && !reducedMotion.matches ? "smooth" : "instant",
      left: current.offsetLeft,
    });
  };

  // The page is prerendered, so cards expire and switch to "Happening now"
  // here, at each event's actual times, rather than at build time.
  const refresh = () => {
    const now = Date.now();
    const remaining = cards.filter(
      (card) => Date.parse(card.dataset.end ?? "") > now
    );
    const changed = remaining.length !== available.length;
    available = remaining;
    if (!(current && available.includes(current))) {
      [current] = available;
    }
    for (const card of cards) {
      card.hidden = !available.includes(card);
      const status = card.querySelector<HTMLElement>("[data-event-status]");
      if (status && Date.parse(card.dataset.start ?? "") <= now) {
        status.textContent = "Happening now";
      }
    }
    updateControls();
    if (changed) {
      alignCurrent();
    }
  };

  const move = (offset: number, animate: boolean) => {
    refresh();
    const index = current ? available.indexOf(current) : 0;
    current =
      available[Math.max(0, Math.min(available.length - 1, index + offset))];
    updateControls();
    alignCurrent(animate);
  };

  // Native scrolling supports touch swipes and trackpads as well as buttons.
  // Wait until scrolling settles before announcing a swipe's selected card.
  const finishScroll = () => {
    clearTimeout(scrollTimer);
    let nearest: HTMLElement | undefined;
    for (const card of available) {
      if (
        !nearest ||
        Math.abs(card.offsetLeft - track.scrollLeft) <
          Math.abs(nearest.offsetLeft - track.scrollLeft)
      ) {
        nearest = card;
      }
    }
    current = nearest;
    updateControls();
  };
  track.addEventListener(
    "scroll",
    () => {
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(finishScroll, 150);
    },
    { passive: true }
  );
  track.addEventListener("scrollend", finishScroll);
  previous.addEventListener("click", (event) => move(-1, event.detail > 0));
  next.addEventListener("click", (event) => move(1, event.detail > 0));
  region.addEventListener("keydown", (event) => {
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) {
      return;
    }
    const offsets: Record<string, number> = {
      ArrowLeft: -1,
      ArrowRight: 1,
      End: available.length,
      Home: -available.length,
    };
    const offset = offsets[event.key];
    if (offset === undefined || available.length < 2) {
      return;
    }
    event.preventDefault();
    const focusWasInCard = current?.contains(document.activeElement);
    move(offset, false);
    if (focusWasInCard) {
      current
        ?.querySelector<HTMLAnchorElement>("a")
        ?.focus({ preventScroll: true });
    }
  });

  region.dataset.carouselReady = "";
  region.setAttribute("aria-roledescription", "carousel");
  refresh();
  new ResizeObserver(() => alignCurrent()).observe(track);
  reducedMotion.addEventListener("change", () => {
    alignCurrent();
    syncVideos();
  });
  compactLayout.addEventListener("change", syncVideos);
  // Expire cards even when a tab stays open across an event's end, or is
  // restored from the browser's back/forward cache.
  setInterval(refresh, 30_000);
  document.addEventListener("visibilitychange", refresh);
  window.addEventListener("pageshow", refresh);
};
