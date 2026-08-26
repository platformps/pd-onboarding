/* The landing-page card descriptions had drifted behind the lessons: Unit 4 still
   described reviewing a facilitator guide after it became a build, and neither
   Unit 3 nor Unit 4 mentioned the lessons added since. */
const fs = require("fs");
let b = fs.readFileSync("build.js", "utf8");

const BLURBS = {
  1: "What Per Scholas does, where your work lands, and the four responsibilities the job is made of. Then the work itself: how a course is put together, how a build travels the seven pipeline steps, how to answer Design on a package that is not quite ready, and how to stage the module repo so anyone can pick it up.",
  2: "Planning, not building. Work backward from what learners must prove: review the draft objectives, decide what the module must contain, plan the formative and summative checks and where they fall, budget a 240-minute lesson package against the activated-learning bar, and design the workplace the lessons run inside.",
  3: "Executing the plan, and the longest unit because it is where the course gets made. Repair a lab so it survives a room, write a knowledge item and run a review queue, build the skills-based assessment and the rubric that scores it, test whether that rubric holds between two graders, audit against WCAG 2.1 AA, and use AI without handing over the judgment that is your job.",
  4: "The last stretch, and every review gate that stands between a built module and a cohort. Clear Development Review, assemble the blueprint, write the facilitator guide, answer QA findings, hand the course to Delivery, get the instructors ready to teach it, then route the changes that come back and read what the cohort evidence says.",
};

let n = 0;
for (const [day, text] of Object.entries(BLURBS)) {
  // each UNITS entry is { day: "N", ... blurb: "..." }
  const re = new RegExp(
    '(day:\\s*"' + day + '"[\\s\\S]*?blurb:\\s*)"(?:[^"\\\\]|\\\\.)*"',
  );
  if (!re.test(b)) {
    console.log("  MISS unit " + day);
    continue;
  }
  b = b.replace(re, (m, head) => head + JSON.stringify(text));
  n++;
}

fs.writeFileSync("build.js", b);
console.log(`${n}/4 unit blurbs rewritten`);
