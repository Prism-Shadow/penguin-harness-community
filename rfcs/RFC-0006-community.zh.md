# RFC-0006 社区悬赏任务、自动化治理与激励机制

- Feature Name: `community`
- Start Date: 2026-11-10
- RFC PR: N/A
- Updated by: N/A

[English](RFC-0006-community.md)

为了激发开源社区围绕递归自进化（RSI）持续产出高质量的论文复现、跨框架对比实验、核心插件与入门教程，Shared RSI Community 建立了游戏化的**任务发布、认领与跨仓库追踪制度**、**自动化社区管家 Agent（`rsi_community_steward`）**、**月度 $2,000 美元激励池**以及**专业领域委员会（RSI Committee）**机制。

## 1. 任务生命周期与跨仓库协同流程

社区所有悬赏任务统一登记在 [penguin-harness-community](https://github.com/Prism-Shadow/penguin-harness-community) 仓库的 `community/tasks.yaml` 配置文件中，并通过社区网站 `/quests/` 页面实时展示与交互。

<figure class="flowchart"><svg class="flowchart-svg" viewBox="0 0 640 240" role="img" aria-labelledby="rfc-0006-zh-title"><title id="rfc-0006-zh-title">社区任务发布、认领与自动化结算流程</title><defs><marker id="rfc-0006-zh-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10Z" class="fc-arrowhead"/></marker></defs><rect x="14" y="12" width="612" height="94" rx="10" class="fc-stage-primary"/><text x="28" y="33" class="fc-stage-title">阶段一 · 任务发布与认领（防滥用并发上限 ≤ 2）</text><rect x="28" y="44" width="176" height="48" rx="6" class="fc-process"/><text x="116" y="73" class="fc-title" text-anchor="middle">1. PR 新增 tasks.yaml</text><path d="M204 68H232" class="fc-edge" marker-end="url(#rfc-0006-zh-arrow)"/><rect x="232" y="44" width="176" height="48" rx="6" class="fc-process"/><text x="320" y="73" class="fc-title" text-anchor="middle">2. Agent 同步双仓 Issue</text><path d="M408 68H436" class="fc-edge" marker-end="url(#rfc-0006-zh-arrow)"/><rect x="436" y="44" width="176" height="48" rx="6" class="fc-process"/><text x="524" y="73" class="fc-title" text-anchor="middle">3. 一键认领 (/claim)</text><path d="M524 92V124" class="fc-edge" marker-end="url(#rfc-0006-zh-arrow)"/><rect x="14" y="126" width="612" height="100" rx="10" class="fc-stage-secondary"/><text x="28" y="147" class="fc-stage-badge">阶段二 · 跨仓 PR 追踪与自动化结算</text><rect x="436" y="158" width="176" height="50" rx="6" class="fc-process"/><text x="524" y="188" class="fc-title" text-anchor="middle">4. 目标仓库发起 PR</text><path d="M436 183H408" class="fc-edge" marker-end="url(#rfc-0006-zh-arrow)"/><rect x="232" y="158" width="176" height="50" rx="6" class="fc-process"/><text x="320" y="188" class="fc-title" text-anchor="middle">5. Agent 筛查 PR 状态</text><path d="M232 183H204" class="fc-edge" marker-end="url(#rfc-0006-zh-arrow)"/><rect x="28" y="158" width="176" height="50" rx="6" class="fc-process"/><text x="116" y="188" class="fc-title" text-anchor="middle">6. 自动关单 &amp; 发放成长值</text></svg><ol class="flowchart-steps"><li>阶段一（任务发布与认领）：发布者提交 PR 修改 tasks.yaml -> 自动化 Agent 在社区仓与目标仓库同步创建关联 Issue -> 贡献者点击网页快捷按钮或评论 /claim 认领（每人同时认领上限为 2 项）。</li><li>阶段二（跨仓 PR 追踪与自动化结算）：认领者在目标仓库提交 PR -> 自动化 Agent 实时更新看板状态为 in_review -> 目标 PR 合入后自动关单并结算成长值（EXP）与游戏掉落素材。</li></ol></figure>

### 1.1 任务状态流转

每项任务包含四个标准状态（`status`）：

- `"open"`（待认领）：任务已合入 `community/tasks.yaml`，自动化 Agent 已在 `penguin-harness-community` 及对应目标仓库（如 [penguin-harness](https://github.com/Prism-Shadow/penguin-harness)、[penguin-harness-benchmark](https://github.com/Prism-Shadow/penguin-harness-benchmark)、[penguin-harness-plugins](https://github.com/Prism-Shadow/penguin-harness-plugins)）创建关联 Issue，等待社区成员认领。
- `"claimed"`（已认领·进行中）：社区成员通过网页快捷认领按钮或在社区 Issue 评论区发送 `/claim <task-id>` 完成认领。
- `"in_review"`（PR 审核中）：任务认领者已在目标仓库发起完成任务的代码/实验 PR，并在社区 Issue 评论区关联该 PR（或发起更新 `community/tasks.yaml` 状态的社区 PR），网页看板实时显示审核进度。
- `"completed"`（已完成·已结算）：目标仓库 PR 经审查合入后，自动化 Agent 筛查确认合入状态，自动合入/创建社区仓库 PR 关闭对应 Issue，并将该任务的**成长值（EXP）**与**专属锻造素材（Loot）**计入认领者当月账户。

### 1.2 防滥用机制与同时认领上限

为防止恶意占坑或囤积任务导致社区任务停滞，实行严格的防滥用约束：

1. **同时认领上限（Max Concurrent Claims）**：每位 GitHub 用户在同一时间最多只能持有 **2 项**未完结任务（即状态处于 `"claimed"` 或 `"in_review"` 的任务总数 $\le 2$）。当用户已有 2 项进行中任务时，自动化 Agent 会自动拒绝新的 `/claim` 请求，直至其中至少一项合入完结或主动释放（`/release <task-id>`）。
2. **超时自动释放（Stale Claim Timeout）**：处于 `"claimed"` 状态的任务若连续 **14 天**无关联 PR 提交或进度更新，自动化 Agent 将自动解绑认领人并将任务重置为 `"open"` 状态，重新向社区开放。

## 2. 自动化社区管家 Agent（`rsi_community_steward`）

社区运行方部署了基于 PenguinHarness 构建的自动化管家 Agent（`rsi_community_steward`，配套同步脚本 `scripts/community-agent-sync.mjs` 与 GitHub Actions 工作流），普通贡献者**只需在社区仓库 Issue 评论区互动或点击网页快捷按钮**，无需手动跨多个仓库同步状态：

- **跨仓库关联 Issue 自动创建**：当发布者通过 PR 在 `community/tasks.yaml` 中新增任务后，Agent 自动在 `penguin-harness-community` 创建主追踪 Issue，同时在 `target_repo`（例如 `penguin-harness-benchmark` 或 `penguin-harness-plugins`）创建带双向链接的关联 Issue。
- **认领资格校验与进度管理**：监听 Issue 评论区的 `/claim`、`/submit`、`/release` 指令，自动校验认领人当前活跃任务数是否 $\le 2$。
- **跨仓库 PR 自动筛查与闭环结算**：定时筛查各目标仓库中的关联 PR 状态；当检测到目标仓库 PR 已开启时，将看板任务状态同步为 `"in_review"`；当检测到目标仓库 PR 已合入（`MERGED`）时，自动协助认领者在 `penguin-harness-community` 更新状态为 `"completed"`、关闭关联 Issue，并实时刷新网站看板与月度排行榜。

## 3. 游戏化成长体系与锻造素材（Loot System）

每项任务根据难度等级（`S / A / B`）赋予对应的**成长值（Growth EXP）**与**RSI 游戏素材掉落（Crafting Materials）**：

| 素材标识 (`item`) | 名称 | 主要掉落来源 | 社区象征与用途 |
| --- | --- | --- | --- |
| `evolution-core` | **进化核心（Evolution Core）** | 核心论文复现（如 RSIAgent、RRSI、RSI Arena） | 象征算法层的自进化突破，解锁高阶炼金师头衔与算力大奖加成 |
| `trace-crystal` | **轨迹棱晶（Trace Crystal）** | 跨框架对比评测与多模型进化榜单实验 | 凝聚真实评测轨迹与帕累托前沿数据，兑换评测 Token 额度包 |
| `harness-gear` | **赫尔墨斯齿轮（Harness Gear）** | PenguinHarness 核心功能与 LangGraph / Dify 跨框架优化 | 驱动智能体运行时与上下文交接的精密构件，解锁工程工匠徽章 |
| `ontology-rune` | **本体符文（Ontology Rune）** | 知识库插件、Ontology 本体建模与因果图谱插件 | 刻录结构化领域知识与因果动作契约，合成专属插件创作者头衔 |
| `benchmark-astrolabe` | **基准星盘（Benchmark Astrolabe）** | 标准 Benchmark 构建与 Penguin 主页博客趣味入门教程 | 指引可复现评测航向，获评官方博客精选署名与新星奖励 |

随着累计 EXP 的增长，社区成员将依次晋升冒险者职级：**Lv.1 初阶探索者（Novice Explorer, 0+ EXP）** $\rightarrow$ **Lv.2 轨迹猎手（Trace Hunter, 400+ EXP）** $\rightarrow$ **Lv.3 框架工匠（Harness Artisan, 1,000+ EXP）** $\rightarrow$ **Lv.4 进化炼金师（RSI Alchemist, 2,000+ EXP）** $\rightarrow$ **Lv.5 递归执政官（Recursive Archon, 3,500+ EXP）**。

## 4. 月度 $2,000 美元激励预算与分配方案

社区设立每月总计 **$2,000 美元（USD 等值）** 的开源激励预算，于每月末最后一天根据当月已完成任务的成长值（EXP）榜单进行结算，由管理员发放**模型 Token 额度（Penguin Go / API Credits）、GPU 算力券、云服务器实例或等值科研补贴**：

| 激励池划分 | 月度预算（USD 等值） | 发放规则与计算方式 |
| --- | --- | --- |
| **1. 月度贡献等比瓜分池** | **1,100 USD / 月** | 面向当月所有完成至少 1 项任务的贡献者，按当月获得的成长值 $\text{EXP}_i$ 占全社区当月总成长值的比例等比发放：$$\text{Reward}_i = 1100 \times \frac{\text{EXP}_i}{\sum_{j} \text{EXP}_j}$$ |
| **2. 月度榜单前茅额外大奖** | **500 USD / 月** | 在等比瓜分基础上，当月成长值排行榜前 5 名获得额外冲榜大奖：**Top 1：+200 USD**、**Top 2：+150 USD**、**Top 3：+100 USD**、**Top 4–5：各 +25 USD**。 |
| **3. RSI 社区委员会固定津贴** | **400 USD / 月** | 面向在任的 RSI 社区委员会（Committee）成员发放固定运营津贴，标准为**每人每月 100 USD 等值奖励**。 |

## 5. RSI 社区委员会（Committee）组织架构

为了保障社区基础设施维护、任务提案质量与实验可复现性审查效率，社区由仓库管理员委派成立 **RSI 社区委员会（RSI Community Committee）**，每位在任委员享有每月 **$100 美元等值**的固定激励（Token 额度、GPU 算力券或服务器资源）。委员会下设三个小组（详见 `community/people.yaml` 与网站 `/people/` 页面）：

1. **维护小组（Maintenance Group）**：`Yaowei Zheng`（Benchmark 方向，RSI 算法方向）
2. **提案小组（Proposal Group）**：`Xiang Qu`（RSI 算法方向）、`Zhihao Liu`（Benchmark 方向）
3. **审核小组（Review Group）**：`Leijun Zhou`（RSI 算法方向）、`Zhihao Liu`（Benchmark 方向）
