import { resolveText, type QuestItem, type QuestStatus } from "./community";
import { ACHIEVEMENT_TREE, type MedalDef, type Text } from "./achievement-tree";
import type { Locale } from "./i18n";

/**
 * Prerequisites unlock a medal. The result is awarded on task acceptance or an independently accepted report.
 */
export type MedalState = "lit" | "ready" | "locked";

/** Display order for the state filters and progress indicators. */
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
  column: number;
  name: string;
  intent: string;
  evidence: string;
  pending?: string;
  state: MedalState;
  routeTitle: string;
  branchTitle?: string;
  /** Related tasks, newest Issue first. */
  tasks: AtlasTask[];
  /** Listed Issue numbers the registry does not carry (yet). */
  unregistered: number[];
  requires: AtlasMedalRef[];
  anyPrerequisite: boolean;
  unlocks: AtlasMedalRef[];
  prerequisiteTasks: { number: number; title: string; url?: string; completed: boolean }[];
  acceptedReport?: string | null;
  /** Link used outside the interactive details view. */
  href: string;
}

export interface AtlasBranch {
  id: string;
  title?: string;
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

  // Resolve each milestone’s own acceptance independently of its prerequisites.
  const accepted = new Set<string>();
  const defs = new Map<string, MedalDef>();
  const built = new Map<string, AtlasMedal>();
  for (const route of ACHIEVEMENT_TREE)
    for (const branch of route.branches)
      for (const def of branch.medals) {
        defs.set(def.id, def);
        const template = def.recurringQuest && byNumber.get(def.recurringQuest);
        // The registry clones standing tasks by domain and English title.
        const instances = template && template.title.en
          ? quests.filter((q) => q.recurring && q.domain === template.domain && q.title.en === template.title.en)
          : [];
        const numbers = [...new Set([...def.quests, ...instances.map((q) => q.issueNumber)])];
        const tasks = numbers
          .map((n) => byNumber.get(n))
          .filter((q): q is QuestItem => !!q)
          .map(describe)
          .sort((a, b) => b.number - a.number);
        for (const task of tasks) claimed.add(task.number);
        const unregistered = def.quests.filter((n) => !byNumber.has(n));
        const prerequisiteTasks = (def.requiresQuests ?? []).map((number) => {
          const quest = byNumber.get(number);
          return { number, title: quest ? resolveText(quest.title, locale) : "", url: quest?.issueUrl, completed: quest?.status === "completed" };
        });
        const completed = tasks.filter((q) => q.status === "completed").length;
        const tasksAccepted = completed > 0 && (def.anyQuest || completed === numbers.length);
        if (tasksAccepted && (def.acceptedReport === undefined || def.acceptedReport)) accepted.add(def.id);
        built.set(def.id, {
          id: def.id,
          column: 0,
          name: say(def.name),
          intent: say(def.intent),
          evidence: say(def.evidence),
          ...(def.pending ? { pending: say(def.pending) } : {}),
          state: "locked",
          routeTitle: say(route.name),
          branchTitle: branch.name && say(branch.name),
          tasks,
          unregistered,
          prerequisiteTasks,
          acceptedReport: def.acceptedReport,
          requires: [],
          anyPrerequisite: def.anyPrerequisite === true,
          unlocks: [],
          href: tasks[0]?.links[0].url ?? (quests[0]?.issueUrl.replace(/\/\d+$/, "") || "#"),
        });
      }

  // Resolve dependencies before dependants, regardless of their order on the canvas.
  const resolved = new Set<string>();
  const visiting = new Set<string>();
  function resolveState(id: string): MedalState {
    const medal = built.get(id);
    if (!medal || visiting.has(id)) return "locked";
    if (resolved.has(id)) return medal.state;
    visiting.add(id);
    const parents = defs.get(id)!.requires ?? [];
    const parentStates = parents.map(resolveState);
    // Parallel outcomes share a column. Only an actual medal prerequisite advances a column.
    medal.column = 1 + Math.max(0, ...parents.map((parent) => built.get(parent)?.column ?? 0));
    const parentsReady = medal.anyPrerequisite ? parentStates.includes("lit") : parentStates.every((state) => state === "lit");
    const ready = parentsReady && medal.prerequisiteTasks.every((q) => q.completed);
    medal.state = !ready ? "locked" : accepted.has(id) ? "lit" : "ready";
    visiting.delete(id);
    resolved.add(id);
    return medal.state;
  }
  for (const id of built.keys()) resolveState(id);
  for (const [id, medal] of built) {
    const requires = defs.get(id)!.requires ?? [];
    for (const required of requires) {
      const other = built.get(required);
      if (!other) continue;
      medal.requires.push({ id: other.id, name: other.name, state: other.state });
      other.unlocks.push({ id: medal.id, name: medal.name, state: medal.state });
    }
  }
  const routes: AtlasRoute[] = ACHIEVEMENT_TREE.map((route) => {
    const branches: AtlasBranch[] = route.branches.map((branch) => {
      const medals = branch.medals.map((d) => built.get(d.id)!).sort((a, b) =>
        a.column - b.column || ATLAS_STATES.indexOf(a.state) - ATLAS_STATES.indexOf(b.state)
      );
      return { id: branch.id, title: branch.name && say(branch.name), total: medals.length, lit: medals.filter((m) => m.state === "lit").length, medals };
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
