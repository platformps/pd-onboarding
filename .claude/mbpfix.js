/* mbp was the worst wall of text in the course: 435 words, no visual, and a closing
   instruction left over from when it was a review queue rather than a build.
   Shows a real blueprint instead of describing two, and drops a weak design note. */
const fs = require("fs");
let s = fs.readFileSync("course.js", "utf8");
let n = 0;

const SPEC =
  ' <div class="spec"><div class="spec-h">MBP 301 &middot; rows in delivery order</div><div class="spec-b">' +
  'Lesson 301.1&nbsp; Hardware foundations<span class="an"> &nbsp;linked</span><br>' +
  'GLAB 301.1.1&nbsp; Component identification<span class="an"> &nbsp;linked</span><br>' +
  'Quiz 301.1&nbsp; Lesson check<span class="an"> &nbsp;linked</span><br>' +
  'Lesson 301.2&nbsp; Operating systems<span class="an"> &nbsp;linked</span><br>' +
  'GLAB 301.2.1&nbsp; Fault isolation<span class="an"> &nbsp;linked</span><br>' +
  'KBA 301&nbsp; Module knowledge check<span class="an"> &nbsp;linked</span><br>' +
  'SBA 301&nbsp; Ticket resolution<span class="an"> &nbsp;Rubric 301 linked from this row</span><br>' +
  'FG 301&nbsp; Facilitator guide<span class="an"> &nbsp;module level</span>' +
  '</div><div class="spec-n">Teaching order, not build order. The rubric hangs off the row it grades. A MERN blueprint is the same document with an ALAB where the GLAB sits.</div></div>';

const R = [
  // descriptive prose about two blueprints becomes one blueprint you can read
  [
    / <p><strong>In our courses\.<\/strong> An IT Support module blueprint[\s\S]*?<\/p>\n/,
    SPEC + "\n",
  ],
  // the weakest of the course's twelve design notes
  [
    / <div class="meta"><span class="mi">🔍<\/span><div><b>Design note:<\/b> notice the order this course put things in[\s\S]*?<\/div><\/div>\n/,
    "",
  ],
  // left over from when this lesson was a review queue
  [
    '<p class="tight" style="color:var(--muted)">Work the rows below. Keep what belongs on the blueprint, and send back what does not.</p>',
    '<p class="tight" style="color:var(--muted)">Write your own rows below, then say what you left off and why.</p>',
  ],
];

for (const [a, b] of R) {
  const before = s;
  s = a instanceof RegExp ? s.replace(a, b) : s.split(a).join(b);
  if (s !== before) n++;
  else console.log("  MISS: " + String(a).slice(0, 70));
}

fs.writeFileSync("course.js", s);
console.log(`${n}/${R.length} mbp fixes applied`);
