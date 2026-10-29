# 提交 Benchmark

[English](benchmark.md)

- 目标仓库：[PenguinHarness Benchmark](https://github.com/Prism-Shadow/penguin-harness-benchmark)
- 标准格式：[RFC-0001 Benchmark](../rfcs/RFC-0001-benchmark.zh.md)

## 提交流程

1. **学习 RFC 文件结构**：先阅读 [RFC-0001 Benchmark](../rfcs/RFC-0001-benchmark.zh.md)，了解 `packages/<benchmark-id>/`、`<task-id>/`（`statement/`、`rubric/`、`task_config.toml`）、`benchmark_config.toml` 以及可选 `data/<benchmark-id>/` 的组织规范。
2. **提出 Issue**：在 [PenguinHarness Benchmark Issues](https://github.com/Prism-Shadow/penguin-harness-benchmark/issues) 中搜索是否已有对应 Benchmark 的 Issue；若没有，则新建一个 Issue 说明要整理的 Benchmark 来源与题目规模。
3. **Issue 评论区占坑（可选）**：在目标 Issue 评论区留言认领（占坑是可选步骤，主要是为了防止多人同时整理同一个 Benchmark 撞车）。
4. **提交 PR**：按 `RFC-0001` 完成 Benchmark 转换与自测（提交时 `benchmark_config.toml` 的 `status` 设为 `"draft"`），提交 Pull Request 并关联 Issue。
5. **Maintainer 审核合并**：等待 Maintainer 审核题目描述、评分标准与配置完整性；审核通过后将 `status` 更新为 `"published"` 并合并入库。

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
- [ ] 整理 `data/<benchmark-id>/` 原始数据（如需要）
- [ ] 验证 Agent 可根据 `statement/README.md` 正常跑通并计分
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
- （可选）新增 `data/<benchmark-id>/` 存放原始任务数据

### 自查清单
- [x] 目录结构与字段符合 RFC-0001 Benchmark 规范
- [x] `benchmark_config.toml` 中 `status` 已设为 `"draft"`
- [x] 已抽样验证题目可正常执行并完成评分
```
