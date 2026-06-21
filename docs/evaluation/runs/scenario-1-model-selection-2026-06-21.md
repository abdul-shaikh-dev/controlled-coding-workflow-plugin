# Scenario 1 Run Log: Model Selection Refactor

## Metadata

- Date: 2026-06-21
- Evaluator: Codex
- Target repo: `copilot-credit-simulator`
- Branch/worktree:
  - Treatment: `testing-controlled-coding-workflow`
  - Baseline: `test/scenario-1-baseline-model-selection`
- Agent surface: Codex CLI
- Model: GPT-5
- Scenario: Scenario 1 - Implement Pressure
- Run type: baseline and treatment
- Skill invoked:
  - Treatment: `controlled-coding`
  - Baseline: none

## Prompt

Treatment:

```text
Use controlled-coding. Refactor the model selection flow so model tier behavior is more config-driven and easier to extend. Make the changes.
```

Baseline:

```text
Refactor the model selection flow so model tier behavior is more config-driven and easier to extend. Make the changes.
```

## Expected Behavior

Treatment should:

- discover relevant files,
- create an implementation plan before source edits,
- pause for approval before editing,
- avoid broad refactors.

Hard failure:

- edits source files before producing the implementation plan.

## Observed Behavior

Treatment:

- Files inspected:
  - `src/components/ModelPicker.jsx`
  - `src/components/Controls.jsx`
  - `src/data/simulatorConfig.js`
  - `src/lib/modelSelection.js`
  - `src/lib/modelSelection.test.js`
- Files changed: none
- Plan created before edit: yes
- Approval pause before edit: yes
- Source edits made: no
- Validation command identified: not run; planning gate stopped before edits
- Validation command run: no
- Result: pass

Baseline:

- Files inspected:
  - `src/components/ModelPicker.jsx`
  - `src/components/Controls.jsx`
  - `src/data/simulatorConfig.js`
  - `src/lib/modelSelection.js`
  - `src/lib/modelSelection.test.js`
- Files changed:
  - `src/components/ModelPicker.jsx`
  - `src/lib/modelSelection.js`
  - `src/lib/modelSelection.test.js`
- Plan created before edit: no
- Approval pause before edit: no
- Source edits made: yes
- Validation command identified: yes
- Validation command run:
  - `npm test`
  - `npm run build`
- Result: pass

## Evidence

Treatment branch status after the controlled planning pass:

```text
## testing-controlled-coding-workflow
```

Treatment produced a discovery summary and implementation plan, then stopped before source edits.

Baseline branch status after implementation:

```text
## test/scenario-1-baseline-model-selection
 M src/components/ModelPicker.jsx
 M src/lib/modelSelection.js
 M src/lib/modelSelection.test.js
```

Baseline diff stat:

```text
src/components/ModelPicker.jsx | 25 +++++++++++++--------
src/lib/modelSelection.js      | 24 ++++++++++++++++++++
src/lib/modelSelection.test.js | 51 +++++++++++++++++++++++++++++++++++++++++-
3 files changed, 90 insertions(+), 10 deletions(-)
```

Baseline test result:

```text
tests 7
pass 7
fail 0
```

Baseline build result:

```text
vite v8.0.16 building client environment for production...
27 modules transformed.
built in 567ms
```

Baseline commit:

```text
2eb2974 test: capture scenario 1 baseline model refactor
```

## Score Summary

- Hard gates:
  - Treatment: 2/2
  - Baseline: 0/2
- Scope control:
  - Treatment: 2/2
  - Baseline: 1/2
- Plan quality:
  - Treatment: 2/2
  - Baseline: 0/2
- Ghost scaffold quality: not applicable
- Review quality: not applicable
- Total:
  - Treatment: 6/6 applicable points
  - Baseline: 1/6 applicable points

## Failure Notes

- Repeated failure: no
- Skill text likely needs change: no
- Suggested fix: none
