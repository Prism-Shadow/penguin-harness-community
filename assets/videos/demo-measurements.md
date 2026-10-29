# Demo measurements / 演示数据口径

These measurements accompany the Chinese and English decision-agent and legal-agent videos recorded on 13 October 2026. Amounts are in US dollars.

## Decision-agent evolution

The demonstration starts with a lightweight generic decision-agent role and an already prepared evaluation set. It adds a general working method: retrieve source evidence, resolve rule versions, recalculate ledger figures, and apply the governing decision rule.

| Demo case | Before | After |
| --- | ---: | ---: |
| After-sales disposition | 100 | 100 |
| Procurement acceptance | 57 | 100 |
| Launch approval | 95 | 100 |
| **Average score / 100** | **84** | **100** |

Both versions use `deepseek/deepseek-flash` with reasoning set to `none`. Each version ran each of the three cases once. SHA-256 checks found no changes to the 181 public evaluation-material files between versions. The change is to the agent configuration and working method, not model weights. This is an illustrative result on the same development set, without independent holdout validation; it is not a general accuracy score or a guarantee of future improvement.

| Included model calls | Estimated cost |
| --- | ---: |
| Baseline setup and scoring | $0.051889174062 |
| Optimization and scoring | $0.055942166591 |
| Six decision test runs | $0.037323951970 |
| Six preparation sessions | $0.000374856810 |
| **Total, 239 requests across 14 sessions** | **$0.145530149433** |

The video rounds this total to **about $0.15 per demonstrated validation cycle**. Costs come from the platform's configured token rates and usage ledger, including cached-token pricing, rather than a provider invoice. Scoring and other subagent calls are attributed to their owning baseline or optimization session and included above. Creating and calibrating the evaluation set, earlier exploratory attempts with a separate agent, hardware, and video production are excluded. The figure is not the total cost of developing the demonstration or a universal price per evolution cycle.

## Legal-agent application

Five short fictional contract samples (1,409–2,833 UTF-8 bytes each) produced 33 model requests, totaling **$0.04231220019**: **$0.008462440038 per sample on average**, or less than one US cent. The model was `deepseek/deepseek-flash`. Some individual samples cost more than one cent; the headline is an average.

| Fictional sample | Model-call estimate |
| --- | ---: |
| sample-contract-en.txt | $0.005820087672 |
| sample-contract.txt | $0.005882975967 |
| Northwind-Services-Agreement-v2.txt | $0.011363214697 |
| Northwind-Services-Agreement.txt | $0.010091590017 |
| 测试服务合同.txt | $0.009154331837 |

These are configured-rate estimates for the five review sessions. Application creation, debugging, subsequent memory and interface demonstrations, additional reviews, hardware, and human legal review are excluded. Larger documents or different models can have different costs.

The memory demonstration stores three fictional company preferences, then retrieves them in a fresh session. The application also demonstrates a customized dashboard, hot reload with existing review records retained, processing status updates, and inline report preview. The **84 → 100** result referenced in the legal video belongs to the separate decision-agent demonstration; the video does not claim that this legal application achieved that measured improvement.

## Published coding comparison

| Product and paired model | Accuracy | Suite cost |
| --- | ---: | ---: |
| PenguinHarness + DeepSeek V4 Pro | 71.25% | $3.812 |
| OpenAI Codex + GPT-5.5 | 71.25% | $220.08 |

The published suite contains 40 tasks run twice, with accuracy calculated over all 80 outcomes. Costs are suite totals. `$220.08 / $3.812 ≈ 57.73`, rounded to **about 1/58 the cost** for PenguinHarness. This compares products with different paired models, not harnesses running an identical model, and is separate from the decision-agent evolution experiment.

Source: [PenguinHarness published benchmark data, pinned source revision](https://github.com/Prism-Shadow/penguin-harness/blob/2069ffa87a22f3c853525f02fb473f8cf6fc8e64/packages/landing/src/lib/benchmark-data.ts).

## 中文说明

决策演示从轻量通用角色和已经准备好的评测集出发，更新证据检索、规则版本判断、台账复算和按规则决策的方法。同一模型、同一思考等级，三个案例各版本各运行一次，均分从 **84 提升到 100**；181 份公开材料的 SHA-256 校验未发现变化。改进对象是智能体配置和工作方法，而非模型权重。这是同一开发评测集上的演示结果，未经独立留出集验证，不代表通用准确率或每轮都能提升。

本轮基线、优化、评分、六次测试运行和六个准备会话的模型调用估算合计 **$0.145530149433，约 15 美分**。评分等子智能体调用计入所属基线或优化会话。金额来自平台配置费率与使用记录，包含缓存计价，并非供应商账单；不含评测集构建与校准、使用另一智能体的前期探索、机器和视频制作成本，也不代表制作整个演示的总成本或所有进化任务的固定价格。

法务演示五份短篇虚构合同样本（1,409–2,833 字节）共 33 次模型请求，合计 **$0.04231220019**，平均 **$0.008462440038 / 次，不到 1 美分**；个别样本超过 1 美分，视频说的是平均数。不含应用构建、调试、后续记忆与界面演示、额外审阅、机器和人工法律复核成本。视频展示了新会话读取公司偏好、工作台定制、保留记录的热更新、处理状态更新和报告预览；引用的 **84 → 100** 属于决策演示，不是该法务应用的实测提升。

公开编程基准为 40 题各运行两次，共 80 次结果；PenguinHarness + DeepSeek V4 Pro 与 Codex + GPT-5.5 的准确率同为 **71.25%**，套件总费用分别为 **$3.812 与 $220.08**，前者约为后者的 **1/58**。这是不同模型搭配下的产品比较，并非同模型控制实验，也不是自进化前后对比。
