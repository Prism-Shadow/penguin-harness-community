import type { MarkdownInstance } from "astro";
import katex from "katex";
import type { Locale } from "./i18n";
import { ALL_PAGES, REPO_URL, docHref, type DocLink } from "./site";

export type DocFile = MarkdownInstance<{ description?: string }>;

const REPO_FILES = import.meta.glob<DocFile>(
  [
    "../../../roadmap/*.md",
    "../../../workflow/*.md",
    "../../../rfcs/*.md",
  ],
  { eager: true },
);

export function docFile(locale: Locale, doc: DocLink): DocFile {
  const target = `../../../${doc.source[locale]}`;
  const file = REPO_FILES[target];
  if (!file) {
    throw new Error(`Missing markdown file: ${target}`);
  }
  return file;
}

export function docDescription(locale: Locale, doc: DocLink, file: DocFile): string | undefined {
  return doc.description?.[locale] ?? file.frontmatter?.description;
}

export function docSummary(file: DocFile): string {
  const raw = file.rawContent();
  const blocks = raw.split(/\n\s*\n/);
  const paragraph =
    blocks.find(
      (block) =>
        block.trim() &&
        !block.startsWith("#") &&
        !block.startsWith("<!--") &&
        !block.startsWith("<figure") &&
        !block.startsWith("- Feature Name:") &&
        !/^\[(?:中文版|English)\]\(/.test(block.trim()),
    ) ?? "";
  return paragraph
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[`*]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function repoHref(locale: Locale, source: string, href: string): string {
  if (/^(?:[a-z][a-z0-9+.-]*:|#|\/)/i.test(href)) return href;
  const url = new URL(href, `file:///${source}`);
  const path = decodeURIComponent(url.pathname.slice(1));
  const target = ALL_PAGES.find((doc) => doc.source.en === path || doc.source.zh === path);
  if (target) {
    const { en, zh } = target.source;
    const language = en === zh ? locale : path === zh ? "zh" : "en";
    return docHref(language, target) + url.hash;
  }
  const kind = /\.[^/]+$/.test(path) ? "blob" : "tree";
  return `${REPO_URL}/${kind}/main/${path}${url.hash}`;
}

function renderLatexExpr(tex: string, displayMode: boolean): string {
  const cleaned = tex
    .trim()
    .replace(/<em>([\s\S]*?)<\/em>/g, "_$1_")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\\text\{([^}]*)\}/g, (_, t: string) => `\\text{${t.replace(/(?<!\\)_/g, "\\_")}}`);

  return katex.renderToString(cleaned, {
    displayMode,
    throwOnError: false,
    output: "html",
  });
}

function renderMathInHtml(html: string): string {
  return html
    .split(/(<pre[\s\S]*?<\/pre>|<code[\s\S]*?<\/code>|<figure[\s\S]*?<\/figure>)/g)
    .map((segment, idx) => {
      if (idx % 2 === 1) return segment;
      return segment
        .replace(/<p>\$\$([\s\S]*?)\$\$<\/p>/g, (_, tex: string) => `<div class="math-block">${renderLatexExpr(tex, true)}</div>`)
        .replace(/\$\$([\s\S]*?)\$\$/g, (_, tex: string) => `<div class="math-block">${renderLatexExpr(tex, true)}</div>`)
        .replace(/\$(?!\s)([^$\n]+?)(?<!\s)\$/g, (_, tex: string) => `<span class="math-inline">${renderLatexExpr(tex, false)}</span>`);
    })
    .join("");
}

export async function renderedHtml(locale: Locale, doc: DocLink, file: DocFile): Promise<string> {
  const source = doc.source[locale];
  const baseHtml = (await file.compiledContent())
    .replace(/^\s*<h1[^>]*>[\s\S]*?<\/h1>\s*/, "")
    .replace(/<p><a href="[^"]*\.md">(?:中文版|English)<\/a><\/p>\s*/, "")
    .replace(/<a href="([^"]*)">([\s\S]*?)<\/a>/g, (_, href: string, text: string) => {
      const resolved = repoHref(locale, source, href);
      const isExternal = /^(?:https?:)?\/\//i.test(resolved);
      if (isExternal) {
        return `<a href="${resolved}" target="_blank" rel="noopener noreferrer">${text}</a>`;
      }
      if (text.trim() === href.trim()) {
        const fullUrl = new URL(resolved, import.meta.env.SITE).href;
        return `<a href="${resolved}" data-self-url>${fullUrl}</a>`;
      }
      return `<a href="${resolved}">${text}</a>`;
    })
    .replace(/(<pre[\s\S]*?<\/pre>|<code[\s\S]*?<\/code>)|\*\*(?!\s)([^*\n]+?)(?<!\s)\*\*/g, (m, code, bold) =>
      code ? code : `<strong>${bold}</strong>`,
    );
  return renderMathInHtml(baseHtml);
}
