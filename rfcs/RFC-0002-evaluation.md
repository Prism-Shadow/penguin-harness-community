# RFC-0002 Evaluation

[中文版](RFC-0002-evaluation.zh.md)

An Evaluation is a set of experimental data for an Agent, identified by `<experiment-id>`. An experiment is typically divided into multiple phases—such as training, validation, and testing (e.g., `train-1`, `val-1`, `train-2`, `val-2`, `test`)—where `test` must never have a numeric suffix, and every experiment must include the `test` phase.

We also use the open-source [PenguinHarness Benchmark](https://github.com/Prism-Shadow/penguin-harness-benchmark) repository to curate all Agent Evaluations. The Evaluation data structure defined in this specification standardizes how results across different experiments and self-evolution phases are recorded, enabling reproducible comparisons and leaderboard aggregation.

## Directory Structure

Each experiment is stored under `experiments/<experiment-id>/`. The file structure of the repository is organized as follows:

```text
penguin-harness-benchmark/
└── experiments/
    └── <experiment-id>/
        ├── train-1/
        │   ├── attempt-1.yaml
        │   ├── attempt-2.yaml
        │   └── summary.yaml
        ├── test/
        │   ├── attempt-1.yaml
        │   ├── attempt-2.yaml
        │   ├── attempt-3.yaml
        │   └── summary.yaml
        └── meta_info.yaml
```

- `experiments/<experiment-id>/`: Stores the metadata configuration and phase-by-phase evaluation records for a single experiment.
- `<phase>/` (e.g., `train-1/`, `val-1/`, `test/`): Phase directory. Training and validation phases may be numbered by iteration (such as `train-1`, `val-1`, `train-2`, `val-2`), whereas the final test phase must be named `test` (without a trailing number), and every experiment must contain a `test/` phase.
- `meta_info.yaml`: Records the experiment-level metadata and runtime configuration (model, Harness, RSI algorithm, dataset splits, and author information).
- `summary.yaml`: Records the aggregated score statistics, duration, token usage, and cost for that phase.
- `attempt-<n>.yaml`: Records the fine-grained per-task results for the `n`-th repeated trial of that phase.

## Adding an Evaluation

To add a new Evaluation experiment to the repository, organize its files as follows:

1. Create an `experiments/<experiment-id>` directory and add a `meta_info.yaml` configuration file inside it:

```yaml
experiment_id: "<experiment-id>"        # Required. Unique experiment ID (must match the folder name)
status: "draft"                         # Required. Status: draft when submitted, published after review
submit_time: "2026-10-29T12:00:00Z"     # Required. Submission timestamp in ISO 8601 UTC format
harness_name: "PenguinHarness"          # Required. Name of the Harness used
harness_version: "0.2.16"               # Required. Harness version in standard x.y.z format
harness_setting:                        # Optional. Custom Harness configuration object
  max_turns: 100
model_name: "gemini-2.5-pro"            # Required. Model name
model_provider: "google"                # Required. Model provider
thinking_level: "high"                  # Required. Reasoning level: low | medium | high | xhigh | max
algorithm: "<plugin-id>"                # Optional. RSI algorithm plugin ID (must be a valid plugin_id)
training_data:                          # Optional. List of training benchmark-ids
  - "penguinharness-benchmark-gdpevo-crm-train"
validation_data:                        # Optional. List of validation benchmark-ids
  - "penguinharness-benchmark-gdpevo-crm-val"
test_data:                              # Required. List of test benchmark-ids
  - "penguinharness-benchmark-gdpevo-crm-test"
author:                                 # Required. Author and submitter metadata
  name: "Author Name"                   # Required. Author or team name
  email: "author@example.com"           # Optional. Contact email
  homepage: "https://github.com/..."    # Optional. Author homepage URL (defaults to GitHub profile)
```

### `meta_info.yaml` Specification

Required fields:

- `experiment_id` — Unique identifier for the experiment. Must match the `<experiment-id>` directory name and contain only letters, digits, and hyphens `-` (underscores are not allowed).
- `status` — Current status: defaults to `"draft"` upon submission and becomes `"published"` after passing review.
- `submit_time` — Submission timestamp in ISO 8601 UTC format accurate to seconds (e.g., `"2026-10-29T12:00:00Z"`).
- `harness_name` — Name of the Agent Harness evaluated (string).
- `harness_version` — Version of the Harness in standard `x.y.z` format (e.g., `"0.2.16"`).
- `model_name` — Name of the backbone model evaluated (string).
- `model_provider` — Model provider identifier (string).
- `thinking_level` — Reasoning effort level, one of `"low"`, `"medium"`, `"high"`, `"xhigh"`, or `"max"`.
- `test_data` — List of test Benchmark IDs (array of strings); each item must be a valid `benchmark-id`.
- `author` — Author metadata object, where `author.name` (author or team name) is required.

Optional fields:

- `harness_setting` — Arbitrary key-value object recording custom Harness settings.
- `algorithm` — RSI algorithm plugin identifier (string); must be a valid `plugin_id`.
- `training_data` — List of training Benchmark IDs (array of strings); each item must be a valid `benchmark-id`.
- `validation_data` — List of validation Benchmark IDs (array of strings); each item must be a valid `benchmark-id`.
- `author.email` — Contact email address of the author.
- `author.homepage` — Author homepage link (can default to a GitHub profile URL).

2. Inside each phase directory `experiments/<experiment-id>/<phase>/` (e.g., `train-1/`, `test/`, where `test/` is required and must not have a numeric suffix), create a `summary.yaml` file:

```yaml
time: "2026-10-29T12:00:00Z"            # Required. Phase completion timestamp (ISO 8601 UTC)
summary: "Improved prompt and skills."  # Optional. English summary of what changed in this phase
summary_zh: "优化了提示词与技能库。"      # Optional. Chinese summary of what changed in this phase
score_mean: 72.5                        # Required. Mean score across attempts
score_std: 1.8                          # Required. Sample standard deviation of scores
n_attempt: 3                            # Required. Number of repeated attempts
cost: 4.25                              # Required. Single-experiment cost in USD (based on MMSP list price)
duration_ms: 540000                     # Required. Single-experiment total duration in milliseconds
n_input_tokens: 1250000                 # Required. Single-experiment total input tokens (including cached tokens)
n_cache_tokens: 980000                  # Required. Single-experiment total cached tokens
n_output_tokens: 85000                  # Required. Single-experiment total output tokens
```

### `summary.yaml` Specification

Required fields:

- `time` — Timestamp when the phase finished, in ISO 8601 UTC format accurate to seconds (e.g., `"2026-10-29T12:00:00Z"`).
- `score_mean` — Mean score across repeated attempts in this phase.
- `score_std` — Sample standard deviation of scores across repeated attempts in this phase.
- `n_attempt` — Number of repeated attempts in this phase (positive integer matching the number of `attempt-<n>.yaml` files).
- `cost` — Cost of a single experiment in USD, calculated using the [MMSP Model List Prices](https://mmsp.penguin.ooo/zh/models/).
- `duration_ms` — Total duration of a single experiment in milliseconds.
- `n_input_tokens` — Total input tokens for a single experiment (including cached tokens).
- `n_cache_tokens` — Total cached input tokens for a single experiment.
- `n_output_tokens` — Total output tokens for a single experiment.

Optional fields:

- `summary` — English summary describing key changes or improvements in this phase.
- `summary_zh` — Chinese summary describing key changes or improvements in this phase.

3. Inside each phase directory `experiments/<experiment-id>/<phase>/`, create `attempt-<n>.yaml` files (e.g., `attempt-1.yaml`, `attempt-2.yaml`) recording the fine-grained task-level results for each attempt as a YAML list of objects:

```yaml
- benchmark_id: "penguinharness-benchmark-gdpevo-crm-test" # Required. Benchmark ID
  task_id: "CASE-001-account-renewal"                      # Required. Task ID
  time: "2026-10-29T12:00:00Z"                             # Required. Task completion timestamp (ISO 8601 UTC)
  score: 85.0                                              # Required. Score on this task
  cost: 0.42                                               # Required. Cost on this task in USD
  duration_ms: 52000                                       # Required. Duration on this task in milliseconds
  n_input_tokens: 125000                                   # Required. Total input tokens on this task (including cached tokens)
  n_cache_tokens: 98000                                    # Required. Total cached tokens on this task
  n_output_tokens: 8500                                    # Required. Total output tokens on this task
  trace_filepath: "traces/attempt-1/CASE-001.jsonl"        # Optional. Path to the execution trace file
  error_reason: ""                                         # Optional. Reason why the task failed or errored
```

### `attempt-<n>.yaml` Specification

Each item in the list records the result of a single task in that attempt:

Required fields:

- `benchmark_id` — Unique identifier of the Benchmark (`benchmark-id`) to which the task belongs.
- `task_id` — Unique identifier of the task (`task-id`).
- `time` — Timestamp when the task evaluation completed, in ISO 8601 UTC format accurate to seconds (e.g., `"2026-10-29T12:00:00Z"`).
- `score` — Score achieved on the task in this attempt.
- `cost` — Cost incurred on the task in USD (calculated using the [MMSP Model List Prices](https://mmsp.penguin.ooo/zh/models/)).
- `duration_ms` — Execution duration of the task in milliseconds.
- `n_input_tokens` — Total input tokens for the task in this attempt (including cached tokens).
- `n_cache_tokens` — Total cached input tokens for the task in this attempt.
- `n_output_tokens` — Total output tokens for the task in this attempt.

Optional fields:

- `trace_filepath` — Relative or archived file path to the execution trace for the task.
- `error_reason` — Reason why the current task errored or failed during execution or grading (string).
