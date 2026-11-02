# RFC-0005 Leaderboard

- Feature Name: `leaderboard`
- Start Date: 2026-10-30
- RFC PR: [#23](https://github.com/Prism-Shadow/penguin-harness-community/pull/23)
- Updated by: N/A

[English](RFC-0005-leaderboard.md)

Leaderboard（榜单）用于将一组或多组 [RFC-0002 Evaluation](RFC-0002-evaluation.zh.md) 实验结果聚合为可视化统计图表。我们同样使用 [PenguinHarness Benchmark](https://github.com/Prism-Shadow/penguin-harness-benchmark) 开源仓库来存放所有的 Leaderboard 定义文件，本 RFC 仅负责规定 Leaderboard 的数据格式规范。

参考 [Terminal-Bench (tbench.ai)](https://www.tbench.ai/) 的展示形式，每个 Leaderboard 支持三种可选的统计图配置：**排行榜表格（`table`）**、**帕累托前沿图（`pareto`）**和**华夫饼网格图（`waffle`）**。

## 核心设计原则

1. **只存 ID 引用，不存计算结果**：Leaderboard 配置文件中**仅包含对 `experiment_id`、实验阶段（如 `train-1`、`test`）及指标字段的引用和计算表达式，绝不直接存储计算后的分值或标准差数字**。所有数值均在渲染时通过查找 `experiments/<experiment-id>/<phase>/summary.yaml`（及 `attempt-<n>.yaml`）实时计算。
2. **左侧行变量默认为 `(Harness, Model, Algorithm)` 的笛卡尔积**：在 `table`、`pareto` 和 `waffle` 中，每个参赛条目（Row / Entry）默认由 **`(harness_name, model_name, algorithm)` 的笛卡尔积**唯一确定（无自进化插件的基线实验 `algorithm` 记为 `null` 或 `"baseline"`）。
3. **用对象表示计算表达式（Expression Object）**：当某个榜单指标需要由单个或多个子实验聚合得出时（例如 [GDPevo](https://arxiv.org/pdf/2608.03764) 需要将六个独立拆分的子 Benchmark 结果平均到一起），使用结构化的表达式对象声明计算逻辑。
4. **默认降序排序**：`table.yaml` 默认按照主评分表达式计算出的值**从高到低排序**。
5. **支持多 Attempt 表达式样本标准差**：若所引用的 Experiment 包含多次重复试验（`n_attempt > 1`），可根据各次 Attempt 或 `summary.yaml` 计算出整个表达式的样本标准差。

## 目录结构

每个 Leaderboard 使用唯一的 `<leaderboard-id>` 标识，存放在 ` penguin-harness-benchmark` 仓库的 `leaderboards/<leaderboard-id>/` 目录下，包含可选的 `table.yaml`、`pareto.yaml` 和 `waffle.yaml`：

```text
penguin-harness-benchmark/
└── leaderboards/
    └── <leaderboard-id>/
        ├── table.yaml                  # 可选。排行榜表格视图定义
        ├── pareto.yaml                 # 可选。帕累托前沿图（得分 vs. 成本/耗时）定义
        └── waffle.yaml                 # 可选。华夫饼网格图（子基准/任务级分布）定义
```

## 表达式对象（Expression Object）规范

在 `table.yaml`、`pareto.yaml` 和 `waffle.yaml` 中，任何指标数值均通过**表达式对象**声明，分为**叶节点引用**与**复合运算表达式**两类：

### 1. 叶节点引用（Leaf Reference）

直接通过 `experiment_id` 和阶段名 `phase`（如 `train-1` 或 `test`）查找 `experiments/<experiment-id>/<phase>/summary.yaml` 中的统计字段：

```yaml
experiment_id: "gdpevo-essential-court-clerk-operations-skillopt-deepseek-flash-1017-20261030"
phase: "test"                           # 必填。阶段文件夹名称，如 "train-1"、"val-1" 或 "test"
metric: "score_mean"                    # 选填。读取 summary.yaml 中的字段名，默认为 "score_mean"（可选 "cost"、"duration_ms"、"pass@k" 等）
```

### 2. 复合运算表达式（Operator Expression）

通过 `op` 指定聚合或二元运算符，通过 `args` 数组传入子表达式对象列表：
- `op: "mean"`：对 `args` 中所有子表达式的值求算术平均（例如将 `GDPevo-essential` 的六个子 Benchmark 结果平均到一起）。
- `op: "sum"`：对 `args` 中所有子表达式的值求和（例如汇总六个子 Benchmark 的总 `cost` 或总 `duration_ms`）。
- `op: "sub"`：计算 `args[0] - args[1]`（例如用 `test` 阶段得分减去 Baseline 或 `train-1` 阶段得分以计算自进化增益 $\Delta$）。
- `op: "div"`：计算 `args[0] / args[1]`。
- `op: "weighted_mean"`：加权平均（每个子项可附带 `weight` 权重）。

例如，计算 `GDPevo-essential` 六个子 Benchmark 测试集平均分的表达式对象如下：

```yaml
op: "mean"
args:
  - experiment_id: "gdpevo-essential-court-clerk-operations-skillopt-deepseek-flash-1017-20261030"
    phase: "test"
    metric: "score_mean"
  - experiment_id: "gdpevo-essential-coverage-review-skillopt-deepseek-flash-1017-20261030"
    phase: "test"
    metric: "score_mean"
  - experiment_id: "gdpevo-essential-engineering-portfolio-analytics-skillopt-deepseek-flash-1017-20261030"
    phase: "test"
    metric: "score_mean"
  - experiment_id: "gdpevo-essential-financial-control-skillopt-deepseek-flash-1017-20261030"
    phase: "test"
    metric: "score_mean"
  - experiment_id: "gdpevo-essential-portfolio-management-skillopt-deepseek-flash-1017-20261030"
    phase: "test"
    metric: "score_mean"
  - experiment_id: "gdpevo-essential-service-ticket-resolution-skillopt-deepseek-flash-1017-20261030"
    phase: "test"
    metric: "score_mean"
```

### 表达式的均值与样本标准差计算公式

设线性聚合表达式 $Y = \sum_{g=1}^{G} w_g X_g$ 引用了 $G$ 个子实验阶段（如 `op: "mean"` 时 $w_g = \frac{1}{G}$；`op: "sum"` 时 $w_g = 1$；`op: "sub"` 时 $G = 2, w_1 = 1, w_2 = -1$）：

1. **表达式均值（$\bar{Y}$）**：直接读取各子实验阶段 `summary.yaml` 中的均值 $\bar{S}_g$（如 `score_mean`）代入线性组合：

$$\bar{Y} = \sum_{g=1}^{G} w_g \bar{S}_g$$

2. **表达式的样本标准差（$\text{std}(Y)$）**：当所引用的实验包含多次重复试验（`n_attempt` $= n > 1$）时：
   - 若按第 $j$ 次重复试验（$j = 1, \dots, n$）对应的单次实验总分 $S_{g,j}$ 合成第 $j$ 次试验的表达式值 $Y_j = \sum_{g=1}^{G} w_g S_{g,j}$，则表达式的样本标准差为：

$$\text{std}(Y) = \sqrt{\frac{1}{n - 1} \sum_{j=1}^{n} \left(Y_j - \bar{Y}\right)^2}$$

   - 若各子实验相互独立且直接基于各自 `summary.yaml` 中的 `score_std`（记为 $s_g$）计算，则由方差线性组合公式得：

$$\text{std}(Y) = \sqrt{\sum_{g=1}^{G} w_g^2 s_g^2}$$

## 三种统计图文件规范

### 1. `table.yaml`（排行榜表格）

`table.yaml` 定义排行榜表格视图。左侧固定展示参赛条目的 `(harness_name, model_name, algorithm)` 组合，右侧展示由表达式对象定义的数值列，**默认按主表达式列（`sort_by`，默认为第一列或主评分列）的值从高到低排序**：

```yaml
leaderboard_id: "gdpevo-essential"      # 必填。必须与所在文件夹名称一致
title: "GDPevo-Essential Leaderboard"   # 必填。英文标题
title_zh: "GDPevo-Essential 排行榜"     # 选填。中文标题
sort_by: "test_score"                   # 选填。默认排序列 key，默认按第一列从高到低（desc）排序
sort_order: "desc"                      # 选填。排序方向：desc（默认，从高到低）| asc
columns:                                # 必填。表格指标列定义
  - key: "test_score"
    title: "Test Score"
    title_zh: "测试集平均分"
    show_std: true                      # 选填。当存在多个 attempt 时是否显示 ± 样本标准差
  - key: "train_1_score"
    title: "Train-1 Score"
    title_zh: "首轮训练分"
  - key: "total_cost"
    title: "Cost ($)"
    title_zh: "单次成本 ($)"
rows:                                   # 必填。每行对应一组 (harness, model, algorithm) 笛卡尔积条目
  - harness_name: "PenguinHarness"
    model_name: "DeepSeek-V4.1-Flash-1017"
    algorithm: "skillopt-rsi-toolkit"
    values:
      test_score:
        op: "mean"
        args:
          - { experiment_id: "gdpevo-essential-court-clerk-operations-skillopt-deepseek-flash-1017-20261030", phase: "test", metric: "score_mean" }
          - { experiment_id: "gdpevo-essential-coverage-review-skillopt-deepseek-flash-1017-20261030", phase: "test", metric: "score_mean" }
          - { experiment_id: "gdpevo-essential-engineering-portfolio-analytics-skillopt-deepseek-flash-1017-20261030", phase: "test", metric: "score_mean" }
          - { experiment_id: "gdpevo-essential-financial-control-skillopt-deepseek-flash-1017-20261030", phase: "test", metric: "score_mean" }
          - { experiment_id: "gdpevo-essential-portfolio-management-skillopt-deepseek-flash-1017-20261030", phase: "test", metric: "score_mean" }
          - { experiment_id: "gdpevo-essential-service-ticket-resolution-skillopt-deepseek-flash-1017-20261030", phase: "test", metric: "score_mean" }
      train_1_score:
        op: "mean"
        args:
          - { experiment_id: "gdpevo-essential-court-clerk-operations-skillopt-deepseek-flash-1017-20261030", phase: "train-1", metric: "score_mean" }
          - { experiment_id: "gdpevo-essential-coverage-review-skillopt-deepseek-flash-1017-20261030", phase: "train-1", metric: "score_mean" }
          - { experiment_id: "gdpevo-essential-engineering-portfolio-analytics-skillopt-deepseek-flash-1017-20261030", phase: "train-1", metric: "score_mean" }
          - { experiment_id: "gdpevo-essential-financial-control-skillopt-deepseek-flash-1017-20261030", phase: "train-1", metric: "score_mean" }
          - { experiment_id: "gdpevo-essential-portfolio-management-skillopt-deepseek-flash-1017-20261030", phase: "train-1", metric: "score_mean" }
          - { experiment_id: "gdpevo-essential-service-ticket-resolution-skillopt-deepseek-flash-1017-20261030", phase: "train-1", metric: "score_mean" }
      total_cost:
        op: "sum"
        args:
          - { experiment_id: "gdpevo-essential-court-clerk-operations-skillopt-deepseek-flash-1017-20261030", phase: "test", metric: "cost" }
          - { experiment_id: "gdpevo-essential-coverage-review-skillopt-deepseek-flash-1017-20261030", phase: "test", metric: "cost" }
          - { experiment_id: "gdpevo-essential-engineering-portfolio-analytics-skillopt-deepseek-flash-1017-20261030", phase: "test", metric: "cost" }
          - { experiment_id: "gdpevo-essential-financial-control-skillopt-deepseek-flash-1017-20261030", phase: "test", metric: "cost" }
          - { experiment_id: "gdpevo-essential-portfolio-management-skillopt-deepseek-flash-1017-20261030", phase: "test", metric: "cost" }
          - { experiment_id: "gdpevo-essential-service-ticket-resolution-skillopt-deepseek-flash-1017-20261030", phase: "test", metric: "cost" }
```

### 2. `pareto.yaml`（帕累托前沿图）

`pareto.yaml` 定义性能与开销权衡的帕累托前沿散点/折线图（参考 [tbench.ai](https://www.tbench.ai/)）。每个数据点默认对应一组 `(harness_name, model_name, algorithm)` 笛卡尔积组合，通过表达式对象分别定义横轴 `x`（如单次总成本 `cost` 或总耗时 `duration_ms`）与纵轴 `y`（如测试集平均分 `score_mean`）：

```yaml
leaderboard_id: "gdpevo-essential"      # 必填。必须与所在文件夹名称一致
title: "Score vs. Cost Pareto Frontier" # 必填。英文标题
title_zh: "得分 vs. 成本 帕累托前沿"     # 选填。中文标题
x_axis:                                 # 必填。横轴配置（通常越小越优，如成本或耗时）
  title: "Test Cost ($)"
  title_zh: "单次测试成本 ($)"
  better: "lower"
y_axis:                                 # 必填。纵轴配置（通常越大越优，如得分）
  title: "Test Score"
  title_zh: "测试集平均分"
  better: "higher"
  show_std: true                        # 选填。若存在多个 attempt，是否在纵轴展示标准差误差棒
points:                                 # 必填。每个点对应一组 (harness, model, algorithm)
  - harness_name: "PenguinHarness"
    model_name: "DeepSeek-V4.1-Flash-1017"
    algorithm: "skillopt-rsi-toolkit"
    x:
      op: "sum"
      args:
        - { experiment_id: "gdpevo-essential-court-clerk-operations-skillopt-deepseek-flash-1017-20261030", phase: "test", metric: "cost" }
        - { experiment_id: "gdpevo-essential-coverage-review-skillopt-deepseek-flash-1017-20261030", phase: "test", metric: "cost" }
        - { experiment_id: "gdpevo-essential-engineering-portfolio-analytics-skillopt-deepseek-flash-1017-20261030", phase: "test", metric: "cost" }
        - { experiment_id: "gdpevo-essential-financial-control-skillopt-deepseek-flash-1017-20261030", phase: "test", metric: "cost" }
        - { experiment_id: "gdpevo-essential-portfolio-management-skillopt-deepseek-flash-1017-20261030", phase: "test", metric: "cost" }
        - { experiment_id: "gdpevo-essential-service-ticket-resolution-skillopt-deepseek-flash-1017-20261030", phase: "test", metric: "cost" }
    y:
      op: "mean"
      args:
        - { experiment_id: "gdpevo-essential-court-clerk-operations-skillopt-deepseek-flash-1017-20261030", phase: "test", metric: "score_mean" }
        - { experiment_id: "gdpevo-essential-coverage-review-skillopt-deepseek-flash-1017-20261030", phase: "test", metric: "score_mean" }
        - { experiment_id: "gdpevo-essential-engineering-portfolio-analytics-skillopt-deepseek-flash-1017-20261030", phase: "test", metric: "score_mean" }
        - { experiment_id: "gdpevo-essential-financial-control-skillopt-deepseek-flash-1017-20261030", phase: "test", metric: "score_mean" }
        - { experiment_id: "gdpevo-essential-portfolio-management-skillopt-deepseek-flash-1017-20261030", phase: "test", metric: "score_mean" }
        - { experiment_id: "gdpevo-essential-service-ticket-resolution-skillopt-deepseek-flash-1017-20261030", phase: "test", metric: "score_mean" }
```

### 3. `waffle.yaml`（华夫饼图 / 网格热力视图）

`waffle.yaml` 定义细粒度子基准或单题（Task）维度的华夫饼网格图（参考 [tbench.ai](https://www.tbench.ai/)）。左侧行变量默认同样为 `(harness_name, model_name, algorithm)` 的笛卡尔积（默认按行平均得分从高到低排序），右侧网格的每个单元格（Cell / Column）通过表达式或 `(experiment_id, phase)` 引用计算对应子基准或单题的得分：

```yaml
leaderboard_id: "gdpevo-essential"      # 必填。必须与所在文件夹名称一致
title: "Sub-Benchmark Score Breakdown"  # 必填。英文标题
title_zh: "子基准得分分布网格"           # 选填。中文标题
granularity: "benchmark"                # 选填。网格粒度："benchmark"（按子基准展开）| "task"（按 attempt-<n>.yaml 中的单题展开）
items:                                  # 必填。网格列定义（子基准标识或题目标识）
  - key: "court-clerk-operations"
    title: "Court Clerk"
    title_zh: "法院书记员"
  - key: "coverage-review"
    title: "Coverage Review"
    title_zh: "保险核保"
  - key: "engineering-portfolio-analytics"
    title: "Eng. Portfolio"
    title_zh: "工程组合分析"
  - key: "financial-control"
    title: "Financial Control"
    title_zh: "财务内控"
  - key: "portfolio-management"
    title: "Portfolio Mgmt"
    title_zh: "投资组合管理"
  - key: "service-ticket-resolution"
    title: "Service Ticket"
    title_zh: "工单处理"
rows:                                   # 必填。每行对应一组 (harness, model, algorithm)
  - harness_name: "PenguinHarness"
    model_name: "DeepSeek-V4.1-Flash-1017"
    algorithm: "skillopt-rsi-toolkit"
    cells:
      court-clerk-operations:
        experiment_id: "gdpevo-essential-court-clerk-operations-skillopt-deepseek-flash-1017-20261030"
        phase: "test"
        metric: "score_mean"
      coverage-review:
        experiment_id: "gdpevo-essential-coverage-review-skillopt-deepseek-flash-1017-20261030"
        phase: "test"
        metric: "score_mean"
      engineering-portfolio-analytics:
        experiment_id: "gdpevo-essential-engineering-portfolio-analytics-skillopt-deepseek-flash-1017-20261030"
        phase: "test"
        metric: "score_mean"
      financial-control:
        experiment_id: "gdpevo-essential-financial-control-skillopt-deepseek-flash-1017-20261030"
        phase: "test"
        metric: "score_mean"
      portfolio-management:
        experiment_id: "gdpevo-essential-portfolio-management-skillopt-deepseek-flash-1017-20261030"
        phase: "test"
        metric: "score_mean"
      service-ticket-resolution:
        experiment_id: "gdpevo-essential-service-ticket-resolution-skillopt-deepseek-flash-1017-20261030"
        phase: "test"
        metric: "score_mean"
```
