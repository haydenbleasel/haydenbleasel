// Browser globals for the client scripts in src/lib. happy-dom supplies the
// DOM; the helpers below fill in what it doesn't model (media query changes,
// layout, font loading, resize observers) and record Web Animations calls.
import { afterEach, beforeEach, mock } from "bun:test";

import { GlobalRegistrator } from "@happy-dom/global-registrator";

/** Gives every test in the calling file a fresh document at the site's URL. */
export const useDom = () => {
  beforeEach(() => {
    GlobalRegistrator.register({ url: "https://haydenbleasel.com/" });
  });
  afterEach(async () => {
    await GlobalRegistrator.unregister();
  });
};

/** Lets pending promises settle. */
export const flush = () => Bun.sleep(0);

export const query = <T extends Element = HTMLElement>(
  selector: string,
  root: ParentNode = document
) => {
  const element = root.querySelector<T>(selector);
  if (!element) {
    throw new Error(`Missing ${selector}`);
  }
  return element;
};

export interface FakeMediaQuery {
  addEventListener: (type: "change", listener: () => void) => void;
  /** Updates `matches` and notifies listeners, like a real preference change. */
  change: (matches: boolean) => void;
  matches: boolean;
}

/** Replaces `matchMedia` with queries whose results a test controls. */
export const stubMatchMedia = <Query extends string>(
  initial: Record<Query, boolean>
) => {
  const queries = {} as Record<Query, FakeMediaQuery>;
  for (const [media, matches] of Object.entries(initial) as [
    Query,
    boolean,
  ][]) {
    const listeners: (() => void)[] = [];
    const fake: FakeMediaQuery = {
      addEventListener: (_type, listener) => {
        listeners.push(listener);
      },
      change: (next) => {
        fake.matches = next;
        for (const listener of listeners) {
          listener();
        }
      },
      matches,
    };
    queries[media] = fake;
  }
  globalThis.matchMedia = ((media: Query) => {
    const fake = queries[media];
    if (!fake) {
      throw new Error(`Unexpected media query: ${media}`);
    }
    return fake;
  }) as unknown as typeof matchMedia;
  return queries;
};

export interface FakeAnimation {
  cancel: ReturnType<typeof mock>;
  element: Element;
  /** Resolves `finished`, as if the animation ran to the end. */
  end: () => void;
  finish: ReturnType<typeof mock>;
  finished: Promise<FakeAnimation>;
  keyframes: Keyframe[];
  options: KeyframeAnimationOptions;
}

/** Records every `element.animate()` call instead of running it. */
export const stubAnimations = () => {
  const animations: FakeAnimation[] = [];
  Element.prototype.animate = function animate(
    this: Element,
    keyframes: Keyframe[],
    options: KeyframeAnimationOptions
  ) {
    // Like the real API, `finished` resolves to the animation itself.
    const { promise, resolve } = Promise.withResolvers<FakeAnimation>();
    const animation: FakeAnimation = {
      cancel: mock(),
      element: this,
      end: () => resolve(animation),
      finish: mock(),
      finished: promise,
      keyframes,
      options,
    };
    animations.push(animation);
    return animation as unknown as Animation;
  } as unknown as typeof Element.prototype.animate;
  return animations;
};

/** Adds `document.fonts.ready`; call the returned function to "load" fonts. */
export const stubFonts = () => {
  // Like the real API, `ready` resolves to the font set itself.
  const { promise, resolve } = Promise.withResolvers<object>();
  const fonts = { ready: promise };
  Object.defineProperty(document, "fonts", {
    configurable: true,
    value: fonts,
  });
  return () => resolve(fonts);
};

/**
 * Captures ResizeObservers; call the returned function to report a resize to
 * every observer that's watching something.
 */
export const stubResizeObserver = () => {
  const observers: FakeResizeObserver[] = [];
  class FakeResizeObserver {
    readonly #onResize: () => void;
    readonly #targets = new Set<Element>();

    constructor(onResize: () => void) {
      this.#onResize = onResize;
      observers.push(this);
    }

    disconnect() {
      this.#targets.clear();
    }

    observe(target: Element) {
      this.#targets.add(target);
    }

    unobserve(target: Element) {
      this.#targets.delete(target);
    }

    resize() {
      if (this.#targets.size > 0) {
        this.#onResize();
      }
    }
  }
  globalThis.ResizeObserver =
    FakeResizeObserver as unknown as typeof ResizeObserver;
  return () => {
    for (const observer of observers) {
      observer.resize();
    }
  };
};

export interface Box {
  height: number;
  left: number;
  top: number;
  width: number;
}

/** Fixes an element's layout box, since happy-dom doesn't lay anything out. */
export const setRect = (element: Element, box: Box | (() => Box)) => {
  element.getBoundingClientRect = () => {
    const { height, left, top, width } =
      typeof box === "function" ? box() : box;
    return {
      bottom: top + height,
      height,
      left,
      right: left + width,
      toJSON: () => ({}),
      top,
      width,
      x: left,
      y: top,
    };
  };
};
