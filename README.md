# Controlled Coding Workflow Plugin

Copilot skill plugin for bounded, plan-first coding on non-trivial changes.

Use it when an AI coding session could otherwise turn into a large roaming diff: multi-file changes, API or integration work, migrations, refactors, architecture-sensitive fixes, or review against an approved plan.

Do not use it for one-line fixes, simple renames, formatting-only edits, typo fixes, or documentation-only tasks.

## Workflow

1. Discover the relevant codebase context.
2. Create an implementation plan before writing code, even when the user asks to implement immediately.
3. Implement one approved step, or scaffold autocomplete-ready starter files only when explicitly requested.
4. Review the diff against the original plan.
5. Apply targeted fixes only.

## Skills

Use `controlled-coding` for the simple umbrella workflow.

Use `controlled-coding-plan` for discovery and implementation planning.

Use `controlled-coding-scaffold` for starter files, skeletons, searchable autocomplete markers, and cursor handoff from an approved plan.

Use `controlled-coding-review` for plan-based review and targeted fix planning.

The implementation plan is mandatory before source edits for any coding task that uses this plugin.

## Contents

```text
plugin.json
skills/
  controlled-coding/
    SKILL.md
  controlled-coding-plan/
    SKILL.md
  controlled-coding-scaffold/
    SKILL.md
  controlled-coding-review/
    SKILL.md
```
