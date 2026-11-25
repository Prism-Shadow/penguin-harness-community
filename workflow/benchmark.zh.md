# 提交 Benchmark

[English](benchmark.md)

- 目标仓库：[PenguinHarness Benchmark](https://github.com/Prism-Shadow/penguin-harness-benchmark)
- 标准格式：[RFC-0001 Benchmark](../rfcs/RFC-0001-benchmark.zh.md)

## 提交流程

1. **学习 RFC 文件结构**：先阅读 [RFC-0001 Benchmark](../rfcs/RFC-0001-benchmark.zh.md)，了解 `packages/<benchmark-id>/`、`<task-id>/`、`benchmark_config.toml` 以及大体积原始数据存放在独立外部仓库的规范。
2. **提出 Issue**：在 [PenguinHarness Benchmark Issues](https://github.com/Prism-Shadow/penguin-harness-benchmark/issues) 中搜索是否已有对应 Benchmark 的 Issue；若没有，则新建一个 Issue 说明要整理的 Benchmark 来源与题目规模。若包含大体积原始数据，可使用自建仓库，也可联系社区委员会创建外部数据仓库。
3. **Issue 评论区占坑**：在目标 Issue 评论区留言认领，占坑是可选步骤，主要用于防止多人同时整理同一个 Benchmark 撞车。
4. **提交 PR**：按 `RFC-0001` 完成 Benchmark 转换与自测，提交时将 `benchmark_config.toml` 的 `status` 设为 `"draft"`；若包含大体积原始数据，将其推入对应的独立外部数据仓库并在 `statement/README.md` 中通过固定 Commit 引用，随后向 `penguin-harness-benchmark` 提交 `packages/<benchmark-id>/` 的 Pull Request 并关联 Issue。
5. **Maintainer 审核合并**：按 [Benchmark PR 合入标准](#benchmark-pr-合入标准)审核，通过后将 `status` 更新为 `"published"` 并合并入库。

## Benchmark PR 合入标准

- **来源清楚**。附上题目和数据的来源与许可。接入上游基准时，注明版本、纳入的题目范围以及对题目或评分规则所做的改动。
- **任务能跑通**。检查提交范围内所有题目的目录、配置和数据路径，确保符合 RFC-0001 且能正常加载。按文档准备依赖与运行环境后，用代表性题目走完加载、执行和评分流程。
- **评分能区分好坏**。评分规则对应题目要求。用达标样例（如参考解）和不达标样例（如空输出或错误结果）核对给分是否符合预期。有训练集和测试集时，说明划分方式并检查是否有题目重叠或答案泄漏。
- **结果可复核**。提供验证用的题目或子集、运行环境、复现命令和评分记录，方便维护者核对验证范围和结果。

## 推荐验证指导与参考样例

- **推荐验证模型与指标**：完成 Benchmark 整理后，推荐使用 **DeepSeek Flash** 模型重复运行 $k = 3$ 次来验证题目是否可解、评分器是否稳定且具备区分度，可选报告 **`pass@k`**。
- **记录模型版本号**：若一并提交基线验证结果，使用 `deepseek-flash` 这类模型时必须在 `model_name` 中注明具体版本号（例如 `deepseek-flash-1017`）。
- **参考样例**：
  - 通用评测基准样例：[`penguinharness-benchmark-sec-a`](https://github.com/Prism-Shadow/penguin-harness-benchmark/tree/main/packages/penguinharness-benchmark-sec-a)（Data Analysis Bench 子集）至 [`penguinharness-benchmark-sec-e`](https://github.com/Prism-Shadow/penguin-harness-benchmark/tree/main/packages/penguinharness-benchmark-sec-e)（Terminal-Bench 子集）。
  - 自进化训练/测试配对样例：`GDPevo-essential` 的训练包 [`penguinharness-benchmark-gdpevo-crm-train`](https://github.com/Prism-Shadow/penguin-harness-benchmark/tree/main/packages/penguinharness-benchmark-gdpevo-crm-train) 与测试包 [`penguinharness-benchmark-gdpevo-crm-test`](https://github.com/Prism-Shadow/penguin-harness-benchmark/tree/main/packages/penguinharness-benchmark-gdpevo-crm-test)。

## 格式示例

### 1. Issue 示例

**标题**：`[Benchmark] Add <benchmark-id>: <Benchmark 名称>`

```markdown
### Benchmark 简介
- **Benchmark ID**: `<benchmark-id>`
- **上游来源 / 论文**: <链接>
- **题目数量**: <N> 道题
- **评测方式**: Harbor Docker 沙箱 / Rubric 评分

### 整理计划
- [ ] 整理 `packages/<benchmark-id>/benchmark_config.toml` 与各题 `<task-id>/`
- [ ] 如包含大体积原始任务数据，将其整理至独立外部数据仓库，可自行创建或联系社区委员会创建
- [ ] 使用 `deepseek-flash-1017` 验证题目可正常执行并完成计分
```

### 2. Issue 评论占坑示例（可选）

```markdown
我来认领这个 Benchmark 的整理工作，预计在 YYYY-MM-DD 前提交 PR。
```

### 3. PR 示例

**标题**：`feat(benchmark): add <benchmark-id>`

```markdown
Closes #<issue-number>

### 变更内容
- 新增 `packages/<benchmark-id>/`，包含 `benchmark_config.toml` 及 <N> 道题目的 `statement/`、`rubric/` 和 `task_config.toml`
- （可选）原始任务数据仓库：<外部数据仓库链接及固定 Commit>

### 自查清单
- [x] 目录结构与字段符合 RFC-0001 Benchmark 规范
- [x] `benchmark_config.toml` 中 `status` 已设为 `"draft"`
- [x] 已使用 `deepseek-flash-1017` 验证题目可正常执行并完成评分
```
