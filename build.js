#!/usr/bin/env node
/* build.js - regenerates unit0..4.html from unit.template.html, and the unit cards
   on index.html from the real lesson data in course.js.

   Lesson content lives in course.js. The runtime lives in engine.js.
   Never edit unit*.html by hand: this script overwrites them.
   Minutes on the landing page are computed, never typed, so they cannot drift. */
const fs = require("fs");

const UNITS = [
  {
    day: "1",
    title: "Unit 1: Welcome & Intake",
    heading: "Unit 1: Welcome & Intake",
    accent: "#004878",
    blurb:
      "What Per Scholas does, where your work lands, and the four responsibilities the job is made of. Then the work itself: how a course is put together, how a build travels the seven pipeline steps, how to answer Design on a package that is not quite ready, and how to stage the module repo so anyone can pick it up.",
  },
  {
    day: "2",
    title: "Unit 2: Planning the Module",
    heading: "Unit 2: Planning the Module",
    accent: "#0078c0",
    blurb:
      "Planning, not building. Work backward from what learners must prove: review the draft objectives, decide what the module must contain, plan the formative and summative checks and where they fall, budget a 240-minute lesson package against the activated-learning bar, and design the workplace the lessons run inside.",
  },
  {
    day: "3",
    title: "Unit 3: Building Content",
    heading: "Unit 3: Building Content",
    accent: "#009cd8",
    blurb:
      "Executing the plan, and the longest unit because it is where the course gets made. Repair a lab so it survives a room, write a knowledge item and run a review queue, build the skills-based assessment and the rubric that scores it, test whether that rubric holds between two graders, audit against WCAG 2.1 AA, and use AI without handing over the judgment that is your job.",
  },
  {
    day: "4",
    title: "Unit 4: Handoff & Revision",
    heading: "Unit 4: Handoff & Revision",
    accent: "#0c4878",
    blurb:
      "The last stretch, and every review gate that stands between a built module and a cohort. Clear Development Review, assemble the blueprint, write the facilitator guide, answer QA findings, hand the course to Delivery, get the instructors ready to teach it, then route the changes that come back and read what the cohort evidence says.",
  },
];

if (require.main !== module) {
  module.exports = { UNITS };
  return;
}

/* ---------- 1. the unit pages ---------- */
const tpl = fs.readFileSync("unit.template.html", "utf8");
for (const u of UNITS) {
  const out = tpl
    .split("{{TITLE}}")
    .join(u.title)
    .split("{{HEADING}}")
    .join(u.heading)
    .split("{{DAY}}")
    .join(u.day);
  fs.writeFileSync(`unit${u.day}.html`, out);
  console.log(`wrote unit${u.day}.html  (${u.title})`);
}

/* ---------- 2. the landing page cards, with minutes read from the real lessons ---------- */
global.gl = (id, txt) => txt || id;
global.ST = { mem: {}, track: null };
const ALL = eval(fs.readFileSync("course.js", "utf8") + "\nALL");
const isCapstone = (g) => /Capstone/i.test(g.mod || "");
const minsFor = (day) =>
  ALL.filter((g) => String(g.day) === String(day) && !isCapstone(g)).reduce(
    (s, g) => s + g.lessons.reduce((t, l) => t + (l.mins || 0), 0),
    0,
  );

const cards = UNITS.map((u) => {
  const label =
    u.day === "0" ? "Start here" : u.title.replace(/^Unit (\d): /, "Unit $1: ");
  const cta = u.day === "0" ? "Start here" : `Open Unit ${u.day}`;
  return `  <a href="unit${u.day}.html" style="display:block;text-decoration:none;background:#ffffff;border:1px solid #e2dccf;border-left:5px solid ${u.accent};border-radius:10px;padding:16px 20px;margin-bottom:12px;">
    <div style="display:flex;justify-content:space-between;flex-wrap:wrap;align-items:baseline;gap:8px;">
      <div style="font-weight:bold;font-size:16px;color:#12283f;">${label}</div>
      <div style="font-family:'IBM Plex Mono',ui-monospace,monospace;font-size:11px;color:#59697a;">~${minsFor(u.day)} min</div>
    </div>
    <p style="font-size:14px;color:#42566a;margin:8px 0 10px;">${u.blurb}</p>
    <div style="font-size:13.5px;font-weight:bold;color:#004878;">${cta} &rarr;</div>
  </a>`;
}).join("\n\n");

const MONO = "font-family:'IBM Plex Mono',ui-monospace,monospace";
const capstoneCard =
  `  <a href="unit4.html" style="display:block;text-decoration:none;background:#ffffff;border:1px solid #e2dccf;border-left:5px solid #15755a;border-radius:10px;padding:16px 20px;margin-bottom:12px;">
    <div style="display:flex;justify-content:space-between;flex-wrap:wrap;align-items:baseline;gap:8px;">
      <div style="font-weight:bold;font-size:16px;color:#12283f;">Capstone: Module Development Package</div>
      <div style="${MONO};font-size:11px;color:#59697a;">~16 hours</div>
    </div>
    <p style="font-size:14px;color:#42566a;margin:8px 0 10px;">Take a module objective, plan how it gets met, and build one lesson of it for real: eight items filed in a repo you name yourself. Your manager reviews it against the standards you have been working to. Nothing is graded, and it is not done in one sitting.</p>
    <div style="font-size:13.5px;font-weight:bold;color:#004878;">Open the capstone &rarr;</div>
  </a>`;

let idx = fs.readFileSync("index.html", "utf8");
const START = "<!-- UNITS:START -->",
  END = "<!-- UNITS:END -->";
if (idx.includes(START) && idx.includes(END)) {
  idx =
    idx.slice(0, idx.indexOf(START) + START.length) +
    "\n" +
    cards +
    "\n\n" +
    capstoneCard +
    "\n  " +
    idx.slice(idx.indexOf(END));
  fs.writeFileSync("index.html", idx);
  const total = UNITS.reduce((s, u) => s + minsFor(u.day), 0);
  console.log(`wrote index.html unit cards (${total} min total)`);
} else {
  console.log(
    "index.html has no UNITS:START/UNITS:END markers - cards left alone",
  );
}
