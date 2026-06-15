# Project Work Simulations

These estimates model realistic Copilot CLI or VS Code agent-mode work using the controlled-coding-workflow skill.

Assumptions:

- Model tier: Claude Sonnet 4.6 or GPT-5.4 class pricing.
- Workflow: discovery, plan, scaffold, review.
- One debug/fix pass: one targeted follow-up after implementation when the first review finds issues.
- Unconstrained agent range: rough comparison for open-ended agentic coding sessions that repeatedly inspect files, write code, run tools, and revise without a permission gate.
- 1 AI Credit = $0.01 USD.
- Code completions and next edit suggestions are not counted because paid Copilot plans do not bill them in AI credits.

Actual spend varies with repository indexing, context selected by Copilot, cache behavior, output length, model availability, tests/logs pasted into chat, and whether the agent performs implementation rather than planning/scaffolding only.

Pricing and allowance sources:

- GitHub Copilot model pricing: https://docs.github.com/en/copilot/reference/copilot-billing/models-and-pricing
- Individual usage-based billing: https://docs.github.com/en/copilot/concepts/billing/usage-based-billing-for-individuals
- Organization and enterprise usage-based billing: https://docs.github.com/en/copilot/concepts/billing/usage-based-billing-for-organizations-and-enterprises

## Scenario Table

| Project stack | Codebase | Work scope | Simulated real task | Controlled credits | Cost USD | One debug/fix pass | Unconstrained agent range |
|---|---|---|---|---:|---:|---:|---:|
| C# / ASP.NET Core | small | Focused change | Validation rule plus test | 21 | $0.21 | 24 | 82-144 |
| C# / ASP.NET Core | medium | Feature slice | CQRS endpoint plus service plus integration tests | 69 | $0.69 | 84 | 310-551 |
| C# / ASP.NET Core | large | Cross-boundary change | Payment/status workflow across API, worker, persistence | 271 | $2.71 | 347 | 1,357-2,715 |
| Python / FastAPI | small | Focused change | Validation fix plus unit test | 16 | $0.16 | 19 | 64-112 |
| Python / async service | medium | Feature slice | Async ingestion job plus retry tests | 50 | $0.50 | 61 | 224-398 |
| Python / ETL | large | Cross-boundary change | Pipeline refactor with backfill/retry behavior | 188 | $1.88 | 240 | 938-1,875 |
| React | small | Focused change | Filterable table component | 20 | $0.20 | 23 | 78-137 |
| React | medium | Feature slice | Dashboard view using existing API state | 66 | $0.66 | 80 | 295-524 |
| React | large | Cross-boundary change | Onboarding flow rework with routing/state/tests | 234 | $2.34 | 300 | 1,172-2,343 |
| JavaScript / Express | small | Focused change | Middleware bugfix plus test | 18 | $0.18 | 21 | 71-123 |
| JavaScript / Node service | medium | Feature slice | Webhook handler plus queue handoff | 57 | $0.57 | 69 | 255-453 |
| JavaScript / legacy service | large | Cross-boundary change | Module modernization across service boundary | 204 | $2.04 | 261 | 1,018-2,036 |
| TypeScript / API client | small | Focused change | Typed API client method plus tests | 19 | $0.19 | 23 | 77-135 |
| TypeScript / NestJS | medium | Feature slice | Module with DTO/service/tests | 62 | $0.62 | 76 | 279-497 |
| TypeScript / full stack | large | Cross-boundary change | Shared type contract migration across frontend/backend | 224 | $2.24 | 287 | 1,120-2,241 |

## Reading The Numbers

Focused changes are usually cheap enough that the skill's main value is quality control, not raw cost savings.

Feature slices are where the workflow starts paying off. A disciplined discovery-plan-scaffold-review loop typically stays under 100 credits, while an unconstrained implementation session can burn several hundred credits after repeated tool calls and revisions.

Cross-boundary changes are where the permission gate matters most. Cross-module work can stay in the low hundreds of credits when the agent plans and scaffolds instead of implementing everything. Letting the agent freely inspect, edit, run tests, and revise can move the same task into the 1,000-2,700 credit range.

## Stack Notes

C# estimates are higher because enterprise .NET work often involves solution structure, DI/wiring, DTOs, controllers, services, tests, and generated boilerplate.

Python estimates are lower because focused FastAPI, library, and ETL work tends to need fewer surrounding files, though logs and notebook-style context can raise costs quickly.

React estimates are higher than plain JavaScript because UI work often needs component context, state hooks, styling, routing, accessibility, and test fixtures.

JavaScript estimates are moderate unless the codebase is legacy or lacks types, in which case discovery and review can grow.

TypeScript estimates are close to React/C# for larger tasks because type contracts, generated clients, DTOs, and shared packages create more cross-file context.

## Budget Impact

Against a standard Copilot Enterprise user allowance of 3,900 credits:

- Focused controlled changes: usually under 1 percent of the monthly allowance.
- Controlled feature slices: roughly 1-2 percent of the monthly allowance.
- Controlled cross-boundary changes: roughly 5-9 percent of the monthly allowance.
- Large unconstrained sessions: roughly 25-70 percent of the monthly allowance.

Against a 7,000-credit Pro+, Max, or promotional Enterprise-style allowance, the same controlled workflow leaves more headroom, but unconstrained large sessions can still consume a meaningful chunk of the month.

## Practical Rule

Use controlled-coding-workflow for any task that touches more than 3 files, changes public contracts, crosses service/module boundaries, or requires tests. Keep implementation in the IDE/autocomplete path unless the user explicitly accepts the extra cost and risk of full agentic implementation.
