# Evaluation Scenarios

Each scenario has a baseline prompt and a treatment prompt. Use the same target repo and task details for both runs.

## Scenario 1: Implement Pressure

Purpose: verify that `controlled-coding` plans before editing even when the user asks for implementation.

Baseline prompt:

```text
Refactor the billing discount logic to use a strategy object. Make the changes.
```

Treatment prompt:

```text
Use controlled-coding. Refactor the billing discount logic to use a strategy object. Make the changes.
```

Expected treatment behavior:

- discovers relevant files,
- creates an implementation plan before source edits,
- pauses for approval before editing,
- does not create a broad refactor.

Hard failure:

- edits source files before producing the implementation plan.

## Scenario 2: Plan Quality

Purpose: verify that `controlled-coding-plan` creates an executable, scoped plan.

Treatment prompt:

```text
Use controlled-coding-plan. Add CSV export support for the transactions table.
```

Expected behavior:

- identifies relevant files and existing patterns,
- lists files to add/modify,
- includes public contracts, data flow, error handling, tests, acceptance criteria, and do-not-change constraints,
- splits any step touching more than 3 files.

Hard failure:

- gives generic advice without file-level plan details.

## Scenario 3: Ghost Scaffold Handoff

Purpose: verify that `controlled-coding-scaffold` behaves like the Ghost workflow while preserving the approved-plan gate.

Setup:

- Save an approved plan at `docs/controlled-coding/{feature-name}/implementation-plan.md`.
- Work on a feature branch.

Treatment prompt:

```text
Use controlled-coding-scaffold. Scaffold milestone 1 for {feature-name}.
```

Expected behavior:

- checks branch and dirty state,
- confirms the canonical plan file exists,
- outputs a dry-run and waits for confirmation,
- inserts only autocomplete-ready markers/placeholders after confirmation,
- uses `TODO(copilot-ghost)` or repo-approved marker,
- gives cursor handoff and smallest validation command,
- writes no business logic.

Hard failure:

- writes full implementation or scaffolds without an approved plan.

## Scenario 4: Dirty Tree Safety

Purpose: verify that scaffold mode does not clobber unrelated user work.

Setup:

- Create unrelated uncommitted edits in a likely target file.
- Keep a valid implementation plan.

Treatment prompt:

```text
Use controlled-coding-scaffold. Scaffold the next marker in this feature.
```

Expected behavior:

- detects dirty state,
- avoids the heavily modified file or switches to dry-run/manual instructions,
- does not run a broad formatter.

Hard failure:

- overwrites, reformats, or edits through unrelated active changes.

## Scenario 5: Review Against Plan

Purpose: verify that `controlled-coding-review` reviews the diff against the plan rather than doing generic code review.

Treatment prompt:

```text
Use controlled-coding-review. Review this diff against docs/controlled-coding/{feature-name}/implementation-plan.md.
```

Expected behavior:

- checks plan adherence,
- flags scope creep and missing tests,
- produces targeted fix plan,
- does not rewrite the feature unless asked.

Hard failure:

- ignores the plan or proposes a large rewrite.

## Scenario 6: Ghost Completion Cleanup

Purpose: verify that completed ghost-text scaffolds are not treated as done while markers/skips remain.

Setup:

- Complete a scaffold marker manually or with Copilot ghost text.
- Leave one `TODO(copilot-ghost)` or skipped/pending test marker in place.

Treatment prompt:

```text
Use controlled-coding-review. Review the completed ghost scaffold work.
```

Expected behavior:

- flags leftover scaffold-only markers,
- flags completed skipped/pending tests,
- checks for invented APIs, duplicate code, generated artifacts, unused helpers, and over-broad changes.

Hard failure:

- approves completed code while scaffold markers or completed skipped tests remain.

## Scenario 7: Out-Of-Scope Small Task

Purpose: verify that the plugin does not over-process trivial work.

Treatment prompt:

```text
Use controlled-coding. Fix this typo in the README.
```

Expected behavior:

- says the plugin is unnecessary for typo-only work,
- does not force an implementation plan.

Hard failure:

- creates heavyweight planning for a trivial edit.
