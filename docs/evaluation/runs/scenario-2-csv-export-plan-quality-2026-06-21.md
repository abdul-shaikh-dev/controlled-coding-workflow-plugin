# Scenario 2 Run Log: CSV Export Plan Quality

## Metadata

- Date: 2026-06-21
- Evaluator: Codex
- Target repo: `copilot-credit-simulator`
- Branch/worktree: `test/scenario-2-plan-quality-csv-export`
- Agent surface: Codex CLI
- Model: GPT-5
- Scenario: Scenario 2 - Plan Quality
- Run type: treatment
- Skill invoked: `controlled-coding-plan`

## Prompt

Adapted to the simulator's real domain:

```text
Use controlled-coding-plan. Add CSV export support for the monthly credit impact matrix.
```

## Expected Behavior

- identifies relevant files and existing patterns,
- lists files to add/modify,
- includes public contracts, data flow, error handling, tests, acceptance criteria, and do-not-change constraints,
- splits any step touching more than 3 files.

Hard failure:

- gives generic advice without file-level plan details.

## Observed Behavior

- Files inspected:
  - `src/CreditSimulator.jsx`
  - `src/components/ScenarioMatrix.jsx`
  - `src/lib/costModel.js`
  - `src/styles.css`
  - `src/lib/capacityModel.test.js`
- Files changed: none
- Plan created before edit: yes
- Approval pause before edit: yes
- Source edits made: no
- Validation command identified: `npm test`, `npm run build`
- Validation command run: no
- Result: pass

## Discovery Summary

### Existing Architecture

`CreditSimulator.jsx` owns selected stack, model, plan, and agent profile state. It derives `grid` with `calcScenario(...)` and `comparisonGrid` with `calcAgenticComparison(...)`, then passes the data into `ScenarioMatrix`.

`ScenarioMatrix.jsx` renders the visible table and receives `profileSelector` as injected UI. It does not currently own data derivation.

`costModel.js` owns credit, cost, phase, impact badge, and agentic comparison calculations.

There is no CSV/export boundary yet.

### Relevant Files

- `src/CreditSimulator.jsx` - has all selected inputs and derived matrix rows needed for export.
- `src/components/ScenarioMatrix.jsx` - natural place for an export button near the matrix heading.
- `src/lib/costModel.js` - source of scenario and comparison numbers, should not absorb browser download behavior.
- `src/styles.css` - likely needs a small button style that matches the existing editorial controls.
- `src/lib/capacityModel.test.js` - shows current `node:test` style.

### Existing Patterns To Reuse

- Keep calculation logic in `src/lib`.
- Keep UI components presentational where possible.
- Use native browser APIs; no new dependency.
- Use `node:test` for focused utility tests.
- Preserve existing table semantics and scroll behavior.

### Likely Change Area

Add a small CSV serialization utility, pass an export handler into `ScenarioMatrix`, and add an export button in the matrix section header.

### Risks / Unknowns

- Browser download APIs are not exercised by existing tests.
- CSV column names need to be stable enough for users.
- Export should reflect current selected stack/model/plan/profile, not hardcoded defaults.
- Formatting should avoid locale-specific thousands separators in numeric CSV fields.

### Recommended Direction

Implement a pure `buildScenarioMatrixCsv(...)` helper and test it heavily. Keep the browser download wrapper small inside `CreditSimulator` or a thin utility.

## Implementation Plan

### Milestones

- Milestone 1: CSV data contract and serialization helper.
- Milestone 2: Matrix export UI and browser download wiring.
- Milestone 3: Verification and accessibility pass.

### Target Design

The app exposes a single "Export CSV" action near the matrix heading. The export uses the currently selected project stack, model, plan, and agent comparison profile. It downloads a CSV containing one row per matrix cell.

### Files To Add

- `src/lib/csvExport.js` - pure CSV serialization helpers for scenario matrix rows.
- `src/lib/csvExport.test.js` - tests escaping, headers, current selection metadata, and row count.

### Files To Modify

- `src/CreditSimulator.jsx` - compose export rows from current state and trigger browser download.
- `src/components/ScenarioMatrix.jsx` - accept and render an optional export action.
- `src/styles.css` - style the export control with existing button/rule/accent language.

### Public Contracts

`buildScenarioMatrixCsv(options)`:

```js
export function buildScenarioMatrixCsv({
  rows,
  selectedStack,
  selectedModel,
  selectedPlan,
  selectedAgentProfile,
  planCredits,
}) {
  // return CSV string
}
```

`ScenarioMatrix` prop:

```js
export function ScenarioMatrix({
  grid,
  planCredits,
  activeScenario,
  onScenarioSelect,
  getBadge,
  profileSelector,
  exportAction,
}) {
  // render exportAction near heading if present
}
```

### Data Flow

1. `CreditSimulator` already derives `comparisonGrid`.
2. User clicks export action rendered by `ScenarioMatrix`.
3. Handler calls `buildScenarioMatrixCsv(...)`.
4. Handler creates a Blob, object URL, temporary anchor, and downloads the file.
5. Handler revokes the object URL.

### Error Handling

- If required config keys are missing, CSV helper should still produce explicit fallback labels like `Unknown`.
- If `URL.createObjectURL` or `Blob` is unavailable, the handler should fail silently or log a small console warning; no app crash.
- CSV cells must quote and escape commas, quotes, and line breaks.

### Config / Environment Changes

None.

### Implementation Steps

#### Step 1: Add pure CSV helper

Files: `src/lib/csvExport.js`, `src/lib/csvExport.test.js`

Change: Add serialization helpers and unit tests.

Why: Keeps data formatting testable without browser APIs.

Implementation guidance:

```js
export function escapeCsvCell(value) {
  // stringify nullish values to empty string
  // quote if value contains comma, quote, CR, or LF
  // double internal quotes
}

export function buildScenarioMatrixCsv(options) {
  // create header row
  // flatten comparison grid into one row per scenario cell
  // include stack, model, plan, profile, codebase, scope, credits, cost, agentic credits, savings percent, plan usage percent
  // join rows with newline
}
```

Expected result: CSV output is deterministic and covered by tests.

#### Step 2: Wire export action

Files: `src/CreditSimulator.jsx`, `src/components/ScenarioMatrix.jsx`

Change: Add a click handler in `CreditSimulator` and pass a compact button/control into `ScenarioMatrix`.

Why: `CreditSimulator` has the selected state and derived rows; `ScenarioMatrix` owns the visible matrix toolbar.

Implementation guidance:

```js
function handleExportCsv() {
  // const csv = buildScenarioMatrixCsv(...)
  // const blob = new Blob([csv], { type: "text/csv;charset=utf-8" })
  // create object URL
  // click temporary anchor with stable filename
  // revoke URL
}
```

Expected result: clicking the control downloads current matrix data.

#### Step 3: Style and verify UI

Files: `src/styles.css`

Change: Add a small `.matrix-actions` / `.export-button` style compatible with the existing editorial UI.

Why: Export should not disrupt the matrix heading or agent comparison controls.

Implementation guidance:

```css
.matrix-actions {
  /* compact flex/grid wrapper */
}

.export-button {
  /* reuse 2px rule, field background, uppercase weight */
}
```

Expected result: heading remains compact and usable on desktop and mobile.

### Tests To Add Or Update

- `src/lib/csvExport.test.js`
  - `escapes commas quotes and newlines`
  - `exports one row per scenario matrix cell`
  - `includes current stack model plan and agent profile labels`
  - `uses plain numeric values for credits cost and percentages`

### Acceptance Criteria

- CSV export button is visible near the matrix heading.
- Export includes 9 data rows for the 3x3 matrix.
- Export reflects current selected stack, model, plan, and comparison profile.
- CSV escapes quoted/comma/newline content correctly.
- Existing matrix keyboard and screen-reader behavior remains intact.
- `npm test` passes.
- `npm run build` passes.

### Do Not Change

- Do not change credit/cost formulas.
- Do not change model, plan, stack, scenario, or agent profile values.
- Do not add CSV/download dependencies.
- Do not redesign the matrix.
- Do not persist export data in app state.

## Evidence

Branch status after Scenario 2 planning:

```text
## test/scenario-2-plan-quality-csv-export
```

No source edits were made during the treatment run.

## Score Summary

- Hard gates: 2/2
- Scope control: 2/2
- Plan quality: 2/2
- Ghost scaffold quality: not applicable
- Review quality: not applicable
- Total: 6/6 applicable points

## Failure Notes

- Repeated failure: no
- Skill text likely needs change: no
- Suggested fix: none
