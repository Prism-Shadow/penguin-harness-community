import type { Locale } from "./i18n";

/**
 * The community achievement tree: long-term routes → work branches → medals.
 *
 * Each medal names its acceptance criteria and prerequisites. Most are verified by
 * completed registry tasks. An integration outside the registry records its merged
 * PR here. A separately assessed experiment records its approved report link.
 *
 * Arrows follow explicit medal prerequisites. Sharing a quest does not imply a prerequisite.
 */

export type Text = { zh: string; en: string };

// Artifact names follow Awesome-RSI's Methods & Systems taxonomy.
export const RSI_ARTIFACTS = {
  "model-parameters": { zh: "模型参数", en: "Model parameters" },
  "harness-code": { zh: "Harness 代码", en: "Harness code" },
  context: { zh: "上下文", en: "Context" },
  memory: { zh: "记忆", en: "Memory" },
  skill: { zh: "技能", en: "Skill" },
  "other-artifacts": { zh: "其他产物", en: "Other artifacts" },
} satisfies Record<string, Text>;

export interface MedalDef {
  id: string;
  /** Short enough for a card: at most ~14 Chinese characters. */
  name: Text;
  /** What is true once it is lit. */
  intent: Text;
  /** What the community must show before the quests below count as done. */
  evidence: Text;
  /** Registry Issue numbers whose completion lights this medal. */
  quests: number[];
  /** A verified merged integration PR for a milestone without a registry task. */
  mergedPr?: string;
  /** Secondary artifact categories shown in details. The medal is counted in its own branch. */
  relatedArtifacts?: (keyof typeof RSI_ARTIFACTS)[];
  /** Any one of the listed tasks satisfies this milestone. */
  anyQuest?: boolean;
  /** Include future instances of the standing quest, matched as in community-agent-sync. */
  recurringQuest?: number;
  /** An approved experiment report, or null while the report awaits acceptance. */
  acceptedReport?: string | null;
  /** A specific prerequisite task when a whole prerequisite medal would be too broad. */
  requiresQuests?: number[];
  /** Medals that must be lit before this one can be earned. */
  requires?: string[];
  /** Any one of the listed prerequisite medals unlocks this result. */
  anyPrerequisite?: boolean;
  /** Anything the materials do not settle yet. */
  pending?: Text;
}

export interface BranchDef {
  id: string;
  /** Omit for medals attached directly to the route. */
  name?: Text;
  medals: MedalDef[];
}

export interface RouteDef {
  id: string;
  name: Text;
  /** One line: the question this route answers. */
  aim: Text;
  branches: BranchDef[];
}

export const ACHIEVEMENT_TREE: RouteDef[] = [
  {
    id: "infra",
    name: { zh: "InfraRSI", en: "InfraRSI" },
    aim: { zh: "训练、算子与推理的自进化优化", en: "Self-improving training, kernels and inference" },
    branches: [
      {
        id: "arena",
        name: { zh: "评测基准", en: "Benchmarks" },
        medals: [
          {
            id: "infra-train-bench", name: { zh: "训练基线建立", en: "Training baseline established" },
            intent: { zh: "在一个真实训练负载上建立可重复运行的比较基线。", en: "Establish a repeatable baseline on a real training workload." },
            evidence: { zh: "NanoChat 或 NanoGPT Speedrun 至少一项通过验收，记录基线配置、工作量、计时规则与实测结果。", en: "Accept a NanoChat or NanoGPT Speedrun baseline with its configuration, workload, timing protocol and measurements." },
            quests: [83, 84], anyQuest: true,
          },
          {
            id: "infra-kernel-bench", name: { zh: "算子评测基准接入", en: "Kernel benchmark integrated" },
            intent: { zh: "使用 SOL-ExecBench 评测 GPU 算子的正确性与性能。", en: "Evaluate GPU kernel correctness and performance on SOL-ExecBench." },
            evidence: { zh: "基准接入并通过验收，提供数值校验与性能评分的复现步骤。", en: "An accepted benchmark integration with reproducible numerical checks and performance scores." },
            quests: [85],
          },
        ],
      },
      {
        id: "method",
        name: { zh: "优化方法", en: "Optimisation methods" },
        medals: [
          {
            id: "infra-method", name: { zh: "优化插件端到端验证", en: "Optimisation plugin validated end to end" },
            intent: { zh: "InfraRSI 能修改训练配置与代码并运行候选方案。", en: "InfraRSI can modify a training configuration or code and execute a candidate." },
            evidence: { zh: "InfraRSI 插件通过验收，提供一次端到端运行的配置与记录。", en: "An accepted InfraRSI plugin with the configuration and logs for an end-to-end run." },
            quests: [71],
          },
          {
            id: "infra-autoresearch", name: { zh: "双层研究循环验证", en: "Two-level research loop validated" },
            intent: { zh: "在训练或算子优化任务上验证 ERNIE Evolve 双层研究循环。", en: "Verify ERNIE Evolve’s two-level research loop on a training or kernel optimisation task." },
            evidence: { zh: "在 NanoChat、NanoGPT Speedrun 或 SOL-ExecBench 中任选一项跑通端到端实验，提交候选树演化记录和相对基线的改进结果。", en: "Run an end-to-end experiment on NanoChat, NanoGPT Speedrun or SOL-ExecBench. Submit the candidate tree history and a verified improvement over the baseline." },
            quests: [86], requires: ["infra-train-bench", "infra-kernel-bench"], anyPrerequisite: true,
          },
        ],
      },
      {
        id: "proof",
        name: { zh: "实验验证", en: "Experimental validation" },
        medals: [
          {
            id: "infra-recipe", name: { zh: "Qwen3.8 训练优化验证", en: "Qwen3.8 training optimisation" },
            intent: { zh: "在 Qwen3.8 训练或后训练中验证优化效果。", en: "Evaluate an optimisation during Qwen3.8 training or post-training." },
            evidence: { zh: "与 Qwen3.8 基线对比，在模型精度不降低的前提下验证收敛加速或能力提升。提交经独立复核的改动、候选树实验记录和对比报告。", en: "Compare against a Qwen3.8 baseline and demonstrate faster convergence or improved model capability without loss of accuracy. Submit independently reviewed changes, candidate tree logs and the comparison report." },
            quests: [87],
          },
          {
            id: "infra-chip-kernel", name: { zh: "国产芯片分布式训练性能验证", en: "Distributed training on domestic accelerators" },
            intent: { zh: "评测国产算力芯片上算子与通信优化对训练的影响。", en: "Measure the effects of kernel and communication changes on distributed training." },
            evidence: { zh: "在训练结果对齐的前提下，提交优化前后的耗时与吞吐记录。", en: "Compare training time and throughput before and after optimisation at equivalent numerical results." },
            quests: [89],
          },
          {
            id: "infra-chip-speed", name: { zh: "国产芯片推理性能验证", en: "Inference on domestic accelerators" },
            intent: { zh: "评测国产算力芯片上端到端推理的时延与吞吐。", en: "Measure end-to-end inference latency and throughput on accelerators." },
            evidence: { zh: "在相同模型质量要求与负载下，提交推理基线及优化方案的时延与吞吐对照记录。", en: "Record baseline and optimised latency and throughput under matching workloads and quality requirements." },
            quests: [88],
          },
        ],
      },
    ],
  },
  {
    id: "auto-bench",
    name: { zh: "Auto Bench", en: "Auto Bench" },
    aim: { zh: "根据评测目标和原始数据自动生成评测基准。", en: "Generate benchmarks from evaluation goals and source data." },
    branches: [
      {
        id: "generator",
        medals: [
          {
            id: "std-autobench",
            name: { zh: "从目标和数据生成评测基准", en: "Generate a benchmark from a goal and source data" },
            intent: { zh: "使用 Auto Bench 插件将评测目标和原始数据转换为可运行的基准。", en: "Use the Auto Bench plugin to turn an evaluation goal and source data into a runnable benchmark." },
            evidence: {
              zh: "插件按 RFC-0003 合入。提供一组评测目标和原始数据、据此生成的基准，以及该基准的运行结果。",
              en: "The plugin is integrated under RFC-0003. Include an evaluation objective, its source data, the generated benchmark and the results of running it.",
            },
            quests: [78],
          },
        ],
      },
    ],
  },
  {
    id: "agent",
    name: { zh: "Super Agent 与 Personal Agent", en: "Super Agent & Personal Agent" },
    aim: {
      zh: "研究多智能体协作，以及个人助理的记忆、规划和工具使用。",
      en: "Study multi-agent collaboration and the use of memory, planning and tools by personal assistants.",
    },
    branches: [
      {
        id: "org",
        name: { zh: "多智能体协作与调度", en: "Multi-agent coordination and scheduling" },
        medals: [
          {
            id: "agent-company-comms",
            name: { zh: "公司模式沟通规范", en: "Company-mode communication rules" },
            intent: {
              zh: "Agent 公司的频道不再刷屏，提案先给结论",
              en: "Agent-company channels stop flooding; proposals lead with the conclusion",
            },
            evidence: {
              zh: "员工与 CEO 的提示词和手册规范合入（penguin-harness PR #1434），消除无指向状态刷屏与自我提及",
              en: "Employee and CEO prompts and handbook rules merged (penguin-harness PR #1434), with status flooding and self-mentions gone",
            },
            quests: [50],
          },
          {
            id: "agent-super",
            name: { zh: "Super Agent 任务调度", en: "Super Agent task scheduling" },
            intent: {
              zh: "主控 Agent 能拆里程碑、并行委派并仲裁冲突",
              en: "The lead agent splits milestones, delegates in parallel and arbitrates conflicts",
            },
            evidence: {
              zh: "里程碑拆解、跨职能并行调度、阻塞诊断与组织级复盘机制合入，并附一次完整项目的运行记录",
              en: "Milestone planning, cross-role scheduling, blocker diagnosis and organisational retrospectives merged, with one full project run recorded",
            },
            quests: [94],
            requires: ["agent-company-comms"],
          },
          {
            id: "agent-company-case",
            name: { zh: "智能体公司项目交付", en: "Project delivery by an agent company" },
            intent: {
              zh: "一家 Agent 公司从战略到交付自己走完一遍",
              en: "An agent company goes from strategy to delivery on its own",
            },
            evidence: {
              zh: "公开从 CEO 战略拆解、岗位招募到多员工工单协同与交付的全流程记录，并沉淀可复现的案例配置",
              en: "A public record from strategy and hiring through multi-employee tickets to delivery, plus a reusable case configuration",
            },
            quests: [51],
            requires: ["agent-company-comms"],
          },
        ],
      },
      {
        id: "memory",
        name: { zh: "记忆与知识管理", en: "Memory and knowledge management" },
        medals: [
          {
            id: "agent-memory-layer",
            name: { zh: "会话历史检索与溯源", en: "Session history search and tracing" },
            intent: {
              zh: "通过分层索引定位相关记录，再回到原始会话核对。",
              en: "Use the layered index to find relevant records and verify them against the original session.",
            },
            evidence: {
              zh: "合入 Obelisk 原始历史层和查询 Skill，能检索主流 Harness 的会话历史并追溯到原文。",
              en: "Merge the Obelisk history layer and query skill. Demonstrate search across supported harness session histories and trace a result to its original record.",
            },
            quests: [91],
          },
          {
            id: "agent-memory-bench",
            name: { zh: "记忆与上下文压缩基准接入", en: "Memory & context compaction benchmarks" },
            intent: {
              zh: "在相同的检索与压缩任务上比较不同记忆方案。",
              en: "Compare memory approaches on the same retrieval and compression tasks.",
            },
            evidence: {
              zh: "记忆与压缩基准按 RFC-0001 接入。用原文检索作基线，报告记忆系统的溯源准确率和 Token 开销。",
              en: "The memory and compression benchmarks are integrated under RFC-0001, with attribution accuracy and token use measured against raw-history retrieval.",
            },
            quests: [90, 62],
          },
          {
            id: "agent-compress",
            name: { zh: "上下文压缩信息保留评测", en: "Information retention after compression" },
            intent: {
              zh: "用同一保留基准比较算法修改前后的得分。",
              en: "Compare retention scores before and after the compression algorithm changes.",
            },
            evidence: {
              zh: "压缩算法改动合入后，在 #62 的信息保留基准上比较修改前后的得分，并提交通过验收的对照报告。",
              en: "After the compression changes are merged, submit an accepted report comparing scores before and after the change on the retention benchmark from #62.",
            },
            quests: [44],
            requiresQuests: [62],
            acceptedReport: null,
          },
          {
            id: "std-knowledge-plugin",
            name: { zh: "知识库与本体插件集成", en: "Knowledge-base and ontology plugins integrated" },
            intent: {
              zh: "领域知识能以插件形式挂到 Harness 上",
              en: "Domain knowledge plugs into the harness",
            },
            evidence: {
              zh: "知识库插件与本体插件合入（含 penguin-harness-plugins PR #21），各附使用说明",
              en: "The knowledge-base and ontology plugins merged (including penguin-harness-plugins PR #21), each documented",
            },
            quests: [36, 37],
          },
        ],
      },
      {
        id: "personal",
        name: { zh: "主动提醒与规划", en: "Reminders and proactive planning" },
        medals: [
          {
            id: "agent-personal",
            name: { zh: "主动式助理原型", en: "Proactive assistant prototype" },
            intent: {
              zh: "助理从等指令变成会主动提醒和规划",
              en: "The assistant stops waiting for orders and starts reminding and planning",
            },
            evidence: {
              zh: "结合习惯、日程与历史上下文主动提醒与推进任务的可复现演示，并说明长短期记忆的设计",
              en: "A reproducible demo that reminds and pushes tasks from habits, calendar and history, with the memory design written up",
            },
            quests: [52],
          },
        ],
      },
      {
        id: "control",
        name: { zh: "网页与桌面操作", en: "Browser and desktop control" },
        medals: [
          {
            id: "agent-computer-use",
            name: { zh: "跨平台桌面操作", en: "Cross-platform desktop control" },
            intent: {
              zh: "智能体能操控终端和浏览器之外的桌面软件",
              en: "Agents drive desktop software beyond the terminal and the browser",
            },
            evidence: {
              zh: "跨平台工具与 Skill 合入，含坐标自适应、安全边界与动作校验闭环，并附端到端示例",
              en: "Cross-platform tools and skills merged, with coordinate scaling, safety limits and an action-verification loop, plus end-to-end examples",
            },
            quests: [92],
          },
          {
            id: "agent-interact-bench",
            name: { zh: "网页与桌面交互基准接入", en: "Browser and desktop benchmarks integrated" },
            intent: {
              zh: "在相同的网页和桌面环境中重复运行交互任务。",
              en: "Repeat interaction tasks in the same browser and desktop environments.",
            },
            evidence: {
              zh: "网页与桌面操作基准按 RFC-0001 接入，支持环境重置、轨迹记录与自动评分，并提交 PenguinHarness 基线成绩和复现文档。",
              en: "The browser and desktop benchmarks are integrated under RFC-0001 with environment resets, recorded trajectories and automatic scoring. PenguinHarness baseline scores and reproduction instructions are included.",
            },
            quests: [93],
          },
        ],
      },
      {
        id: "human-likeness",
        name: { zh: "内容与行为拟人度", en: "Human likeness in content and behaviour" },
        medals: [
          {
            id: "prod-turing-bench",
            name: { zh: "TuringBench 基准接入", en: "TuringBench integration" },
            intent: {
              zh: "用 TuringBench 评估生成内容和交互行为与人类表现的相似度。",
              en: "Use TuringBench to measure how closely generated content and interactions resemble human work.",
            },
            evidence: {
              zh: "TuringBench 多维任务集按 RFC-0001 合入，判分口径与一致性经过验证",
              en: "The TuringBench task set merged under RFC-0001, with the scoring rubric validated for agreement",
            },
            quests: [96],
          },
        ],
      },
    ],
  },
  {
    id: "method",
    name: { zh: "RSI 算法与实验", en: "RSI algorithms & experiments" },
    aim: {
      zh: "按进化产物归类 RSI 算法，扩充评测基准，并用可复现的对照实验验证方法效果。",
      en: "Group RSI methods by the artifacts they improve, expand benchmark coverage and assess methods in reproducible comparisons.",
    },
    branches: [
      {
        id: "model-parameters",
        name: RSI_ARTIFACTS["model-parameters"],
        medals: [],
      },
      {
        id: "harness-code",
        name: RSI_ARTIFACTS["harness-code"],
        medals: [
          {
            id: "method-rrsi",
            name: { zh: "正则化自进化", en: "Regularized self-improvement" },
            intent: {
              zh: "用修改预算、评测过拟合检查和 Token 剪枝约束自进化过程。",
              en: "Constrain self-improvement with an edit budget, evaluation overfitting checks and token pruning.",
            },
            evidence: {
              zh: "RRSI 工具包合入 PenguinHarness，社区任务 #35 通过验收。",
              en: "The RRSI toolkit is merged into PenguinHarness and community Issue #35 is accepted.",
            },
            quests: [35],
            relatedArtifacts: ["context", "memory", "skill"],
          },
          {
            id: "method-search-pack",
            name: { zh: "候选代码生成与评测", en: "Candidate code generation and evaluation" },
            intent: {
              zh: "扩展候选方案搜索能力，支持 DGM 的多分支搜索和 Meta-Harness 的迭代优化。",
              en: "Extend candidate search to DGM's branching search and Meta-Harness's iterative optimization.",
            },
            evidence: {
              zh: "Darwin Gödel Machine 与 Meta-Harness 插件合入，各附候选搜索的运行记录。",
              en: "Merge Darwin Gödel Machine and Meta-Harness, each with a recorded candidate-search run.",
            },
            quests: [72, 58],
            relatedArtifacts: ["context", "memory"],
          },
        ],
      },
      {
        id: "context",
        name: RSI_ARTIFACTS.context,
        medals: [],
      },
      {
        id: "memory",
        name: RSI_ARTIFACTS.memory,
        medals: [
          {
            id: "method-harness-pack",
            name: { zh: "探索经验与反思记忆", en: "Memory from exploration and reflection" },
            intent: {
              zh: "将探索经验与执行反思保存为记忆，供后续任务决策使用。",
              en: "Save exploration experience and reflections as memory for later decisions.",
            },
            evidence: {
              zh: "RSIAgent 和 Reflexion 按 RFC-0003 合入，分别提供探索和反馈反思的可复现运行记录。",
              en: "Merge RSIAgent and Reflexion under RFC-0003, with reproducible runs for exploration and reflection on feedback.",
            },
            quests: [34, 73],
            relatedArtifacts: ["context", "skill"],
          },
        ],
      },
      {
        id: "skill",
        name: RSI_ARTIFACTS.skill,
        medals: [
          {
            id: "method-skill-toolkits",
            name: { zh: "技能自进化工具包接入", en: "Skill evolution toolkits integrated" },
            intent: {
              zh: "PenguinHarness 支持用 SkillAdam、SkillOpt、OpenSkill 和 TRACE 构建或改进技能。",
              en: "PenguinHarness supports building or refining skills with SkillAdam, SkillOpt, OpenSkill and TRACE.",
            },
            evidence: {
              zh: "四种方法各自以 RSI 工具包形式合入 PenguinHarness 主仓库。",
              en: "All four methods are merged into the PenguinHarness repository as RSI toolkits.",
            },
            quests: [],
            mergedPr: "https://github.com/Prism-Shadow/penguin-harness/pull/1374",
            relatedArtifacts: ["harness-code", "context", "memory"],
          },
          {
            id: "method-web-skill-learning",
            name: { zh: "网页技能学习与复用", en: "Learning and reusing browser skills" },
            intent: {
              zh: "从网站探索中学习浏览器操作，将其保存为后续网页任务可调用的技能。",
              en: "Learn browser operations through website exploration and save them as skills for later tasks.",
            },
            evidence: {
              zh: "SkillWeaver 按 RFC-0003 合入，提供从网站探索、生成操作技能到在后续任务中复用的运行记录。",
              en: "Merge SkillWeaver under RFC-0003 and provide a run showing website exploration, skill creation and reuse in a later task.",
            },
            quests: [74],
          },
        ],
      },
      {
        id: "other-artifacts",
        name: RSI_ARTIFACTS["other-artifacts"],
        medals: [],
      },
      {
        id: "arena",
        name: { zh: "Benchmark", en: "Benchmark" },
        medals: [
          {
            id: "method-first-bench",
            name: { zh: "多领域、GDPevo 与生物医学题集", en: "Multi-domain, GDPevo and biomedical task sets" },
            intent: {
              zh: "建立社区的基础评测题集，覆盖五个领域的任务、六类业务场景和生物医学数据分析。",
              en: "Establish the community's initial benchmark collection, covering tasks across five domains, six business scenarios and biomedical data analysis.",
            },
            evidence: {
              zh: "50 个多领域任务、GDPevo Essential 60 题与生物医学基准合入（benchmark PR #3 / #5 / #15）",
              en: "The 50 multi-domain tasks, 60 GDPevo Essential items and the biomedical benchmark merged (benchmark PR #3 / #5 / #15)",
            },
            quests: [39, 40, 41],
          },
          {
            id: "method-eng-bench",
            name: { zh: "软件工程与终端基准接入", en: "Software engineering and terminal benchmarks integrated" },
            intent: { zh: "在真实工程交付和终端操作任务上评测智能体。", en: "Evaluate agents on software delivery and terminal tasks." },
            evidence: { zh: "SWE-bench、FDE-gym 和 Terminal-Bench 2.0 按 RFC-0001 接入，并跑通各自的评分流程。", en: "Integrate SWE-bench, FDE-gym and Terminal-Bench 2.0 under RFC-0001 and run each scoring pipeline." },
            quests: [30, 31, 56],
          },
          {
            id: "method-posttrain-bench",
            name: { zh: "后训练基准接入", en: "Post-training benchmark integrated" },
            intent: { zh: "用 PostTrainBench 评测智能体在给定算力和时间内完成模型后训练的能力。", en: "Use PostTrainBench to evaluate agent-led model post-training under a fixed compute and time budget." },
            evidence: { zh: "按 RFC-0001 接入 PostTrainBench，提交 GPU 配置、评分流程和可复现的端到端结果。", en: "Integrate PostTrainBench under RFC-0001 with the GPU configuration, scoring pipeline and reproducible end-to-end results." },
            quests: [61],
          },
          {
            id: "method-tableqa-bench",
            name: { zh: "表格问答基准接入", en: "Table QA benchmark integrated" },
            intent: { zh: "用 TableQA 评测智能体根据表格回答问题的能力。", en: "Use TableQA to evaluate how agents answer questions about tables." },
            evidence: { zh: "按 RFC-0001 接入 TableQA，并用 PenguinHarness 跑通评测。", en: "Integrate TableQA under RFC-0001 and run the evaluation with PenguinHarness." },
            quests: [103],
          },
          {
            id: "method-science-bench",
            name: { zh: "HLE-Diamond 科学推理基准接入", en: "HLE-Diamond science reasoning benchmark integrated" },
            intent: {
              zh: "HLE-Diamond 的 50 道题任何人都能原样跑一遍",
              en: "Anyone can rerun the same 50 HLE-Diamond problems",
            },
            evidence: {
              zh: "题集按 RFC-0001 接入（benchmark PR #27），题面与参考答案分离、准备脚本固定题号、判分自测通过；选题依据见 #75 与 benchmark #26",
              en: "The set integrated under RFC-0001 (benchmark PR #27) with prompts split from answers, a fixed-ID preparation script and scoring self-tested; selection recorded in #75 and benchmark #26",
            },
            quests: [77],
          },
        ],
      },
      {
        id: "compare",
        name: { zh: "对照实验", en: "Head-to-head runs" },
        medals: [
          {
            id: "method-algo-compare",
            name: { zh: "同模型多算法对照", en: "Algorithms compared" },
            intent: {
              zh: "固定模型，对比不同自进化算法的得分。",
              en: "Compare self-evolution algorithms on a fixed model.",
            },
            evidence: {
              zh: "四种自进化算法与基线在 GDPevo Essential 六大场景的三次重复测试（benchmark PR #16），结果进入榜单",
              en: "Four algorithms plus a baseline over three repeats on six GDPevo Essential scenarios (benchmark PR #16), published on the leaderboard",
            },
            quests: [42],
          },
          {
            id: "method-harness-compare",
            name: { zh: "同模型跨 Harness 对比", en: "Harness comparison on the same model" },
            intent: {
              zh: "同一个模型装在不同框架上的差距被量出来",
              en: "The gap between harnesses on the same model is measured",
            },
            evidence: {
              zh: "四个框架在 Sec A–E 共 600 次采样的得分与成本对比（benchmark PR #21），按 RFC-0005 进入榜单",
              en: "Four harnesses over 600 samples on Sec A–E compared on score and cost (benchmark PR #21), published under RFC-0005",
            },
            quests: [43],
          },
          {
            id: "method-science-proof",
            name: { zh: "科学推理多轮对照实验", en: "Multi-round science reasoning comparison" },
            intent: {
              zh: "固定评测题集，比较 RSI 方法迭代前后的成绩。",
              en: "Compare scores before and after RSI iterations on a fixed test split.",
            },
            evidence: {
              zh: "在进化组迭代、评测组冻结的约定下提交初版与冻结版成绩与轨迹，按 RFC-0002 记录并进入榜单",
              en: "First and frozen versions scored on the held-out split with trajectories, recorded under RFC-0002 and published",
            },
            quests: [75], recurringQuest: 75, anyQuest: true,
            requires: ["method-science-bench"],
          },
          {
            id: "method-new-model",
            name: { zh: "Codex 与 GPT-6 自进化评测", en: "Self-evolution evaluations for Codex and GPT-6" },
            intent: {
              zh: "用 GDPevo Essential 评测 Codex 接入自进化前后的表现，以及 GPT-6 多轮自进化的效果。",
              en: "Use GDPevo Essential to compare Codex with and without self-evolution and evaluate GPT-6 over successive iterations.",
            },
            evidence: {
              zh: "提交 Codex 的任务解决率与 Token 成本对比，以及 GPT-6 的多轮得分与泛化结果，并更新 GDPevo Essential 榜单。",
              en: "Report solve rate and token cost for Codex, and scores and generalization over successive iterations for GPT-6. Add the results to the GDPevo Essential leaderboard.",
            },
            quests: [32, 33],
            requiresQuests: [40],
          },
        ],
      },
      {
        id: "knowledge",
        name: { zh: "论文收录", en: "Paper collection" },
        medals: [
          {
            id: "std-awesome",
            name: { zh: "Awesome RSI 论文收录", en: "Paper included in Awesome RSI" },
            intent: {
              zh: "新的 RSI 论文有地方按规范归档",
              en: "New RSI papers have a place and a format",
            },
            evidence: {
              zh: "按分类与格式规范提交的论文 PR 合入；这是常驻任务，首次合入即点亮",
              en: "A paper PR merged under the classification and format rules; a standing quest, lit on the first merge",
            },
            quests: [64], recurringQuest: 64, anyQuest: true,
          },
        ],
      },
    ],
  },
  {
    id: "platform",
    name: { zh: "RSI 平台与应用", en: "RSI platform & applications" },
    aim: {
      zh: "制定算法接口规范，在业务场景中验证 RSI 的效果与部署条件。",
      en: "Specify algorithm interfaces and evaluate RSI in business and deployment settings.",
    },
    branches: [
      {
        id: "protocol",
        name: { zh: "接口规范", en: "Interface specifications" },
        medals: [
          {
            id: "std-simple-api",
            name: { zh: "RSI Simple APIs 与 SDK", en: "RSI Simple APIs and SDK" },
            intent: {
              zh: "RSI 算法通过统一接口调用采样、评估和状态更新。",
              en: "RSI algorithms use a common interface for sampling, evaluation and state updates.",
            },
            evidence: {
              zh: "采样、评估和状态更新的接口规范与 SDK 合入，并用这些接口重写至少两个已入库的方法",
              en: "The sample, evaluate and update primitives shipped as protocol and SDK, with at least two existing methods rewritten on top",
            },
            quests: [95],
            pending: {
              zh: "「至少两个方法」是本设计提的验收线，待委员会确认",
              en: "The “at least two methods” bar is our proposal and needs the committee's sign-off",
            },
          },
        ],
      },
      {
        id: "business",
        name: { zh: "业务应用", en: "Business applications" },
        medals: [
          {
            id: "prod-showcase",
            name: { zh: "自进化案例可复现", en: "A showcase others can rerun" },
            intent: {
              zh: "提供一个可复现的应用案例，展示智能体如何通过自进化完成任务。",
              en: "Provide a reproducible example of an agent using self-evolution to complete a task.",
            },
            evidence: {
              zh: "案例配置、运行记录与说明文档公开，他人可按文档复跑",
              en: "Case configuration, run logs and a guide published so others can rerun it",
            },
            quests: [45],
          },
          {
            id: "prod-biz-bench",
            name: { zh: "经营收益评测基准", en: "Business performance benchmark" },
            intent: {
              zh: "按统一口径核算智能体团队的营收、成本和净收益。",
              en: "Use a common accounting method for an agent team’s revenue, costs and net profit.",
            },
            evidence: {
              zh: "按 RFC-0001 合入覆盖市场需求响应、产品交付、算力与人力成本核算及净收益结算的任务集",
              en: "A task set merged under RFC-0001 covering demand response, delivery, compute and staffing costs, and net-profit settlement",
            },
            quests: [53],
            pending: {
              zh: "实际经营项目的交付与净收益核算尚无对应任务。",
              en: "No task has been registered for delivering a real business project and accounting for its net profit.",
            },
          },
          {
            id: "prod-writing-bench",
            name: { zh: "写作质量基准接入", en: "Writing quality benchmark integrated" },
            intent: {
              zh: "长文与文档写得好不好，能打分",
              en: "Long-form and documentation quality can be scored",
            },
            evidence: {
              zh: "覆盖结构逻辑、事实依据、文风自然度与指令遵循的评测集与自动评分脚本按 RFC-0001 合入",
              en: "A task set and scoring scripts for structure, grounding, natural voice and instruction-following merged under RFC-0001",
            },
            quests: [68],
          },
          {
            id: "prod-deck-bench",
            name: { zh: "演示文稿排版与审美基准接入", en: "Slide layout and aesthetics benchmark integrated" },
            intent: {
              zh: "排版与审美不再只能靠人眼判断",
              en: "Layout and taste stop being eyeball-only judgements",
            },
            evidence: {
              zh: "PPT 审美与排版质量基准按 RFC-0001 合入，附判分一致性说明",
              en: "The slide aesthetics and layout benchmark merged under RFC-0001, with scorer agreement reported",
            },
            quests: [63],
          },
          {
            id: "prod-quality-proof",
            name: { zh: "自进化前后内容质量对比", en: "Content quality before and after self-evolution" },
            intent: {
              zh: "用拟人度作为奖励，比较自进化前后的内容质量。",
              en: "Compare output quality before and after self-evolution using human-likeness as the reward.",
            },
            evidence: {
              zh: "把拟人度作为奖励与归因信号，提交进化前后的对照报告与轨迹，按 RFC-0002 记录",
              en: "Human-likeness used as reward and attribution signal, with a before/after report and trajectories under RFC-0002",
            },
            quests: [96, 68],
            requires: ["prod-turing-bench", "prod-writing-bench"],
            acceptedReport: null,
          },
          {
            id: "std-safety",
            name: { zh: "部署后进化锁定方案", en: "Post-deployment evolution lock design" },
            intent: {
              zh: "企业把自进化部署进生产前，知道风险边界在哪",
              en: "Before self-evolution ships to production, the risk boundary is known",
            },
            evidence: {
              zh: "提交安全问题分析报告，并给出企业部署下的进化锁定机制设计或实现",
              en: "A security analysis plus a design or implementation of the evolution lock for enterprise deployments",
            },
            quests: [54],
          },
        ],
      },
    ],
  },
];
