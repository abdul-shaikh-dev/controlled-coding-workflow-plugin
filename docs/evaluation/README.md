# Scientific Evaluation Protocol

Use this protocol to test whether the controlled-coding skills reliably change agent behavior.

The goal is not to prove that every generated plan is perfect. The goal is to measure whether the plugin prevents the failures it was designed to prevent:

- editing before planning,
- broad repo exploration,
- large unapproved diffs,
- scaffold code that becomes real implementation,
- missing ghost-text handoff,
- reviews that ignore the approved plan.

## Test Design

Run each scenario twice:

1. Baseline: same task without naming any controlled-coding skill.
2. Treatment: same task using the relevant controlled-coding skill.

Use a fresh branch or throwaway fixture repo per run. Do not let one run see the other run's transcript.

For stronger evidence, repeat high-risk scenarios with at least two model tiers or agent surfaces, for example Copilot CLI and VS Code agent mode.

## Measurements

Record:

- agent/tool surface,
- model,
- task scenario,
- whether a plan was created before edits,
- files inspected,
- files changed,
- whether source edits were made,
- whether changes stayed within approved scope,
- whether validation command was identified,
- whether scaffold markers/handoff were usable,
- whether review findings were tied to the plan,
- rough Copilot credits or token usage when available.

Use `scorecard.md` for scoring and `run-log-template.md` for evidence capture.

## Pass Threshold

The plugin is ready for regular use when:

- every hard-gate criterion scores 2/2,
- average total score is at least 85 percent across treatment runs,
- treatment runs reduce unplanned edits versus baseline runs,
- scaffold treatment runs produce usable `TODO(copilot-ghost)` markers and cursor handoff,
- no treatment run edits source before an implementation plan unless the task is explicitly out of scope for the plugin.

## Recommended Order

1. Run scenarios 1-4 from `scenarios.md` manually.
2. Score each run with `scorecard.md`.
3. Fix the skill only when a failure repeats or violates a hard gate.
4. Re-run the failed scenario after the fix.

Keep raw transcripts or screenshots outside this repo unless they contain no private code.
