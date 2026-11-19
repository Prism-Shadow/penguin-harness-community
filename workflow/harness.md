# Contribute to PenguinHarness

[中文版](harness.zh.md)

- Target Repository: [PenguinHarness](https://github.com/Prism-Shadow/penguin-harness)
- Community Issues: [for-community Issues](https://github.com/Prism-Shadow/penguin-harness/issues?q=state%3Aopen%20label%3A%22for-community%22)

## Contribution Workflow

1. **Claim or Open an Issue**: Browse open Issues labeled `for-community` in the PenguinHarness repository ([view `for-community` Issues](https://github.com/Prism-Shadow/penguin-harness/issues?q=state%3Aopen%20label%3A%22for-community%22)), or open a new Issue under this topic for a feature request or bug fix.
2. **Claim in Issue Comments (Optional)**: Leave a comment on the Issue to claim the task (claiming is optional and primarily prevents duplicate work).
3. **Submit a PR**: Implement the change, run tests and checks, and open a Pull Request in [PenguinHarness](https://github.com/Prism-Shadow/penguin-harness) linked to the Issue.
4. **Maintainer Review & Merge**: Maintainers review the PR against the [PenguinHarness PR merge criteria](#penguinharness-pr-merge-criteria) before merging.

Before submitting a plugin, ask your Agent in a PenguinHarness session to use the [penguin-plugin skill](https://github.com/Prism-Shadow/penguin-harness/blob/main/plugins/agent-development/skills/penguin-plugin/SKILL.md) to check the plugin structure, run the relevant tests, and tell you where to open the PR.

## PenguinHarness PR Merge Criteria

- **Clear scope.** Keep each PR focused on one change. Explain the problem it solves and what users will see. Include the full issue URL when applicable.
- **Complete verification records.** Record the checks you ran and their results. For a fix, give the reproduction steps and how you verified it. For a feature, explain how to verify it and include relevant tests. Required CI checks should pass.
- **Docs and changelog.** Add matching English and Chinese changelog entries. Update documentation for changes to usage, interfaces, or configuration, and explain any migration steps.

Write the PR title and description in English and follow the [PenguinHarness PR template](https://github.com/Prism-Shadow/penguin-harness/blob/main/.github/PULL_REQUEST_TEMPLATE.md).

## Format Examples

### 1. Issue Example

**Title**: `[Feature / Fix] <Short description of the feature or bug fix>`

```markdown
### Background & Goal
- Describe the problem to solve or the feature to add in PenguinHarness

### Proposed Approach
- Outline the modules to update and the implementation plan
```

### 2. Issue Claim Comment Example (Optional)

```markdown
I would like to work on this Issue and plan to submit a PR by YYYY-MM-DD.
```

### 3. PR Example

**Title**: `feat: <short description>` (or `fix: <short description>`)

```markdown
## What this changes
<Describe the change and why it is needed.>
Closes <full Issue URL, if applicable>

## Verification
<List the checks or reproduction steps you ran and their results.>
```
