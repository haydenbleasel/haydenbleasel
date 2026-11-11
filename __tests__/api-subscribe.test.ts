import { afterEach, describe, expect, spyOn, test } from "bun:test";

import { POST, prerender } from "../src/pages/api/subscribe";
import { environment } from "./support/preload";

type Context = Parameters<typeof POST>[0];

const fetchSpy = spyOn(globalThis, "fetch");

afterEach(() => {
  fetchSpy.mockReset();
});

const post = (body: FormData) =>
  POST({
    request: new Request("https://haydenbleasel.com/api/subscribe", {
      body,
      method: "POST",
    }),
  } as unknown as Context) as Promise<Response>;

describe("POST /api/subscribe", () => {
  test("runs on demand rather than being prerendered", () => {
    expect(prerender).toBe(false);
  });

  test("subscribes with the Worker's Resend credentials", async () => {
    fetchSpy.mockResolvedValue(Response.json({ id: "contact" }));
    const body = new FormData();
    body.set("email", "reader@example.com");

    const response = await post(body);

    expect(response.status).toBe(200);
    expect(fetchSpy).toHaveBeenCalledTimes(1);
    const [url, init] = fetchSpy.mock.calls[0] as [string, RequestInit];
    expect(url).toBe("https://api.resend.com/contacts");
    expect(init.headers).toMatchObject({
      Authorization: `Bearer ${environment.RESEND_TOKEN}`,
    });
    expect(JSON.parse(init.body as string)).toMatchObject({
      email: "reader@example.com",
      segments: [{ id: environment.RESEND_AUDIENCE_ID }],
    });
  });

  test("rejects an invalid email without calling Resend", async () => {
    const body = new FormData();
    body.set("email", "not-an-email");

    const response = await post(body);

    expect(response.status).toBe(400);
    expect(fetchSpy).not.toHaveBeenCalled();
  });
});
