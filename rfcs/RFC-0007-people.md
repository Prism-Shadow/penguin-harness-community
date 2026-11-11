# RFC-0007 People & Rewards

- Feature Name: `people`
- Start Date: 2026-11-11
- RFC PR: [#29](https://github.com/Prism-Shadow/penguin-harness-community/pull/29)
- Updated by: N/A

[中文版](RFC-0007-people.zh.md)

To sustain high-quality open collaboration and reward contributors, Shared RSI Community establishes the **RSI Community Committee** and the **Monthly Contributor Incentive Mechanism**, presented on the `/people/` page.

## 1. RSI Community Committee

The RSI Community Committee oversees project direction, publishes official tasks on the [RFC-0006 Task Board](RFC-0006-quests.md) (only tasks published by committee members are recognized by the community), and reviews submitted code and experimental reproducibility.

### 1.1 Committee Groups & Responsibilities

The committee is organized into three groups:

| Group | Current Members | Domain Tracks | Core Responsibilities |
| --- | --- | --- | --- |
| **Project Leadership** | `Yaowei Zheng` ([@hiyouga](https://github.com/hiyouga)) | `Benchmark`, `Algorithm`, `Harness` | Overall roadmap, RFC standards, and core infrastructure |
| **Proposal Group** | `Xiang Qu` ([@ArisaZz](https://github.com/ArisaZz)), `Zhihao Liu` ([@lzh368](https://github.com/lzh368)), `Yanke Yu` ([@rank-Yu](https://github.com/rank-Yu)) | `Algorithm` (Xiang Qu), `Benchmark` (Zhihao Liu), `Harness` (Yanke Yu) | Curate frontier papers and benchmark needs; publish official tasks via the [RFC-0006](RFC-0006-quests.md) template |
| **Review Group** | `Leijun Zhou` ([@Saigyouji-Yuyuko1000](https://github.com/Saigyouji-Yuyuko1000)), `Zhihao Liu` ([@lzh368](https://github.com/lzh368)), `Yangxi Xiang` ([@Myriad-Dreamin](https://github.com/Myriad-Dreamin)) | `Algorithm` (Leijun Zhou), `Benchmark` (Zhihao Liu), `Harness` (Yangxi Xiang) | Review Benchmark, Evaluation, Algorithm Plugin, and Harness PRs for reproducibility and merge completion |

- **Expanding Domain Tracks**: Beyond `Benchmark`, `Algorithm`, and `Harness`, the committee continues to expand into vertical domains such as `Medicine` and `Telecom`.
- **Fixed Committee Incentive**: Each committee member receives a fixed **¥1,000 RMB / month** incentive (issued in equivalent LLM Token credits and compute vouchers).
- **How to Apply**: Researchers and engineers interested in joining the RSI Community Committee may apply via the **community WeChat group**.

## 2. Contributor Leaderboard

The `/people/` page displays two leaderboards sorted in descending order by Experience Points (EXP):

1. **Monthly Leaderboard**: Tracks EXP earned within the current calendar month from completing official tasks recognized under [RFC-0006](RFC-0006-quests.md). It serves as the sole basis for monthly reward settlement and resets at the beginning of each new month.
2. **All-Time Leaderboard**: Permanently accumulates each contributor's total historical EXP and completed task count.

> **Note**: Only official tasks published by RSI Community Committee members award EXP upon PR merge; self-published issues opened by non-committee users are not recognized and do not count toward the leaderboard.

## 3. Monthly Contributor Reward Settlement Rules

In addition to fixed committee stipends, the community maintains a monthly contributor reward pool with a **maximum monthly cap of ¥10,000 RMB** (issued in equivalent LLM Token credits and compute vouchers), settled at the end of each calendar month based on the **Monthly Leaderboard**:

| Reward Component | Rate / Bonus | Formula & Explanation |
| --- | --- | --- |
| **1. 1:1 EXP Base Reward** | **1 EXP = ¥1 RMB** | Every 1 EXP earned during the month converts 1:1 into ¥1 RMB of credits (e.g., completing one 50 EXP task awards ¥50 RMB directly), preventing dilution or over-allocation when few participants are active:$$\text{Base Reward} = \text{Individual Monthly EXP} \times ¥1\text{ RMB}$$ |
| **2. Monthly Top-5 Bonus** | **¥800 / ¥400 / ¥200 / ¥100 / ¥50** | The Top 5 contributors on the Monthly Leaderboard (with $\text{EXP} > 0$) receive an additional tiered bonus: **#1 +¥800**, **#2 +¥400**, **#3 +¥200**, **#4 +¥100**, **#5 +¥50**. |

Each contributor's total monthly reward is the sum of both components:

$$\text{Total Monthly Reward} = \text{Individual Monthly EXP} \times ¥1\text{ RMB} + \text{Top-5 Rank Bonus}$$

Total monthly disbursements across the contributor leaderboard are capped at **¥10,000 RMB / month**.
