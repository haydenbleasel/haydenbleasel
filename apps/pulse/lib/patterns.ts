// Patterns are stored locally in the browser via IndexedDB — one object store
// keyed by pattern path (e.g. "drums/breakbeat") with the Strudel code as value.

import { openDB } from "idb";
import type { IDBPDatabase } from "idb";

export type PatternRef = string;

const DB_NAME = "studio";
const STORE = "patterns";
const VERSION = 1;

const SEGMENT_RE = /^[a-z0-9-]+$/iu;

export const isValidPath = (relPath: string): boolean => {
  const segments = relPath.split("/");
  return segments.length > 0 && segments.every((s) => SEGMENT_RE.test(s));
};

let dbPromise: Promise<IDBPDatabase> | null = null;

const db = (): Promise<IDBPDatabase> => {
  dbPromise ??= openDB(DB_NAME, VERSION, {
    upgrade(database) {
      database.createObjectStore(STORE);
    },
  });
  return dbPromise;
};

export const listPatterns = async (): Promise<PatternRef[]> => {
  const database = await db();
  const keys = await database.getAllKeys(STORE);
  return keys.map(String).toSorted();
};

// Returns "" for an unknown ref so visiting a new path yields an empty buffer
// that becomes a pattern once saved.
export const loadPattern = async (ref: PatternRef): Promise<string> => {
  const database = await db();
  const code = await database.get(STORE, ref);
  return typeof code === "string" ? code : "";
};

export const savePattern = async (
  ref: PatternRef,
  code: string
): Promise<void> => {
  const database = await db();
  await database.put(STORE, code, ref);
};

export const deletePattern = async (ref: PatternRef): Promise<void> => {
  const database = await db();
  await database.delete(STORE, ref);
};

export const patternExists = async (ref: PatternRef): Promise<boolean> => {
  const database = await db();
  const key = await database.getKey(STORE, ref);
  return key !== undefined;
};
