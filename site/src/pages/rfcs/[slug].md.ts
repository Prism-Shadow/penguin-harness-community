import type { APIRoute } from "astro";
import { docFile } from "../../shared/docs";
import { docMarkdown } from "../../shared/markdown";
import { ALL_RFCS } from "../../shared/site";

export function getStaticPaths() {
  return ALL_RFCS.map((doc) => ({ params: { slug: doc.slug }, props: { doc, page: docFile("en", doc) } }));
}

export const GET: APIRoute = ({ props }) => docMarkdown("en", props.doc, props.page);
