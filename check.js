#!/usr/bin/env node
/* check.js - guards the promises this course makes about itself.
   Run after every content change:  node check.js
   Exits non-zero on failure so a bad edit cannot quietly ship. */
const fs = require("fs"),
  cp = require("child_process");

let FAIL = 0,
  WARN = 0;
const fail = (rule, msg) => {
  console.log(`  FAIL [${rule}] ${msg}`);
  FAIL++;
};
const warn = (rule, msg) => {
  console.log(`  warn [${rule}] ${msg}`);
  WARN++;
};
const head = (t) => console.log(`\n${t}`);

/* ---------- 1. everything parses ---------- */
head("1. syntax");
for (const f of [
  "course.js",
  "engine.js",
  "guide.js",
  "storage.js",
  "build.js",
]) {
  try {
    cp.execSync(`node --check ${f}`, { stdio: "pipe" });
    console.log(`  ok   ${f}`);
  } catch (e) {
    fail("syntax", `${f}: ${String(e.stderr).split("\n")[2] || e.message}`);
  }
}

/* ---------- 2. unit files are generated, not hand-edited ---------- */
head("2. no drift between unit files and the template");
const tpl = fs.readFileSync("unit.template.html", "utf8");
const { UNITS } = require("./build.js");
for (const u of UNITS) {
  const want = tpl
    .split("{{TITLE}}")
    .join(u.title)
    .split("{{HEADING}}")
    .join(u.heading)
    .split("{{DAY}}")
    .join(u.day);
  const got = fs.existsSync(`unit${u.day}.html`)
    ? fs.readFileSync(`unit${u.day}.html`, "utf8")
    : "";
  if (want !== got)
    fail(
      "drift",
      `unit${u.day}.html differs from the template. Edit course.js, then run: node build.js`,
    );
  else console.log(`  ok   unit${u.day}.html`);
}

/* ---------- load the course ---------- */
global.gl = (id, txt) => `<span class="glink" data-g="${id}">${txt}</span>`;
global.ST = { mem: {}, track: null };
const ALL = eval(fs.readFileSync("course.js", "utf8") + "\nALL");
const seq = [];
for (const g of ALL)
  for (const m of g.lessons) seq.push({ day: g.day, mod: g.mod, m });
const textOf = (m) => {
  const p = [];
  const w = (v) => {
    if (v == null) return;
    if (typeof v === "string") p.push(v);
    else if (typeof v === "function") {
      try {
        w(v());
      } catch (e) {}
    } else if (Array.isArray(v)) v.forEach(w);
    else if (typeof v === "object") Object.values(v).forEach(w);
  };
  w(m);
  return p.join("\n");
};
const norm = (t) =>
  t.toLowerCase().split("&amp;").join("and").split(" & ").join(" and ");
const texts = seq.map((s) => textOf(s.m));
const label = (i) => `#${i} d${seq[i].day} ${seq[i].m.id}`;

/* ---------- 3. no term used before it is taught ---------- */
head("3. every term is taught the moment it is first needed");
const TERMS = [
  ["KBA", "knowledge-based assessment"],
  ["SBA", "skill-based assessment"],
  ["GLAB", "guided lab"],
  ["ALAB", "assignment lab"],
  ["FG", "facilitator guide"],
  ["ILAB", "independent lab"],
  ["MBP", "module blueprint"],
  ["UCI", "unique course identifier"],
  ["IDQA", "instructional design and quality assurance"],
  ["SME", "subject matter expert"],
  ["WCAG", "web content accessibility guidelines"],
];
for (const [t, def] of TERMS) {
  let use = -1,
    defd = -1;
  texts.forEach((tx, i) => {
    const low = norm(tx);
    if (use < 0 && tx.includes(t)) use = i;
    if (defd < 0 && low.includes(def)) defd = i;
  });
  if (use < 0) continue;
  if (defd < 0)
    fail(
      "vocab",
      `${t} is used at ${label(use)} but "${def}" never appears anywhere.`,
    );
  else if (defd > use)
    fail(
      "vocab",
      `${t} used at ${label(use)} but not defined until ${label(defd)} (${defd - use} lessons late).`,
    );
  else console.log(`  ok   ${t} defined at ${label(defd)}`);
}

/* ---------- 4. lessons sit in the unit their crumb claims ---------- */
head("4. no lesson is filed in the wrong unit");
seq.forEach((s, i) => {
  const mm = /Unit (\d)/.exec(s.m.crumb || "");
  if (mm && mm[1] !== String(s.day))
    fail(
      "misfiled",
      `${label(i)} "${s.m.title}" is in unit ${s.day} but its crumb says Unit ${mm[1]}.`,
    );
});
if (!FAIL) console.log("  ok   all crumbs agree with their unit");

/* ---------- 5. every activity states its mechanic ---------- */
head("5. every activity says how it works");
const VERBS =
  /\b(select|choose|click|drag|drop|sort|tick|type|write|press|approve|send back|place|order|rank|match|fill|answer|pick|jot|save|walk|score|route|commit|reflect)\b/i;
seq.forEach((s, i) => {
  const a = s.m.activity;
  if (!a) return;
  const coach = typeof s.m.coach === "function" ? s.m.coach() : s.m.coach || "";
  if (!coach.trim())
    fail(
      "mechanic",
      `${label(i)} has a ${a.type} activity with no coach text telling the learner what to do.`,
    );
  else if (!VERBS.test(coach))
    warn(
      "mechanic",
      `${label(i)} coach text never names a concrete action (${a.type}).`,
    );
});

/* ---------- 5b. every activity is framed before the learner is dropped into it ---------- */
head("5b. no activity starts before the learner knows what job they are doing");
seq.forEach((s, i) => {
  if (!s.m.activity) return;
  if (!s.m.frame)
    fail(
      "frame",
      `${label(i)} "${s.m.title}" drops the learner into a ${s.m.activity.type} activity with no frame saying what their role is or which rule applies.`,
    );
});

/* ---------- 5d. a review item must not dead-end the queue ---------- */
head("5d. no review item dead-ends the queue");
seq.forEach((s, i) => {
  const a = s.m.activity;
  if (!a || a.type !== "review" || !a.items) return;
  a.items.forEach((it, n) => {
    if (it.good) return;
    // Send back is the correct verdict here, and the engine renders it.reasons.
    // An empty list renders no buttons; the engine now auto-advances that case.
    if (!it.reasons || !it.reasons.length) return;
    if (!it.reasons.some((r) => r.ok))
      fail("deadend", `${label(i)} item ${n + 1} offers reasons but none is marked ok:true, so the queue cannot advance.`);
  });
});

/* ---------- 5e. the interaction has to vary, or the format stops teaching ---------- */
head("5e. activity variety");
{
  const acts = seq.map((s, i) => ({ i, type: s.m.activity && s.m.activity.type })).filter(a => a.type);
  let run = 1;
  for (let k = 1; k < acts.length; k++) {
    if (acts[k].type === acts[k - 1].type) {
      run++;
      if (run === 3)
        fail("monotony", `${label(acts[k - 2].i)} starts ${run}+ consecutive "${acts[k].type}" activities. A learner pattern-matches the interaction instead of the content.`);
    } else run = 1;
  }
  const tally = {};
  acts.forEach(a => { tally[a.type] = (tally[a.type] || 0) + 1; });
  Object.entries(tally).sort((a, b) => b[1] - a[1]).forEach(([t, n]) => {
    const pct = Math.round((n / acts.length) * 100);
    console.log(`  ${String(n).padStart(2)} x ${t.padEnd(9)} ${pct}%`);
    if (pct > 33) fail("monotony", `"${t}" is ${pct}% of all activities (${n} of ${acts.length}). No single interaction should exceed a third.`);
  });
}

/* ---------- 5c. SPEC.md budgets: prose length and box count ---------- */
head("5c. lesson budgets (SPEC.md)");
const htmlOf = (m) => {
  let h = m.html;
  if (typeof h === "function") {
    try {
      h = h();
    } catch (e) {
      h = "";
    }
  }
  return String(h || "");
};
// SVG labels are not prose, so they do not count against a lesson's word budget
const SVG_RE = new RegExp("<svg[\\s\\S]*?</svg>", "g");
const TAG_RE = new RegExp("<[^>]+>", "g");
const stripTags = (t) =>
  t.replace(SVG_RE, " ").replace(TAG_RE, " ").replace(/\s+/g, " ").trim();
seq.forEach((s, i) => {
  const h = htmlOf(s.m);
  const words = stripTags(h).split(" ").filter(Boolean).length;
  const budget = (s.m.mins || 0) * 45;
  const boxes = (h.match(/class="box/g) || []).length;
  if (budget && words > budget * 1.15)
    fail(
      "budget",
      `${label(i)} "${s.m.title}" is ${words} words against a ${budget}-word budget for ${s.m.mins} min.`,
    );
  if (boxes > 2)
    fail(
      "boxes",
      `${label(i)} uses ${boxes} boxes; SPEC allows 2. Vary the presentation.`,
    );
});

/* ---------- 6. unit weight is balanced ---------- */
head("6. unit weight");
// The capstone is 16 hours of take-home work, so its planning page is not unit time.
const mins = {};
seq.forEach((s) => {
  if (/Capstone/i.test(s.mod || "")) return;
  mins[s.day] = (mins[s.day] || 0) + (s.m.mins || 0);
});
const unitDays = Object.keys(mins).filter((d) => d !== "0"); // orientation is short by design
const vals = unitDays.map((d) => mins[d]),
  max = Math.max(...vals),
  min = Math.min(...vals);
Object.keys(mins).forEach((d) =>
  console.log(`  ${d === "0" ? "orient" : "unit " + d}: ${mins[d]} min`),
);
// Reported, not enforced: unit length is a content decision, not a defect.
console.log(`  spread ${min}-${max} min across the units`);

/* ---------- 7. no repeated block inside a lesson ---------- */
head("7. no duplicated content inside a lesson");
const STOP = new Set(
  "the a an and or of to in is are it that this for on with as be by not you your we our their they".split(
    " ",
  ),
);
const bag = (t) =>
  new Set(
    t
      .toLowerCase()
      .replace(/[^a-z ]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length > 3 && !STOP.has(w)),
  );
const jac = (a, b) => {
  let i = 0;
  for (const x of a) if (b.has(x)) i++;
  return i / (a.size + b.size - i);
};
seq.forEach((s, idx) => {
  let h = s.m.html;
  if (typeof h === "function") {
    try {
      h = h();
    } catch (e) {
      h = "";
    }
  }
  const parts = String(h || "")
    .split(/<\/(?:p|div)>/)
    .map((x) =>
      x
        .replace(/<[^>]+>/g, " ")
        .replace(/\s+/g, " ")
        .trim(),
    )
    .filter((x) => x.length > 100);
  for (let a = 0; a < parts.length; a++)
    for (let b = a + 1; b < parts.length; b++)
      if (jac(bag(parts[a]), bag(parts[b])) > 0.45)
        fail(
          "duplicate",
          `${label(idx)} repeats itself: "${parts[a].slice(0, 60)}..." / "${parts[b].slice(0, 60)}..."`,
        );
});

/* ---------- 8. every lesson bridges from the one before ---------- */
head("8. every lesson connects to the one before it");
seq.forEach((s, i) => {
  if (i === 0) return;
  if (!s.m.bridge || !String(s.m.bridge).trim())
    warn(
      "bridge",
      `${label(i)} "${s.m.title}" has no bridge from ${seq[i - 1].m.id}.`,
    );
});

/* ---------- report ---------- */
console.log(`\n${"=".repeat(60)}\n${FAIL} failures, ${WARN} warnings\n`);
process.exit(FAIL ? 1 : 0);
