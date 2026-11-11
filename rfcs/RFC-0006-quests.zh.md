# RFC-0006 任务板

- Feature Name: `quests`
- Start Date: 2026-11-10
- RFC PR: [#29](https://github.com/Prism-Shadow/penguin-harness-community/pull/29)
- Updated by: N/A

[English](RFC-0006-quests.md)

为了推动递归自进化（RSI）在评测基准、跨框架实验、算法复现与框架插件上的开放协作，Shared RSI Community 建立了基于 GitHub Issue 模板（`.github/ISSUE_TEMPLATE/task.yml`）与定时同步 Agent（`rsi_community_steward`）驱动的**任务板（Task Board）**规范。

## 1. 任务发布权限与数据源原则

- **仅认可社区委员会发布的任务**：目前社区**只认可由 [RSI 社区委员会](RFC-0007-people.zh.md)成员发布的任务**；非委员会成员自行创建的任务 Issue **不予认可**，不会被定时 Agent 同步至任务板，亦不计入经验值（EXP）与月度贡献激励结算。
- **GitHub Issue 为唯一权威数据源**：无论是 `待认领（open）`、`进行中（in_progress）` 还是 `已完成（completed）` 的任务，**均必须在 `Prism-Shadow/penguin-harness-community` 仓库中拥有对应的标准任务 Issue** 作为唯一数据源。
- **社区任务建议渠道**：普通社区成员如有新任务建议（如新增 Benchmark、算法复现或插件需求），可在社区微信群或双周会向委员会提案小组反馈，经委员会评估通过后由委员会成员统一创建任务 Issue。

<figure class="flowchart"><svg class="flowchart-svg" viewBox="0 0 640 120" role="img" aria-labelledby="rfc-0006-zh-title"><title id="rfc-0006-zh-title">Issue 驱动的任务发布、认领与结算流程</title><defs><marker id="rfc-0006-zh-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10Z" class="fc-arrowhead"/></marker></defs><rect x="14" y="14" width="612" height="92" rx="10" class="fc-stage-primary"/><text x="28" y="34" class="fc-stage-title">任务板全流程（仅认可委员会成员发布的任务 · 每人同时进行中上限 ≤ 2）</text><rect x="28" y="46" width="176" height="46" rx="6" class="fc-process"/><text x="116" y="74" class="fc-title" text-anchor="middle">1. 待认领 (open)</text><path d="M204 69H232" class="fc-edge" marker-end="url(#rfc-0006-zh-arrow)"/><rect x="232" y="46" width="176" height="46" rx="6" class="fc-process"/><text x="320" y="74" class="fc-title" text-anchor="middle">2. 进行中 (in_progress)</text><path d="M408 69H436" class="fc-edge" marker-end="url(#rfc-0006-zh-arrow)"/><rect x="436" y="46" width="176" height="46" rx="6" class="fc-process"/><text x="524" y="74" class="fc-title" text-anchor="middle">3. 已完成 (completed)</text></svg></figure>

## 2. 任务板领域分组、排序与分页

所有有效任务登记在 [penguin-harness-community](https://github.com/Prism-Shadow/penguin-harness-community) 仓库的 `community/tasks.yaml` 中，并在网站 `/quests/` 页面按四大领域分组展示，每个领域下方设有三个等宽进度列：

- **四大领域分组（`Domain`）**：
  1. `Benchmark`：标准评测基准集成（遵循 [RFC-0001](RFC-0001-benchmark.zh.md)，如集成 SWE-bench [#30](https://github.com/Prism-Shadow/penguin-harness-community/issues/30)、集成 FDE-gym [#31](https://github.com/Prism-Shadow/penguin-harness-community/issues/31)、已完成任务 [#39](https://github.com/Prism-Shadow/penguin-harness-community/issues/39)–[#41](https://github.com/Prism-Shadow/penguin-harness-community/issues/41)）。
  2. `Evaluation`：跨框架与基座模型自进化评测（遵循 [RFC-0002](RFC-0002-evaluation.zh.md)，如 Codex 自进化效果对比 [#32](https://github.com/Prism-Shadow/penguin-harness-community/issues/32)、GPT-6 模型进化能力实验 [#33](https://github.com/Prism-Shadow/penguin-harness-community/issues/33)、已完成任务 [#42](https://github.com/Prism-Shadow/penguin-harness-community/issues/42)–[#43](https://github.com/Prism-Shadow/penguin-harness-community/issues/43)）。
  3. `RSI Algorithm`（中文展示为 `RSI 算法`）：自进化核心论文方法复现与集成（遵循 [RFC-0003](RFC-0003-plugin.zh.md)，如集成 RSIAgent 方法 [#34](https://github.com/Prism-Shadow/penguin-harness-community/issues/34)、集成 RRSI 方法 [#35](https://github.com/Prism-Shadow/penguin-harness-community/issues/35)）。
  4. `PenguinHarness`：框架核心与插件生态开发（遵循 [RFC-0003](RFC-0003-plugin.zh.md)，如开发知识库插件 [#36](https://github.com/Prism-Shadow/penguin-harness-community/issues/36)、开发本体插件 [#37](https://github.com/Prism-Shadow/penguin-harness-community/issues/37)、优化压缩算法 [#44](https://github.com/Prism-Shadow/penguin-harness-community/issues/44)、可玩性自进化案例实验 [#45](https://github.com/Prism-Shadow/penguin-harness-community/issues/45)）。
- **三阶段等宽进度列**：`待认领（open）` $\rightarrow$ `进行中（in_progress）` $\rightarrow$ `已完成（completed）`。
- **时间倒序与列内分页**：每个版块各状态列默认按任务发布/完成时间**倒序排列（最新排在最前）**，并内置分页控件（每页展示固定数量卡片），避免单个版块过长。
- **卡片与详情弹窗**：每项标准任务设为 **50 EXP**。看板卡片展示任务标题、经验值徽章（`+50 EXP`）、Issue 编号（及关联 PR 编号）与认领人；点击卡片弹出详情窗口，展示完整任务描述、目标仓库、任务 Issue、提交 PR、关联 Issue 以及原始论文/代码仓库纯链接列表。

## 3. 标准任务 GitHub Issue 格式规范

委员会成员通过 `.github/ISSUE_TEMPLATE/task.yml` 创建或维护任务 Issue。所有三个阶段（`open`、`in_progress`、`completed`）的任务 Issue 均遵循统一的 12 段式正文结构。

### 3.1 Issue 标题、标签与开关状态

- **Issue 标题（Title）**：以 `[Task] ` 开头，后接任务英文标题（默认语言为英文），例如：
  ```text
  [Task] Integrate SWE-bench
  ```
- **Issue 标签（Labels）**：必须包含 `task` 标签。
- **Issue 开关状态（State）**：
  - `待认领（open）` 与 `进行中（in_progress）`：GitHub Issue 保持 **Open** 状态。
  - `已完成（completed）`：GitHub Issue 必须关闭并标记为 **Closed as completed**。

### 3.2 Issue 正文 12 段式结构（与 `.github/ISSUE_TEMPLATE/task.yml` 一致）

GitHub Issue Forms 会将表单字段渲染为固定的 12 个三级标题（`###`）段落：

```markdown
### Domain

Benchmark

### Status

open

### EXP

50

### Target Repository

https://github.com/Prism-Shadow/penguin-harness-benchmark

### Assignee

_No response_

### Pull Request

_No response_

### Related Issue

_No response_

### Title (English)

Integrate SWE-bench

### Title (Chinese)

集成 SWE-bench

### Description (English)

Integrate the SWE-bench software engineering benchmark into `penguin-harness-benchmark` with standardized container environments and grading scripts (per RFC-0001).

### Description (Chinese)

将真实 GitHub 软件工程评测基准 SWE-bench 接入 `penguin-harness-benchmark`，封装标准化容器评测环境与自动评分脚本（遵循 RFC-0001 规范）。

### Original Papers & Repository Links

https://github.com/SWE-bench/SWE-bench
https://arxiv.org/abs/2310.06770
```

### 3.3 三种任务状态（`open` / `in_progress` / `completed`）字段规范

不同阶段的任务在 Issue 正文中的 `### Status`、`### Assignee`、`### Pull Request` 以及 Issue 开关状态必须严格满足下表规定：

| 任务阶段 | GitHub Issue 状态 | `### Status` | `### Assignee` | `### Pull Request` | 标准示例 |
| --- | --- | --- | --- | --- | --- |
| **待认领（Open）** | `OPEN` | `open` | `_No response_` | `_No response_` | [#30](https://github.com/Prism-Shadow/penguin-harness-community/issues/30)、[#45](https://github.com/Prism-Shadow/penguin-harness-community/issues/45) |
| **进行中（In Progress）** | `OPEN` | `in_progress` | `@<github-handle>`（必填，如 `@hiyouga`） | 进行中的目标仓库 PR 纯链接（如 `https://github.com/Prism-Shadow/penguin-harness/pull/1491`，暂未提 PR 时为 `_No response_`） | [#44](https://github.com/Prism-Shadow/penguin-harness-community/issues/44) |
| **已完成（Completed）** | `CLOSED (completed)` | `completed` | `@<github-handle>`（必填，如 `@Saigyouji-Yuyuko1000`） | 已完成的目标仓库 PR 纯链接（必填，如 `https://github.com/Prism-Shadow/penguin-harness-benchmark/pull/16`） | [#39](https://github.com/Prism-Shadow/penguin-harness-community/issues/39)–[#43](https://github.com/Prism-Shadow/penguin-harness-community/issues/43) |

### 3.4 全部 12 个段落字段解析与单语自动回退规则

| 段落标题（`###`） | 必填规则 | 格式与回退说明 |
| --- | --- | --- |
| `### Domain` | 必填 | 取值必须为 `Benchmark`、`Evaluation`、`RSI Algorithm`、`PenguinHarness` 之一。 |
| `### Status` | 必填 | 取值必须为 `open`、`in_progress`、`completed` 之一。 |
| `### EXP` | 必填 | 正整数（默认 `50`），代表任务验收合入后授予的经验值。 |
| `### Target Repository` | 必填 | 最终提交 PR 的目标仓库 URL，取值必须为以下四个官方仓库之一：<br>1. `https://github.com/Prism-Shadow/penguin-harness`<br>2. `https://github.com/Prism-Shadow/penguin-harness-community`<br>3. `https://github.com/Prism-Shadow/penguin-harness-benchmark`<br>4. `https://github.com/Prism-Shadow/penguin-harness-plugins` |
| `### Assignee` | `in_progress` / `completed` 必填 | 认领人 GitHub 用户名（以 `@` 开头，如 `@hiyouga`）；`open` 状态为 `_No response_`。 |
| `### Pull Request` | `completed` 必填 | 提交至目标仓库的 Pull Request 纯链接；未提交时为 `_No response_`。 |
| `### Related Issue` | 选填 | 关联的外部或目标仓库 GitHub Issue 纯链接（无关联时为 `_No response_`）。 |
| `### Title (English)` | 二选一必填 | 英文标题（默认语言）。若留空（或为 `_No response_`），自动回退使用 `### Title (Chinese)`。 |
| `### Title (Chinese)` | 二选一必填 | 中文标题。若留空（或为 `_No response_`），自动回退使用 `### Title (English)`。 |
| `### Description (English)` | 二选一必填 | 英文任务目标与验收标准。若留空（或为 `_No response_`），自动回退使用 `### Description (Chinese)`。 |
| `### Description (Chinese)` | 二选一必填 | 中文任务目标与验收标准。若留空（或为 `_No response_`），自动回退使用 `### Description (English)`。 |
| `### Original Papers & Repository Links` | 选填 | 外部参考原始论文或上游代码仓库链接，每行一个纯 URL（以 `http://` 或 `https://` 开头，不写额外标题）。 |

## 4. 任务认领、状态流转评论指令与验收结算

1. **认领并进入「进行中（`in_progress`）」**：
   - 贡献者在对应官方任务 Issue 下方评论回复 `/claim`（若已创建 PR，可附带 PR 链接：`/claim @<handle> <pr-url>`）。
   - **防占坑并发上限与认领完成宽限期**：每位 GitHub 用户同一时间最多只能持有 **2 项**处于 `in_progress` 状态的任务；若已有 2 项进行中任务，新的 `/claim` 请求不予生效。任务的认领完成宽限期为 **1 个月（30 天）**——认领后超过 1 个月未完成（无实质进展）或主动回复 `/unclaim` 时，任务将自动释放回 `open`。
   - 校验通过后，定时 Agent（`rsi_community_steward`）将 Issue 正文中的 `### Status` 更新为 `in_progress`、`### Assignee` 更新为 `@<handle>`（若附带 PR 链接则同步更新 `### Pull Request`）。
2. **完成验收并进入「已完成（`completed`）」**：
   - 贡献者向 `### Target Repository` 指定的目标仓库提交 Pull Request 并经委员会审核小组验收合入后，在任务 Issue 下方记录标准完成指令评论：
     ```text
     /complete @<github-handle> <pr-url> (+50 EXP)
     ```
   - 定时 Agent 或委员会成员将 Issue 正文中的 `### Status` 更新为 `completed`、`### Assignee` 更新为 `@<github-handle>`、`### Pull Request` 更新为 `<pr-url>`，并将该 Issue 以 `completed` 原因关闭。
   - 任务经验值（EXP）立即结算计入该贡献者的当月贡献榜与总贡献榜（月度激励核算规则详见 [RFC-0007 成员与激励](RFC-0007-people.zh.md)）。
