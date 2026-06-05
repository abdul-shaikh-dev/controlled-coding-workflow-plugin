# Scaffold Reference

Reads an approved implementation plan, creates starter code files, then lets the developer fill bodies with IDE autocomplete.

This reference is loaded when the user requests scaffolding. It never plans. It never implements business logic. It scaffolds only.

Always use scaffold mode after the plan phase. The plan must exist at `docs/controlled-coding/{feature-name}/implementation-plan.md` before scaffolding begins.

Use the same capable model that produced the plan. Do not switch models between planning and scaffolding unless there is a clear reason.

## Pre-flight Checks

Run all checks before touching any file. If any fail, stop and report.

### 1. Branch check

```bash
git branch --show-current
```

If the current branch is `main`, `master`, `trunk`, or `develop`, refuse and output:

```text
Scaffold aborted: you are on branch '<branch>'.
Switch to a feature branch before scaffolding.
```

### 2. Plan file check

Locate the plan at:

```text
docs/controlled-coding/{feature-name}/implementation-plan.md
```

If not found:

```text
Scaffold aborted: no implementation plan found.
Expected: docs/controlled-coding/{feature-name}/implementation-plan.md
Run the controlled-coding-workflow plan phase first.
```

### 3. Milestone check

If the plan has multiple milestones, confirm which to scaffold:

```text
This plan has N milestones:
- Milestone 1: <name>
- Milestone 2: <name>
Which milestone should I scaffold? Default: Milestone 1.
```

Scaffold one milestone at a time. Never scaffold ahead.

## Dry-run Summary

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

### New files: fully scaffold

Create with:

- Required imports inferred from plan and local patterns.
- Class/module declaration.
- All method/function signatures from the plan step.
- Docstrings or intent comments on every signature.
- Short pseudocode comments inside the body, normally 2-5 lines.
- Placeholders: `pass`, `...`, `throw new NotImplementedException()`, or language equivalent.
- No real business logic.
- No concrete database, API, filesystem, auth, or integration code.
- No finished error-handling branches with real behavior.

### Existing files: append only

If a new method/function can be cleanly appended at the end of a class or file:

- Append signature, docstring, pseudocode comments, and placeholder.
- Do not touch existing lines.
- Wrap with `SCAFFOLD BEGIN` / `SCAFFOLD END` comments using the language's comment syntax.

If appending would break file structure, output inline manual instructions instead.

### Existing files: mid-file injection means instructions only

Do not modify. Output:

```text
### Manual edit required: `path/to/file`
Location: after method `ExistingMethod` (approx. line N)
Add:
  <signature + docstring + pseudocode comments + placeholder>
Why manual: mid-file injection risks corrupting existing code
```

### Interfaces and contracts: instructions by default

Do not modify unless the integration scaffold exception applies. Output:

```text
### Manual edit required: `path/to/IOrderService.cs` (interface)
Add method signature:
  <signature>
Why manual: modifying an interface breaks all implementations; review dependents first
```

### Wiring and registration: instructions by default

Do not modify `Program.cs`, `Startup.cs`, router files, DI registration files, or equivalent unless the integration scaffold exception applies. Output:

```text
### Manual edit required: `path/to/Program.cs` (wiring)
Add registration:
  <line to add>
Location: after existing <ServiceName> registration (approx. line N)
Why manual: registration files are high-risk for silent breakage
```

### Integration scaffold exception

Interfaces, contracts, routing, and wiring files are instruction-only by default. They may be patched only when all of the following are true:

- The approved plan explicitly lists the exact contract or wiring change.
- The dry-run labels the file as an integration scaffold change.
- The dry-run lists likely dependent files and compile/test impact.
- The user explicitly confirms with wording such as "confirm integration scaffold".

Even then, patch only the planned signature/registration line and never infer extra integrations.

## Starter Code Quality Rules

Every signature produced must follow these rules regardless of language:

- Signature matches the plan exactly: name, parameters, return type.
- Docstring or comment describes purpose and key parameters.
- Pseudocode comments inside the body describe intended flow in 2-5 short lines.
- Placeholder at the end: `pass`, `...`, `throw new NotImplementedException()`, `return null`, etc.
- No real logic.

## Scaffold Output Manifest

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
- Milestone 3: <name> - not yet scaffolded

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

## What This Mode Never Does

- Does not write business logic.
- Does not implement error handling beyond placeholders.
- Does not modify interfaces, contracts, or wiring files without the explicit integration scaffold exception.
- Does not scaffold on main/master/trunk/develop.
- Does not scaffold without an approved plan file.
- Does not scaffold multiple milestones at once.
- Does not skip the dry-run confirmation step.
- Does not produce full function bodies even if asked; redirect to controlled implementation.
