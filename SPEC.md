# Course spec

The thing this course was missing. Every lesson is checked against this, and `check.js` / `prose.js` enforce the parts a machine can.

This course is a worked example of how Per Scholas builds a course. It must demonstrate the standard it teaches, not merely describe it. If a rule here is broken in the course itself, that is a defect regardless of how the page reads.

---

## 1. The spine

Two models, doing two different jobs:

- **ADDIE** is the department's structure: analysis, design, development, implementation, evaluation. It says which stage you are standing in.
- **Backward design** is the planning method used inside it: outcomes, then the evidence that proves them, then the materials. It says what order to think in once you are there.

Seven process steps: Handoff · Initiation · Planning · Developing · Module & Course QA · Implementing & Facilitating · Evaluating & Updating.

Four review gates: **Design Review** · **Development Review** · **Delivery Check** · **Delivery Review**.

### Units

| Unit                    | Owns                                      | Ends with the learner able to                                                                                                 |
| ----------------------- | ----------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| 1 · Welcome & Intake    | Who we are, the job, steps 1–2            | Read any file name, judge a design package, stage a repo                                                                      |
| 2 · Planning the Module | Step 3. **Decisions only, nothing built** | Write an objective, decide what a module contains, plan the assessment cadence, plan a lesson package                         |
| 3 · Building Content    | Step 4. **The longest unit**              | Build a lab, build assessments, build a rubric, hold accessibility and AI standards                                           |
| 4 · Handoff & Revision  | Steps 5–7 and all four gates              | Clear Development Review, answer QA findings, pass the Delivery Check, hand over, turn cohort evidence into the next revision |

**The planning/execution line is absolute.** If a Unit 2 lesson produces an artifact, it is in the wrong unit. If a Unit 3 lesson makes a planning decision, same.

---

## 2. Lesson shapes

One template repeated is what made this course read as machine-made. Every lesson is written to one of five shapes. The shape is a design decision, not a data field: it is enforced through the word budget and box count below, and through the activity-variety rule in `check.js`. **Vary the shape as often as the content allows: three consecutive lessons must never share one.** Two adjacent lessons may share a shape where the pedagogy demands it (writing a knowledge item and then a performance task, for example), provided they do not look alike on the page.

**`rules`** — a standard the learner must apply later.
Short statement of the rule → one worked specimen showing it met and broken → where the template lives. No scenario. Target 250 words.

**`judgment`** — the learner rules on somebody else's work.
The scenario **is** the lesson: brief first, then the queue. Any rule needed is stated in the brief or already taught. Prose before the activity: under 150 words. The learner should reach the activity fast.

**`build`** — the learner produces something.
The thing being built, the standard it answers to, the template it is written into, then the workspace. Prose under 200 words. The activity carries the lesson.

**`reference`** — a page the learner returns to.
A table or definition list and almost nothing else. No scenario, no activity. Target 300 words.

**`orientation`** — unit openers and the welcome.
What just happened, what this unit does, what the learner will be able to do. Under 200 words.

---

## 3. Rules every lesson obeys

**Opening.** Never starts with "You". Use a transition that carries the previous lesson forward: _"Now that the objectives are approved, …"_. A learner arriving cold must be able to tell where they are in the process from the first two sentences.

**Terms.** No term is used before it is defined. When a term names an artifact, **show the artifact**: a real specimen of what it looks like, not only a description. Then point at its template in the Handbook. There is a template for the blueprint, KBA, SBA, lab, capstone, facilitator guide, syllabus and more; a lesson that teaches one of these and does not link its template is incomplete.

**Scenarios feed activities.** A `brief` exists to set up the exact decision the activity asks for. If the activity would work identically with the brief deleted, delete the brief. No scene-setting for atmosphere.

**Activity mechanics.** `coach` states the physical action, what a wrong move costs, and how the learner knows they are finished. A learner must never have to click around to discover the mechanic.

**Presentation variety.** Boxes are one device among several: specimens, tables, definition lists, diagrams, inline callouts, plain prose. **No lesson uses more than two `.box` elements.** Long sentences stacked inside boxes is the failure mode to avoid.

### The devices available

Reach for the one that fits the job. The box was doing all of these badly.

| Device | Markup | Use it for |
|---|---|---|
| Specimen | `.spec` > `.spec-h` / `.spec-b` / `.spec-n` | Showing the actual artifact. `.an` annotates inside it. |
| Comparison | `.vs` > `.a` / `.b`, each with `.vh` | Two things held apart: formative vs summative, a schedule vs a guide. |
| Rule line | `.ruleline` | One rule that needs weight, without a box around it. |
| Checklist | `ul.cl` | A list the learner reads down and checks off. |
| Terms | `.terms` > `.th` + `dl` | Definitions. |
| Box | `.box info` / `.box rule` | A short standard that none of the above fits. Two per lesson, maximum. |

**Diagrams.** Only where a picture shows something prose cannot: a flow, a hierarchy, a loop. Never before the prose that motivates it. If a diagram and a box say the same thing, the box goes.

**Word budget.** Roughly 45 words per minute of lesson time for a reading page, and less where an activity carries the lesson. A 10-minute lesson is about 450 words, not 970.

**Voice.** Handbook vocabulary, always. Titles name the artifact or the content, never the mechanic and never a mood. No banned words (`easy`, `simple`, `quick`, `very`, `really`, `just`). No "The N things about X" headings. No over-balanced pairs ("It is not X, it is Y"). Sentences under 25 words. Paragraphs under 4 sentences.

---

## 4. What must be covered

Gaps close before polish:

- **Module & Course QA (step 5)** — submit, read findings, fix, resubmit, push back with a reason.
- **Delivery Review (gate 4)** — cohort evidence becomes the next revision's inputs.
- **Delivery Check, all three legs** — accessible, instructor-enabled, environment-verified.
- **SBA** — defined and planned, must also be built. Currently only KBA items get authoring practice.

---

## 5. Enforcement

`node check.js` — structure, vocabulary, unit placement, frames, bridges, weight, duplication.
`node prose.js` — banned words, AI-writing tells, heading formulas.
`node build.js` — regenerates `unit1..4.html` and the landing page. Never edit those by hand.

Contrast is checked against WCAG 2.1 AA, because this course teaches that standard and cannot fail it.
