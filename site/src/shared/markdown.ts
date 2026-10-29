import { docDescription, repoHref, type DocFile } from "./docs";
import type { Locale } from "./i18n";
import { localePath } from "./i18n";
import { docPath, type DocLink } from "./site";

export function docMarkdown(locale: Locale, doc: DocLink, page: DocFile): Response {
  const site = import.meta.env.SITE;
  const body = docBody(locale, doc, page);
  const source = new URL(localePath(locale, docPath(doc)), site);
  const description = docDescription(locale, doc, page);
  const lede = description ? `${description}\n\n` : "";
  const text = `# ${doc.title[locale]}\n\n${lede}Source: ${source}\n\n${body}\n`;
  return new Response(text, { headers: { "content-type": "text/markdown; charset=utf-8" } });
}

export function docBody(locale: Locale, doc: DocLink, page: DocFile): string {
  const site = import.meta.env.SITE;
  const source = doc.source[locale];
  return page
    .rawContent()
    .replace(/^# .*\n+/, "")
    .replace(/^\[(?:中文版|English)\]\([^)]*\.md\)\n+/m, "")
    .split(/(`[^`\n]*`)/)
    .map((part, index) =>
      index % 2
        ? part
        : part.replace(/\]\(([^)\s]+)\)/g, (_, href: string) =>
            href.startsWith("#") ? `](${href})` : `](${new URL(repoHref(locale, source, href), site).href})`,
          ),
    )
    .join("")
    .trim();
}
