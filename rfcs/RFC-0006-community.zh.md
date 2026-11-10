# RFC-0006 社区任务板、委员会与激励机制

- Feature Name: `community`
- Start Date: 2026-11-10
- RFC PR: N/A
- Updated by: N/A

[English](RFC-0006-community.md)

为了推动递归自进化（RSI）在评测基准、算法复现与框架插件上的开放协作，Shared RSI Community 建立了基于 GitHub Issue 与定时 Agent（`rsi_community_steward`）驱动的**任务看板（Task Board）**、**RSI 社区委员会（RSI Community Committee）**以及**贡献榜月度激励制度**。

## 1. 任务发布、认领与自动化同步机制

所有社区任务遵循**「先有 GitHub Issue，再进入任务板」**的流程，数据登记在 [penguin-harness-community](https://github.com/Prism-Shadow/penguin-harness-community) 仓库的 `community/tasks.yaml` 中，并通过网站 `/quests/` 页面展示。

<figure class="flowchart"><svg class="flowchart-svg" viewBox="0 0 640 120" role="img" aria-labelledby="rfc-0006-zh-title"><title id="rfc-0006-zh-title">Issue 驱动的任务发布、认领与结算流程</title><defs><marker id="rfc-0006-zh-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10Z" class="fc-arrowhead"/></marker></defs><rect x="14" y="14" width="612" height="92" rx="10" class="fc-stage-primary"/><text x="28" y="34" class="fc-stage-title">Issue 驱动全流程（每人同时进行中任务上限 ≤ 2）</text><rect x="28" y="46" width="176" height="46" rx="6" class="fc-process"/><text x="116" y="74" class="fc-title" text-anchor="middle">1. 创建 [Task] Issue</text><path d="M204 69H232" class="fc-edge" marker-end="url(#rfc-0006-zh-arrow)"/><rect x="232" y="46" width="176" height="46" rx="6" class="fc-process"/><text x="320" y="74" class="fc-title" text-anchor="middle">2. Issue 下回复 /claim</text><path d="M408 69H436" class="fc-edge" marker-end="url(#rfc-0006-zh-arrow)"/><rect x="436" y="46" width="176" height="46" rx="6" class="fc-process"/><text x="524" y="74" class="fc-title" text-anchor="middle">3. PR 合入 &amp; 结算 EXP</text></svg></figure>

### 1.1 看板分组与状态流转

任务看板按四大核心领域分组，每个领域下划分为三个等宽进度列：

- **四大领域分组**：
  1. **Benchmark**：标准评测基准集成（如集成 SWE-bench [#30](https://github.com/Prism-Shadow/penguin-harness-community/issues/30)、集成 FDE-gym [#31](https://github.com/Prism-Shadow/penguin-harness-community/issues/31)）。
  2. **Evaluation**：跨框架与基座模型自进化评测（如 Codex 自进化效果对比 [#32](https://github.com/Prism-Shadow/penguin-harness-community/issues/32)、GPT-6 模型进化能力实验 [#33](https://github.com/Prism-Shadow/penguin-harness-community/issues/33)）。
  3. **RSI 算法**：自进化核心论文方法复现与集成（如集成 RSIAgent 方法 [#34](https://github.com/Prism-Shadow/penguin-harness-community/issues/34)、集成 RRSI 方法 [#35](https://github.com/Prism-Shadow/penguin-harness-community/issues/35)）。
  4. **PenguinHarness**：框架核心与插件生态开发（如开发知识库插件 [#36](https://github.com/Prism-Shadow/penguin-harness-community/issues/36)、开发本体插件 [#37](https://github.com/Prism-Shadow/penguin-harness-community/issues/37)）。
- **三阶段进度列**：`待认领（open）` $\rightarrow$ `进行中（in_progress）` $\rightarrow$ `已完成（completed）`。
- **任务经验值与详情**：每项标准任务设为 **50 EXP**。看板卡片仅展示任务标题、经验值（`+50 EXP`）与认领状态；点击卡片可弹出详情窗查看完整任务描述及原始论文/代码仓库链接。

### 1.2 发布、认领与防滥用规则

1. **发布任务**：点击任务板右上角「发布任务 ↗」跳转创建 `[Task]` GitHub Issue，社区定时 Agent（`rsi_community_steward`）定时扫描新建的 `[Task]` Issue 并将其同步至任务看板。
2. **认领任务**：贡献者在对应任务的 GitHub Issue 下方评论回复 `/claim` 即可完成认领，定时 Agent 自动更新该任务的认领人与进度状态。
3. **防占坑并发上限**：每位 GitHub 用户同一时间最多只能持有 **2 项**处于 `进行中（in_progress）` 状态的任务；超过 2 项时新的 `/claim` 请求不予生效，连续 14 天无进展自动释放回 `待认领（open）`。

## 2. RSI 社区委员会（RSI Community Committee）

社区委员会负责基础设施维护、任务提案策划与 PR/实验可复现性审核。委员会目前下设三个小组（展示于网站 `/people/` 页面）：

| 小组 | 成员 | 负责方向（词条） |
| --- | --- | --- |
| **项目主导方（Project Leadership）** | `Yaowei Zheng` | `Benchmark`、`算法`、`Harness` |
| **提案小组（Proposal Group）** | `Xiang Qu`、`Zhihao Liu` | `算法`（Xiang Qu）、`Benchmark`（Zhihao Liu） |
| **审核小组（Review Group）** | `Leijun Zhou`、`Zhihao Liu` | `算法`（Leijun Zhou）、`Benchmark`（Zhihao Liu） |

- **领域词条扩展**：除现有的 `Benchmark`、`算法`、`Harness` 外，委员会后续将持续引入 `医学`、`通信` 等更多垂直领域方向。
- **固定激励与申请方式**：每位社区委员会成员享有**每月 1,000 元固定激励**（以 Token 额度、算力券形式发放）。有意加入委员会的研究者与开发者可通过**社区微信群**申请加入。

## 3. 贡献榜与每月 10,000 元额度分配方案

网站 `/people/` 页面同时展示按经验值（EXP）从高到低排序的**当月贡献榜**与**总贡献榜**。除委员会固定激励外，社区设立**每月 10,000 元**（以 Token 额度、算力券形式发放）的贡献榜激励池，于每月末按当月贡献榜自动结算：

| 激励部分 | 月度额度 | 分配规则与计算公式 |
| --- | --- | --- |
| **1. 经验值按比例分配** | **7,000 元 / 月** | 面向当月所有完成任务获得 EXP 的贡献者，按个人当月经验值占全员当月总经验值的比例分配：$$\text{个人比例激励} = 7000 \times \frac{\text{个人当月 EXP}}{\sum \text{全员当月 EXP}}$$ |
| **2. 当月前五名额外奖励** | **3,000 元 / 月** | 当月贡献榜排名前 5 的成员额外获得阶梯奖励：**第 1 名 +1,200 元**、**第 2 名 +800 元**、**第 3 名 +500 元**、**第 4–5 名各 +250 元**。 |
