import { describe, expect, mock, test } from "bun:test";

const createMock = mock(() =>
  Promise.resolve({
    data: { id: "123" } as { id: string } | null,
    error: null as { message: string } | null,
  })
);

mock.module("../src/lib/resend", () => ({
  audienceId: "test-audience-id",
  resend: {
    contacts: {
      create: createMock,
    },
  },
}));

const { POST } = await import("../src/pages/api/subscribe");

const buildRequest = (email?: string) => {
  const formData = new FormData();
  if (email !== undefined) {
    formData.set("email", email);
  }
  return new Request("http://localhost/api/subscribe", {
    body: formData,
    method: "POST",
  });
};

const call = (request: Request) =>
  POST({ request } as unknown as Parameters<typeof POST>[0]);

describe("subscribe", () => {
  test("returns error when email is missing", async () => {
    const response = await call(buildRequest());
    const result = await response.json();

    expect(result.error).toBe("Invalid email address");
    expect(result.message).toBe("");
  });

  test("returns success on valid subscription", async () => {
    createMock.mockResolvedValueOnce({ data: { id: "456" }, error: null });

    const response = await call(buildRequest("test@example.com"));
    const result = await response.json();

    expect(result.error).toBe("");
    expect(result.message).toBe("Subscribed!");
  });

  test("returns error when resend API fails", async () => {
    createMock.mockResolvedValueOnce({
      data: null,
      error: { message: "Rate limit exceeded" },
    });

    const response = await call(buildRequest("test@example.com"));
    const result = await response.json();

    expect(result.error).toBe("Rate limit exceeded");
    expect(result.message).toBe("");
  });
});
