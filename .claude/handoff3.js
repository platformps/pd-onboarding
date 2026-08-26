/* Two corrections to the handoff lesson:
   - the handover is one event at the end of development, not module by module,
     and the CBP is the container holding every module blueprint
   - the sort covers only what Development hands over. The Canvas build and
     cohort grades are somebody else's output and do not belong in the exercise. */
const fs = require("fs");
let s = fs.readFileSync("course.js", "utf8");
let n = 0;

const R = [
  [
    "Two levels leave the team at once.</strong> Each module hands over its own package, the course hands over the documents written once for all of them, and ${gl('deliverables','the deliverables checklist')} names both lists.</p>",
    "The handover happens once, at the end of development.</strong> Everything goes at the same time, because Delivery does the Canvas build in one pass and a course arriving module by module leaves them rebuilding around gaps. ${gl('deliverables','The deliverables checklist')} names what sits at each level.</p>",
  ],
  [
    "index the Canvas team builds from. Every file on it exists, is named to convention, and is linked.</div>",
    "index the Canvas team builds from, and it holds every module blueprint in the course. Every file on it exists, is named to convention, and is linked.</div>",
  ],
  // the exercise is about what Development hands over, nothing else
  ['{k:"n",label:"Not ours to hand over"}', ""],
  [',{t:"The Canvas course, built and published",k:"n"}', ""],
  [',{t:"Cohort grades and learner submissions",k:"n"}', ""],
  ['{t:"The Canvas course, built and published",k:"n"},', ""],
  ['{t:"Cohort grades and learner submissions",k:"n"},', ""],
];

for (const [a, b] of R) {
  if (!s.includes(a)) continue;
  s = s.split(a).join(b);
  n++;
}
// tidy any comma left dangling by the removals
s = s
  .replace(/,\s*\]/g, "]")
  .replace(/\[\s*,/g, "[")
  .replace(/,\s*,/g, ",");

fs.writeFileSync("course.js", s);
console.log(`${n} handoff corrections applied`);
