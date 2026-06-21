---
name: controlled-coding-scaffold
description: Use when the user explicitly asks to scaffold starter files, create skeletons, insert autocomplete markers, or prepare real files for Copilot ghost-text completion from an approved controlled-coding-plan implementation plan.
---

# Controlled Coding Scaffold

Prepare real files for autocomplete-first implementation from an approved `controlled-coding-plan`. Never plan here. Never write business logic.

The approved plan must exist at `docs/controlled-coding/{feature-name}/implementation-plan.md`. Chat-only plans and single-file notes are not scaffold inputs.

## Pre-Flight

Run all checks before touching files.

1. Check branch:

```bash
git branch --show-current
```

If the branch is `main`, `master`, `trunk`, or `develop`, refuse and ask for a feature branch.

2. Check dirty state:

```bash
git status --short
```

Avoid files with unrelated active edits when possible. If the intended target is heavily modified, switch to dry-run/manual instructions.

3. Check plan file:

```text
docs/controlled-coding/{feature-name}/implementation-plan.md
```

If missing, stop and ask the user to run `controlled-coding-plan` and save the approved plan to the canonical path.

4. Identify the milestone and smallest scaffold slice. Scaffold one milestone or slice at a time.

## Budget

Default pass:

- inspect at most 5 relevant files,
- edit at most 3 files,
- add at most about 40 scaffold lines per file,
- avoid broad scans, broad formatters, and speculative new modules.

If safe targets cannot be found inside this budget, output a dry-run/manual plan instead of broadening scope.

## Dry-Run

Before editing, output a dry-run and wait for explicit confirmation.

```text
## Scaffold Dry-run: {feature-name} / Milestone <N>

### Files to create
- `path/to/new_file` - <what it contains>

### Files to patch
- `path/to/existing_file` - <marker/signature to append or insert>

### Manual edits only
- `path/to/file` - <why direct patch is risky>

### Validation
- <smallest likely command>

Confirm scaffold? yes / no / adjust
```

For interfaces, contracts, routing, DI, or wiring files, require explicit wording such as "confirm integration scaffold".

## Marker Protocol

Use the repo's accepted temporary marker if visible in nearby code or config. Do not broaden exploration only to detect marker policy.

Default marker:

```text
TODO(copilot-ghost): <specific local instruction>
```

For multi-step work:

```text
TODO(copilot-ghost 1/N): <first local instruction>
TODO(copilot-ghost 2/N): <second local instruction>
```

Keep markers local, specific, searchable, and removable. Tell the developer to delete scaffold-only markers after implementation.

If the repo blocks `TODO` comments, do not blindly switch to another likely-blocked marker such as `FIXME`. Use an accepted searchable style such as `NOTE(copilot-ghost)`, `copilot-ghost`, or a tracked issue reference, and mention the chosen marker in the handoff.

## Scaffold Rules

Prefer additive patches. Do not delete or rewrite existing behavior for scaffold insertion.

Before adding a method, route, mapper, validator, DTO, public API, or test, check whether an equivalent target already exists. If it exists, add the marker inside or directly above that target instead of creating a duplicate.

New files may include imports inferred from the plan/local patterns, declarations, planned signatures, intent comments, short pseudocode, markers, and valid placeholders.

Existing files may be appended only when structurally safe. If mid-file insertion is risky, output manual cursor instructions instead.

Do not touch generated, vendored, lock, minified, snapshot, migration, or unrelated files unless explicitly requested.

## Placeholder Rules

Use syntactically valid placeholders:

- C#: `throw new System.NotImplementedException("TODO(copilot-ghost)");`
- Python: `raise NotImplementedError("TODO(copilot-ghost)")`
- TypeScript/JavaScript utility code: `throw new Error("TODO(copilot-ghost)");`
- React/renderable components: `return null;` or a tiny inert placeholder element.
- Java: `throw new UnsupportedOperationException("TODO(copilot-ghost)");`
- Go: `panic("TODO(copilot-ghost)")`

For tests, default to names, TODO comments, or skipped/pending skeletons so scaffold insertion does not unexpectedly break the suite. If a skipped/pending test is completed later, require removing the skip/pending marker.

For existing bug fixes, add a local marker near suspicious code or a pending test. Do not insert runtime-throw placeholders into existing execution paths.

## Integration Files

Interfaces, contracts, routing, and wiring files are instruction-only by default. Patch them only when all are true:

- the approved plan lists the exact change,
- the dry-run labels it as integration scaffold,
- likely dependent files and compile/test impact are listed,
- the user explicitly confirms integration scaffold.

Patch only the planned signature or registration line.

## Handoff

After editing, respond with the scaffold manifest and cursor handoff:

```text
Scaffold inserted.

Changed:
- <file>: <what was scaffolded>

Start at:
- Search for TODO(copilot-ghost)

Cursor handoff:
1. Open <file>.
2. Complete <marker 1/N> first.
3. Put the cursor inside/under the marker.
4. Accept only the next coherent Copilot ghost-text block.
5. Use partial acceptance when the suggestion is directionally right but too large.
6. Press Escape when Copilot invents unrelated APIs, abstractions, dependencies, or behavior.
7. Delete the scaffold marker only after that block is implemented.
8. If this is a skipped/pending test, remove the skip/pending marker after completing the body.
9. Run <smallest validation command>.
10. Move to the next marker only after the check passes.

Stop condition:
- Stop after <specific slice> passes.

Escalate only if:
- <condition>

After all markers are complete:
- Run targeted validation, then normal repo validation if practical.
- Use `controlled-coding-review` to check for generated artifacts, unused helpers, invented APIs, duplicate code, and over-broad changes.
```

Infer the smallest useful validation command from repo files: package-manager lockfile and scripts for JS/TS, targeted `pytest`, targeted `dotnet test`, `go test`, `cargo test`, or a relevant `make` target.

If file editing is unavailable or a safe edit target cannot be found, clearly label the response as fallback/manual mode. Provide the smallest pasteable scaffold or cursor instructions, and do not say files were changed.

## Rollback

Rollback only from the scaffold manifest/handoff:

```bash
git status --short
git diff -- path/to/scaffolded-or-patched-file
```

Remove only inserted markers, placeholders, scaffold blocks, or newly created files listed in the manifest. If the file now has user implementation edits, stop and ask before changing it.

## Never

- Does not write business logic.
- Does not scaffold without an approved plan file.
- Does not scaffold on main/master/trunk/develop.
- Does not use chat-only or single-file notes as scaffold input.
- Does not scaffold multiple milestones at once.
- Does not skip dry-run confirmation.
- Does not create duplicate public APIs, routes, mappers, validators, DTOs, or tests.
- Does not run broad formatters.
- Does not produce full function bodies even if asked; redirect to `controlled-coding`.
