# Visual QA — Per Scholas PD Onboarding

Audit against SPEC.md §3 ("the devices available", the diagram rule, presentation variety) and the owner's brief:
_"I don't want this to be a wall of text"_ / _"leverage any videos, diagrams or images that fit the discussion."_

Method: `course.js` was evaluated in Node to extract every lesson's rendered HTML, then all 39 lessons were rendered
in Chromium at 1180×900 and measured in the DOM. "Longest unbroken prose" is the real pixel height of the tallest run
of consecutive text blocks with no genuine visual between them. A genuine visual is an `svg`, `.spec`, `.vs`,
`.mtbl`/`table`, `ul.cl`, or `img`. **`.box`, `.ruleline`, `.meta` and `.terms` are counted as text**, because on the
page they are prose with a background colour — which is exactly the failure mode SPEC §3 names
("long sentences stacked inside boxes is the failure mode to avoid").

Reference point: `main` is the scroll container and the topbar takes 48px, so the reading viewport is ~850px on a
laptop and ~600px inside the Canvas iframe. **Anything over ~600px of unbroken prose is more than one screenful of
solid text.** Twelve lessons cross that line.

---

## 0. The five findings that matter, in priority order

| #   | Finding                                                                                                                                                                  | Where          | Cost if shipped as-is                                                                                                                                                                                                                                                                         |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | **Five "build it" lessons ask the learner to produce an artifact the lesson never shows.** `mbp`, `sbab`, `d1x`, `d3x`, `d4x`                                            | U1, U3, U4     | The biggest visual gap. `mbp` teaches the module blueprint and never shows a blueprint. `sbab` asks the learner to write an SBA and never shows an SBA — while its sibling `s5b` (Write a KBA item) _does_ carry a specimen. SPEC §3: "When a term names an artifact, **show the artifact**." |
| 2   | **11 of 39 lessons contain zero visual devices.** `pick sip d1x mcomp d2x sbab d3x mbp drev d4x cap`                                                                     | all four units | Straight prose pages. Six of them are the unit checks and the capstone — the highest-stakes pages in the course.                                                                                                                                                                              |
| 3   | **Unit 1 has no specimen at all.** 0× `.spec` across 11 lessons                                                                                                          | U1             | Unit 1's stated outcome is "read any file name, judge a design package, stage a repo" — three artifact-handling skills, taught without ever putting an artifact on screen. `sip` judges a five-document intake package and shows none of the five.                                            |
| 4   | **Six of the 20 diagrams are lists drawn as rectangles, and four of those duplicate the box or `.terms` sitting next to them.** `w0`, `s1b`, `s2`, `sws`, `s6`, `aico`#1 | U1–U3          | SPEC §3: "Only where a picture shows something prose cannot… If a diagram and a box say the same thing, the box goes." Right now both stay, and the page is longer for it.                                                                                                                    |
| 5   | **Zero Per Scholas video. The two videos embedded are 45–60-minute third-party lectures dropped into 6–7-minute unit openers.** `d2i`, `d3i`                             | U2, U3         | The `.video` device already exists in `course.css` and works. Nothing shows the learner what Canvas, the repo, or a template actually looks like in motion.                                                                                                                                   |

---

## 1. Density table — all 39 lessons, worst first

Sorted by longest unbroken run of prose in rendered pixels. `budget` is SPEC §3's 45 words/minute.
Word counts exclude SVG labels (as `check.js` does).

| #   | lesson                                          | U   | min | words | budget | over     | longest unbroken prose (px) | words in it | true visuals | devices present                     |
| --- | ----------------------------------------------- | --- | --- | ----- | ------ | -------- | --------------------------- | ----------- | ------------ | ----------------------------------- |
| 1   | `mbp` Assemble the blueprint                    | 4   | 8   | 504   | 360    | **+144** | **968**                     | 504         | **0**        | box×2, meta                         |
| 2   | `s1` Walk a course through the pipeline         | 1   | 12  | 361   | 540    | -179     | **730**                     | 357         | 1            | diag, terms, meta                   |
| 3   | `mcomp` Compose the module                      | 2   | 8   | 361   | 360    | **+1**   | **728**                     | 359         | **0**        | box×2                               |
| 4   | `w0` Why we build the way we do                 | 1   | 7   | 298   | 315    | -17      | **717**                     | 198         | 2            | diag, cl, ruleline                  |
| 5   | `sbab` Build the SBA                            | 3   | 8   | 312   | 360    | -48      | **684**                     | 312         | **0**        | box                                 |
| 6   | `sip` Review what Design sent you               | 1   | 8   | 268   | 360    | -92      | **682**                     | 281         | **0**        | terms, ruleline                     |
| 7   | `d2i` Unit 2 · Planning the module              | 2   | 7   | 269   | 315    | -46      | **662**                     | 255         | 2            | diag×2, terms, box                  |
| 8   | `s0` How a course is put together               | 1   | 8   | 426   | 360    | **+66**  | **632**                     | 286         | 1            | diag, terms, box, meta              |
| 9   | `modref` What goes in a module                  | 2   | 9   | 352   | 405    | -53      | **607**                     | 257         | 2            | mtbl, cl, terms, ruleline           |
| 10  | `sob` Review the draft objectives               | 2   | 8   | 310   | 360    | -50      | 598                         | 210         | 3            | spec, mtbl, cl, ruleline            |
| 11  | `wj` The job, defined                           | 1   | 8   | 348   | 360    | -12      | 595                         | 230         | 3            | vs×2, diag, terms, ruleline, meta   |
| 12  | `s5` Run the KBA review queue                   | 3   | 8   | 325   | 360    | -35      | 591                         | 255         | 1            | vs, box, ruleline, meta             |
| 13  | `cap` Plan your first real module               | 4   | 25  | 194   | 1125   | -931     | 580                         | 291         | **0**        | **none**                            |
| 14  | `w00` Welcome to Product Development            | 1   | 8   | 298   | 360    | -62      | 556                         | 233         | 2            | mtbl, diag, terms, ruleline×2, meta |
| 15  | `s3` Build the module repo                      | 1   | 8   | 220   | 360    | -140     | 554                         | 226         | 1            | diag, terms                         |
| 16  | `drev` Decide what the next revision inherits   | 4   | 8   | 280   | 360    | -80      | 551                         | 282         | **0**        | box                                 |
| 17  | `fgq` Complete the facilitator guide            | 4   | 8   | 355   | 360    | -5       | 549                         | 262         | 2            | spec, vs, terms                     |
| 18  | `d4i` Unit 4 · Clearing the gates               | 4   | 8   | 338   | 360    | -22      | 538                         | 279         | 2            | diag×2, box, meta                   |
| 19  | `slb` Build the lab steps                       | 3   | 10  | 514   | 450    | **+64**  | 534                         | 315         | 1            | diag, box×2                         |
| 20  | `d1x` Unit 1 check                              | 1   | 12  | 205   | 540    | -335     | 519                         | 211         | **0**        | box                                 |
| 21  | `d2x` Unit 2 check                              | 2   | 12  | 207   | 540    | -333     | 473                         | 213         | **0**        | box                                 |
| 22  | `sws` Design the workplace around the lessons   | 2   | 8   | 204   | 360    | -156     | 470                         | 186         | 1            | diag, ruleline                      |
| 23  | `aico` Work with AI, do not hand it the work    | 3   | 10  | 535   | 450    | **+85**  | 447                         | 273         | 2            | diag×2, box×2                       |
| 24  | `sai` Use AI without outsourcing responsibility | 3   | 8   | 396   | 360    | **+36**  | 441                         | 241         | 1            | diag, box×2                         |
| 25  | `s5b` Write a KBA item                          | 3   | 10  | 381   | 450    | -69      | 434                         | 189         | 1            | spec, box×2, meta                   |
| 26  | `s1b` What every stage has to produce           | 1   | 6   | 309   | 270    | **+39**  | 418                         | 238         | 1            | diag, box                           |
| 27  | `s4` Plan a lesson package                      | 2   | 10  | 450   | 450    | 0        | 381                         | 202         | 2            | spec, diag, ruleline, meta          |
| 28  | `d3x` Unit 3 check                              | 3   | 12  | 187   | 540    | -353     | 379                         | 195         | **0**        | box                                 |
| 29  | `d4x` Unit 4 check                              | 4   | 12  | 183   | 540    | -357     | 379                         | 191         | **0**        | box                                 |
| 30  | `d3i` Unit 3 · Building content                 | 3   | 6   | 145   | 270    | -125     | 377                         | 148         | 1            | diag                                |
| 31  | `schg` Route the change evidence                | 4   | 8   | 390   | 360    | **+30**  | 372                         | 194         | 3            | spec, vs, diag, box                 |
| 32  | `s2` Read the intake decision                   | 1   | 8   | 403   | 360    | **+43**  | 371                         | 172         | 1            | diag, box×2                         |
| 33  | `s7` Test whether your rubric holds             | 3   | 8   | 337   | 360    | -23      | 348                         | 183         | 2            | spec, vs, box, ruleline             |
| 34  | `sax` Run the accessibility audit               | 3   | 8   | 378   | 360    | **+18**  | 348                         | 169         | 1            | cl, box, ruleline, meta             |
| 35  | `msy` When the build changes under you          | 4   | 10  | 345   | 450    | -105     | 345                         | 178         | 2            | spec, diag, box, ruleline           |
| 36  | `qagate` Answer the QA findings                 | 4   | 10  | 264   | 450    | -186     | 345                         | 192         | 1            | mtbl, box                           |
| 37  | `arh` Plan the assessment rhythm                | 2   | 8   | 343   | 360    | -17      | 325                         | 164         | 2            | spec, vs, terms                     |
| 38  | `s6` Red-pen the AI draft                       | 3   | 10  | 376   | 450    | -74      | 325                         | 154         | 2            | spec, diag, terms, box              |
| 39  | `pick` Choose your primary project              | 1   | 5   | 180   | 225    | -45      | 324                         | 181         | **0**        | **none**                            |

**Over word budget (8 lessons):** `mbp` +144, `aico` +85, `s0` +66, `slb` +64, `s2` +43, `sai` +36, `schg` +30, `sax` +18.
`mbp` at 504 words in an 8-minute lesson is the worst single offender on both measures at once.

**Screenshots** (in `.claude/`, captured at 1180px wide, whole lesson including activity):

- `wall-1-mbp-assemble-the-blueprint.png` — 968px of unbroken prose, 0 visuals
- `wall-2-mcomp-compose-the-module.png` — 728px, 0 visuals, four answer options never named in the prose
- `wall-3-sbab-build-the-sba.png` — 684px, 0 visuals, asks the learner to author an artifact it never shows
- `index-top.png` — the landing page, for §6

---

## 2. Visual inventory

### Device usage across the course

| Device                  | Lessons using it                                                                              | Count                     |
| ----------------------- | --------------------------------------------------------------------------------------------- | ------------------------- |
| `svg` in `.diag`        | w00, w0, wj, s0, s1, s1b, s2, s3, d2i×2, s4, sws, d3i, slb, aico×2, s6, sai, d4i×2, msy, schg | 20 diagrams in 19 lessons |
| `.spec` (real artifact) | sob, arh, s4, s5b, s7, s6, msy, fgq, schg                                                     | **9 — none in Unit 1**    |
| `.vs` (comparison)      | wj×2, arh, s5, s7, fgq, schg                                                                  | 7                         |
| `.mtbl` / `table`       | w00, sob, modref, qagate                                                                      | **4**                     |
| `ul.cl` (checklist)     | w0, sob, modref, sax                                                                          | **4**                     |
| `.terms`                | w00, wj, s0, s1, sip, s3, d2i, modref, arh, s6, fgq                                           | 11                        |
| `.ruleline`             | w00×2, w0, wj, sip, sob, modref, s4, sws, s5, s7, sax, msy                                    | 13                        |
| `.box`                  | 22 lessons (none exceeds the 2-box cap)                                                       | 33                        |
| `.video` (iframe)       | d2i, d3i                                                                                      | **2**                     |
| `<img>` / raster        | none in any lesson                                                                            | **0**                     |
| `.pullquote`            | sob, d3i, d4i                                                                                 | 3                         |
| `.media-card`           | d2i                                                                                           | 1                         |

`.mtbl` and `ul.cl` — the two cheapest devices for breaking a wall of text — are used in four lessons each.
The `.box` is used in 22.

### Lessons with **no** genuine visual (pure prose plus boxes)

| Lesson                                        | Unit | What it teaches                  | Why the absence hurts                                                                                                                                   |
| --------------------------------------------- | ---- | -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `mbp` Assemble the blueprint                  | 4    | The module blueprint document    | Teaches an index document; shows no index. The activity then asks the learner to accept or reject seven candidate rows of a table they have never seen. |
| `sbab` Build the SBA                          | 3    | Skill-based assessment           | Asks the learner to author an SBA task cold. The KBA lesson two pages earlier hands them a specimen first.                                              |
| `mcomp` Compose the module                    | 2    | Four module composition patterns | The four answer options appear only on the activity buttons and in the coach line — never together in the prose.                                        |
| `sip` Review what Design sent you             | 1    | The five-document intake package | Judges five packages for missing documents without showing what any of the five documents look like.                                                    |
| `drev` Decide what the next revision inherits | 4    | Delivery Review evidence         | Five kinds of cohort evidence, listed inside one sentence.                                                                                              |
| `d1x` `d2x` `d3x` `d4x`                       | 1–4  | The four unit checks             | The highest-transfer pages in the course; all four are one `.box rule` of scenario prose followed by textareas.                                         |
| `cap` Plan your first real module             | 4    | The capstone                     | A 25-minute page with 194 words and no picture of the deliverable it asks for.                                                                          |
| `pick` Choose your primary project            | 1    | Track selection                  | Lower priority — the engine-rendered track cards carry the visual weight.                                                                               |

---

## 3. Diagram-by-diagram judgment

### Earn their place — keep

| Lesson    | Diagram                                                                    | Why it holds                                                                                 |
| --------- | -------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| `s3`      | File-name anatomy, leader lines into `R-GLAB 301.2.1`                      | Best diagram in the course. Annotates a real string in place; prose cannot point.            |
| `schg`    | Change-routing decision tree, three yes/no branches                        | A genuine decision procedure with branching. Prose would be a nested list nobody could hold. |
| `s1`      | Seven pipeline steps plus the dashed feedback arc back to step 1           | The arc _is_ the content: it shows the loop closing.                                         |
| `d4i` #2  | Build → QA → Fix → Ship → Cohort → back to Build                           | A loop.                                                                                      |
| `d3i`     | AI drafts → you verify → you correct → you own                             | A loop with an ownership boundary.                                                           |
| `d2i` #1  | Backward design: Outcomes → Evidence → Experiences                         | Order is the entire idea; the arrows carry it.                                               |
| `d2i` #2  | Assessment cadence: Daily · Weekly · Module end · Course end on a timeline | A timeline; the spacing is meaning.                                                          |
| `s4`      | 75% / 25% proportional bar with the bar-line marked                        | A quantity chart, not a list. Previews the meter in the activity directly.                   |
| `d4i` #1  | The four gates in sequence with QA sitting between two of them             | Position between gates is the point.                                                         |
| `w00`     | Learner journey with our stage highlighted                                 | Position on a line.                                                                          |
| `s0`      | Nested course → module → lesson → materials rectangles                     | Containment is what a nested box shows and a list cannot.                                    |
| `wj`      | Design / Development / Delivery stages with overlapping groups             | Shows three groups sharing one stage.                                                        |
| `aico` #2 | You decide → direct → it drafts → you judge → you own                      | Flow with an ownership boundary. See the duplication note below.                             |
| `slb`     | Numbered callouts pointing into a real lab step                            | Earns it, but should be converted — see "convert" below.                                     |

### Lists drawn as rectangles — cut the SVG, use the real device

| Lesson    | Diagram                                                  | Verdict                                                                                                                                                       | Replace with                                                                                                   |
| --------- | -------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| `sws`     | Six numbered rects and circles = "the six threads"       | **Decorative.** No flow, no hierarchy. The coach line even says "the six threads are in the diagram above" — telling the learner to read a picture as a list. | `ul.cl` — six checkable threads. Shorter, keyboard-native, and matches the verdict the activity asks for.      |
| `s6`      | Four numbered rects = "the four patterns in an AI draft" | **Decorative and duplicated.** The `.terms` block immediately below repeats all four names with their catch method.                                           | Delete the SVG. Fold the four names into the existing `.terms` (`dt` = pattern, `dd` = how it is caught).      |
| `w0`      | Two rects: "AI CAN DRAFT" / "YOU HAVE TO DECIDE"         | **Decorative and cross-duplicated.** It is the `.vs` device drawn in SVG, and `aico`#1 is the same diagram two units later.                                   | Make it `.vs` (`.a`/`.b` with `.vh`) — or cut it here and keep only `aico`'s.                                  |
| `aico` #1 | Two rects: "WHAT YOU BRING" / "WHAT IT BRINGS"           | The same shape as `w0`'s. Keep exactly one of the pair.                                                                                                       | `.vs`.                                                                                                         |
| `s1b`     | Four labelled columns each holding a bullet list         | It is a table.                                                                                                                                                | `.mtbl`: Stage / Produces / Folder it lives in. Adds the folder column the caption already promises.           |
| `s2`      | Three rects, each a heading plus three lines             | It is a table.                                                                                                                                                | `.mtbl`: Classification / What Development builds / What Development does not.                                 |
| `msy`     | Document → Bring options → Escalate early                | Marginal. The arrow only says "in this order", which the caption and the prose both already say.                                                              | A numbered `ol` under a `.ruleline`, or drop it — the `.spec` escalation note below it does the real teaching. |
| `sai`     | Three question gates with arrows                         | Marginal. Three checks, all of which must pass — that is a checklist.                                                                                         | `ul.cl`, three items.                                                                                          |

### Diagrams that duplicate prose or a box next to them

| Lesson             | Duplication                                                                                                                                                                                            | Fix                                                                                                                                                                       |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `s0`               | Triple: the SVG hotspot tooltips define Course / Module / Lesson, the `.box info` directly beneath repeats all three verbatim, and the `.terms` beneath _that_ defines Module and Lesson a third time. | Cut the `.box info` (SPEC §3: "If a diagram and a box say the same thing, the box goes"). Saves roughly 110 words and takes `s0` from +66 over budget to under it.        |
| `slb`              | The SVG's four callouts are repeated word for word in the `.box rule` "One action, named specifics, a visible result" immediately below.                                                               | Convert the SVG to `.spec` + `.an` (the native device, already used in nine lessons) and delete the box. Takes `slb` from +64 over budget to under it.                    |
| `s6`               | See above — SVG against `.terms`.                                                                                                                                                                      | Delete the SVG.                                                                                                                                                           |
| `aico` #2 vs `d3i` | `aico`'s five-step ownership chain repeats `d3i`'s four-step AI loop from the unit opener seven lessons earlier.                                                                                       | Keep `d3i`'s, since it is the opener. In `aico`, make the diagram _add_ the missing step ("You direct — a brief, not a blank prompt") rather than redraw the whole chain. |

### Diagrams appearing before the prose that motivates them

| Lesson | Position                                                                            | Verdict                                                                                                                                                                                                                  |
| ------ | ----------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `s0`   | The SVG is the **first element in the lesson body** — one word of prose precedes it | Technical violation of "never before the prose that motivates it". It is a hierarchy diagram so it can survive, but it opens the page with a picture and no reason to look at it. Move one motivating sentence above it. |
| `s4`   | 16 words of prose before the SVG                                                    | Borderline. One line ("skill comes from doing, so class time is budgeted") is thin motivation for the central rule of Unit 2.                                                                                            |
| `s2`   | 69 words before                                                                     | Fine.                                                                                                                                                                                                                    |
| `s6`   | 38 words before                                                                     | Fine — but the diagram goes anyway.                                                                                                                                                                                      |

---

## 4. Specific additions — the device is named in each

Ordered by return. Every one is a `.spec` unless a picture genuinely beats an artifact.

### Tier 1 — ship-blockers. Each is a lesson asking for an artifact it never shows.

**1. `mbp` — `.spec` of a real Module Blueprint.**
This is the worst page in the course (968px of unbroken prose, 504 words in an 8-minute lesson, zero visuals) and the
fix is one specimen. Show `MBP 301` as a table: `# | File name | Type | Delivery order | Link`, six or seven rows —
`Lesson 301.1`, `GLAB 301.2.1`, `Quiz 301.2`, `KBA 301`, `R-SBA 301`, `Rubric — SBA 301`, `FG 301`. Use `.an` to mark
the two things the prose argues about: the delivery-order column, and one greyed row labelled _"charter — belongs on
no blueprint"_. The activity then judges seven candidate rows against a table the learner has actually read.
Place it directly after "What a blueprint is for", and delete the `.box info` "What goes on it, and what does not"
that follows — the specimen says it better. That single swap takes the page from 504 words to roughly 380.

**2. `sbab` — `.spec` of a finished SBA task.**
`s5b` (Write a KBA item) hands the learner a specimen before asking them to author. `sbab` asks them to author an SBA
with nothing on screen. Show `R-SBA 301` in `.spec-h`/`.spec-b`: the scenario line, the conditions (_working alone,
one sitting, may open the vendor documentation, may not ask a peer_), what the learner submits, and how it is scored.
Annotate the three conditions with `.an`, because "alone is the constraint doing the work" is the lesson's own claim
and it is currently only asserted. Put it immediately after "What an SBA is", before the `.box rule` carrying the
module objective.

**3. `sip` — `.spec` of one page of a Module Build Spec.**
Unit 1's only artifact-judgment lesson, and Unit 1's only lesson with no visual of any kind. The `.terms` list of five
documents tells the learner the names; it does not let them recognise one. Show the first half-page of a real Module
Build Spec — header block (course, UCI, module, date, author), the objectives section, and an evidence-plan section
that is visibly two lines long. Put an `.an` on the thin evidence plan. That is the exact gap the first queue item
asks them to name, and right now they are asked to spot it in a description rather than in a document.

**4. `s3` — `.spec` of the repo folder tree.**
The lesson asks the learner to create five files by name into folders called Lessons / Assignments / Assessments /
Resources — four folder names that appear for the first time inside the activity widget. Add a monospace `.spec`
folder tree above the activity showing the four folders with the one seed file already in place, and an `.an` on
`R-GLAB 301.2.1` marking the `R-` prefix. The existing file-name SVG stays; it is the best diagram in the course.

**5. `mcomp` — `.mtbl`, four rows.**
The activity's four buttons (Standard / Short / Prep-foundational / Vendor-constrained) are named nowhere in the
prose — only in the coach line. `modref` two lessons back has the full table, but the learner is asked to recall four
categories from two pages ago while working a queue. Add a compact four-row recall table: `Pattern | The tell |
What its summative looks like`. Then cut the prose from 359 words to under 200 — this is a judgment-shaped lesson and
SPEC §2 caps its pre-activity prose at 150 words. Net effect: the page shrinks _and_ gains its only visual.

### Tier 2 — high value

**6. The four unit checks (`d1x`, `d2x`, `d3x`, `d4x`) — `.mtbl` for the scenario.**
All four open with a `.box rule` of scenario prose, then textareas. `d1x` in particular lists four handoff documents
with a status each ("present" / "present, dated fourteen months ago") — a three-column table written as a paragraph.
Use `.mtbl`: `Document | Status | Note`, with the stale job description visibly flagged. Do the same shape for the
other three: the scenario becomes something to look at, and the textareas stop being the only thing on screen.

**7. `drev` — `.mtbl` of the evidence types.**
"Assessment scores, item statistics, survey responses, instructor notes, and everything logged during the cohort" is
five inputs in one sentence. A three-column table (`Evidence | What it can prove | What it cannot`) is the actual
teaching point of the lesson — the queue asks the learner to separate a pattern from one voice, and the table is where
that distinction becomes visible.

**8. `cap` — `.spec` of the Module Development Package folder.**
25 minutes, zero visuals, and it asks for a deliverable the learner has never seen assembled. Show the finished
package as a folder tree: the four subfolders, the blueprint, the one built lesson, its lab, its assessment, its
rubric. The Canvas assignment description already enumerates these in
`capstone/Capstone-Module-Development-Package.html`; putting the tree on the page turns eight bullet points into one
picture of "done".

**9. `s1` — `.vs` to split the 730px run.**
Second-worst unbroken run in the course, and all of it sits _before_ the pipeline diagram: a `.terms` block of seven
definitions, then two dense paragraphs on ADDIE versus backward design. That pairing is the course's spine (SPEC §1)
and it is exactly the `.vs` device: `.a` = ADDIE, _which stage you are standing in_; `.b` = backward design, _what
order to think in once you are there_. Two columns, one line each. It breaks the run and states the distinction more
sharply than the paragraph does.

**10. `w0` — the four house commitments as `ul.cl`.**
They already read as a checklist ("Learning by doing… At least 75 percent… Backward design… AI inside real work") but
render as prose lines, producing a 717px run before the diagram arrives. The `ul.cl` device exists; use it.

### Tier 3 — worth doing if time allows

- **`d2i`, `d4i`** (unit openers, 662px and 538px runs): the `ul.obj` objectives list is a genuine visual but renders
  as plain `li`. Both openers stack objectives, terms, two diagrams and a box in one column. Move the `.terms` block
  below the first diagram in each.
- **`modref`** (607px): the "Run this before any module plan is finalized" six-item list is already `ul.cl`; the
  607px run is the three paragraphs above the first `.mtbl`. Promote "Every module ends with a summative task…" to a
  `.ruleline` — it is already the rule of the lesson.
- **`sob`** (598px): move the existing `.mtbl` (Know / Do / Decide verbs) up, above "Why we review objectives we did
  not write". The table is the standard; the rationale can follow it.
- **`w00`** (556px): the welcome page is otherwise fine, but the journey diagram sits 190 words in. It is the page's
  only orienting image; it belongs above the "What to expect" ruleline, not below it.

---

## 5. Video

### What exists today

| Location                            | What                                                                                                           | Notes                                                                                           |
| ----------------------------------- | -------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| `course.css:251–255`                | `.video` (16:9 responsive iframe wrapper) and `.vidcap` (watch-task caption)                                   | The device is built, styled and working. It is used twice.                                      |
| `course.js` — `d2i` (Unit 2 opener) | YouTube embed: Grant Wiggins, _Understanding by Design_ workshop, part 1                                       | Third-party conference recording. `d2i` is a **7-minute** unit opener.                          |
| `course.js` — `d3i` (Unit 3 opener) | YouTube embed: Marty Lobdell, _Study Less, Study Smart_                                                        | `guide.js` itself labels this **"1 hr"**. `d3i` is a **6-minute** unit opener.                  |
| `guide.js:20–22`                    | Three YouTube links in the Handbook: Veritasium (14 min), Wiggins pt 1 and pt 2, Lobdell (1 hr)                | Links, not embeds. Correct placement — a handbook is where an hour-long video belongs.          |
| `guide.js:57, 191`                  | `VLINK` documented as a file-name prefix ("video link item"), e.g. `VLINK 301.1.1`                             | **The course teaches learners that VLINK exists as an artifact type, and contains no VLINK.**   |
| `guide.js:430`                      | "Video → Canvas Studio" in the tooling table                                                                   | Canvas Studio is the house tool. No lesson shows it.                                            |
| `sax` activity item                 | "A 12-minute chaptered demo video with closed captions and a downloadable transcript" — approved as accessible | The course asserts the standard for video it does not itself supply.                            |
| Anywhere                            | `<video>`, `.mp4`, Vimeo, Loom, Wistia, screen recordings, raster images                                       | **None.** The only `<img>` in the whole project is the base64 Per Scholas logo on `index.html`. |

**Two problems with what is there.** Both embeds are long-form third-party lectures inside short openers — a 7-minute
page containing a 45-minute video is a time-budget contradiction the learner notices immediately. And neither shows
Per Scholas work. Recommend demoting both to Handbook links, where the other three already live, and replacing them
with short in-house screen recordings from the shot list below.

### Shot list — five recordings to commission

Nobody can generate these; they need recording. Each is specified to hand to whoever records.
House constraints apply to all five: **closed captions and a transcript are mandatory** (`sax` teaches this and
`guide.js:414` requires it), record at 1920×1080, no instruction that exists only in audio, and cursor movement slow
enough to follow. Embed with the existing `.video` device plus a `.vidcap` watch-task line, exactly as `d2i` does now.

---

**V1 · Staging the module repo — 90 seconds**
_Sits in `s3`, immediately below the file-name SVG and above the repo-builder activity._
Screen recording of a real Google Drive (or UPP) module folder being created from empty: create the module folder,
create the four subfolders in order (Resources, Lessons, Assignments, Assessments), then create `MBP 301`,
`Lesson 301.1`, `GLAB 301.1.1`, `R-SBA 301`. Pause one beat on the `R-` prefix and one on `KBA 301` having no lesson
number. End on the finished tree. No narration required — the on-screen typing is the content, and captions carry the
two pauses.
**Why video beats text:** the lesson teaches a naming grammar and a folder structure with no way to see either come
into existence, and the activity that follows is literally this task.

**V2 · Where the blueprint takes you — 2 minutes**
_Sits in `mbp`, directly after the proposed `.spec` (addition #1) and before the row-judgment queue._
Split screen, or cut between two windows: the Module Blueprint document on one side, the Canvas course on the other.
Click a blueprint row; land on the file in Canvas. Do it three times — a lesson, a lab, the KBA. Then show one row
with a dead link and let the reviewer's problem sit on screen for two seconds.
**Why video beats text:** `mbp` asserts "QA reviews from the blueprint, Delivery builds the Canvas course from the
blueprint" and the learner has no way to picture that traversal. This is the highest-value recording in the set — it
is the fix for the worst page in the course.

**V3 · Filling the Lab Template — 3 minutes**
_Sits in `slb`, after the `.spec` conversion described in §3 and before the fix-the-steps activity._
Open the real Lab Template. Fill the header block. Then write step 3 live, badly, out loud — "Open the security
settings and configure them appropriately" — and repair it on camera into "In Windows Defender Firewall, open
Advanced Settings, create an inbound rule blocking TCP port 23, and confirm it appears in the rule list." Narrate the
three questions while doing it: one action, named specifics, visible result.
**Why video beats text:** the lesson's claim is that a template "already carries the section structure, so a lab that
fights the template usually has a structural problem". That is invisible until you watch someone type into it.

**V4 · Submitting to QA and answering the findings — 2 minutes**
_Sits in `qagate`, above the findings queue._
Screen recording of the real submission path: open the QA submission form or board, attach the module blueprint,
submit. Cut to the findings coming back — show the actual findings log with three entries. Open one, show the fix
applied in the file, mark it resolved, then push back on a second one in writing with a reason.
**Why video beats text:** `qagate` is one of the four gaps SPEC §4 names as must-cover, and "submit, read findings,
fix, resubmit, push back with a reason" is a five-step workflow across two systems. It is the clearest case in the
course of a process that is tedious in prose and obvious on screen.

**V5 · Welcome from the team — 60 seconds**
_Sits in `w00`, above the learner-journey diagram._
Doug Conklin and Keyla Centeno Diaz to camera — both are already named on `index.html`: who we are, what Product
Development owns, what the next five hours will feel like, and one sentence each on what they hope a new developer
takes away. Talking heads, no slides.
**Why video beats text:** it is the one place in the course where a human voice is worth more than a diagram, and
`w00` is the page where a new hire decides whether this is a real onboarding or a compliance module. It also
retro-justifies the `VLINK` convention the Handbook teaches.

_Optional sixth, lower priority:_ **`sax` — a 45-second screen-reader pass** over one lab step with good alt text and
one with `alt="image.png"`, played with audio. The audit queue asks the learner to rule on exactly this and they have
never heard what a screen reader does with a filename. Requires audio plus captions of the screen-reader output itself.

---

## 6. Landing page against the unit pages

`index.html` is not a small deviation; it shares no styling mechanism with the rest of the course.
It links **no stylesheet**, loads **no webfont**, and carries every rule as an inline `style` attribute — the only
`<style>` block is four lines covering the body background and a focus ring. Nothing in `course.css` can reach it,
so it will drift again on the next change.

### Typography

|                       | `index.html`                                                           | `unit1–4.html`                                                  |
| --------------------- | ---------------------------------------------------------------------- | --------------------------------------------------------------- |
| Webfonts loaded       | **none** — no `<link>` to Google Fonts                                 | Bricolage Grotesque, Atkinson Hyperlegible, IBM Plex Mono       |
| Body and heading face | `Arial, Helvetica, sans-serif` (verified as the computed font on `h1`) | `--sans: Atkinson Hyperlegible` / `--disp: Bricolage Grotesque` |
| Monospace face        | `'Courier New', monospace` — 8 occurrences                             | `--mono: IBM Plex Mono`                                         |
| `h1`                  | 34px Arial, default weight                                             | 23px Bricolage Grotesque 600, `letter-spacing:-.015em`          |
| Body size             | 15.5 / 14.5 / 14 / 13.5 / 13px — five sizes hand-set per element       | one `body` rule at 14.5px with named exceptions                 |

**Atkinson Hyperlegible is a legibility typeface.** The landing page is the first thing every learner sees and it is
the one page that does not use it — while the course goes on to teach WCAG 2.1 AA compliance in `sax`.

### Colour

`index.html` defines 18 hex colours inline. Three of them exist in `course.css`
(`#12283f` = `--ink`, `#faf7f2` = `--paper`, `#1c2b3a` = `--text`). The other fifteen are a parallel system:

| index.html                                 | Role                        | Nearest `course.css` token | Same?                                                                      |
| ------------------------------------------ | --------------------------- | -------------------------- | -------------------------------------------------------------------------- |
| `#004878`                                  | hero background, CTA text   | `--indigo #1d5fa8`         | **no**                                                                     |
| `#0078c0`                                  | Unit 2 accent, focus ring   | `--indigo #1d5fa8`         | **no**                                                                     |
| `#009cd8`                                  | Unit 3 accent               | —                          | no equivalent                                                              |
| `#0c4878`                                  | Unit 4 accent               | —                          | no equivalent                                                              |
| `#78c0cc`                                  | hero eyebrow, card accent   | —                          | no equivalent                                                              |
| `#fcc048`                                  | hero underline, card accent | `--gold #5b6d82`           | **no** — `--gold` in `course.css` is a desaturated blue-grey, not a yellow |
| `#e2dccf`                                  | card borders (11×)          | `--line #e8e1d6`           | **no** — near-miss, visibly warmer                                         |
| `#42566a`                                  | body muted (18×)            | `--ink2 #2a4763`           | **no**                                                                     |
| `#5a6b7b`                                  | secondary muted             | `--muted #5b6b7a`          | **no** — off by one digit; almost certainly meant to match                 |
| `#8a97a4`                                  | unit-card minutes label     | `--muted #5b6b7a`          | **no**                                                                     |
| `#eaf4fa`, `#b9dcec`, `#cfe6f2`, `#3c4d5e` | panels and hero text        | —                          | no equivalents                                                             |

`#5a6b7b` against `--muted #5b6b7a`, and `#e2dccf` against `--line #e8e1d6`, are the tell: someone was eyeballing the
unit pages rather than reading the tokens.

### One WCAG 2.1 AA failure

**`#8a97a4` on `#ffffff` = 2.98:1.** Required: 4.5:1. It is the "~90 min" duration label on all four unit cards, at
11px — too small to qualify as large text. It is generated by `build.js` (the `cards` template literal), so it must
be fixed there, not in `index.html`. Everything else on the page passes: hero eyebrow 4.64:1, hero subtitle 7.39:1,
card body 7.58:1, section subheads 5.49:1, CTA 9.55:1.

SPEC §5: _"Contrast is checked against WCAG 2.1 AA, because this course teaches that standard and cannot fail it."_
The landing page currently fails it, on a label that appears four times.

### Structure

The landing page is itself a wall of text: **1070 words, 3017px tall, one image (the base64 logo), zero SVG, zero
tables.** The unit-card blurbs run 45–60 words each — longer than most `.spec` captions inside the course. There is
no picture of the four-unit arc anywhere, even though `d4i` and `s1` already contain SVG step-sequences that would
serve.

### Recommended fix (out of scope for this audit; listed for the owner)

1. Give `index.html` the same Google Fonts `<link>` and a small `landing.css` that imports the `:root` tokens from
   `course.css`, then replace the inline colours with `var(--…)`.
2. Fix `#8a97a4` in `build.js` — `--muted #5b6b7a` clears AA at 5.48:1 and is already the course's muted token.
3. Keep the per-unit accents (`#004878 / #0078c0 / #009cd8 / #0c4878`), which are a real Per Scholas ramp, but promote
   them into `course.css` as `--u1`…`--u4` so `build.js` and the unit pages read them from one place.

---

## 7. Suggested `check.js` additions

`check.js` enforces prose length and the two-box cap but has no rule about visual density. Three checks would have
caught everything in §1 and would stop it recurring:

1. **Zero-visual lesson** — fail any lesson whose rendered HTML contains no `svg`, `.spec`, `.vs`, `.mtbl`, `table`,
   `ul.cl` or `img`. Would flag 11 lessons today.
2. **Unbroken prose run** — fail any lesson where more than roughly 250 words of consecutive text blocks appear with
   no visual between them, counting `.box`, `.ruleline` and `.meta` as text. Would flag `mbp` (504), `mcomp` (359),
   `s1` (357), `sbab` (312) and eight others.
3. **Artifact without a specimen** — for any lesson whose `shape` is `build`, require at least one `.spec`.
   Would flag `mbp`, `sbab` and all four unit checks.
