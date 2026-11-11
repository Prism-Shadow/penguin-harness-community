# RFC-0007 成员与激励

- Feature Name: `people`
- Start Date: 2026-11-11
- RFC PR: [#29](https://github.com/Prism-Shadow/penguin-harness-community/pull/29)
- Updated by: N/A

[English](RFC-0007-people.md)

为了保障社区的长期高质量演进并回馈开源贡献者，Shared RSI Community 设立了 **RSI 社区委员会（RSI Community Committee）**与**贡献榜月度激励机制**，相关成员与榜单统一展示在网站 `/people/` 页面。

## 1. RSI 社区委员会（RSI Community Committee）

社区委员会负责基础设施维护、[RFC-0006 任务板](RFC-0006-quests.zh.md)官方任务提案发布（社区仅认可委员会成员发布的任务）以及 PR 代码与实验结果的可复现性审核。

### 1.1 委员会分组与成员职责

委员会目前下设三个小组：

| 小组 | 当前成员 | 负责方向（词条） | 核心职责 |
| --- | --- | --- | --- |
| **项目主导方（Project Leadership）** | `Yaowei Zheng`（[@hiyouga](https://github.com/hiyouga)） | `Benchmark`、`算法`、`Harness` | 统筹社区路线图、标准规范制定与基础设施建设 |
| **提案小组（Proposal Group）** | `Xiang Qu`（[@ArisaZz](https://github.com/ArisaZz)）、`Zhihao Liu`（[@lzh368](https://github.com/lzh368)）、`Yanke Yu`（[@rank-Yu](https://github.com/rank-Yu)） | `算法`（Xiang Qu）、`Benchmark`（Zhihao Liu）、`Harness`（Yanke Yu） | 调研前沿论文与基准需求，按 [RFC-0006](RFC-0006-quests.zh.md) 标准模板发布官方社区任务 |
| **审核小组（Review Group）** | `Leijun Zhou`（[@Saigyouji-Yuyuko1000](https://github.com/Saigyouji-Yuyuko1000)）、`Zhihao Liu`（[@lzh368](https://github.com/lzh368)）、`Yangxi Xiang`（[@Myriad-Dreamin](https://github.com/Myriad-Dreamin)） | `算法`（Leijun Zhou）、`Benchmark`（Zhihao Liu）、`Harness`（Yangxi Xiang） | 审核贡献者提交的 Benchmark、Evaluation、算法插件与框架 PR，确认可复现性并合入结算 |

- **领域词条扩展**：除现有的 `Benchmark`、`算法`、`Harness` 方向外，委员会后续将持续引入 `医学`、`通信` 等更多垂直领域方向。
- **委员会固定激励**：每位社区委员会成员享有 **1,000 元 / 月固定激励**（以等值模型 Token 额度、算力代金券形式发放）。
- **申请加入方式**：欢迎有志于共建开源自进化生态的研究者与开发者通过**社区微信群**申请加入社区委员会。

## 2. 贡献榜（Contributor Leaderboard）

网站 `/people/` 页面设有两个按经验值（EXP）从高到低排序的贡献榜单：

1. **当月贡献榜（Monthly Leaderboard）**：统计当前自然月内通过完成 [RFC-0006](RFC-0006-quests.zh.md) 官方认可任务所获得的经验值（EXP），作为当月末发放贡献者激励的唯一依据；每月末结算归档后于次月重置。
2. **总贡献榜（All-Time Leaderboard）**：长期累计贡献者在社区获得的历史总经验值（EXP）与已完成任务数。

> **注意**：仅由 RSI 社区委员会成员发布的官方任务在验收合入后计入 EXP；非委员会成员自行发布的 Issue 不计入贡献榜。

## 3. 贡献榜月度激励结算规则

除委员会成员固定激励外，社区设立**每月总额度上限 10,000 元人民币**（以等值模型 Token 额度、算力代金券形式发放）的贡献榜激励池，于每月末根据**当月贡献榜**自动核算并发放：

| 激励组成部分 | 发放标准 | 计算公式与说明 |
| --- | --- | --- |
| **1. 经验值 1:1 兑换激励** | **1 EXP = 1 元** | 每获得 1 点当月经验值（EXP）直接兑换 1 元等值额度（例如完成 1 项 50 EXP 标准任务即获 50 元基础激励），不按总池比例稀释，亦不会在当月参与人数较少时过度分配：$$\text{经验值兑换激励} = \text{个人当月 EXP} \times 1\text{ 元}$$ |
| **2. 当月前五名额外奖励** | **800 / 400 / 200 / 100 / 50 元** | 当月贡献榜排名前 5 的贡献者（须当月 $\text{EXP} > 0$）额外获得阶梯奖励：**第 1 名 +800 元**、**第 2 名 +400 元**、**第 3 名 +200 元**、**第 4 名 +100 元**、**第 5 名 +50 元**。 |

个人当月总激励为上述两部分之和：

$$\text{个人当月总激励} = \text{个人当月 EXP} \times 1\text{ 元} + \text{当月排名额外奖励}$$

全社区当月贡献榜激励发放总额以 **10,000 元人民币 / 月**为上限。
