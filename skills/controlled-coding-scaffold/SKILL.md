---
name: controlled-coding-scaffold
description: Use when the user explicitly asks to scaffold starter files, create skeleton files, or set up placeholder code from an approved controlled-coding-plan implementation plan without writing business logic.
---

# Controlled Coding Scaffold

Create starter files from an approved `controlled-coding-plan` implementation plan. Never plan here. Never implement business logic.

The approved plan must exist at `docs/controlled-coding/{feature-name}/implementation-plan.md` before scaffolding begins. Single-file planning notes and chat-only plans are not scaffold inputs.

Use the same capable model that produced the plan unless there is a clear reason to switch.

## Pre-Flight Checks

Run all checks before touching files. If any fail, stop and report.

### 1. Branch Check

```bash
git branch --show-current
```

If the current branch is `main`, `master`, `trunk`, or `develop`, refuse:

```text
Scaffold aborted: you are on branch '<branch>'.
Switch to a feature branch before scaffolding.
```

### 2. Plan File Check

Expected path:

```text
docs/controlled-coding/{feature-name}/implementation-plan.md
```

If not found:

```text
Scaffold aborted: no implementation plan found.
Expected: docs/controlled-coding/{feature-name}/implementation-plan.md
Run `controlled-coding-plan` first and save the approved plan to the canonical path.
```

If the user has a plan only in chat or in `docs/controlled-coding/{feature-name}.md`, stop and ask to save or migrate it to the canonical path before scaffolding.

### 3. Milestone Check

If the plan has multiple milestones, confirm which to scaffold:

```text
This plan has N milestones:
- Milestone 1: <name>
- Milestone 2: <name>
Which milestone should I scaffold? Default: Milestone 1.
```

Scaffold one milestone at a time. Never scaffold ahead.

## Dry-Run

Before creating or modifying any file, output a dry-run and wait for explicit confirmation.

```text
## Scaffold Dry-run: {feature-name} / Milestone <N>

### Files to create
- `path/to/new_file` - <what it contains>

### Files to patch, append only
- `path/to/existing_file` - <what will be appended>

### Integration scaffold files
- `path/to/wiring_file` - <exact planned line/signature>, requires explicit integration scaffold confirmation

### Files requiring manual edit
- `path/to/existing_file` - <why manual edit is needed>

### Files that will not be touched
- `path/to/interface_file` - interface/contract, manual only unless integration scaffold is confirmed
- `path/to/wiring_file` - registration/wiring, manual only unless integration scaffold is confirmed

Confirm scaffold? yes / no / adjust
```

Do not proceed until the user confirms. For integration scaffold files, require explicit wording such as "confirm integration scaffold".

## Scaffolding Rules

### New Files

Create with required imports inferred from the plan and local patterns, declarations, all planned signatures, docstrings or intent comments, 2-5 short pseudocode comments, and placeholders such as `pass`, `...`, `throw new NotImplementedException()`, or language equivalent.

Do not include real business logic, concrete database/API/filesystem/auth/integration code, or finished error-handling behavior.

### Existing Files

Append only when a new method/function can be cleanly added at the end of a class or file.

- Append signature, docstring, pseudocode comments, and placeholder.
- Do not touch existing lines.
- Wrap with `SCAFFOLD BEGIN` / `SCAFFOLD END` comments using the language's comment syntax.

If appending would break file structure, output manual instructions instead.

### Mid-File Injection

Do not modify. Output:

```text
### Manual edit required: `path/to/file`
Location: after method `ExistingMethod` (approx. line N)
Add:
  <signature + docstring + pseudocode comments + placeholder>
Why manual: mid-file injection risks corrupting existing code
```

### Interfaces, Contracts, Routing, And Wiring

Instruction-only by default. Do not modify interfaces, DTO contracts, `Program.cs`, `Startup.cs`, router files, DI registration files, or equivalents unless the integration scaffold exception applies.

```text
### Manual edit required: `path/to/Program.cs` (wiring)
Add registration:
  <line to add>
Location: after existing <ServiceName> registration (approx. line N)
Why manual: registration files are high-risk for silent breakage
```

### Integration Scaffold Exception

Interfaces, contracts, routing, and wiring files may be patched only when all are true:

- The approved plan explicitly lists the exact contract or wiring change.
- The dry-run labels the file as an integration scaffold change.
- The dry-run lists likely dependent files and compile/test impact.
- The user explicitly confirms with wording such as "confirm integration scaffold".

Even then, patch only the planned signature or registration line and never infer extra integrations.

## Output Manifest

After scaffolding, always output a manifest.

```text
## Scaffold Complete: {feature-name} / Milestone <N>

### Files created
- `path/to/new_file`

### Files patched, appended
- `path/to/existing_file` - appended N signature(s)

### Integration scaffold files patched
- `path/to/wiring_file` - exact planned line only

### Manual edits required
1. `path/to/file` - <what to add and where>

### Remaining milestones
- Milestone 2: <name> - not yet scaffolded

### Next step
Open each created/patched file, place cursor after a signature,
and let IDE autocomplete complete the body.
When all manual edits are done and bodies are implemented,
run: [test command from plan]
```

## Rollback

Rollback must be based on the scaffold manifest. Do not suggest broad reset commands as the default.

```bash
git status --short
git diff -- path/to/scaffolded-or-patched-file
```

For appended scaffold blocks, remove only the `SCAFFOLD BEGIN` / `SCAFFOLD END` block with a minimal patch.

For newly created files, delete only files listed under `Files created` in the scaffold manifest, and only after confirming the developer has not filled in implementation bodies.

For integration scaffold changes, revert only the exact planned signature or registration line shown in the manifest. If the file now has user implementation edits, stop and ask before changing it.

## Never

- Does not write business logic.
- Does not implement error handling beyond placeholders.
- Does not modify interfaces, contracts, routing, or wiring files without the explicit integration scaffold exception.
- Does not scaffold on main/master/trunk/develop.
- Does not scaffold without an approved plan file.
- Does not use single-file planning notes as scaffold input.
- Does not scaffold multiple milestones at once.
- Does not skip dry-run confirmation.
- Does not produce full function bodies even if asked; redirect to `controlled-coding`.
