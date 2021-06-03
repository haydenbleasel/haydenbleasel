import PrismicDOM from "prismic-dom";
import Prismic from "@prismicio/client";
import type Predicates from "@prismicio/client/types/Predicates";
import type { QueryOptions } from "@prismicio/client/types/ResolvedApi";

/** Route resolving */
const routes = (uid: string) => ({
  home: "/",
  default: `/${uid}`,
});

/** Richtext HTML parser */
const htmlElements = (element?: any, content?: any, children?: any) => ({});

/** Queries */
export async function query(
  query: (prismic: typeof Predicates) => any,
  options?: QueryOptions
) {
  const api = await Prismic.getApi(process.env.NEXT_PUBLIC_PRISMIC_ENDPOINT!),
    result = await api.query(query(Prismic.Predicates), {
      ref: api.masterRef.ref,
      pageSize: 100,
      ...options,
    });

  if (!result) {
    throw new Error("Unpublished document");
  }

  return result.results_size === 1
    ? (result.results[0] as any)
    : (result.results as any);
}

/** Predicates.at shorthand */
export function queryAt(path: string, value: string, options?: QueryOptions) {
  return query((prismic) => prismic.at(path, value), options);
}

/** Document resolver */
export function resolveDocument(doc: any) {
  const paths = routes(doc.uid);
  return doc ? paths[doc.type as keyof typeof paths] || paths.default : "";
}

/** Internal link resolver */
export function resolveLink(link: { link_type?: string; url?: string }) {
  return link.link_type && link.link_type !== "Document"
    ? link.url || ""
    : resolveDocument(link);
}

/** RichText to HTML string */
export function richtext(richtext: object, inline?: boolean) {
  const result = richtext
    ? PrismicDOM.RichText.asHtml(
        richtext,
        resolveLink,
        ((type: keyof typeof htmlElements, ...args: any) =>
          htmlElements(...args)[type] || null) as any
      )
    : "";

  return inline
    ? result.replace(/^<[^>]+>|<\/[^>]+>$|<[^/>][^>]*><\/[^>]+>/g, "")
    : result;
}

/** RichText to plaintext string */
export function plaintext(richtext: object) {
  return richtext ? PrismicDOM.RichText.asText(richtext) : "";
}
