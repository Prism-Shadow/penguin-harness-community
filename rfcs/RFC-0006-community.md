# RFC-0006 Community Task Board, Committee, and Incentive Mechanism

- Feature Name: `community`
- Start Date: 2026-11-10
- RFC PR: N/A
- Updated by: N/A

[中文版](RFC-0006-community.zh.md)

To foster open collaboration across Recursive Self-Improvement (RSI) benchmarks, algorithm reproductions, and harness plugins, Shared RSI Community establishes an Issue-Template-driven **Task Board** automated by `rsi_community_steward`, the **RSI Community Committee**, and a **Monthly Contributor Reward Pool**.

## 1. Issue-Driven Task Publishing, Claiming, and Sync Workflow

Every community task follows an **Issue-first** workflow registered in `community/tasks.yaml` of [penguin-harness-community](https://github.com/Prism-Shadow/penguin-harness-community) and rendered on `/quests/`.

<figure class="flowchart"><svg class="flowchart-svg" viewBox="0 0 640 120" role="img" aria-labelledby="rfc-0006-en-title"><title id="rfc-0006-en-title">Issue-Driven Task Publishing, Claiming, and Settlement Flow</title><defs><marker id="rfc-0006-en-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10Z" class="fc-arrowhead"/></marker></defs><rect x="14" y="14" width="612" height="92" rx="10" class="fc-stage-primary"/><text x="28" y="34" class="fc-stage-title">Issue-Driven Workflow (Committee Publishes · Max 2 Active Claims per User)</text><rect x="28" y="46" width="176" height="46" rx="6" class="fc-process"/><text x="116" y="74" class="fc-title" text-anchor="middle">1. Committee Opens Issue</text><path d="M204 69H232" class="fc-edge" marker-end="url(#rfc-0006-en-arrow)"/><rect x="232" y="46" width="176" height="46" rx="6" class="fc-process"/><text x="320" y="74" class="fc-title" text-anchor="middle">2. Reply /claim on Issue</text><path d="M408 69H436" class="fc-edge" marker-end="url(#rfc-0006-en-arrow)"/><rect x="436" y="46" width="176" height="46" rx="6" class="fc-process"/><text x="524" y="74" class="fc-title" text-anchor="middle">3. Merge PR &amp; 1:1 EXP</text></svg></figure>

### 1.1 Domain Groups and Progress Columns

The task board is grouped vertically by four domains, each containing three equal-width progress columns:

- **Four Domain Groups**:
  1. **Benchmark**: Standard benchmark integrations (e.g., Integrate SWE-bench [#30](https://github.com/Prism-Shadow/penguin-harness-community/issues/30), Integrate FDE-gym [#31](https://github.com/Prism-Shadow/penguin-harness-community/issues/31)).
  2. **Evaluation**: Cross-harness and frontier model evolution evaluations (e.g., Codex Self-Evolution Comparison [#32](https://github.com/Prism-Shadow/penguin-harness-community/issues/32), GPT-6 Evolution Capability Experiment [#33](https://github.com/Prism-Shadow/penguin-harness-community/issues/33)).
  3. **RSI Algorithm**: Core RSI paper reproductions and integrations (e.g., Integrate RSIAgent Method [#34](https://github.com/Prism-Shadow/penguin-harness-community/issues/34), Integrate RRSI Method [#35](https://github.com/Prism-Shadow/penguin-harness-community/issues/35)).
  4. **PenguinHarness**: Core harness and plugin development (e.g., Develop Knowledge Base Plugin [#36](https://github.com/Prism-Shadow/penguin-harness-community/issues/36), Develop Ontology Plugin [#37](https://github.com/Prism-Shadow/penguin-harness-community/issues/37)).
- **Three Equal-Width Progress Columns**: `Open (open)` $\rightarrow$ `In Progress (in_progress)` $\rightarrow$ `Completed (completed)`.
- **Task EXP and Details**: Each standard task awards **50 EXP**. Board cards display only the title, prominent `+50 EXP` badge, and claim status; clicking a card opens a detail modal with the full description and plain URLs to original papers and repositories.

### 1.2 Publishing, Bilingual Fallback, and Claiming Rules

1. **Committee-Only Publishing & Issue Template (`.github/ISSUE_TEMPLATE/task.yml`)**: Only **RSI Community Committee** members may publish tasks. Clicking "Propose Task" opens the structured GitHub Issue form (`task.yml`), which uses English as the default language and separates English and Chinese title/description fields. If either language is left blank, the automated steward agent and frontend automatically fall back to the other language.
2. **Claiming Tasks**: Contributors reply `/claim` in the comments under the task's GitHub Issue (`#30`–`#37`). The steward agent verifies eligibility and updates the task's assignee and status.
3. **Concurrent Claim Limit**: Each GitHub user may hold at most **2** `in_progress` tasks concurrently; claims inactive for 14 days are automatically released back to `open`.

## 2. RSI Community Committee

The RSI Community Committee oversees project maintenance, task proposals, and experimental reviews. It is organized into three groups (displayed on `/people/`):

| Group | Members | Tracks |
| --- | --- | --- |
| **Project Leadership** | `Yaowei Zheng` | `Benchmark`, `Algorithm`, `Harness` |
| **Proposal Group** | `Xiang Qu`, `Zhihao Liu` | `Algorithm` (Xiang Qu), `Benchmark` (Zhihao Liu) |
| **Review Group** | `Leijun Zhou`, `Zhihao Liu`, `Yangxi Xiang` | `Algorithm` (Leijun Zhou), `Benchmark` (Zhihao Liu), `Harness` (Yangxi Xiang) |

- **Expanding Domain Tracks**: Beyond `Benchmark`, `Algorithm`, and `Harness`, the committee is expanding into vertical domains such as `Medicine` and `Telecom`.
- **Fixed Monthly Incentive & Application**: Each committee member receives a fixed **¥1,000 RMB / month** incentive (issued in Token credits and compute vouchers). Researchers and engineers can apply to join via the **community WeChat group**.

## 3. Contributor Leaderboard & Monthly Reward Rules

The `/people/` page features both the **Monthly Leaderboard** and **All-Time Leaderboard**, sorted by EXP. In addition to committee stipends, the community allocates up to **¥10,000 RMB / month** (in Token credits and compute vouchers) for contributor rewards, settled at the end of each month:

| Allocation Tier | Rate / Bonus | Rule & Formula |
| --- | --- | --- |
| **1. 1:1 EXP Reward** | **1 EXP = ¥1 RMB** | Every 1 EXP earned converts 1:1 into ¥1 RMB of credits (e.g., completing a 50 EXP task awards ¥50 RMB directly), avoiding over-allocation when few participants are active:$$\text{Base Reward} = \text{Individual Monthly EXP} \times ¥1\text{ RMB}$$ |
| **2. Monthly Top-5 Bonus** | **¥800 / ¥400 / ¥200 / ¥100 / ¥50** | Extra tiered bonus for the Top 5 contributors on the monthly leaderboard: **#1 +¥800**, **#2 +¥400**, **#3 +¥200**, **#4 +¥100**, **#5 +¥50**. |
