import { describe, expect, mock, test } from "bun:test";

const createMock = mock(() =>
  Promise.resolve({
    data: { id: "123" } as { id: string } | null,
    error: null as { message: string } | null,
  })
);

mock.module("../lib/resend", () => ({
  audienceId: "test-audience-id",
  resend: {
    contacts: {
      create: createMock,
    },
  },
}));

const { subscribe } = await import("../actions/subscribe");

describe("subscribe", () => {
  test("returns error when email is missing", async () => {
    const formData = new FormData();
    const result = await subscribe(undefined, formData);

    expect(result.error).toBe("Invalid email address");
    expect(result.message).toBe("");
  });

  test("returns success on valid subscription", async () => {
    createMock.mockResolvedValueOnce({ data: { id: "456" }, error: null });

    const formData = new FormData();
    formData.set("email", "test@example.com");

    const result = await subscribe(undefined, formData);

    expect(result.error).toBe("");
    expect(result.message).toBe("Subscribed!");
  });

  test("returns error when resend API fails", async () => {
    createMock.mockResolvedValueOnce({
      data: null,
      error: { message: "Rate limit exceeded" },
    });

    const formData = new FormData();
    formData.set("email", "test@example.com");

    const result = await subscribe(undefined, formData);

    expect(result.error).toBe("Rate limit exceeded");
    expect(result.message).toBe("");
  });
});
