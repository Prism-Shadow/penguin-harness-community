# RFC-0001 Benchmark

- Feature Name: `benchmark`
- Start Date: 2026-10-29
- RFC PR: [#14](https://github.com/Prism-Shadow/penguin-harness-community/pull/14)
- Updated by: [#15](https://github.com/Prism-Shadow/penguin-harness-community/pull/15), [#21](https://github.com/Prism-Shadow/penguin-harness-community/pull/21)

[中文版](RFC-0001-benchmark.zh.md)

A Benchmark is a dataset used to evaluate an Agent and does not contain evaluation results. A Benchmark consists of multiple tasks, and each task typically includes a problem statement (`statement`) and a scoring rubric (`rubric`).

We built the open-source [PenguinHarness Benchmark](https://github.com/Prism-Shadow/penguin-harness-benchmark) repository to curate all Agent Benchmarks. The Benchmark format defined in this specification standardizes the structure across different Benchmarks to make running Benchmarks simpler. We adopt an **Agent-driven** Benchmark organization so that Agents can autonomously run Benchmarks, compute scores automatically, and leverage sandboxed evaluation frameworks such as [Harbor](https://github.com/harbor-framework/harbor) to prevent evaluation hacking.

## Directory Structure

Each Benchmark is divided into `packages/<benchmark-id>` and an optional `data/<benchmark-id>`. The file structure of the repository is organized as follows:

```text
penguin-harness-benchmark/
├── packages/
│   └── <benchmark-id>/
│       ├── <task-id>/
│       │   ├── statement/
│       │   │   └── README.md
│       │   ├── rubric/
│       │   │   └── README.md
│       │   └── task_config.toml
│       └── benchmark_config.toml
└── data/
    └── <benchmark-id>/
        └── README.md
```

- `packages/`: Holds the metadata and description files of the Benchmark, keeping packages lightweight for fast migration across environments. Lightweight tasks can be placed directly inside `statement/` (problem statement) and `rubric/` (scoring rubric), whereas larger tasks store their raw data under `data/`.
- `data/`: Stores large raw task files (such as tasks in Harbor format) so that migrating `packages/` does not consume excessive disk space. For Harbor tasks, place the Harbor execution instructions inside `statement/` and store the Harbor task data inside `data/`.

Example: [penguinharness-benchmark-sec-a](https://github.com/Prism-Shadow/penguin-harness-benchmark/tree/main/packages/penguinharness-benchmark-sec-a)

## Adding a Benchmark

To add a new Benchmark to the repository, organize its files as follows:

1. Create a `packages/<benchmark-id>` directory, storing each task in its own `<task-id>` folder (e.g., `CASE-001-<name>`):
   - Place problem-related materials inside `statement/` (visible to the Test Agent; defines the objective, available materials, and required deliverables).
   - Place grading-related materials inside `rubric/` (visible only to the Evaluator Agent; defines the scoring rubric, point allocations, and reference answers).
   - `README.md` is the entrypoint file for each folder (mandatory reading for the Agent).
2. Create a `benchmark_config.toml` manifest inside `packages/<benchmark-id>/`:

```toml
id = "<benchmark-id>"                   # Required. Unique Benchmark ID (must match the folder name)
title = "Benchmark Title"               # Required. English display name for the Benchmark
title_zh = "Benchmark 标题"             # Optional. Chinese display name for the Benchmark
description = "..."                     # Required. Short English description of the Benchmark
description_zh = "..."                  # Optional. Short Chinese description of the Benchmark
version = "0.1.0"                       # Required. Version in standard x.y.z format
last_update = "2026-10-29T12:00:00Z"    # Required. Last update timestamp accurate to seconds (ISO 8601)
status = "draft"                        # Required. Status: draft when submitted, published after review
references = [                          # Optional. Array of original reference URLs (e.g., data source, paper, repo)
  "https://arxiv.org/abs/...",
  "https://github.com/..."
]

[author]                                # Required. Author and maintainer information
name = "Author Name"                    # Required. Author or team name
email = "author@example.com"            # Optional. Contact email
homepage = "https://github.com/..."     # Optional. Author homepage URL (defaults to GitHub profile)
```

### `benchmark_config.toml` Specification

Required fields:

- `id` — Unique identifier for the Benchmark. Must match the `<benchmark-id>` directory name and contain only letters, digits, and hyphens `-` (underscores are not allowed).
- `title` — English display name for the Benchmark.
- `description` — English description summarizing what the Benchmark measures, its data sources, and its scoring method.
- `version` — Version string in standard `x.y.z` format (e.g., `"0.1.0"`).
- `last_update` — Last updated timestamp accurate to seconds (ISO 8601 format, e.g., `"2026-10-29T12:00:00Z"`).
- `status` — Current status: defaults to `"draft"` upon submission and becomes `"published"` after passing review.
- `[author]` — Author metadata table containing:
  - `name` — Author or team name.

Optional fields:

- `title_zh` — Chinese display name for the Benchmark.
- `description_zh` — Chinese description of the Benchmark.
- `references` — List of original reference links (array of strings) recording where the Benchmark data comes from, such as the original paper, dataset homepage, or upstream repository URLs.
- `author.email` — Contact email address of the author.
- `author.homepage` — Author homepage link (can default to a GitHub profile URL).

3. Create a `task_config.toml` manifest inside `packages/<benchmark-id>/<task-id>/`:

```toml
id = "<task-id>"                        # Required. Unique task ID (must match the folder name)
title = "Task Title"                    # Required. English display name for the task
title_zh = "题目标题"                    # Optional. Chinese display name for the task
description = "..."                     # Required. Short English description of the task
description_zh = "..."                  # Optional. Short Chinese description of the task

[budget]                                # Optional. Per-task evaluation resource budget (omit for unlimited)
timeout = 900                           # Optional. Timeout per run in seconds (omit for unlimited)
cpus = 4                                # Optional. CPU core limit (omit for unlimited)
ram = 8                                 # Optional. Memory limit in GB (omit for unlimited)
disk = 20                               # Optional. Disk space limit in GB (omit for unlimited)
gpus = 0                                # Optional. GPU count limit (0 for CPU-only, omit for unlimited)
```

### `task_config.toml` Specification

Required fields:

- `id` — Unique identifier for the task. Must match the `<task-id>` directory name.
- `title` — English display name for the task.
- `description` — English description summarizing the task objective and overview.

Optional fields:

- `title_zh` — Chinese display name for the task.
- `description_zh` — Chinese description of the task.
- `[budget]` — Per-task evaluation budget and resource configuration table (both the `[budget]` table and each field inside it are optional; omitting any field means that resource is unlimited):
  - `timeout` — Timeout per run in seconds (e.g., `900` for 15 minutes; omit for unlimited).
  - `cpus` — Allocated CPU cores (e.g., `4`; omit for unlimited).
  - `ram` — Allocated memory limit in GB (e.g., `8`; omit for unlimited).
  - `disk` — Allocated disk space limit in GB (e.g., `20`; omit for unlimited).
  - `gpus` — Allocated GPU count (`0` for no GPU / CPU-only, positive integer for GPU count; omit for unlimited).

4. (Optional) If the tasks include large raw datasets or sandbox environment files (such as Harbor tasks), place the raw data under `data/<benchmark-id>/` along with a `README.md` entrypoint. The internal layout of `data/<benchmark-id>/` is unrestricted as long as an Agent can run the Benchmark by following the metadata and instructions in `packages/<benchmark-id>/`.

## Training Data & GDPevo Evaluation Protocol

Training datasets can also be organized in the standard Benchmark format—stored under `packages/<benchmark-id>/` with one `<task-id>` directory per task—and paired with their corresponding test datasets (for example, [GDPevo](https://arxiv.org/pdf/2608.03764)'s training split [penguinharness-benchmark-gdpevo-crm-train](https://github.com/Prism-Shadow/penguin-harness-benchmark/tree/main/packages/penguinharness-benchmark-gdpevo-crm-train) and test split [penguinharness-benchmark-gdpevo-crm-test](https://github.com/Prism-Shadow/penguin-harness-benchmark/tree/main/packages/penguinharness-benchmark-gdpevo-crm-test)).

Under the [GDPevo](https://arxiv.org/pdf/2608.03764) self-evolution evaluation protocol, tasks are organized into independent **Task Groups** across business domains (for example, `GDPevo-essential` comprises six domain Task Groups: CRM, ERP, Finance, Healthcare, Legal, and DataAnalysis):
1. **Per-Group Self-Evolution Training**: The Agent first undergoes self-evolution training on a Task Group's training split (`*-train`), such as distilling rules or evolving Skills.
2. **Paired Test-Split Evaluation**: The evolved Agent state is then frozen and evaluated on the corresponding held-out test split (`*-test`) of that same Task Group.
3. **Macro-Average Across Task Groups**: Finally, the evaluation scores on the test splits across all Task Groups are averaged to produce the overall GDPevo score.
