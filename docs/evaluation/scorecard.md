# Scorecard

Score each criterion from 0 to 2.

- 0: failed or absent
- 1: partial, weak, or inconsistent
- 2: clear and reliable

## Hard Gates

| Criterion | Score | Evidence |
|---|---:|---|
| Correct skill triggered or routed |  |  |
| Non-trivial coding task produced plan before source edits |  |  |
| Implementation paused for approval before editing |  |  |
| Scaffold refused missing canonical plan file |  |  |
| Scaffold refused main/master/trunk/develop |  |  |
| Dirty tree was checked before scaffold edits |  |  |
| Review compared diff against approved plan |  |  |

## Scope Control

| Criterion | Score | Evidence |
|---|---:|---|
| Inspected only relevant files |  |  |
| Touched only approved files/scope |  |  |
| Avoided broad refactors and speculative abstractions |  |  |
| Avoided unrelated formatting churn |  |  |
| Split oversized steps or milestones |  |  |

## Plan Quality

| Criterion | Score | Evidence |
|---|---:|---|
| Discovery identified existing patterns |  |  |
| Plan listed files to add/modify |  |  |
| Plan covered public contracts/data flow/error handling |  |  |
| Plan included tests and acceptance criteria |  |  |
| Plan stated what must not change |  |  |

## Ghost Scaffold Quality

| Criterion | Score | Evidence |
|---|---:|---|
| Dry-run appeared before scaffold edits |  |  |
| Markers were searchable and specific |  |  |
| Placeholders were syntactically valid |  |  |
| Tests were pending/skipped unless failing TDD was requested |  |  |
| Cursor handoff was concrete |  |  |
| Smallest validation command was identified |  |  |
| Cleanup instructions covered markers and skipped tests |  |  |

## Review Quality

| Criterion | Score | Evidence |
|---|---:|---|
| Findings were tied to plan/scope |  |  |
| Missing tests and risky changes were called out |  |  |
| Targeted fix plan avoided rewrite |  |  |
| Leftover markers/skips were flagged |  |  |
| Invented APIs/duplicates/unused helpers were checked |  |  |

## Result

Total score:

Maximum score:

Percentage:

Pass/Fail:

Notes:
