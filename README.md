# Controlled Coding Workflow Plugin

Copilot skill plugin for keeping AI-assisted coding bounded, reviewable, and cost-aware.

The core skill guides an agent through a controlled loop:

1. Discover the relevant codebase context.
2. Create an implementation plan before writing code, even when the user asks to implement immediately.
3. Scaffold only starter files when explicitly requested.
4. Let the developer fill implementation bodies with IDE autocomplete.
5. Review the diff against the original plan.
6. Apply targeted fixes only.

This is intended for medium and large codebase tasks where unconstrained agent sessions can create large diffs, accidental abstractions, messy architecture, or unnecessary GitHub Copilot AI Credit usage.

## Contents

```text
plugin.json
skills/
  controlled-coding-workflow/
    SKILL.md
  controlled-coding-scaffold/
    SKILL.md
```

## Skills

Use `controlled-coding-workflow` for non-trivial implementation planning, refactors, code reviews, debugging, dependency migrations, and architecture-sensitive work. For coding tasks that use this skill, the implementation plan is mandatory before source edits.

Use `controlled-coding-scaffold` only when explicitly scaffolding starter files from an approved implementation plan.

Do not use either skill for one-line fixes, simple renames, formatting-only edits, or documentation-only tasks.

## Companion App

The interactive credit estimator lives in a separate repository:

[copilot-credit-simulator](https://github.com/abdul-shaikh-dev/copilot-credit-simulator)

Keeping the simulator separate prevents React/Vite package files and build output from bloating this skill plugin.

## Install

Install this folder as a Copilot CLI plugin using the plugin installation flow for local plugins.

For direct skill use, the main entry points are:

```text
skills/controlled-coding-workflow/SKILL.md
skills/controlled-coding-scaffold/SKILL.md
```

## Validation

From this repository:

```powershell
python "$env:USERPROFILE\.codex\skills\.system\skill-creator\scripts\quick_validate.py" skills\controlled-coding-workflow
python "$env:USERPROFILE\.codex\skills\.system\skill-creator\scripts\quick_validate.py" skills\controlled-coding-scaffold
```

On macOS/Linux or Git Bash:

```bash
python ~/.codex/skills/.system/skill-creator/scripts/quick_validate.py skills/controlled-coding-workflow
python ~/.codex/skills/.system/skill-creator/scripts/quick_validate.py skills/controlled-coding-scaffold
```

Expected output:

```text
Skill is valid!
```
