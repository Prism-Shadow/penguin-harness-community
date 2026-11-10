import type { Locale } from "./i18n";
import { REPO_URL } from "./site";

type Text = Record<Locale, string>;

export type QuestStatus = "open" | "in_progress" | "completed";
export type QuestDomainId = "benchmark" | "evaluation" | "rsi-algorithm" | "penguin-harness";

export interface QuestDomainInfo {
  id: QuestDomainId;
  label: Text;
}

export const QUEST_DOMAINS: QuestDomainInfo[] = [
  { id: "benchmark", label: { zh: "Benchmark", en: "Benchmark" } },
  { id: "evaluation", label: { zh: "Evaluation", en: "Evaluation" } },
  { id: "rsi-algorithm", label: { zh: "RSI 算法", en: "RSI Algorithm" } },
  { id: "penguin-harness", label: { zh: "PenguinHarness", en: "PenguinHarness" } },
];

export interface QuestReference {
  label: string;
  url: string;
}

export interface QuestItem {
  id: string;
  status: QuestStatus;
  domain: QuestDomainId;
  exp: number;
  title: Text;
  description: Text;
  references: QuestReference[];
  issueUrl: string;
  assignee?: string;
}

export const QUESTS: QuestItem[] = [
  {
    id: "RSI-Q001",
    status: "open",
    domain: "benchmark",
    exp: 50,
    title: {
      zh: "集成 SWE-bench",
      en: "Integrate SWE-bench",
    },
    description: {
      zh: "将真实 GitHub 软件工程评测基准 SWE-bench 接入 penguin-harness-benchmark，封装标准化容器评测环境与自动评分脚本（遵循 RFC-0001 规范）。",
      en: "Integrate the SWE-bench software engineering benchmark into penguin-harness-benchmark with standardized container environments and grading scripts (per RFC-0001).",
    },
    references: [
      { label: "SWE-bench Repo", url: "https://github.com/SWE-bench/SWE-bench" },
      { label: "Paper (arXiv:2310.06770)", url: "https://arxiv.org/abs/2310.06770" },
      { label: "penguin-harness-benchmark", url: "https://github.com/Prism-Shadow/penguin-harness-benchmark" },
    ],
    issueUrl: `${REPO_URL}/issues`,
  },
  {
    id: "RSI-Q002",
    status: "open",
    domain: "benchmark",
    exp: 50,
    title: {
      zh: "集成 FDE-gym",
      en: "Integrate FDE-gym",
    },
    description: {
      zh: "将前沿数据与工程评测环境 FDE-gym 集成至 penguin-harness-benchmark，按 RFC-0001 标准提供可复现的评测任务集与验证器。",
      en: "Integrate FDE-gym into penguin-harness-benchmark as a standard reproducible benchmark suite and verifier following RFC-0001.",
    },
    references: [
      { label: "deeplethe/fde-gym", url: "https://github.com/deeplethe/fde-gym" },
      { label: "penguin-harness-benchmark", url: "https://github.com/Prism-Shadow/penguin-harness-benchmark" },
    ],
    issueUrl: `${REPO_URL}/issues`,
  },
  {
    id: "RSI-Q003",
    status: "open",
    domain: "evaluation",
    exp: 50,
    title: {
      zh: "Codex 的自进化效果对比",
      en: "Codex Self-Evolution Comparison",
    },
    description: {
      zh: "在标准评测基准上对比 Codex 在接入自进化（RSI）前后的任务解决率与 Token 成本变化，提交完整实验轨迹并更新跨框架榜单。",
      en: "Evaluate Codex before and after Recursive Self-Improvement (RSI) on standard benchmarks, submitting full execution traces to the cross-harness leaderboard.",
    },
    references: [
      { label: "openai/codex", url: "https://github.com/openai/codex" },
      { label: "Harness Comparison Leaderboard", url: "https://penguin.ooo/leaderboards/harness-comparison" },
      { label: "penguin-harness-benchmark", url: "https://github.com/Prism-Shadow/penguin-harness-benchmark" },
    ],
    issueUrl: `${REPO_URL}/issues`,
  },
  {
    id: "RSI-Q004",
    status: "open",
    domain: "evaluation",
    exp: 50,
    title: {
      zh: "GPT-6 模型的进化能力实验",
      en: "GPT-6 Evolution Capability Experiment",
    },
    description: {
      zh: "评测 GPT-6 作为基座模型在多轮自进化（ACE / OPRO / Skill 演化）下的分数提升幅度与泛化表现，并将评测结果补充至 GDPEVO 榜单。",
      en: "Measure GPT-6's multi-round self-evolution gains and generalization across standard RSI methods, contributing traces to the GDPEVO leaderboard.",
    },
    references: [
      { label: "GDPEVO Essential Leaderboard", url: "https://penguin.ooo/leaderboards/gdpevo-essential" },
      { label: "penguin-harness-benchmark", url: "https://github.com/Prism-Shadow/penguin-harness-benchmark" },
    ],
    issueUrl: `${REPO_URL}/issues`,
  },
  {
    id: "RSI-Q005",
    status: "open",
    domain: "rsi-algorithm",
    exp: 50,
    title: {
      zh: "集成 RSIAgent 方法",
      en: "Integrate RSIAgent Method",
    },
    description: {
      zh: "复现并集成 RSIAgent（arXiv:2609.15364），通过 Curriculum、Actor 与 Verifier 智能体执行先广度后深度的环境探索，构建可复用的冻结因果记忆。",
      en: "Implement and integrate RSIAgent (arXiv:2609.15364), coordinating Curriculum, Actor, and Verifier agents for broad-then-deep exploration and frozen causal memory.",
    },
    references: [
      { label: "RSIAgent Paper (arXiv:2609.15364)", url: "https://arxiv.org/abs/2609.15364" },
      { label: "penguin-harness-plugins", url: "https://github.com/Prism-Shadow/penguin-harness-plugins" },
    ],
    issueUrl: `${REPO_URL}/issues`,
  },
  {
    id: "RSI-Q006",
    status: "open",
    domain: "rsi-algorithm",
    exp: 50,
    title: {
      zh: "集成 RRSI 方法",
      en: "Integrate RRSI Method",
    },
    description: {
      zh: "复现并集成正则化递归自进化方法 RRSI（arXiv:2609.24972），包含退火修改预算 Proposer、防基准过拟合 Critic 与 Token 剪枝器 Pruner。",
      en: "Implement and integrate Regularized RSI (RRSI, arXiv:2609.24972) with annealed proposer budget, anti-overfitting critic, and token pruner.",
    },
    references: [
      { label: "RRSI Paper (arXiv:2609.24972)", url: "https://arxiv.org/abs/2609.24972" },
      { label: "google-research/rrsi", url: "https://github.com/google-research/rrsi" },
      { label: "penguin-harness-plugins", url: "https://github.com/Prism-Shadow/penguin-harness-plugins" },
    ],
    issueUrl: `${REPO_URL}/issues`,
  },
  {
    id: "RSI-Q007",
    status: "open",
    domain: "penguin-harness",
    exp: 50,
    title: {
      zh: "开发知识库插件",
      en: "Develop Knowledge Base Plugin",
    },
    description: {
      zh: "为 PenguinHarness 开发知识库插件，支持多源文档切分入库、混合检索、行内引用标注以及从 Agent 轨迹中持续沉淀领域知识。",
      en: "Develop a Knowledge Base plugin for PenguinHarness supporting document ingestion, hybrid retrieval, inline citations, and trace-driven knowledge accumulation.",
    },
    references: [
      { label: "penguin-harness", url: "https://github.com/Prism-Shadow/penguin-harness" },
      { label: "penguin-harness-plugins", url: "https://github.com/Prism-Shadow/penguin-harness-plugins" },
    ],
    issueUrl: `${REPO_URL}/issues`,
  },
  {
    id: "RSI-Q008",
    status: "open",
    domain: "penguin-harness",
    exp: 50,
    title: {
      zh: "开发本体插件",
      en: "Develop Ontology Plugin",
    },
    description: {
      zh: "为 PenguinHarness 开发本体（Ontology）插件，支持实体、关系与动作契约的结构化建模及基于执行轨迹的本体自动演化。",
      en: "Develop an Ontology plugin for PenguinHarness providing typed entity-relation-action modeling and trace-driven ontology refinement.",
    },
    references: [
      { label: "penguin-harness", url: "https://github.com/Prism-Shadow/penguin-harness" },
      { label: "penguin-harness-plugins", url: "https://github.com/Prism-Shadow/penguin-harness-plugins" },
    ],
    issueUrl: `${REPO_URL}/issues`,
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

export function buildProposeTaskIssueUrl(locale: Locale): string {
  const title = locale === "zh" ? "[Task] 任务标题" : "[Task] Task Title";
  const body =
    locale === "zh"
      ? `### 领域 (Domain)\nBenchmark | Evaluation | RSI 算法 | PenguinHarness\n\n### 经验值 (EXP)\n50 EXP\n\n### 任务描述 (Description)\n请填写任务目标、验收标准以及原始论文或代码仓库链接（社区定时 Agent 会根据此 Issue 自动创建并同步任务）。\n\n### 相关链接 (References)\n- `
      : `### Domain\nBenchmark | Evaluation | RSI Algorithm | PenguinHarness\n\n### EXP\n50 EXP\n\n### Description\nDescribe the goal, acceptance criteria, and original paper or repository links (the scheduled community agent will automatically create and sync the task from this Issue).\n\n### References\n- `;
  return `${REPO_URL}/issues/new?title=${encodeURIComponent(title)}&body=${encodeURIComponent(body)}`;
}
