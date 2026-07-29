/**
 * Data model for the Lifeline timeline, ported from
 * https://github.com/evilrabbit/lifeline (MIT © Evil Rabbit).
 *
 * The hover-image, floating-photo, and effect fields from the original
 * are kept in the model so data written now survives a future port of
 * those features, but the current renderer only draws text, links,
 * badges, company icons, and people.
 */

export interface LifelineMentor {
  name: string;
  role?: string;
  color?: string;
  photo?: string;
}

export interface LifelineMetPerson {
  name: string;
  photo?: string;
}

export interface LifelineCompany {
  id: string;
  name: string;
}

export type LifelineEventSegment =
  | { type: "text"; value: string }
  | { type: "link"; value: string; href: string };

export interface LifelineEventImage {
  src: string;
  alt: string;
  /** Optional mp4/webm — hover shows this (muted, looping) with src as fallback. */
  video?: string;
}

export interface LifelineEventObject {
  text: string | LifelineEventSegment[];
  image?: LifelineEventImage;
}

export type LifelineEvent =
  | string
  | LifelineEventSegment[]
  | LifelineEventObject;

export interface LifelineMarker {
  id: string;
  /** Position on the numeric axis — a year, or any sequential unit. */
  year: number;
  /** Shown above the label; defaults to year - birthYear. */
  age?: number | string;
  /** Shown in place of the raw year — e.g. "Jun 16" on a day-based timeline. */
  label?: string;
  events: LifelineEvent[];
  /** Small emblems rendered above the events. */
  badges?: { src: string; alt: string }[];
  companies?: LifelineCompany[];
  mentors?: LifelineMentor[];
  met?: LifelineMetPerson[];
}

export interface LifelineLegendItem {
  type: "mentor" | "met";
  label: string;
}

export interface AggregatedLifelinePerson {
  name: string;
  mentor: boolean;
  met: boolean;
  photo?: string;
}

export const aggregateLifelinePeople = (
  marker: LifelineMarker
): AggregatedLifelinePerson[] => {
  const map = new Map<string, AggregatedLifelinePerson>();

  const add = (name: string, type: "mentor" | "met", photo?: string) => {
    const person = map.get(name) ?? { mentor: false, met: false, name };
    person[type] = true;
    person.photo ??= photo;
    map.set(name, person);
  };

  for (const person of marker.mentors ?? []) {
    add(person.name, "mentor", person.photo);
  }
  for (const person of marker.met ?? []) {
    add(person.name, "met", person.photo);
  }

  return [...map.values()];
};

export const getLifelineEventContent = (
  event: LifelineEvent
): string | LifelineEventSegment[] => {
  if (typeof event === "object" && !Array.isArray(event) && "text" in event) {
    return event.text;
  }

  return event;
};

export const getLifelineEventImage = (
  event: LifelineEvent
): LifelineEventImage | undefined => {
  if (typeof event === "object" && !Array.isArray(event) && "image" in event) {
    return event.image;
  }

  return undefined;
};
