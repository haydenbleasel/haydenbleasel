// The AI Gateway key is supplied by each visitor and kept only in their browser
// — it is sent per-request to /api/chat so the server never stores a key.

const STORAGE_KEY = "studio:ai-gateway-key";

export const AI_TOKEN_HEADER = "x-ai-gateway-key";

export const getAiToken = (): string => {
  try {
    return window.localStorage.getItem(STORAGE_KEY) ?? "";
  } catch {
    return "";
  }
};

export const setAiToken = (token: string): void => {
  const trimmed = token.trim();
  if (trimmed) {
    window.localStorage.setItem(STORAGE_KEY, trimmed);
  } else {
    window.localStorage.removeItem(STORAGE_KEY);
  }
};

export const hasAiToken = (): boolean => getAiToken().length > 0;
