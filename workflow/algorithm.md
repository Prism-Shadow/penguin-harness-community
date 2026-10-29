# Submit Algorithm

[中文版](algorithm.zh.md)

- Target Repository: [PenguinHarness Plugins](https://github.com/Prism-Shadow/penguin-harness-plugins)
- Specification: [RFC-0003 Plugin](../rfcs/RFC-0003-plugin.md)

## Submission Workflow

1. **Learn the RFC File Structure**: Read [RFC-0003 Plugin](../rfcs/RFC-0003-plugin.md) to understand the standard NPM plugin package structure (`skills/`, `hooks/`, `workbenches/`, `icon.svg`) and the `penguin` metadata fields in `package.json`.
2. **Open an Issue**: Search or open an Issue in [PenguinHarness Plugins Issues](https://github.com/Prism-Shadow/penguin-harness-plugins/issues) describing the RSI algorithm, paper reference, and planned plugin components.
3. **Claim in Issue Comments (Optional)**: Leave a comment on the Issue to claim the plugin implementation (claiming is optional and prevents duplicate effort on the same algorithm).
4. **Submit a PR**: Implement and test the plugin according to `RFC-0003`, then open a Pull Request linked to the Issue.
5. **Maintainer Review & Merge**: Wait for a maintainer to review the package structure, `package.json` manifest, and functionality; once approved, the PR is merged.

## Format Examples

### 1. Issue Example

**Title**: `[Plugin] Add <plugin-id>: <RSI Algorithm Name>`

```markdown
### Plugin Overview
- **Plugin ID**: `<plugin-id>`
- **Paper / Method**: <Paper Title & URL>
- **Components**: `skills/` / `hooks/` / `workbenches/`

### Plan
- [ ] Implement `<plugin-id>/skills/<skill-id>/SKILL.md`
- [ ] Configure `<plugin-id>/package.json` (including `penguin` metadata and `quick_start`)
- [ ] Verify reproduction on a demo task or Benchmark
```

### 2. Issue Claim Comment Example (Optional)

```markdown
I would like to claim this RSI algorithm plugin and plan to submit a PR by YYYY-MM-DD.
```

### 3. PR Example

**Title**: `feat(plugin): add <plugin-id>`

```markdown
Closes #<issue-number>

### Summary
- Added `<plugin-id>/` implementing <RSI Algorithm Name>
- Configured `penguin` metadata in `package.json` (`category: "rsi"`, `preinstall: false`, `quick_start`)

### Checklist
- [x] Package layout and `package.json` fields conform to RFC-0003 Plugin
- [x] Installed locally in PenguinHarness and verified via `quick_start`
```
