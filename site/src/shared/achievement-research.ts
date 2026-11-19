import { resolveText, type QuestItem } from "./community";
import type { Locale } from "./i18n";

type Text = Record<Locale, string>;
type Phase = {
  label: Text;
  work: Text;
  evidence: Text;
  dataset?: Text;
  issues?: number[];
  pending?: Text;
  reference?: { label: Text; url: string };
};
type TopicDefinition = { id: string; title: Text; phases?: Phase[] };
type ProjectDefinition = TopicDefinition & { demoAchieved?: true; followUp?: TopicDefinition };
type Achievement = "demo-achieved" | "unlocked" | "locked";
const routeTitles = {
  infra: { zh: "InfraRSI", en: "InfraRSI" },
  "auto-bench": { zh: "Auto Bench", en: "Auto Bench" },
  agent: { zh: "Super Agent 与 Personal Agent", en: "Super Agent & Personal Agent" },
  platform: { zh: "RSI 平台与应用", en: "RSI platform & applications" },
};
type RouteId = keyof typeof routeTitles;
type VersionDefinition = {
  id: string;
  preview?: true;
  projects: Partial<Record<RouteId, ProjectDefinition[]>>;
};

const infraRun = "https://github.com/Prism-Shadow/penguin-harness/pull/1551#issuecomment-6997394473";
const trainingPhases: Phase[] = [
  {
    label: { zh: "Bench", en: "Bench" },
    pending: { zh: "待接入", en: "Pending integration" },
    work: {
      zh: "按 RFC-0001 接入 NanoChat AutoResearch 基准，固定基准版本、数据准备流程和评测规则。",
      en: "Integrate the NanoChat AutoResearch benchmark under RFC-0001. Pin its version, data preparation, and evaluation rules.",
    },
    dataset: {
      zh: "试跑使用 ClimbMix 镜像（karpathy/climbmix-400b-shuffle），训练分片 00000–00009，验证分片 06542。社区基准的数据版本与划分待 #83 确认。",
      en: "The trial used the ClimbMix mirror (karpathy/climbmix-400b-shuffle), training shards 00000–00009, and validation shard 06542. The community benchmark's dataset version and splits are pending confirmation in issue #83.",
    },
    evidence: {
      zh: "交付可运行的基准包，支持数据准备、基线复跑和候选自动评分。",
      en: "Deliver a runnable benchmark package with data preparation, baseline reproduction, and automated candidate scoring.",
    },
    issues: [83],
  },
  {
    label: { zh: "实验", en: "Run" },
    pending: { zh: "待验收", en: "Pending acceptance" },
    work: {
      zh: "PR #1551 在单张 NVIDIA A100 80GB 上试跑。使用修复版 AutoResearch（228791f），固定 50.3M 参数模型、优化器与每步 2¹⁹ Token，基线 micro-batch 为 128。",
      en: "PR #1551 reports a trial on one NVIDIA A100 80GB. It uses patched AutoResearch (228791f) with a fixed 50.3M-parameter model, optimizer, and 2¹⁹ tokens per update. The baseline micro-batch size is 128.",
    },
    evidence: {
      zh: "B-Comp 试跑搜索了 micro-batch 大小和训练代码改动。固定训练 60 步，计时第 21–60 步。候选、验证输出和成对复测记录供验收时复核。",
      en: "The B-Comp trial searched micro-batch sizes and training-code edits. Each run used 60 updates and timed updates 21–60. Candidate runs, verifier output, and paired reruns are available for review.",
    },
    reference: { label: { zh: "B-Comp 试跑记录", en: "B-Comp trial records" }, url: infraRun },
  },
  {
    label: { zh: "结果", en: "Results" },
    pending: { zh: "待确认", en: "Pending confirmation" },
    work: {
      zh: "待确认课题的基线与候选对照结果。PR 中的成对复测作为试跑记录供复核。",
      en: "Confirm the project's baseline and candidate comparison. The paired measurements in the PR remain available as trial records for review.",
    },
    evidence: {
      zh: "结果表应注明运行条件、单步耗时、训练 loss 和验证集 BPB，并能追溯到原始日志。",
      en: "Record run conditions, step time, training loss, and validation BPB in a results table linked to raw logs.",
    },
    reference: { label: { zh: "试跑复测原始记录", en: "Raw trial measurements" }, url: infraRun },
  },
  {
    label: { zh: "结果分析", en: "Analysis" },
    pending: { zh: "待分析", en: "Pending analysis" },
    work: {
      zh: "结果确认后，分析单步耗时、额外编译开销及不同运行之间的波动。",
      en: "Once results are confirmed, analyze step time, additional compilation overhead, and variability across runs.",
    },
    evidence: {
      zh: "根据确认后的结果记录端到端收益、适用条件和实验局限。",
      en: "Document the end-to-end gains, applicable conditions, and limitations supported by the confirmed results.",
    },
  },
  {
    label: { zh: "报告", en: "Report" },
    pending: { zh: "待评审", en: "Pending review" },
    work: {
      zh: "试跑资料已随插件 PR 提交，课题报告待评审。",
      en: "The plugin PR includes the trial materials. The project report is pending review.",
    },
    evidence: {
      zh: "跟踪社区任务 #71 对实测记录及插件适配的验收。",
      en: "Track acceptance of the experiment records and plugin integration in community issue #71.",
    },
    issues: [71],
  },
];

const autoResearch: TopicDefinition = {
  id: "autoresearch-a100",
  title: {
    zh: "面向 NVIDIA GPU 的 AutoResearch 预训练性能优化",
    en: "AutoResearch Pretraining Performance Tuning for NVIDIA GPUs",
  },
  phases: trainingPhases,
};

const speedrun: TopicDefinition = {
  id: "nanogpt-speedrun-transfer",
  title: { zh: "NanoGPT Speedrun 训练优化迁移验证", en: "Training Optimization Transfer to NanoGPT Speedrun" },
  phases: [
    {
      label: { zh: "Bench", en: "Bench" },
      pending: { zh: "待接入", en: "Pending integration" },
      work: {
        zh: "选定 NanoGPT Speedrun 赛道，固定版本、数据和达标规则。",
        en: "Select a NanoGPT Speedrun track and pin its version, data, and target criteria.",
      },
      evidence: { zh: "可复跑的赛道基线与评分入口。", en: "A reproducible track baseline and scoring entry point." },
      issues: [84],
    },
    {
      label: { zh: "实验", en: "Run" },
      pending: { zh: "待开展", en: "Pending experiment" },
      work: {
        zh: "迁移 AutoResearch 中验收通过的训练优化。在相同硬件和赛道规则下，对照原始基线和迁移版本。",
        en: "Transfer an accepted AutoResearch optimization and compare it with the Speedrun baseline on the same hardware under the same track rules.",
      },
      evidence: { zh: "迁移补丁、实验配置和两组训练日志。", en: "The transfer patch, configurations, and logs for both variants." },
    },
    {
      label: { zh: "结果", en: "Results" },
      pending: { zh: "待确认", en: "Pending confirmation" },
      work: { zh: "记录两组的达标耗时和验证质量。", en: "Record time to target and validation quality for both variants." },
      evidence: { zh: "可追溯到原始日志的对照结果表。", en: "A comparison table linked to the raw run logs." },
    },
    {
      label: { zh: "结果分析", en: "Analysis" },
      pending: { zh: "待分析", en: "Pending analysis" },
      work: { zh: "分析优化收益能否在另一套训练负载上复现。", en: "Assess whether the gain carries over to a second workload." },
      evidence: { zh: "基于重复运行的迁移结论及适用条件。", en: "A conclusion and applicability conditions supported by repeated runs." },
    },
    {
      label: { zh: "报告", en: "Report" },
      pending: { zh: "待提交", en: "Pending submission" },
      work: { zh: "整理迁移步骤、配置、对照结果和复跑说明。", en: "Document the transfer, configurations, comparisons, and rerun instructions." },
      evidence: { zh: "可评审的跨基准迁移实验报告。", en: "A reviewable cross-benchmark transfer report." },
    },
  ],
};

const versions: VersionDefinition[] = [
  {
    id: "v1",
    projects: { infra: [autoResearch] },
  },
  {
    id: "v2",
    preview: true,
    projects: {
      infra: [
        { ...autoResearch, demoAchieved: true, followUp: speedrun },
        { id: "kernel-template", title: { zh: "算子实验模板", en: "Kernel experiment template" } },
      ],
    },
  },
];
const empty = { zh: "待填写", en: "To be filled in" };
const blankPhases = trainingPhases.map(({ label }) => ({ label, work: empty, evidence: empty }));

export function researchVersions(quests: QuestItem[], locale: Locale) {
  const byIssue = new Map(quests.map((q) => [q.issueNumber, q]));
  const stageDetails = (phase: Phase, demoAchieved: boolean) => {
    const tasks = (phase.issues ?? []).map((number) => ({ number, quest: byIssue.get(number) }));
    const state = demoAchieved || (tasks.length > 0 && tasks.every(({ quest }) => quest?.status === "completed")) ? "done"
      : phase.pending ? "planned"
      : tasks.some(({ quest }) => quest?.status === "in_progress") ? "active"
      : tasks.some(({ quest }) => quest?.status === "completed") ? "started"
      : "planned";
    return {
      label: resolveText(phase.label, locale),
      work: resolveText(phase.work, locale),
      dataset: phase.dataset && resolveText(phase.dataset, locale),
      evidence: resolveText(phase.evidence, locale),
      tasks,
      pending: phase.pending && resolveText(phase.pending, locale),
      reference: phase.reference,
      state,
    };
  };
  const topicDetails = (topic: TopicDefinition, achievement?: Achievement) => ({
    id: topic.id,
    title: resolveText(topic.title, locale),
    template: topic.phases === undefined,
    achievement,
    stages: (topic.phases ?? blankPhases).map(phase => stageDetails(phase, achievement === "demo-achieved")),
  });
  return versions.map((version) => ({
    id: version.id,
    preview: version.preview,
    routes: (Object.keys(routeTitles) as RouteId[]).map((id) => ({
      id,
      title: resolveText(routeTitles[id], locale),
      projects: (version.projects[id] ?? []).map((project) => {
        const demoAchieved = version.preview && project.demoAchieved;
        return {
          ...topicDetails(project, demoAchieved ? "demo-achieved" : undefined),
          followUp: version.preview && project.followUp
            ? topicDetails(project.followUp, demoAchieved ? "unlocked" : "locked")
            : undefined,
        };
      }),
    })),
  }));
}

export type ResearchVersion = ReturnType<typeof researchVersions>[number];
export type ResearchProject = Omit<ResearchVersion["routes"][number]["projects"][number], "followUp">;
