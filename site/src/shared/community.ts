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

export const TARGET_REPOSITORIES = [
  "https://github.com/Prism-Shadow/penguin-harness",
  "https://github.com/Prism-Shadow/penguin-harness-community",
  "https://github.com/Prism-Shadow/penguin-harness-benchmark",
  "https://github.com/Prism-Shadow/penguin-harness-plugins",
] as const;

export type TargetRepositoryUrl = (typeof TARGET_REPOSITORIES)[number];

export interface QuestReference {
  url: string;
}

export interface QuestItem {
  id: string;
  issueNumber?: number;
  prNumber?: number;
  status: QuestStatus;
  domain: QuestDomainId;
  exp: number;
  targetRepository: TargetRepositoryUrl;
  relatedIssue?: string;
  linkedPr?: string;
  title: { en?: string; zh?: string };
  description: { en?: string; zh?: string };
  references: QuestReference[];
  issueUrl?: string;
  assignee?: string;
}

export const QUESTS: QuestItem[] = [
  {
    id: "RSI-Q001",
    issueNumber: 30,
    status: "open",
    domain: "benchmark",
    exp: 50,
    targetRepository: "https://github.com/Prism-Shadow/penguin-harness-benchmark",
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
    ],
    issueUrl: "https://github.com/Prism-Shadow/penguin-harness-community/issues/30",
  },
  {
    id: "RSI-Q002",
    issueNumber: 31,
    status: "open",
    domain: "benchmark",
    exp: 50,
    targetRepository: "https://github.com/Prism-Shadow/penguin-harness-benchmark",
    title: {
      en: "Integrate FDE-gym",
      zh: "集成 FDE-gym",
    },
    description: {
      en: "Integrate FDE-Gym (arXiv:2610.22350 — 95 end-to-end Forward-Deployed Engineer customer delivery tasks across 20 scenarios and 18 sectors evaluating ambiguous requirement clarification, unstated constraint discovery, and live system delivery) into penguin-harness-benchmark following RFC-0001.",
      zh: "将前沿驻场工程师（Forward-Deployed Engineer）真实客户交付基准 FDE-Gym（涵盖 18 个行业、20 个客户场景的 95 个端到端交付任务，评测 Agent 在拟真生产系统中澄清模糊需求、发掘隐式约束并完成系统交付的能力）集成至 penguin-harness-benchmark（遵循 RFC-0001 规范）。",
    },
    references: [
      { url: "https://arxiv.org/abs/2610.22350" },
      { url: "https://fde-gym.com" },
      { url: "https://github.com/deeplethe/fde-gym" },
    ],
    issueUrl: "https://github.com/Prism-Shadow/penguin-harness-community/issues/31",
  },
  {
    id: "RSI-Q009",
    prNumber: 3,
    status: "completed",
    domain: "benchmark",
    exp: 50,
    targetRepository: "https://github.com/Prism-Shadow/penguin-harness-benchmark",
    linkedPr: "https://github.com/Prism-Shadow/penguin-harness-benchmark/pull/3",
    assignee: "hiyouga",
    title: {
      en: "Build 50 Multi-Domain Benchmark Tasks",
      zh: "构建 50 个多领域基准任务",
    },
    description: {
      en: "Build 50 standardized benchmark tasks across five domains (PenguinHarness Benchmark Sec A–E) with unified package manifests and grading rubrics (per RFC-0001).",
      zh: "构建涵盖 Sec A–E 五大领域的 50 个标准化基准评测任务包（penguinharness-benchmark-sec-a..e），提供统一配置清单与评分细则（遵循 RFC-0001 规范）。",
    },
    references: [],
  },
  {
    id: "RSI-Q010",
    prNumber: 5,
    status: "completed",
    domain: "benchmark",
    exp: 50,
    targetRepository: "https://github.com/Prism-Shadow/penguin-harness-benchmark",
    linkedPr: "https://github.com/Prism-Shadow/penguin-harness-benchmark/pull/5",
    assignee: "rank-Yu",
    title: {
      en: "Integrate 60-Task GDPevo Essential Dataset",
      zh: "集成 60 道 GDPevo essential 数据集",
    },
    description: {
      en: "Integrate the 60-task GDPevo Essential dataset (30 continuous task-group training tasks and 30 independent test tasks across 6 business scenarios) into penguin-harness-benchmark (per RFC-0001).",
      zh: "将 GDPevo Essential 六大业务场景共 60 道评测任务（30 道连续训练任务与 30 道独立测试任务）集成至 penguin-harness-benchmark（遵循 RFC-0001 规范）。",
    },
    references: [
      { url: "https://arxiv.org/abs/2608.03764" },
    ],
  },
  {
    id: "RSI-Q011",
    prNumber: 15,
    status: "completed",
    domain: "benchmark",
    exp: 50,
    targetRepository: "https://github.com/Prism-Shadow/penguin-harness-benchmark",
    linkedPr: "https://github.com/Prism-Shadow/penguin-harness-benchmark/pull/15",
    assignee: "Hoyant-Su",
    title: {
      en: "Build Biomedical Repeated-Measure Analysis Benchmark Tasks",
      zh: "构建生物医学重复测量分析基准任务",
    },
    description: {
      en: "Build biomedical repeated-measure prediction benchmark tasks evaluating patient-level holdout validation, acoustic feature predictive uplift, and conditional uncertainty intervals (per RFC-0001).",
      zh: "构建基于帕金森病语音重复测量数据的生物医学预测基准任务包，评测跨患者留出验证、声学特征增量预测价值与条件不确定性区间估计（遵循 RFC-0001 规范）。",
    },
    references: [],
  },
  {
    id: "RSI-Q003",
    issueNumber: 32,
    status: "open",
    domain: "evaluation",
    exp: 50,
    targetRepository: "https://github.com/Prism-Shadow/penguin-harness-benchmark",
    title: {
      en: "Codex Self-Evolution Comparison",
      zh: "Codex 的自进化效果对比",
    },
    description: {
      en: "Evaluate Codex before and after Recursive Self-Improvement (RSI) across the six GDPEVO Essential scenarios, submitting full execution traces to the GDPEVO Essential leaderboard (per RFC-0002).",
      zh: "在 GDPEVO Essential 六大评测场景上对比 Codex 在接入自进化（RSI）前后的任务解决率与 Token 成本变化，提交完整实验轨迹并补充至 GDPEVO Essential 榜单（遵循 RFC-0002 规范）。",
    },
    references: [
      { url: "https://penguin.ooo/leaderboards/gdpevo-essential" },
      { url: "https://github.com/openai/codex" },
    ],
    issueUrl: "https://github.com/Prism-Shadow/penguin-harness-community/issues/32",
  },
  {
    id: "RSI-Q004",
    issueNumber: 33,
    status: "open",
    domain: "evaluation",
    exp: 50,
    targetRepository: "https://github.com/Prism-Shadow/penguin-harness-benchmark",
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
    ],
    issueUrl: "https://github.com/Prism-Shadow/penguin-harness-community/issues/33",
  },
  {
    id: "RSI-Q012",
    prNumber: 16,
    status: "completed",
    domain: "evaluation",
    exp: 50,
    targetRepository: "https://github.com/Prism-Shadow/penguin-harness-benchmark",
    linkedPr: "https://github.com/Prism-Shadow/penguin-harness-benchmark/pull/16",
    assignee: "Saigyouji-Yuyuko1000",
    title: {
      en: "Compare DeepSeek v4.1 Evolution Across RSI Methods on GDPevo",
      zh: "在 GDPevo 上对比 Deepseek v4.1 在不同算法的进化表现",
    },
    description: {
      en: "Evaluate DeepSeek v4.1 across four RSI methods (SkillAdam, SkillOpt, TRACE, OpenSkill) and a shared baseline on all six GDPevo Essential scenarios with three test repetitions (per RFC-0002).",
      zh: "在 GDPevo Essential 六大场景上评测 DeepSeek v4.1 在 SkillAdam、SkillOpt、TRACE、OpenSkill 四种自进化算法与基线下的训练与三次重复测试表现（遵循 RFC-0002 规范）。",
    },
    references: [
      { url: "https://penguin.ooo/leaderboards/gdpevo-essential" },
    ],
  },
  {
    id: "RSI-Q013",
    prNumber: 21,
    status: "completed",
    domain: "evaluation",
    exp: 50,
    targetRepository: "https://github.com/Prism-Shadow/penguin-harness-benchmark",
    linkedPr: "https://github.com/Prism-Shadow/penguin-harness-benchmark/pull/21",
    assignee: "Saigyouji-Yuyuko1000",
    title: {
      en: "Compare Cross-Harness Capabilities with DeepSeek v4.1",
      zh: "用 DeepSeek v4.1 对比不同 harness 能力",
    },
    description: {
      en: "Benchmark DeepSeek Harness, PenguinHarness, Pi, and Codex using DeepSeek v4.1 across Sec A–E benchmarks (600 scored test runs) and publish the cross-harness leaderboard (per RFC-0002 & RFC-0005).",
      zh: "使用 DeepSeek v4.1 在 Sec A–E 五大基准（共 600 次测试采样）上系统对比 DeepSeek Harness、PenguinHarness、Pi 与 Codex 四种框架的任务得分与成本（遵循 RFC-0002 与 RFC-0005 规范）。",
    },
    references: [
      { url: "https://penguin.ooo/leaderboards/harness-comparison" },
    ],
  },
  {
    id: "RSI-Q005",
    issueNumber: 34,
    status: "open",
    domain: "rsi-algorithm",
    exp: 50,
    targetRepository: "https://github.com/Prism-Shadow/penguin-harness-plugins",
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
      { url: "https://aetherlabsai.github.io/RSIAgent/" },
      { url: "https://github.com/AetherLabsAI/RSIAgent" },
    ],
    issueUrl: "https://github.com/Prism-Shadow/penguin-harness-community/issues/34",
  },
  {
    id: "RSI-Q006",
    issueNumber: 35,
    status: "open",
    domain: "rsi-algorithm",
    exp: 50,
    targetRepository: "https://github.com/Prism-Shadow/penguin-harness-plugins",
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
    ],
    issueUrl: "https://github.com/Prism-Shadow/penguin-harness-community/issues/35",
  },
  {
    id: "RSI-Q007",
    issueNumber: 36,
    status: "open",
    domain: "penguin-harness",
    exp: 50,
    targetRepository: "https://github.com/Prism-Shadow/penguin-harness-plugins",
    title: {
      en: "Develop Knowledge Base Plugin",
      zh: "开发知识库插件",
    },
    description: {
      en: "Develop a Knowledge Base plugin for PenguinHarness supporting document ingestion, hybrid retrieval, inline citations, and trace-driven knowledge accumulation.",
      zh: "为 PenguinHarness 开发知识库插件，支持多源文档切分入库、混合检索、行内引用标注以及从 Agent 轨迹中持续沉淀领域知识。",
    },
    references: [],
    issueUrl: "https://github.com/Prism-Shadow/penguin-harness-community/issues/36",
  },
  {
    id: "RSI-Q008",
    issueNumber: 37,
    status: "open",
    domain: "penguin-harness",
    exp: 50,
    targetRepository: "https://github.com/Prism-Shadow/penguin-harness-plugins",
    title: {
      en: "Develop Ontology Plugin",
      zh: "开发本体插件",
    },
    description: {
      en: "Develop an Ontology plugin for PenguinHarness providing typed entity-relation-action modeling and trace-driven ontology refinement.",
      zh: "为 PenguinHarness 开发本体（Ontology）插件，支持实体、关系与动作契约的结构化建模及基于执行轨迹的本体自动演化。",
    },
    references: [],
    issueUrl: "https://github.com/Prism-Shadow/penguin-harness-community/issues/37",
  },
  {
    id: "RSI-Q014",
    prNumber: 1491,
    status: "completed",
    domain: "penguin-harness",
    exp: 50,
    targetRepository: "https://github.com/Prism-Shadow/penguin-harness",
    linkedPr: "https://github.com/Prism-Shadow/penguin-harness/pull/1491",
    assignee: "hiyouga",
    title: {
      en: "Optimize PenguinHarness Context Compaction Algorithm",
      zh: "优化 PenguinHarness 的压缩算法",
    },
    description: {
      en: "Optimize PenguinHarness context compaction to write structured hand-off files before summarization and guide the next context on line-by-line Trace querying.",
      zh: "优化 PenguinHarness 上下文压缩（Compaction）机制，支持在生成摘要前通过多轮工具调用将长篇计划、结论与草稿写入 handoff 文件，并附带 Trace 行级检索指引。",
    },
    references: [],
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
  "rank-Yu",
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
      {
        name: "Yanke Yu",
        handle: "rank-Yu",
        github: "https://github.com/rank-Yu",
        tags: [{ en: "Harness", zh: "Harness" }],
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
