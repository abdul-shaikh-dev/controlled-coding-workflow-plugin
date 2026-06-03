# Model Selection Reference

Opinionated guidance for using this skill under GitHub Copilot usage-based billing.

This reference reflects GitHub's published Copilot billing model as of June 2026. Re-check GitHub's Copilot billing and model pricing docs before relying on exact numbers for budget decisions.

## Recommended Models

Use one capable model consistently across discovery, planning, scaffolding, review, and debugging.

Avoid switching models mid-feature unless there is a clear reason. The scaffold phase reads the planning phase's signatures, naming, and pseudocode intent, so consistency reduces interpretation drift.

| Model | Input per 1M | Output per 1M | Verdict |
|---|---:|---:|---|
| GPT-5.4 | $2.50 | $15.00 | Recommended |
| Claude Sonnet 4.6 | $3.00 | $15.00 | Recommended |

Both are strong defaults for structured planning, scaffolding, review, and debugging. Output pricing is identical. Input cost difference is usually less important than avoiding rework from weak plans.

Pricing details used by the simulator:

| Model | Input | Cached input | Cache write | Output |
|---|---:|---:|---:|---:|
| GPT-5.4 | $2.50 | $0.25 | n/a | $15.00 |
| Claude Sonnet 4.6 | $3.00 | $0.30 | $3.75 | $15.00 |
| GPT-5.5 | $5.00 | $0.50 | n/a | $30.00 |

Notes:

- All prices are per 1M tokens.
- Claude models include a cache-write cost in addition to cached-input cost.
- GPT-5.4 pricing applies only within GitHub's documented prompt-size limit.

## What To Avoid

Economy or mini models, such as GPT-5 mini or GPT-5.4 mini, are cheap but unreliable for architecture-sensitive planning. A vague plan often costs more through revision cycles than it saves in token price.

Frontier models, such as GPT-5.5 or Claude Opus, are useful for unusually high-risk, ambiguous, or cross-system tasks. They are not the default for this workflow because the cost premium is rarely justified for structured planning and scaffolding.

## Credit Consumption Reference

1 AI Credit = $0.01 USD. Copilot Chat, Copilot CLI, Copilot cloud agent, Copilot Spaces, Spark, and third-party coding agents consume AI credits. Code completions and next edit suggestions are not billed in AI credits on paid plans.

Rough estimates for a complete feature workflow, using discovery, plan, scaffold, and review with GPT-5.4 or Claude Sonnet 4.6:

| Codebase | Small feature | Medium feature | Large feature |
|---|---:|---:|---:|
| Small, about 5k-20k LOC | about 35 credits | about 120 credits | about 300 credits |
| Medium, about 50k-150k LOC | about 120 credits | about 290 credits | about 700 credits |
| Large, about 300k+ LOC | about 300 credits | about 700 credits | about 1,400 credits |

These are approximations. Actual consumption depends on model choice, cached context, output size, and how much repository context is passed per invocation.

Monthly credit allowances for reference:

| Plan | Standard monthly credits | Notes |
|---|---:|---|
| Copilot Pro | 1,500 | Individual plan |
| Copilot Pro+ | 7,000 | Individual plan |
| Copilot Max | 20,000 | Individual plan |
| Copilot Business | 1,900 | Pooled across the billing entity |
| Copilot Enterprise | 3,900 | Pooled across the billing entity |
| Copilot Business promo | 3,000 | Existing org/enterprise customers, June 1 through September 1, 2026 |
| Copilot Enterprise promo | 7,000 | Existing org/enterprise customers, June 1 through September 1, 2026 |

For interactive cost modelling across language, codebase, feature, and model combinations, use `tools/copilot-credit-simulator.jsx`. For static real-world scenario estimates, see `references/project-simulations.md`.

## Key Principle

The permission gate in this skill aims to keep a feature to a small number of metered invocations: discovery, plan, scaffold, review, and targeted follow-up only when necessary. The structure is a cost control, not a guarantee of exactly four charges.
