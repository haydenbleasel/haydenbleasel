import { describe, expect, mock, test } from "bun:test";

import { initNewsletter } from "../src/lib/newsletter";
import { flush, query, useDom } from "./support/dom";

useDom();

// The parts of newsletter-inline.astro the script reads.
const markup = `
  <div data-newsletter-state="idle">
    <form action="/api/subscribe" data-newsletter method="POST">
      <input name="email" type="email" />
      <button title="Subscribe" type="submit">
        <span data-newsletter-button-label>Subscribe</span>
      </button>
    </form>
    <p class="hidden" data-newsletter-status role="status"></p>
    <p data-newsletter-notice id="newsletter-invalid">Invalid email address</p>
  </div>
`;

const reply = (ok: boolean, body: { error?: string; message?: string }) =>
  Promise.resolve({ json: () => Promise.resolve(body), ok });

const setup = (respond: () => Promise<unknown>) => {
  document.body.innerHTML = markup;
  const fetch = mock(respond);
  globalThis.fetch = fetch as unknown as typeof globalThis.fetch;
  initNewsletter();

  const form = query<HTMLFormElement>("form");
  const input = query<HTMLInputElement>("input");
  input.value = "reader@example.com";
  return {
    button: query<HTMLButtonElement>("button"),
    control: query("[data-newsletter-state]"),
    fetch,
    form,
    input,
    label: query("[data-newsletter-button-label]"),
    status: query("[data-newsletter-status]"),
    submit: () => form.dispatchEvent(new Event("submit", { cancelable: true })),
  };
};

const GENERIC_ERROR = "Something went wrong. Please try again.";

describe("newsletter form", () => {
  test("does nothing on pages without the form", () => {
    document.body.innerHTML = "<form data-newsletter></form>";

    expect(() => initNewsletter()).not.toThrow();
  });

  test("submits in place and shows the confirmation", async () => {
    const { promise, resolve } = Promise.withResolvers<unknown>();
    const { button, control, fetch, form, input, label, status, submit } =
      setup(() => promise);

    expect(submit()).toBe(false);

    expect(control.dataset.newsletterState).toBe("pending");
    expect(button.disabled).toBe(true);
    expect(button.getAttribute("aria-busy")).toBe("true");
    expect(label.textContent).toBe("Joining…");
    expect(status.classList.contains("hidden")).toBe(true);
    const [url, init] = fetch.mock.calls[0] as unknown as [
      string,
      { body: FormData; method: string },
    ];
    expect(url).toBe("https://haydenbleasel.com/api/subscribe");
    expect(init.method).toBe("POST");
    expect(init.body.get("email")).toBe("reader@example.com");

    resolve(await reply(true, { error: "", message: "Subscribed!" }));
    await flush();

    expect(control.dataset.newsletterState).toBe("success");
    expect(status.dataset.kind).toBe("success");
    expect(status.textContent).toBe("Subscribed!");
    expect(status.classList.contains("hidden")).toBe(false);
    expect(label.textContent).toBe("Subscribed");
    expect(button.title).toBe("Subscribed");
    expect(button.disabled).toBe(true);
    expect(button.hasAttribute("aria-busy")).toBe(false);
    expect(input.disabled).toBe(true);
    expect(form.getAttribute("aria-hidden")).toBe("true");
  });

  test("shows the endpoint's error and lets the reader try again", async () => {
    const { button, control, label, status, submit } = setup(() =>
      reply(false, { error: "Invalid email address", message: "" })
    );

    submit();
    await flush();

    expect(control.dataset.newsletterState).toBe("error");
    expect(status.dataset.kind).toBe("error");
    expect(status.textContent).toBe("Invalid email address");
    expect(status.classList.contains("hidden")).toBe(false);
    expect(button.disabled).toBe(false);
    expect(button.hasAttribute("aria-busy")).toBe(false);
    expect(label.textContent).toBe("Subscribe");
  });

  test("hides the notice from an earlier native submit", async () => {
    const { submit } = setup(() => reply(true, { message: "Subscribed!" }));
    const notice = query("[data-newsletter-notice]");

    expect(notice.hidden).toBe(false);
    submit();
    expect(notice.hidden).toBe(true);
    await flush();
  });

  test("drops a native submit's fragment so reloading doesn't repeat it", () => {
    history.replaceState(null, "", "/?ref=x#newsletter-invalid");

    setup(() => reply(true, { message: "Subscribed!" }));

    expect(location.href).toBe("https://haydenbleasel.com/?ref=x");
  });

  test("leaves other fragments alone", () => {
    history.replaceState(null, "", "/#newsletter-email");

    setup(() => reply(true, { message: "Subscribed!" }));

    expect(location.hash).toBe("#newsletter-email");
  });

  test.each([
    ["a failed response with no error", () => reply(false, {})],
    ["a success response with no message", () => reply(true, {})],
    ["a network failure", () => Promise.reject(new Error("offline"))],
  ])("falls back to a generic error for %s", async (_label, respond) => {
    const { button, control, status, submit } = setup(respond);

    submit();
    await flush();

    expect(control.dataset.newsletterState).toBe("error");
    expect(status.textContent).toBe(GENERIC_ERROR);
    expect(button.disabled).toBe(false);
  });

  test("ignores another submit while one is in flight", async () => {
    const { promise, resolve } = Promise.withResolvers<unknown>();
    const { fetch, submit } = setup(() => promise);

    submit();
    submit();
    resolve(await reply(true, { message: "Subscribed!" }));
    await flush();

    expect(fetch).toHaveBeenCalledTimes(1);
  });

  test("skips the button animation for keyboard submits", async () => {
    const { control, form, submit } = setup(() =>
      reply(false, { error: "Try again" })
    );

    form.dispatchEvent(new Event("keydown"));
    submit();
    expect(control.dataset.motion).toBe("instant");
    await flush();

    form.dispatchEvent(new Event("pointerdown"));
    submit();
    expect(control.dataset.motion).toBe("animate");
    await flush();
  });
});
