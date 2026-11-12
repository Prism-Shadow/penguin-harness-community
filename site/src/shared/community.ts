import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import peopleYamlRaw from "../../../community/people.yaml?raw";
import tasksYamlRaw from "../../../community/tasks.yaml?raw";
import type { Locale } from "./i18n";

type Text = Record<Locale, string>;

export type QuestStatus = "open" | "in_progress" | "completed";
export type QuestDomainId =
  | "benchmark"
  | "evaluation"
  | "rsi-algorithm"
  | "penguin-harness"
  | "awesome-rsi";

/**
 * Helper for bilingual fields where English is the default language.
 * If the requested locale's string is empty, falls back to the other language.
 */
export function resolveText(value: { en?: string; zh?: string } | string, locale: Locale): string {
  if (typeof value === "string") return value;
  const primary = locale === "zh" ? value.zh : value.en;
  const fallback = locale === "zh" ? value.en : value.zh;
  return (primary && primary.trim()) || (fallback && fallback.trim()) || "";
}

export interface QuestDomainMeta {
  id: QuestDomainId;
  label: Text;
}

export const QUEST_DOMAINS: QuestDomainMeta[] = [
  { id: "benchmark", label: { en: "Benchmark", zh: "Benchmark" } },
  { id: "evaluation", label: { en: "Evaluation", zh: "Evaluation" } },
  { id: "rsi-algorithm", label: { en: "RSI Algorithm", zh: "RSI 算法" } },
  { id: "penguin-harness", label: { en: "PenguinHarness", zh: "PenguinHarness" } },
  { id: "awesome-rsi", label: { en: "Awesome RSI", zh: "Awesome RSI" } },
];

export const TARGET_REPOSITORIES = [
  "https://github.com/Prism-Shadow/penguin-harness",
  "https://github.com/Prism-Shadow/penguin-harness-community",
  "https://github.com/Prism-Shadow/penguin-harness-benchmark",
  "https://github.com/Prism-Shadow/penguin-harness-plugins",
  "https://github.com/Prism-Shadow/awesome-rsi",
] as const;

export type TargetRepositoryUrl = (typeof TARGET_REPOSITORIES)[number];

export interface QuestReference {
  url: string;
}

export interface QuestItem {
  id: string;
  issueNumber: number;
  prNumber?: number;
  publishedAt: string;
  status: QuestStatus;
  domain: QuestDomainId;
  exp: number;
  targetRepository: TargetRepositoryUrl;
  recurring?: boolean;
  relatedIssue?: string;
  linkedPr?: string;
  title: { en?: string; zh?: string };
  description: { en?: string; zh?: string };
  references: QuestReference[];
  issueUrl: string;
  assignee?: string;
}

function normalizeDomain(raw: string | null): QuestDomainId {
  const lower = (raw || "").trim().toLowerCase();
  if (lower === "evaluation") return "evaluation";
  if (lower === "rsi algorithm" || lower === "rsi-algorithm") return "rsi-algorithm";
  if (lower === "penguinharness" || lower === "penguin-harness") return "penguin-harness";
  if (lower === "awesome rsi" || lower === "awesome-rsi") return "awesome-rsi";
  return "benchmark";
}

function parseQuestsFromYaml(content: string): QuestItem[] {
  const taskBlocks = content.split(/\n  - id:\s*/).slice(1);
  return taskBlocks.map((block) => {
    const id = block.match(/^"([^"]+)"/)?.[1] ?? "";
    const field = (name: string): string | undefined => {
      const m = block.match(new RegExp(`^    ${name}:\\s*(.+)$`, "m"));
      if (!m) return undefined;
      const val = m[1].trim();
      if (val === "null") return undefined;
      return val.replace(/^"(.*)"$/, "$1").replace(/\\"/g, '"');
    };
    const refsMatch = block.match(/^    references:\s*\n((?:      -\s*[^\n]+\n?)*)/m);
    const references: QuestReference[] = refsMatch
      ? Array.from(refsMatch[1].matchAll(/^\s*-\s*"([^"]+)"/gm), (m) => ({ url: m[1] }))
      : [];

    const issueNumber = Number(field("issue_number") || 0);
    const prNumberRaw = field("pr_number");
    const prNumber = prNumberRaw ? Number(prNumberRaw) : undefined;
    const status = (field("status") as QuestStatus) || "open";
    const domain = normalizeDomain(field("domain") ?? null);
    const exp = Number(field("exp") || 50);
    const targetRepository =
      (field("target_repository") as TargetRepositoryUrl) ||
      "https://github.com/Prism-Shadow/penguin-harness-benchmark";
    const recurring = field("recurring") === "true";
    const relatedIssue = field("related_issue");
    const linkedPr = field("linked_pr");
    const assignee = field("assignee");
    const issueUrl =
      field("issue_url") ||
      `https://github.com/Prism-Shadow/penguin-harness-community/issues/${issueNumber}`;

    return {
      id,
      issueNumber,
      ...(prNumber ? { prNumber } : {}),
      publishedAt: field("published_at") || "",
      status,
      domain,
      exp,
      targetRepository,
      ...(recurring ? { recurring: true } : {}),
      ...(relatedIssue ? { relatedIssue } : {}),
      ...(linkedPr ? { linkedPr } : {}),
      ...(assignee ? { assignee } : {}),
      title: {
        en: field("title"),
        zh: field("title_zh"),
      },
      description: {
        en: field("description"),
        zh: field("description_zh"),
      },
      references,
      issueUrl,
    };
  });
}

function loadActiveTasksYaml(): string {
  const dataDir = process.env.COMMUNITY_DATA_DIR;
  if (dataDir) {
    const syncedYamlPath = resolve(dataDir, "tasks.yaml");
    if (existsSync(syncedYamlPath)) {
      return readFileSync(syncedYamlPath, "utf8");
    }
  }
  return tasksYamlRaw;
}

export const QUESTS: QuestItem[] = parseQuestsFromYaml(loadActiveTasksYaml());

export interface CommitteeGroupMember {
  name: string;
  handle: string;
  github: string;
  avatar?: string;
  tags: Text[];
}

export interface CommitteeGroup {
  id: string;
  title: Text;
  members: CommitteeGroupMember[];
}

export const COMMITTEE_HANDLES = [
  "hiyouga",
  "ArisaZz",
  "lzh368",
  "rank-Yu",
  "Saigyouji-Yuyuko1000",
  "Myriad-Dreamin",
  "yu-yang-li",
] as const;

export const COMMITTEE_GROUPS: CommitteeGroup[] = [
  {
    id: "leadership",
    title: { en: "Project Leadership", zh: "项目主导方" },
    members: [
      {
        name: "Yaowei Zheng",
        handle: "hiyouga",
        github: "https://github.com/hiyouga",
        avatar: "/people/yaowei-zheng.jpg",
        tags: [
          { en: "Benchmark", zh: "Benchmark" },
          { en: "Algorithm", zh: "算法" },
          { en: "Harness", zh: "Harness" },
        ],
      },
    ],
  },
  {
    id: "proposal",
    title: { en: "Proposal Group", zh: "提案小组" },
    members: [
      {
        name: "Xiang Qu",
        handle: "ArisaZz",
        github: "https://github.com/ArisaZz",
        tags: [{ en: "Algorithm", zh: "算法" }],
      },
      {
        name: "Zhihao Liu",
        handle: "lzh368",
        github: "https://github.com/lzh368",
        tags: [{ en: "Benchmark", zh: "Benchmark" }],
      },
      {
        name: "Yanke Yu",
        handle: "rank-Yu",
        github: "https://github.com/rank-Yu",
        tags: [{ en: "Harness", zh: "Harness" }],
      },
      {
        name: "Yuyang Li",
        handle: "yu-yang-li",
        github: "https://github.com/yu-yang-li",
        avatar: "/people/yuyang-li.jpg",
        tags: [{ en: "AI4S", zh: "AI4S" }],
      },
    ],
  },
  {
    id: "review",
    title: { en: "Review Group", zh: "审核小组" },
    members: [
      {
        name: "Leijun Zhou",
        handle: "Saigyouji-Yuyuko1000",
        github: "https://github.com/Saigyouji-Yuyuko1000",
        avatar: "/people/leijun-zhou.jpg",
        tags: [{ en: "Algorithm", zh: "算法" }],
      },
      {
        name: "Zhihao Liu",
        handle: "lzh368",
        github: "https://github.com/lzh368",
        tags: [{ en: "Benchmark", zh: "Benchmark" }],
      },
      {
        name: "Yangxi Xiang",
        handle: "Myriad-Dreamin",
        github: "https://github.com/Myriad-Dreamin",
        tags: [{ en: "Harness", zh: "Harness" }],
      },
      {
        name: "Yuyang Li",
        handle: "yu-yang-li",
        github: "https://github.com/yu-yang-li",
        avatar: "/people/yuyang-li.jpg",
        tags: [{ en: "AI4S", zh: "AI4S" }],
      },
    ],
  },
];

export interface ContributorStats {
  name: string;
  handle: string;
  github: string;
  monthlyExp: number;
  totalExp: number;
  reachedAt: string;
}

const CONTRIBUTOR_NAME_BY_HANDLE: Record<string, string> = {
  "Saigyouji-Yuyuko1000": "Leijun Zhou",
  "Hoyant-Su": "Haoyang Su",
  "rank-Yu": "Yanke Yu",
  hiyouga: "Yaowei Zheng",
  ArisaZz: "Xiang Qu",
  lzh368: "Zhihao Liu",
  "Myriad-Dreamin": "Yangxi Xiang",
  "yu-yang-li": "Yuyang Li",
};

/**
 * Automatically settles EXP from all `completed` quests in `QUESTS`.
 * Tie-breaking rule (per RFC-0007): When two contributors have the same EXP,
 * whoever reached that EXP score earlier (earliest PR merge timestamp `reachedAt`) ranks higher.
 */
export function buildContributorsFromQuests(): ContributorStats[] {
  const byHandle = new Map<string, ContributorStats>();

  for (const q of QUESTS) {
    if (q.status !== "completed" || !q.assignee) continue;
    const handle = q.assignee;
    const existing = byHandle.get(handle) ?? {
      name: CONTRIBUTOR_NAME_BY_HANDLE[handle] ?? handle,
      handle,
      github: `https://github.com/${handle}`,
      monthlyExp: 0,
      totalExp: 0,
      reachedAt: q.publishedAt,
    };
    existing.monthlyExp += q.exp;
    existing.totalExp += q.exp;
    if (q.publishedAt > existing.reachedAt) {
      existing.reachedAt = q.publishedAt;
    }
    byHandle.set(handle, existing);
  }

  return [...byHandle.values()].sort(
    (a, b) => b.totalExp - a.totalExp || a.reachedAt.localeCompare(b.reachedAt),
  );
}

export const CONTRIBUTORS: ContributorStats[] = buildContributorsFromQuests();

export const TOP_FIVE_BONUSES_RMB = [800, 400, 200, 100, 50] as const;

export interface RankedContributorRow {
  rank: number;
  name: string;
  handle: string;
  github: string;
  exp: number;
  expRmb: number;
  topBonusRmb: number;
  totalEstimatedRmb: number;
}

export function computeContributorRankings(): {
  monthly: RankedContributorRow[];
  allTime: { rank: number; name: string; handle: string; github: string; exp: number }[];
} {
  const sortedMonthly = [...CONTRIBUTORS].sort(
    (a, b) => b.monthlyExp - a.monthlyExp || a.reachedAt.localeCompare(b.reachedAt),
  );

  const monthly: RankedContributorRow[] = sortedMonthly.map((c, idx) => {
    const expRmb = c.monthlyExp;
    const topBonusRmb = c.monthlyExp > 0 ? (TOP_FIVE_BONUSES_RMB[idx] ?? 0) : 0;
    return {
      rank: idx + 1,
      name: c.name,
      handle: c.handle,
      github: c.github,
      exp: c.monthlyExp,
      expRmb,
      topBonusRmb,
      totalEstimatedRmb: expRmb + topBonusRmb,
    };
  });

  const allTime = [...CONTRIBUTORS]
    .sort((a, b) => b.totalExp - a.totalExp || a.reachedAt.localeCompare(b.reachedAt))
    .map((c, idx) => ({
      rank: idx + 1,
      name: c.name,
      handle: c.handle,
      github: c.github,
      exp: c.totalExp,
    }));

  return { monthly, allTime };
}

function parseOpenSourceContributorsFromYaml(raw: string): string[] {
  const sectionMatch = raw.match(/(?:^|\n)open_source_contributors:\s*\n((?:\s*-\s*[^\n]+\n?)*)/);
  if (!sectionMatch) return [];
  return Array.from(sectionMatch[1].matchAll(/^\s*-\s*["']?([^"'\s#]+)["']?/gm), (m) => m[1]);
}

/**
 * Open-source contributors synced from `quests-data/quests.json`, `community/people.yaml`,
 * and unique assignees on the Task Board (`QUESTS`).
 */
export const OPEN_SOURCE_CONTRIBUTORS: string[] = (() => {
  const fromYaml = parseOpenSourceContributorsFromYaml(peopleYamlRaw);
  const fromQuests = QUESTS.map((q) => q.assignee).filter((a): a is string => Boolean(a));
  return Array.from(new Set([...fromYaml, ...fromQuests]));
})();

/**
 * Opens the standardized `.github/ISSUE_TEMPLATE/task.yml` form (committee members only).
 */
export function buildProposeTaskIssueUrl(): string {
  return "https://github.com/Prism-Shadow/penguin-harness-community/issues/new?template=task.yml";
}
