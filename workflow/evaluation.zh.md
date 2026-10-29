# 提交 Evaluation

[English](evaluation.md)

- 目标仓库：[PenguinHarness Benchmark](https://github.com/Prism-Shadow/penguin-harness-benchmark)
- 标准格式：[RFC-0002 Evaluation](../rfcs/RFC-0002-evaluation.zh.md)

## 提交流程

1. **学习 RFC 数据结构**：先阅读 [RFC-0002 Evaluation](../rfcs/RFC-0002-evaluation.zh.md)，了解 `experiments/<experiment-id>/` 下 `meta_info.yaml` 以及各实验阶段（如 `train-1/`、`test/`）中 `summary.yaml` 和 `attempt-<n>.yaml` 的字段规范。
2. **提出 Issue**：在 [PenguinHarness Benchmark Issues](https://github.com/Prism-Shadow/penguin-harness-benchmark/issues) 中创建 Issue，说明计划评测的 Benchmark、基座模型、Harness 与 RSI 算法组合。
3. **Issue 评论区占坑（可选）**：在 Issue 评论区留言认领该组实验（占坑是可选步骤，主要用于防止多人跑完全相同的实验配置撞车）。
4. **提交 PR**：完成评测实验后，按 `RFC-0002` 整理好 `experiments/<experiment-id>/` 下的 `meta_info.yaml`（`status` 设为 `"draft"`）、各阶段 `summary.yaml` 与 `attempt-<n>.yaml`，提交 Pull Request。
5. **Maintainer 审核合并**：等待 Maintainer 审核实验配置、分数统计与计费数据；审核通过后将 `status` 更新为 `"published"` 并合并入库。

## 格式示例

### 1. Issue 示例

**标题**：`[Evaluation] <experiment-id>: <Model> + <Algorithm> on <Benchmark>`

```markdown
### 实验配置
- **Experiment ID**: `<experiment-id>`
- **Harness**: `PenguinHarness` (`v0.2.16`)
- **Model**: `<model_provider>/<model_name>` (`thinking_level: high`)
- **RSI Algorithm**: `<plugin-id>`（或无）
- **训练集 / 验证集**: `<train-benchmark-id>` / `<val-benchmark-id>`
- **测试集**: `<test-benchmark-id>`
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
- **测试集 (`test`) 平均分**: `<score_mean> ± <score_std>`（`n_attempt: <N>`）
- **单次实验成本 / 耗时**: `$<cost>` / `<duration_ms> ms`

### 自查清单
- [x] 目录结构与 YAML 字段符合 RFC-0002 Evaluation 规范
- [x] 包含 `test/` 测试阶段，且 `meta_info.yaml` 中 `status` 已设为 `"draft"`
- [x] 费用成本已按 MMSP 模型目录价核算
```
