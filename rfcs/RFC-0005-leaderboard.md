# RFC-0005 Leaderboard

- Feature Name: `leaderboard`
- Start Date: 2026-10-30
- RFC PR: [#23](https://github.com/Prism-Shadow/penguin-harness-community/pull/23)
- Updated by: [#25](https://github.com/Prism-Shadow/penguin-harness-community/pull/25)

[中文版](RFC-0005-leaderboard.zh.md)

A Leaderboard aggregates one or more [RFC-0002 Evaluation](RFC-0002-evaluation.md) experiments into statistical charts, identified by `<leaderboard-id>`. Leaderboard files store only experiment ID references and expressions—never precomputed numeric scores.

We also use the open-source [PenguinHarness Benchmark](https://github.com/Prism-Shadow/penguin-harness-benchmark) repository to store all Leaderboards. Inspired by [Terminal-Bench (tbench.ai)](https://www.tbench.ai/), a single Leaderboard configuration file drives three chart views:
- **Ranking Table (`Table`)**: Sorted by evaluated score from high to low by default and rendered with a horizontal bar chart + number.
- **Pareto Frontier (`Pareto`)**: Compares score against resource usage, supporting switching the resource axis in the UI between total `cost` (default), total `duration` (`duration_ms`), or total `token`s.
- **Waffle Grid (`Waffle`)**: Directly reads `source` and `score` from `attempt-<n>.yaml` in the referenced experiments to display per-task scores.

## Directory Structure

Each Leaderboard is defined by a single file `leaderboards/<leaderboard-id>.yaml`, and its associated experiments are stored under `experiments/<leaderboard-id>/<experiment-id>/`:

```text
penguin-harness-benchmark/
├── leaderboards/
│   └── <leaderboard-id>.yaml
└── experiments/
    └── <leaderboard-id>/
        └── <experiment-id>/
```

## Adding a Leaderboard

To add a new Leaderboard to the repository, create a `<leaderboard-id>.yaml` configuration file inside `leaderboards/`:

```yaml
leaderboard_id: "gdpevo-essential"          # Required. Unique leaderboard ID (must match the file name)
title: "GDPevo-Essential Leaderboard"       # Required. English title
title_zh: "GDPevo-Essential 排行榜"         # Optional. Chinese title
subtitle: "Test Score on 6 Sub-Benchmarks"  # Optional. English subtitle
subtitle_zh: "六个子基准测试集平均得分"      # Optional. Chinese subtitle
author:                                     # Required. Author and submitter metadata
  name: "Prism-Shadow"                      # Required. Author or team name
  email: "author@example.com"               # Optional. Contact email
  homepage: "https://github.com/Prism-Shadow" # Optional. Author homepage URL
values:                                     # Required. List of entry expressions
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

### Field Specification

Required fields:

- `leaderboard_id` — Unique identifier for the Leaderboard. Must match the `<leaderboard-id>.yaml` file name and contain only letters, digits, and hyphens `-`.
- `title` — English display title for the Leaderboard.
- `author` — Author metadata object, where `author.name` (author or team name) is required.
- `values` — List of expression objects, where each item corresponds to one entry on the Leaderboard:
  - **Leaf Reference**: `{ experiment_id, phase, metric }` reads the specified metric (defaulting to `"score_mean"`) from `experiments/<leaderboard-id>/<experiment-id>/<phase>/summary.yaml`. A single-benchmark entry can use a leaf object directly.
  - **Composite Expression**: Combines multiple leaf references across sub-benchmarks via `op` (`"mean"`, `"sum"`, `"sub"`, `"div"`, or `"weighted_mean"`) and `args`.
  - **Consistency & Automatic Classification**: **All experiments referenced within a single expression must share the exact same `harness_name`, `model_name`, `algorithm`, and `phase`, differing only in Benchmark**. The renderer automatically extracts `(harness_name, model_name, algorithm, phase)` from `experiments/<leaderboard-id>/<experiment-id>/meta_info.yaml` and `phase` to display and classify each entry.

Optional fields:

- `title_zh` — Chinese display title for the Leaderboard.
- `subtitle` — English subtitle for the Leaderboard.
- `subtitle_zh` — Chinese subtitle for the Leaderboard.
- `author.email` — Contact email address of the author.
- `author.homepage` — Author homepage link (can default to a GitHub profile URL).

### Score Calculation Formulas

Given a linear expression $Y = \sum_{g=1}^{G} w_g X_g$ across $G$ sub-benchmark experiment phases (e.g., $w_g = \frac{1}{G}$ for `op: "mean"`), with per-attempt scores $S_{g,1}, \dots, S_{g,n}$ ($n = \text{n\_attempt}$) and mean $\bar{S}_g$:

1. **Expression Mean ($\bar{Y}$)**:

$$\bar{Y} = \sum_{g=1}^{G} w_g \bar{S}_g$$

2. **Expression Sample Standard Deviation ($\text{std}(Y)$, $n > 1$)**: With $Y_j = \sum_{g=1}^{G} w_g S_{g,j}$:

$$\text{std}(Y) = \sqrt{\frac{1}{n - 1} \sum_{j=1}^{n} \left(Y_j - \bar{Y}\right)^2}$$

Or from independent sub-benchmark `score_std` values ($s_g$):

$$\text{std}(Y) = \sqrt{\sum_{g=1}^{G} w_g^2 s_g^2}$$
