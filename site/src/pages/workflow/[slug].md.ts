import type { APIRoute } from "astro";
import { docFile } from "../../shared/docs";
import { docMarkdown } from "../../shared/markdown";
import { ALL_WORKFLOW } from "../../shared/site";

export function getStaticPaths() {
  return ALL_WORKFLOW.map((doc) => ({ params: { slug: doc.slug }, props: { doc, page: docFile("en", doc) } }));
}

export const GET: APIRoute = ({ props }) => docMarkdown("en", props.doc, props.page);
