/* Adds `checks` to the journal fields that have a testable standard.
   Each check corresponds to a rule the lesson states, so the feedback is
   the lesson's own criterion turned on the learner's words. */
const fs = require("fs");
const lines = fs.readFileSync("course.js", "utf8").split("\n");

const MEASURABLE =
  "configure|build|troubleshoot|diagnose|document|resolve|identify|implement|write|create|deploy|verify|escalate|route|assemble|score|audit|repair|query|install";
const UNMEASURABLE =
  "understand|know|learn|appreciate|familiar|aware|grasp|comprehend";

const SETS = {
  d2xw: [
    {
      short: "Box 1 · the objective",
      checks: [
        {
          want: MEASURABLE,
          ok: "Uses a verb somebody can watch happen.",
          no: "No measurable verb found. Configure, diagnose, document and resolve can be watched; the objective needs one.",
        },
        {
          avoid: UNMEASURABLE,
          ok: "No unmeasurable verbs.",
          no: "Contains understand, know or similar. Two instructors cannot agree on whether that happened.",
        },
        {
          avoid: " and ",
          ok: "One behaviour, not two.",
          no: 'Contains "and", which often joins two behaviours. If it does, split it: they get assessed separately anyway.',
        },
        {
          minWords: 8,
          ok: "Specific enough to build from.",
          no: "Short enough that a reviewer would have to invent the topic. Name what the verb acts on.",
        },
      ],
    },
    {
      short: "Box 2 · the assessment",
      checks: [
        {
          want: "GLAB|ALAB|KBA|SBA|Quiz|R-GLAB|CAP",
          ok: "Named to convention.",
          no: "No file name to convention. An assessment nobody can find by name is not planned yet.",
        },
        {
          want: "because|since|so that|measures",
          ok: "Says why it measures that objective.",
          no: "No reason given. The point is why this instrument measures this objective and not something adjacent.",
        },
      ],
    },
  ],
  s5bw: [
    {
      short: "Box 1 · the stem",
      checks: [
        {
          want: "?",
          ok: "A complete question.",
          no: "No question mark. The stem should be answerable before the options are read.",
        },
        {
          avoid: "all of the above|none of the above",
          ok: "No filler options in the stem.",
          no: "Mentions all or none of the above, which measures test-taking rather than knowledge.",
        },
        {
          minWords: 8,
          ok: "Enough context to answer.",
          no: "Too short to set up the fault. A learner should know what is being asked before reading an option.",
        },
      ],
    },
    {
      short: "Box 2 · the options",
      checks: [
        {
          want: "correct|key|answer",
          ok: "The correct option is marked.",
          no: "Nothing marks which option is the key.",
        },
        {
          minWords: 14,
          ok: "Each distractor is explained.",
          no: "Too short to say what misconception each wrong option represents. A distractor you cannot explain is filler.",
        },
      ],
    },
  ],
  d3xw: [
    {
      short: "Your lab step",
      checks: [
        {
          avoid: " and ",
          ok: "One action.",
          no: 'Contains "and", which usually means two actions. A step with two verbs is two steps.',
        },
        {
          want: MEASURABLE + "|open|select|click|enter|run|save|attach",
          ok: "Starts from an action the learner takes.",
          no: "No concrete action. Name what the learner does, not what they should understand.",
        },
        {
          avoid: "as needed|appropriately|as appropriate|correctly|properly",
          ok: "No vague qualifiers.",
          no: 'Contains a vague qualifier such as "as needed". That hands the decision to somebody who does not have it yet.',
        },
        {
          minWords: 12,
          ok: "Names specifics and a result.",
          no: "Too short to carry the exact menu, field or value, plus what the learner should see when it worked.",
        },
      ],
    },
  ],
  mbpw: [
    {
      short: "Box 1 · the rows",
      checks: [
        {
          want: "GLAB|ALAB|KBA|SBA|FG|Quiz|Lesson",
          ok: "Rows named to convention.",
          no: "No file names to convention. A row that cannot be found from its name is not doing its job.",
        },
        {
          want: "FG",
          ok: "The facilitator guide is on it.",
          no: "No facilitator guide row. A module handed over without one has no instructions for running it.",
        },
        {
          minWords: 12,
          ok: "Enough rows to be a blueprint.",
          no: "Too few rows. A blueprint lists every material a learner or instructor touches.",
        },
      ],
    },
    {
      short: "Box 2 · what you left off",
      checks: [
        {
          want: "because|since|internal|not delivered|never touch",
          ok: "Says why each one is off.",
          no: "No reason given. The test is whether a learner or instructor ever touches it.",
        },
      ],
    },
  ],
  fgqw: [
    {
      short: "Box 1 · troubleshooting and FAQ",
      checks: [
        {
          want: "ask|question|check|confirm",
          ok: "Gives the instructor something to ask.",
          no: "No question for the instructor to ask. A diagnosis without a next move is not troubleshooting.",
        },
        {
          minWords: 15,
          ok: "Names the stall point and the response.",
          no: "Too short to carry both where learners stall and what the instructor does about it.",
        },
      ],
    },
    {
      short: "Box 2 · delivery detail",
      checks: [
        {
          want: "min|minutes",
          ok: "Timing is stated.",
          no: "No timing. Delivery detail says how long each block runs.",
        },
        {
          want: "never|not cut|protect|hold",
          ok: "Says what is never cut.",
          no: "Nothing marked as protected. A guide that flexes everything tells an instructor nothing about priority.",
        },
      ],
    },
  ],
};

let added = 0;
for (const [actId, fieldSets] of Object.entries(SETS)) {
  const ai = lines.findIndex((l) => l.includes('id:"' + actId + '"'));
  if (ai < 0) {
    console.log("  activity not found: " + actId);
    continue;
  }
  let fi = -1;
  for (let i = ai; i < ai + 8; i++)
    if (/^\s*fields:\[/.test(lines[i])) {
      fi = i;
      break;
    }
  if (fi < 0) {
    console.log("  fields not found: " + actId);
    continue;
  }
  // find the end of the fields array
  let fe = fi;
  while (fe < lines.length && !/\}\],\s*$/.test(lines[fe])) fe++;

  let n = 0;
  for (let i = fi; i <= fe; i++) {
    if (!/\{label:/.test(lines[i])) continue;
    const set = fieldSets[n];
    n++;
    if (!set) continue;
    // append short + checks to this field object
    let close = i;
    while (close <= fe && !/\}[,\]]/.test(lines[close])) close++;
    const extra =
      ",short:" +
      JSON.stringify(set.short) +
      ",checks:" +
      JSON.stringify(set.checks);
    lines[close] = lines[close].replace(/\}([,\]])/, extra + "}$1");
    added++;
  }
}

fs.writeFileSync("course.js", lines.join("\n"));
console.log(added + " journal fields given self-check criteria");
