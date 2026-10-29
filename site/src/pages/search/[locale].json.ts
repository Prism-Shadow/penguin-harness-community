import type { APIRoute } from "astro";
import { docDescription, docFile } from "../../shared/docs";
import { LOCALES, type Locale } from "../../shared/i18n";
import { docBody } from "../../shared/markdown";
import { buildSearchRecords } from "../../shared/search";
import { WORKFLOW_SECTIONS, RFC_SECTIONS, ROADMAP_SECTIONS, docHref } from "../../shared/site";

export function getStaticPaths() {
  return LOCALES.map((locale) => ({ params: { locale } }));
}

export const GET: APIRoute = ({ params }) => {
  const locale = params.locale as Locale;
  const pages = [...ROADMAP_SECTIONS, ...WORKFLOW_SECTIONS, ...RFC_SECTIONS].flatMap((section) =>
    section.docs.map((doc) => {
      const file = docFile(locale, doc);
      return {
        area: doc.area,
        section: section.title[locale],
        href: docHref(locale, doc),
        title: doc.title[locale],
        description: docDescription(locale, doc, file),
        body: docBody(locale, doc, file),
        anchors: file
          .getHeadings()
          .filter((heading) => heading.depth === 2 || heading.depth === 3)
          .map((heading) => heading.slug),
      };
    }),
  );
  return new Response(JSON.stringify(buildSearchRecords(pages)), {
    headers: { "content-type": "application/json; charset=utf-8" },
  });
};
