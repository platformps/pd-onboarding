/* Three video fixes:
   - The Veritasium myth video argues this course's own thesis and was only linked
     from the Handbook. It belongs in w0, where the thesis is taught.
   - The two embedded videos are a workshop and a full lecture dropped into six and
     seven minute unit openers. Their runtime is now stated and the task is timeboxed.
   - drev's title named a decision rather than the work. */
const fs = require("fs");
const lines = fs.readFileSync("course.js", "utf8").split("\n");
let n = 0;

/* 1. Veritasium into w0 */
const S = lines.findIndex((l) => l.startsWith('{id:"w0",'));
if (S < 0) throw new Error("w0 not found");
let hi = -1;
for (let i = S; i < S + 25; i++)
  if (/^ html:/.test(lines[i])) {
    hi = i;
    break;
  }
if (hi < 0) throw new Error("w0 html not found");
let he = hi;
while (he < lines.length && !/`,\s*$/.test(lines[he])) he++;

const video =
  ' <div class="video"><iframe src="https://www.youtube.com/embed/rhgwIhB58PA" title="Veritasium: The Biggest Myth in Education" loading="lazy" allowfullscreen></iframe></div>' +
  '<div class="vidcap">🎯 <b>Watch task, 14 minutes.</b> Veritasium tests whether teaching to a learner’s preferred style improves anything, and finds it does not. Watch for what he replaces it with: evidence of what the learner can do. That is the same move our objectives make, and it is why this page argues for evidence rather than preference. (<a href="https://www.youtube.com/watch?v=rhgwIhB58PA" target="_blank" rel="noopener">Open on YouTube</a>)</div>';
lines.splice(he, 0, video);
n++;

/* 2. timebox the two long videos */
let s = lines.join("\n");
const R = [
  [
    "🎯 <b>Watch task:</b> listen for how Wiggins separates",
    "🎯 <b>Watch task, first 12 minutes.</b> This is a full workshop recording; you do not need all of it now. Listen for how Wiggins separates",
  ],
  [
    "🎯 <b>Watch task (or save for the evening):</b>",
    "🎯 <b>Watch task, first 15 minutes, or save the hour for later.</b>",
  ],
  [
    '{id:"drev",title:"Decide what the next revision inherits",',
    '{id:"drev",title:"Read the cohort evidence",',
  ],
];
for (const [a, b] of R) {
  if (!s.includes(a)) {
    console.log("  MISS: " + a.slice(0, 60));
    continue;
  }
  s = s.split(a).join(b);
  n++;
}

fs.writeFileSync("course.js", s);
console.log(`${n}/4 video and title fixes applied`);
