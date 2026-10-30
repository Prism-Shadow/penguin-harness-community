import type { MarkdownInstance } from "astro";
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

function renderLatexExpr(tex: string): string {
  let s = tex
    .trim()
    .replace(/\\text\{([^}]*)\}/g, (_, t: string) => `<span class="font-sans not-italic">${t.replace(/\\?_/g, "&#95;")}</span>`)
    .replace(/\\mathbb\{I\}/g, "𝕀")
    .replace(/\\bar\{([^}]+)\}/g, '<span class="math-bar"><i>$1</i></span>')
    .replace(/\\left\(/g, "(")
    .replace(/\\right\)/g, ")")
    .replace(/\\cdot/g, " · ")
    .replace(/\\dots/g, "…")
    .replace(/\\in/g, " ∈ ")
    .replace(/\\{([^}]*)\\}/g, "{$1}")
    .replace(/\\sum_\{([^}]+)\}\^\{([^}]+)\}/g, '<span class="math-op"><span class="math-op-sup">$2</span><span class="math-op-sym">∑</span><span class="math-op-sub">$1</span></span>')
    .replace(/\\frac\{([^{}]+)\}\{([^{}]+)\}/g, '<span class="math-frac"><span class="math-frac-num">$1</span><span class="math-frac-den">$2</span></span>');

  // Handle \sqrt{...} which may wrap inner HTML spans
  s = s.replace(/\\sqrt\{([\s\S]+)\}$/g, '<span class="math-sqrt"><span class="math-sqrt-Sign">√</span><span class="math-sqrt-body">$1</span></span>');

  // Subscripts and superscripts
  s = s
    .replace(/_\{([^}]+)\}/g, "<sub>$1</sub>")
    .replace(/\^\{([^}]+)\}/g, "<sup>$1</sup>")
    .replace(/_([a-zA-Z0-9]+)/g, "<sub>$1</sub>")
    .replace(/\^([a-zA-Z0-9*]+)/g, "<sup>$1</sup>");

  return s;
}

function renderMathInHtml(html: string): string {
  return html
    .split(/(<pre[\s\S]*?<\/pre>|<code[\s\S]*?<\/code>|<figure[\s\S]*?<\/figure>)/g)
    .map((segment, idx) => {
      if (idx % 2 === 1) return segment;
      return segment
        .replace(/<p>\$\$([\s\S]*?)\$\$<\/p>/g, (_, tex: string) => `<div class="math-block">${renderLatexExpr(tex)}</div>`)
        .replace(/\$\$([\s\S]*?)\$\$/g, (_, tex: string) => `<div class="math-block">${renderLatexExpr(tex)}</div>`)
        .replace(/\$(?!\s)([^$\n]+?)(?<!\s)\$/g, (_, tex: string) => `<span class="math-inline">${renderLatexExpr(tex)}</span>`);
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
