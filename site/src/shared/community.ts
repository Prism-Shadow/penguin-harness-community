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
  rarity: Text;
  color: string;
  accent: string;
  description: Text;
  sourceHint: Text;
}

export const LOOT_MATERIALS: Record<LootId, LootMaterial> = {
  "evolution-core": {
    id: "evolution-core",
    name: { zh: "进化核心", en: "Evolution Core" },
    rarity: { zh: "传说 · S 级锻造物", en: "Legendary · Tier-S Relic" },
    color: "#8b5cf6",
    accent: "#c4b5fd",
    description: {
      zh: "凝聚环境交互与递归自进化算法火种的核心结晶体，用于合成高阶进化炼金师徽章与算力大奖加成。",
      en: "Crystallized spark of recursive self-improvement algorithms; unlocks RSI Alchemist honors and compute multipliers.",
    },
    sourceHint: {
      zh: "掉落自：RSIAgent / RRSI / RSI Arena 等核心论文复现任务",
      en: "Drops from: RSIAgent, RRSI & RSI Arena paper reproduction quests",
    },
  },
  "trace-crystal": {
    id: "trace-crystal",
    name: { zh: "轨迹棱晶", en: "Trace Crystal" },
    rarity: { zh: "史诗 · A 级锻造物", en: "Epic · Tier-A Relic" },
    color: "#3b82f6",
    accent: "#93c5fd",
    description: {
      zh: "记录智能体真实执行轨迹、反思链路与帕累托前沿数据的多面棱晶，可直接参与月度 Token 额度包结算。",
      en: "Multi-faceted prism storing verified agent execution traces and Pareto frontiers; redeemable for monthly Token packs.",
    },
    sourceHint: {
      zh: "掉落自：跨框架对比评测与多模型进化榜单实验",
      en: "Drops from: Cross-harness & multi-model leaderboard evaluations",
    },
  },
  "harness-gear": {
    id: "harness-gear",
    name: { zh: "赫尔墨斯齿轮", en: "Harness Gear" },
    rarity: { zh: "史诗 · A 级锻造物", en: "Epic · Tier-A Relic" },
    color: "#f59e0b",
    accent: "#fcd34d",
    description: {
      zh: "驱动 Agent 运行时、上下文交接（Compaction）与跨框架桥接（LangGraph / Dify）的精密齿轮构件。",
      en: "Precision runtime gear driving agent harnesses, context compaction hand-offs, and LangGraph / Dify bridges.",
    },
    sourceHint: {
      zh: "掉落自：PenguinHarness 核心功能与 LangGraph / Dify 优化案例",
      en: "Drops from: PenguinHarness core features & LangGraph / Dify RSI recipes",
    },
  },
  "ontology-rune": {
    id: "ontology-rune",
    name: { zh: "本体符文", en: "Ontology Rune" },
    rarity: { zh: "史诗 · A 级锻造物", en: "Epic · Tier-A Relic" },
    color: "#10b981",
    accent: "#6ee7b7",
    description: {
      zh: "镌刻结构化知识库检索溯源与实体-关系-因果动作图谱（Ontology）的远古符文石。",
      en: "Runestone encoding self-evolving knowledge bases, typed domain entities, and causal action graphs.",
    },
    sourceHint: {
      zh: "掉落自：知识库插件与 Ontology 本体建模插件开发任务",
      en: "Drops from: Knowledge Base & Ontology plugin quests",
    },
  },
  "benchmark-astrolabe": {
    id: "benchmark-astrolabe",
    name: { zh: "基准星盘", en: "Benchmark Astrolabe" },
    rarity: { zh: "稀有 · A 级锻造物", en: "Rare · Tier-A Relic" },
    color: "#ec4899",
    accent: "#f9a8d4",
    description: {
      zh: "校准评测基准信度、指引新星探索者验证 15 分钟自进化跃迁的精密星盘。",
      en: "Precision astrolabe calibrating reproducible benchmarks and guiding playful beginner RSI tutorials.",
    },
    sourceHint: {
      zh: "掉落自：标准 Benchmark 迁移与 Penguin 主页博客趣味教程任务",
      en: "Drops from: Harbor Benchmark suites & Penguin blog beginner tutorials",
    },
  },
};

export interface AdventurerRank {
  level: number;
  minExp: number;
  title: Text;
  badgeColor: string;
  perks: Text;
}

export const ADVENTURER_RANKS: AdventurerRank[] = [
  {
    level: 1,
    minExp: 0,
    title: { zh: "Lv.1 初阶探索者", en: "Lv.1 Novice Explorer" },
    badgeColor: "text-gray-600 border-gray-300 bg-gray-100 dark:text-gray-300 dark:border-gray-700 dark:bg-gray-800",
    perks: { zh: "可同时认领最多 2 项悬赏任务，参与月末 $1,100 等比贡献池瓜分", en: "Claim up to 2 concurrent quests; eligible for the $1,100 proportional monthly pool" },
  },
  {
    level: 2,
    minExp: 400,
    title: { zh: "Lv.2 轨迹猎手", en: "Lv.2 Trace Hunter" },
    badgeColor: "text-blue-700 border-blue-300 bg-blue-50 dark:text-blue-300 dark:border-blue-800 dark:bg-blue-950/60",
    perks: { zh: "解锁评测算力补贴申请通道与社区论坛专属「轨迹猎手」头衔", en: "Unlocks evaluation token subsidies and the forum Trace Hunter flair" },
  },
  {
    level: 3,
    minExp: 500,
    title: { zh: "Lv.3 框架工匠", en: "Lv.3 Harness Artisan" },
    badgeColor: "text-emerald-700 border-emerald-300 bg-emerald-50 dark:text-emerald-300 dark:border-emerald-800 dark:bg-emerald-950/60",
    perks: { zh: "具备 RSI 社区委员会（$100/月固定津贴）候选资格，获官方博客联合署名推荐", en: "Eligible for RSI Committee nomination ($100/mo stipend) and Penguin blog co-authorship" },
  },
  {
    level: 4,
    minExp: 1200,
    title: { zh: "Lv.4 进化炼金师", en: "Lv.4 RSI Alchemist" },
    badgeColor: "text-purple-700 border-purple-300 bg-purple-50 dark:text-purple-300 dark:border-purple-800 dark:bg-purple-950/60",
    perks: { zh: "优先调配多卡 GPU 实验算力券，主导核心论文复现与双周会专题主讲", en: "Priority multi-GPU compute vouchers; lead paper reproductions and bi-weekly keynotes" },
  },
  {
    level: 5,
    minExp: 1350,
    title: { zh: "Lv.5 递归执政官", en: "Lv.5 Recursive Archon" },
    badgeColor: "text-amber-700 border-amber-300 bg-amber-50 dark:text-amber-300 dark:border-amber-700 dark:bg-amber-950/60",
    perks: { zh: "社区最高荣誉殿堂成员，参与社区路线图制定、委员会委派与联合论文核心署名", en: "Hall of Fame steward; co-authors community roadmap, RFC standards, and joint research papers" },
  },
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
  difficulty: "S" | "A" | "B";
  exp: number;
  loot: { item: LootId; count: number }[];
  targetRepo: string;
  relatedRepos?: string[];
  title: Text;
  summary: Text;
  deliverables: Text[];
  references: { label: string; url: string }[];
  assignee?: string;
  communityIssueUrl?: string;
  linkedPrUrl?: string;
  updatedAt: string;
}

export const QUEST_CATEGORIES: Record<QuestCategory, Text> = {
  "paper-reproduction": { zh: "核心论文复现", en: "Paper Reproduction" },
  "leaderboard-eval": { zh: "榜单与评测实验", en: "Leaderboard & Eval" },
  "plugin-ecosystem": { zh: "知识库与本体插件", en: "Knowledge & Ontology Plugins" },
  "cross-framework-rsi": { zh: "跨框架 RSI 优化", en: "Cross-Framework RSI" },
  "tutorial-blog": { zh: "趣味入门教程", en: "Beginner Tutorial & Blog" },
  "harness-core": { zh: "PenguinHarness 核心", en: "PenguinHarness Core" },
};

export const QUESTS: QuestItem[] = [
  {
    id: "RSI-Q001",
    status: "open",
    category: "paper-reproduction",
    difficulty: "S",
    exp: 800,
    loot: [
      { item: "evolution-core", count: 2 },
      { item: "trace-crystal", count: 3 },
    ],
    targetRepo: "Prism-Shadow/penguin-harness-plugins",
    relatedRepos: ["Prism-Shadow/penguin-harness-benchmark"],
    title: {
      zh: "复现必读论文 RSIAgent：面向新环境的自主探索与递归自进化",
      en: "Reproduce RSIAgent: Autonomous Exploration for RSI in New Environments",
    },
    summary: {
      zh: "环境交互 RSI 绕不开的今年核心论文（arXiv:2609.15364）。将 RSIAgent 复现为 PenguinHarness 标准插件：协同 Curriculum、Actor 与 Verifier 三智能体执行「先广度后深度（Broad-then-Deep）」自主环境探索，构建无需更新模型参数即可复用的冻结因果记忆（Frozen Causal Memory），并在评测基准上验证开源模型进化效果。",
      en: "Essential 2026 paper on environment-exploration RSI (arXiv:2609.15364). Implement RSIAgent as a PenguinHarness plugin coordinating Curriculum, Actor, and Verifier agents with broad-then-deep exploration to build reusable frozen causal memory.",
    },
    deliverables: [
      {
        zh: "在 penguin-harness-plugins 提交 RSIAgent 插件包（含 Curriculum/Actor/Verifier 协同与因果记忆固化）",
        en: "RSIAgent plugin in penguin-harness-plugins (Curriculum/Actor/Verifier + frozen causal memory)",
      },
      {
        zh: "在 penguin-harness-benchmark 提交探索前后对比评测轨迹与实验报告",
        en: "Pre/post exploration evaluation traces and benchmark scores in penguin-harness-benchmark",
      },
    ],
    references: [
      { label: "arXiv:2609.15364 (RSIAgent)", url: "https://arxiv.org/abs/2609.15364" },
    ],
    updatedAt: "2026-11-10",
  },
  {
    id: "RSI-Q002",
    status: "open",
    category: "paper-reproduction",
    difficulty: "S",
    exp: 800,
    loot: [
      { item: "evolution-core", count: 2 },
      { item: "harness-gear", count: 2 },
    ],
    targetRepo: "Prism-Shadow/penguin-harness-plugins",
    relatedRepos: ["Prism-Shadow/penguin-harness-benchmark"],
    title: {
      zh: "复现必读论文 RRSI：防过拟合的正则化 Agent Harness 递归自进化",
      en: "Reproduce RRSI: Regularized Recursive Self-Improvement of Agent Harnesses",
    },
    summary: {
      zh: "与 RSIAgent 相辅相成的 Harness 演化泛化核心论文（arXiv:2609.24972）。针对 Harness 自进化易在训练集过拟合、分布外（OOD）收益消失的痛点，在 PenguinHarness 中复现时间退火预算提议器（Proposer）、防基准特化审查器（Critic）与高开销改动剪枝器（Pruner），验证跨基准 OOD 泛化增益及 30% 策略 Token 缩减。",
      en: "Essential 2026 paper on harness-level RSI generalization (arXiv:2609.24972). Implement RRSI's temporally annealed proposer budget, anti-overfitting critic, and cost/token pruner in PenguinHarness, verifying out-of-distribution (OOD) benchmark transfer.",
    },
    deliverables: [
      {
        zh: "在 penguin-harness-plugins 提交 RRSI 正则化自进化插件（Proposer + Critic + Pruner）",
        en: "RRSI regularized evolution plugin in penguin-harness-plugins (Proposer + Critic + Pruner)",
      },
      {
        zh: "在 penguin-harness-benchmark 提交分布内（ID）与分布外（OOD）泛化对比实验数据",
        en: "In-distribution (ID) and out-of-distribution (OOD) generalization experiments in penguin-harness-benchmark",
      },
    ],
    references: [
      { label: "arXiv:2609.24972 (RRSI)", url: "https://arxiv.org/abs/2609.24972" },
      { label: "google-research/rrsi", url: "https://github.com/google-research/rrsi" },
    ],
    updatedAt: "2026-11-10",
  },
  {
    id: "RSI-Q003",
    status: "open",
    category: "paper-reproduction",
    difficulty: "S",
    exp: 750,
    loot: [
      { item: "evolution-core", count: 2 },
      { item: "benchmark-astrolabe", count: 2 },
    ],
    targetRepo: "Prism-Shadow/penguin-harness",
    relatedRepos: ["Prism-Shadow/penguin-harness-benchmark"],
    title: {
      zh: "复现 RSI Arena：引入人类盲测反馈的多轮递归自进化实验闭环",
      en: "RSI Arena: Multi-Round Recursive Self-Improvement with Blind Human Feedback",
    },
    summary: {
      zh: "参考 Bake AI 联合 HuggingFace、NVIDIA、Scale AI、Stanford、MIT、UCLA、UCSB、NYU、UW、Notre Dame 完成的《RSI Arena: Towards Recursive Self-Improvement with Human Feedback》（投入 13,000 GPU 小时、20 个基准、两轮收集 3,129 票人类盲测对比：将首轮人类真实体验反馈交还给 10 个自主演化 Agent 后，8/10 在第二轮显著提升了人类偏好胜率，且这种真实体验增益并非单纯刷高静态指标所能捕获）。在 PenguinHarness 构建支持人类盲测 PK 与反馈回流的双轮自进化闭环。",
      en: "Inspired by RSI Arena (13,000 GPU-hours, 20 benchmarks, 3,129 blind human votes across two rounds where 8 of 10 agents improved human preference ratings after absorbing round-1 human feedback): build a human-in-the-loop blind A/B arena and feedback-driven multi-round RSI workflow in PenguinHarness.",
    },
    deliverables: [
      {
        zh: "基于 Penguin Workbench 构建盲测双栏对比投票与人类文字反馈采集团队面板",
        en: "Blind side-by-side human preference voting & feedback collection Workbench in PenguinHarness",
      },
      {
        zh: "完成两轮人类反馈回流自进化实验，对比静态 Benchmark 分数与人类真实偏好胜率的变化",
        en: "Two-round human-feedback RSI experiment comparing benchmark metrics vs. human preference win rates",
      },
    ],
    references: [
      { label: "Harness Comparison Leaderboard", url: "https://penguin.ooo/leaderboards/harness-comparison" },
    ],
    updatedAt: "2026-11-10",
  },
  {
    id: "RSI-Q004",
    status: "open",
    category: "leaderboard-eval",
    difficulty: "A",
    exp: 600,
    loot: [
      { item: "trace-crystal", count: 3 },
      { item: "benchmark-astrolabe", count: 2 },
    ],
    targetRepo: "Prism-Shadow/penguin-harness-benchmark",
    title: {
      zh: "PenguinHarness 以外不同框架的自进化效果横向对比（Harness Comparison 扩充）",
      en: "Cross-Framework Self-Evolution Comparison on Harness Comparison Leaderboard",
    },
    summary: {
      zh: "在一期已发布 Sec A–E 四框架基线对比基础上，围绕 penguin.ooo/leaderboards/harness-comparison 扩充更多外部框架（如 OpenHands、Claude Code、Codex CLI、SWE-agent、Aider 等）在接入自进化机制前后的效果对比，完整呈现得分柱状表、成本/耗时帕累托曲线与单题华夫图。",
      en: "Expand penguin.ooo/leaderboards/harness-comparison by evaluating pre- vs. post-evolution gains across external agent harnesses (OpenHands, Claude Code, Codex CLI, SWE-agent, Aider) alongside PenguinHarness.",
    },
    deliverables: [
      {
        zh: "在 experiments/harness-comparison/ 下提交符合 RFC-0002 的跨框架自进化前后实验目录",
        en: "Standardized experiment folders under experiments/harness-comparison/ per RFC-0002",
      },
      {
        zh: "更新 leaderboards/harness-comparison/leaderboard.yaml 并验证三视图渲染",
        en: "Updated leaderboards/harness-comparison/leaderboard.yaml driving Table, Pareto, and Waffle views",
      },
    ],
    references: [
      { label: "penguin.ooo/leaderboards/harness-comparison", url: "https://penguin.ooo/leaderboards/harness-comparison" },
    ],
    updatedAt: "2026-11-10",
  },
  {
    id: "RSI-Q005",
    status: "open",
    category: "leaderboard-eval",
    difficulty: "A",
    exp: 550,
    loot: [
      { item: "trace-crystal", count: 3 },
      { item: "evolution-core", count: 1 },
    ],
    targetRepo: "Prism-Shadow/penguin-harness-benchmark",
    title: {
      zh: "更多基座大模型的自进化能力矩阵对比（GDPEVO Essential 榜单扩充）",
      en: "Multi-Model Self-Evolution Capability Matrix on GDPEVO Essential",
    },
    summary: {
      zh: "围绕 penguin.ooo/leaderboards/gdpevo-essential 榜单补充更多国内外基座模型（如 Kimi-K3、GLM-5.3、Qwen3、DeepSeek V4.1、Claude、Gemini、GPT 等）在统一 RSI 算法下的进化能力对比，按 6 个独立子集拆分实验目录并通过 mean 表达式聚合。",
      en: "Expand penguin.ooo/leaderboards/gdpevo-essential across Kimi-K3, GLM-5.3, Qwen3, DeepSeek V4.1, Claude, Gemini, and GPT to benchmark model-intrinsic self-evolution gains across the 6 GDPEVO sub-benchmarks.",
    },
    deliverables: [
      {
        zh: "在 experiments/gdpevo-essential/ 下按 6 个子集独立提交多模型进化实验结果",
        en: "Per-sub-benchmark experiment folders under experiments/gdpevo-essential/ per RFC-0002",
      },
      {
        zh: "更新 leaderboards/gdpevo-essential/leaderboard.yaml 的多模型对比条目",
        en: "Updated multi-model mean expressions in leaderboards/gdpevo-essential/leaderboard.yaml",
      },
    ],
    references: [
      { label: "penguin.ooo/leaderboards/gdpevo-essential", url: "https://penguin.ooo/leaderboards/gdpevo-essential" },
      { label: "GDPevo (arXiv:2608.03764)", url: "https://arxiv.org/pdf/2608.03764" },
    ],
    updatedAt: "2026-11-10",
  },
  {
    id: "RSI-Q006",
    status: "open",
    category: "plugin-ecosystem",
    difficulty: "A",
    exp: 500,
    loot: [
      { item: "ontology-rune", count: 2 },
      { item: "harness-gear", count: 1 },
    ],
    targetRepo: "Prism-Shadow/penguin-harness-plugins",
    relatedRepos: ["Prism-Shadow/penguin-harness"],
    title: {
      zh: "开发 PenguinHarness 知识库插件（支持混合检索、溯源引用与记忆自演化）",
      en: "PenguinHarness Self-Evolving Knowledge Base Plugin",
    },
    summary: {
      zh: "构建并发布官方 PenguinHarness 知识库插件，支持多源文档摄入、BM25 + 向量混合检索、行内严格引用标注（[1][2]）可视化管理 Workbench，并支持在 RSI 进化循环中根据失败轨迹自动修补知识盲区。",
      en: "Build and publish the PenguinHarness Knowledge Base plugin featuring document chunking, hybrid retrieval, inline citation verification ([1][2]), Workbench UI, and trace-driven knowledge curation.",
    },
    deliverables: [
      {
        zh: "符合 RFC-0003 规范的可安装知识库插件（含 Skill 与 Workbench 管理界面）",
        en: "RFC-0003 compliant Knowledge Base plugin package with Skill and Workbench UI",
      },
      {
        zh: "提交至 Prism-Shadow/penguin-harness-plugins 插件市场索引",
        en: "Published registry entry in Prism-Shadow/penguin-harness-plugins",
      },
    ],
    references: [
      { label: "penguin-harness-plugins", url: "https://github.com/Prism-Shadow/penguin-harness-plugins" },
    ],
    updatedAt: "2026-11-10",
  },
  {
    id: "RSI-Q007",
    status: "open",
    category: "plugin-ecosystem",
    difficulty: "A",
    exp: 550,
    loot: [
      { item: "ontology-rune", count: 3 },
    ],
    targetRepo: "Prism-Shadow/penguin-harness-plugins",
    relatedRepos: ["Prism-Shadow/penguin-harness"],
    title: {
      zh: "开发 PenguinHarness 本体（Ontology）插件：实体关系与因果动作图谱自演化",
      en: "PenguinHarness Ontology & Causal Action Graph Plugin",
    },
    summary: {
      zh: "构建 PenguinHarness 本体（Ontology）插件，将复杂业务或交互环境建模为强类型的对象（Objects）、关系（Links）与带因果前置/后置条件的动作契约（Action Types），并能在自进化过程中从执行 Trace 自动提炼新约束与更新本体图谱。",
      en: "Build an Ontology plugin for PenguinHarness that models typed domain objects, relations, and causal action contracts, automatically refining the ontology graph from RSI execution traces.",
    },
    deliverables: [
      {
        zh: "本体建模与因果规则演化插件包（含图谱可视化 Workbench 与 Ontology Skill）",
        en: "Ontology plugin package with interactive graph Workbench and causal schema Skill",
      },
      {
        zh: "附带在决策或环境交互任务中自动演化本体结构的端到端验证示例",
        en: "End-to-end demo showing automatic ontology refinement on a complex decision task",
      },
    ],
    references: [
      { label: "penguin-harness-plugins", url: "https://github.com/Prism-Shadow/penguin-harness-plugins" },
    ],
    updatedAt: "2026-11-10",
  },
  {
    id: "RSI-Q008",
    status: "open",
    category: "cross-framework-rsi",
    difficulty: "B",
    exp: 450,
    loot: [
      { item: "harness-gear", count: 2 },
      { item: "trace-crystal", count: 1 },
    ],
    targetRepo: "Prism-Shadow/penguin-harness-community",
    relatedRepos: ["Prism-Shadow/penguin-harness-benchmark"],
    title: {
      zh: "跑通使用 PenguinHarness 的 RSI 自动优化 LangGraph 智能体的完整示例",
      en: "End-to-End Example: Optimize LangGraph Agents with PenguinHarness RSI",
    },
    summary: {
      zh: "编写开箱即用的跨框架赋能案例：将外部 LangGraph 多节点图工作流封装为被测对象，接入 PenguinHarness 的 Benchmark 评测与 ACE / OPRO / Default RSI 自进化闭环，自动诊断失败轨迹并迭代优化 LangGraph 的节点 Prompt、工具定义与路由条件。",
      en: "Create a complete runnable recipe wrapping a LangGraph multi-node agent into PenguinHarness's evaluation and RSI optimization loop to automatically evolve its node prompts and routing edges.",
    },
    deliverables: [
      {
        zh: "可一键运行的 LangGraph × PenguinHarness RSI 适配代码与配置文件",
        en: "Runnable LangGraph × PenguinHarness RSI adapter code and configuration",
      },
      {
        zh: "优化前后的 Benchmark 准确率跃升对比报告与完整执行 Trace",
        en: "Verified before/after benchmark accuracy report and execution traces",
      },
    ],
    references: [
      { label: "RFC-0002 Evaluation", url: "/rfcs/rfc-0002-evaluation/" },
    ],
    updatedAt: "2026-11-10",
  },
  {
    id: "RSI-Q009",
    status: "open",
    category: "cross-framework-rsi",
    difficulty: "B",
    exp: 450,
    loot: [
      { item: "harness-gear", count: 2 },
      { item: "trace-crystal", count: 1 },
    ],
    targetRepo: "Prism-Shadow/penguin-harness-community",
    relatedRepos: ["Prism-Shadow/penguin-harness-benchmark"],
    title: {
      zh: "跑通使用 PenguinHarness 的 RSI 自动优化 Dify 工作流/应用的完整示例",
      en: "End-to-End Example: Optimize Dify Workflows with PenguinHarness RSI",
    },
    summary: {
      zh: "编写并跑通使用 PenguinHarness 的 RSI 工具链优化 Dify 应用的实战案例：通过 Dify DSL YAML 导入导出与 API 评测桥接，让 PenguinHarness 自动分析 Dify 工作流在测试集上的失败案例、自动改写 DSL 中的节点提示词与逻辑分支，并验证优化后的得分提升。",
      en: "Connect PenguinHarness RSI to Dify workflows via Dify DSL YAML and API: benchmark a Dify app, analyze failure traces, automatically patch Dify node prompts, and verify score gains.",
    },
    deliverables: [
      {
        zh: "Dify DSL 自动化评测与 Prompt/节点自进化回写脚本及示例工作流",
        en: "Dify DSL evaluation bridge, automated prompt/node evolution script, and sample workflow",
      },
      {
        zh: "详细的复现指南与进化前后效果对比数据",
        en: "Step-by-step reproduction guide and before/after evaluation metrics",
      },
    ],
    references: [
      { label: "RFC-0002 Evaluation", url: "/rfcs/rfc-0002-evaluation/" },
    ],
    updatedAt: "2026-11-10",
  },
  {
    id: "RSI-Q010",
    status: "open",
    category: "tutorial-blog",
    difficulty: "B",
    exp: 400,
    loot: [
      { item: "benchmark-astrolabe", count: 2 },
      { item: "trace-crystal", count: 1 },
    ],
    targetRepo: "Prism-Shadow/penguin-harness-community",
    relatedRepos: ["Prism-Shadow/penguin-harness"],
    title: {
      zh: "打造好玩、能直观验证自进化效果的 15 分钟入门教程（登上 Penguin 主页博客）",
      en: "Playful 15-Minute RSI Beginner Tutorial for the Penguin Homepage Blog",
    },
    summary: {
      zh: "我们需要一篇足够好玩、门槛低且能直观验证自进化效果的入门教程（例如让智能体在趣味迷宫闯关、策略卡牌博弈或代码解谜小游戏中，从初始频频踩坑的 40% 胜率，经过 3 轮 RSI 自动总结避坑法则后飙升至 85%+ 胜率）。入选作品将直接署名发布在 penguin.ooo 主页官方博客！",
      en: "Design a fun, visual 15-minute beginner tutorial (e.g., evolving a game-playing or dungeon-puzzle agent from a 40% win rate to 85%+ in 3 RSI rounds) to be featured with author credit on the penguin.ooo homepage blog.",
    },
    deliverables: [
      {
        zh: "包含趣味小任务 Benchmark + 初始 Agent + 3 轮自进化脚本的完整复现包",
        en: "Self-contained mini-game/puzzle benchmark, starter agent, and 3-round RSI walkthrough",
      },
      {
        zh: "图文并茂的中英双语博客文章（展示进化前后得分曲线与自动学到的规则 Diff）",
        en: "Illustrated bilingual blog post showing score progression and evolved playbook diffs",
      },
    ],
    references: [
      { label: "Penguin Official Blog", url: "https://penguin.ooo" },
    ],
    updatedAt: "2026-11-10",
  },
  {
    id: "RSI-Q011",
    status: "in_review",
    category: "harness-core",
    difficulty: "B",
    exp: 350,
    loot: [
      { item: "harness-gear", count: 2 },
    ],
    targetRepo: "Prism-Shadow/penguin-harness",
    title: {
      zh: "支持 Agent 作者元数据标识与按作者分组展示页（penguin-harness#1508）",
      en: "Agent Author Metadata & Author-Grouped Agents Directory (penguin-harness#1508)",
    },
    summary: {
      zh: "在 PenguinHarness 的 core、server、CLI 与 Web 界面中为 Agent 增加作者（author）元数据支持，并在 Agents 页面按作者分组聚合展示，方便社区开发者署名发布与分享自进化智能体。",
      en: "Equip PenguinHarness Agents with author metadata across core, server, CLI, and web UI, grouping the Agents directory by author.",
    },
    deliverables: [
      {
        zh: "core/server/cli/web 全链路 author 字段支持与按作者分组视图（PR #1508 审核中）",
        en: "Full-stack agent author field and grouped Agents page (PR #1508 in review)",
      },
    ],
    references: [
      { label: "penguin-harness#1508", url: "https://github.com/Prism-Shadow/penguin-harness/pull/1508" },
    ],
    assignee: "hiyouga",
    linkedPrUrl: "https://github.com/Prism-Shadow/penguin-harness/pull/1508",
    updatedAt: "2026-11-08",
  },
  {
    id: "RSI-Q012",
    status: "in_review",
    category: "harness-core",
    difficulty: "A",
    exp: 450,
    loot: [
      { item: "harness-gear", count: 2 },
      { item: "trace-crystal", count: 1 },
    ],
    targetRepo: "Prism-Shadow/penguin-harness",
    title: {
      zh: "上下文压缩前自动写入交接文件并引导新上下文查询历史 Trace（penguin-harness#1491）",
      en: "Context Compaction Hand-Off Files & Trace Query Continuity (penguin-harness#1491)",
    },
    summary: {
      zh: "改进长程任务的上下文压缩（Compaction）机制：在生成摘要前自动持久化交接文件（hand-off files），并向新上下文注入历史 Trace 检索指令，保障长时自进化不丢关键细节。",
      en: "Write hand-off files before context compaction and guide the next context on querying historical execution Traces.",
    },
    deliverables: [
      {
        zh: "Compaction 交接文件落盘与 Trace 检索提示注入（PR #1491 审核中）",
        en: "Compaction hand-off persistence and Trace query instructions (PR #1491 in review)",
      },
    ],
    references: [
      { label: "penguin-harness#1491", url: "https://github.com/Prism-Shadow/penguin-harness/pull/1491" },
    ],
    assignee: "hiyouga",
    linkedPrUrl: "https://github.com/Prism-Shadow/penguin-harness/pull/1491",
    updatedAt: "2026-11-05",
  },
  {
    id: "RSI-Q013",
    status: "completed",
    category: "leaderboard-eval",
    difficulty: "S",
    exp: 700,
    loot: [
      { item: "evolution-core", count: 2 },
      { item: "trace-crystal", count: 3 },
    ],
    targetRepo: "Prism-Shadow/penguin-harness-benchmark",
    title: {
      zh: "完成 GDPEVO Essential 六大领域基准与 4 种 RSI 算法对比评测（SkillAdam / SkillOpt / OpenSkill / Trace）",
      en: "GDPEVO Essential 6-Domain Benchmark & Four RSI Methods Evaluation (Phase I)",
    },
    summary: {
      zh: "将 GDPEVO Essential 拆分为 6 个独立领域子基准（法院书记、承保审查、工程组合分析、财务控制、投资组合管理、服务工单），完成 SkillAdam、SkillOpt、OpenSkill、Trace 四种 RSI 算法与基线的 30 组完整实验评测并发布至榜单。",
      en: "Split GDPEVO Essential into 6 domain benchmarks and evaluated SkillAdam, SkillOpt, OpenSkill, and Trace against a shared baseline across 30 experiment directories.",
    },
    deliverables: [
      {
        zh: "30 个独立子集实验目录与 published 状态榜单配置（PR #16, #18, #20, #23 已合入）",
        en: "30 split experiment directories and published leaderboard config (PR #16, #18, #20, #23 merged)",
      },
    ],
    references: [
      { label: "penguin-harness-benchmark#20", url: "https://github.com/Prism-Shadow/penguin-harness-benchmark/pull/20" },
      { label: "GDPEVO Essential Leaderboard", url: "https://penguin.ooo/leaderboards/gdpevo-essential" },
    ],
    assignee: "Saigyouji-Yuyuko1000",
    linkedPrUrl: "https://github.com/Prism-Shadow/penguin-harness-benchmark/pull/20",
    updatedAt: "2026-11-03",
  },
  {
    id: "RSI-Q014",
    status: "completed",
    category: "leaderboard-eval",
    difficulty: "A",
    exp: 600,
    loot: [
      { item: "trace-crystal", count: 3 },
      { item: "benchmark-astrolabe", count: 2 },
    ],
    targetRepo: "Prism-Shadow/penguin-harness-benchmark",
    title: {
      zh: "完成 Sec A–E 跨框架首期评测实验与榜单发布（PenguinHarness / DSH / Pi / Codex）",
      en: "Cross-Harness Comparison on Sec A-E Benchmarks (PenguinHarness vs. DSH vs. Pi vs. Codex)",
    },
    summary: {
      zh: "将 Sec A–E 迁移为标准 Benchmark 格式，完成 PenguinHarness、DSH、Pi 与 Codex 四种框架在 DeepSeek Flash 下的 20 组全量评测实验并上线 Agent Harness Comparison 榜单。",
      en: "Migrated Sec A-E to standard Benchmark format and evaluated PenguinHarness, DSH, Pi, and Codex across 20 experiment runs to launch the Harness Comparison leaderboard.",
    },
    deliverables: [
      {
        zh: "Sec A–E 四框架完整评测数据与 harness-comparison 榜单上线（PR #17, #21, #23 已合入）",
        en: "Sec A-E cross-harness results and harness-comparison leaderboard (PR #17, #21, #23 merged)",
      },
    ],
    references: [
      { label: "penguin-harness-benchmark#21", url: "https://github.com/Prism-Shadow/penguin-harness-benchmark/pull/21" },
      { label: "Harness Comparison Leaderboard", url: "https://penguin.ooo/leaderboards/harness-comparison" },
    ],
    assignee: "Saigyouji-Yuyuko1000",
    linkedPrUrl: "https://github.com/Prism-Shadow/penguin-harness-benchmark/pull/21",
    updatedAt: "2026-11-03",
  },
  {
    id: "RSI-Q015",
    status: "completed",
    category: "harness-core",
    difficulty: "A",
    exp: 500,
    loot: [
      { item: "harness-gear", count: 2 },
      { item: "ontology-rune", count: 1 },
    ],
    targetRepo: "Prism-Shadow/penguin-harness",
    title: {
      zh: "发布插件接口生成器 penguin-gen-ifaces 与模块静态声明校验（penguin-harness#1475）",
      en: "Publish Interface Generator penguin-gen-ifaces & Literal Module Contributions",
    },
    summary: {
      zh: "将接口生成器独立发布为 penguin-gen-ifaces，规范插件模块声明（ifaces.json）并对非字面量贡献进行静态拦截，夯实插件市场与 Workbench 的底层契约。",
      en: "Published penguin-gen-ifaces to generate plugin interface manifests (ifaces.json) and enforce static literal module contributions.",
    },
    deliverables: [
      {
        zh: "penguin-gen-ifaces 发布与全量内置插件静态契约迁移（PR #1475 已合入）",
        en: "Published penguin-gen-ifaces and migrated all shipped content plugins (PR #1475 merged)",
      },
    ],
    references: [
      { label: "penguin-harness#1475", url: "https://github.com/Prism-Shadow/penguin-harness/pull/1475" },
    ],
    assignee: "hiyouga",
    linkedPrUrl: "https://github.com/Prism-Shadow/penguin-harness/pull/1475",
    updatedAt: "2026-11-05",
  },
  {
    id: "RSI-Q016",
    status: "completed",
    category: "harness-core",
    difficulty: "B",
    exp: 400,
    loot: [
      { item: "harness-gear", count: 2 },
    ],
    targetRepo: "Prism-Shadow/penguin-harness",
    title: {
      zh: "抽离独立交互式富组件语法包 @prismshadow/a2ui（penguin-harness#1474）",
      en: "Extract Standalone @prismshadow/a2ui Rich Interactive Block Package",
    },
    summary: {
      zh: "将 A2UI 交互式富组件语法从 core 抽离为独立包 @prismshadow/a2ui，支持选项卡、表单、步骤告警、仪表盘、图表等开箱即用的 Agent 交互渲染。",
      en: "Decoupled the A2UI grammar from core into a dedicated @prismshadow/a2ui package for rich interactive blocks.",
    },
    deliverables: [
      {
        zh: "独立包 @prismshadow/a2ui 发布与全栈接入（PR #1474 已合入）",
        en: "Standalone @prismshadow/a2ui package extracted and integrated (PR #1474 merged)",
      },
    ],
    references: [
      { label: "penguin-harness#1474", url: "https://github.com/Prism-Shadow/penguin-harness/pull/1474" },
    ],
    assignee: "hiyouga",
    linkedPrUrl: "https://github.com/Prism-Shadow/penguin-harness/pull/1474",
    updatedAt: "2026-11-05",
  },
  {
    id: "RSI-Q017",
    status: "completed",
    category: "leaderboard-eval",
    difficulty: "A",
    exp: 450,
    loot: [
      { item: "benchmark-astrolabe", count: 2 },
      { item: "trace-crystal", count: 1 },
    ],
    targetRepo: "Prism-Shadow/penguin-harness-benchmark",
    title: {
      zh: "完成生物医学重复测量分析 Harbor Benchmark 标准任务集迁移（penguin-harness-benchmark#24）",
      en: "Harbor Biomedical Repeated-Measure Benchmark Tasks under data/",
    },
    summary: {
      zh: "将生物医学重复测量分析评测集标准化为 Harbor 格式并归档于 penguin-harness-benchmark 的 data/ 目录下，完成端到端可复现评测验证。",
      en: "Standardized and verified the biomedical repeated-measure analysis Cases as Harbor tasks under data/.",
    },
    deliverables: [
      {
        zh: "生物医学 Harbor 评测集迁移与运行验证（PR #24 已合入）",
        en: "Harbor biomedical benchmark tasks under data/ (PR #24 merged)",
      },
    ],
    references: [
      { label: "penguin-harness-benchmark#24", url: "https://github.com/Prism-Shadow/penguin-harness-benchmark/pull/24" },
    ],
    assignee: "hiyouga",
    linkedPrUrl: "https://github.com/Prism-Shadow/penguin-harness-benchmark/pull/24",
    updatedAt: "2026-11-04",
  },
  {
    id: "RSI-Q018",
    status: "completed",
    category: "paper-reproduction",
    difficulty: "A",
    exp: 500,
    loot: [
      { item: "evolution-core", count: 1 },
      { item: "trace-crystal", count: 2 },
    ],
    targetRepo: "Prism-Shadow/penguin-harness-benchmark",
    relatedRepos: ["Prism-Shadow/awesome-rsi"],
    title: {
      zh: "完成 ACE 与 OPRO 自进化算法工具包校准及基线复现实验",
      en: "ACE & OPRO RSI Toolkit Calibration & Baseline Reproduction",
    },
    summary: {
      zh: "完成 PenguinHarness 内置 ACE（Reflector/Curator 离线顺序自进化）与 OPRO 优化器工具包的基准校准实验，并构建 Awesome RSI 论文分类体系。",
      en: "Calibrated the sequential offline Reflector/Curator ACE loop and OPRO optimizer toolkit in PenguinHarness with reproducible traces.",
    },
    deliverables: [
      {
        zh: "ACE / OPRO 工具包校准实验与 Awesome RSI 体系整理（已完成）",
        en: "Calibrated ACE & OPRO RSI skills and Awesome RSI taxonomy (Completed)",
      },
    ],
    references: [
      { label: "awesome-rsi", url: "https://github.com/Prism-Shadow/awesome-rsi" },
    ],
    assignee: "lzh368",
    linkedPrUrl: "https://github.com/Prism-Shadow/penguin-harness-benchmark/pull/4",
    updatedAt: "2026-11-02",
  },
  {
    id: "RSI-Q019",
    status: "completed",
    category: "leaderboard-eval",
    difficulty: "A",
    exp: 500,
    loot: [
      { item: "benchmark-astrolabe", count: 2 },
      { item: "ontology-rune", count: 1 },
    ],
    targetRepo: "Prism-Shadow/penguin-harness-community",
    relatedRepos: ["Prism-Shadow/penguin-harness-benchmark"],
    title: {
      zh: "完成 RFC-0001 至 RFC-0005 社区评测标准与三视图（Table / Pareto / Waffle）榜单规范设计",
      en: "Standardize RFC-0001..0005 Protocols & Multi-View Leaderboard Engine",
    },
    summary: {
      zh: "制定并落地 Benchmark、Evaluation、Plugin、双周会与 Leaderboard 表达式标准规范，支持单一配置文件驱动排名表、帕累托前沿与单题华夫图三视图。",
      en: "Established the standardized Benchmark, Evaluation, Plugin, Bi-weekly Meeting, and Leaderboard expression specs driving Table, Pareto, and Waffle views.",
    },
    deliverables: [
      {
        zh: "RFC-0001..0005 标准协议与双语文档体系落地（已完成）",
        en: "Merged RFC-0001 through RFC-0005 specifications and bilingual docs (Completed)",
      },
    ],
    references: [
      { label: "RFC-0005 Leaderboard", url: "/rfcs/rfc-0005-leaderboard/" },
    ],
    assignee: "ArisaZz",
    linkedPrUrl: "https://github.com/Prism-Shadow/penguin-harness-community/pull/27",
    updatedAt: "2026-11-03",
  },
];

export interface CommunityMember {
  handle: string;
  name: string;
  nameZh: string;
  avatar: string;
  github: string;
  role: Text;
  bio: Text;
  completedExp: number;
  inReviewExp: number;
  activeClaims: number;
  maxClaims: number;
  completedQuests: string[];
  activeQuests: string[];
  lootInventory: { item: LootId; count: number }[];
  isFounding: boolean;
  committeeTrack?: Text;
}

export const FOUNDING_MEMBERS: CommunityMember[] = [
  {
    handle: "hiyouga",
    name: "Yaowei Zheng",
    nameZh: "郑耀威 (Yaowei Zheng)",
    avatar: "https://avatars.githubusercontent.com/u/16256802?v=4",
    github: "https://github.com/hiyouga",
    role: {
      zh: "社区发起人 · 框架与运行时基建委员会主委",
      en: "Founding Lead · Chair of Harness & Runtime Architecture",
    },
    bio: {
      zh: "PenguinHarness 与 LlamaFactory 核心作者，主导 Agent 自进化运行时、插件接口契约、上下文压缩交接与生物医学 Harbor 基准构建。",
      en: "Creator of PenguinHarness & LlamaFactory; leads RSI runtime architecture, plugin interface contracts, trace compaction, and Harbor benchmarks.",
    },
    completedExp: 1350,
    inReviewExp: 800,
    activeClaims: 2,
    maxClaims: 2,
    completedQuests: ["RSI-Q015", "RSI-Q016", "RSI-Q017"],
    activeQuests: ["RSI-Q011", "RSI-Q012"],
    lootInventory: [
      { item: "harness-gear", count: 4 },
      { item: "benchmark-astrolabe", count: 2 },
      { item: "ontology-rune", count: 1 },
      { item: "trace-crystal", count: 1 },
    ],
    isFounding: true,
    committeeTrack: { zh: "框架与运行时基建委员会", en: "Harness & Runtime Architecture" },
  },
  {
    handle: "Saigyouji-Yuyuko1000",
    name: "Leijun Zhou",
    nameZh: "周磊俊 (Leijun Zhou)",
    avatar: "https://avatars.githubusercontent.com/u/82754509?v=4",
    github: "https://github.com/Saigyouji-Yuyuko1000",
    role: {
      zh: "创始核心成员 · 评测基准与榜单委员会主委",
      en: "Founding Member · Chair of Benchmark & Leaderboard Evaluation",
    },
    bio: {
      zh: "主导 GDPEVO Essential 六大领域拆分与 4 种 RSI 算法对比实验，以及 Sec A–E 跨框架（PenguinHarness / DSH / Pi / Codex）首期评测与榜单构建。",
      en: "Leads the GDPEVO Essential 6-domain RSI evaluation suite and the Sec A–E cross-harness comparison leaderboard.",
    },
    completedExp: 1300,
    inReviewExp: 0,
    activeClaims: 0,
    maxClaims: 2,
    completedQuests: ["RSI-Q013", "RSI-Q014"],
    activeQuests: [],
    lootInventory: [
      { item: "trace-crystal", count: 6 },
      { item: "evolution-core", count: 2 },
      { item: "benchmark-astrolabe", count: 2 },
    ],
    isFounding: true,
    committeeTrack: { zh: "评测基准与榜单委员会", en: "Benchmark & Leaderboard Evaluation" },
  },
  {
    handle: "lzh368",
    name: "Zhihao Liu",
    nameZh: "刘志豪 (Zhihao Liu)",
    avatar: "https://avatars.githubusercontent.com/u/174015635?v=4",
    github: "https://github.com/lzh368",
    role: {
      zh: "创始核心成员 · Harness 自进化与泛化算法委员会主委",
      en: "Founding Member · Chair of Harness Self-Evolution & Generalization",
    },
    bio: {
      zh: "专注于 ACE、OPRO、RRSI 等自进化算法工具链校准、前沿论文复现与 Awesome RSI 研究脉络建设。",
      en: "Focuses on ACE, OPRO, and RRSI self-evolution algorithm calibration, frontier paper reproductions, and Awesome RSI curation.",
    },
    completedExp: 500,
    inReviewExp: 0,
    activeClaims: 0,
    maxClaims: 2,
    completedQuests: ["RSI-Q018"],
    activeQuests: [],
    lootInventory: [
      { item: "evolution-core", count: 1 },
      { item: "trace-crystal", count: 2 },
    ],
    isFounding: true,
    committeeTrack: { zh: "Harness 自进化与泛化算法委员会", en: "Harness Self-Evolution & Generalization" },
  },
  {
    handle: "ArisaZz",
    name: "Xiang Qu",
    nameZh: "曲翔 (Xiang Qu)",
    avatar: "https://avatars.githubusercontent.com/u/74355374?v=4",
    github: "https://github.com/ArisaZz",
    role: {
      zh: "创始核心成员 · 社区标准、运营与趣味教程委员会主委",
      en: "Founding Member · Chair of Community Standards, Operations & Tutorials",
    },
    bio: {
      zh: "推动社区 RFC 标准规范、多视图排行榜协议（Table / Pareto / Waffle）、双周会组织与开发者生态共建。",
      en: "Drives community RFC protocols, multi-view leaderboard specifications, bi-weekly paper reading sessions, and contributor onboarding.",
    },
    completedExp: 500,
    inReviewExp: 0,
    activeClaims: 0,
    maxClaims: 2,
    completedQuests: ["RSI-Q019"],
    activeQuests: [],
    lootInventory: [
      { item: "benchmark-astrolabe", count: 2 },
      { item: "ontology-rune", count: 1 },
    ],
    isFounding: true,
    committeeTrack: { zh: "社区标准、运营与趣味教程委员会", en: "Community Standards, Operations & Tutorials" },
  },
];

export interface CommitteeSeat {
  status: "filled" | "recruiting";
  handle?: string;
  name?: string;
  nameZh?: string;
  avatar?: string;
  github?: string;
  role: Text;
  stipendUsd: number;
}

export interface CommitteeDomain {
  id: string;
  title: Text;
  scope: Text;
  icon: LootId;
  seats: CommitteeSeat[];
}

export const COMMITTEE_DOMAINS: CommitteeDomain[] = [
  {
    id: "harness-infra",
    title: {
      zh: "框架与运行时基建委员会",
      en: "Harness & Runtime Architecture Committee",
    },
    scope: {
      zh: "负责 PenguinHarness 核心运行时、Agent State 规范、Trace 压缩交接、A2UI 及跨框架（LangGraph / Dify）适配任务发布与评审。",
      en: "Oversees PenguinHarness runtime, Agent State, trace compaction, A2UI, and cross-framework (LangGraph / Dify) RSI adapters.",
    },
    icon: "harness-gear",
    seats: [
      {
        status: "filled",
        handle: "hiyouga",
        name: "Yaowei Zheng",
        nameZh: "郑耀威 (Yaowei Zheng)",
        avatar: "https://avatars.githubusercontent.com/u/16256802?v=4",
        github: "https://github.com/hiyouga",
        role: { zh: "领域主委 · 核心架构", en: "Domain Chair · Core Architecture" },
        stipendUsd: 100,
      },
      {
        status: "recruiting",
        role: { zh: "联合委员（跨框架 LangGraph/Dify 与运行时方向）", en: "Co-Chair (Cross-Framework LangGraph/Dify & Runtime)" },
        stipendUsd: 100,
      },
    ],
  },
  {
    id: "benchmark-leaderboard",
    title: {
      zh: "评测基准与榜单委员会",
      en: "Benchmark & Leaderboard Evaluation Committee",
    },
    scope: {
      zh: "负责 Benchmark 准入校验（RFC-0001）、实验轨迹核验（RFC-0002）以及 Harness Comparison / GDPEVO Essential 榜单维护。",
      en: "Reviews Benchmark packages (RFC-0001), verifies Evaluation traces (RFC-0002), and curates live RSI leaderboards (RFC-0005).",
    },
    icon: "trace-crystal",
    seats: [
      {
        status: "filled",
        handle: "Saigyouji-Yuyuko1000",
        name: "Leijun Zhou",
        nameZh: "周磊俊 (Leijun Zhou)",
        avatar: "https://avatars.githubusercontent.com/u/82754509?v=4",
        github: "https://github.com/Saigyouji-Yuyuko1000",
        role: { zh: "领域主委 · 评测与排行榜", en: "Domain Chair · Evaluation & Leaderboards" },
        stipendUsd: 100,
      },
      {
        status: "recruiting",
        role: { zh: "联合委员（多模型进化矩阵与复现审计方向）", en: "Co-Chair (Multi-Model Evolution & Reproducibility Audit)" },
        stipendUsd: 100,
      },
    ],
  },
  {
    id: "harness-evolution-rsi",
    title: {
      zh: "Harness 自进化与泛化算法委员会",
      en: "Harness Self-Evolution & Generalization Committee",
    },
    scope: {
      zh: "聚焦 Harness 自身演化与跨分布泛化（如 RRSI 正则化进化、ACE、OPRO、防基准过拟合 Critic 与 Pruner）的算法研究与复现。",
      en: "Focuses on regularized harness evolution (RRSI), ACE, OPRO, anti-overfitting critics, token pruning, and OOD transfer.",
    },
    icon: "evolution-core",
    seats: [
      {
        status: "filled",
        handle: "lzh368",
        name: "Zhihao Liu",
        nameZh: "刘志豪 (Zhihao Liu)",
        avatar: "https://avatars.githubusercontent.com/u/174015635?v=4",
        github: "https://github.com/lzh368",
        role: { zh: "领域主委 · 自进化算法", en: "Domain Chair · RSI Algorithms" },
        stipendUsd: 100,
      },
      {
        status: "recruiting",
        role: { zh: "联合委员（RRSI 正则化泛化与轨迹合成方向）", en: "Co-Chair (RRSI Generalization & Trajectory Synthesis)" },
        stipendUsd: 100,
      },
    ],
  },
  {
    id: "community-evangelism",
    title: {
      zh: "社区标准、运营与趣味教程委员会",
      en: "Community Standards, Operations & Tutorials Committee",
    },
    scope: {
      zh: "负责 Penguin 博客趣味入门教程策划、双周会论文精读主持（RFC-0004）、社区酒馆论坛运营及每月末 $2,000 奖励池核算公示。",
      en: "Curates playful beginner tutorials for the Penguin blog, hosts bi-weekly paper sessions (RFC-0004), and manages monthly rewards.",
    },
    icon: "benchmark-astrolabe",
    seats: [
      {
        status: "filled",
        handle: "ArisaZz",
        name: "Xiang Qu",
        nameZh: "曲翔 (Xiang Qu)",
        avatar: "https://avatars.githubusercontent.com/u/74355374?v=4",
        github: "https://github.com/ArisaZz",
        role: { zh: "领域主委 · 标准与社区运营", en: "Domain Chair · Standards & Operations" },
        stipendUsd: 100,
      },
      {
        status: "recruiting",
        role: { zh: "联合委员（官方博客趣味教程与布道方向）", en: "Co-Chair (Official Blog Tutorials & Evangelism)" },
        stipendUsd: 100,
      },
    ],
  },
  {
    id: "env-exploration-rsi",
    title: {
      zh: "环境交互与自主探索 RSI 委员会",
      en: "Environment Interaction & Exploration RSI Committee",
    },
    scope: {
      zh: "聚焦环境探索型 RSI（如 RSIAgent 广度-深度探索、因果世界记忆）与 RSI Arena 人类偏好反馈自进化方向的课题发布与评审。",
      en: "Dedicated to environment exploration RSI (RSIAgent broad-then-deep causal memory) and RSI Arena human-feedback loops.",
    },
    icon: "evolution-core",
    seats: [
      {
        status: "recruiting",
        role: { zh: "领域主委（环境交互探索与 RSIAgent 方向）", en: "Domain Chair (Environment Exploration & RSIAgent)" },
        stipendUsd: 100,
      },
      {
        status: "recruiting",
        role: { zh: "联合委员（人类盲测反馈与 RSI Arena 方向）", en: "Co-Chair (Human-Feedback & RSI Arena)" },
        stipendUsd: 100,
      },
    ],
  },
  {
    id: "plugin-ontology",
    title: {
      zh: "插件市场、知识库与本体（Ontology）委员会",
      en: "Plugin Ecosystem, Knowledge Base & Ontology Committee",
    },
    scope: {
      zh: "负责插件生态（RFC-0003）、自演化知识库插件、Ontology 本体建模与因果动作图谱插件的架构设计、任务发布与安全审查。",
      en: "Stewards the plugin registry (RFC-0003), Self-Evolving Knowledge Base plugin, Ontology & Causal Action Graph plugin, and Workbenches.",
    },
    icon: "ontology-rune",
    seats: [
      {
        status: "recruiting",
        role: { zh: "领域主委（知识库与 Ontology 本体引擎方向）", en: "Domain Chair (Knowledge Base & Ontology Engine)" },
        stipendUsd: 100,
      },
      {
        status: "recruiting",
        role: { zh: "联合委员（插件安全审计与 Workbench 生态方向）", en: "Co-Chair (Plugin Audit & Workbench Ecosystem)" },
        stipendUsd: 100,
      },
    ],
  },
];

export interface ForumThread {
  id: string;
  board: "paper-guild" | "arena-notes" | "bounty-hall" | "plugin-forge";
  pinned?: boolean;
  hot?: boolean;
  tag: Text;
  title: Text;
  author: {
    handle: string;
    name: string;
    avatar: string;
    badge: Text;
  };
  createdAt: string;
  replies: number;
  views: string;
  linkedQuestId?: string;
  excerpt: Text;
  bodyParagraphs: Text[];
  highlights?: Text[];
  externalLinks?: { label: string; url: string }[];
}

export const FORUM_BOARDS: Record<ForumThread["board"], { title: Text; channel: string; desc: Text }> = {
  "paper-guild": {
    channel: "#paper-guild",
    title: { zh: "论文精读与复现坊", en: "Paper Guild & Reproductions" },
    desc: { zh: "RSIAgent、RRSI 等必读核心论文拆解与复现讨论", en: "Deep dives into RSIAgent, RRSI, and core RSI literature" },
  },
  "arena-notes": {
    channel: "#arena-human-rsi",
    title: { zh: "RSI Arena 与实验观察", en: "RSI Arena & Empirical Notes" },
    desc: { zh: "13,000 GPU 小时人类反馈实验启示与跨框架/多模型评测发现", en: "Lessons from 13,000 GPU-hours on RSI Arena & leaderboard findings" },
  },
  "bounty-hall": {
    channel: "#bounty-hall",
    title: { zh: "悬赏组队与跨框架工坊", en: "Bounty Hall & Cross-Framework" },
    desc: { zh: "LangGraph / Dify 优化实战、趣味博客教程征集与任务认领答疑", en: "LangGraph/Dify RSI optimization, blog tutorials, and quest teaming" },
  },
  "plugin-forge": {
    channel: "#plugin-forge",
    title: { zh: "知识库与本体锻造炉", en: "Knowledge & Ontology Forge" },
    desc: { zh: "自演化知识库插件、Ontology 因果动作图谱与 Workbench 交流", en: "Self-evolving Knowledge Base, Ontology plugins, and Workbench UI" },
  },
};

export const FORUM_THREADS: ForumThread[] = [
  {
    id: "thread-rsiagent-rrsi",
    board: "paper-guild",
    pinned: true,
    hot: true,
    tag: { zh: "置顶必读 · 双璧论文", en: "Pinned · Essential Reading" },
    title: {
      zh: "【必读双璧】如果你要做环境交互的 RSI 或 Harness 本身的演化泛化，RSIAgent 与 RRSI 是绕不开的两篇核心论文",
      en: "[Essential Reading] For Environment-Interaction RSI vs. Harness Evolution Generalization: RSIAgent & RRSI",
    },
    author: {
      handle: "hiyouga",
      name: "Yaowei Zheng",
      avatar: "https://avatars.githubusercontent.com/u/16256802?v=4",
      badge: { zh: "Lv.5 递归执政官 · 主委", en: "Lv.5 Archon · Chair" },
    },
    createdAt: "2026-11-09",
    replies: 28,
    views: "1.4k",
    linkedQuestId: "RSI-Q001",
    excerpt: {
      zh: "RSIAgent (arXiv:2609.15364) 与 RRSI (arXiv:2609.24972) 二者相辅相成：一个解决未知环境中的「先广度后深度」自主探索与因果记忆沉淀，一个解决 Harness 自进化中的「防基准过拟合」与跨分布（OOD）泛化。社区现已开启双 S 级复现悬赏（各 800 EXP + 传说进化核心掉落）！",
      en: "RSIAgent (arXiv:2609.15364) and RRSI (arXiv:2609.24972) are complementary cornerstones of 2026 RSI research: one tackles autonomous environment exploration via frozen causal memory, the other solves harness overfitting via regularized evolution.",
    },
    bodyParagraphs: [
      {
        zh: "如果你要做环境交互的 RSI 或者 Harness 本身的 RSI 演化，今年这两篇核心论文可以说是绕不开的必读之作，二者恰好构成了「向外探索环境」与「向内正则演化」的互补双翼：",
        en: "If you are working on environment-interactive RSI or harness-level RSI evolution, these two core 2026 papers are indispensable and mutually complementary:",
      },
      {
        zh: "1. RSIAgent（Autonomous Exploration for Recursive Self-improvement in New Environments, arXiv:2609.15364）：属于环境探索方面的 RSI。面对预训练模型未充分覆盖的新环境、新工具与隐藏失败模式，RSIAgent 提出了免训练的多智能体协同框架——由 Curriculum（课程生成）、Actor（交互执行）和 Verifier（结果校验）协同进行「先广度后深度（Broad-then-Deep）」递归自探索：并行广度探索发现多样化环境结构，聚焦深度探索挖掘边界条件、隐藏约束与未知的「动作-条件-结果」因果依赖。最终固化的冻结记忆（Frozen Memory）可直接复用于下游任务，让 Kimi-K3 与 GLM-5.3 在 OSWorld-v2 等基准上超越闭源前沿模型。",
        en: "1. RSIAgent (arXiv:2609.15364) — Environment Exploration RSI: Coordinates Curriculum, Actor, and Verifier agents using a broad-then-deep exploration strategy to uncover hidden constraints, boundary conditions, and reusable causal dependencies, freezing them into reusable memory without parameter updates.",
      },
      {
        zh: "2. RRSI（Regularized Recursive Self-Improvement of Agent Harnesses, arXiv:2609.24972）：属于自身 Harness 演化泛化的核心突破。直接迭代修改提示词、控制流与工具往往会严重「记忆训练集」，导致在分布内（ID）涨分猛、一到分布外（OOD）新基准就失效。RRSI 引入了经典正则化思想：Proposer 采用时间退火修改预算（限制单次捆绑改动数量并鼓励未探索方向），Selector 配备 Critic（筛除特定于单一基准的作弊式改动）与 Pruner（剪除收益过小、Token 过贵或失效的冗余规则），在 5 个 OOD 基准上取得最高 +4.3 分泛化提升，同时减少 30% 策略 Token 开销。",
        en: "2. RRSI (arXiv:2609.24972) — Regularized Harness Evolution: Prevents harness evolution from memorizing training tasks by combining a temporally annealed proposer budget with a benchmark-specificity Critic and a token-cost Pruner, boosting OOD benchmarks by up to +4.3 pts while cutting policy tokens by 30%.",
      },
    ],
    highlights: [
      {
        zh: "悬赏任务 RSI-Q001（复现 RSIAgent）与 RSI-Q002（复现 RRSI）已在任务看板开放认领，各奖励 800 EXP + 进化核心 ×2！",
        en: "Quests RSI-Q001 (Reproduce RSIAgent) and RSI-Q002 (Reproduce RRSI) are open on the Quest Board for 800 EXP + 2× Evolution Cores each!",
      },
    ],
    externalLinks: [
      { label: "RSIAgent (arXiv:2609.15364)", url: "https://arxiv.org/abs/2609.15364" },
      { label: "RRSI (arXiv:2609.24972)", url: "https://arxiv.org/abs/2609.24972" },
    ],
  },
  {
    id: "thread-rsi-arena-human-feedback",
    board: "arena-notes",
    pinned: true,
    hot: true,
    tag: { zh: "置顶深思 · 13,000 GPU 小时", en: "Pinned · 13,000 GPU-Hours" },
    title: {
      zh: "【实验手记】13,000 GPU 小时、20 个基准、两轮 3,129 票人类盲测：RSI Arena 教会我们的事——为什么人类体验不可替代？",
      en: "[Field Notes] 13,000 GPU-Hours, 20 Benchmarks & 3,129 Human Votes on RSI Arena: Why Human Experience Still Matters",
    },
    author: {
      handle: "Saigyouji-Yuyuko1000",
      name: "Leijun Zhou",
      avatar: "https://avatars.githubusercontent.com/u/82754509?v=4",
      badge: { zh: "Lv.4 进化炼金师 · 主委", en: "Lv.4 Alchemist · Chair" },
    },
    createdAt: "2026-11-09",
    replies: 34,
    views: "1.9k",
    linkedQuestId: "RSI-Q003",
    excerpt: {
      zh: "“The agents could do the engineering. People helped show them what needed fixing.” 回顾 Bake AI 联合 HuggingFace、NVIDIA、Scale AI、Stanford、MIT 等 10 所顶级机构在 RSI Arena 上的大规模实验：当第一轮人类真实盲测反馈交还给 10 个共享 64 卡集群的自主 Agent 后，8/10 在第二轮显著提升了人类评分，且这一增长并未简单反映在传统静态 Benchmark 分数上。",
      en: "\"The agents could do the engineering. People helped show them what needed fixing.\" Reflecting on the RSI Arena experiment across 10 agents on a shared 64-GPU cluster and 3,129 blind human votes at COLM and online.",
    },
    bodyParagraphs: [
      {
        zh: "在《RSI Arena: Towards Recursive Self-Improvement with Human Feedback》这项由 Bake AI 联合 @huggingface、@NVIDIAAI、@scale_AI、@Stanford、@MIT、@UCLA、@ucsantabarbara、@nyuniversity、@UW 与 @NotreDame 研究者共同完成的实验中，研究团队投入了约 13,000 GPU 小时，在 20 个 Benchmark 上测试模型，并在两轮迭代中收集了 3,129 票人类盲测投票：",
        en: "In 'RSI Arena: Towards Recursive Self-Improvement with Human Feedback' (Bake AI in collaboration with researchers from HuggingFace, NVIDIA, Scale AI, Stanford, MIT, UCLA, UCSB, NYU, UW, and Notre Dame), the team spent ~13,000 GPU-hours, tested models on 20 benchmarks, and collected 3,129 human votes across two rounds:",
      },
      {
        zh: "“We gave 10 AI agents the same base model and a shared 64-GPU cluster. They picked the data, wrote the code, and trained their own assistants. People at @COLM_conf and online compared the answers without knowing which model wrote them. We gave the first round’s feedback back to the agents and let them decide what to change. After another training round, eight of ten improved their human ratings relative to NVIDIA Instruct. Those gains did not track benchmark improvements.”",
        en: "\"We gave 10 AI agents the same base model and a shared 64-GPU cluster. They picked the data, wrote the code, and trained their own assistants. People at @COLM_conf and online compared the answers without knowing which model wrote them. We gave the first round's feedback back to the agents and let them decide what to change. After another training round, eight of ten improved their human ratings relative to NVIDIA Instruct. Those gains did not track benchmark improvements.\"",
      },
      {
        zh: "“The agents could do the engineering. People helped show them what needed fixing. That’s what this experiment taught us about RSI. AI can take on more of its own development, but our experience with it still matters. If these systems keep getting better, they should help us work better, live better, and spend more time on what we care about. Otherwise, what is all that compute for?” —— 这正是我们在社区发布 RSI-Q003（复现人类反馈闭环的 RSI Arena 工作流）的核心初衷。",
        en: "\"The agents could do the engineering. People helped show them what needed fixing... If these systems keep getting better, they should help us work better, live better, and spend more time on what we care about. Otherwise, what is all that compute for?\" — This is why we launched Quest RSI-Q003 to bring human-feedback-driven multi-round RSI into PenguinHarness.",
      },
    ],
    highlights: [
      {
        zh: "核心启示：Agent 已经能自主完成选数据、写代码、跑训练的工程闭环，但「人类真实使用体验」才是指引进化方向的罗盘。",
        en: "Key takeaway: Agents can autonomously execute the engineering loop, while human experience shows them what actually needs fixing.",
      },
    ],
  },
  {
    id: "thread-leaderboards-phase2",
    board: "arena-notes",
    hot: true,
    tag: { zh: "榜单进展 · 已完成首期", en: "Leaderboard · Phase I Live" },
    title: {
      zh: "【榜单战报】GDPEVO Essential 四大 RSI 算法对比 & Sec A–E 跨框架首期实验已上线！二期多模型与外部框架自进化火热征集中",
      en: "[Leaderboard Update] GDPEVO Essential (4 RSI Methods) & Sec A–E Cross-Harness Phase I Are Live! Calling for Phase II",
    },
    author: {
      handle: "Saigyouji-Yuyuko1000",
      name: "Leijun Zhou",
      avatar: "https://avatars.githubusercontent.com/u/82754509?v=4",
      badge: { zh: "Lv.4 进化炼金师 · 主委", en: "Lv.4 Alchemist · Chair" },
    },
    createdAt: "2026-11-08",
    replies: 19,
    views: "980",
    linkedQuestId: "RSI-Q004",
    excerpt: {
      zh: "首期我们已经完成了 GDPEVO Essential 六大子集的 SkillAdam / SkillOpt / OpenSkill / Trace 评测（RSI-Q013）以及 PenguinHarness / DSH / Pi / Codex 在 Sec A–E 上的跨框架对比（RSI-Q014）。接下来二期重点攻关：外部框架接入自进化前后的横向对比（RSI-Q004）与更多基座模型的进化潜力矩阵（RSI-Q005）！",
      en: "Phase I of gdpevo-essential (SkillAdam, SkillOpt, OpenSkill, Trace) and harness-comparison (PenguinHarness, DSH, Pi, Codex) is now published! Phase II quests RSI-Q004 and RSI-Q005 are open for claiming.",
    },
    bodyParagraphs: [
      {
        zh: "目前访问 penguin.ooo/leaderboards/harness-comparison 和 penguin.ooo/leaderboards/gdpevo-essential 已经可以交互式查看首期实验的排名柱状图（Table）、成本-得分帕累托前沿（Pareto）与单题得分华夫图（Waffle）。",
        en: "Visit penguin.ooo/leaderboards/harness-comparison and penguin.ooo/leaderboards/gdpevo-essential to inspect the live Table, Pareto cost-score frontier, and per-task Waffle charts from Phase I.",
      },
      {
        zh: "在二期任务中，我们希望回答两个关键科学问题：（1）除了 PenguinHarness 外，OpenHands、Claude Code、Codex CLI、SWE-agent 等框架在挂载相同自进化规则前后的净提升幅度分别是多少？（2）不同基座大模型（Kimi-K3、GLM-5.3、Qwen3、DeepSeek V4.1、Claude、Gemini、GPT）谁的「自反思与规则蒸馏」天花板最高？欢迎大家认领 RSI-Q004 与 RSI-Q005！",
        en: "In Phase II, we aim to measure: (1) pre- vs. post-RSI evolution deltas across external agent frameworks (OpenHands, Claude Code, Codex CLI, SWE-agent), and (2) which backbone models exhibit the steepest self-evolution learning curves.",
      },
    ],
    externalLinks: [
      { label: "Harness Comparison Leaderboard", url: "https://penguin.ooo/leaderboards/harness-comparison" },
      { label: "GDPEVO Essential Leaderboard", url: "https://penguin.ooo/leaderboards/gdpevo-essential" },
    ],
  },
  {
    id: "thread-plugins-langgraph-dify",
    board: "plugin-forge",
    tag: { zh: "生态共建 · 插件与跨框架", en: "Ecosystem · Plugins & Bridges" },
    title: {
      zh: "【架构征集】知识库插件、Ontology 本体插件，以及用 PenguinHarness RSI 自动进化 LangGraph 与 Dify 工作流的设计思路",
      en: "[RFC & Design] Self-Evolving Knowledge Base, Ontology Plugin, and Optimizing LangGraph & Dify with PenguinHarness RSI",
    },
    author: {
      handle: "lzh368",
      name: "Zhihao Liu",
      avatar: "https://avatars.githubusercontent.com/u/174015635?v=4",
      badge: { zh: "Lv.3 框架工匠 · 主委", en: "Lv.3 Artisan · Chair" },
    },
    createdAt: "2026-11-07",
    replies: 15,
    views: "760",
    linkedQuestId: "RSI-Q006",
    excerpt: {
      zh: "很多生产环境团队已经在用 LangGraph 或 Dify 编排业务工作流，但节点 Prompt 和分支条件全靠人工反复试错。如何把任意外部工作流当成被测黑盒/白盒接入 PenguinHarness 的 Reflector/Curator 自动进化？同时探讨知识库插件与 Ontology 本体插件的表结构设计。",
      en: "How to plug existing LangGraph graphs and Dify DSL workflows into PenguinHarness's Reflector/Curator loop for automated prompt and routing evolution, alongside our Knowledge Base and Ontology plugins.",
    },
    bodyParagraphs: [
      {
        zh: "围绕 PenguinHarness 的生态扩展，我们设立了四个紧密联动的工程任务：知识库插件（RSI-Q006）、本体 Ontology 插件（RSI-Q007）、RSI 优化 LangGraph（RSI-Q008）和 RSI 优化 Dify（RSI-Q009）。",
        en: "We have opened four interconnected engineering quests: Knowledge Base Plugin (RSI-Q006), Ontology Plugin (RSI-Q007), Optimizing LangGraph with RSI (RSI-Q008), and Optimizing Dify with RSI (RSI-Q009).",
      },
      {
        zh: "对于 Dify 与 LangGraph：只需将工作流的单次运行包装为符合 RFC-0002 的评测脚本，采集输入、输出、工具调用及中间节点报错写入 Trace，PenguinHarness 的 ACE / OPRO 优化器就能自动定位薄弱节点并输出演进后的 Dify DSL YAML 或 LangGraph 节点配置！",
        en: "For Dify and LangGraph: by wrapping workflow execution into an RFC-0002 evaluation runner and capturing node-level traces, PenguinHarness's ACE/OPRO optimizers can automatically diagnose bottlenecks and emit evolved Dify DSL YAML or LangGraph node prompts.",
      },
    ],
  },
  {
    id: "thread-fun-beginner-tutorial",
    board: "bounty-hall",
    tag: { zh: "有奖征集 · 登上官方博客", en: "Call for Tutorials · Penguin Blog" },
    title: {
      zh: "【点子碰撞】什么样的新手入门教程最好玩、最能让人 15 分钟亲眼见证 Agent 自进化威力？（入选直通 penguin.ooo 博客）",
      en: "[Brainstorm] What Makes the Most Fun 15-Minute Beginner Tutorial to Visibly Prove Agent Self-Evolution?",
    },
    author: {
      handle: "ArisaZz",
      name: "Xiang Qu",
      avatar: "https://avatars.githubusercontent.com/u/74355374?v=4",
      badge: { zh: "Lv.3 框架工匠 · 主委", en: "Lv.3 Artisan · Chair" },
    },
    createdAt: "2026-11-06",
    replies: 22,
    views: "890",
    linkedQuestId: "RSI-Q010",
    excerpt: {
      zh: "好的入门教程不应该一上来就跑几十个小时的大规模基准，而是要在 10~15 分钟、几毛钱 Token 成本内，让读者看着一个「笨拙的初始 Agent」在有趣的任务里通过 3 轮自进化变成「满级高手」。欢迎认领 RSI-Q010 或在帖子里分享你的创意！",
      en: "A great beginner tutorial shouldn't require hours of compute — it should let a newcomer watch a clumsy starter agent evolve into a master in 15 minutes on a fun, visual task. Claim RSI-Q010 or share your ideas!",
    },
    bodyParagraphs: [
      {
        zh: "目前群里呼声最高的几个趣味入门教程方向：（A）机关地牢寻宝 Agent：初始 Agent 不懂隐藏陷阱规律屡屡阵亡（胜率 30%），经过 2 轮 ACE 反思自动在 Playbook 中总结出机关触发因果律，第 3 轮通关率飙升到 90%；（B）24 点 / 逻辑解谜或策略卡牌对战 Agent：直观对比进化前后生成的 `AGENTS.md` 策略手册 Diff；（C）自动修 Bug 闯关小游戏。完成 RSI-Q010 不仅可获 400 EXP + 基准星盘 ×2，还将作为官方精选教程发布在 penguin.ooo 首页博客！",
        en: "Popular tutorial ideas so far: (A) Dungeon Trap Explorer where the agent discovers hidden causal trap rules across 3 RSI rounds, jumping from 30% to 90% survival; (B) Strategy Card / Logic Puzzle Duel with visual playbook diffs; (C) Mini Bug-Fixing Arcade. Completed tutorials (RSI-Q010) earn 400 EXP + 2× Benchmark Astrolabes and featured publication on penguin.ooo!",
      },
    ],
  },
];

export const PARTICIPATING_AFFILIATIONS: { category: Text; items: string[] }[] = [
  {
    category: { zh: "社群成员来自高校与科研院所", en: "Universities & Research Institutes in Our Community" },
    items: [
      "Beihang University (北航)",
      "Tsinghua University (清华)",
      "Peking University (北大)",
      "Shanghai AI Lab / SII (上海创智)",
      "UCAS / CASIA (中科院)",
      "Zhejiang University (浙大)",
      "SJTU (上交)",
      "USTC (中科大)",
      "HKUST / HKU",
      "Stanford / MIT / UCLA / UW (Academic Exchange)",
    ],
  },
  {
    category: { zh: "技术交流与开源生态连接", en: "Open-Source & Industry Ecosystem Connections" },
    items: [
      "Prism Shadow",
      "PenguinHarness",
      "LlamaFactory Ecosystem",
      "TokenDance / Penguin Go",
      "Agent Hub Community",
      "Open-Source Agent & RSI Researchers",
    ],
  },
];

export function buildClaimIssueUrl(quest: QuestItem, locale: Locale): string {
  const title =
    locale === "zh"
      ? `[Task Claim] 认领任务 ${quest.id}: ${quest.title.zh}`
      : `[Task Claim] Claim ${quest.id}: ${quest.title.en}`;
  const body =
    locale === "zh"
      ? [
          `/claim ${quest.id}`,
          "",
          `### 认领任务信息`,
          `- **任务编号**：\`${quest.id}\``,
          `- **任务名称**：${quest.title.zh}`,
          `- **目标仓库**：\`${quest.targetRepo}\``,
          `- **成长值奖励**：\`+${quest.exp} EXP\``,
          "",
          `### 认领人承诺与实现计划`,
          `- [x] 我确认当前本人名下未完结的社区任务数 < 2（符合 RFC-0006 防滥用并发上限 ≤ 2 的规定）。`,
          `- [x] 我将在 14 天内于目标仓库 \`${quest.targetRepo}\` 提交关联 PR 或在此 Issue 更新进展。`,
          "",
          `#### 简要复现/实现思路：`,
          `> 请在此处简要填写你的计划或环境准备情况...`,
        ].join("\n")
      : [
          `/claim ${quest.id}`,
          "",
          `### Quest Claim Details`,
          `- **Quest ID**: \`${quest.id}\``,
          `- **Quest Title**: ${quest.title.en}`,
          `- **Target Repository**: \`${quest.targetRepo}\``,
          `- **Growth Reward**: \`+${quest.exp} EXP\``,
          "",
          `### Claimant Checklist & Plan`,
          `- [x] I confirm that I currently hold fewer than 2 active claimed tasks (complying with RFC-0006 max concurrent claims <= 2).`,
          `- [x] I will open a linked PR in \`${quest.targetRepo}\` or post a progress update within 14 days.`,
          "",
          `#### Brief Implementation / Reproduction Plan:`,
          `>Briefly describe your approach or timeline here...`,
        ].join("\n");
  return `${REPO_URL}/issues/new?title=${encodeURIComponent(title)}&body=${encodeURIComponent(body)}`;
}

export function buildCommitteeApplyUrl(domain: CommitteeDomain, seatRole: string, locale: Locale): string {
  const title =
    locale === "zh"
      ? `[Committee Application] 报名参选：${domain.title.zh} — ${seatRole}`
      : `[Committee Application] Apply for ${domain.title.en} — ${seatRole}`;
  const body =
    locale === "zh"
      ? [
          `/apply-committee ${domain.id}`,
          "",
          `### 竞聘委员会席位`,
          `- **所属专业委员会**：${domain.title.zh}`,
          `- **申请席位**：${seatRole}`,
          `- **固定月度津贴**：$100 USD 等值奖励 / 月（Token 额度 / 算力券 / 云服务器）`,
          "",
          `### 申请人简介与代表性贡献`,
          `- **GitHub ID**：@`,
          `- **研究/工程方向**：`,
          `- **过往在 RSI / Agent / 开源社区的相关工作或已完成任务**：`,
          `- **当选后的月度任务发布与社区运营设想**：`,
        ].join("\n")
      : [
          `/apply-committee ${domain.id}`,
          "",
          `### Committee Seat Application`,
          `- **Committee Track**: ${domain.title.en}`,
          `- **Seat Role**: ${seatRole}`,
          `- **Monthly Stipend**: $100 USD equivalent / month (Token credits / GPU vouchers / servers)`,
          "",
          `### Applicant Profile & Contributions`,
          `- **GitHub Handle**: @`,
          `- **Research / Engineering Focus**:`,
          `- **Prior RSI / Agent / Open-Source Contributions**:`,
          `- **Proposed Monthly Quests & Community Stewardship Plan**:`,
        ].join("\n");
  return `${REPO_URL}/issues/new?title=${encodeURIComponent(title)}&body=${encodeURIComponent(body)}`;
}

export function buildNewThreadIssueUrl(locale: Locale): string {
  const title =
    locale === "zh"
      ? `[Forum Thread] 社区酒馆新帖：在此填写讨论主题`
      : `[Forum Thread] New Tavern Discussion: Your Topic Title`;
  const body =
    locale === "zh"
      ? [
          `/forum-post`,
          "",
          `- **所属版块**：\`#paper-guild\` | \`#arena-human-rsi\` | \`#bounty-hall\` | \`#plugin-forge\``,
          `- **关联任务（可选）**：\`RSI-Q001\``,
          "",
          `### 正文内容`,
          `> 欢迎分享论文阅读笔记、实验复现踩坑、跨框架对比发现或新任务提议！`,
        ].join("\n")
      : [
          `/forum-post`,
          "",
          `- **Board Channel**: \`#paper-guild\` | \`#arena-human-rsi\` | \`#bounty-hall\` | \`#plugin-forge\``,
          `- **Linked Quest (Optional)**: \`RSI-Q001\``,
          "",
          `### Discussion Body`,
          `> Share your paper reading notes, reproduction findings, cross-framework insights, or new quest proposals!`,
        ].join("\n");
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
