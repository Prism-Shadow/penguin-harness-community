# RFC-0006 Quests

- Feature Name: `quests`
- Start Date: 2026-11-10
- RFC PR: [#29](https://github.com/Prism-Shadow/penguin-harness-community/pull/29)
- Updated by: N/A

[中文版](RFC-0006-quests.zh.md)

To coordinate open collaboration across Recursive Self-Improvement (RSI) benchmarks, cross-harness evaluations, algorithm reproductions, and harness plugins, Shared RSI Community specifies an Issue-Template-driven **Task Board (Quests)** automated by `rsi_community_steward`.

## 1. Task Publishing Authority & Source of Truth

- **Only Committee-Published Tasks Are Recognized**: The community **only recognizes tasks published by members of the [RSI Community Committee](RFC-0007-people.md)**. Task issues opened directly by non-committee users are **not recognized**, are ignored by the automated steward agent, do not appear on the Task Board, and do not count toward EXP or monthly contributor rewards.
- **GitHub Issue as the Single Source of Truth**: Every task — whether `open`, `in_progress`, or `completed` — **must have a corresponding standardized GitHub Issue** in `Prism-Shadow/penguin-harness-community` as its authoritative data source.
- **Proposing Task Ideas**: Community members who wish to suggest a new task may share their proposal with the Committee's Proposal Group in the community WeChat group or during the bi-weekly meeting; once approved, a committee member will publish the official task issue.

<figure class="flowchart"><svg class="flowchart-svg" viewBox="0 0 640 120" role="img" aria-labelledby="rfc-0006-en-title"><title id="rfc-0006-en-title">Issue-Driven Task Publishing, Claiming, and Settlement Flow</title><defs><marker id="rfc-0006-en-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10Z" class="fc-arrowhead"/></marker></defs><rect x="14" y="14" width="612" height="92" rx="10" class="fc-stage-primary"/><text x="28" y="34" class="fc-stage-title">Task Board Workflow (Committee-Published Tasks Only · Max 2 Active Claims/User)</text><rect x="28" y="46" width="176" height="46" rx="6" class="fc-process"/><text x="116" y="74" class="fc-title" text-anchor="middle">1. Open (open)</text><path d="M204 69H232" class="fc-edge" marker-end="url(#rfc-0006-en-arrow)"/><rect x="232" y="46" width="176" height="46" rx="6" class="fc-process"/><text x="320" y="74" class="fc-title" text-anchor="middle">2. In Progress (in_progress)</text><path d="M408 69H436" class="fc-edge" marker-end="url(#rfc-0006-en-arrow)"/><rect x="436" y="46" width="176" height="46" rx="6" class="fc-process"/><text x="524" y="74" class="fc-title" text-anchor="middle">3. Completed (completed)</text></svg></figure>

## 2. Domain Groups, Sorting & Pagination

All recognized tasks are indexed in `community/tasks.yaml` of [penguin-harness-community](https://github.com/Prism-Shadow/penguin-harness-community) and rendered on `/quests/` across four domain sections, each containing three equal-width progress columns:

- **Four Domain Groups (`Domain`)**:
  1. `Benchmark`: Standardized benchmark integrations (following [RFC-0001](RFC-0001-benchmark.md), e.g., Integrate SWE-bench [#30](https://github.com/Prism-Shadow/penguin-harness-community/issues/30), Integrate FDE-gym [#31](https://github.com/Prism-Shadow/penguin-harness-community/issues/31), and completed tasks [#39](https://github.com/Prism-Shadow/penguin-harness-community/issues/39)–[#41](https://github.com/Prism-Shadow/penguin-harness-community/issues/41)).
  2. `Evaluation`: Cross-harness and frontier base-model self-evolution evaluations (following [RFC-0002](RFC-0002-evaluation.md), e.g., Codex Self-Evolution Comparison [#32](https://github.com/Prism-Shadow/penguin-harness-community/issues/32), GPT-6 Evolution Capability Experiment [#33](https://github.com/Prism-Shadow/penguin-harness-community/issues/33), and completed tasks [#42](https://github.com/Prism-Shadow/penguin-harness-community/issues/42)–[#43](https://github.com/Prism-Shadow/penguin-harness-community/issues/43)).
  3. `RSI Algorithm`: Core RSI paper reproductions and plugin integrations (following [RFC-0003](RFC-0003-plugin.md), e.g., Integrate RSIAgent Method [#34](https://github.com/Prism-Shadow/penguin-harness-community/issues/34), Integrate RRSI Method [#35](https://github.com/Prism-Shadow/penguin-harness-community/issues/35)).
  4. `PenguinHarness`: Core harness and plugin development (following [RFC-0003](RFC-0003-plugin.md), e.g., Develop Knowledge Base Plugin [#36](https://github.com/Prism-Shadow/penguin-harness-community/issues/36), Develop Ontology Plugin [#37](https://github.com/Prism-Shadow/penguin-harness-community/issues/37), Optimize Context Compaction [#44](https://github.com/Prism-Shadow/penguin-harness-community/issues/44), and High-Playability Self-Evolution Case Study [#45](https://github.com/Prism-Shadow/penguin-harness-community/issues/45)).
- **Three Equal-Width Progress Columns**: `Open (open)` $\rightarrow$ `In Progress (in_progress)` $\rightarrow$ `Completed (completed)`.
- **Newest-First Ordering & Per-Column Pagination**: Within each domain and progress column, tasks are ordered by timestamp **descending (newest first)** and paginated so individual sections stay compact.
- **Cards & Detail Modal**: Each standard task awards **50 EXP**. Board cards show the title, prominent `+50 EXP` badge, Issue number (plus PR number when applicable), and assignee; clicking a card opens a modal showing the full task description, target repository, task issue, pull request, related issue, and plain URLs to original papers and repositories.

## 3. Standard GitHub Issue Format Specification

Committee members create and maintain task issues using `.github/ISSUE_TEMPLATE/task.yml`. Tasks across all three stages (`open`, `in_progress`, `completed`) share the same 12-section Markdown body schema.

### 3.1 Issue Title, Labels & State

- **Issue Title**: Must start with `[Task] ` followed by the English task title (English is the default language), for example:
  ```text
  [Task] Integrate SWE-bench
  ```
- **Issue Labels**: Must include the `task` label.
- **GitHub Issue State**:
  - `open` and `in_progress` tasks remain **Open** on GitHub.
  - `completed` tasks must be closed as **Closed as completed**.

### 3.2 12-Section Issue Body Structure (Matching `.github/ISSUE_TEMPLATE/task.yml`)

GitHub Issue Forms renders the template into 12 level-3 Markdown headings (`###`):

```markdown
### Domain

Benchmark

### Status

open

### EXP

50

### Target Repository

https://github.com/Prism-Shadow/penguin-harness-benchmark

### Assignee

_No response_

### Pull Request

_No response_

### Related Issue

_No response_

### Title (English)

Integrate SWE-bench

### Title (Chinese)

集成 SWE-bench

### Description (English)

Integrate the SWE-bench software engineering benchmark into `penguin-harness-benchmark` with standardized container environments and grading scripts (per RFC-0001).

### Description (Chinese)

将真实 GitHub 软件工程评测基准 SWE-bench 接入 `penguin-harness-benchmark`，封装标准化容器评测环境与自动评分脚本（遵循 RFC-0001 规范）。

### Original Papers & Repository Links

https://github.com/SWE-bench/SWE-bench
https://arxiv.org/abs/2310.06770
```

### 3.3 Stage-Specific Requirements (`open` / `in_progress` / `completed`)

Every task issue must satisfy the stage-specific requirements for `### Status`, `### Assignee`, `### Pull Request`, and GitHub Issue state shown below:

| Task Stage | GitHub Issue State | `### Status` | `### Assignee` | `### Pull Request` | Live Examples |
| --- | --- | --- | --- | --- | --- |
| **Open (`open`)** | `OPEN` | `open` | `_No response_` | `_No response_` | [#30](https://github.com/Prism-Shadow/penguin-harness-community/issues/30), [#45](https://github.com/Prism-Shadow/penguin-harness-community/issues/45) |
| **In Progress (`in_progress`)** | `OPEN` | `in_progress` | `@<github-handle>` (required, e.g., `@hiyouga`) | Plain URL to the active PR in the target repository (e.g., `https://github.com/Prism-Shadow/penguin-harness/pull/1491`, or `_No response_` if not yet opened) | [#44](https://github.com/Prism-Shadow/penguin-harness-community/issues/44) |
| **Completed (`completed`)** | `CLOSED (completed)` | `completed` | `@<github-handle>` (required, e.g., `@Saigyouji-Yuyuko1000`) | Plain URL to the completed PR in the target repository (required, e.g., `https://github.com/Prism-Shadow/penguin-harness-benchmark/pull/16`) | [#39](https://github.com/Prism-Shadow/penguin-harness-community/issues/39)–[#43](https://github.com/Prism-Shadow/penguin-harness-community/issues/43) |

### 3.4 Field Parsing & Single-Language Fallback Rules

| Section Heading (`###`) | Requirement | Format & Fallback Behavior |
| --- | --- | --- |
| `### Domain` | Required | One of `Benchmark`, `Evaluation`, `RSI Algorithm`, or `PenguinHarness`. |
| `### Status` | Required | One of `open`, `in_progress`, or `completed`. |
| `### EXP` | Required | Positive integer (default `50`) specifying the experience points awarded upon completion. |
| `### Target Repository` | Required | Target repository URL where the Pull Request must be submitted; must be one of the four official repositories:<br>1. `https://github.com/Prism-Shadow/penguin-harness`<br>2. `https://github.com/Prism-Shadow/penguin-harness-community`<br>3. `https://github.com/Prism-Shadow/penguin-harness-benchmark`<br>4. `https://github.com/Prism-Shadow/penguin-harness-plugins` |
| `### Assignee` | Required for `in_progress` & `completed` | Contributor's GitHub handle prefixed with `@` (e.g., `@hiyouga`); `_No response_` when `open`. |
| `### Pull Request` | Required for `completed` | Plain URL to the Pull Request submitted to the target repository; `_No response_` when not yet opened. |
| `### Related Issue` | Optional | Optional related GitHub Issue plain URL (`_No response_` if none). |
| `### Title (English)` | Either EN or ZH required | Task title in English (default language). If blank or `_No response_`, automatically falls back to `### Title (Chinese)`. |
| `### Title (Chinese)` | Either EN or ZH required | Task title in Chinese. If blank or `_No response_`, automatically falls back to `### Title (English)`. |
| `### Description (English)` | Either EN or ZH required | Task description and acceptance criteria in English. If blank or `_No response_`, automatically falls back to `### Description (Chinese)`. |
| `### Description (Chinese)` | Either EN or ZH required | Task description and acceptance criteria in Chinese. If blank or `_No response_`, automatically falls back to `### Description (English)`. |
| `### Original Papers & Repository Links` | Optional | External reference papers or upstream code repositories — one plain `http://` or `https://` URL per line (no custom titles). |

## 4. Claiming, Status Transition Comments & Completion Settlement

1. **Transitioning to `in_progress` (`/claim`)**:
   - Contributors claim an open task by replying `/claim` under its official GitHub Issue (or `/claim @<handle> <pr-url>` if a PR is already open).
   - **Concurrent Claim Limit**: Each GitHub user may hold at most **2** `in_progress` tasks at the same time; additional `/claim` requests beyond 2 are ignored. Claims with no progress for 14 consecutive days (or released via `/unclaim`) automatically return to `open`.
   - Once verified, `rsi_community_steward` updates the Issue body's `### Status` to `in_progress` and `### Assignee` to `@<handle>` (plus `### Pull Request` if provided).
2. **Transitioning to `completed` (`/complete`)**:
   - Once the Pull Request in `### Target Repository` is reviewed and merged by the Committee's Review Group, a standardized completion comment is recorded on the task Issue:
     ```text
     /complete @<github-handle> <pr-url> (+50 EXP)
     ```
   - `rsi_community_steward` (or a committee member) updates the Issue body's `### Status` to `completed`, `### Assignee` to `@<github-handle>`, and `### Pull Request` to `<pr-url>`, and closes the Issue as `completed`.
   - The task's EXP is immediately settled onto the Monthly and All-Time Leaderboards (see [RFC-0007 People & Rewards](RFC-0007-people.md)).
