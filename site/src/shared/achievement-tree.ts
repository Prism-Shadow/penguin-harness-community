import type { Locale } from "./i18n";

/**
 * The community achievement tree: long-term routes → work branches → medals.
 *
 * This file holds the editorial design only. Whether a medal is lit is never written here:
 * `achievements.ts` reads the Task Board registry and lights a medal when every quest it
 * lists is registered as completed. `evidence` states what the committee checks before a
 * quest may be closed, and `requires` names the medals that must already be lit.
 *
 * A quest belongs to exactly one medal (that is what draws the line). Prerequisites and
 * loose references are navigation, not lines on the canvas.
 */

export type Text = { zh: string; en: string };

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
  /** Medals that must be lit before this one can be worked on. */
  requires?: string[];
  /** Anything the materials do not settle yet. */
  pending?: Text;
}

export interface BranchDef {
  id: string;
  name: Text;
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
    aim: {
      zh: "让自进化下沉到算子、训练、推理与量化",
      en: "Take self-evolution down to kernels, training, inference and quantisation",
    },
    branches: [
      {
        id: "arena",
        name: { zh: "Infra 赛场", en: "Infra arenas" },
        medals: [
          {
            id: "infra-train-bench",
            name: { zh: "训练基准可复现", en: "Training arena reproducible" },
            intent: {
              zh: "自动研究系统有了固定预算的训练赛场",
              en: "Auto-research systems have a training arena with a fixed budget",
            },
            evidence: {
              zh: "两套基准按 RFC-0001 合入，锁定语料、tokenizer 与时间窗口，基线脚本可一键复跑，Evaluator 与智能体隔离",
              en: "Both benchmarks merged under RFC-0001 with corpus, tokenizer and time budget locked, a one-command baseline rerun, and the evaluator isolated from the agent",
            },
            quests: [83, 84],
          },
          {
            id: "infra-kernel-bench",
            name: { zh: "算子基准可复现", en: "Kernel arena reproducible" },
            intent: {
              zh: "智能体写的 GPU 算子有统一的正确性与性能计分",
              en: "Agent-written GPU kernels get one correctness and performance score",
            },
            evidence: {
              zh: "SOL-ExecBench 235 题接入，数值校验与 Speed-of-Light 计分隔离运行，支持单题与全量两种模式",
              en: "All 235 SOL-ExecBench problems integrated, numerical checks and Speed-of-Light scoring isolated, single-problem and full runs both supported",
            },
            quests: [85],
          },
        ],
      },
      {
        id: "method",
        name: { zh: "Infra 方法", en: "Infra methods" },
        medals: [
          {
            id: "infra-method",
            name: { zh: "InfraRSI 方法可运行", en: "InfraRSI method runnable" },
            intent: {
              zh: "社区有一个能改训练配置与代码的 RSI 插件",
              en: "The community has an RSI plugin that can rewrite training configs and code",
            },
            evidence: {
              zh: "插件按 RFC-0003 合入，附固定任务约定下的端到端运行记录",
              en: "Plugin merged under RFC-0003 with an end-to-end run recorded against the agreed task contract",
            },
            quests: [71],
          },
          {
            id: "infra-autoresearch",
            name: { zh: "自动研究系统可复现", en: "Auto-research loop reproducible" },
            intent: {
              zh: "双层循环能在社区赛场上自己跑完一轮研究",
              en: "The two-level loop runs a full research round on community arenas",
            },
            evidence: {
              zh: "外层与内层循环、五个角色在 PenguinHarness 中实现并合入，在训练与算子赛场上各留下一棵候选树记录",
              en: "Outer and inner loops with all five roles implemented and merged, leaving a candidate tree on both the training and the kernel arena",
            },
            quests: [86],
            requires: ["infra-train-bench", "infra-kernel-bench"],
          },
        ],
      },
      {
        id: "proof",
        name: { zh: "Infra 实测", en: "Infra results" },
        medals: [
          {
            id: "infra-recipe",
            name: { zh: "开源模型训练提速", en: "Open-model training sped up" },
            intent: {
              zh: "RSI 在真实训练配方上拿到可复核的加速",
              en: "RSI delivers a reviewed speed-up on a real training recipe",
            },
            evidence: {
              zh: "在精度不降的前提下，提交候选树实验记录与收敛速度、吞吐（tokens/s、MFU）的前后对比报告，并经独立复核",
              en: "With accuracy held, a candidate-tree record plus a before/after report on convergence and throughput (tokens/s, MFU), independently reviewed",
            },
            quests: [87],
            requires: ["infra-method"],
          },
          {
            id: "infra-chip-kernel",
            name: { zh: "国产芯片算子适配", en: "Domestic-chip kernels adapted" },
            intent: {
              zh: "国产算力芯片上的算子与通信先跑对",
              en: "Kernels and collectives run correctly on domestic accelerators first",
            },
            evidence: {
              zh: "算子与通信改动合入，初始步与多步 loss 对齐校验通过，训练数学语义不变",
              en: "Kernel and communication changes merged, first-step and multi-step loss alignment checks passed, training semantics unchanged",
            },
            quests: [89],
            pending: {
              zh: "合作提案中的第一段。提案的「适配 → 调优 → 端到端」三段要分别点亮，需要先把 #88 / #89 拆成阶段任务",
              en: "The first leg of the partnership proposal. Lighting its adapt → tune → end-to-end legs separately needs #88 / #89 split into staged quests first",
            },
          },
          {
            id: "infra-chip-speed",
            name: { zh: "国产芯片实测收益", en: "Domestic-chip gains measured" },
            intent: {
              zh: "适配之后在端到端训练或推理里真的更快",
              en: "After adaptation, end-to-end training or inference is actually faster",
            },
            evidence: {
              zh: "提交 step time / MFU 或时延与确定性吞吐的前后对比报告，并在端到端训练或推理中复现收益",
              en: "A before/after report on step time / MFU or latency and deterministic throughput, with the gain reproduced end to end",
            },
            quests: [88],
            requires: ["infra-chip-kernel"],
            pending: {
              zh: "提案的第二、三段。社区尚未确认这条路线的交付口径",
              en: "The second and third legs of the proposal. The community has not agreed on the delivery terms for this route",
            },
          },
        ],
      },
    ],
  },
  {
    id: "agent",
    name: { zh: "Super Agent 与 Personal Agent", en: "Super Agent & Personal Agent" },
    aim: {
      zh: "让多个 Agent 协同成事，并长出可依赖的个人助理",
      en: "Make many agents work as one, and grow a personal assistant worth relying on",
    },
    branches: [
      {
        id: "org",
        name: { zh: "组织与协同", en: "Organisation" },
        medals: [
          {
            id: "agent-company-comms",
            name: { zh: "公司模式沟通收敛", en: "Company-mode comms tightened" },
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
            name: { zh: "Super Agent 统筹升级", en: "Super Agent orchestration" },
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
            name: { zh: "公司模式跑通真实案例", en: "Company mode proven on a case" },
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
        name: { zh: "记忆与上下文", en: "Memory & context" },
        medals: [
          {
            id: "agent-memory-layer",
            name: { zh: "原始历史可检索", en: "Raw history searchable" },
            intent: {
              zh: "历史不被压成摘要，随时能追回原文",
              en: "History is never flattened into summaries; the original is always reachable",
            },
            evidence: {
              zh: "Obelisk 原始历史层与查询 Skill 合入，可接入主流 Harness 的会话历史并追溯到原文",
              en: "The Obelisk raw-history layer and its query skill merged, reading mainstream harness sessions and tracing back to the original text",
            },
            quests: [91],
          },
          {
            id: "agent-memory-bench",
            name: { zh: "记忆与压缩基准可复现", en: "Memory arena reproducible" },
            intent: {
              zh: "记忆方案的好坏有统一的量法",
              en: "Memory designs can finally be measured the same way",
            },
            evidence: {
              zh: "记忆基准与上下文压缩保留基准按 RFC-0001 合入，跨会话溯源任务与基线跑通",
              en: "The memory benchmark and the compression-retention benchmark merged under RFC-0001, with cross-session tasks and baselines running",
            },
            quests: [90, 62],
          },
          {
            id: "agent-memory-value",
            name: { zh: "记忆净收益有结论", en: "Memory net value settled" },
            intent: {
              zh: "复杂记忆系统到底是正收益还是负收益，有数据说话",
              en: "Whether a complex memory system pays off is answered with data",
            },
            evidence: {
              zh: "朴素检索与记忆系统在同一基准上的对照报告，按 RFC-0002 记录 Memory Tax 与净收益",
              en: "A head-to-head report of naive retrieval against memory systems on the same benchmark, recording Memory Tax and net value under RFC-0002",
            },
            quests: [90, 91],
            requires: ["agent-memory-layer", "agent-memory-bench"],
          },
          {
            id: "agent-compress",
            name: { zh: "上下文压缩不丢信息", en: "Compression keeps the facts" },
            intent: {
              zh: "压缩算法的改动有基准兜底，不靠感觉",
              en: "Compression changes are judged on a benchmark, not on feel",
            },
            evidence: {
              zh: "压缩算法改动合入（penguin-harness PR #1491），并在压缩保留基准上给出前后得分",
              en: "Compression changes merged (penguin-harness PR #1491) with before/after scores on the retention benchmark",
            },
            quests: [44],
            requires: ["agent-memory-bench"],
          },
        ],
      },
      {
        id: "personal",
        name: { zh: "个人助理", en: "Personal assistant" },
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
            requires: ["agent-memory-layer"],
            pending: {
              zh: "#52 目前没有登记对 #91 的依赖，这条前置是本设计的判断，待确认",
              en: "#52 does not register a dependency on #91; this prerequisite is our reading and needs confirming",
            },
          },
        ],
      },
      {
        id: "control",
        name: { zh: "感知与操控", en: "Perception & control" },
        medals: [
          {
            id: "agent-computer-use",
            name: { zh: "原生 Computer Use 可用", en: "Native computer use" },
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
            name: { zh: "交互基准可复现", en: "Interaction arena reproducible" },
            intent: {
              zh: "网页与桌面操作有可复跑的考场",
              en: "Web and desktop operation get a rerunnable exam room",
            },
            evidence: {
              zh: "Browser Use 与 Computer Use 基准按 RFC-0001 接入，提供沙箱重置、轨迹记录与自动判分器",
              en: "Browser-use and computer-use benchmarks integrated under RFC-0001, with sandbox resets, trajectory logs and an automatic evaluator",
            },
            quests: [93],
          },
          {
            id: "agent-interact-proof",
            name: { zh: "操控能力有基线成绩", en: "Control has a baseline score" },
            intent: {
              zh: "操控能力的起点被量出来，后面才谈得上进化",
              en: "The starting point is measured, so evolution has something to beat",
            },
            evidence: {
              zh: "用 PenguinHarness 在交互基准上跑通基线评测，提交成绩与复现文档",
              en: "A baseline evaluation run with PenguinHarness on the interaction benchmarks, with scores and a reproduction guide",
            },
            quests: [92, 93],
            requires: ["agent-computer-use", "agent-interact-bench"],
          },
        ],
      },
    ],
  },
  {
    id: "method",
    name: { zh: "RSI 方法与评测", en: "RSI methods & evaluation" },
    aim: {
      zh: "把 RSI 方法沉淀成可复用插件，并在公共赛场上得出可比结论",
      en: "Turn RSI methods into reusable plugins and get comparable results on shared arenas",
    },
    branches: [
      {
        id: "library",
        name: { zh: "方法库", en: "Method library" },
        medals: [
          {
            id: "method-harness-pack",
            name: { zh: "Harness 层方法首批入库", en: "First harness-layer methods" },
            intent: {
              zh: "提示词、技能与反思类方法可以直接装上就用",
              en: "Prompt, skill and reflection methods can simply be plugged in",
            },
            evidence: {
              zh: "RSIAgent、RRSI、Reflexion、SkillWeaver 四个插件按 RFC-0003 合入，各附可复现运行记录",
              en: "RSIAgent, RRSI, Reflexion and SkillWeaver merged under RFC-0003, each with a reproducible run",
            },
            quests: [34, 35, 73, 74],
          },
          {
            id: "method-search-pack",
            name: { zh: "搜索式方法入库", en: "Search-style methods added" },
            intent: {
              zh: "会自己生成并筛选候选的进化方法可用",
              en: "Methods that generate and screen their own candidates are available",
            },
            evidence: {
              zh: "Darwin Gödel Machine 与 Meta-Harness 插件合入，各附候选搜索的运行记录",
              en: "Darwin Gödel Machine and Meta-Harness merged, each with a candidate-search run recorded",
            },
            quests: [72, 58],
          },
        ],
      },
      {
        id: "arena",
        name: { zh: "公共赛场", en: "Shared arenas" },
        medals: [
          {
            id: "method-first-bench",
            name: { zh: "首批多领域基准上线", en: "First arenas online" },
            intent: {
              zh: "社区有了自己的第一批评测题",
              en: "The community has its first set of exam questions",
            },
            evidence: {
              zh: "50 个多领域任务、GDPevo Essential 60 题与生物医学基准合入（benchmark PR #3 / #5 / #15）",
              en: "The 50 multi-domain tasks, 60 GDPevo Essential items and the biomedical benchmark merged (benchmark PR #3 / #5 / #15)",
            },
            quests: [39, 40, 41],
          },
          {
            id: "method-eng-bench",
            name: { zh: "工程与终端基准接入", en: "Engineering arenas added" },
            intent: {
              zh: "真实工程与终端任务进了考场",
              en: "Real engineering and terminal work enters the exam room",
            },
            evidence: {
              zh: "SWE-bench、FDE-gym、Terminal-Bench 2.0、PostTrainBench 与 TableQA 按 RFC-0001 合入并跑通基线",
              en: "SWE-bench, FDE-gym, Terminal-Bench 2.0, PostTrainBench and TableQA merged under RFC-0001 with baselines running",
            },
            quests: [30, 31, 56, 61, 103],
          },
          {
            id: "method-science-bench",
            name: { zh: "科学推理题集可复现", en: "Science set reproducible" },
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
              zh: "同一个模型下，不同进化算法谁更强有答案",
              en: "On one model, we know which evolution algorithm wins",
            },
            evidence: {
              zh: "四种自进化算法与基线在 GDPevo Essential 六大场景的三次重复测试（benchmark PR #16），结果进入榜单",
              en: "Four algorithms plus a baseline over three repeats on six GDPevo Essential scenarios (benchmark PR #16), published on the leaderboard",
            },
            quests: [42],
          },
          {
            id: "method-harness-compare",
            name: { zh: "跨 Harness 对照", en: "Harnesses compared" },
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
            name: { zh: "科学推理多轮对照", en: "Science rounds compared" },
            intent: {
              zh: "在冻结的评测组上，RSI 方法的真实提升被看见",
              en: "On a frozen test split, the real gain from RSI shows up",
            },
            evidence: {
              zh: "在进化组迭代、评测组冻结的约定下提交初版与冻结版成绩与轨迹，按 RFC-0002 记录并进入榜单",
              en: "First and frozen versions scored on the held-out split with trajectories, recorded under RFC-0002 and published",
            },
            quests: [75, 104],
            requires: ["method-science-bench"],
          },
          {
            id: "method-new-model",
            name: { zh: "新基座模型进化评测", en: "New base models evaluated" },
            intent: {
              zh: "换个基座模型，自进化还灵不灵，有数据",
              en: "Whether self-evolution still works on a new base model is answered with data",
            },
            evidence: {
              zh: "在同一赛场上提交接入自进化前后的解决率与 Token 成本，补充到 GDPevo Essential 榜单",
              en: "Solve rate and token cost before and after self-evolution on the same arena, added to the GDPevo Essential leaderboard",
            },
            quests: [32, 33],
            requires: ["method-first-bench"],
          },
        ],
      },
    ],
  },
  {
    id: "standard",
    name: { zh: "RSI 标准与平台", en: "RSI standards & platform" },
    aim: {
      zh: "把社区的做法变成别人也能直接用的协议、工具与规范",
      en: "Turn how we work into protocols, tools and rules others can pick up",
    },
    branches: [
      {
        id: "protocol",
        name: { zh: "协议与原语", en: "Protocol & primitives" },
        medals: [
          {
            id: "std-simple-api",
            name: { zh: "RSI Simple APIs 落地", en: "RSI Simple APIs shipped" },
            intent: {
              zh: "写 RSI 算法像搭积木，不再和框架绑死",
              en: "Writing an RSI algorithm becomes assembly, not framework surgery",
            },
            evidence: {
              zh: "采样、评估、状态更新三个原语的协议与 SDK 合入，并用原语重写至少两个已入库方法",
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
        id: "toolchain",
        name: { zh: "工具链", en: "Toolchain" },
        medals: [
          {
            id: "std-autobench",
            name: { zh: "评测自动化插件可用", en: "Auto-benchmarking plugin" },
            intent: {
              zh: "跑评测不再靠人盯着",
              en: "Running an evaluation no longer needs a human watching",
            },
            evidence: {
              zh: "Auto Bench 插件按 RFC-0003 合入，附一次从取题到出分的完整自动评测记录",
              en: "The Auto Bench plugin merged under RFC-0003, with one full automatic run from task pull to score",
            },
            quests: [78],
          },
          {
            id: "std-knowledge-plugin",
            name: { zh: "知识与本体插件可用", en: "Knowledge plugins ready" },
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
        id: "knowledge",
        name: { zh: "开放知识", en: "Open knowledge" },
        medals: [
          {
            id: "std-awesome",
            name: { zh: "Awesome RSI 持续更新", en: "Awesome RSI kept current" },
            intent: {
              zh: "新的 RSI 论文有地方按规范归档",
              en: "New RSI papers have a place and a format",
            },
            evidence: {
              zh: "按分类与格式规范提交的论文 PR 合入；这是常驻任务，首次合入即点亮",
              en: "A paper PR merged under the classification and format rules; a standing quest, lit on the first merge",
            },
            quests: [64],
          },
        ],
      },
      {
        id: "safety",
        name: { zh: "安全与部署", en: "Safety & deployment" },
        medals: [
          {
            id: "std-safety",
            name: { zh: "安全边界与进化锁定", en: "Safety limits & evolution lock" },
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
  {
    id: "product",
    name: { zh: "业务场景与产品化", en: "Applications & products" },
    aim: {
      zh: "让 RSI 的产出在真实场景里站得住",
      en: "Make what RSI produces hold up in the real world",
    },
    branches: [
      {
        id: "business",
        name: { zh: "商业闭环", en: "Business loop" },
        medals: [
          {
            id: "prod-biz-bench",
            name: { zh: "商业营收基准可复现", en: "Revenue arena reproducible" },
            intent: {
              zh: "一支 Agent 团队赚没赚到钱，有统一算法",
              en: "Whether an agent team actually earns is computed the same way for everyone",
            },
            evidence: {
              zh: "按 RFC-0001 合入覆盖市场需求响应、产品交付、算力与人力成本核算及净收益结算的任务集",
              en: "A task set merged under RFC-0001 covering demand response, delivery, compute and staffing costs, and net-profit settlement",
            },
            quests: [53],
            pending: {
              zh: "「跑通真实商业闭环并结算净收益」还没有对应任务，暂不画在树上",
              en: "“Run a real business loop and settle the net profit” has no registered quest yet, so it is not on the canvas",
            },
          },
        ],
      },
      {
        id: "quality",
        name: { zh: "交付质量", en: "Delivery quality" },
        medals: [
          {
            id: "prod-writing-bench",
            name: { zh: "写作质量基准可复现", en: "Writing arena reproducible" },
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
            name: { zh: "演示文稿质量可评", en: "Deck quality scorable" },
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
            id: "prod-turing-bench",
            name: { zh: "拟人度基准可复现", en: "Human-likeness arena" },
            intent: {
              zh: "「一眼 AI 味」变成可量化的信号",
              en: "“Obviously AI” becomes a measurable signal",
            },
            evidence: {
              zh: "TuringBench 多维任务集按 RFC-0001 合入，判分口径与一致性经过验证",
              en: "The TuringBench task set merged under RFC-0001, with the scoring rubric validated for agreement",
            },
            quests: [96],
          },
          {
            id: "prod-quality-proof",
            name: { zh: "产物质量自进化有结论", en: "Quality evolution proven" },
            intent: {
              zh: "以拟人度为奖励，产物质量真的进化了",
              en: "With human-likeness as the reward, output quality really improves",
            },
            evidence: {
              zh: "把拟人度作为奖励与归因信号，提交进化前后的对照报告与轨迹，按 RFC-0002 记录",
              en: "Human-likeness used as reward and attribution signal, with a before/after report and trajectories under RFC-0002",
            },
            quests: [96, 68],
            requires: ["prod-turing-bench", "prod-writing-bench"],
            pending: {
              zh: "这轮对照实验目前挂在两个基准任务下，没有自己的任务；若要单独验收，需要另立一个实验任务",
              en: "The comparison currently rides on the two benchmark quests; accepting it on its own needs a quest of its own",
            },
          },
        ],
      },
      {
        id: "showcase",
        name: { zh: "可玩案例", en: "Showcases" },
        medals: [
          {
            id: "prod-showcase",
            name: { zh: "自进化案例可复现", en: "A showcase others can rerun" },
            intent: {
              zh: "外面的人看一眼就知道自进化能干什么",
              en: "An outsider can see at a glance what self-evolution does",
            },
            evidence: {
              zh: "案例配置、运行记录与说明文档公开，他人可按文档复跑",
              en: "Case configuration, run logs and a guide published so others can rerun it",
            },
            quests: [45],
          },
        ],
      },
    ],
  },
];
