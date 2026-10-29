import type { DocArea } from "./site";

export type SearchArea = DocArea;

export interface SearchRecord {
  area: SearchArea;
  section: string;
  href: string;
  title: string;
  heading: string;
  text: string;
}

export interface PreparedSearchRecord extends SearchRecord {
  normalizedTitle: string;
  normalizedHeading: string;
  normalizedText: string;
}

export interface SearchPage {
  area: SearchArea;
  section: string;
  href: string;
  title: string;
  description?: string;
  body: string;
  anchors: readonly string[];
}

export interface SearchResult {
  record: PreparedSearchRecord;
  score: number;
  snippet: string;
}

export interface SearchMatchRange {
  start: number;
  end: number;
}

interface NormalizedSourceMap {
  value: string;
  sourceStarts: number[];
  sourceEnds: number[];
}

interface SearchSection {
  heading: string;
  lines: string[];
}

const SEARCH_GRAPHEME_SEGMENTER = new Intl.Segmenter(undefined, { granularity: "grapheme" });
const AREA_BONUS = 40;

export function normalizeSearchText(value: string): string {
  return value.normalize("NFKC").toLowerCase().replace(/\s+/g, " ").trim();
}

function normalizeSearchTextWithSourceMap(text: string): NormalizedSourceMap {
  let value = "";
  const sourceStarts: number[] = [];
  const sourceEnds: number[] = [];
  let pendingSpace: SearchMatchRange | null = null;
  const segments = SEARCH_GRAPHEME_SEGMENTER.segment(text);

  const append = (normalized: string, start: number, end: number) => {
    value += normalized;
    for (let index = 0; index < normalized.length; index += 1) {
      sourceStarts.push(start);
      sourceEnds.push(end);
    }
  };

  for (const { segment, index: sourceStart } of segments) {
    const sourceEnd = sourceStart + segment.length;
    const normalizedSegment = segment.normalize("NFKC").toLowerCase();

    for (const character of normalizedSegment) {
      if (/\s/u.test(character)) {
        if (value) {
          pendingSpace ??= { start: sourceStart, end: sourceEnd };
          pendingSpace.end = sourceEnd;
        }
        continue;
      }

      if (pendingSpace) {
        append(" ", pendingSpace.start, pendingSpace.end);
        pendingSpace = null;
      }
      append(character, sourceStart, sourceEnd);
    }
  }

  return { value, sourceStarts, sourceEnds };
}

function stripMarkdownFormatting(text: string): string {
  return text
    .replace(/(\*\*|~~)(?=\S)([^\n]*?\S)\1/g, "$2")
    .replace(/(^|[^\p{L}\p{N}])__(?=\S)([^\n]*?\S)__(?=$|[^\p{L}\p{N}])/gu, "$1$2")
    .replace(/(^|[^\p{L}\p{N}*_])([*_])(?=\S)([^*_\n]*?\S)\2(?=$|[^\p{L}\p{N}*_])/gu, "$1$3");
}

function stripMarkdownTableSyntax(text: string): string {
  return text
    .split("\n")
    .map((line) => {
      const trimmed = line.trim();
      if (!trimmed.startsWith("|") || !trimmed.endsWith("|")) return line;
      const cells = trimmed.slice(1, -1).split("|");
      if (cells.every((cell) => /^\s*:?-+:?\s*$/.test(cell))) return "";
      return cells.join(" ");
    })
    .join("\n");
}

export function findSearchMatchRanges(text: string, rawQuery: string): SearchMatchRange[] {
  const terms = normalizeSearchText(rawQuery).split(" ").filter(Boolean);
  if (terms.length === 0 || !text) return [];

  const { value: normalized, sourceStarts, sourceEnds } = normalizeSearchTextWithSourceMap(text);

  const ranges: SearchMatchRange[] = [];
  for (const term of terms) {
    let from = 0;
    while (from < normalized.length) {
      const match = normalized.indexOf(term, from);
      if (match < 0) break;
      const start = sourceStarts[match];
      const end = sourceEnds[match + term.length - 1];
      if (start !== undefined && end !== undefined) ranges.push({ start, end });
      from = match + Math.max(1, term.length);
    }
  }

  return ranges
    .sort((a, b) => a.start - b.start || a.end - b.end)
    .reduce<SearchMatchRange[]>((merged, range) => {
      const previous = merged[merged.length - 1];
      if (previous && range.start <= previous.end) {
        previous.end = Math.max(previous.end, range.end);
      } else {
        merged.push({ ...range });
      }
      return merged;
    }, []);
}

export function markdownToSearchText(markdown: string): string {
  const cleaned = markdown.replace(/<!--[\s\S]*?-->/g, "");
  const visibleText = cleaned
    .replace(/(`+)([\s\S]*?)\1/g, "$2")
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/<(https?:\/\/[^>]+)>/g, "$1")
    .replace(/^\s{0,3}(?:#{1,6}|>|[-+*]|\d+[.)])\s+/gm, "");

  return stripMarkdownTableSyntax(stripMarkdownFormatting(visibleText))
    .replace(/\s+/g, " ")
    .trim();
}

function splitSections(body: string): SearchSection[] {
  const sections: SearchSection[] = [{ heading: "", lines: [] }];
  let current = sections[0]!;
  let fenceMarker = "";

  for (const line of body.split("\n")) {
    const fence = /^\s*(```|~~~)/.exec(line)?.[1] ?? "";
    if (fence) {
      if (!fenceMarker) fenceMarker = fence;
      else if (fence === fenceMarker) fenceMarker = "";
      current.lines.push(line);
      continue;
    }

    if (!fenceMarker) {
      const heading = /^(#{2,3})\s+(.+?)\s*$/.exec(line);
      if (heading) {
        current = { heading: markdownToSearchText(heading[2]!), lines: [] };
        sections.push(current);
        continue;
      }
    }

    current.lines.push(line);
  }

  return sections;
}

export function buildSearchRecords(pages: readonly SearchPage[]): SearchRecord[] {
  return pages.flatMap((page) => {
    const sections = splitSections(page.body);
    const aligned = page.anchors.length === sections.length - 1;
    return sections.map((section, index) => {
      const body = markdownToSearchText(section.lines.join("\n"));
      const anchor = index > 0 && aligned ? page.anchors[index - 1] : "";
      return {
        area: page.area,
        section: page.section,
        href: anchor ? `${page.href}#${anchor}` : page.href,
        title: page.title,
        heading: section.heading,
        text: index === 0 ? [page.description, body].filter(Boolean).join(" ") : body,
      };
    });
  });
}

export function prepareSearchRecords(records: readonly SearchRecord[]): PreparedSearchRecord[] {
  return records.map((record) => ({
    ...record,
    normalizedTitle: normalizeSearchText(record.title),
    normalizedHeading: normalizeSearchText(record.heading),
    normalizedText: normalizeSearchText(record.text),
  }));
}

function firstMatchIndex(text: string, query: string, terms: readonly string[]): number {
  const phrase = text.indexOf(query);
  if (phrase >= 0) return phrase;
  let first = -1;
  for (const term of terms) {
    const index = text.indexOf(term);
    if (index >= 0 && (first < 0 || index < first)) first = index;
  }
  return first;
}

function graphemeBoundaryAtOrBefore(text: string, offset: number): number {
  let boundary = 0;
  for (const { index } of SEARCH_GRAPHEME_SEGMENTER.segment(text)) {
    if (index > offset) break;
    boundary = index;
  }
  return boundary;
}

function graphemeBoundaryAtSnippetEnd(text: string, start: number, maxLength: number): number {
  const limit = start + maxLength;
  let end = start;
  for (const { segment, index } of SEARCH_GRAPHEME_SEGMENTER.segment(text)) {
    if (index < start) continue;
    const next = index + segment.length;
    if (next > limit) return end === start ? next : end;
    end = next;
  }
  return text.length;
}

export function createSearchSnippet(text: string, query: string, maxLength = 150): string {
  if (text.length <= maxLength) return text;
  const { value: normalized, sourceStarts } = normalizeSearchTextWithSourceMap(text);
  const normalizedQuery = normalizeSearchText(query);
  const terms = normalizedQuery.split(" ").filter(Boolean);
  const match = firstMatchIndex(normalized, normalizedQuery, terms);
  const matchSourceStart = match < 0 ? 0 : (sourceStarts[match] ?? 0);
  const preferredStart = Math.max(0, matchSourceStart - Math.floor(maxLength / 3));
  const start = graphemeBoundaryAtOrBefore(text, preferredStart);
  const end = graphemeBoundaryAtSnippetEnd(text, start, maxLength);
  return `${start > 0 ? "…" : ""}${text.slice(start, end).trim()}${end < text.length ? "…" : ""}`;
}

function scoreRecord(record: PreparedSearchRecord, query: string, terms: readonly string[]): number | null {
  const combined = `${record.normalizedTitle} ${record.normalizedHeading} ${record.normalizedText}`;
  if (!terms.every((term) => combined.includes(term))) return null;

  const content = `${record.normalizedHeading} ${record.normalizedText}`;
  if (record.heading && !terms.some((term) => content.includes(term))) return null;

  let score = 0;
  const isPageResult = record.heading === "";

  if (record.normalizedTitle === query) score += isPageResult ? 240 : 40;
  else if (record.normalizedTitle.startsWith(query)) score += isPageResult ? 150 : 25;
  else if (record.normalizedTitle.includes(query)) score += isPageResult ? 110 : 15;

  if (record.normalizedHeading === query) score += 200;
  else if (record.normalizedHeading.startsWith(query)) score += 130;
  else if (record.normalizedHeading.includes(query)) score += 90;

  if (record.normalizedText.includes(query)) score += 45;

  for (const term of terms) {
    if (record.normalizedTitle.includes(term)) score += isPageResult ? 24 : 6;
    if (record.normalizedHeading.includes(term)) score += 30;
    if (record.normalizedText.includes(term)) score += 8;
  }

  const firstContentMatch = firstMatchIndex(content, query, terms);
  if (firstContentMatch >= 0) score += Math.max(0, 12 - firstContentMatch / 100);
  return score;
}

export function searchRecords(
  records: readonly PreparedSearchRecord[],
  rawQuery: string,
  limit = 10,
  area?: SearchArea,
): SearchResult[] {
  const query = normalizeSearchText(rawQuery);
  if (!query) return [];
  const terms = query.split(" ").filter(Boolean);

  return records
    .map((record, order) => {
      const score = scoreRecord(record, query, terms);
      if (score === null) return null;
      return {
        record,
        score: score + (area && record.area === area ? AREA_BONUS : 0),
        snippet: createSearchSnippet(record.text, query),
        order,
      };
    })
    .filter((result): result is SearchResult & { order: number } => result !== null)
    .sort((a, b) => b.score - a.score || a.order - b.order)
    .slice(0, limit)
    .map(({ order: _order, ...result }) => result);
}
