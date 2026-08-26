/* No permissions list exists. Per the course owner: we use vendor content we have
   purchased, and third-party content we are allowed to copy with attribution.
   Removes it from the handoff lesson and corrects the Handbook's deliverables list. */
const fs = require("fs");

let c = fs.readFileSync("course.js", "utf8");
const CR = [
  // specimen row: attribution is the real obligation, not a permissions document
  [
    ' Permissions list<span class="an"> &nbsp;cleared for every piece of third-party content, or a no-copyright statement in its place</span></div>',
    ' Attribution<span class="an"> &nbsp;every third-party item either purchased from the vendor or cleared to copy with credit given</span></div>',
  ],
  [
    "Both blueprint templates, the syllabus and the permissions list are in ${gl('templates','templates &amp; links')}.",
    "Both blueprint templates and the syllabus are in ${gl('templates','templates &amp; links')}.",
  ],
  [
    '   {t:"Permissions list, or the no-copyright statement",k:"c"}],',
    '   {t:"Syllabus attribution for purchased vendor content",k:"c"}],',
  ],
];
let n = 0;
for (const [a, b] of CR) {
  if (!c.includes(a)) {
    console.log("  MISS (course): " + a.slice(0, 55));
    continue;
  }
  c = c.split(a).join(b);
  n++;
}
fs.writeFileSync("course.js", c);
console.log(`course.js: ${n}/${CR.length} permissions references corrected`);

let g = fs.readFileSync("guide.js", "utf8");
const GA =
  "training schedule, permissions list (or the no-copyright statement).";
const GB =
  "training schedule. Third-party material is either purchased from the vendor or used with attribution, so there is no separate permissions document.";
if (g.includes(GA)) {
  g = g.split(GA).join(GB);
  fs.writeFileSync("guide.js", g);
  console.log("guide.js: deliverables checklist corrected");
} else {
  console.log("guide.js: MISS");
}
