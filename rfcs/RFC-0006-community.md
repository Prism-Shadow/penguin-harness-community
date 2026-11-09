# RFC-0006 Community Quests, Automated Governance & Reward Protocol

- Feature Name: `community`
- Start Date: 2026-11-10
- RFC PR: N/A
- Updated by: N/A

[中文版](RFC-0006-community.zh.md)

To empower open-source researchers and engineers to continuously contribute frontier RSI paper reproductions, cross-framework benchmark evaluations, ecosystem plugins, and interactive tutorials, Shared RSI Community establishes a gamified **Quest Publishing, Claiming & Cross-Repository Tracking System**, an **Automated Community Steward Agent (`rsi_community_steward`)**, a **$2,000 USD Monthly Reward Pool**, and a domain-specialized **RSI Community Committee**.

## 1. Quest Lifecycle & Cross-Repository Workflow

All community quests and bounties are registered in `community/tasks.yaml` in the [penguin-harness-community](https://github.com/Prism-Shadow/penguin-harness-community) repository and rendered interactively on the `/quests/` page.

<figure class="flowchart"><svg class="flowchart-svg" viewBox="0 0 640 240" role="img" aria-labelledby="rfc-0006-en-title"><title id="rfc-0006-en-title">Community Quest Publishing, Claiming &amp; Automated Settlement Workflow</title><defs><marker id="rfc-0006-en-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10Z" class="fc-arrowhead"/></marker></defs><rect x="14" y="12" width="612" height="94" rx="10" class="fc-stage-primary"/><text x="28" y="33" class="fc-stage-title">Stage 1 · Publishing &amp; Claiming (Max Concurrent Claims &le; 2)</text><rect x="28" y="44" width="176" height="48" rx="6" class="fc-process"/><text x="116" y="73" class="fc-title" text-anchor="middle">1. PR to tasks.yaml</text><path d="M204 68H232" class="fc-edge" marker-end="url(#rfc-0006-en-arrow)"/><rect x="232" y="44" width="176" height="48" rx="6" class="fc-process"/><text x="320" y="73" class="fc-title" text-anchor="middle">2. Agent Syncs Issues</text><path d="M408 68H436" class="fc-edge" marker-end="url(#rfc-0006-en-arrow)"/><rect x="436" y="44" width="176" height="48" rx="6" class="fc-process"/><text x="524" y="73" class="fc-title" text-anchor="middle">3. Quick Claim (/claim)</text><path d="M524 92V124" class="fc-edge" marker-end="url(#rfc-0006-en-arrow)"/><rect x="14" y="126" width="612" height="100" rx="10" class="fc-stage-secondary"/><text x="28" y="147" class="fc-stage-badge">Stage 2 · Cross-Repo PR Tracking &amp; Automated Settlement</text><rect x="436" y="158" width="176" height="50" rx="6" class="fc-process"/><text x="524" y="188" class="fc-title" text-anchor="middle">4. Open Target Repo PR</text><path d="M436 183H408" class="fc-edge" marker-end="url(#rfc-0006-en-arrow)"/><rect x="232" y="158" width="176" height="50" rx="6" class="fc-process"/><text x="320" y="188" class="fc-title" text-anchor="middle">5. Agent Screens PR Status</text><path d="M232 183H204" class="fc-edge" marker-end="url(#rfc-0006-en-arrow)"/><rect x="28" y="158" width="176" height="50" rx="6" class="fc-process"/><text x="116" y="188" class="fc-title" text-anchor="middle">6. Close Issue &amp; Grant EXP</text></svg><ol class="flowchart-steps"><li>Stage 1 (Publishing &amp; Claiming): Publishers add tasks via PR to tasks.yaml -> The Automated Agent creates linked tracking Issues in both the community repo and the target repo -> Contributors claim via 1-click website buttons or commenting /claim (capped at 2 concurrent active claims per user).</li><li>Stage 2 (Cross-Repo PR Tracking &amp; Automated Settlement): Claimant opens a PR in the target repo -> Automated Agent updates board status to in_review -> Once merged, the Agent closes the tracking Issues and credits Growth EXP and crafting loot.</li></ol></figure>

### 1.1 Task States

Each quest in `community/tasks.yaml` transitions through four canonical states (`status`):

- `"open"`: Merged into `community/tasks.yaml`, with tracking Issues synchronized in `penguin-harness-community` and the designated `target_repo` ([penguin-harness](https://github.com/Prism-Shadow/penguin-harness), [penguin-harness-benchmark](https://github.com/Prism-Shadow/penguin-harness-benchmark), or [penguin-harness-plugins](https://github.com/Prism-Shadow/penguin-harness-plugins)), ready to be claimed.
- `"claimed"`: Claimed by a contributor via the website's quick-claim button or by commenting `/claim <task-id>` on the tracking Issue.
- `"in_review"`: The claimant has opened a deliverable Pull Request in the target repository (and linked it via `/submit <task-id> <pr-url>` or a community status PR); the website board reflects the live PR review status.
- `"completed"`: Once the target repository PR is merged, the Automated Steward Agent verifies the merge, closes the linked community Issue via PR, and credits the quest's **Growth EXP** and **Crafting Loot** to the contributor's monthly tally.

### 1.2 Anti-Abuse & Concurrent Claim Limit

To prevent task hoarding and ensure lively community throughput:

1. **Maximum Concurrent Claims ($\le 2$)**: Each GitHub contributor may hold at most **2 active quests** (sum of tasks in `"claimed"` or `"in_review"` states $\le 2$) at any time. Additional `/claim` requests are automatically declined until an active quest is completed or voluntarily released (`/release <task-id>`).
2. **Stale Claim Auto-Release (14 Days)**: Any `"claimed"` quest without a linked Pull Request or progress update for **14 consecutive days** is automatically released back to `"open"` by the Automated Steward Agent.

## 2. Automated Community Steward Agent (`rsi_community_steward`)

Operated on PenguinHarness (`rsi_community_steward` paired with `scripts/community-agent-sync.mjs` and GitHub Actions), the automated steward lets regular contributors interact solely through Issue comments or website quick-action buttons:

- **Cross-Repository Issue Creation**: Automatically creates a primary tracking Issue in `penguin-harness-community` and a cross-linked Issue in `target_repo` whenever new tasks are merged into `community/tasks.yaml`.
- **Claim Quota Enforcement**: Processes `/claim`, `/submit`, and `/release` commands in Issue comments while enforcing the 2-task concurrent limit.
- **Automated PR Screening & Closure**: Screens linked PRs across `penguin-harness`, `penguin-harness-benchmark`, and `penguin-harness-plugins`. When a target PR opens, the quest transitions to `"in_review"`; once merged, the agent updates `community/tasks.yaml` to `"completed"`, closes the tracking Issue, and updates the live leaderboard.

## 3. Gamified Growth EXP & Crafting Loot System

Every quest awards **Growth EXP** and collectible **RSI Crafting Materials (`loot`)** scaled by difficulty tier (`S / A / B`):

| Item ID (`item`) | Material Name | Primary Quest Source | Meaning & Community Utility |
| --- | --- | --- | --- |
| `evolution-core` | **Evolution Core** | Core Paper Reproductions (`RSIAgent`, `RRSI`, `RSI Arena`) | Symbolizes algorithmic self-evolution breakthroughs; unlocks RSI Alchemist rank & compute perks |
| `trace-crystal` | **Trace Crystal** | Cross-Framework & Multi-Model Leaderboard Evaluations | Crystallized from verified execution traces and Pareto frontiers; redeemable for API Token packs |
| `harness-gear` | **Harness Gear** | PenguinHarness Core Features & LangGraph / Dify RSI Optimization | Precision runtime component for agent harnesses and context hand-offs; unlocks Harness Artisan badge |
| `ontology-rune` | **Ontology Rune** | Knowledge Base Plugin & Ontology / Causal Action Graph Plugin | Encodes structured domain schemas and causal action contracts; unlocks Plugin Forgemaster title |
| `benchmark-astrolabe` | **Benchmark Astrolabe** | Standard Benchmarks & Playful Beginner Tutorials for Penguin Blog | Guides reproducible evaluation; awards featured author credit on the official Penguin blog |

Contributors level up across five Adventurer Ranks as their cumulative EXP grows: **Lv.1 Novice Explorer (0+ EXP)** $\rightarrow$ **Lv.2 Trace Hunter (400+ EXP)** $\rightarrow$ **Lv.3 Harness Artisan (1,000+ EXP)** $\rightarrow$ **Lv.4 RSI Alchemist (2,000+ EXP)** $\rightarrow$ **Lv.5 Recursive Archon (3,500+ EXP)**.

## 4. Monthly $2,000 USD Reward Pool & Distribution Formula

The community allocates a **$2,000 USD equivalent monthly reward budget**, settled at the end of each calendar month and distributed by administrators as **LLM Token Quotas (Penguin Go / API Credits), GPU Compute Vouchers, Cloud Server Instances, or Research Grants**:

| Reward Pool | Monthly Budget (USD Equiv.) | Allocation Rule & Formula |
| --- | --- | --- |
| **1. Proportional Contribution Pool** | **1,100 USD / month** | Shared proportionally among all contributors who completed at least 1 quest during the month based on their monthly Growth EXP ($\text{EXP}_i$):$$\text{Reward}_i = 1100 \times \frac{\text{EXP}_i}{\sum_{j} \text{EXP}_j}$$ |
| **2. Monthly Leaderboard Top Bonus** | **500 USD / month** | Awarded on top of the proportional share to the Top 5 contributors on the monthly EXP leaderboard: **Top 1: +200 USD**, **Top 2: +150 USD**, **Top 3: +100 USD**, **Top 4–5: +25 USD each**. |
| **3. RSI Committee Fixed Stipend** | **400 USD / month** | Fixed monthly honorarium for active RSI Community Committee members at **100 USD equivalent per member per month**. |

## 5. RSI Community Committee Charter & Open Recruitment

To curate high-impact quests, review experimental reproducibility, and Steward community operations, repository administrators appoint the **RSI Community Committee** from active community members and top contributors:

- **Responsibilities**: Publish and scope domain quests, review cross-repo PRs and trace reproducibility, host bi-weekly paper reading sessions (RFC-0004), and mentor contributors in the community forum.
- **Fixed Monthly Stipend**: Each active committee member receives a fixed **$100 USD equivalent reward every month** (in token credits, compute vouchers, or server resources) and remains eligible for quest rewards.
- **Domain Tracks & Open Recruitment**: Committee seats are organized into six specialized tracks (listed in `community/people.yaml` and showcased on `/people/`):
  1. **Harness & Runtime Architecture Committee**
  2. **Benchmark & Leaderboard Evaluation Committee**
  3. **Environment Interaction & Exploration RSI Committee**
  4. **Harness Self-Evolution & Generalization Committee**
  5. **Plugin Ecosystem, Knowledge Base & Ontology Committee**
  6. **Community Operations, Tutorials & Bi-Weekly Meeting Committee**
- **Open Seats ("Recruiting")**: Unfilled seats are displayed on `/people/` as **"Recruiting · $100/mo Stipend"** with a 1-click GitHub Issue application button to welcome qualified researchers and developers to apply.
