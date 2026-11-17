# Submit Algorithm

[中文版](algorithm.zh.md)

- Target Repository: [PenguinHarness Plugins](https://github.com/Prism-Shadow/penguin-harness-plugins)
- Specification: [RFC-0003 Plugin](../rfcs/RFC-0003-plugin.md)

## Submission Workflow

1. **Learn the RFC File Structure**: Read [RFC-0003 Plugin](../rfcs/RFC-0003-plugin.md) to understand the standard NPM plugin package structure (`skills/`, `hooks/`, `workbenches/`, `icon.svg`), the algorithm-data decoupling rule, and the `penguin` metadata fields in `package.json` (including `quick_start`, which provides a quick invocation example for the algorithm).
2. **Open an Issue**: Search or open an Issue in [PenguinHarness Plugins Issues](https://github.com/Prism-Shadow/penguin-harness-plugins/issues) describing the RSI algorithm, paper reference, and planned plugin components.
3. **Claim in Issue Comments (Optional)**: Leave a comment on the Issue to claim the plugin implementation (claiming is optional and prevents duplicate effort on the same algorithm).
4. **Submit a PR**: Implement and test the plugin according to `RFC-0003`, then open a Pull Request linked to the Issue.
5. **Maintainer Review & Merge**: Merge the PR once it meets all [algorithm PR merge criteria](#algorithm-pr-merge-criteria).

## Implementation & Testing Guidelines

- **Decouple Algorithm from Data**: Keep the Plugin implementation focused purely on the RSI method itself without binding or hardcoding it to any specific Benchmark dataset.
- **Provide a Clear `quick_start` Invocation Example**: Configure `penguin.quick_start` in `package.json` with a ready-to-run starter prompt and pre-selected `skills` so users can immediately invoke and test the algorithm.
- **Recommended Verification Setup**: After implementing the Plugin, we recommend testing it with the **DeepSeek Flash** model (recording the explicit version suffix such as `deepseek-flash-1017`) on the **[GDPevo](https://arxiv.org/pdf/2608.03764) (`GDPevo-essential`)** dataset (training on each Task Group's `*-train` split, evaluating on its paired `*-test` split, and averaging across Task Groups) to verify whether the algorithm achieves a measurable improvement over the baseline.

## Algorithm PR Merge Criteria

- **Algorithm implementation**: Link to the paper or upstream implementation and identify the code or Skills that implement the key steps. Explain any departures from the original method and label the plugin as a variant if it changes a core mechanism.
- **Installation and use**: The plugin must follow RFC-0003. After following the installation instructions, a reviewer should be able to run the algorithm in PenguinHarness using the `quick_start` example.
- **Measured improvement**: Compare the plugin in this PR against a baseline on a real task suited to the method. Show better task performance at a comparable budget, or higher efficiency at comparable task quality. State the comparison conditions and main trade-offs.
- **Verifiable results**: Specify the task or subset, key settings, and reproduction commands. Provide run records that let reviewers check both the baseline and plugin results.

## Format Examples

### 1. Issue Example

**Title**: `[Plugin] Add <plugin-id>: <RSI Algorithm Name>`

```markdown
### Plugin Overview
- **Plugin ID**: `<plugin-id>`
- **Paper / Method**: <Paper Title & URL>
- **Components**: `skills/` / `hooks/` / `workbenches/`

### Plan
- [ ] Implement `<plugin-id>/skills/<skill-id>/SKILL.md` (decoupled from specific datasets)
- [ ] Configure `<plugin-id>/package.json` (including `penguin` metadata and `quick_start` invocation example)
- [ ] Compare against a baseline on a task suited to the method (e.g., use `deepseek-flash-1017` on `GDPevo-essential`)
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
- Added `<plugin-id>/` implementing <RSI Algorithm Name> (decoupled from specific datasets)
- **Method mapping**: <paper or upstream link> → <core mechanisms and implementation paths>; <deviations, if any>
- Configured `penguin` metadata in `package.json` (`category: "rsi"`, `preinstall: false`, `quick_start` invocation example)

### Verification
- **Test conditions**: <task or subset, relevant model version or hardware, comparison budget>
- **Measured results**: <metric and unit>: <baseline configuration and result> → <result with the plugin>; <main trade-offs, if any>
- **Reproduction and records**: <commands>; <links or paths to baseline and plugin run records>

### Checklist
- [x] Package layout and `package.json` fields conform to RFC-0003 Plugin, with algorithm decoupled from data
- [x] Installed locally in PenguinHarness and verified via the `quick_start` invocation example
- [x] Measured and documented an improvement over the baseline under comparable conditions
```
