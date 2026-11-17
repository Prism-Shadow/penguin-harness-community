import { resolveText, type QuestItem, type QuestStatus } from "./community";
import { ACHIEVEMENT_TREE, type MedalDef, type Text } from "./achievement-tree";
import type { Locale } from "./i18n";

/**
 * A medal is lit only when every quest it lists is registered as completed on the Task Board.
 * It is ready while its prerequisites are lit, and locked until they are.
 */
export type MedalState = "lit" | "ready" | "locked";

/** Cards hang in this order inside a branch: what the community has, what it can push, what is still shut. */
export const ATLAS_STATES = ["lit", "ready", "locked"] as const satisfies readonly MedalState[];

export interface AtlasLink { label: string; url: string }
export interface AtlasMedalRef { id: string; name: string; state: MedalState }

export interface AtlasTask {
  number: number;
  title: string;
  status: QuestStatus;
  statusLabel: string;
  assignee?: string;
  links: AtlasLink[];
}

export interface AtlasMedal {
  id: string;
  name: string;
  intent: string;
  evidence: string;
  pending?: string;
  state: MedalState;
  routeTitle: string;
  branchTitle: string;
  /** Registered quests that light this medal, newest Issue first. */
  tasks: AtlasTask[];
  /** Listed Issue numbers the registry does not carry (yet). */
  unregistered: number[];
  requires: AtlasMedalRef[];
  unlocks: AtlasMedalRef[];
  /** Where a plain click goes: the first quest's Issue. */
  href: string;
  /** Card shorthand for the quests behind the medal, e.g. `#83 +1`. */
  tag: string;
}

export interface AtlasBranch {
  id: string;
  title: string;
  total: number;
  lit: number;
  medals: AtlasMedal[];
}

export interface AtlasRoute {
  id: string;
  title: string;
  aim: string;
  total: number;
  counts: Record<MedalState, number>;
  branches: AtlasBranch[];
}

export interface Atlas {
  routes: AtlasRoute[];
  medals: AtlasMedal[];
  counts: Record<MedalState, number>;
  total: number;
  statuses: Record<MedalState, string>;
  /** Quests registered on the Task Board that no medal claims yet. */
  unmapped: number[];
}

const tally = (list: { state: MedalState }[]) =>
  Object.fromEntries(ATLAS_STATES.map((s) => [s, list.filter((m) => m.state === s).length])) as Record<MedalState, number>;

/**
 * Builds the community achievement tree: the shape comes from `achievement-tree.ts`,
 * every lit medal and every quest link comes from the Task Board registry.
 */
export function researchAtlas(quests: QuestItem[], locale: Locale): Atlas {
  const t = (zh: string, en: string) => (locale === "zh" ? zh : en);
  const say = (text: Text) => resolveText(text, locale);
  const statuses: Record<MedalState, string> = {
    lit: t("已达成", "Achieved"),
    ready: t("可推进", "Ready"),
    locked: t("未解锁", "Locked"),
  };
  const questStatuses: Record<QuestStatus, string> = {
    completed: t("已完成", "Completed"),
    in_progress: t("进行中", "In progress"),
    open: t("待认领", "Open"),
  };
  const byNumber = new Map(quests.map((q) => [q.issueNumber, q]));
  const claimed = new Set<number>();

  const describe = (q: QuestItem): AtlasTask => {
    const links: AtlasLink[] = [{ label: "Issue #" + q.issueNumber, url: q.issueUrl }];
    if (q.linkedPr) links.push({ label: "PR #" + q.linkedPr.split("/").pop(), url: q.linkedPr });
    for (const ref of q.references)
      if (ref.url.startsWith("https://penguin.ooo/leaderboards/")) links.push({ label: t("实验榜单", "Leaderboard"), url: ref.url });
    return {
      number: q.issueNumber,
      title: resolveText(q.title, locale),
      status: q.status,
      statusLabel: questStatuses[q.status],
      ...(q.assignee ? { assignee: q.assignee } : {}),
      links,
    };
  };

  // Pass 1: resolve quests and light the medals the registry already settles.
  const defs = new Map<string, MedalDef>();
  const built = new Map<string, AtlasMedal>();
  for (const route of ACHIEVEMENT_TREE)
    for (const branch of route.branches)
      for (const def of branch.medals) {
        defs.set(def.id, def);
        const tasks = def.quests
          .map((n) => byNumber.get(n))
          .filter((q): q is QuestItem => !!q)
          .map(describe)
          .sort((a, b) => b.number - a.number);
        for (const task of tasks) claimed.add(task.number);
        const unregistered = def.quests.filter((n) => !byNumber.has(n));
        // Only the registry may light a medal, and only when it carries every quest the medal lists.
        const lit = def.quests.length > 0 && unregistered.length === 0 && tasks.every((q) => q.status === "completed");
        built.set(def.id, {
          id: def.id,
          name: say(def.name),
          intent: say(def.intent),
          evidence: say(def.evidence),
          ...(def.pending ? { pending: say(def.pending) } : {}),
          state: lit ? "lit" : "locked",
          routeTitle: say(route.name),
          branchTitle: say(branch.name),
          tasks,
          unregistered,
          requires: [],
          unlocks: [],
          href: tasks[0]?.links[0].url ?? (quests[0]?.issueUrl.replace(/\/\d+$/, "") || "#"),
          tag: def.quests.length ? `#${def.quests[0]}${def.quests.length > 1 ? ` +${def.quests.length - 1}` : ""}` : "",
        });
      }

  // Pass 2: a medal that is not lit is ready once every prerequisite is lit, and locked until then.
  for (const [id, medal] of built) {
    const requires = defs.get(id)!.requires ?? [];
    if (medal.state !== "lit") medal.state = requires.every((r) => built.get(r)?.state === "lit") ? "ready" : "locked";
    for (const required of requires) {
      const other = built.get(required);
      if (!other) continue;
      medal.requires.push({ id: other.id, name: other.name, state: other.state });
      other.unlocks.push({ id: medal.id, name: medal.name, state: medal.state });
    }
  }
  // Prerequisite states are read back after every medal has settled.
  for (const medal of built.values()) {
    for (const ref of medal.requires) ref.state = built.get(ref.id)!.state;
    for (const ref of medal.unlocks) ref.state = built.get(ref.id)!.state;
  }

  const order = (m: AtlasMedal) => ATLAS_STATES.indexOf(m.state);
  const routes: AtlasRoute[] = ACHIEVEMENT_TREE.map((route) => {
    const branches: AtlasBranch[] = route.branches.map((branch) => {
      const medals = branch.medals.map((d) => built.get(d.id)!).sort((a, b) => order(a) - order(b));
      return { id: branch.id, title: say(branch.name), total: medals.length, lit: medals.filter((m) => m.state === "lit").length, medals };
    });
    const medals = branches.flatMap((b) => b.medals);
    return { id: route.id, title: say(route.name), aim: say(route.aim), total: medals.length, counts: tally(medals), branches };
  });

  const medals = routes.flatMap((r) => r.branches.flatMap((b) => b.medals));
  return {
    routes,
    medals,
    counts: tally(medals),
    total: medals.length,
    statuses,
    unmapped: quests.filter((q) => !claimed.has(q.issueNumber)).map((q) => q.issueNumber).sort((a, b) => a - b),
  };
}
