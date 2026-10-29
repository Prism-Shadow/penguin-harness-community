import type { Locale } from "./i18n";
import { STRINGS, localePath } from "./i18n";

export const SITE_NAME = "Shared RSI Community";
export const REPO_URL = "https://github.com/Prism-Shadow/penguin-harness-community";
export const MAIN_REPO_URL = "https://github.com/Prism-Shadow/penguin-harness";
export const DISCORD_URL = "https://discord.gg/eFHKqqcU3D";
export const X_URL = "https://x.com/code_hiyouga";

let starsAtBuild: Promise<number | null> | undefined;
export function repoStars(): Promise<number | null> {
  starsAtBuild ??= fetch(REPO_URL.replace("https://github.com/", "https://api.github.com/repos/"), {
    headers: { Accept: "application/vnd.github+json" },
  })
    .then((response) => (response.ok ? response.json() : null))
    .then((data) => (data && typeof data.stargazers_count === "number" ? data.stargazers_count : null))
    .catch(() => null);
  return starsAtBuild;
}

export function formatStars(count: number): string {
  return count >= 1000 ? `${(count / 1000).toFixed(1).replace(/\.0$/, "")}k` : String(count);
}

export type DocArea = "roadmap" | "workflow" | "rfc";
type Text = Record<Locale, string>;

export interface DocLink {
  area: DocArea;
  slug: string;
  number?: string;
  title: Text;
  description?: Text;
  source: Text;
}

export interface DocSection {
  id: string;
  title: Text;
  docs: DocLink[];
}

const RFC_FILES = import.meta.glob<string>("../../../rfcs/RFC-*.md", {
  query: "?raw",
  import: "default",
  eager: true,
});

function rfcDocs(): DocLink[] {
  const title = (path: string) => RFC_FILES[path].match(/^# (.+)$/m)?.[1].trim() ?? path;
  return Object.keys(RFC_FILES)
    .filter((path) => !path.endsWith(".zh.md"))
    .sort()
    .map((path): DocLink => {
      const zh = RFC_FILES[path.replace(/\.md$/, ".zh.md")] ? path.replace(/\.md$/, ".zh.md") : path;
      const file = (glob: string) => glob.slice(glob.indexOf("rfcs/"));
      const slug = path.slice(path.lastIndexOf("/") + 1, -".md".length).toLowerCase();
      return {
        area: "rfc",
        slug,
        number: slug.match(/^rfc-(\d{4})/)?.[1],
        title: { en: title(path), zh: title(zh) },
        source: { en: file(path), zh: file(zh) },
      };
    });
}

export const ROADMAP_INDEX: DocLink = {
  area: "roadmap",
  slug: "index",
  title: { en: "Roadmap", zh: "路线图" },
  source: { en: "roadmap/README.md", zh: "roadmap/README.zh.md" },
};

export const ROADMAP_SECTIONS: DocSection[] = [
  {
    id: "roadmap",
    title: { en: "Roadmap", zh: "路线图" },
    docs: [ROADMAP_INDEX],
  },
];

export const WORKFLOW_INDEX: DocLink = {
  area: "workflow",
  slug: "index",
  title: { en: "Workflow", zh: "流程" },
  source: { en: "workflow/README.md", zh: "workflow/README.zh.md" },
};

export const WORKFLOW_SECTIONS: DocSection[] = [
  {
    id: "workflow",
    title: { en: "Workflow", zh: "流程" },
    docs: [
      WORKFLOW_INDEX,
      {
        area: "workflow",
        slug: "benchmark",
        number: "01",
        title: { en: "Submit Benchmark", zh: "提交 Benchmark" },
        source: { en: "workflow/benchmark.md", zh: "workflow/benchmark.zh.md" },
      },
      {
        area: "workflow",
        slug: "evaluation",
        number: "02",
        title: { en: "Submit Evaluation", zh: "提交 Evaluation" },
        source: { en: "workflow/evaluation.md", zh: "workflow/evaluation.zh.md" },
      },
      {
        area: "workflow",
        slug: "algorithm",
        number: "03",
        title: { en: "Submit Algorithm", zh: "提交 Algorithm" },
        source: { en: "workflow/algorithm.md", zh: "workflow/algorithm.zh.md" },
      },
      {
        area: "workflow",
        slug: "harness",
        number: "04",
        title: { en: "Contribute to PenguinHarness", zh: "参与 PenguinHarness" },
        source: { en: "workflow/harness.md", zh: "workflow/harness.zh.md" },
      },
      {
        area: "workflow",
        slug: "survey",
        number: "05",
        title: { en: "Contribute to Awesome RSI", zh: "参与 Awesome RSI" },
        source: { en: "workflow/survey.md", zh: "workflow/survey.zh.md" },
      },
    ],
  },
];

export const RFC_INDEX: DocLink = {
  area: "rfc",
  slug: "index",
  title: { en: "RFCs", zh: "标准文件" },
  source: { en: "rfcs/README.md", zh: "rfcs/README.zh.md" },
};

export const RFC_SECTIONS: DocSection[] = [
  {
    id: "rfc",
    title: { en: "RFCs", zh: "标准文件" },
    docs: [RFC_INDEX, ...rfcDocs()],
  },
];

export const ALL_ROADMAP: DocLink[] = ROADMAP_SECTIONS.flatMap((section) => section.docs);
export const ALL_WORKFLOW: DocLink[] = WORKFLOW_SECTIONS.flatMap((section) => section.docs);
export const ALL_RFCS: DocLink[] = RFC_SECTIONS.flatMap((section) => section.docs);
export const ALL_PAGES: DocLink[] = [...ALL_ROADMAP, ...ALL_WORKFLOW, ...ALL_RFCS];

export function sectionsOfArea(area: DocArea): DocSection[] {
  if (area === "roadmap") return ROADMAP_SECTIONS;
  if (area === "workflow") return WORKFLOW_SECTIONS;
  return RFC_SECTIONS;
}

export function pagesOfArea(area: DocArea): DocLink[] {
  if (area === "roadmap") return ALL_ROADMAP;
  if (area === "workflow") return ALL_WORKFLOW;
  return ALL_RFCS;
}

export function sectionOf(doc: DocLink): DocSection | undefined {
  return [...ROADMAP_SECTIONS, ...WORKFLOW_SECTIONS, ...RFC_SECTIONS].find((section) =>
    section.docs.includes(doc),
  );
}

export function docPath(doc: DocLink): string {
  if (doc.area === "roadmap") return doc === ROADMAP_INDEX ? "/roadmap/" : `/roadmap/${doc.slug}/`;
  if (doc.area === "workflow") return doc === WORKFLOW_INDEX ? "/workflow/" : `/workflow/${doc.slug}/`;
  return doc === RFC_INDEX ? "/rfcs/" : `/rfcs/${doc.slug}/`;
}

export function docMarkdownPath(doc: DocLink): string {
  if (doc.area === "roadmap") return `/roadmap/${doc.slug}.md`;
  if (doc.area === "workflow") return `/workflow/${doc.slug}.md`;
  return `/rfcs/${doc.slug}.md`;
}

export function docHref(locale: Locale, doc: DocLink): string {
  return localePath(locale, docPath(doc));
}

export function navLinks(locale: Locale) {
  const s = STRINGS[locale].nav;
  return [
    { id: "overview", label: s.overview, href: localePath(locale, "/") },
    { id: "roadmap", label: s.roadmap, href: localePath(locale, "/roadmap/") },
    { id: "workflow", label: s.workflow, href: localePath(locale, "/workflow/") },
    { id: "rfc", label: s.rfc, href: localePath(locale, "/rfcs/") },
  ];
}
