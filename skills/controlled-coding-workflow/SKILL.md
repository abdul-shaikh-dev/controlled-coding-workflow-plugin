---
name: controlled-coding-workflow
description: Use when planning, implementing, reviewing, or debugging non-trivial code changes where uncontrolled AI coding could create large diffs, wasted credits, messy architecture, or unnecessary abstractions. Use for multi-file changes, API or integration work, migrations, refactors, and architecture-sensitive fixes.
---

# Controlled Coding Workflow

Plan first, even when the user asks to implement immediately. Keep edits scoped to an approved step. Review the diff against the plan.

This skill is the core workflow. For starter-file scaffolding, use `controlled-coding-scaffold`.

For pricing examples and cost comparisons, use the separate [copilot-credit-simulator](https://github.com/abdul-shaikh-dev/copilot-credit-simulator) app.

## When To Use

Use for multi-file changes, public contract changes, integrations, migrations, refactors, architecture-sensitive fixes, code reviews, and debugging that crosses module boundaries.

Do not use for one-line fixes, simple renames, formatting-only edits, typo fixes, or documentation-only tasks.

## Hard Gates

Every coding task that uses this skill must produce an `Implementation Plan` before source edits, targeted fixes, or scaffolding.

Implementation triggers such as "make the changes", "write the code", or "apply the patch" grant edit permission only after the plan exists and the user has confirmed the approved scope.

Do not create or modify repository files unless implementation, scaffold, or documentation artifact creation is explicitly requested.

## Mode Selection

| Request | Mode |
|---|---|
| "Plan this" / "How should we do this?" / "Design this" | Discovery and plan |
| "Make the changes" / "Implement this" | Plan first, pause, then implement approved step |
| "Scaffold this" / "Create starter files" | Use `controlled-coding-scaffold` |
| "Review this" | Review diff against the plan |
| "Debug this" | Debugging analysis and minimal fix plan |
| Ambiguous request | Default to discovery and plan |

## Model Guidance

Use one capable model consistently across discovery, planning, review, and debugging. Avoid economy or mini models for architecture-sensitive work because weak plans usually cost more through rework. Use expensive frontier models only for unusually ambiguous, high-risk, or cross-system changes. Do not switch models mid-feature unless there is a clear reason.

## Workflow

```text
1. Discover: inspect relevant codebase context.
2. Plan: create a controlled implementation plan with signatures and pseudocode only.
3. Confirm: wait before editing source files.
4. Implement or scaffold: work only on the approved step.
5. Review: compare the diff against the plan.
6. Fix: apply targeted fixes only.
7. Debug: enter whenever a bug appears.
```

If a plan assumption proves wrong mid-implementation, stop, document the discrepancy, update the plan, and ask before continuing.

## Planning Artifacts

By default, keep discovery, plans, reviews, and debugging notes in the assistant response.

When markdown artifacts are explicitly requested, or when scaffolding will use a plan file, use:

```text
docs/controlled-coding/{feature-name}/
  discovery.md
  implementation-plan.md
  review.md
  debugging-notes.md
```

Use one feature per folder, lowercase kebab-case names, and split by milestone only when the plan grows large.

Do not use single-file planning artifacts for scaffoldable work. Scaffold mode requires `docs/controlled-coding/{feature-name}/implementation-plan.md`.

## Phase 1: Discovery

Inspect the relevant context before planning. Do not write implementation code here.

Identify architecture style, relevant files, patterns to reuse, module boundaries, likely files to add or modify, risks, unknowns, and recommended direction.

```text
## Discovery Summary
### Existing Architecture
### Relevant Files
- `path/to/file` - why it matters
### Existing Patterns To Reuse
### Likely Change Area
### Risks / Unknowns
### Recommended Direction
```

## Phase 2: Implementation Plan

Create a plan detailed enough for an implementer to execute without making design decisions. Use signatures, types, and pseudocode only.

Step size guideline: if one step touches more than 3 files, split it.

The plan must include target design, files to add or modify, public contracts, data flow, error handling, config changes, test plan, step-by-step order, acceptance criteria, and what must not change.

```text
## Implementation Plan

### Milestones
- Milestone 1: <name> - detail below

### Target Design
### Files To Add
- `path/to/new_file` - purpose
### Files To Modify
- `path/to/existing_file` - change needed
### Public Contracts
### Data Flow
### Error Handling
### Config / Environment Changes

### Implementation Steps
#### Step 1: <step name>
Files: `path/to/file`
Change: ...
Why: ...
Implementation guidance: ...
Starter code:
  <signature + docstring/comment + short pseudocode comments only, no full body>
Expected result: ...

### Tests To Add Or Update
- `tests/path/test_file`
  - `test_should_do_x_when_y`

### Acceptance Criteria
### Do Not Change
```

Starter code may include signatures, docstrings or intent comments, short pseudocode comments, and placeholders such as `pass`, `...`, `TODO`, or language equivalents. Do not include real business logic, concrete database/API/filesystem/auth/integration logic, or finished error-handling behavior.

## Phase 3: Controlled Implementation

Enter this phase only when implementation is explicitly requested and a plan exists for the requested scope.

Follow the plan step by step, keep changes small, do not modify unrelated files, do not introduce unplanned abstractions, preserve existing behavior unless the plan explicitly changes it, and do not add dependencies without justification.

Output per completed step:

```text
## Step <N> Complete: <step name>
### Files Changed
- `path/to/file` - what changed
### Summary
### Tests Added Or Updated
### Notes / Assumptions
```

## Phase 4: Review

Review the diff against the original plan. Do not rewrite unless explicitly requested.

Check plan adherence, scope control, unnecessary abstractions, module boundaries, edge cases, error handling, test quality, hidden behavior changes, naming clarity, file placement, diff size, over-engineering, and risk to existing behavior.

```text
## Review Summary
### Overall Assessment
Approve / Approve after fixes / Needs rework
### Must Fix
### Should Fix
### Test Gaps
### Risky Changes
### Recommended Patch Strategy
```

## Phase 5: Targeted Fixes

Fix only what review found. Do not rewrite the whole feature.

If a targeted fix changes scope, contracts, data flow, or verification strategy, update the implementation plan before editing code.

```text
## Targeted Fix Plan
### Fix 1: <fix name>
File: `path/to/file`
Problem: ...
Change: ...
Why: ...
Expected result: ...
```

## Phase 6: Debugging

Use for failures crossing module boundaries, async/concurrency issues, DI/wiring issues, auth/security bugs, persistence bugs, external integration failures, orchestration bugs, bugs that failed more than once, or bugs where the obvious fix may break other behavior.

Start from the failure message and changed files, identify the layer first, suggest checks before fixes, prefer the smallest fix, and explain verification.

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

## Quality Rules

Follow the project's existing style first. Use clear names, focused functions, simple readable code, minimal diffs, explicit file lists, and behavior-focused tests.

Do not introduce new frameworks, DI systems, base classes, generic abstractions, plugin systems, config patterns, build patterns, or dependencies unless the project already uses them or the plan clearly justifies them.

Avoid full repo rewrites, repeated whole-codebase scans, large unscoped tasks, combining planning plus implementation plus review in one step, and rewriting files when a patch is enough.

## Standard Prompts

Plan:

```text
Use the controlled-coding-workflow skill.
Task: <describe>
Do discovery, then create a controlled implementation plan.
Rules: signatures and pseudocode only, max about 3 files per step,
include acceptance criteria and what must not change,
do not create markdown files unless explicitly requested.
```

Implement:

```text
Use the controlled-coding-workflow skill.
Task: <describe>
First create or update the controlled implementation plan for this scope.
After I confirm the plan, implement only the approved step.
```

Review:

```text
Use the controlled-coding-workflow skill.
Review this diff against the original plan.
Give targeted comments and a minimal fix plan. Do not rewrite everything.
```

## Final Rule

Always create or update the implementation plan before code edits for non-trivial coding work.

If the request is ambiguous, default to planning, review, or debugging mode, not implementation mode.
