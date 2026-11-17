import { QUEST_DOMAINS, resolveText, type QuestDomainId, type QuestItem, type QuestStatus } from "./community";
import type { Locale } from "./i18n";

/** Lanes run top to bottom in this order: what the community has done, what is moving, what is still open. */
export const ATLAS_STATES = ["completed", "in_progress", "open"] as const satisfies readonly QuestStatus[];

export interface AtlasLink { label: string; url: string }
export interface AtlasRelation { id: string; label: string }

export interface AtlasQuest {
  id: string;
  number: number;
  domain: QuestDomainId;
  domainTitle: string;
  state: QuestStatus;
  title: string;
  summary: string;
  assignee?: string;
  links: AtlasLink[];
  related: AtlasRelation[];
}

export interface AtlasDomain {
  id: QuestDomainId;
  title: string;
  total: number;
  counts: Record<QuestStatus, number>;
  lanes: Record<QuestStatus, AtlasQuest[]>;
}

export interface Atlas {
  domains: AtlasDomain[];
  quests: AtlasQuest[];
  counts: Record<QuestStatus, number>;
  total: number;
  statuses: Record<QuestStatus, string>;
}

const issueLabel = (url: string) => {
  const m = url.match(/github\.com\/[^/]+\/([^/]+)\/(issues|pull)\/(\d+)/);
  if (!m) return url;
  const repo = m[1] === "penguin-harness-community" ? "Issue" : m[1];
  return `${repo} #${m[3]}`;
};

/** First sentence-ish line of the registry description, stripped of Markdown. The Issue holds the full text. */
function summarize(description: string): string {
  const first = (description.split(/\r?\n/)[0] || "")
    .replace(/^["']|["']$/g, "")
    .replace(/\[([^\]]+)\]\(https?:\/\/[^)]+\)/g, "$1")
    .replace(/\*\*|`/g, "")
    .trim();
  return first.length > 220 ? first.slice(0, 217) + "…" : first;
}

/**
 * Builds the community achievement tree from the Task Board registry only.
 * Relations come from `related_issue`: a quest that points at another quest's Issue,
 * or quests that share the same related Issue.
 */
export function researchAtlas(quests: QuestItem[], locale: Locale): Atlas {
  const t = (zh: string, en: string) => (locale === "zh" ? zh : en);
  const statuses: Record<QuestStatus, string> = {
    completed: t("已完成", "Completed"),
    in_progress: t("进行中", "In progress"),
    open: t("待认领", "Open"),
  };
  const domainTitle = new Map(QUEST_DOMAINS.map((d) => [d.id, d.label[locale]]));
  const byIssueUrl = new Map(quests.map((q) => [q.issueUrl, q]));
  const id = (q: QuestItem) => "q" + q.issueNumber;

  const items: AtlasQuest[] = quests.map((q) => {
    const links: AtlasLink[] = [{ label: "Issue #" + q.issueNumber, url: q.issueUrl }];
    if (q.linkedPr) links.push({ label: "PR #" + q.linkedPr.split("/").pop(), url: q.linkedPr });
    for (const ref of q.references)
      if (ref.url.startsWith("https://penguin.ooo/leaderboards/")) links.push({ label: t("实验榜单", "Leaderboard"), url: ref.url });

    const related: AtlasRelation[] = [];
    const target = q.relatedIssue ? byIssueUrl.get(q.relatedIssue) : undefined;
    if (target) related.push({ id: id(target), label: t("关联任务", "Related quest") });
    else if (q.relatedIssue) links.push({ label: t("关联 ", "Related ") + issueLabel(q.relatedIssue), url: q.relatedIssue });
    for (const other of quests) {
      if (other === q || other === target) continue;
      if (other.relatedIssue === q.issueUrl) related.push({ id: id(other), label: t("关联任务", "Related quest") });
      else if (q.relatedIssue && other.relatedIssue === q.relatedIssue)
        related.push({ id: id(other), label: t("同属 ", "Shares ") + issueLabel(q.relatedIssue) });
    }

    return {
      id: id(q),
      number: q.issueNumber,
      domain: q.domain,
      domainTitle: domainTitle.get(q.domain)!,
      state: q.status,
      title: resolveText(q.title, locale),
      summary: summarize(resolveText(q.description, locale)),
      ...(q.assignee ? { assignee: q.assignee } : {}),
      links,
      related,
    };
  });

  // Newest Issue first inside a lane, so fresh work sits next to its status.
  const sorted = [...items].sort((a, b) => b.number - a.number);
  const tally = (list: AtlasQuest[]) =>
    Object.fromEntries(ATLAS_STATES.map((s) => [s, list.filter((q) => q.state === s).length])) as Record<QuestStatus, number>;
  const domains: AtlasDomain[] = QUEST_DOMAINS.map((d) => {
    const group = sorted.filter((q) => q.domain === d.id);
    return {
      id: d.id,
      title: d.label[locale],
      total: group.length,
      counts: tally(group),
      lanes: Object.fromEntries(ATLAS_STATES.map((s) => [s, group.filter((q) => q.state === s)])) as Record<QuestStatus, AtlasQuest[]>,
    };
  });

  return { domains, quests: sorted, counts: tally(sorted), total: sorted.length, statuses };
}
