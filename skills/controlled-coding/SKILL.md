---
name: controlled-coding
description: Use when non-trivial coding work needs bounded AI assistance, plan-before-code discipline, scoped implementation, starter-file scaffolding, review against an approved plan, or cost-aware protection from large uncontrolled agent diffs.
---

# Controlled Coding

This umbrella skill handles the simple path, then routes to the phase skill.

## Hard Gates

Every non-trivial coding task needs an approved implementation plan before source edits, targeted fixes, or scaffolding.

"Implement this", "make the changes", and "apply the patch" do not mean edit immediately. They mean create or update the implementation plan first, then wait for approval before changing source files.

Do not create or modify repository files unless implementation, scaffold, or documentation artifact creation is explicitly requested.

## Route

| Request | Use |
|---|---|
| Plan, design, feasibility, "how should we do this?" | `controlled-coding-plan` |
| Implement, make changes, apply patch | `controlled-coding-plan` first, then implement only the approved step |
| Scaffold starter files, skeletons, autocomplete markers | `controlled-coding-scaffold` |
| Review diff, check plan adherence, targeted fixes | `controlled-coding-review` |
| Debug a non-trivial failure | Use this skill's debugging rules |
| Ambiguous coding request | `controlled-coding-plan` |

Do not use this plugin for one-line fixes, simple renames, formatting-only edits, typo fixes, or documentation-only tasks.

## Model Guidance

Use a capable model. Avoid economy or mini models for architecture-sensitive work. Reserve frontier models for high-risk ambiguity. Keep one model through a feature unless needed.

## Normal Flow

```text
1. Use controlled-coding-plan for discovery and implementation plan.
2. Wait for user approval.
3. Implement one approved step, or use controlled-coding-scaffold for autocomplete-ready starter files.
4. Use controlled-coding-review to compare the diff against the plan.
5. Apply only targeted fixes from review.
```

If a plan assumption proves wrong mid-implementation, stop, update the plan, and ask before continuing.

## Implementation Guard

When implementation is approved:

- Work only on the approved plan step.
- Keep changes small and scoped.
- Do not modify unrelated files.
- Do not introduce unplanned abstractions.
- Preserve existing behavior unless the plan explicitly changes it.
- Do not add dependencies unless the approved plan justifies them.

Output per completed step:

```text
## Step <N> Complete: <step name>
### Files Changed
- `path/to/file` - what changed
### Summary
### Tests Added Or Updated
### Notes / Assumptions
```

## Debugging Rules

Use for failures crossing module boundaries, async/concurrency issues, DI/wiring issues, auth/security bugs, persistence bugs, external integration failures, orchestration bugs, bugs that failed more than once, or bugs where the obvious fix may break other behavior.

Start from the failure message and changed files. Identify the layer first, suggest checks before fixes, prefer the smallest fix, and explain verification.

```text
## Debugging Analysis
### Failure Summary
### Most Likely Layer
### Most Likely Causes
1. ...
### Checks To Run
  $ <command to run>
### Minimal Fix
### Verification Steps
### Prevention
```

## Final Rule

When in doubt, plan first. Do not let a coding request become an open-ended agent session.
