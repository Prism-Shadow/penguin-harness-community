# 提交 Algorithm

[English](algorithm.md)

- 目标仓库：[PenguinHarness Plugins](https://github.com/Prism-Shadow/penguin-harness-plugins)
- 标准格式：[RFC-0003 Plugin](../rfcs/RFC-0003-plugin.zh.md)

## 提交流程

1. **学习 RFC 文件结构**：先阅读 [RFC-0003 Plugin](../rfcs/RFC-0003-plugin.zh.md)，了解标准 NPM 插件包目录结构（`skills/`、`hooks/`、`workbenches/`、`icon.svg`）、算法与数据解耦原则，以及 `package.json` 中 `penguin` 扩展字段（含给出算法快速调用案例的 `quick_start`）的规范。
2. **提出 Issue**：在 [PenguinHarness Plugins Issues](https://github.com/Prism-Shadow/penguin-harness-plugins/issues) 中搜索或新建 Issue，说明计划实现或复现的 RSI 算法、论文来源与插件组件构成。
3. **Issue 评论区占坑（可选）**：在 Issue 评论区留言认领（占坑是可选步骤，主要用于防止多人同时开发同一个 RSI 算法插件撞车）。
4. **提交 PR**：按 `RFC-0003` 完成插件开发与效果测试后，向仓库提交 Pull Request 并关联 Issue。
5. **Maintainer 审核合并**：等待 Maintainer 审核插件目录结构、`package.json` 配置及功能完整性；审核通过后合并入库。

## 实现与测试指导

- **算法与数据解耦**：Plugin 的实现应只包含通用的 RSI 算法方法部分，不要与具体的 Benchmark 数据集绑定，以便插件能够直接迁移到不同 Benchmark 上运行。
- **完善 `quick_start` 快速调用案例**：在 `package.json` 的 `penguin.quick_start` 中提供一个清晰、可直接运行的算法快速调用示例提示词与默认挂载的 `skills`。
- **推荐效果验证配置**：完成插件实现后，推荐使用 **DeepSeek Flash** 模型（注明具体版本号，如 `deepseek-flash-1017`）在 **[GDPevo](https://arxiv.org/pdf/2608.03764)（`GDPevo-essential`）** 数据集上进行测试（在各任务组的 `*-train` 上运行自进化，在对应的 `*-test` 上评估并取平均），验证该算法相比基线是否带来稳定的得分提升。

## 格式示例

### 1. Issue 示例

**标题**：`[Plugin] Add <plugin-id>: <RSI 算法名称>`

```markdown
### 算法插件简介
- **Plugin ID**: `<plugin-id>`
- **对应论文 / 方法**: <论文标题与链接>
- **包含组件**: `skills/` / `hooks/` / `workbenches/`

### 开发计划
- [ ] 实现 `<plugin-id>/skills/<skill-id>/SKILL.md`（与具体数据集解耦）
- [ ] 配置 `<plugin-id>/package.json`（含 `penguin` 扩展字段与 `quick_start` 快速调用案例）
- [ ] 使用 `deepseek-flash-1017` 在 `GDPevo-essential` 数据集上测试自进化是否有提升
```

### 2. Issue 评论占坑示例（可选）

```markdown
我来认领该 RSI 算法插件的开发与复现，预计在 YYYY-MM-DD 前提交 PR。
```

### 3. PR 示例

**标题**：`feat(plugin): add <plugin-id>`

```markdown
Closes #<issue-number>

### 变更内容
- 新增 `<plugin-id>/` 插件包，实现 <RSI 算法名称>（算法与具体数据解耦）
- 配置 `package.json` 中的 `penguin` 字段（`category: "rsi"`、`preinstall: false`、`quick_start` 快速调用案例）

### 效果验证
- **测试模型**: `deepseek/deepseek-flash-1017`
- **测试数据集**: `GDPevo-essential`
- **测试集提升**: 基线 `<base_score>` → 自进化后 `<evolved_score>`

### 自查清单
- [x] 插件包结构与 `package.json` 字段符合 RFC-0003 Plugin 规范，且算法实现与数据解耦
- [x] 已在本地 PenguinHarness 中安装并通过 `quick_start` 快速调用案例验证
- [x] 已使用 `deepseek-flash-1017` 在 `GDPevo-essential` 上测试并验证自进化效果
```
