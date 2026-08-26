#!/usr/bin/env node
/* prose.js - flags AI-writing tells and banned words in the course copy.
   Rules come from .claude/skills/writing-guidelines (Vercel writing guidelines),
   keeping only what applies to course prose rather than API docs.

   Usage:  node prose.js            all files
           node prose.js course.js  one file
           node prose.js --count    totals only */

const fs = require("fs");

const FILES = ["course.js", "guide.js", "index.html"];
const args = process.argv.slice(2);
const countOnly = args.includes("--count");
const targets = args.filter((a) => !a.startsWith("--"));
const files = targets.length ? targets : FILES;

/* Each rule: name, a matcher over the plain-text of a line, and a fix hint. */
const rules = [
  {
    id: "british",
    re: /(behaviour|colour|judgement|licence|practise|practising|recognise|organise|organisation|realise|summarise|prioritise|analyse|catalogue|whilst|amongst|learnt|defence|favour|labour|centred)w*/gi,
    hint: "British spelling: this course is written in American English",
  },

  {
    id: "banned",
    re: /\b(easy|easily|simple|simply|quick|quickly|very|really)\b/gi,
    hint: "banned word: pressures the reader, or is filler. Name the concrete thing instead",
  },

  {
    id: "just",
    re: /\bjust\b/gi,
    hint: "filler 'just': cut it or rewrite the sentence",
  },

  {
    id: "vague",
    re: /\b(significantly|typically|generally|usually|often|many|most people|some people|a lot of|plenty of)\b/gi,
    hint: "vague quantifier: give the specific number or make a definitive claim",
  },

  {
    id: "emdash",
    re: /—|\s-\s/g,
    hint: "em dash or hyphen as punctuation: use a colon, comma, or period",
  },

  {
    id: "ellipsis",
    re: /\.\.\./g,
    hint: "three dots: use the ellipsis character",
  },

  {
    id: "specsheet",
    re: /\b(provides|is configurable|allows you to|enables you to|is designed to|serves to|facilitates|leverages|utilise|utilize)\b/gi,
    hint: "spec-sheet voice: name the action a person takes",
  },

  {
    id: "metaphor",
    re: /\b(lands on your desk|hits the|travels the|moves through the|carries the load|under the hood|at the end of the day|the north star)\b/gi,
    hint: "metaphor verb or cliche: name the literal step",
  },

  {
    id: "recap",
    re: /(^|[.>]\s*)(With (that|this)\b|Now that\b|Having (now )?\w+ed\b|So far,|Everything so far|As we(?:'| ha)ve seen)/g,
    hint: "summary-style transition recapping the previous paragraph: pivot straight to the point",
  },

  {
    id: "nthings",
    re: /\b(The|What) (two|three|four|five|six) (things|parts|tests|rules|moves|questions|checks|levels|traps|responsibilities|patterns)\b/gi,
    scope: "headings",
    hint: "'The N things' template heading: this formula repeats across the course",
  },

  {
    id: "weasel",
    re: /\b(it['’]s worth noting|it is worth noting|keep in mind|remember that|of course|needless to say|arguably)\b/gi,
    hint: "filler phrase: delete it",
  },

  {
    id: "rhetorical",
    re: /\?(<\/(b|em|strong|span)>)?\s*(<\/p>|$)/g,
    onlyIf: /^\s*<p[ >]/,
    hint: "paragraph ending in a rhetorical question: state the point instead",
  },

  {
    id: "notonly",
    re: /\bnot only\b[^.]{0,80}\bbut also\b/gi,
    hint: "'not only ... but also': flattens into one clause",
  },

  {
    id: "isnt-about",
    re: /\bis(n['’]t| not) (just )?about\b|\bis(n['’]t| not) (a|the) \w+, it['’]s\b/gi,
    hint: "'X isn't about Y, it's about Z' construction: a strong AI tell",
  },
];

/* Phrases that are deliberate: quoted wrong answers a learner picks, quoted excuses,
   and named block types. These are voice, not slips, so the scanner leaves them alone. */
const ALLOW = [
  "quick check",
  "too easy a topic for a KBA",
  "too easy for this module",
  "Simple modules are allowed blank sections",
  "It was free and quick",
  "Printers are too easy",
  // guide.js: these are real category names, the file-naming pattern, and the mission line
  "quick activity",
  "Quick activity",
  "how many days",
  "how many quizzes",
  "too often excluded",
  "(.Item) —",
  "301.1 —", "301.1.1 —", "301.2 —", "301 —", "CAP —",
];

/* Strip markup so attributes and SVG coordinates do not create noise. */
function plain(line) {
  return line
    .replace(/<svg[\s\S]*?<\/svg>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/https?:\/\/\S+/g, " ")
    .replace(
      /\\u[0-9a-fA-F]{4}/g,
      (m) =>
        ({ "\\u2019": "’", "\\u201C": "“", "\\u201D": "”", "\\u2014": "—" })[
          m
        ] || " ",
    )
    .replace(/\s+/g, " ");
}

const totals = {};
let grand = 0;

for (const file of files) {
  if (!fs.existsSync(file)) {
    console.log(`(skipped ${file}: not found)`);
    continue;
  }
  const lines = fs.readFileSync(file, "utf8").split("\n");
  const found = [];

  lines.forEach((raw, i) => {
    const text = plain(raw);
    if (text.trim().length < 12) return;
    const scrub = ALLOW.reduce((s, a) => s.split(a).join(" "), text);
    // headings only: box headers and the lesson title field
    const headings = [
      ...(raw.match(/<span class="bh">[^<]*/g) || []).map((h) => h.replace(/<span class="bh">/, "")),
      ...(raw.match(/title:"[^"]*"/g) || []).map((h) => h.slice(7, -1)),
    ].join(" | ");
    for (const rule of rules) {
      if (rule.onlyIf && !rule.onlyIf.test(raw)) continue;
      rule.re.lastIndex = 0;
      const hits = (rule.scope === "headings" ? headings : scrub).match(rule.re);
      if (!hits) continue;
      const uniq = [...new Set(hits.map((h) => h.trim()))].filter(Boolean);
      if (!uniq.length) continue;
      totals[rule.id] = (totals[rule.id] || 0) + uniq.length;
      grand += uniq.length;
      found.push({ line: i + 1, id: rule.id, hits: uniq, hint: rule.hint });
    }
  });

  if (!countOnly) {
    console.log(`\n## ${file}\n`);
    if (!found.length) {
      console.log("  pass");
      continue;
    }
    for (const f of found) {
      console.log(
        `${file}:${f.line} - ${f.id}: ${f.hits
          .slice(0, 4)
          .map((h) => `"${h}"`)
          .join(", ")}`,
      );
    }
  }
}

console.log(`\n${"=".repeat(58)}`);
Object.entries(totals)
  .sort((a, b) => b[1] - a[1])
  .forEach(([id, n]) => {
    const r = rules.find((x) => x.id === id);
    console.log(`  ${String(n).padStart(4)}  ${id.padEnd(11)} ${r.hint}`);
  });
console.log(`  ${String(grand).padStart(4)}  total\n`);
