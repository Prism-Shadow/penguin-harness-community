# RFC-0006 Quests

- Feature Name: `quests`
- Start Date: 2026-11-10
- RFC PR: [#29](https://github.com/Prism-Shadow/penguin-harness-community/pull/29)
- Updated by: N/A

[中文版](RFC-0006-quests.zh.md)

To coordinate open collaboration across Recursive Self-Improvement (RSI) benchmarks, cross-harness evaluations, algorithm reproductions, and harness plugins, Shared RSI Community specifies an Issue-Template-driven **Task Board (Quests)** automated by `rsi_community_steward`.

## 1. Task Publishing Authority & Validity

- **Only Committee-Published Tasks Are Recognized**: The community **only recognizes tasks published by members of the [RSI Community Committee](RFC-0007-people.md)**. Task issues opened directly by non-committee users are **not recognized**, are ignored by the automated steward agent, do not appear on the Task Board, and do not count toward EXP or monthly contributor rewards.
- **Proposing Task Ideas**: Community members who wish to suggest a new task may share their proposal with the Committee's Proposal Group in the community WeChat group or during the bi-weekly meeting; once approved, a committee member will publish the official task issue.

<figure class="flowchart"><svg class="flowchart-svg" viewBox="0 0 640 120" role="img" aria-labelledby="rfc-0006-en-title"><title id="rfc-0006-en-title">Issue-Driven Task Publishing, Claiming, and Settlement Flow</title><defs><marker id="rfc-0006-en-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10Z" class="fc-arrowhead"/></marker></defs><rect x="14" y="14" width="612" height="92" rx="10" class="fc-stage-primary"/><text x="28" y="34" class="fc-stage-title">Task Board Workflow (Committee-Published Tasks Only · Max 2 Active Claims/User)</text><rect x="28" y="46" width="176" height="46" rx="6" class="fc-process"/><text x="116" y="74" class="fc-title" text-anchor="middle">1. Committee Opens Issue</text><path d="M204 69H232" class="fc-edge" marker-end="url(#rfc-0006-en-arrow)"/><rect x="232" y="46" width="176" height="46" rx="6" class="fc-process"/><text x="320" y="74" class="fc-title" text-anchor="middle">2. Reply /claim on Issue</text><path d="M408 69H436" class="fc-edge" marker-end="url(#rfc-0006-en-arrow)"/><rect x="436" y="46" width="176" height="46" rx="6" class="fc-process"/><text x="524" y="74" class="fc-title" text-anchor="middle">3. Merge PR &amp; Award EXP</text></svg></figure>

## 2. Domain Groups & Progress Columns

All recognized tasks are indexed in `community/tasks.yaml` of [penguin-harness-community](https://github.com/Prism-Shadow/penguin-harness-community) and rendered on `/quests/` across four domain sections, each containing three equal-width progress columns:

- **Four Domain Groups (`Domain`)**:
  1. `Benchmark`: Standardized benchmark integrations (following [RFC-0001](RFC-0001-benchmark.md), e.g., Integrate SWE-bench [#30](https://github.com/Prism-Shadow/penguin-harness-community/issues/30), Integrate FDE-gym [#31](https://github.com/Prism-Shadow/penguin-harness-community/issues/31)).
  2. `Evaluation`: Cross-harness and frontier base-model self-evolution evaluations (following [RFC-0002](RFC-0002-evaluation.md), e.g., Codex Self-Evolution Comparison [#32](https://github.com/Prism-Shadow/penguin-harness-community/issues/32), GPT-6 Evolution Capability Experiment [#33](https://github.com/Prism-Shadow/penguin-harness-community/issues/33)).
  3. `RSI Algorithm`: Core RSI paper reproductions and plugin integrations (following [RFC-0003](RFC-0003-plugin.md), e.g., Integrate RSIAgent Method [#34](https://github.com/Prism-Shadow/penguin-harness-community/issues/34), Integrate RRSI Method [#35](https://github.com/Prism-Shadow/penguin-harness-community/issues/35)).
  4. `PenguinHarness`: Core harness and plugin development (following [RFC-0003](RFC-0003-plugin.md), e.g., Develop Knowledge Base Plugin [#36](https://github.com/Prism-Shadow/penguin-harness-community/issues/36), Develop Ontology Plugin [#37](https://github.com/Prism-Shadow/penguin-harness-community/issues/37)).
- **Three Equal-Width Progress Columns**: `Open (open)` $\rightarrow$ `In Progress (in_progress)` $\rightarrow$ `Completed (completed)`.
- **Cards & Detail Modal**: Each standard task awards **50 EXP**. Board cards show only the title, prominent `+50 EXP` badge, and claim status; clicking a card opens a modal showing the full task description, target repository, related issue, and plain URLs to original papers and repositories.

## 3. Standard GitHub Issue Format Specification

Committee members publish tasks using `.github/ISSUE_TEMPLATE/task.yml`. Every valid task issue must conform to the following title, label, and body format:

### 3.1 Issue Title & Labels

- **Issue Title**: Must start with `[Task] ` followed by the English task title (English is the default language), for example:
  ```text
  [Task] Integrate SWE-bench
  ```
- **Issue Labels**: Must include the `task` label.

### 3.2 Issue Body Structure (Matching `.github/ISSUE_TEMPLATE/task.yml`)

GitHub Issue Forms renders the template into 9 level-3 Markdown headings (`###`):

```markdown
### Domain

Benchmark

### EXP

50

### Target Repository

https://github.com/Prism-Shadow/penguin-harness-benchmark

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

### 3.3 Field Parsing & Single-Language Fallback Rules

| Section Heading (`###`) | Requirement | Format & Fallback Behavior |
| --- | --- | --- |
| `### Domain` | Required | One of `Benchmark`, `Evaluation`, `RSI Algorithm`, or `PenguinHarness`. |
| `### EXP` | Required | Positive integer (default `50`) specifying the experience points awarded upon completion. |
| `### Target Repository` | Required | Target repository URL where the Pull Request must be submitted; must be one of the four official repositories:<br>1. `https://github.com/Prism-Shadow/penguin-harness`<br>2. `https://github.com/Prism-Shadow/penguin-harness-community`<br>3. `https://github.com/Prism-Shadow/penguin-harness-benchmark`<br>4. `https://github.com/Prism-Shadow/penguin-harness-plugins` |
| `### Related Issue` | Optional | Optional related GitHub Issue plain URL (`_No response_` if none). |
| `### Title (English)` | Either EN or ZH required | Task title in English (default language). If blank or `_No response_`, automatically falls back to `### Title (Chinese)`. |
| `### Title (Chinese)` | Either EN or ZH required | Task title in Chinese. If blank or `_No response_`, automatically falls back to `### Title (English)`. |
| `### Description (English)` | Either EN or ZH required | Task description and acceptance criteria in English. If blank or `_No response_`, automatically falls back to `### Description (Chinese)`. |
| `### Description (Chinese)` | Either EN or ZH required | Task description and acceptance criteria in Chinese. If blank or `_No response_`, automatically falls back to `### Description (English)`. |
| `### Original Papers & Repository Links` | Optional | External reference papers or upstream code repositories — one plain `http://` or `https://` URL per line (no custom titles). |

## 4. Claiming, Concurrency Limit & Completion Workflow

1. **Claiming via Comment (`/claim`)**: Contributors claim an open task by replying `/claim` under its official GitHub Issue. Once verified by `rsi_community_steward`, the task moves to `in_progress` and records the contributor's GitHub handle.
2. **Concurrent Claim Limit**: Each GitHub user may hold at most **2** `in_progress` tasks at the same time; additional `/claim` requests beyond 2 are ignored. Claims with no progress for 14 consecutive days (or released via `/unclaim`) automatically return to `open`.
3. **PR Review & EXP Settlement**: After completing the work, the contributor opens a Pull Request in the repository specified by `### Target Repository` linking the task issue (e.g., `Closes Prism-Shadow/penguin-harness-community#30`). Once reviewed and merged by the Committee's Review Group, the task transitions to `completed` and its EXP is credited to the contributor on the Monthly and All-Time Leaderboards (see [RFC-0007 People & Rewards](RFC-0007-people.md)).
