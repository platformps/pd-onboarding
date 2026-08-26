/* Adds rule 5e: activity monotony. */
const fs = require("fs");
const lines = fs.readFileSync("check.js", "utf8").split("\n");
if (lines.some((l) => l.includes("5e. activity variety"))) {
  console.log("already present");
  process.exit(0);
}
const at = lines.findIndex((l) => l.includes("5c. SPEC.md budgets"));
if (at < 0) throw new Error("marker missing");

const rule = [
  "/* ---------- 5e. the interaction has to vary, or the format stops teaching ---------- */",
  'head("5e. activity variety");',
  "{",
  "  const acts = seq.map((s, i) => ({ i, type: s.m.activity && s.m.activity.type })).filter(a => a.type);",
  "  let run = 1;",
  "  for (let k = 1; k < acts.length; k++) {",
  "    if (acts[k].type === acts[k - 1].type) {",
  "      run++;",
  "      if (run === 3)",
  '        fail("monotony", `${label(acts[k - 2].i)} starts ${run}+ consecutive "${acts[k].type}" activities. A learner pattern-matches the interaction instead of the content.`);',
  "    } else run = 1;",
  "  }",
  "  const tally = {};",
  "  acts.forEach(a => { tally[a.type] = (tally[a.type] || 0) + 1; });",
  "  Object.entries(tally).sort((a, b) => b[1] - a[1]).forEach(([t, n]) => {",
  "    const pct = Math.round((n / acts.length) * 100);",
  "    console.log(`  ${String(n).padStart(2)} x ${t.padEnd(9)} ${pct}%`);",
  '    if (pct > 33) fail("monotony", `"${t}" is ${pct}% of all activities (${n} of ${acts.length}). No single interaction should exceed a third.`);',
  "  });",
  "}",
  "",
];
lines.splice(at, 0, ...rule);
fs.writeFileSync("check.js", lines.join("\n"));
console.log("rule 5e added");
