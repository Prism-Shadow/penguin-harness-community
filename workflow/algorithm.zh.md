# 提交 Algorithm

[English](algorithm.md)

- 目标仓库：[PenguinHarness Plugins](https://github.com/Prism-Shadow/penguin-harness-plugins)
- 标准格式：[RFC-0003 Plugin](../rfcs/RFC-0003-plugin.zh.md)

## 提交流程

1. **学习 RFC 文件结构**：先阅读 [RFC-0003 Plugin](../rfcs/RFC-0003-plugin.zh.md)，了解标准 NPM 插件包目录结构（`skills/`、`hooks/`、`workbenches/`、`icon.svg`）以及 `package.json` 中 `penguin` 扩展字段的规范。
2. **提出 Issue**：在 [PenguinHarness Plugins Issues](https://github.com/Prism-Shadow/penguin-harness-plugins/issues) 中搜索或新建 Issue，说明计划实现或复现的 RSI 算法、论文来源与插件组件构成。
3. **Issue 评论区占坑（可选）**：在 Issue 评论区留言认领（占坑是可选步骤，主要用于防止多人同时开发同一个 RSI 算法插件撞车）。
4. **提交 PR**：按 `RFC-0003` 完成插件开发与本地验证后，向仓库提交 Pull Request 并关联 Issue。
5. **Maintainer 审核合并**：等待 Maintainer 审核插件目录结构、`package.json` 配置及功能完整性；审核通过后合并入库。

## 格式示例

### 1. Issue 示例

**标题**：`[Plugin] Add <plugin-id>: <RSI 算法名称>`

```markdown
### 算法插件简介
- **Plugin ID**: `<plugin-id>`
- **对应论文 / 方法**: <论文标题与链接>
- **包含组件**: `skills/` / `hooks/` / `workbenches/`

### 开发计划
- [ ] 实现 `<plugin-id>/skills/<skill-id>/SKILL.md`
- [ ] 配置 `<plugin-id>/package.json`（含 `penguin` 扩展字段与 `quick_start`）
- [ ] 在示例任务或 Benchmark 上完成复现验证
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
- 新增 `<plugin-id>/` 插件包，实现 <RSI 算法名称>
- 配置 `package.json` 中的 `penguin` 字段（`category: "rsi"`、`preinstall: false`、`quick_start`）

### 自查清单
- [x] 插件包结构与 `package.json` 字段符合 RFC-0003 Plugin 规范
- [x] 已在本地 PenguinHarness 中安装并通过 `quick_start` 验证
```
