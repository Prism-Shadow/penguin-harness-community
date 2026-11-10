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
  role: Text;
  completedExp: number;
  inReviewExp: number;
  activeClaims: number;
  maxClaims: number;
  lootInventory: { item: LootId; count: number }[];
  committeeTrack?: Text;
}

export const FOUNDING_MEMBERS: CommunityMember[] = [
  {
    handle: "hiyouga",
    name: "Yaowei Zheng",
    avatar: "https://avatars.githubusercontent.com/u/16256802?v=4",
    github: "https://github.com/hiyouga",
    role: {
      zh: "PenguinHarness & RSI Architecture",
      en: "PenguinHarness & RSI Architecture",
    },
    completedExp: 1350,
    inReviewExp: 800,
    activeClaims: 2,
    maxClaims: 2,
    lootInventory: [
      { item: "harness-gear", count: 4 },
      { item: "benchmark-astrolabe", count: 2 },
      { item: "ontology-rune", count: 1 },
    ],
    committeeTrack: { zh: "框架与基建", en: "Harness & Infra" },
  },
  {
    handle: "Saigyouji-Yuyuko1000",
    name: "Leijun Zhou",
    avatar: "https://avatars.githubusercontent.com/u/82754509?v=4",
    github: "https://github.com/Saigyouji-Yuyuko1000",
    role: {
      zh: "Benchmarks & Leaderboards",
      en: "Benchmarks & Leaderboards",
    },
    completedExp: 1300,
    inReviewExp: 0,
    activeClaims: 0,
    maxClaims: 2,
    lootInventory: [
      { item: "trace-crystal", count: 6 },
      { item: "evolution-core", count: 2 },
    ],
    committeeTrack: { zh: "评测与榜单", en: "Benchmarks & Leaderboards" },
  },
  {
    handle: "lzh368",
    name: "Zhihao Liu",
    avatar: "https://avatars.githubusercontent.com/u/174015635?v=4",
    github: "https://github.com/lzh368",
    role: {
      zh: "RSI Algorithms & Awesome RSI",
      en: "RSI Algorithms & Awesome RSI",
    },
    completedExp: 500,
    inReviewExp: 0,
    activeClaims: 0,
    maxClaims: 2,
    lootInventory: [
      { item: "evolution-core", count: 1 },
      { item: "trace-crystal", count: 2 },
    ],
    committeeTrack: { zh: "自进化算法", en: "RSI Algorithms" },
  },
  {
    handle: "ArisaZz",
    name: "Xiang Qu",
    avatar: "https://avatars.githubusercontent.com/u/74355374?v=4",
    github: "https://github.com/ArisaZz",
    role: {
      zh: "RFC Standards & Operations",
      en: "RFC Standards & Operations",
    },
    completedExp: 500,
    inReviewExp: 0,
    activeClaims: 0,
    maxClaims: 2,
    lootInventory: [
      { item: "benchmark-astrolabe", count: 2 },
      { item: "ontology-rune", count: 1 },
    ],
    committeeTrack: { zh: "标准与社区运营", en: "Standards & Operations" },
  },
];

export interface CommitteeSeat {
  status: "filled" | "recruiting";
  handle?: string;
  name?: string;
  github?: string;
  role: Text;
  stipendUsd: number;
}

export interface CommitteeDomain {
  id: string;
  title: Text;
  scope: Text;
  seats: CommitteeSeat[];
}

export const COMMITTEE_DOMAINS: CommitteeDomain[] = [
  {
    id: "harness-infra",
    title: { zh: "框架与运行时基建", en: "Harness & Runtime" },
    scope: { zh: "PenguinHarness 核心与 LangGraph / Dify 跨框架适配", en: "PenguinHarness core & LangGraph / Dify adapters" },
    seats: [
      { status: "filled", handle: "hiyouga", name: "Yaowei Zheng", github: "https://github.com/hiyouga", role: { zh: "Chair", en: "Chair" }, stipendUsd: 100 },
      { status: "recruiting", role: { zh: "Co-Chair · 正在招募", en: "Co-Chair · Recruiting" }, stipendUsd: 100 },
    ],
  },
  {
    id: "benchmark-leaderboard",
    title: { zh: "评测基准与榜单", en: "Benchmarks & Leaderboards" },
    scope: { zh: "Benchmark 准入、实验轨迹核验与排行榜维护", en: "Benchmark curation, trace verification & leaderboards" },
    seats: [
      { status: "filled", handle: "Saigyouji-Yuyuko1000", name: "Leijun Zhou", github: "https://github.com/Saigyouji-Yuyuko1000", role: { zh: "Chair", en: "Chair" }, stipendUsd: 100 },
      { status: "recruiting", role: { zh: "Co-Chair · 正在招募", en: "Co-Chair · Recruiting" }, stipendUsd: 100 },
    ],
  },
  {
    id: "harness-evolution-rsi",
    title: { zh: "Harness 自进化与泛化", en: "Harness Evolution & Generalization" },
    scope: { zh: "RRSI、ACE、OPRO 与跨分布（OOD）泛化算法复现", en: "RRSI, ACE, OPRO & OOD generalization algorithms" },
    seats: [
      { status: "filled", handle: "lzh368", name: "Zhihao Liu", github: "https://github.com/lzh368", role: { zh: "Chair", en: "Chair" }, stipendUsd: 100 },
      { status: "recruiting", role: { zh: "Co-Chair · 正在招募", en: "Co-Chair · Recruiting" }, stipendUsd: 100 },
    ],
  },
  {
    id: "community-evangelism",
    title: { zh: "社区标准、运营与教程", en: "Standards, Operations & Tutorials" },
    scope: { zh: "RFC 标准、双周会组织、博客入门教程与月度激励结算", en: "RFC standards, bi-weekly meetings, blog tutorials & rewards" },
    seats: [
      { status: "filled", handle: "ArisaZz", name: "Xiang Qu", github: "https://github.com/ArisaZz", role: { zh: "Chair", en: "Chair" }, stipendUsd: 100 },
      { status: "recruiting", role: { zh: "Co-Chair · 正在招募", en: "Co-Chair · Recruiting" }, stipendUsd: 100 },
    ],
  },
  {
    id: "env-exploration-rsi",
    title: { zh: "环境交互与探索 RSI", en: "Environment Exploration & Human RSI" },
    scope: { zh: "RSIAgent 环境探索、因果世界记忆与 RSI Arena 人类反馈闭环", en: "RSIAgent exploration, causal memory & RSI Arena human feedback" },
    seats: [
      { status: "recruiting", role: { zh: "Chair · 正在招募", en: "Chair · Recruiting" }, stipendUsd: 100 },
      { status: "recruiting", role: { zh: "Co-Chair · 正在招募", en: "Co-Chair · Recruiting" }, stipendUsd: 100 },
    ],
  },
  {
    id: "plugin-ontology",
    title: { zh: "知识库与本体插件", en: "Knowledge Base & Ontology Plugins" },
    scope: { zh: "插件市场（RFC-0003）、自演化知识库与 Ontology 本体插件", en: "Plugin registry, Knowledge Base & Ontology plugins" },
    seats: [
      { status: "recruiting", role: { zh: "Chair · 正在招募", en: "Chair · Recruiting" }, stipendUsd: 100 },
      { status: "recruiting", role: { zh: "Co-Chair · 正在招募", en: "Co-Chair · Recruiting" }, stipendUsd: 100 },
    ],
  },
];

export interface ForumThread {
  id: string;
  board: "paper" | "arena" | "bounty" | "plugin";
  pinned?: boolean;
  title: Text;
  author: string;
  handle: string;
  createdAt: string;
  replies: number;
  linkedQuestId: string;
  summary: Text;
  body: Text[];
  links?: { label: string; url: string }[];
}

export const FORUM_THREADS: ForumThread[] = [
  {
    id: "thread-rsiagent-rrsi",
    board: "paper",
    pinned: true,
    title: {
      zh: "必读双璧：环境探索 RSIAgent (2609.15364) 与 Harness 正则化演化 RRSI (2609.24972)",
      en: "Essential Reading: RSIAgent (2609.15364) & RRSI (2609.24972)",
    },
    author: "Yaowei Zheng",
    handle: "hiyouga",
    createdAt: "2026-11-09",
    replies: 28,
    linkedQuestId: "RSI-Q001",
    summary: {
      zh: "如果做环境交互 RSI 或 Harness 演化泛化，这两篇是今年绕不开的核心论文：一个做广度-深度探索与冻结因果记忆，一个做防过拟合正则化。",
      en: "Two complementary 2026 core papers: RSIAgent for environment exploration via frozen causal memory, and RRSI for regularized harness evolution.",
    },
    body: [
      {
        zh: "RSIAgent (arXiv:2609.15364) 协同 Curriculum、Actor、Verifier 智能体执行「先广度后深度」环境探索，将动作-条件-结果因果关系固化为冻结记忆，无需微调参数即可让开源模型在 OSWorld-v2 等基准上超越闭源模型（对应任务 RSI-Q001）。",
        en: "RSIAgent (arXiv:2609.15364) coordinates Curriculum, Actor, and Verifier agents using broad-then-deep exploration to build reusable frozen causal memory without updating model weights (Quest RSI-Q001).",
      },
      {
        zh: "RRSI (arXiv:2609.24972) 通过退火修改预算（Proposer）、防基准特化审查器（Critic）和 Token 剪枝器（Pruner）抑制训练集过拟合，在 5 个分布外（OOD）基准上取得最高 +4.3 分泛化提升并减少 30% Token（对应任务 RSI-Q002）。",
        en: "RRSI (arXiv:2609.24972) constrains harness evolution with an annealed proposer budget, a benchmark-overfitting critic, and a token pruner, gaining up to +4.3 pts on OOD benchmarks with 30% fewer policy tokens (Quest RSI-Q002).",
      },
    ],
    links: [
      { label: "RSIAgent (arXiv:2609.15364)", url: "https://arxiv.org/abs/2609.15364" },
      { label: "RRSI (arXiv:2609.24972)", url: "https://arxiv.org/abs/2609.24972" },
    ],
  },
  {
    id: "thread-rsi-arena",
    board: "arena",
    pinned: true,
    title: {
      zh: "RSI Arena 启示：13,000 GPU 小时、20 个基准与 3,129 票人类盲测教会我们的事",
      en: "Lessons from RSI Arena: 13,000 GPU-Hours, 20 Benchmarks & 3,129 Human Votes",
    },
    author: "Leijun Zhou",
    handle: "Saigyouji-Yuyuko1000",
    createdAt: "2026-11-09",
    replies: 34,
    linkedQuestId: "RSI-Q003",
    summary: {
      zh: "“The agents could do the engineering. People helped show them what needed fixing.” 首轮人类盲测反馈回流后，8/10 智能体在第二轮显著提升了人类偏好胜率。",
      en: "\"The agents could do the engineering. People helped show them what needed fixing.\" After round-1 human feedback, 8 of 10 agents improved human ratings in round 2.",
    },
    body: [
      {
        zh: "Bake AI 联合 HuggingFace、NVIDIA、Scale AI、Stanford、MIT、UCLA、UCSB、NYU、UW 与 Notre Dame 给 10 个 Agent 分配相同基座与共享 64 卡集群：当把首轮人类盲测反馈交还给 Agent 自主决定如何改进后，8/10 在第二轮超越了基线，且这种真实体验提升并未单纯反映在静态指标上（对应任务 RSI-Q003）。",
        en: "In RSI Arena (Bake AI with HuggingFace, NVIDIA, Scale AI, Stanford, MIT, UCLA, UCSB, NYU, UW, and Notre Dame), 10 agents shared a 64-GPU cluster. Feeding round-1 blind human feedback back to the agents enabled 8 of 10 to improve human preference ratings in round 2 — gains that static benchmarks alone did not capture (Quest RSI-Q003).",
      },
    ],
  },
  {
    id: "thread-leaderboards",
    board: "arena",
    title: {
      zh: "跨框架自进化对比 (harness-comparison) 与多模型进化矩阵 (gdpevo-essential) 二期征集",
      en: "Phase II Call: Cross-Harness RSI (harness-comparison) & Multi-Model Matrix (gdpevo-essential)",
    },
    author: "Leijun Zhou",
    handle: "Saigyouji-Yuyuko1000",
    createdAt: "2026-11-08",
    replies: 19,
    linkedQuestId: "RSI-Q004",
    summary: {
      zh: "首期 Sec A–E 与 GDPEVO 四算法对比已上线，欢迎认领 RSI-Q004 与 RSI-Q005 补充更多外部框架与基座模型。",
      en: "Phase I is live on penguin.ooo; claim RSI-Q004 or RSI-Q005 to evaluate additional frameworks and models.",
    },
    body: [
      {
        zh: "首期实验已合入 penguin-harness-benchmark（#20, #21）。二期重点评测 OpenHands、Claude Code、Codex CLI、SWE-agent 等框架的自进化前后收益，以及 Kimi-K3、GLM-5.3、Qwen3、Claude、Gemini、GPT 的进化潜力对比。",
        en: "Phase I is merged in penguin-harness-benchmark (#20, #21). Phase II expands to OpenHands, Claude Code, Codex CLI, SWE-agent, and additional frontier models.",
      },
    ],
    links: [
      { label: "harness-comparison", url: "https://penguin.ooo/leaderboards/harness-comparison" },
      { label: "gdpevo-essential", url: "https://penguin.ooo/leaderboards/gdpevo-essential" },
    ],
  },
  {
    id: "thread-plugins-bridges",
    board: "plugin",
    title: {
      zh: "知识库插件、本体插件，以及用 PenguinHarness RSI 优化 LangGraph / Dify 工作流",
      en: "Knowledge Base, Ontology Plugin, and Optimizing LangGraph & Dify with RSI",
    },
    author: "Zhihao Liu",
    handle: "lzh368",
    createdAt: "2026-11-07",
    replies: 15,
    linkedQuestId: "RSI-Q008",
    summary: {
      zh: "围绕知识库（RSI-Q006）、Ontology（RSI-Q007）以及外部 LangGraph / Dify 工作流自动进化（RSI-Q008 / Q009）的接口设计。",
      en: "Design notes for Knowledge Base (RSI-Q006), Ontology (RSI-Q007), and LangGraph / Dify RSI optimization (RSI-Q008 / Q009).",
    },
    body: [
      {
        zh: "将外部 LangGraph 图或 Dify DSL YAML 包装为符合 RFC-0002 的评测器，即可复用 PenguinHarness 的 ACE / OPRO 优化器自动诊断失败轨迹并改写节点提示词。",
        en: "By wrapping LangGraph graphs or Dify DSL workflows as RFC-0002 evaluators, PenguinHarness's ACE/OPRO optimizers can automatically diagnose failure traces and evolve node prompts.",
      },
    ],
  },
  {
    id: "thread-tutorial",
    board: "bounty",
    title: {
      zh: "15 分钟趣味自进化入门教程征集（入选直通 Penguin 主页博客）",
      en: "Call for Playful 15-Minute RSI Beginner Tutorials (Featured on Penguin Blog)",
    },
    author: "Xiang Qu",
    handle: "ArisaZz",
    createdAt: "2026-11-06",
    replies: 22,
    linkedQuestId: "RSI-Q010",
    summary: {
      zh: "用好玩的小游戏或解谜任务直观展示 3 轮自进化前后的胜率跃升与规则 Diff，完成后署名发布于 penguin.ooo 博客。",
      en: "Demonstrate 3-round self-evolution on a fun puzzle or game task; selected tutorials are published on penguin.ooo.",
    },
    body: [
      {
        zh: "无需昂贵算力，重点在于任务有趣、进化出的 Playbook / Skill 直观可读、15 分钟内可复现（对应任务 RSI-Q010）。",
        en: "Low compute cost, playful task design, and clear before/after playbook diffs reproducible in 15 minutes (Quest RSI-Q010).",
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

export function buildCommitteeApplyUrl(domain: CommitteeDomain, seatRole: string, locale: Locale): string {
  const title =
    locale === "zh"
      ? `[Committee] 申请委员会：${domain.title.zh}`
      : `[Committee] Apply for ${domain.title.en}`;
  const body = `/apply-committee ${domain.id}\n\n- Track: ${domain.title[locale]} (${seatRole})\n- Stipend: $100 USD / month\n- GitHub: @\n- Relevant RSI / Open-Source Contributions:`;
  return `${REPO_URL}/issues/new?title=${encodeURIComponent(title)}&body=${encodeURIComponent(body)}`;
}

export function buildNewThreadIssueUrl(locale: Locale): string {
  const title = locale === "zh" ? `[Discussion] 填写讨论标题` : `[Discussion] Topic Title`;
  const body = `/forum-post\n\n- Channel: \`#paper\` | \`#arena\` | \`#bounty\` | \`#plugin\`\n\n### Content\n`;
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
    const committeeStipendUsd = member.committeeTrack ? 100 : 0;
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
