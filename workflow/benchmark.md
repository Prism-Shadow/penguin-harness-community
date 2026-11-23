# Submit Benchmark

[中文版](benchmark.zh.md)

- Target Repository: [PenguinHarness Benchmark](https://github.com/Prism-Shadow/penguin-harness-benchmark)
- Specification: [RFC-0001 Benchmark](../rfcs/RFC-0001-benchmark.md)

## Submission Workflow

1. **Learn the RFC File Structure**: Read [RFC-0001 Benchmark](../rfcs/RFC-0001-benchmark.md) to understand the required layout of `packages/<benchmark-id>/`, `<task-id>/`, `benchmark_config.toml`, and storing large raw task data in a dedicated external repository.
2. **Open an Issue**: Check [PenguinHarness Benchmark Issues](https://github.com/Prism-Shadow/penguin-harness-benchmark/issues) for an existing Issue for the Benchmark, or open a new Issue describing the upstream source and number of tasks. If the Benchmark has large raw data, you may use your own repository or contact the Community Committee to create one.
3. **Claim in Issue Comments**: Leave a comment on the Issue to claim the work; claiming is optional and primarily prevents duplicate effort.
4. **Submit a PR**: Organize the Benchmark files according to `RFC-0001` with `status = "draft"` in `benchmark_config.toml`. If large raw data is required, push it to the dedicated external data repository and reference it at a pinned commit in `statement/README.md`, then open a Pull Request for `packages/<benchmark-id>/` linked to the Issue.
5. **Maintainer Review & Merge**: Review the PR against the [Benchmark PR merge criteria](#benchmark-pr-merge-criteria), then set `status` to `"published"` and merge once approved.

## Benchmark PR Merge Criteria

- **Traceable sources.** Provide the sources and licenses for the tasks and data. For an upstream benchmark, state the version, which tasks are included, and any changes to the tasks or grading rules.
- **Runnable tasks.** Check the directories, configuration, and data paths for all submitted tasks. Confirm that they follow RFC-0001 and load successfully. With the documented dependencies and environment, run representative tasks through loading, execution, and grading.
- **Meaningful grading.** Check that the rubric measures what each task asks for. Confirm expected scores on passing outputs, such as reference solutions, and failing outputs, such as empty or incorrect results. If the benchmark includes training and test sets, explain the split and check for task overlap or answer leakage.
- **Verifiable results.** Include the tasks or subset used for verification, the runtime environment, reproduction commands, and grading records so maintainers can check what was verified and how it scored.

## Recommended Verification & Examples

- **Recommended Model & Metric**: After organizing a Benchmark, we recommend running $k = 3$ repeated attempts with the **DeepSeek Flash** model to verify that tasks are solvable, discriminative, and graded deterministically, optionally reporting **`pass@k`**.
- **Model Version Suffix**: If you also submit baseline evaluation records using models like `deepseek-flash`, always include the explicit version suffix in `model_name` (e.g., `deepseek-flash-1017`).
- **Reference Examples**:
  - General evaluation benchmarks: [`penguinharness-benchmark-sec-a`](https://github.com/Prism-Shadow/penguin-harness-benchmark/tree/main/packages/penguinharness-benchmark-sec-a) (Data Analysis Bench subset) through [`penguinharness-benchmark-sec-e`](https://github.com/Prism-Shadow/penguin-harness-benchmark/tree/main/packages/penguinharness-benchmark-sec-e) (Terminal-Bench subset).
  - Self-evolution paired train/test splits: `GDPevo-essential` training package [`penguinharness-benchmark-gdpevo-crm-train`](https://github.com/Prism-Shadow/penguin-harness-benchmark/tree/main/packages/penguinharness-benchmark-gdpevo-crm-train) and test package [`penguinharness-benchmark-gdpevo-crm-test`](https://github.com/Prism-Shadow/penguin-harness-benchmark/tree/main/packages/penguinharness-benchmark-gdpevo-crm-test).

## Format Examples

### 1. Issue Example

**Title**: `[Benchmark] Add <benchmark-id>: <Benchmark Title>`

```markdown
### Benchmark Overview
- **Benchmark ID**: `<benchmark-id>`
- **Upstream Source / Paper**: <URL>
- **Number of Tasks**: <N>
- **Evaluation Mode**: Harbor Docker sandbox / Rubric grading

### Plan
- [ ] Prepare `packages/<benchmark-id>/benchmark_config.toml` and `<task-id>/` directories
- [ ] If applicable, place raw task files in a dedicated external data repository, either self-hosted or created by contacting the Community Committee
- [ ] Verify tasks with `deepseek-flash-1017` to ensure tasks run and score properly
```

### 2. Issue Claim Comment Example (Optional)

```markdown
I would like to claim this Benchmark and plan to submit a PR by YYYY-MM-DD.
```

### 3. PR Example

**Title**: `feat(benchmark): add <benchmark-id>`

```markdown
Closes #<issue-number>

### Summary
- Added `packages/<benchmark-id>/` with `benchmark_config.toml` and <N> tasks (`statement/`, `rubric/`, `task_config.toml`)
- (Optional) Raw task data repository: <external data repository URL and pinned commit>

### Checklist
- [x] Directory layout and manifest fields conform to RFC-0001 Benchmark
- [x] `status` in `benchmark_config.toml` is set to `"draft"`
- [x] Verified tasks with `deepseek-flash-1017`
```
