---
name: controlled-coding-workflow
description: Use this skill for medium or large codebase tasks where uncontrolled AI-assisted coding may cause messy architecture, large diffs, unnecessary abstractions, or wasted credits. Trigger when the user asks to plan, implement, refactor, review, debug, design, or scaffold a non-trivial code change, especially multi-file changes, API changes, integration work, architecture-sensitive changes, test strategy, dependency migrations, final diff reviews, module boundary decisions, codebase cleanup, or prompts such as "scaffold this", "create the files", "set up starter code", or "I want to start implementing". Do not use for one-line fixes, formatting-only changes, simple renaming, basic model/DTO creation, or documentation-only edits.
---

# Controlled Coding Workflow

Plan first. Scaffold only starter code. Let the developer fill bodies with IDE autocomplete. Review the diff against the plan.

This skill is designed for Copilot CLI and VS Code agent mode. As a direct skill it lives in a `skills/controlled-coding-workflow/` directory. As a Copilot CLI plugin, the plugin root must include `plugin.json` pointing to `skills/`.

## References

- For current billing assumptions and model selection, read `references/model-selection.md`.
- For language-specific real-world project simulations, read `references/project-simulations.md`.
- For scaffold mode, read `references/scaffold.md` before touching files.

## Mode Selection

### Mode A: Plan

Use for discovery, planning, review, debugging, feasibility, and implementation guidance.

### Mode B: Scaffold

Use only when the user explicitly asks to scaffold or create starter files from an approved plan. Read `references/scaffold.md` first.

Default to Mode A unless the user clearly requests scaffold mode.

## Workflow

```text
1. Discover: understand the codebase.
2. Plan: write a controlled implementation plan with signatures and pseudocode only.
3. Save plan: only when the user explicitly asks for files.
4. Scaffold: create starter files milestone by milestone.
5. Implement: fill bodies only after explicit implementation permission.
6. Review: compare diff against plan.
7. Fix: apply targeted fixes only.
8. Debug: enter whenever a bug appears.
```

If a plan assumption proves wrong mid-implementation, stop, document the discrepancy, and return to planning before continuing.

## Implementation Permission Gate

Do not write, edit, or apply full implementation code unless the user explicitly requests implementation.

Stop after producing one of: discovery summary, implementation plan, skeletons/signatures, coding map, review report, targeted fix plan, debugging analysis, or scaffold output.

Implementation triggers: "Implement this", "Write the code", "Apply the patch", "Generate the full implementation", "Make the changes", "Update the code."

Scaffold triggers: "Scaffold this", "Create starter files", "Create the files from the plan", "Set up starter code", "Scaffold milestone N", "I want to start implementing."

Even when implementation or scaffolding is permitted, work only on the approved step or explicitly requested scope.

Do not run file-editing tools, apply patches, create files, or modify the repository unless implementation or scaffold mode is explicitly requested.

| Request | Mode |
|---|---|
| "Plan this" / "How should we do this?" / "Design this" | Plan only |
| "Scaffold this" / "Create the files" / "Set up starter code" | Scaffold |
| "Review this" | Review only |
| "What files are needed?" / "Give me steps" | Identify / steps only |
| "Can this be done?" | Feasibility only |
| "Debug this" | Debug only |

Allowed without implementation request: function signatures, type/interface definitions, short pseudocode snippets, empty skeletons, file lists, step-by-step instructions, test names, acceptance criteria, review comments, debugging checks.

Not allowed without implementation request: full function bodies, full-file code, large patches, direct file edits, multi-file generated implementations.

## Planning Artifact Rules

By default, produce discovery, plans, reviews, and debugging notes in the assistant response only.

Do not create or modify markdown files in the repository unless the user explicitly requests documentation or file creation.

When markdown files are explicitly requested, use feature-specific structure:

```text
docs/controlled-coding/<feature-name>/
  discovery.md
  implementation-plan.md
  review.md
  debugging-notes.md
```

For smaller tasks, use `docs/controlled-coding/<feature-name>.md`.

Use one feature per file, lowercase kebab-case folder names, and split by milestone only when the plan grows large.

## Phase 1: Discovery

Before planning, inspect the relevant context. Do not write implementation code here.

Identify existing architecture style, relevant files and modules, patterns to reuse, similar implementations, module boundaries, likely files to add or modify, risks, and unknowns.

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

If context is missing, state what needs to be inspected before proceeding.

## Phase 2: Controlled Implementation Plan

Create a plan detailed enough for the implementer to execute without making design decisions. Use signatures, types, and pseudocode only.

Step size guideline: if one step touches more than 3 files, split it.

Scope bounding: if the task is too large to plan in one pass, split into milestones and detail only the first. Note remaining milestones at the top.

Plan must include target design, files to add/modify, public contracts, data flow, error handling, config changes, test plan, step-by-step order, acceptance criteria, and what must not change.

Starter code may include signatures, docstrings or intent comments, short pseudocode comments, and placeholders such as `pass`, `...`, `TODO`, or language equivalents. Do not include real business logic, complete patches, concrete database/API/filesystem/auth/integration logic, or finished error-handling behavior.

```text
## Implementation Plan

### Milestones
- Milestone 1: <name> - detail below
- Milestone 2: <name> - not yet detailed

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

## Phase 3: Controlled Implementation

Enter this phase only when implementation is explicitly requested. Follow the plan step by step.

Output per completed step:

```text
## Step <N> Complete: <step name>
### Files Changed
- `path/to/file` - what changed
### Summary
### Diff / Key Changes
<minimal patch or annotated excerpt>
### Tests Added or Updated
### Notes / Assumptions
```

Follow the plan step by step, keep changes small, do not modify unrelated files, do not introduce unplanned abstractions, preserve existing behavior unless the plan explicitly changes it, do not mix refactoring and feature work unless planned, and do not add dependencies without justification.

## Phase 4: Review

Review the diff against the original plan. Do not rewrite unless explicitly requested.

Checklist: plan adherence, scope control, unnecessary abstractions, module boundaries, edge cases, error handling, test quality, hidden behavior changes, naming clarity, file placement, diff size, over-engineering, and risk to existing behavior.

```text
## Review Summary
### Overall Assessment
Approve / Approve after fixes / Needs rework
### What Looks Good
### Must Fix
### Should Fix
### Nice To Have
### Architecture Concerns
### Test Gaps
### Risky Changes
### Recommended Patch Strategy
### Final Recommendation
```

## Phase 5: Targeted Fixes

Fix only what review found. Do not rewrite the whole feature.

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

Enter here any time a bug is reported, independent of the main loop.

Use for failures crossing module boundaries, async/concurrency issues, DI/wiring issues, auth/security bugs, persistence bugs, external integration failures, orchestration bugs, bugs that failed more than once, bugs where the obvious fix may break other behavior.

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

Start from the failure message and changed files, identify the layer first, suggest checks before fixes, prefer the smallest fix, and explain verification.

## Code Quality Rules

Follow the project's existing style first.

Code: clear names, focused functions, simple readable code, no unnecessary abstractions, no hidden global state, no broad exception catching unless justified, no unnecessary dependencies, comments explain why not what, clear module boundaries, preserve existing behavior, tests describe behavior clearly.

Architecture: do not introduce new frameworks, DI systems, base classes, generic abstractions, plugin systems, config patterns, or build patterns unless the project already uses them or the plan clearly justifies them.

For modular or vertical-slice projects: keep feature logic inside the relevant module, avoid leaking into shared modules, use shared modules only for genuinely reusable infrastructure, keep wiring explicit, and make features easy to disable or remove.

## Scope Protection

Avoid full repo rewrites, repeated whole-codebase scans, large unscoped tasks, unnecessary boilerplate, combining planning plus implementation plus review in one step, large diffs without a plan, and rewriting files when a patch is enough.

Prefer discovery first, plan before code, small steps, minimal diffs, explicit file lists, clear acceptance criteria, review against the original plan, targeted fixes, and reuse of existing patterns.

## Delegation

Delegate test scaffolding, documentation, simple local patches, repetitive transformations, and single implementation steps.

Do not delegate architecture decisions, security design, complex refactors, cross-module design, dependency wiring, async/concurrency design, or major error-handling design.

```text
Implement only Step <N> from the Controlled Coding Workflow plan.
Allowed files: <file path>
Do: <specific task>
Do not: change public interfaces / modify unrelated files / introduce new abstractions / rewrite full files / change behavior outside this step
Tests: <test cases>
Return: minimal patch/diff + short explanation + assumptions made
```

## Standard Prompt Templates

Plan:

```text
Use the controlled-coding-workflow skill.
Task: <describe>
Do discovery, then create a controlled implementation plan.
Rules: signatures and pseudocode only, max about 3 files per step,
include acceptance criteria and what must not change,
do not create markdown files unless explicitly requested.
```

Save plan as artifact:

```text
Use the controlled-coding-workflow skill.
Task: <describe>
Create planning markdown artifacts.
Save to docs/controlled-coding/<feature-name>/
Start with discovery.md and implementation-plan.md only.
Do not implement code or modify source files.
```

Scaffold:

```text
Use the controlled-coding-workflow skill.
Scaffold milestone <N> for feature: <feature-name>
Plan: docs/controlled-coding/<feature-name>/implementation-plan.md
Show dry-run summary first, wait for confirmation before creating files.
```

Review:

```text
Use the controlled-coding-workflow skill.
Review this diff against the original plan.
Check: plan adherence, scope, abstractions, module boundaries,
edge cases, test quality, over-engineering, risky changes.
Give targeted comments and a minimal fix plan. Do not rewrite everything.
```

Debug:

```text
Use the controlled-coding-workflow skill.
Debug this issue.
Context: <what changed>
Error: <paste>
Identify the likely layer, give top causes, suggest checks to run,
propose the smallest fix, and give verification steps.
```

## Final Rule

Unless explicitly asked to implement or scaffold, respond only with a discovery summary, implementation plan, skeleton/signatures, coding map, review report, targeted fix plan, or debugging analysis.

If the request is ambiguous, default to planning, review, or debugging mode, not implementation mode.

Do not create or modify repository files unless the user explicitly requests it.
