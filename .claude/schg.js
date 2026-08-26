/* schg had the learner approve or reject somebody else's proposed route. The lesson
   is about choosing the route, so it becomes a triage: the learner picks it. Also
   breaks the run of consecutive review queues in Unit 4. */
const fs = require("fs");
const lines = fs.readFileSync("course.js", "utf8").split("\n");
const s = lines.findIndex((l) => l.startsWith('{id:"schg",'));
if (s < 0) throw new Error("schg not found");

let ci = -1;
for (let i = s; i < s + 20; i++)
  if (/^\s*coach:/.test(lines[i])) {
    ci = i;
    break;
  }
lines[ci] =
  " coach:" +
  JSON.stringify(
    "<b>Read each request, then press the route it takes.</b> Four routes: hotfix, maintenance, no product change, or planned revision. The sender's proposed route is on the card and is a proposal, not the answer. A wrong route explains itself and the next request loads. The queue closes when all five are routed.",
  ) +
  ",";

let ai = -1;
for (let i = s; i < s + 200; i++)
  if (/^\s*activity:\{/.test(lines[i])) {
    ai = i;
    break;
  }
if (ai < 0) throw new Error("activity not found");
let end = ai;
while (
  end < lines.length &&
  !lines[end].startsWith("{id:") &&
  lines[end].trim() !== "]},"
)
  end++;
const tail = [];
for (let i = ai; i < end; i++)
  if (/^\s*transition:/.test(lines[i])) tail.push(lines[i]);

const block = [
  ' activity:{type:"triage",id:"schgt",points:14,',
  '  buckets:["\\u26a1 Hotfix","\\u1f527 Maintenance","\\ud83d\\udcac No product change","\\ud83d\\udccb Planned revision"],',
  "  items:[",
  '   {from:"Delivery, cohort 1042-03",subj:"GLAB 302.3.1 step 4 links to the retired vendor console",',
  '    body:"Eighteen learners blocked in class this morning. Proposed route: planned revision, next quarter.",ans:0,',
  '    why:"Hotfix. Live and broken, with learners stopped today. Fix it now, verify it, log it. No version change, because nothing about what a learner must prove has moved. The proposed route would have left a cohort blocked for a quarter."},',
  '   {from:"Instructor, cohort 1042-03",subj:"Replace SBA 302 with a group presentation next week",',
  '    body:"The cohort responds better to presenting than to writing up. Proposed route: maintenance.",ans:3,',
  '    why:"Planned revision. A group presentation changes the evidence, and it stops measuring the individual performance the objective names. That is a change to what a learner must prove, so it is Design\\u2019s call and it earns a version number."},',
  '   {from:"Site operations",subj:"Learners cannot sign in to the vendor environment",',
  '    body:"Accounts were never provisioned for this cohort. Proposed route: hotfix the lab.",ans:2,',
  '    why:"No product change. The lab is correct; the accounts do not exist. Nothing in the course needs editing, and hotfixing the material would hide an access problem that will recur with the next cohort."},',
  '   {from:"Vendor liaison",subj:"CompTIA releases a new exam version",',
  '    body:"Objectives, software versions and question weighting all change. Proposed route: update the affected labs.",ans:3,',
  '    why:"Planned revision. Objectives and scope both move, so the module outcomes move with them. We diagnose and size it, then hand it to Design with the evidence. Patching the labs alone would leave the course claiming outcomes it no longer teaches."},',
  '   {from:"Product Quality & Experience",subj:"Typo in a non-graded handout",',
  '    body:"Two letters reversed. Meaning is unaffected. Proposed route: no product change.",ans:1,',
  '    why:"Maintenance. A correction with no instructional impact still gets made, verified and logged. It does not need a version, and it is not nothing: the log is how anyone later knows the file changed."}],',
  '  fbGood:"Five routed correctly, and two of them against what the sender proposed. That is the job: the evidence on the card decides the route, not the opinion at the bottom of it.",',
  '  fbBad:"Look again at the ones you missed. Two questions sort every request: has anything a learner must prove changed, and is anybody blocked right now?"},',
];

const out = block.slice();
if (!tail.length)
  out[out.length - 1] = out[out.length - 1].replace(/\},$/, "}},");
lines.splice(ai, end - ai, ...out, ...tail);
fs.writeFileSync("course.js", lines.join("\n"));
console.log(
  `schg: review queue -> triage (${end - ai} lines -> ${out.length + tail.length})`,
);
