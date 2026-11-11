export const initNewsletter = () => {
  const control = document.querySelector<HTMLElement>(
    "[data-newsletter-state]"
  );
  const form = control?.querySelector<HTMLFormElement>("[data-newsletter]");
  const status = control?.querySelector<HTMLElement>(
    "[data-newsletter-status]"
  );
  const button = form?.querySelector<HTMLButtonElement>(
    'button[type="submit"]'
  );
  const input = form?.querySelector<HTMLInputElement>('input[type="email"]');
  const label = button?.querySelector<HTMLElement>(
    "[data-newsletter-button-label]"
  );
  if (!(control && form && status && button && input && label)) {
    return;
  }

  // A native submit (see subscribe.ts) lands back here at #newsletter-<outcome>.
  // Its notice stays up for this visit (replaceState doesn't change :target),
  // but drop the fragment so a reload, bookmark or shared link doesn't repeat it.
  const notices = [
    ...control.querySelectorAll<HTMLElement>("[data-newsletter-notice]"),
  ];
  if (notices.some((notice) => `#${notice.id}` === location.hash)) {
    history.replaceState(
      history.state,
      "",
      `${location.pathname}${location.search}`
    );
  }

  let keyboardInput = false;
  form.addEventListener("keydown", () => {
    keyboardInput = true;
  });
  form.addEventListener("pointerdown", () => {
    keyboardInput = false;
  });

  const showError = (message: string) => {
    control.dataset.newsletterState = "error";
    status.dataset.kind = "error";
    status.textContent = message;
    status.classList.remove("hidden");
  };

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (button.disabled) {
      return;
    }
    control.dataset.motion = keyboardInput ? "instant" : "animate";
    control.dataset.newsletterState = "pending";
    button.disabled = true;
    button.setAttribute("aria-busy", "true");
    label.textContent = "Joining…";
    status.classList.add("hidden");
    // The notice from an earlier native submit (see subscribe.ts) is stale now.
    for (const notice of notices) {
      notice.hidden = true;
    }

    try {
      const response = await fetch(form.action, {
        body: new FormData(form),
        method: "POST",
      });
      const result = (await response.json()) as {
        error?: string;
        message?: string;
      };
      if (!response.ok || result.error || !result.message) {
        showError(result.error || "Something went wrong. Please try again.");
      } else {
        status.dataset.kind = "success";
        status.textContent = result.message;
        status.classList.remove("hidden");
        control.dataset.newsletterState = "success";
        label.textContent = "Subscribed";
        button.title = "Subscribed";
        input.disabled = true;
        form.setAttribute("aria-hidden", "true");
      }
    } catch {
      showError("Something went wrong. Please try again.");
    } finally {
      button.removeAttribute("aria-busy");
      if (control.dataset.newsletterState !== "success") {
        button.disabled = false;
        label.textContent = "Subscribe";
      }
    }
  });
};
