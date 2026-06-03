import { useState } from "react";

const MODELS = {
  balanced: {
    name: "GPT-5.4",
    label: "Balanced",
    inputPer1M: 2.50,
    cachedInputPer1M: 0.25,
    cacheWritePer1M: 0,
    outputPer1M: 15.00,
    color: "#22c55e",
  },
  sonnet: {
    name: "Claude Sonnet 4.6",
    label: "Sonnet",
    inputPer1M: 3.00,
    cachedInputPer1M: 0.30,
    cacheWritePer1M: 3.75,
    outputPer1M: 15.00,
    color: "#f59e0b",
  },
  frontier: {
    name: "GPT-5.5",
    label: "Frontier (avoid)",
    inputPer1M: 5.00,
    cachedInputPer1M: 0.50,
    cacheWritePer1M: 0,
    outputPer1M: 30.00,
    color: "#ef4444",
  },
};

// Token estimates per workflow phase (input, output in tokens)
// Based on: 1 token ≈ 4 chars, codebase context window sizes, typical plan/scaffold outputs
const SCENARIOS = {
  // Codebase sizes
  small: {
    label: "Small",
    desc: "~5k–20k LOC, 1–3 modules",
    contextTokens: 8000,   // files sent as context per invocation
  },
  mid: {
    label: "Medium",
    desc: "~50k–150k LOC, 5–15 modules",
    contextTokens: 25000,
  },
  large: {
    label: "Large",
    desc: "~300k+ LOC, 20+ modules",
    contextTokens: 80000,
  },
};

const FEATURES = {
  small: {
    label: "Small Feature",
    desc: "1–2 files, single function/component",
    phases: {
      discovery: { input: 1.0, output: 0.3 },   // multiplier on context + fixed output
      plan:      { input: 0.8, output: 0.8 },
      scaffold:  { input: 0.6, output: 1.2 },
      review:    { input: 1.2, output: 0.5 },
    },
    steps: 2,
  },
  medium: {
    label: "Medium Feature",
    desc: "3–6 files, new module or API endpoint",
    phases: {
      discovery: { input: 1.5, output: 0.5 },
      plan:      { input: 1.2, output: 1.5 },
      scaffold:  { input: 1.0, output: 2.0 },
      review:    { input: 1.8, output: 0.8 },
    },
    steps: 4,
  },
  large: {
    label: "Large Feature",
    desc: "7–15 files, cross-module integration",
    phases: {
      discovery: { input: 2.5, output: 0.8 },
      plan:      { input: 2.0, output: 2.5 },
      scaffold:  { input: 1.8, output: 3.5 },
      review:    { input: 2.5, output: 1.2 },
    },
    steps: 8,
  },
};

const LANGUAGE_PROFILES = {
  csharp: {
    label: "C#",
    contextTokens: { small: 11000, mid: 36000, large: 105000 },
    outputMultiplier: 1.08,
  },
  python: {
    label: "Python",
    contextTokens: { small: 7500, mid: 24000, large: 70000 },
    outputMultiplier: 0.92,
  },
  react: {
    label: "React",
    contextTokens: { small: 9500, mid: 33000, large: 88000 },
    outputMultiplier: 1.12,
  },
  javascript: {
    label: "JavaScript",
    contextTokens: { small: 8500, mid: 28000, large: 76000 },
    outputMultiplier: 1.0,
  },
  typescript: {
    label: "TypeScript",
    contextTokens: { small: 9500, mid: 31000, large: 84000 },
    outputMultiplier: 1.08,
  },
};

const SKILL_OVERHEAD = 800; // SKILL.md loaded into context each invocation (~800 tokens)
const SCAFFOLD_REF_OVERHEAD = 600; // references/scaffold.md loaded for scaffold phase
const REPEATED_CONTEXT_CACHE_SHARE = 0.25; // Approximation for repeated repo context billed as cached input
const ANTHROPIC_CACHE_WRITE_SHARE = 0.15; // Approximation for Claude cache-write overhead

function calcCost(modelKey, inputTokens, cachedInputTokens, cacheWriteTokens, outputTokens) {
  const m = MODELS[modelKey];
  const inputCost = (inputTokens / 1_000_000) * m.inputPer1M;
  const cachedInputCost = (cachedInputTokens / 1_000_000) * m.cachedInputPer1M;
  const cacheWriteCost = (cacheWriteTokens / 1_000_000) * m.cacheWritePer1M;
  const outputCost = (outputTokens / 1_000_000) * m.outputPer1M;
  return inputCost + cachedInputCost + cacheWriteCost + outputCost;
}

function calcScenario(languageKey, codebaseKey, featureKey, modelKey) {
  const cb = SCENARIOS[codebaseKey];
  const feat = FEATURES[featureKey];
  const lang = LANGUAGE_PROFILES[languageKey];
  const phases = feat.phases;
  const contextTokens = lang.contextTokens[codebaseKey] || cb.contextTokens;
  const outputMultiplier = lang.outputMultiplier || 1;

  const results = {};
  let totalCost = 0;

  const phaseNames = ["discovery", "plan", "scaffold", "review"];
  const phaseLabels = {
    discovery: "Phase 1: Discovery",
    plan: "Phase 2: Plan",
    scaffold: "Phase S: Scaffold",
    review: "Phase 4: Review",
  };

  phaseNames.forEach((p) => {
    const mult = phases[p];
    const totalInput = contextTokens * mult.input + SKILL_OVERHEAD +
      (p === "scaffold" ? SCAFFOLD_REF_OVERHEAD : 0);
    const repeatedContext = contextTokens * mult.input * REPEATED_CONTEXT_CACHE_SHARE;
    const cachedInput = Math.min(totalInput, repeatedContext);
    const uncachedInput = totalInput - cachedInput;
    const cacheWrite = MODELS[modelKey].cacheWritePer1M
      ? repeatedContext * ANTHROPIC_CACHE_WRITE_SHARE
      : 0;
    const baseOutput = 2000 * mult.output * outputMultiplier; // language-adjusted output
    const cost = calcCost(modelKey, uncachedInput, cachedInput, cacheWrite, baseOutput);
    results[p] = {
      label: phaseLabels[p],
      inputTokens: Math.round(uncachedInput),
      cachedInputTokens: Math.round(cachedInput),
      cacheWriteTokens: Math.round(cacheWrite),
      outputTokens: Math.round(baseOutput),
      cost,
    };
    totalCost += cost;
  });

  // Credits: 1 credit = $0.01
  const totalCredits = totalCost / 0.01;

  return { phases: results, totalCost, totalCredits };
}

const PLAN_CREDITS = {
  pro: 1500,
  proPlus: 7000,
  max: 20000,
  business: 1900,
  businessPromo: 3000,
  enterprise: 3900,
  enterprisePromo: 7000,
};

const PLAN_LABELS = {
  pro: "Pro",
  proPlus: "Pro+",
  max: "Max",
  business: "Business standard",
  businessPromo: "Business promo",
  enterprise: "Enterprise standard",
  enterprisePromo: "Enterprise promo",
};

export default function App() {
  const [selectedModel, setSelectedModel] = useState("sonnet");
  const [selectedPlan, setSelectedPlan] = useState("enterprise");
  const [selectedLanguage, setSelectedLanguage] = useState("typescript");
  const [activeScenario, setActiveScenario] = useState(null);

  const planCredits = PLAN_CREDITS[selectedPlan];

  function badge(credits) {
    const pct = (credits / planCredits) * 100;
    if (pct < 5) return { label: "Negligible", color: "#22c55e", bg: "#f0fdf4" };
    if (pct < 15) return { label: "Low", color: "#84cc16", bg: "#f7fee7" };
    if (pct < 35) return { label: "Moderate", color: "#f59e0b", bg: "#fffbeb" };
    if (pct < 70) return { label: "High", color: "#f97316", bg: "#fff7ed" };
    return { label: "Very High", color: "#ef4444", bg: "#fef2f2" };
  }

  const grid = ["small", "mid", "large"].map((cb) =>
    ["small", "medium", "large"].map((feat) => {
      const r = calcScenario(selectedLanguage, cb, feat, selectedModel);
      return { cb, feat, ...r };
    })
  );

  return (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif", background: "#f8fafc", minHeight: "100vh", padding: "24px 16px" }}>
      <div style={{ maxWidth: 960, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#0f172a", margin: 0 }}>
            GitHub Copilot Credit Simulator
          </h1>
          <p style={{ color: "#64748b", fontSize: 13, marginTop: 6 }}>
            Estimates AI Credit consumption using the controlled-coding-workflow skill across codebase sizes and feature complexity.
            Autocomplete and next edit suggestions are not billed in AI credits on paid plans.
          </p>
        </div>

        {/* Controls */}
        <div style={{ display: "flex", gap: 16, marginBottom: 24, flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 200 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>Language</label>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "2px solid #e2e8f0", fontSize: 13, color: "#0f172a", background: "#fff", cursor: "pointer" }}
            >
              {Object.entries(LANGUAGE_PROFILES).map(([k, v]) => (
                <option key={k} value={k}>{v.label}</option>
              ))}
            </select>
          </div>

          <div style={{ flex: 1, minWidth: 200 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>Model</label>
            <div style={{ display: "flex", gap: 8 }}>
              {Object.entries(MODELS).map(([key, m]) => (
                <button
                  key={key}
                  onClick={() => setSelectedModel(key)}
                  style={{
                    flex: 1, padding: "8px 4px", borderRadius: 8, border: `2px solid ${selectedModel === key ? m.color : "#e2e8f0"}`,
                    background: selectedModel === key ? m.color + "18" : "#fff",
                    color: selectedModel === key ? m.color : "#64748b",
                    fontWeight: 600, fontSize: 12, cursor: "pointer"
                  }}
                >
                  {m.label}<br />
                  <span style={{ fontSize: 10, fontWeight: 400 }}>{m.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div style={{ flex: 1, minWidth: 200 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>Your Plan</label>
            <select
              value={selectedPlan}
              onChange={(e) => setSelectedPlan(e.target.value)}
              style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "2px solid #e2e8f0", fontSize: 13, color: "#0f172a", background: "#fff", cursor: "pointer" }}
            >
              {Object.entries(PLAN_LABELS).map(([k, v]) => (
                <option key={k} value={k}>{v} — {PLAN_CREDITS[k].toLocaleString()} credits/mo</option>
              ))}
            </select>
          </div>
        </div>

        {/* Matrix */}
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0 }}>
            <thead>
              <tr>
                <th style={{ padding: "10px 14px", textAlign: "left", fontSize: 12, color: "#64748b", fontWeight: 600, background: "#f1f5f9", borderRadius: "8px 0 0 0" }}>
                  Codebase ↓ / Feature →
                </th>
                {["small", "medium", "large"].map((feat, i) => (
                  <th key={feat} style={{
                    padding: "10px 14px", textAlign: "center", fontSize: 12, color: "#0f172a", fontWeight: 700,
                    background: "#f1f5f9", borderRadius: i === 2 ? "0 8px 0 0" : 0
                  }}>
                    {FEATURES[feat].label}
                    <div style={{ fontWeight: 400, color: "#64748b", fontSize: 11 }}>{FEATURES[feat].desc}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {grid.map((row, ri) => (
                <tr key={row[0].cb}>
                  <td style={{
                    padding: "12px 14px", background: "#f8fafc", borderTop: "1px solid #e2e8f0",
                    fontSize: 12, fontWeight: 700, color: "#0f172a", minWidth: 140
                  }}>
                    {SCENARIOS[row[0].cb].label} Codebase
                    <div style={{ fontWeight: 400, color: "#64748b", fontSize: 11 }}>{SCENARIOS[row[0].cb].desc}</div>
                  </td>
                  {row.map((cell) => {
                    const b = badge(cell.totalCredits);
                    const pct = Math.min(100, (cell.totalCredits / planCredits) * 100);
                    const isActive = activeScenario && activeScenario.cb === cell.cb && activeScenario.feat === cell.feat;
                    return (
                      <td
                        key={cell.feat}
                        onClick={() => setActiveScenario(isActive ? null : cell)}
                        style={{
                          padding: "12px 14px", borderTop: "1px solid #e2e8f0", verticalAlign: "top",
                          background: isActive ? b.bg : "#fff", cursor: "pointer",
                          outline: isActive ? `2px solid ${b.color}` : "none",
                          transition: "background 0.15s"
                        }}
                      >
                        <div style={{ fontSize: 18, fontWeight: 800, color: "#0f172a" }}>
                          {Math.round(cell.totalCredits).toLocaleString()}
                          <span style={{ fontSize: 11, fontWeight: 400, color: "#64748b", marginLeft: 3 }}>credits</span>
                        </div>
                        <div style={{ fontSize: 12, color: "#64748b", marginTop: 1 }}>
                          ${cell.totalCost.toFixed(3)}
                        </div>

                        {/* Impact badge */}
                        <div style={{
                          display: "inline-block", marginTop: 6, padding: "2px 8px",
                          borderRadius: 99, background: b.bg, color: b.color,
                          fontSize: 11, fontWeight: 700, border: `1px solid ${b.color}40`
                        }}>
                          {b.label}
                        </div>

                        {/* Progress bar */}
                        <div style={{ marginTop: 8, background: "#e2e8f0", borderRadius: 99, height: 4 }}>
                          <div style={{ width: `${pct}%`, background: b.color, height: 4, borderRadius: 99 }} />
                        </div>
                        <div style={{ fontSize: 10, color: "#94a3b8", marginTop: 3 }}>
                          {pct.toFixed(1)}% of monthly plan
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Phase breakdown panel */}
        {activeScenario && (
          <div style={{ marginTop: 20, background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0", padding: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
              <div>
                <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#0f172a" }}>
                  Phase Breakdown — {SCENARIOS[activeScenario.cb].label} Codebase × {FEATURES[activeScenario.feat].label}
                </h3>
                <p style={{ margin: "4px 0 0", fontSize: 12, color: "#64748b" }}>
                  Language: {LANGUAGE_PROFILES[selectedLanguage].label} · Model: {MODELS[selectedModel].name} · Click any cell to see its breakdown
                </p>
              </div>
              <button
                onClick={() => setActiveScenario(null)}
                style={{ background: "none", border: "none", fontSize: 18, cursor: "pointer", color: "#94a3b8", lineHeight: 1 }}
              >×</button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12 }}>
              {Object.entries(activeScenario.phases).map(([key, ph]) => (
                <div key={key} style={{ background: "#f8fafc", borderRadius: 8, padding: "12px 14px", border: "1px solid #e2e8f0" }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#64748b", marginBottom: 6 }}>{ph.label}</div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: "#0f172a" }}>
                    {Math.round(ph.cost / 0.01).toLocaleString()}
                    <span style={{ fontSize: 11, fontWeight: 400, color: "#64748b", marginLeft: 3 }}>credits</span>
                  </div>
                  <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 4 }}>
                    {ph.inputTokens.toLocaleString()} in · {ph.cachedInputTokens.toLocaleString()} cached · {ph.outputTokens.toLocaleString()} out
                    {ph.cacheWriteTokens > 0 ? ` · ${ph.cacheWriteTokens.toLocaleString()} cache write` : ""}
                  </div>
                </div>
              ))}
            </div>

            {/* Key insight */}
            <div style={{ marginTop: 16, background: "#f0f9ff", borderRadius: 8, padding: "12px 14px", border: "1px solid #bae6fd" }}>
              <div style={{ fontSize: 12, color: "#0369a1", fontWeight: 600 }}>💡 Skill advantage</div>
              <div style={{ fontSize: 12, color: "#0369a1", marginTop: 4 }}>
                The permission gate means only 4 invocations per feature (discovery, plan, scaffold, review) — no runaway agentic sessions.
                Without the skill, an unconstrained agent on a {SCENARIOS[activeScenario.cb].label.toLowerCase()} codebase
                typically runs 15–40 tool calls, consuming <strong>4×–10× more credits</strong>.
              </div>
            </div>
          </div>
        )}

        {/* Footer note */}
        <div style={{ marginTop: 20, padding: "12px 16px", background: "#fefce8", borderRadius: 8, border: "1px solid #fde68a" }}>
          <div style={{ fontSize: 12, color: "#92400e", fontWeight: 600 }}>⚠️ Estimates only</div>
          <div style={{ fontSize: 12, color: "#92400e", marginTop: 4 }}>
            Token counts are modelled approximations based on typical codebase context windows and skill output sizes.
            Actual consumption varies by codebase, feature complexity, and how much context you pass.
            Inline autocomplete and next edit suggestions are not counted here.
            Economy/mini models are excluded — unreliable output causes iteration cycles that cost more than the token savings.
            <strong> Recommended: GPT-5.4 or Claude Sonnet 4.6 for all phases.</strong> Frontier models (GPT-5.5, Opus) shown as reference only — the cost premium is not justified for most structured planning and scaffolding work.
            1 credit = $0.01 USD. Pricing assumptions reflect GitHub Copilot docs as of June 2026.
          </div>
        </div>
      </div>
    </div>
  );
}
