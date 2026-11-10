import type { Locale } from "./i18n";
import { REPO_URL } from "./site";

type Text = Record<Locale, string>;

export type LootId =
  | "evolution-core"
  | "trace-crystal"
  | "harness-gear"
  | "ontology-rune"
  | "benchmark-astrolabe";

export interface LootMaterial {
  id: LootId;
  name: Text;
  desc: Text;
}

export const LOOT_MATERIALS: Record<LootId, LootMaterial> = {
  "evolution-core": {
    id: "evolution-core",
    name: { zh: "进化核心", en: "Evolution Core" },
    desc: { zh: "核心论文复现（RSIAgent / RRSI / RSI Arena）掉落", en: "Dropped by core paper reproductions" },
  },
  "trace-crystal": {
    id: "trace-crystal",
    name: { zh: "轨迹棱晶", en: "Trace Crystal" },
    desc: { zh: "跨框架与多模型榜单评测掉落", en: "Dropped by leaderboard evaluations" },
  },
  "harness-gear": {
    id: "harness-gear",
    name: { zh: "框架齿轮", en: "Harness Gear" },
    desc: { zh: "PenguinHarness 核心功能与 LangGraph / Dify 适配掉落", en: "Dropped by harness core & framework bridges" },
  },
  "ontology-rune": {
    id: "ontology-rune",
    name: { zh: "本体符文", en: "Ontology Rune" },
    desc: { zh: "知识库插件与本体（Ontology）插件掉落", en: "Dropped by Knowledge Base & Ontology plugins" },
  },
  "benchmark-astrolabe": {
    id: "benchmark-astrolabe",
    name: { zh: "基准星盘", en: "Benchmark Astrolabe" },
    desc: { zh: "标准 Benchmark 与主页博客入门教程掉落", en: "Dropped by benchmarks & blog tutorials" },
  },
};

export interface AdventurerRank {
  level: number;
  minExp: number;
  title: Text;
}

export const ADVENTURER_RANKS: AdventurerRank[] = [
  { level: 1, minExp: 0, title: { zh: "Lv.1 Explorer", en: "Lv.1 Explorer" } },
  { level: 2, minExp: 400, title: { zh: "Lv.2 Hunter", en: "Lv.2 Hunter" } },
  { level: 3, minExp: 500, title: { zh: "Lv.3 Artisan", en: "Lv.3 Artisan" } },
  { level: 4, minExp: 1200, title: { zh: "Lv.4 Alchemist", en: "Lv.4 Alchemist" } },
  { level: 5, minExp: 1350, title: { zh: "Lv.5 Archon", en: "Lv.5 Archon" } },
];

export type QuestStatus = "open" | "claimed" | "in_review" | "completed";
export type QuestCategory =
  | "paper-reproduction"
  | "leaderboard-eval"
  | "plugin-ecosystem"
  | "cross-framework-rsi"
  | "tutorial-blog"
  | "harness-core";

export interface QuestItem {
  id: string;
  status: QuestStatus;
  category: QuestCategory;
  exp: number;
  loot: LootId;
  targetRepo: string;
  title: Text;
  summary: Text;
  references: { label: string; url: string }[];
  assignee?: string;
  linkedPrUrl?: string;
}

export const QUEST_CATEGORIES: Record<QuestCategory, Text> = {
  "paper-reproduction": { zh: "论文复现", en: "Paper" },
  "leaderboard-eval": { zh: "榜单评测", en: "Evaluation" },
  "plugin-ecosystem": { zh: "生态插件", en: "Plugin" },
  "cross-framework-rsi": { zh: "跨框架优化", en: "Framework RSI" },
  "tutorial-blog": { zh: "入门教程", en: "Tutorial" },
  "harness-core": { zh: "核心框架", en: "Harness" },
};

export const QUESTS: QuestItem[] = [
  {
    id: "RSI-Q001",
    status: "open",
    category: "paper-reproduction",
    exp: 800,
    loot: "evolution-core",
    targetRepo: "Prism-Shadow/penguin-harness-plugins",
    title: {
      zh: "复现 RSIAgent：面向新环境的自主探索与因果记忆构建",
      en: "Reproduce RSIAgent: Autonomous Exploration in New Environments",
    },
    summary: {
      zh: "复现环境探索必读论文 RSIAgent (arXiv:2609.15364)，通过 Curriculum / Actor / Verifier 先广度后深度探索构建可复用冻结记忆。",
      en: "Implement RSIAgent (arXiv:2609.15364) with broad-then-deep exploration and frozen causal memory as a PenguinHarness plugin.",
    },
    references: [{ label: "arXiv:2609.15364", url: "https://arxiv.org/abs/2609.15364" }],
  },
  {
    id: "RSI-Q002",
    status: "open",
    category: "paper-reproduction",
    exp: 800,
    loot: "evolution-core",
    targetRepo: "Prism-Shadow/penguin-harness-plugins",
    title: {
      zh: "复现 RRSI：防过拟合的正则化 Agent Harness 递归自进化",
      en: "Reproduce RRSI: Regularized RSI of Agent Harnesses",
    },
    summary: {
      zh: "复现 Harness 泛化必读论文 RRSI (arXiv:2609.24972)，实现退火预算 Proposer、防过拟合 Critic 与 Pruner，验证跨基准 OOD 泛化。",
      en: "Implement RRSI (arXiv:2609.24972) with annealed proposer budget, critic, and pruner to improve OOD benchmark generalization.",
    },
    references: [
      { label: "arXiv:2609.24972", url: "https://arxiv.org/abs/2609.24972" },
      { label: "google-research/rrsi", url: "https://github.com/google-research/rrsi" },
    ],
  },
  {
    id: "RSI-Q003",
    status: "open",
    category: "paper-reproduction",
    exp: 750,
    loot: "evolution-core",
    targetRepo: "Prism-Shadow/penguin-harness",
    title: {
      zh: "复现 RSI Arena：引入人类盲测反馈的多轮自进化闭环",
      en: "Reproduce RSI Arena: Multi-Round RSI with Human Feedback",
    },
    summary: {
      zh: "参考 RSI Arena（13,000 GPU 小时、20 基准、3,129 票人类盲测），构建支持人类盲测对比与反馈回流的双轮自进化工作流。",
      en: "Build a two-round blind human preference feedback loop inspired by the 13,000 GPU-hour RSI Arena study.",
    },
    references: [{ label: "Leaderboards", url: "https://penguin.ooo/leaderboards/harness-comparison" }],
  },
  {
    id: "RSI-Q004",
    status: "open",
    category: "leaderboard-eval",
    exp: 600,
    loot: "trace-crystal",
    targetRepo: "Prism-Shadow/penguin-harness-benchmark",
    title: {
      zh: "不同框架的自进化效果对比（扩充 harness-comparison 榜单）",
      en: "Cross-Framework RSI Comparison (harness-comparison Leaderboard)",
    },
    summary: {
      zh: "评测 PenguinHarness 以外主流框架（OpenHands、Claude Code、Codex CLI、SWE-agent 等）在自进化前后的得分与成本对比。",
      en: "Benchmark pre- and post-evolution gains across external agent harnesses on the harness-comparison leaderboard.",
    },
    references: [{ label: "harness-comparison", url: "https://penguin.ooo/leaderboards/harness-comparison" }],
  },
  {
    id: "RSI-Q005",
    status: "open",
    category: "leaderboard-eval",
    exp: 550,
    loot: "trace-crystal",
    targetRepo: "Prism-Shadow/penguin-harness-benchmark",
    title: {
      zh: "更多基座模型的进化能力对比（扩充 gdpevo-essential 榜单）",
      en: "Multi-Model Evolution Comparison (gdpevo-essential Leaderboard)",
    },
    summary: {
      zh: "在 GDPEVO Essential 六大子集上补充 Kimi-K3、GLM-5.3、Qwen3、Claude、Gemini、GPT 等模型的自进化幅度对比。",
      en: "Evaluate Kimi-K3, GLM-5.3, Qwen3, Claude, Gemini, and GPT across the 6 GDPEVO Essential sub-benchmarks.",
    },
    references: [{ label: "gdpevo-essential", url: "https://penguin.ooo/leaderboards/gdpevo-essential" }],
  },
  {
    id: "RSI-Q006",
    status: "open",
    category: "plugin-ecosystem",
    exp: 500,
    loot: "ontology-rune",
    targetRepo: "Prism-Shadow/penguin-harness-plugins",
    title: {
      zh: "开发 PenguinHarness 知识库插件",
      en: "Build PenguinHarness Knowledge Base Plugin",
    },
    summary: {
      zh: "支持多源文档切分、混合检索、行内引用（[1][2]）以及从执行轨迹中自动沉淀领域知识。",
      en: "Document ingestion, hybrid retrieval, inline citations ([1][2]), and trace-driven knowledge curation.",
    },
    references: [{ label: "penguin-harness-plugins", url: "https://github.com/Prism-Shadow/penguin-harness-plugins" }],
  },
  {
    id: "RSI-Q007",
    status: "open",
    category: "plugin-ecosystem",
    exp: 550,
    loot: "ontology-rune",
    targetRepo: "Prism-Shadow/penguin-harness-plugins",
    title: {
      zh: "开发 PenguinHarness 本体（Ontology）插件",
      en: "Build PenguinHarness Ontology Plugin",
    },
    summary: {
      zh: "构建强类型对象、关系与因果动作契约建模插件，支持从 RSI 失败轨迹中自动发现约束并演化本体。",
      en: "Typed entity-relation-action ontology plugin with trace-driven schema refinement.",
    },
    references: [{ label: "penguin-harness-plugins", url: "https://github.com/Prism-Shadow/penguin-harness-plugins" }],
  },
  {
    id: "RSI-Q008",
    status: "open",
    category: "cross-framework-rsi",
    exp: 450,
    loot: "harness-gear",
    targetRepo: "Prism-Shadow/penguin-harness-community",
    title: {
      zh: "使用 PenguinHarness RSI 优化 LangGraph 智能体示例",
      en: "Optimize LangGraph Agents with PenguinHarness RSI",
    },
    summary: {
      zh: "将 LangGraph 工作流接入 PenguinHarness 评测与 RSI 闭环，自动优化节点 Prompt 与路由逻辑并验证提分。",
      en: "End-to-end example wrapping a LangGraph agent into PenguinHarness RSI to evolve prompts and routing.",
    },
    references: [{ label: "RFC-0002", url: "/rfcs/rfc-0002-evaluation/" }],
  },
  {
    id: "RSI-Q009",
    status: "open",
    category: "cross-framework-rsi",
    exp: 450,
    loot: "harness-gear",
    targetRepo: "Prism-Shadow/penguin-harness-community",
    title: {
      zh: "使用 PenguinHarness RSI 优化 Dify 工作流示例",
      en: "Optimize Dify Workflows with PenguinHarness RSI",
    },
    summary: {
      zh: "通过 Dify DSL 与 API 桥接评测器，使用 PenguinHarness 自动诊断失败轨迹并改写 Dify 节点配置。",
      en: "End-to-end example connecting PenguinHarness RSI to Dify DSL workflows with verified accuracy gains.",
    },
    references: [{ label: "RFC-0002", url: "/rfcs/rfc-0002-evaluation/" }],
  },
  {
    id: "RSI-Q010",
    status: "open",
    category: "tutorial-blog",
    exp: 400,
    loot: "benchmark-astrolabe",
    targetRepo: "Prism-Shadow/penguin-harness-community",
    title: {
      zh: "好玩且可验证自进化效果的入门教程（发布至 Penguin 博客）",
      en: "Playful & Verifiable Beginner Tutorial for Penguin Blog",
    },
    summary: {
      zh: "设计 15 分钟趣味小任务（如策略闯关或解谜），直观展示 Agent 经 3 轮自进化后的胜率跃升，入选发布至 penguin.ooo 博客。",
      en: "Fun 15-minute tutorial showing clear multi-round RSI gains on a playful task, featured on penguin.ooo.",
    },
    references: [{ label: "penguin.ooo", url: "https://penguin.ooo" }],
  },
  {
    id: "RSI-Q011",
    status: "in_review",
    category: "harness-core",
    exp: 350,
    loot: "harness-gear",
    targetRepo: "Prism-Shadow/penguin-harness",
    title: {
      zh: "支持 Agent 作者元数据与按作者分组展示 (#1508)",
      en: "Agent Author Metadata & Author-Grouped Directory (#1508)",
    },
    summary: {
      zh: "在 core/server/cli/web 中支持 Agent author 字段并按作者分组展示。",
      en: "Add author metadata to Agents and group the Agents page by author.",
    },
    references: [{ label: "#1508", url: "https://github.com/Prism-Shadow/penguin-harness/pull/1508" }],
    assignee: "hiyouga",
    linkedPrUrl: "https://github.com/Prism-Shadow/penguin-harness/pull/1508",
  },
  {
    id: "RSI-Q012",
    status: "in_review",
    category: "harness-core",
    exp: 450,
    loot: "harness-gear",
    targetRepo: "Prism-Shadow/penguin-harness",
    title: {
      zh: "上下文压缩交接文件与历史 Trace 查询引导 (#1491)",
      en: "Compaction Hand-Off Files & Trace Query Guidance (#1491)",
    },
    summary: {
      zh: "在上下文压缩前自动持久化交接文件，并引导新上下文按需检索历史 Trace。",
      en: "Write hand-off files before compaction and guide the next context on querying the Trace.",
    },
    references: [{ label: "#1491", url: "https://github.com/Prism-Shadow/penguin-harness/pull/1491" }],
    assignee: "hiyouga",
    linkedPrUrl: "https://github.com/Prism-Shadow/penguin-harness/pull/1491",
  },
  {
    id: "RSI-Q013",
    status: "completed",
    category: "leaderboard-eval",
    exp: 700,
    loot: "evolution-core",
    targetRepo: "Prism-Shadow/penguin-harness-benchmark",
    title: {
      zh: "GDPEVO Essential 六大领域与 4 种 RSI 算法对比评测 (#20)",
      en: "GDPEVO Essential 6-Domain & 4 RSI Methods Evaluation (#20)",
    },
    summary: {
      zh: "完成 SkillAdam、SkillOpt、OpenSkill、Trace 与基线在 6 个独立子集上的 30 组评测并上线榜单。",
      en: "Evaluated SkillAdam, SkillOpt, OpenSkill, and Trace across 6 GDPEVO sub-benchmarks.",
    },
    references: [{ label: "#20", url: "https://github.com/Prism-Shadow/penguin-harness-benchmark/pull/20" }],
    assignee: "Saigyouji-Yuyuko1000",
    linkedPrUrl: "https://github.com/Prism-Shadow/penguin-harness-benchmark/pull/20",
  },
  {
    id: "RSI-Q014",
    status: "completed",
    category: "leaderboard-eval",
    exp: 600,
    loot: "trace-crystal",
    targetRepo: "Prism-Shadow/penguin-harness-benchmark",
    title: {
      zh: "Sec A–E 跨框架首期评测与榜单发布 (#21)",
      en: "Sec A–E Cross-Harness Evaluation & Leaderboard (#21)",
    },
    summary: {
      zh: "完成 PenguinHarness、DSH、Pi、Codex 在 Sec A–E 上的跨框架评测。",
      en: "Cross-harness evaluation of PenguinHarness, DSH, Pi, and Codex across Sec A–E.",
    },
    references: [{ label: "#21", url: "https://github.com/Prism-Shadow/penguin-harness-benchmark/pull/21" }],
    assignee: "Saigyouji-Yuyuko1000",
    linkedPrUrl: "https://github.com/Prism-Shadow/penguin-harness-benchmark/pull/21",
  },
  {
    id: "RSI-Q015",
    status: "completed",
    category: "harness-core",
    exp: 500,
    loot: "harness-gear",
    targetRepo: "Prism-Shadow/penguin-harness",
    title: {
      zh: "发布插件接口生成器 penguin-gen-ifaces (#1475)",
      en: "Publish Interface Generator penguin-gen-ifaces (#1475)",
    },
    summary: {
      zh: "规范插件 ifaces.json 构建与静态模块贡献校验。",
      en: "Generate plugin interface manifests and validate literal module contributions.",
    },
    references: [{ label: "#1475", url: "https://github.com/Prism-Shadow/penguin-harness/pull/1475" }],
    assignee: "hiyouga",
    linkedPrUrl: "https://github.com/Prism-Shadow/penguin-harness/pull/1475",
  },
  {
    id: "RSI-Q016",
    status: "completed",
    category: "harness-core",
    exp: 400,
    loot: "harness-gear",
    targetRepo: "Prism-Shadow/penguin-harness",
    title: {
      zh: "抽离独立交互式富组件包 @prismshadow/a2ui (#1474)",
      en: "Extract Standalone @prismshadow/a2ui Package (#1474)",
    },
    summary: {
      zh: "将 A2UI 语法从 core 抽离为独立包 @prismshadow/a2ui。",
      en: "Decoupled the A2UI grammar from core into @prismshadow/a2ui.",
    },
    references: [{ label: "#1474", url: "https://github.com/Prism-Shadow/penguin-harness/pull/1474" }],
    assignee: "hiyouga",
    linkedPrUrl: "https://github.com/Prism-Shadow/penguin-harness/pull/1474",
  },
  {
    id: "RSI-Q017",
    status: "completed",
    category: "leaderboard-eval",
    exp: 450,
    loot: "benchmark-astrolabe",
    targetRepo: "Prism-Shadow/penguin-harness-benchmark",
    title: {
      zh: "生物医学重复测量分析 Harbor Benchmark 迁移 (#24)",
      en: "Biomedical Harbor Benchmark Tasks under data/ (#24)",
    },
    summary: {
      zh: "将生物医学重复测量分析任务标准化为 Harbor 格式并归档于 data/。",
      en: "Standardized biomedical repeated-measure analysis Cases as Harbor tasks.",
    },
    references: [{ label: "#24", url: "https://github.com/Prism-Shadow/penguin-harness-benchmark/pull/24" }],
    assignee: "hiyouga",
    linkedPrUrl: "https://github.com/Prism-Shadow/penguin-harness-benchmark/pull/24",
  },
  {
    id: "RSI-Q018",
    status: "completed",
    category: "paper-reproduction",
    exp: 500,
    loot: "evolution-core",
    targetRepo: "Prism-Shadow/penguin-harness-benchmark",
    title: {
      zh: "ACE 与 OPRO 自进化算法工具包校准实验 (#4)",
      en: "ACE & OPRO RSI Toolkit Calibration & Baseline (#4)",
    },
    summary: {
      zh: "完成 ACE 与 OPRO 工具包校准实验及 Awesome RSI 论文分类整理。",
      en: "Calibrated ACE and OPRO RSI skills with reproducible benchmark traces.",
    },
    references: [{ label: "#4", url: "https://github.com/Prism-Shadow/penguin-harness-benchmark/pull/4" }],
    assignee: "lzh368",
    linkedPrUrl: "https://github.com/Prism-Shadow/penguin-harness-benchmark/pull/4",
  },
  {
    id: "RSI-Q019",
    status: "completed",
    category: "leaderboard-eval",
    exp: 500,
    loot: "benchmark-astrolabe",
    targetRepo: "Prism-Shadow/penguin-harness-community",
    title: {
      zh: "RFC-0001..0005 标准与三视图榜单协议设计 (#27)",
      en: "RFC-0001..0005 Standards & Multi-View Leaderboard Spec (#27)",
    },
    summary: {
      zh: "制定 Benchmark、Evaluation、Plugin、双周会与三视图 Leaderboard 标准。",
      en: "Standardized Benchmark, Evaluation, Plugin, Meeting, and Leaderboard specs.",
    },
    references: [{ label: "#27", url: "https://github.com/Prism-Shadow/penguin-harness-community/pull/27" }],
    assignee: "ArisaZz",
    linkedPrUrl: "https://github.com/Prism-Shadow/penguin-harness-community/pull/27",
  },
];

export interface CommunityMember {
  handle: string;
  name: string;
  avatar: string;
  github: string;
  completedExp: number;
  inReviewExp: number;
  activeClaims: number;
  maxClaims: number;
}

export const FOUNDING_MEMBERS: CommunityMember[] = [
  {
    handle: "hiyouga",
    name: "Yaowei Zheng",
    avatar: "/avatar-default.svg",
    github: "https://github.com/hiyouga",
    completedExp: 1350,
    inReviewExp: 800,
    activeClaims: 2,
    maxClaims: 2,
  },
  {
    handle: "Saigyouji-Yuyuko1000",
    name: "Leijun Zhou",
    avatar: "/avatar-default.svg",
    github: "https://github.com/Saigyouji-Yuyuko1000",
    completedExp: 1300,
    inReviewExp: 0,
    activeClaims: 0,
    maxClaims: 2,
  },
  {
    handle: "lzh368",
    name: "Zhihao Liu",
    avatar: "/avatar-default.svg",
    github: "https://github.com/lzh368",
    completedExp: 500,
    inReviewExp: 0,
    activeClaims: 0,
    maxClaims: 2,
  },
  {
    handle: "ArisaZz",
    name: "Xiang Qu",
    avatar: "/avatar-default.svg",
    github: "https://github.com/ArisaZz",
    completedExp: 500,
    inReviewExp: 0,
    activeClaims: 0,
    maxClaims: 2,
  },
];

export interface CommitteeGroupMember {
  name: string;
  handle: string;
  github: string;
  direction: Text;
}

export interface CommitteeGroup {
  id: string;
  title: Text;
  members: CommitteeGroupMember[];
}

export const COMMITTEE_GROUPS: CommitteeGroup[] = [
  {
    id: "maintenance",
    title: { zh: "维护小组", en: "Maintenance Group" },
    members: [
      {
        name: "Yaowei Zheng",
        handle: "hiyouga",
        github: "https://github.com/hiyouga",
        direction: { zh: "Benchmark 方向，RSI 算法方向", en: "Benchmark, RSI Algorithm" },
      },
    ],
  },
  {
    id: "proposal",
    title: { zh: "提案小组", en: "Proposal Group" },
    members: [
      {
        name: "Xiang Qu",
        handle: "ArisaZz",
        github: "https://github.com/ArisaZz",
        direction: { zh: "RSI 算法方向", en: "RSI Algorithm" },
      },
      {
        name: "Zhihao Liu",
        handle: "lzh368",
        github: "https://github.com/lzh368",
        direction: { zh: "Benchmark 方向", en: "Benchmark" },
      },
    ],
  },
  {
    id: "review",
    title: { zh: "审核小组", en: "Review Group" },
    members: [
      {
        name: "Leijun Zhou",
        handle: "Saigyouji-Yuyuko1000",
        github: "https://github.com/Saigyouji-Yuyuko1000",
        direction: { zh: "RSI 算法方向", en: "RSI Algorithm" },
      },
      {
        name: "Zhihao Liu",
        handle: "lzh368",
        github: "https://github.com/lzh368",
        direction: { zh: "Benchmark 方向", en: "Benchmark" },
      },
    ],
  },
];

export function buildClaimIssueUrl(quest: QuestItem, locale: Locale): string {
  const title =
    locale === "zh"
      ? `[Claim] ${quest.id}: ${quest.title.zh}`
      : `[Claim] ${quest.id}: ${quest.title.en}`;
  const body =
    locale === "zh"
      ? `/claim ${quest.id}\n\n- 任务：${quest.title.zh}\n- 目标仓库：\`${quest.targetRepo}\`\n- 奖励：\`+${quest.exp} EXP\`\n- 确认本人当前同时进行中的任务数 < 2（符合 RFC-0006 上限规定）。`
      : `/claim ${quest.id}\n\n- Quest: ${quest.title.en}\n- Target Repo: \`${quest.targetRepo}\`\n- Reward: \`+${quest.exp} EXP\`\n- Confirmed fewer than 2 active claimed tasks (per RFC-0006).`;
  return `${REPO_URL}/issues/new?title=${encodeURIComponent(title)}&body=${encodeURIComponent(body)}`;
}

export function buildProposeTaskPrUrl(): string {
  return `${REPO_URL}/edit/main/community/tasks.yaml`;
}

export interface MonthlyLeaderboardRow {
  rank: number;
  member: CommunityMember;
  completedExp: number;
  inReviewExp: number;
  expSharePercent: number;
  proportionalUsd: number;
  topBonusUsd: number;
  committeeStipendUsd: number;
  totalEstimatedUsd: number;
}

export function computeMonthlyRewardLeaderboard(): {
  totalCompletedExp: number;
  rows: MonthlyLeaderboardRow[];
} {
  const sorted = [...FOUNDING_MEMBERS].sort((a, b) => b.completedExp - a.completedExp);
  const totalCompletedExp = sorted.reduce((acc, m) => acc + m.completedExp, 0) || 1;
  const topBonuses = [200, 150, 100, 25, 25];

  const rows = sorted.map((member, idx) => {
    const expShare = member.completedExp / totalCompletedExp;
    const proportionalUsd = Math.round(1100 * expShare);
    const topBonusUsd = topBonuses[idx] ?? 0;
    const committeeStipendUsd = 100;
    return {
      rank: idx + 1,
      member,
      completedExp: member.completedExp,
      inReviewExp: member.inReviewExp,
      expSharePercent: Math.round(expShare * 1000) / 10,
      proportionalUsd,
      topBonusUsd,
      committeeStipendUsd,
      totalEstimatedUsd: proportionalUsd + topBonusUsd + committeeStipendUsd,
    };
  });

  return { totalCompletedExp, rows };
}
