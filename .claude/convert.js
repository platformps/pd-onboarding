/* mbp and fgq are titled "Assemble the blueprint" and "Complete the facilitator guide"
   but both rendered as approve/send-back queues. That made five consecutive review
   activities in Unit 4, and left two capstone deliverables taught but never produced.
   Both become journals: the learner writes the artifact, then compares with a model. */
const fs = require("fs");
const lines = fs.readFileSync("course.js", "utf8").split("\n");

function replaceActivity(id, coach, block) {
  const s = lines.findIndex((l) => l.startsWith(`{id:"${id}",`));
  if (s < 0) throw new Error(`${id} not found`);

  // coach sits on its own line inside the lesson header block
  let ci = -1;
  for (let i = s; i < s + 20; i++)
    if (/^\s*coach:/.test(lines[i])) {
      ci = i;
      break;
    }
  if (ci < 0) throw new Error(`${id}: coach line not found`);
  lines[ci] = " coach:" + JSON.stringify(coach) + ",";

  // the activity runs from its opening line to the end of the lesson object
  let ai = -1;
  for (let i = s; i < s + 200; i++)
    if (/^\s*activity:\{/.test(lines[i])) {
      ai = i;
      break;
    }
  if (ai < 0) throw new Error(`${id}: activity not found`);
  let end = ai;
  while (
    end < lines.length &&
    !lines[end].startsWith("{id:") &&
    lines[end].trim() !== "]},"
  )
    end++;
  // keep any transition line that follows the activity
  const tail = [];
  for (let i = ai; i < end; i++)
    if (/^\s*transition:/.test(lines[i])) tail.push(lines[i]);

  // A lesson closes either on its transition line or on the activity itself.
  const out = block.slice();
  if (!tail.length) out[out.length - 1] = out[out.length - 1].replace(/},$/, "}},");
  lines.splice(ai, end - ai, ...out, ...tail);
  console.log(
    `${id}: review queue -> journal (${end - ai} lines -> ${block.length + tail.length})`,
  );
}

replaceActivity(
  "mbp",
  "<b>Write the rows into the two boxes.</b> The first is the module's own list in delivery order; the second is what you deliberately left off and why. Nothing is graded. When you <b>Save</b>, an experienced developer's blueprint appears beside yours with a checklist to run your own against.",
  [
    ' activity:{type:"journal",id:"mbpw",',
    "  fields:[",
    '   {label:"1. Your blueprint rows. Every material a learner or instructor touches, in delivery order, named to convention.",',
    '    ph:"Lesson 301.1 \\u2014 ...\\nGLAB 301.1.1 \\u2014 ...\\nQuiz 301.1 \\u2014 ...\\nKBA 301 \\u2014 ...\\nSBA 301 + Rubric 301 \\u2014 ...\\nFG 301 \\u2014 ..."},',
    '   {label:"2. What you left off, and why. Name two documents that exist for this build but do not belong on this blueprint.",',
    '    ph:"The project charter, because \\u2026 and the QA findings log, because \\u2026"}],',
    '  modelHead:"An experienced developer\\u2019s blueprint, and how to check yours",',
    '  model:`<p class="tight"><b>The rows.</b> Lesson 301.1 and 301.2 in teaching order, each linked. GLAB 301.2.1 positioned after the lesson it belongs to. Quiz 301.2. KBA 301 and SBA 301 at the end where they are sat, with Rubric 301 linked from the SBA row it grades. FG 301 at module level.</p>',
    '  <p class="tight"><b>Left off.</b> The project charter and the QA findings log. Both are real documents and neither is delivered material, so neither helps somebody find a file they need in order to run the module.</p>',
    '  <div class="box rule" style="margin-top:10px"><span class="bh">Check your own against these</span><ul class="blist"><li>Every row is a material a learner or instructor actually touches.</li><li>Delivery order, not the order you built them in.</li><li>Every graded row links its rubric.</li><li>Names match the files exactly, so a row can be found from its name alone.</li><li>Nothing internal to us: charters, findings, drafts.</li><li>The facilitator guide is on it. A module handed over without one has no instructions for running it.</li></ul></div>',
    '  <p class="tight" style="color:var(--muted)">A row that would not help a stranger find a file is not earning its place.</p>`},',
  ],
);

replaceActivity(
  "fgq",
  "<b>Write one section into each box.</b> Take the troubleshooting and FAQ section first, then the delivery detail. Write for an instructor who was in none of your design conversations and teaches this next month. Nothing is graded. When you <b>Save</b>, a worked version of both appears beside yours.",
  [
    ' activity:{type:"journal",id:"fgqw",',
    "  fields:[",
    '   {label:"1. Troubleshooting and FAQ, for GLAB 301.2.1. Where learners predictably stall, and what the instructor does about it.",',
    '    ph:"Stall point, step 6: \\u2026\\nWhat to ask: \\u2026\\nIf the environment fails: \\u2026"},',
    '   {label:"2. Delivery detail for the same lesson. How long each block runs, what may compress when the morning overruns, and what is never cut.",',
    '    ph:"09:00 warm-up 15 min \\u2026\\nNever cut: \\u2026"}],',
    '  modelHead:"A worked version of both sections, and how to check yours",',
    '  model:`<p class="tight"><b>Troubleshooting and FAQ.</b> \\u201CStall point, step 6: learners restart the service before saving the rule file, so the change disappears and the lab looks broken. Ask what the config showed when they saved it. If the VM image fails to load: re-issue the token from the instructor console, fall back to the browser sandbox linked in Materials, and if it is still down after ten minutes page infra on #infra-support.\\u201D</p>',
    '  <p class="tight"><b>Delivery detail.</b> \\u201CWarm-up 15 min. Configuration demo 15 min, compress to 8 if the morning ran long. GLAB 301.2.1 90 min, never cut: it produces the evidence KBA 301 measures. Exit ticket 15 min.\\u201D</p>',
    '  <div class="box rule" style="margin-top:10px"><span class="bh">Check your own against these</span><ul class="blist"><li>Every line carries a decision, not a description of what happens.</li><li>The stall point names the wrong turn the lab reliably produces.</li><li>There is a question to ask, not just a diagnosis.</li><li>The fallback path ends with who to contact and when.</li><li>Timing says what flexes and what is never cut, and why.</li><li>An instructor could run it without asking you anything.</li></ul></div>',
    '  <p class="tight" style="color:var(--muted)">If a section only lists what happens, it is a schedule. The guide is the part that says what to do about it.</p>`},',
  ],
);

fs.writeFileSync("course.js", lines.join("\n"));
