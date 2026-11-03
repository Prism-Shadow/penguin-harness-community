# RFC-0005 Leaderboard

- Feature Name: `leaderboard`
- Start Date: 2026-10-30
- RFC PR: [#23](https://github.com/Prism-Shadow/penguin-harness-community/pull/23)
- Updated by: [#25](https://github.com/Prism-Shadow/penguin-harness-community/pull/25)

[English](RFC-0005-leaderboard.md)

Leaderboard（榜单）用于将一组或多组 [RFC-0002 Evaluation](RFC-0002-evaluation.zh.md) 实验结果聚合为可视化统计图表，使用 `<leaderboard-id>` 来区分。配置文件只存储实验 ID 引用与计算表达式，不直接存储计算后的分数。

我们同样复用 [PenguinHarness Benchmark](https://github.com/Prism-Shadow/penguin-harness-benchmark) 开源仓库来存放所有的 Leaderboard。参考 [Terminal-Bench (tbench.ai)](https://www.tbench.ai/)，同一个 Leaderboard 配置文件可同时渲染三种统计视图：
- **排行榜表格（Table）**：默认按表达式得分从高到低排序，展示水平柱状图 + 数字。
- **帕累托前沿图（Pareto）**：展示得分与资源开销的权衡，支持在页面切换开销轴为 `cost`（成本总和，默认）、`duration`（`duration_ms` 耗时总和）或 `token`（Token 总和）。
- **华夫饼网格图（Waffle）**：直接读取所引用实验 `attempt-<n>.yaml` 中的 `source` 与 `score` 展示每道题的得分分布。

## 目录结构

每个 Leaderboard 存放在 `leaderboards/<leaderboard-id>/` 文件夹下，统一为一个配置文件 `leaderboard.yaml`；关联的实验数据存放在 `experiments/<leaderboard-id>/<experiment-id>/` 下：

```text
penguin-harness-benchmark/
├── leaderboards/
│   └── <leaderboard-id>/
│       └── leaderboard.yaml
└── experiments/
    └── <leaderboard-id>/
        └── <experiment-id>/
```

## 添加 Leaderboard

要向仓库中添加一个新的 Leaderboard，请创建 `leaderboards/<leaderboard-id>` 文件夹，并在其下创建 `leaderboard.yaml` 配置文件：

```yaml
leaderboard_id: "gdpevo-essential"          # 必填。榜单唯一标识，必须与文件夹名称一致
title: "GDPevo-Essential Leaderboard"       # 必填。榜单英文标题
title_zh: "GDPevo-Essential 排行榜"         # 选填。榜单中文标题
author:                                     # 必填。作者与提交者信息
  name: "Prism-Shadow"                      # 必填。作者姓名或团队名称
  email: "author@example.com"               # 选填。联系邮箱
  homepage: "https://github.com/Prism-Shadow" # 选填。作者主页链接
values:                                     # 必填。参赛条目计算表达式列表
  - op: "mean"
    args:
      - { experiment_id: "gdpevo-essential-court-clerk-operations-skillopt-deepseek-flash-1017-20261030", phase: "test", metric: "score_mean" }
      - { experiment_id: "gdpevo-essential-coverage-review-skillopt-deepseek-flash-1017-20261030", phase: "test", metric: "score_mean" }
      - { experiment_id: "gdpevo-essential-engineering-portfolio-analytics-skillopt-deepseek-flash-1017-20261030", phase: "test", metric: "score_mean" }
      - { experiment_id: "gdpevo-essential-financial-control-skillopt-deepseek-flash-1017-20261030", phase: "test", metric: "score_mean" }
      - { experiment_id: "gdpevo-essential-portfolio-management-skillopt-deepseek-flash-1017-20261030", phase: "test", metric: "score_mean" }
      - { experiment_id: "gdpevo-essential-service-ticket-resolution-skillopt-deepseek-flash-1017-20261030", phase: "test", metric: "score_mean" }
  - op: "mean"
    args:
      - { experiment_id: "gdpevo-essential-court-clerk-operations-baseline-deepseek-flash-1017-20261028", phase: "test", metric: "score_mean" }
      - { experiment_id: "gdpevo-essential-coverage-review-baseline-deepseek-flash-1017-20261028", phase: "test", metric: "score_mean" }
      - { experiment_id: "gdpevo-essential-engineering-portfolio-analytics-baseline-deepseek-flash-1017-20261028", phase: "test", metric: "score_mean" }
      - { experiment_id: "gdpevo-essential-financial-control-baseline-deepseek-flash-1017-20261028", phase: "test", metric: "score_mean" }
      - { experiment_id: "gdpevo-essential-portfolio-management-baseline-deepseek-flash-1017-20261028", phase: "test", metric: "score_mean" }
      - { experiment_id: "gdpevo-essential-service-ticket-resolution-baseline-deepseek-flash-1017-20261028", phase: "test", metric: "score_mean" }
```

### `leaderboard.yaml` 字段说明

必填字段：

- `leaderboard_id` — 榜单唯一标识符，必须与所在的 `<leaderboard-id>` 文件夹名称一致，仅允许包含字母、数字和连字符 `-`。
- `title` — 榜单英文标题。
- `author` — 作者信息对象，其中 `author.name`（作者姓名或团队名称）为必填。
- `values` — 表达式对象数组，每个元素对应榜单中的一个参赛条目：
  - **叶节点引用**：通过 `{ experiment_id, phase, metric }` 读取 `experiments/<leaderboard-id>/<experiment-id>/<phase>/summary.yaml` 中的指标（`metric` 默认为 `"score_mean"`）。若单个条目只涉及一个 Benchmark，可直接写叶节点对象。
  - **复合运算表达式**：通过 `op`（支持 `"mean"`、`"sum"`、`"sub"`、`"div"`、`"weighted_mean"`）和 `args` 组合多个叶节点，用于计算多个子 Benchmark 的聚合表达式。
  - **一致性与自动分类**：**同一个表达式内引用的所有实验，其 `harness_name`、`model_name`、`algorithm` 和 `phase` 必须完全一致，只能是 Benchmark 不同**。渲染器自动从 `experiments/<leaderboard-id>/<experiment-id>/meta_info.yaml` 及 `phase` 提取 `(harness_name, model_name, algorithm, phase)` 进行显示和分类。

选填字段：

- `title_zh` — 榜单中文标题。
- `author.email` — 作者联系邮箱。
- `author.homepage` — 作者主页链接（默认可填写 GitHub 主页链接）。

### 均值与样本标准差计算公式

设单个表达式 $Y = \sum_{g=1}^{G} w_g X_g$ 组合了 $G$ 个子 Benchmark 实验阶段（如 `op: "mean"` 时 $w_g = \frac{1}{G}$），第 $g$ 个实验在 $n = \text{n\_attempt}$ 次重复试验中的单次总分为 $S_{g,1}, \dots, S_{g,n}$，均值为 $\bar{S}_g$：

1. **表达式均值（$\bar{Y}$）**：

$$\bar{Y} = \sum_{g=1}^{G} w_g \bar{S}_g$$

2. **表达式样本标准差（$\text{std}(Y)$，$n > 1$）**：记第 $j$ 次试验的合成得分为 $Y_j = \sum_{g=1}^{G} w_g S_{g,j}$：

$$\text{std}(Y) = \sqrt{\frac{1}{n - 1} \sum_{j=1}^{n} \left(Y_j - \bar{Y}\right)^2}$$

若各子实验相互独立且直接由各自的 `score_std`（$s_g$）合成：

$$\text{std}(Y) = \sqrt{\sum_{g=1}^{G} w_g^2 s_g^2}$$
