# Instructional QA — PD Onboarding

Reviewed as an experienced instructional designer would review a colleague's course being
presented as finished. Sources read: `SPEC.md`, `guide.js` (21 Handbook sections),
`course.js` (40 lessons / 355 min across 5 groups), `capstone/Capstone-Module-Development-Package.html`,
`capstone/Capstone-Rubric.csv`, `check.js`, `prose.js`, `index.html`, `course.css`.

**Note:** `course.js` was edited during this review (mtime moved 21:15 → 21:27). Every finding
below was re-verified against the 21:27 file.

---

## Verdict

The course is better than most internal onboarding and it is not finished.

It gets the hard half right: the seven steps, the intake judgment, QA findings, change routing
and Delivery Review are taught with real specimens, worked examples and queues that discriminate.
The Canvas capstone rubric is the single best artifact in the repo.

It fails on the half it is judged by. **Four of the eight things the capstone requires the learner
to produce — the blueprint, the rubric, the facilitator-guide section, the AI-use record — are
things the course only ever asks the learner to _judge_.** The course states this exact failure
mode as a rule, twice, in its own words:

> "If a module defines something and never asks a learner to produce one, the module has covered a
> topic rather than taught a skill." — `s5b`, design note
>
> "If a learner could finish your module having only ever followed instructions, it is not
> competency-based yet." — `mcomp`

That is the headline. A new hire finishing this course can recognise a good blueprint, rubric and
facilitator guide, and has never written one. The capstone then grades all three.

---

## Competence matrix — the real workflow, step by step

| Workflow step                | Taught                          | Practised                                      | Verdict                              |
| ---------------------------- | ------------------------------- | ---------------------------------------------- | ------------------------------------ |
| Receive a handoff            | `s1` (7-step walk), `sip`       | `sip` 5-package queue, `d1x`                   | **Solid**                            |
| Judge readiness              | `sip`, `s2`                     | `sip`, `s2` triage, `d1x`                      | **Solid**                            |
| Plan a module (composition)  | `modref`, `mcomp`               | `mcomp` — classify 4 situations                | Partial: classified, never composed  |
| Write objectives             | `sob`                           | `sob` (judge 5), `d2x` (author 1, ungraded)    | Partial                              |
| Plan assessment cadence      | `arh` (specimen only)           | `arh` — 6-card 2-bucket sort                   | **Weak** — see 2.2                   |
| Build a lab                  | `slb`                           | `slb` repair 3 of 6 steps, `d3x` writes 1 step | Partial: never writes a lab          |
| Write a KBA item             | `s5b` + approved specimen       | `s5b` authors one, `s5` reviews five           | **Best-covered skill in the course** |
| Write an SBA                 | `sbab` (no specimen)            | `sbab` authors one                             | Good, but see 2.5                    |
| Build a rubric               | `s7` prose + Handbook `rubrics` | scores someone else's _different_ rubric       | **Never built**                      |
| Hold accessibility standards | `sax`                           | `sax` audit queue, one line in `d3x`           | Partial: audits, never plans         |
| Hold AI standards            | `aico`, `s6`, `sai`             | story + fix + review                           | **Solid, over-weighted** (2.6)       |
| Assemble a blueprint         | `s0`, `s1b`, `mbp`              | `mbp` keep/send-back on 7 rows                 | **Never assembled**                  |
| Write a facilitator guide    | `fgq`                           | `fgq` approve/send-back on 5 drafts            | **Never written**                    |
| Clear QA                     | `qagate`                        | `qagate` 7 findings, incl. pushing back        | **Strongest lesson in the course**   |
| Handle change requests       | `msy`, `schg`, `drev`           | all three, with queues                         | **Solid**                            |
| Pass the Delivery Check      | promised in `d4i` objectives    | nothing                                        | **Never taught** — see 1.6           |

**Taught but never practised:** rubric authoring, blueprint assembly, facilitator-guide writing,
accessibility planning (as opposed to auditing), the Delivery Check, course-level QA.

**Practised but never taught:** `sws`'s six workplace threads (SVG labels only, and the frame points
at a Handbook section that does not exist); `schg`'s hotfix/maintenance routes (zero occurrences in
`guide.js`); `s7`'s AI Integrity Rubric (applied two lessons before AI is taught); `d4i`'s module
deliverables checklist (Handbook-only, never in course prose).

---

# 1 · Would embarrass the team if presented tomorrow

### 1.1 The capstone asks for four artifacts the course never has anyone build — BLOCKER

`Capstone-Rubric.csv` scores 13 criteria / 100 points. Four have no production practice anywhere in
the 355 minutes:

| Capstone criterion                         | Points | Course coverage                                                       | Verdict                  |
| ------------------------------------------ | ------ | --------------------------------------------------------------------- | ------------------------ |
| Module blueprint (MBP)                     | 7      | `mbp` — keep/send-back verdict on 7 candidate rows                    | judged, never assembled  |
| Rubric for the graded item                 | 6      | `s7` — score somebody else's submission on a rubric you did not write | judged, never built      |
| Facilitator guide: teachable by a stranger | 8      | `fgq` — approve/send-back on 5 drafted sections                       | judged, never written    |
| AI use: disclosed, verified, owned         | 5      | one line in the `d3x` journal                                         | asserted, never produced |

26 of 100 capstone points, plus "Accessibility built in" (5 pts, practised only as an audit queue in
`sax`), rest on skills the course teaches by recognition only. `s7`'s own bridge promises otherwise
and then does not deliver:

> "The SBA task is written and its scoring is still one sentence long. A sentence cannot be handed
> to a second grader. **What the module owes next is a rubric** two people can apply to the same
> submission and reach the same score."

The activity that follows is not building that rubric. It is scoring `GLAB 402.1.1 · AI-assisted
troubleshooting plan · Learner: J.R.` against the **AI Integrity Rubric** — a different artifact, a
different module number, a different rubric, on a dimension set the learner has not been taught yet
(see 1.4). The SBA scoring line the learner wrote one lesson earlier in `sbab` is never revisited.

**Fix (minimum, before presenting):** convert `s7` into two parts — build three rubric rows for the
SBA you wrote in `sbab` (criteria traced to the objective, three observable levels), _then_
calibrate against the expert scoring. Add a short build task to `mbp` (write four blueprint rows for
the module you have been carrying) and to `fgq` (write the troubleshooting section for
`GLAB 301.2.1`, whose stall point the lesson already prints). All three already contain the specimen
needed to scaffold the build; only the ask is missing.

### 1.2 The capstone's own time estimate contradicts itself on the page — BLOCKER

Inside `cap`, in the same lesson:

- `lead`: "Set aside **eight to sixteen hours**, which is **one to two working days**."
- `html`: "**Plan on 16 hours,** two full working days, and do not attempt it in one sitting."
- `prompt`: "Plan on 16 hours, which is two full working days."
- `capstone/Capstone-Module-Development-Package.html`: "Plan on **16 hours**, which is two full
  working days. Do not try to do it in one sitting."

Three of four say 16 h. The `lead` — the first sentence the learner reads — says 8. The capstone file
carries an explicit `KEEP IN SYNC` comment for exactly this. One-line fix, and it is the kind of
thing a reviewer spots in the first ninety seconds.

### 1.3 The in-course capstone self-check is not the capstone rubric

`cap.activity.rubric` is a six-item attestation the learner must tick to submit:

- "My lesson day**s** clear the 75% activated-learning bar"
- "Every file follows the naming convention (prefixes, R- for graded)"
- "The module ends with a KBA and/or SBA; every graded item has a rubric"
- "Learner AI activities follow the two rules and embed the Integrity Rubric"
- "Everything AI drafts for me gets verified before it ships. I own every line"
- "Accessibility is built in as I go: alt text, contrast, captions, keyboard access"

Three problems. Six items where the real rubric has thirteen. It attests to things the deliverable
does not ask for — "lesson day**s**" plural, when the capstone asks for one lesson; "Learner AI
activities … embed the Integrity Rubric", when the capstone requires no learner-facing AI activity
at all. And a course that spends `s7` teaching _"a rubric holds when two people scoring the same
submission land in the same place"_ closes with a self-tick as its own gate. Replace the six items
with the thirteen criterion names from `Capstone-Rubric.csv`, or drop the tick-gate and link the
rubric.

### 1.4 Prerequisite inversions: three lessons land before the thing they need

- **`s7` uses the AI Integrity Rubric two lessons before AI is taught.** Unit 3 order is
  `slb → s5b → s5 → sbab → s7 → sax → aico → s6 → sai`. `s7` asks the learner to score
  _Purposeful AI Use / Verification & Human Judgment / Responsible Use & Reflection_. `aico`, `s6`
  and `sai` — the entire AI standards block — come after it. This is the "activity before context"
  pattern the course itself warns about.
- **`s6.bridge` names something that has not happened.** "The **two rules** for working with AI are
  established." The two rules (no named tool; every AI-involving summative is graded) are taught in
  `sai`, the _next_ lesson. `aico` teaches directing-vs-asking, not the two rules.
- **`sax` uses "Delivery Check" before it is defined.** `sax.brief.re` reads "Module 301 —
  accessibility audit **before Delivery Check**", and the body says "the Delivery Check is run
  against them." The term is first defined in `d4i`, a unit later. SPEC §3: "No term is used before
  it is defined." `check.js` §3 checks ten glossary terms and none of the four gate names, so it
  passes.

### 1.5 Unit 1 runs the Design Review and calls it the Development Review

`sip` _is_ Design Review — "Is the design package complete and buildable? Nothing is developed
against an unapproved design." The lesson never uses the term. It uses the wrong one, three times:

- `sip.brief`: "Five packages are queued for review **before Development Review**."
- `sip` item 1 rationale: "the gap gets an owner and a date **before Development Review**."
- `sip` item 1 correct-reason text: the same phrase again.

Then `d4i` tells the learner: "You cleared **Design Review** in Unit 1, when you ruled on what Design
sent you" — a callback to a term Unit 1 never said, attached to a gate Unit 1 explicitly called
something else. The four gates are also never introduced in `s1`, the pipeline walk that should carry
them; they arrive whole in `d4i` as retrofit. SPEC §1 makes the four gates part of the spine.

### 1.6 Unit 4 promises a Delivery Check leg the course never teaches

`d4i` unit objectives: "**Pass the Delivery Check on all three legs: accessible, instructor-enabled,
environment-verified.**" There is no Delivery Check lesson. Accessible maps back to `sax` (Unit 3),
instructor-enabled to `fgq`. **"Environment-verified" appears nowhere in `course.js` or `guide.js`
outside that objective line and one SVG tooltip.** SPEC §4 lists "Delivery Check, all three legs" as
a gap that must close before polish. It has not closed, and Unit 4 now advertises it.

### 1.7 "Your project stays yours to the end" is untrue for the whole build unit

`pick` promises: "Everything you do from here uses it, from the packages you review to the module you
plan at the end," and `pick.frame.why`: "Every later activity uses this, including objectives,
assessments, labs, QA, and your final brief project."

Rendering both tracks and diffing: **10 of 40 lessons vary by track** (`sip`, `s3`, `d1x`, `d2i`,
`sob`, `s4`, `d2x`, `sbab`, `d3x`, `cap`), and in `s3` only the prose varies — the repo activity still
asks a MERN learner to create files under `Lesson 301.1 — Hardware Foundations`.

A learner who picks Software Engineering spends the build unit on:

- `slb`: Windows Defender Firewall inbound rules, `verify-baseline.ps1`, endpoint agent tray icon
- `s5b`: writing a KBA item on the OSI model and a 169.254 APIPA address
- `s7`: an IT troubleshooting submission
- `s6`: Windows workstation narration
- all of Unit 4: module 301, IT Support

`s5` handles this honestly ("two items in this queue sit outside your home domain deliberately. Where
subject expertise cannot carry you, the standard has to"). Nothing else does. Either narrow the
promise in `pick` to what is true — the intake, the objectives, the day plan and the SBA — or finish
the track variants for `slb` and `s5b`, the two authoring lessons where domain actually matters.

### 1.8 Merge artifacts still in the file

- **`s3.transition`, `course.js:530`** — duplicated sentence, ships to the learner:
  "The IT Support module repo is staged and named to convention. **The repo is staged.** The Unit 1
  check asks you to…" — `check.js` §7 ("no duplicated content inside a lesson") does not catch it.
- **`s3.frame.now`: "Planning is approved; it's time to stand up the module's staging repository."**
  Planning is Unit 2. This is Unit 1, step 2. It contradicts `s3.bridge` on the same page ("The
  classification is read and the build is scoped") and the lesson's own teaching that the MBP is
  "Started during Developing, not during Planning" — while the activity has the learner create
  `MBP 301` in Unit 1.
- **`s2.frame.prev`: "Both design packages have readiness verdicts."** `sip` produced verdicts on
  _five_ packages, not two. Leftover from a one-package-per-track design.
- **`slb.demo` final step: "Now repair the four below the same way."** There are three broken steps of
  six, which is what `slb.coach` correctly says. The worked example gives the wrong count.
- **`fgq.lead`: "It carries six named sections… FG 301 has one draft per section."** The queue has
  five items and `fgq.coach` says "all five sections." Six sections, five drafts, no note on which is
  absent.

### 1.9 `modref`'s transition points at the wrong lesson

`modref.transition`: "That is the standard. **Next you apply it, matching real module situations to
the shape each one needs.**" That describes `mcomp`. The next lesson is `arh`. The standard-then-apply
pair is split by an unrelated sort, and `mcomp` then has to rebuild the context two pages later:
"Both were defined **two pages back**, on 'What goes in a module'." Reorder to
`modref → mcomp → arh`, which also fixes the redundancy in 2.1.

---

# 2 · Fix soon

### 2.1 `modref` and `mcomp` say the same thing three times in 744 words

`modref` (9 min, no activity) opens: _"New developers ask how many quizzes, labs and graded assignments
a module needs. No number answers it."_
`mcomp` (8 min) opens: _"Product Developers and the subject matter experts (SMEs) who own a domain ask
the same thing: how many quizzes, labs, and assessments a module needs. There is no number."_

Inside `mcomp`'s 301 words the summative rule is stated three times — the opening box, the "What never
changes, whatever the module" box, and the closing line. `modref` states it twice. `modref` is also
the **only lesson in the course with no activity**: 9 minutes of reading in a course whose Unit 2
opener teaches the 75% activated-learning floor. Merge the two, keep `mcomp`'s four-situation triage
as the activity, cut the duplication.

### 2.2 Two activities cannot fail a learner who understood nothing

- **`arh`** (Plan the assessment rhythm): six cards, two buckets. Warm-up / lab / exit ticket →
  formative; module-end knowledge check / SBA 301 / capstone → summative. Anyone with a general sense
  of the words gets 6/6 without reading the page. It is also the _only_ practice the course gives on
  assessment cadence, while the capstone rubric scores "Approach and assessment plan" at 10 points —
  the joint-highest criterion.
- **`s0`** (How a course is put together): six cards, three buckets, and the numbering rule stated in
  the hint makes every card mechanical (`Quiz 301.2` has two dots → lesson level).

Both are fine as warm-ups. Neither is evidence. If cadence is worth 10 capstone points, `arh` needs a
placement task — put six named items on a ten-day module timeline, with the meter checking that the
midway check leaves room to act — not a two-bucket sort.

### 2.3 The four unit checks are not evidence, and the engine proves it

`d1x`, `d2x`, `d3x`, `d4x` are journals. `engine.js:622` gates completion on
`t.value.trim().length >= 8` per box. Eight characters of anything advances the learner and reveals
the model answer. The capstone gate is `length > 10` plus ticking six checkboxes.

This is defensible for ungraded onboarding — the real evidence is the manager-reviewed capstone — but
it should be _said_, and it is the one place the course fails a rule it teaches loudly ("Alignment:
every objective has at least one piece of evidence"). The model answers themselves are excellent (3.3);
the problem is only that nothing requires engagement with them. Minimum: raise the floor to something
meaningful, or add a self-check gate on the criteria list each model answer already carries.

### 2.4 Three activities require a taxonomy the Handbook does not contain

- **`sws`** asks the learner to name which of _six workplace threads_ a decision cuts. The six threads
  appear only as labels inside an SVG. `sws.frame.use` says "The workplace expectations in the
  Handbook." **There is no such Handbook section** — `guide.js` has 21 sections and none covers the
  simulation. The prose above the activity never lists the six.
- **`schg`** routes requests into _hotfix / maintenance / planned revision / no product change_.
  `hotfix` and `maintenance` appear **zero times in `guide.js`**, while `schg.coach` points at "UCI
  numbers & versions," which covers only new-UCI-vs-revision. Two of four routes have no source of
  truth behind them.
- **`fgq`** teaches a six-section FG standard. The Handbook's only FG content is one bullet in
  `deliverables`. The exemplar link (Module 601 FG) is there; the standard is not.

This is the course's own rule broken — SPEC §3: "a lesson that teaches one of these and does not link
its template is incomplete."

### 2.5 `sbab` asks the learner to write an artifact they have never seen

SPEC §2, `build` shape: "The thing being built, the standard it answers to, **the template it is
written into**, then the workspace." SPEC §3: "When a term names an artifact, **show the artifact**: a
real specimen of what it looks like."

`sbab` (227 words, 8 min) describes an SBA, states the objective it must prove, links the SBA Template
— and shows no specimen. Compare `s5b`, which does this correctly: it prints `KBA 301 · item 7,
approved` with all four options annotated _before_ asking the learner to write one. `sbab` is also one
of only three authoring lessons with **no worked example** (`l.demo`); `s5b` has none either, but its
specimen does the job. `sbab` has neither. Its model answer is strong and appears only after saving —
move a trimmed version above the fold.

### 2.6 Pacing: the units are the wrong size for what the capstone weighs

| Unit                 | Minutes | Share | Capstone points it feeds                                         |
| -------------------- | ------- | ----- | ---------------------------------------------------------------- |
| 1 Welcome & intake   | 90      | 25%   | ~7 (repo/naming)                                                 |
| 2 Planning           | 70      | 20%   | ~19 (objectives 9 + approach & assessment plan 10)               |
| 3 Building           | 98      | 28%   | ~42 (lesson 12 + activity 9 + assessment 10 + rubric 6 + a11y 5) |
| 4 Handoff & revision | 72      | 20%   | ~15 (MBP 7 + FG 8)                                               |
| Capstone reflection  | 25      | 7%    | —                                                                |

Unit 1 is the largest unit and feeds the smallest capstone criterion. Unit 2 carries a fifth of the
time and a fifth of the points, but it is the unit the capstone's Part 1 is almost entirely made of,
and it holds the two weakest activities in the course (2.2). Unit 3 is nominally the longest at 98 min,
one minute clear of Unit 4's 97 including the capstone — SPEC calls it "the longest unit" and it
barely is.

Inside Unit 3, the AI block (`aico` 10 + `s6` 10 + `sai` 8 = 28 min, 29% of the unit; 36 min / 37% if
`s7` is counted, since it scores an AI rubric) weighs the same as **all four lab-and-assessment
authoring lessons combined** (`slb` 10 + `s5b` 10 + `s5` 8 + `sbab` 8 = 36 min). AI hygiene is
important and well taught. It is not 37% of building a module, and the minutes it borrows are exactly
the minutes 1.1 needs for rubric, blueprint and FG production.

**Recommendation:** move 10–12 minutes out of Unit 1 (`w00` and `s0` are both 8 min at 53 w/min, over
budget and partly overlapping) and 8–10 out of the AI block, into Unit 2 cadence practice and Unit 3/4
production tasks.

### 2.7 Word budget: nine lessons over SPEC's 45 w/min, several with an activity carrying the lesson

SPEC §3: "Roughly 45 words per minute of lesson time for a reading page, **and less where an activity
carries the lesson**."

| Lesson   | mins | words | w/min | activity     |
| -------- | ---- | ----- | ----- | ------------ |
| `mbp`    | 8    | 453   | 57    | review queue |
| `w00`    | 8    | 420   | 53    | commit       |
| `s0`     | 8    | 426   | 53    | sort         |
| `s4`     | 10   | 534   | 53    | day builder  |
| `sob`    | 8    | 397   | 50    | review queue |
| `fgq`    | 8    | 402   | 50    | review queue |
| `schg`   | 8    | 398   | 50    | review queue |
| `aico`   | 10   | 489   | 49    | 5-step story |
| `modref` | 9    | 443   | 49    | none         |

`s4` and `aico` are the worst: both carry substantial activities and both exceed the _reading-page_
budget before the activity starts. SPEC §2's `judgment` shape caps pre-activity prose at 150 words;
`sip` (214) and every review-queue lesson above are over it.

### 2.8 `prose.js` reports 27 open violations

Including `just` (`s5.lead`: "the same standard you **just** wrote against"), a `The two rules`
N-things heading at `course.js:1258`, three paragraphs ending in rhetorical questions, and 14 vague
quantifiers. These are the course's own banned list. Small, but they are the "synthetic voice" tell,
and they are already machine-detected.

### 2.9 `check.js` gives a false all-clear on three SPEC rules

`node check.js` reports **0 failures, 0 warnings**. It does not check:

1. **`shape`** — SPEC §2 says "Every lesson has a `shape`, and the shape determines its structure,"
   and "three consecutive lessons must never share one." **`shape` is set on exactly one lesson of
   forty** (`qagate: "judgment"`). The spec's central structural mechanism is unimplemented and
   unenforced.
2. **Gate-name term ordering** — §3 above finds two violations it would catch with four more strings.
3. **Cross-lesson duplication** — §7 checks within a lesson only, missing both `s3`'s duplicated
   sentence and the `modref`/`mcomp` overlap.

Whoever presents this will say "the checker is green." It is green because it is not looking at the
three things most wrong.

---

# 3 · Genuinely good — keep

### 3.1 The QA and change-control block is the strongest teaching in the course

`qagate` is the best lesson in the file. Seven findings, five actionable and two not, and the two that
are not fail for _different_ reasons — one is too vague to act on ("Lesson 301.2 needs work in the
second half"), one is wrong against a standard ("Add a second KBA so each lab has an assessment behind
it"). The distractors are the two mistakes real developers actually make: rebuilding blind, and
complying with a wrong finding to avoid friction. `msy`, `schg` and `drev` are the same quality.
`drev` in particular teaches the pattern test (holds across the cohort / names which artifact / still
open) and then tests exactly it. This block closes SPEC §4's Module-QA and Delivery-Review gaps
properly.

### 3.2 The worked-example system (`l.demo`)

Sixteen lessons carry a three-to-five step I-do walkthrough with a skip control. They are disciplined:
each names the lens, applies it, states a verdict, and hands over ("Run your six elements through the
same single test"). `slb`'s and `s6`'s are textbook. This is the modeled → guided → independent wedge
from `guide.js#composition` actually implemented, not just described.

Caveat: `index.html` claims "Each lesson gives you a short concept, a real scenario, and a worked
example." Sixteen of forty do.

### 3.3 The model answers

`d1x`, `d2x`, `d3x`, `d4x`, `s5b`, `sbab` each pair a full expert response with a six-to-eight item
self-check list. They are specific, they include accessibility and AI-ownership lines, and they close
with a calibration question ("the useful question is not whose wording is nicer. It is whether a
reviewer could build your assessment from your objective without asking you anything"). Keep these
exactly as they are.

### 3.4 The frames (`l.frame`)

39 of 40 lessons carry `now / role / resp / use / why`, and they hold up. A learner arriving cold on
`mbp` reads "The module's files exist. Nothing yet tells anyone else what they are or what order they
run in" and knows precisely where they are standing. This solves the orientation problem better than
the transitions do.

### 3.5 `Capstone-Rubric.csv`

Thirteen criteria, every one traced to something the course teaches, level descriptions that are
observable rather than adjectival, points that reconcile to 100, and an "Overall: ready to build?" row
that gives the reviewer one verdict. It does what `s7` teaches and what most real rubrics do not. Do
not touch it — bring the course up to it.

### 3.6 The Handbook

`guide.js` is a genuine reference. `composition` and `rubrics` in particular are better than most
published guidance, and the Canvas CSV-import trap ("the import fails quietly … the structure is
wrong") is the kind of detail only someone who has done the job writes. Its gaps (2.4) are three
missing sections, not a quality problem.

### 3.7 Structural things that are simply fine

- Unit placement is clean: no Unit 2 lesson produces an artifact, no Unit 3 lesson makes a planning
  decision. SPEC's absolute line holds. (`s3` staging `MBP 301` in Unit 1 is the one wrinkle, and
  `d1x`'s model answer addresses it explicitly.)
- No lesson exceeds two `.box` elements. SPEC §3's presentation-variety cap is respected throughout.
- Bridges connect every lesson to its predecessor, and the `s3 → d1x → d2i` and `d3x → d4i` seams are
  handled well.
- `s5` (KBA review queue) is a well-built discriminating assessment: two items are approvable,
  including a clean recall item, so "send everything back" fails.
- Track selection persists correctly and the SW variants that do exist (`sbab` especially) are written
  with real domain knowledge, not find-and-replace.
- Contrast: a scripted WCAG pass over `course.css` produced no confirmed failures. The 19 initial
  flags were all light-on-dark components whose background is set on a parent (`.box.rule` at
  `#12283f`, `.tree`, `.prompt`, `.dcase`, `.gd-*`). The only legibility concern is `.box .bh` at
  9.5px uppercase mono, which is a size question rather than a contrast one.

---

## Priority order

**Before presenting**

1. Add production tasks for rubric, blueprint and facilitator guide (1.1)
2. Fix the 8h/16h contradiction in `cap.lead` (1.2)
3. Fix `sip`'s Development-Review-for-Design-Review error (1.5)
4. Delete the Delivery Check objective from `d4i` or write the lesson (1.6)
5. Clear the five merge artifacts (1.8) and `modref`'s misdirected transition (1.9)
6. Replace `cap`'s six-item attestation with the real rubric criteria (1.3)

**Next pass**

7. Move `s7` after `sai`, or move the AI block before `s7` (1.4)
8. Reorder `modref → mcomp → arh` and merge the duplication (1.9, 2.1)
9. Add the SBA specimen to `sbab` (2.5)
10. Rebuild `arh` as a placement task (2.2)
11. Add the three missing Handbook sections: workplace threads, change routes, FG standard (2.4)
12. Rebalance minutes out of Unit 1 and the AI block (2.6); trim the nine over-budget lessons (2.7)
13. Clear `prose.js` (2.8); extend `check.js` to `shape`, gate names, cross-lesson duplication (2.9)
14. Either finish the track variants for `slb`/`s5b` or narrow the promise in `pick` (1.7)
