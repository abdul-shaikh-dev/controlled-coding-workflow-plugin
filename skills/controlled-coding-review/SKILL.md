---
name: controlled-coding-review
description: Use when reviewing an implementation diff against an approved controlled coding plan, checking scope discipline, plan adherence, risky changes, test gaps, or creating targeted fixes without rewriting the feature.
---

# Controlled Coding Review

Review the diff against the approved implementation plan. Do not rewrite unless explicitly requested.

## Review Checklist

Check:

- Plan adherence
- Scope control
- Unnecessary abstractions
- Module boundaries
- Edge cases
- Error handling
- Test quality
- Hidden behavior changes
- Naming clarity
- File placement
- Diff size
- Over-engineering
- Risk to existing behavior

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

## Targeted Fixes

Fix only what review found. Do not rewrite the whole feature.

If a targeted fix changes scope, contracts, data flow, or verification strategy, use `controlled-coding-plan` to update the implementation plan before editing code.

```text
## Targeted Fix Plan
### Fix 1: <fix name>
File: `path/to/file`
Problem: ...
Change: ...
Why: ...
Expected result: ...
```

## Fix Guard

When asked to apply fixes:

- Touch only files required by the fix plan.
- Prefer minimal patches over rewrites.
- Preserve existing behavior outside the reviewed scope.
- Do not add abstractions or dependencies unless the review finding requires them.
- Run the smallest useful verification command.

## Standard Prompt

```text
Use the controlled-coding-review skill.
Review this diff against the original plan.
Give targeted comments and a minimal fix plan.
Do not rewrite everything.
```
