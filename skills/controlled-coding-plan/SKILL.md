---
name: controlled-coding-plan
description: Use when a non-trivial coding task needs discovery, architecture-sensitive planning, implementation steps, acceptance criteria, or a canonical implementation-plan.md before source edits.
---

# Controlled Coding Plan

Create the discovery summary and implementation plan that gates controlled coding. Do not write source code.

## Discovery

Inspect relevant context before planning. Identify architecture style, relevant files, patterns to reuse, module boundaries, likely files to add or modify, risks, unknowns, and recommended direction.

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

If context is missing, state what must be inspected before implementation can be planned safely.

## Implementation Plan

Create a plan detailed enough to execute without making design decisions. Use signatures, types, and pseudocode only.

Step size guideline: if one step touches more than 3 files, split it.

Include target design, files to add or modify, public contracts, data flow, error handling, config changes, test plan, step order, acceptance criteria, and what must not change.

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

Starter code may include signatures, docstrings or intent comments, short pseudocode comments, and placeholders such as `pass`, `...`, `TODO`, or language equivalents. Do not include real business logic or concrete database/API/filesystem/auth/integration logic.

## Artifact Rules

By default, keep discovery and plans in the assistant response.

When markdown artifacts are explicitly requested, or scaffolding needs a plan file, use:

```text
docs/controlled-coding/{feature-name}/
  discovery.md
  implementation-plan.md
```

Use one feature per folder, lowercase kebab-case names, and split by milestone only when the plan grows large.

Do not use single-file planning artifacts for scaffoldable work. `controlled-coding-scaffold` requires the canonical `implementation-plan.md`.

## Quality Rules

Follow the project's existing style first. Prefer minimal diffs, explicit file lists, clear acceptance criteria, and behavior-focused tests.

Do not introduce new frameworks, DI systems, base classes, generic abstractions, plugin systems, config patterns, build patterns, or dependencies unless the project already uses them or the plan clearly justifies them.

Avoid full repo rewrites, repeated whole-codebase scans, large unscoped tasks, combining planning plus implementation plus review in one step, and rewriting files when a patch is enough.

## Standard Prompt

```text
Use the controlled-coding-plan skill.
Task: <describe>
Do discovery, then create a controlled implementation plan.
Rules: signatures and pseudocode only, max about 3 files per step,
include acceptance criteria and what must not change,
do not create markdown files unless explicitly requested.
```
