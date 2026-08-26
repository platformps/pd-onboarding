/* The last two lessons carrying prose with no visual device.
   mcomp sorts situations into four module patterns but never shows what a pattern
   contains; drev now tells the learner to read the aggregated dashboard but never
   shows what it returns. Both get the artifact they are about. The drev specimen
   deliberately uses a different module from the queue so it spoils no answers. */
const fs = require("fs");
const lines = fs.readFileSync("course.js", "utf8").split("\n");

function appendToHtml(id, block) {
  const S = lines.findIndex((l) => l.startsWith('{id:"' + id + '",'));
  if (S < 0) throw new Error(id + " not found");
  let hi = -1;
  for (let i = S; i < S + 30; i++)
    if (/^ html:/.test(lines[i])) {
      hi = i;
      break;
    }
  if (hi < 0) throw new Error(id + ": html not found");
  let he = hi;
  while (he < lines.length && !/`[,;]/.test(lines[he])) he++;
  lines.splice(he, 0, block);
  console.log("  " + id + ": visual added");
}

appendToHtml(
  "mcomp",
  ' <table class="mtbl"><tr><th>Pattern</th><th>What it carries</th></tr>' +
    "<tr><td><b>Standard</b></td><td>Lessons with labs through the week, weekly graded evidence of individual performance, a module-end knowledge check and at least two skills-based assessments.</td></tr>" +
    "<tr><td><b>Short, one to two days</b></td><td>Lessons and labs, and one summative that is the competency check. Too short to carry a separate knowledge check and still leave room to practice.</td></tr>" +
    "<tr><td><b>Prep or foundational</b></td><td>Heavier scaffolding and frequent formative checks, closing on one summative that proves readiness for the module it feeds.</td></tr>" +
    "<tr><td><b>Vendor-constrained</b></td><td>Vendor content carries the knowledge; our own performance task sits on top, because a vendor quiz cannot show job performance.</td></tr>" +
    "</table>",
);

appendToHtml(
  "drev",
  ' <div class="spec"><div class="spec-h">Surveys dashboard &middot; module 205, two cohorts, aggregated</div><div class="spec-b">' +
    'KBA 205&nbsp; avg 88%<span class="an"> &nbsp;item 9 flagged: most-chosen answer is not the key</span><br>' +
    'SBA 205&nbsp; avg 61%<span class="an"> &nbsp;lowest dimension: works unaided</span><br>' +
    'GLAB 205.2.1&nbsp; block overrun<span class="an"> &nbsp;+25 to +35 min, both cohorts</span><br>' +
    'Survey&nbsp; pacing raised<span class="an"> &nbsp;2 of 31 responses</span>' +
    '</div><div class="spec-n">This is the shape the evidence arrives in. A flag is a prompt to look, not a finding: item 9 needs the item reviewed before anyone decides whether it is a bad question or a teaching gap.</div></div>',
);

fs.writeFileSync("course.js", lines.join("\n"));
