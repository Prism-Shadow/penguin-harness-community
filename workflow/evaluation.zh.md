# 提交 Evaluation

[English](evaluation.md)

- 目标仓库：[PenguinHarness Benchmark](https://github.com/Prism-Shadow/penguin-harness-benchmark)
- 标准格式：[RFC-0002 Evaluation](../rfcs/RFC-0002-evaluation.zh.md)

## 提交流程

1. **学习 RFC 数据结构**：先阅读 [RFC-0002 Evaluation](../rfcs/RFC-0002-evaluation.zh.md)，了解 `experiments/<experiment-id>/` 下 `meta_info.yaml` 以及各实验阶段（`train-<n>/`、`val-<n>/`、`test/`，其中 `train` 和 `val` 后必须跟数字，`test` 后一定不能跟数字）中 `summary.yaml` 和 `attempt-<n>.yaml` 的字段规范。
2. **提出 Issue**：在 [PenguinHarness Benchmark Issues](https://github.com/Prism-Shadow/penguin-harness-benchmark/issues) 中创建 Issue，说明计划评测的 Benchmark、基座模型、Harness 与 RSI 算法组合。
3. **Issue 评论区占坑（可选）**：在 Issue 评论区留言认领该组实验（占坑是可选步骤，主要用于防止多人跑完全相同的实验配置撞车）。
4. **提交 PR**：完成评测实验后，按 `RFC-0002` 整理好 `experiments/<experiment-id>/` 下的 `meta_info.yaml`（`status` 设为 `"draft"`）、各阶段 `summary.yaml` 与 `attempt-<n>.yaml`，提交 Pull Request。
5. **Maintainer 审核合并**：等待 Maintainer 审核实验配置、分数统计与计费数据；审核通过后将 `status` 更新为 `"published"` 并合并入库。

## 推荐实验指导与例子

- **自进化（RSI）算法推荐配置**：对于自进化算法的评估，推荐使用 **DeepSeek Flash** 模型配合 **[GDPevo](https://arxiv.org/pdf/2608.03764)（`GDPevo-essential`）** 数据集进行实验：
  - `GDPevo-essential` 分为六个领域的任务组（Task Group）：`crm`、`erp`、`finance`、`healthcare`、`legal`、`data-analysis`。
  - 先在各自任务组的训练集（如 `penguinharness-benchmark-gdpevo-crm-train`）上训练自进化，再在对应的测试集（如 `penguinharness-benchmark-gdpevo-crm-test`）上评估，最后对所有任务组的测试结果取平均。
- **通用 Benchmark 推荐配置**：对于常规 Benchmark（如 `penguinharness-benchmark-sec-a` 至 `sec-e`），推荐使用 **DeepSeek Flash** 模型运行 3 次重复实验（`n_attempt: 3`），同时记录 `score_mean`、`score_std` 与 `pass@k`。
- **模型版本号要求**：若使用 `deepseek-flash` 这类模型，必须在 `meta_info.yaml` 的 `model_name` 字段中写明具体版本号，例如填写 `deepseek-flash-1017`。

## 格式示例

### 1. Issue 示例

**标题**：`[Evaluation] <experiment-id>: deepseek-flash-1017 + <Algorithm> on GDPevo-essential`

```markdown
### 实验配置
- **Experiment ID**: `<experiment-id>`
- **Harness**: `PenguinHarness` (`v0.2.16`)
- **Model**: `deepseek/deepseek-flash-1017` (`thinking_level: high`)
- **RSI Algorithm**: `<plugin-id>`（或无）
- **训练集 / 验证集**: `GDPevo-essential` 各任务组 `*-train`（如 `penguinharness-benchmark-gdpevo-crm-train`）
- **测试集**: `GDPevo-essential` 各任务组 `*-test`（如 `penguinharness-benchmark-gdpevo-crm-test`）
```

### 2. Issue 评论占坑示例（可选）

```markdown
我来认领这组评测实验，预计在 YYYY-MM-DD 前跑完并提交结果 PR。
```

### 3. PR 示例

**标题**：`feat(evaluation): add <experiment-id>`

```markdown
Closes #<issue-number>

### 实验结果摘要
- **Experiment ID**: `<experiment-id>`
- **Model**: `deepseek/deepseek-flash-1017`
- **测试集 (`test`) 平均分**: `<score_mean> ± <score_std>`，`pass@k`: `<pass@k>`（`n_attempt: 3`）
- **单次实验成本 / 耗时**: `$<cost>` / `<duration_ms> ms`

### 自查清单
- [x] 目录结构与 YAML 字段符合 RFC-0002 Evaluation 规范
- [x] `train-<n>` / `val-<n>` 后均跟数字，包含 `test/` 测试阶段（后不跟数字），且 `meta_info.yaml` 中 `status` 已设为 `"draft"`
- [x] `model_name` 已包含具体版本号（如 `deepseek-flash-1017`），费用成本已按 MMSP 模型目录价核算
```
