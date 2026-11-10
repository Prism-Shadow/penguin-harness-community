import type { Locale } from "./i18n";
import { REPO_URL } from "./site";

type Text = { en: string; zh: string };

/**
 * Resolves a localized string with automatic fallback to the other language
 * if either `en` or `zh` is empty, defaulting to English first.
 */
export function resolveText(text: { en?: string; zh?: string }, locale: Locale): string {
  const primary = text[locale]?.trim();
  if (primary) return primary;
  const fallback = (locale === "en" ? text.zh : text.en)?.trim();
  return fallback || "";
}

export type QuestStatus = "open" | "in_progress" | "completed";
export type QuestDomainId = "benchmark" | "evaluation" | "rsi-algorithm" | "penguin-harness";

export interface QuestDomainInfo {
  id: QuestDomainId;
  label: Text;
}

export const QUEST_DOMAINS: QuestDomainInfo[] = [
  { id: "benchmark", label: { en: "Benchmark", zh: "Benchmark" } },
  { id: "evaluation", label: { en: "Evaluation", zh: "Evaluation" } },
  { id: "rsi-algorithm", label: { en: "RSI Algorithm", zh: "RSI 算法" } },
  { id: "penguin-harness", label: { en: "PenguinHarness", zh: "PenguinHarness" } },
];

export interface QuestReference {
  url: string;
}

export interface QuestItem {
  id: string;
  issueNumber: number;
  status: QuestStatus;
  domain: QuestDomainId;
  exp: number;
  title: { en?: string; zh?: string };
  description: { en?: string; zh?: string };
  references: QuestReference[];
  issueUrl: string;
  assignee?: string;
}

export const QUESTS: QuestItem[] = [
  {
    id: "RSI-Q001",
    issueNumber: 30,
    status: "open",
    domain: "benchmark",
    exp: 50,
    title: {
      en: "Integrate SWE-bench",
      zh: "集成 SWE-bench",
    },
    description: {
      en: "Integrate the SWE-bench software engineering benchmark into penguin-harness-benchmark with standardized container environments and grading scripts (per RFC-0001).",
      zh: "将真实 GitHub 软件工程评测基准 SWE-bench 接入 penguin-harness-benchmark，封装标准化容器评测环境与自动评分脚本（遵循 RFC-0001 规范）。",
    },
    references: [
      { url: "https://github.com/SWE-bench/SWE-bench" },
      { url: "https://arxiv.org/abs/2310.06770" },
      { url: "https://github.com/Prism-Shadow/penguin-harness-benchmark" },
    ],
    issueUrl: "https://github.com/Prism-Shadow/penguin-harness-community/issues/30",
  },
  {
    id: "RSI-Q002",
    issueNumber: 31,
    status: "open",
    domain: "benchmark",
    exp: 50,
    title: {
      en: "Integrate FDE-gym",
      zh: "集成 FDE-gym",
    },
    description: {
      en: "Integrate FDE-gym into penguin-harness-benchmark as a standard reproducible benchmark suite and verifier following RFC-0001.",
      zh: "将前沿数据与工程评测环境 FDE-gym 集成至 penguin-harness-benchmark，按 RFC-0001 标准提供可复现的评测任务集与验证器。",
    },
    references: [
      { url: "https://github.com/deeplethe/fde-gym" },
      { url: "https://github.com/Prism-Shadow/penguin-harness-benchmark" },
    ],
    issueUrl: "https://github.com/Prism-Shadow/penguin-harness-community/issues/31",
  },
  {
    id: "RSI-Q003",
    issueNumber: 32,
    status: "open",
    domain: "evaluation",
    exp: 50,
    title: {
      en: "Codex Self-Evolution Comparison",
      zh: "Codex 的自进化效果对比",
    },
    description: {
      en: "Evaluate Codex before and after Recursive Self-Improvement (RSI) on standard benchmarks, submitting full execution traces to the cross-harness leaderboard.",
      zh: "在标准评测基准上对比 Codex 在接入自进化（RSI）前后的任务解决率与 Token 成本变化，提交完整实验轨迹并更新跨框架榜单。",
    },
    references: [
      { url: "https://github.com/openai/codex" },
      { url: "https://penguin.ooo/leaderboards/harness-comparison" },
      { url: "https://github.com/Prism-Shadow/penguin-harness-benchmark" },
    ],
    issueUrl: "https://github.com/Prism-Shadow/penguin-harness-community/issues/32",
  },
  {
    id: "RSI-Q004",
    issueNumber: 33,
    status: "open",
    domain: "evaluation",
    exp: 50,
    title: {
      en: "GPT-6 Evolution Capability Experiment",
      zh: "GPT-6 模型的进化能力实验",
    },
    description: {
      en: "Measure GPT-6's multi-round self-evolution gains and generalization across standard RSI methods, contributing traces to the GDPEVO leaderboard.",
      zh: "评测 GPT-6 作为基座模型在多轮自进化（ACE / OPRO / Skill 演化）下的分数提升幅度与泛化表现，并将评测结果补充至 GDPEVO 榜单。",
    },
    references: [
      { url: "https://penguin.ooo/leaderboards/gdpevo-essential" },
      { url: "https://github.com/Prism-Shadow/penguin-harness-benchmark" },
    ],
    issueUrl: "https://github.com/Prism-Shadow/penguin-harness-community/issues/33",
  },
  {
    id: "RSI-Q005",
    issueNumber: 34,
    status: "open",
    domain: "rsi-algorithm",
    exp: 50,
    title: {
      en: "Integrate RSIAgent Method",
      zh: "集成 RSIAgent 方法",
    },
    description: {
      en: "Implement and integrate RSIAgent (arXiv:2609.15364), coordinating Curriculum, Actor, and Verifier agents for broad-then-deep exploration and frozen causal memory.",
      zh: "复现并集成 RSIAgent（arXiv:2609.15364），通过 Curriculum、Actor 与 Verifier 智能体执行先广度后深度的环境探索，构建可复用的冻结因果记忆。",
    },
    references: [
      { url: "https://arxiv.org/abs/2609.15364" },
      { url: "https://github.com/Prism-Shadow/penguin-harness-plugins" },
    ],
    issueUrl: "https://github.com/Prism-Shadow/penguin-harness-community/issues/34",
  },
  {
    id: "RSI-Q006",
    issueNumber: 35,
    status: "open",
    domain: "rsi-algorithm",
    exp: 50,
    title: {
      en: "Integrate RRSI Method",
      zh: "集成 RRSI 方法",
    },
    description: {
      en: "Implement and integrate Regularized RSI (RRSI, arXiv:2609.24972) with annealed proposer budget, anti-overfitting critic, and token pruner.",
      zh: "复现并集成正则化递归自进化方法 RRSI（arXiv:2609.24972），包含退火修改预算 Proposer、防基准过拟合 Critic 与 Token 剪枝器 Pruner。",
    },
    references: [
      { url: "https://arxiv.org/abs/2609.24972" },
      { url: "https://github.com/google-research/rrsi" },
      { url: "https://github.com/Prism-Shadow/penguin-harness-plugins" },
    ],
    issueUrl: "https://github.com/Prism-Shadow/penguin-harness-community/issues/35",
  },
  {
    id: "RSI-Q007",
    issueNumber: 36,
    status: "open",
    domain: "penguin-harness",
    exp: 50,
    title: {
      en: "Develop Knowledge Base Plugin",
      zh: "开发知识库插件",
    },
    description: {
      en: "Develop a Knowledge Base plugin for PenguinHarness supporting document ingestion, hybrid retrieval, inline citations, and trace-driven knowledge accumulation.",
      zh: "为 PenguinHarness 开发知识库插件，支持多源文档切分入库、混合检索、行内引用标注以及从 Agent 轨迹中持续沉淀领域知识。",
    },
    references: [
      { url: "https://github.com/Prism-Shadow/penguin-harness" },
      { url: "https://github.com/Prism-Shadow/penguin-harness-plugins" },
    ],
    issueUrl: "https://github.com/Prism-Shadow/penguin-harness-community/issues/36",
  },
  {
    id: "RSI-Q008",
    issueNumber: 37,
    status: "open",
    domain: "penguin-harness",
    exp: 50,
    title: {
      en: "Develop Ontology Plugin",
      zh: "开发本体插件",
    },
    description: {
      en: "Develop an Ontology plugin for PenguinHarness providing typed entity-relation-action modeling and trace-driven ontology refinement.",
      zh: "为 PenguinHarness 开发本体（Ontology）插件，支持实体、关系与动作契约的结构化建模及基于执行轨迹的本体自动演化。",
    },
    references: [
      { url: "https://github.com/Prism-Shadow/penguin-harness" },
      { url: "https://github.com/Prism-Shadow/penguin-harness-plugins" },
    ],
    issueUrl: "https://github.com/Prism-Shadow/penguin-harness-community/issues/37",
  },
];

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
  "Saigyouji-Yuyuko1000",
  "Myriad-Dreamin",
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
    ],
  },
];

export interface ContributorStats {
  name: string;
  handle: string;
  github: string;
  monthlyExp: number;
  totalExp: number;
}

export const CONTRIBUTORS: ContributorStats[] = [];

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
  // Monthly Reward Rule (up to ¥10,000 RMB monthly budget):
  // 1. 1:1 EXP-to-RMB conversion (1 EXP = ¥1 RMB)
  // 2. Top-5 bonus: #1 +¥800, #2 +¥400, #3 +¥200, #4 +¥100, #5 +¥50
  const sortedMonthly = [...CONTRIBUTORS].sort((a, b) => b.monthlyExp - a.monthlyExp);

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
    .sort((a, b) => b.totalExp - a.totalExp)
    .map((c, idx) => ({
      rank: idx + 1,
      name: c.name,
      handle: c.handle,
      github: c.github,
      exp: c.totalExp,
    }));

  return { monthly, allTime };
}

/**
 * Direct link to the GitHub Issue Form template (`.github/ISSUE_TEMPLATE/task.yml`).
 * Default language is English with separate English and Chinese fields.
 */
export function buildProposeTaskIssueUrl(): string {
  return `${REPO_URL}/issues/new?template=task.yml`;
}
