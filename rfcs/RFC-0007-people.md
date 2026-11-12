# RFC-0007 People & Rewards

- Feature Name: `people`
- Start Date: 2026-11-11
- RFC PR: [#29](https://github.com/Prism-Shadow/penguin-harness-community/pull/29)
- Updated by: N/A

[中文版](RFC-0007-people.zh.md)

To sustain high-quality open collaboration and reward contributors, Shared RSI Community establishes the **RSI Community Committee** and the **Monthly Contributor Incentive Mechanism**, presented on the `/people/` page.

## 1. RSI Community Committee

To build an internationally recognized Agent-native and RSI-native open community like Hugging Face, we established the **RSI Community Committee** (current members are listed on the `/people/` page) with two primary responsibilities:
1. **Publishing and reviewing research topics to ensure quality**: Publishing official research tasks on the [RFC-0006 Task Board (`/quests/`)](/quests/) (only tasks published by committee members are recognized) and reviewing submitted PRs and experimental results.
2. **Exploring community governance and connecting external resources**: Refining community mechanisms, connecting external resources, and inviting more collaborators.

### 1.1 Committee Groups & Workflow

The committee is organized into three groups (the live member list is maintained in `community/people.yaml` and displayed on `/people/`):

| Group | Domain Tracks | Responsibilities & Workflow |
| --- | --- | --- |
| **Project Leadership** | `Benchmark`, `Algorithm`, `Harness` | Overall roadmap, RFC standards, and core infrastructure |
| **Proposal Group** | `Benchmark`, `Algorithm`, `Harness`, `AI4S`, etc. | Survey frontier papers and benchmark needs; publish official tasks via the [RFC-0006](RFC-0006-quests.md) template |
| **Review Group** | `Benchmark`, `Algorithm`, `Harness`, `AI4S`, etc. | Review Benchmark, Evaluation, Algorithm Plugin, and Agent framework PRs for reproducibility and merge completion |

- **Expanding Domain Tracks**: Beyond `Benchmark`, `Algorithm`, `Harness`, and `AI4S`, the committee continues to expand into vertical domains such as `Medicine` and `Telecom`.
- **Fixed Committee Incentive**: Each committee member receives a fixed **¥1,000 RMB / month** incentive (issued in equivalent LLM Token credits and compute vouchers on the **5th of each month** for the previous calendar month).
- **How to Apply**: Apply via the **community WeChat group**.

## 2. Contributor Leaderboard

The `/people/` page displays two leaderboards sorted in descending order by Experience Points (EXP):

1. **Monthly Leaderboard**: Tracks EXP earned within the current calendar month from completing official tasks recognized under [RFC-0006](RFC-0006-quests.md). It serves as the sole basis for monthly reward settlement; it resets at the start of each new calendar month, and rewards for the previous calendar month are distributed on the **5th of each month**.
2. **All-Time Leaderboard**: Permanently accumulates each contributor's total historical EXP and completed task count.
3. **Tie-Breaking Rule (Earliest to Reach Score Wins)**: When two or more contributors are tied on EXP, they are ordered by **the timestamp at which they reached that EXP total (i.e., the merge timestamp of their latest completed task PR) in ascending order (earliest first)**. The contributor who reached the score earlier ranks higher and receives the corresponding Top-5 rank bonus.

> **Note**: Only official tasks published by RSI Community Committee members award EXP upon PR merge; self-published issues opened by non-committee users are not recognized and do not count toward the leaderboard.

## 3. Monthly Contributor Reward Settlement Rules

In addition to fixed committee stipends, the community maintains a monthly contributor reward pool with a **maximum monthly cap of ¥10,000 RMB** (issued in equivalent LLM Token credits and compute vouchers), settled and distributed on the **5th of each month** for the previous calendar month based on the **Monthly Leaderboard**:

| Reward Component | Rate / Bonus | Formula & Explanation |
| --- | --- | --- |
| **1. 1:1 EXP Base Reward** | **1 EXP = ¥1 RMB** | Every 1 EXP earned during the month converts 1:1 into ¥1 RMB of credits (e.g., completing one 50 EXP task awards ¥50 RMB directly), preventing dilution or over-allocation when few participants are active:$$\text{Base Reward} = \text{Individual Monthly EXP} \times ¥1\text{ RMB}$$ |
| **2. Monthly Top-5 Bonus** | **¥800 / ¥400 / ¥200 / ¥100 / ¥50** | The Top 5 contributors on the Monthly Leaderboard (with $\text{EXP} > 0$) receive an additional tiered bonus: **#1 +¥800**, **#2 +¥400**, **#3 +¥200**, **#4 +¥100**, **#5 +¥50**. |

Each contributor's total monthly reward is the sum of both components:

$$\text{Total Monthly Reward} = \text{Individual Monthly EXP} \times ¥1\text{ RMB} + \text{Top-5 Rank Bonus}$$

Total monthly disbursements across the contributor leaderboard are capped at **¥10,000 RMB / month**.
