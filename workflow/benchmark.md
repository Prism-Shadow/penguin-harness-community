# Submit Benchmark

[中文版](benchmark.zh.md)

- Target Repository: [PenguinHarness Benchmark](https://github.com/Prism-Shadow/penguin-harness-benchmark)
- Specification: [RFC-0001 Benchmark](../rfcs/RFC-0001-benchmark.md)

## Submission Workflow

1. **Learn the RFC File Structure**: Read [RFC-0001 Benchmark](../rfcs/RFC-0001-benchmark.md) to understand the required layout of `packages/<benchmark-id>/`, `<task-id>/` (`statement/`, `rubric/`, `task_config.toml`), `benchmark_config.toml`, and the optional `data/<benchmark-id>/` directory.
2. **Open an Issue**: Check [PenguinHarness Benchmark Issues](https://github.com/Prism-Shadow/penguin-harness-benchmark/issues) for an existing Issue for the Benchmark, or open a new Issue describing the upstream source and number of tasks.
3. **Claim in Issue Comments (Optional)**: Leave a comment on the Issue to claim the work (claiming is optional and primarily prevents duplicate effort).
4. **Submit a PR**: Organize the Benchmark files according to `RFC-0001` (with `status = "draft"` in `benchmark_config.toml`) and open a Pull Request linked to the Issue.
5. **Maintainer Review & Merge**: Wait for a maintainer to review the task statements, rubrics, and configuration; once approved, `status` is updated to `"published"` and the PR is merged.

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
- [ ] Prepare `data/<benchmark-id>/` raw task files (if applicable)
- [ ] Verify that an Agent can run and score tasks following `statement/README.md`
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
- (Optional) Added `data/<benchmark-id>/` for raw task data

### Checklist
- [x] Directory layout and manifest fields conform to RFC-0001 Benchmark
- [x] `status` in `benchmark_config.toml` is set to `"draft"`
- [x] Verified sample tasks run and score properly
```
