# Submit Algorithm

[中文版](algorithm.zh.md)

- Where to submit: Open built-in plugin code PRs in [PenguinHarness](https://github.com/Prism-Shadow/penguin-harness). For a third-party plugin, publish it first, then submit an entry using the [plugin index submission guide](https://github.com/Prism-Shadow/penguin-harness-plugins/blob/main/CONTRIBUTING.md).
- Plugin format: [PenguinHarness plugin documentation](https://github.com/Prism-Shadow/penguin-harness/blob/main/packages/docs/content/plugins.en.md)

## Submission Workflow

1. **Check the Plugin Format**: Follow the plugin documentation for the target PenguinHarness version and the [decoupling principle in RFC-0003](../rfcs/RFC-0003-plugin.md#design-principle-decoupling-algorithm-from-data).
2. **Find or Open an Issue**: Look for an existing task or open an Issue in the relevant project repository. Describe the RSI algorithm, paper reference, and planned plugin components.
3. **Claim in Issue Comments (Optional)**: Leave a comment on the Issue to claim the plugin implementation (claiming is optional and prevents duplicate effort on the same algorithm).
4. **Submit a PR**: Implement and test the plugin, then open a PR in the appropriate repository and link the related Issue.
5. **Maintainer Review & Merge**: Merge the PR once it meets all [algorithm PR merge criteria](#algorithm-pr-merge-criteria).

## Algorithm PR Merge Criteria

- **Reproduce the original method**: Link to the paper or upstream implementation and identify the code or Skills for its key steps. Explain any differences. If the plugin changes a core mechanism, label it as a variant.
- **Runnable plugin.** Follow the format for the target PenguinHarness version and keep the algorithm independent of any hardcoded benchmark dataset. After installing the plugin as documented, run the algorithm with the provided example, such as Quick Start.
- **Measured improvement.** Compare the plugin in this PR against a baseline on suitable real tasks. Use the same test tasks and grading rules and report at least one improvement, such as a higher score on the same budget or fewer tokens or a shorter runtime at a comparable score. State the comparison conditions and which phases the budget covers. If there is a training or evolution phase, report its overhead separately from the test phase.
- **Verifiable results.** List the test tasks, key settings, and reproduction commands. If you used a subset, explain what it covers and how you selected it. Provide structured run records for both the baseline and the plugin. You can link to an Evaluation PR or another accessible record.

## Recommended Verification Setup

- **Recommended model and dataset.** After implementing the plugin, we recommend using **DeepSeek Flash** with its explicit version suffix (e.g., `deepseek-flash-1017`) on **[GDPevo](https://arxiv.org/pdf/2608.03764) (`GDPevo-essential`)**. Train on each task group's `*-train` split, evaluate on its paired `*-test` split, and average across task groups to compare with the baseline.
- Before submitting, you can ask your Agent to use the [penguin-plugin skill](https://github.com/Prism-Shadow/penguin-harness/blob/main/plugins/agent-development/skills/penguin-plugin/SKILL.md) to check the plugin structure, run relevant tests, and identify the target repository.

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
- [ ] Package the plugin for the target PenguinHarness version and provide a runnable example
- [ ] Compare against a baseline on a task suited to the method (e.g., use `deepseek-flash-1017` on `GDPevo-essential`)
```

### 2. Issue Claim Comment Example (Optional)

```markdown
I would like to claim this RSI algorithm plugin and plan to submit a PR by YYYY-MM-DD.
```

### 3. PR Example

This example is for a plugin implementation PR. For an index entry, follow the plugin index submission guide above.

**Title**: `feat(plugin): add <plugin-id>`

```markdown
Closes <full Issue URL, if applicable>

### Summary
- Added `<plugin-id>/` implementing <RSI Algorithm Name> (decoupled from specific datasets)
- **Method mapping**: <paper or upstream link> → <core mechanisms and implementation paths>; <deviations, if any>
- Provided installation instructions and an example that runs the plugin

### Verification
- **Test conditions**: <tasks or subset and selection criteria, model version or hardware, comparison budget and phases covered>
- **Measured results**: <metric and unit>: <baseline configuration and result> → <result with the plugin>; <training or evolution overhead and test overhead separately, if applicable>
- **Reproduction and records**: <commands>; <links or paths to baseline and plugin run records>

### Checklist
- [x] The plugin follows the format for the target PenguinHarness version and the algorithm is decoupled from data
- [x] Installed the plugin and ran the example in the target PenguinHarness version
- [x] Measured and documented an improvement over the baseline under comparable conditions
```
