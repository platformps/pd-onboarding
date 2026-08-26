# Functional QA — Per Scholas PD Onboarding

**Date:** 2026-08-25 · **Build:** `b0825-1730` · **Method:** Playwright/Chromium against `http://localhost:8899`, every activity driven to completion with correct answers on **both tracks**, plus a deliberate wrong answer on at least one item of every activity type.

## Headline

|                              |                                                |
| ---------------------------- | ---------------------------------------------- |
| Lessons driven               | **39 × 2 tracks = 78**                         |
| Activities completed         | **38 × 2 = 76** (`modref` has no activity)     |
| Drive failures               | **0**                                          |
| `pageerror` / console errors | **0**                                          |
| Points awarded vs declared   | **28 / 28 exact**                              |
| Progress after reload        | **38/38 done, `ST.cap` true, track preserved** |

Every activity in the course can be completed by a learner on both tracks. Nothing dead-ends. The four
known bug classes from the last round (review dead-end, journal `model` printing JS source, literal
`${...}`, `undefined` from missing `fbGood`/`fbBad`, scroll-jump-to-top) are **all clear** — see
"Regression re-checks" below. The issues that remain are at the edges: the end-of-unit exit, the
capstone link, Handbook search, and keyboard access.

---

## Findings, most severe first

### 1. The "Finish" button is dead at the end of every unit — including after the capstone

**Lessons:** `d1x` (u1), `d2x` (u2), `d3x` (u3), `cap` (u4) · **Both tracks**

**What a learner experiences:** They complete the last lesson of a unit. The primary button reads
**Finish**, but it is greyed out (`opacity: .45`, `cursor: default`) and clicking it does nothing.
After submitting the capstone they see the "Course complete" banner and then a dead Finish button.
There is no link back to `index.html`, and the topbar contains no outbound links at all
(`.topbar a` returns `[]`), so the only way onward is the browser Back button.

**Cause:** `engine.js` → `refreshNav()`:

```js
nb.disabled = !next || gate;
```

On the last lesson of a unit `next` is `undefined`, so `!next` is `true` and the button is
unconditionally disabled. The label is separately computed as `next ? 'Next →' : 'Finish'`, so the
button _says_ Finish but can never be pressed. Nothing ever assigns `nb.onclick` in that branch either
(`if(next&&!gate) nb.onclick=...`).

**Verified:** all four units — button `disabled=true`, `onclick=null`, `ST.current` unchanged after a real click.

---

### 2. The capstone never shows a link to the capstone assignment

**Lesson:** `cap` (u4) · **Both tracks**

**What a learner experiences:** The final gold callout tells them to "Open the **Module Development
Package** assignment" and then says **"(Find it in this course's Assignments.)"** — plain text, no link.
They are told to go find it themselves at the single most important moment in the course.

**Cause:** `engine.js:251`

```js
const asgn =
  typeof CAPSTONE_ASSIGNMENT_URL !== "undefined" && CAPSTONE_ASSIGNMENT_URL
    ? CAPSTONE_ASSIGNMENT_URL
    : "";
```

`CAPSTONE_ASSIGNMENT_URL` is **never defined anywhere in the repo** (this one reference is its only
occurrence), so the fallback branch always renders. Meanwhile
`capstone/Capstone-Module-Development-Package.html` and `capstone/Capstone-Rubric.csv` exist on disk and
are linked from nothing in the shipped course.

---

### 3. Handbook search for "WCAG" returns no results

**Affects:** Unit 3 `sax` "Run the accessibility audit" · **Both tracks**

**What a learner experiences:** Mid-audit they open 📘 Handbook and type the exact term the lesson has
been using — **WCAG** — and get "No sections match." The section they want ("Accessibility essentials")
is right there in the nav.

**Cause:** `guide.js` contains **zero occurrences of the string "WCAG"** (5 occurrences of "accessib*").
`renderGuide()` filters on `g.title` + `g.html`, so the term is genuinely unindexed. Searching
"accessibility" finds 3 sections and "accessible" finds 2 — only the acronym misses.

**Not affected:** the in-lesson glossary link works. `sax` links to `data-g="access"` and that opens the
right section. Only the search box misses.

---

### 4. The "Product Hub" link in lesson 1 also pops the Handbook open on a random section

**Lesson:** `w00` (u1, the very first lesson) · **Both tracks**

**What a learner experiences:** They click the "Product Hub" link. A new browser tab opens to
productops.perscholas.org **and at the same time** the Handbook drawer slides open over the course on
whatever section happens to be current — "Our philosophy" on a fresh page load.

**Cause:** `course.js:141` gives an external anchor the glossary class but no target section:

```html
<a
  href="https://productops.perscholas.org/product-hub"
  target="_blank"
  rel="noopener"
  class="glink"
  style="cursor:pointer"
  >Product Hub</a
>
```

`engine.js:715` binds a handler to _every_ `.glink`:

```js
document
  .querySelectorAll(".glink")
  .forEach((g) => (g.onclick = () => openGuide(g.dataset.g)));
```

`g.dataset.g` is `undefined`, and `openGuide(sec)` only reassigns `gdSection` when `sec` is truthy — so it
opens the drawer on the previous section. This is the only one of the 34 glossary links in the course
missing `data-g`; the other 33 all resolve to real sections.

---

### 5. The sort activity's wrong-answer message is written for the wrong activity

**Lessons:** `s0` (u1), `arh` (u2) · **Both tracks** · (`s1b` is correct)

**What a learner experiences:** Misfile a card in `arh` and they are told:

> ✗ "Warm-up discussion" isn't produced at Summative · measures the standard: **think about which stage creates it.**

There is no "stage" in that activity — the buckets are Formative and Summative. In `s0` the buckets are
Course / Module / Lesson level, and the learner gets the same "which stage creates it" hint.

**Cause:** `engine.js:437` hardcodes one message for all three sorts:

```js
msg.textContent =
  '✗ "' +
  a.cards[ci].t +
  '" isn’t produced at ' +
  a.buckets[bi].label +
  ": think about which stage creates it.";
```

It was written for `s1b`, the pipeline-stage sort, and the other two inherited it. The activity still
completes fine; the coaching is just nonsense in 2 of 3 cases.

---

### 6. The commit gate says "Tick both" but there are three checkboxes

**Lesson:** `w00` (u1) · **Both tracks**

Press Confirm with a box unticked and the button reads **"Tick both to continue"**. `w00`'s checklist has
**3** items, and the lesson's own coach text says "tick the **three** checkpoints and press Confirm."

**Cause:** `engine.js:271` — `btn.textContent="Tick both to continue"`, hardcoded.

---

### 7. Sort, Day and Fix cannot be completed with a keyboard

**Lessons:** `s0`, `s1b`, `arh` (sort) · `s4` (day) · `slb`, `s6` (fix) · **Both tracks**

Measured focusability of each activity's controls:

| Control                                                           | Element  | tabindex | role     | Key handler | Keyboard reachable |
| ----------------------------------------------------------------- | -------- | -------- | -------- | ----------- | ------------------ |
| `.scard` (sort card)                                              | `div`    | `0`      | `button` | yes         | **yes**            |
| `.sbucket` (sort drop target)                                     | `div`    | —        | —        | no          | **no**             |
| `.pal-item` (day palette block)                                   | `div`    | —        | —        | no          | **no**             |
| `.sent` (fix document sentence)                                   | `span`   | —        | —        | no          | **no**             |
| `.choice`, `.stamps button`, `.fixopt`, `.rb-scale button`, `.rm` | `button` | —        | —        | n/a         | yes                |

The sort card was given `tabindex="0"`, `role="button"` and an Enter/Space handler, but its **drop target
was not** — so a keyboard user can select a card and then has nowhere to put it. Worth flagging because
Unit 3 (`sax`) teaches WCAG 2.1 AA compliance as a job standard.

---

### 8. There is no in-page gating: a new learner can jump straight to the capstone

**Both tracks**

With `localStorage` cleared and 0 lessons done, opening ☰ Lessons in `unit4.html` and clicking the last
entry lands directly on `cap`, fully rendered and submittable.

**Cause:** deliberate — `engine.js`:

```js
function unlocked(i) {
  /* Lesson gating is handled by Canvas module requirements, not here. */ return true;
}
```

Flagging it because (a) the brief asked that locked lessons actually be locked, and (b) the drawer still
ships the dead affordance: `unlocked(i)` is used to emit a 🔒 glyph and a
`title="Locked until you finish the previous unit"` tooltip that **can never render**. If the demo runs
outside Canvas, the course has no order enforcement at all.

Per-lesson **Next** gating does work correctly: on a fresh activity `nextb.disabled === true` and the
"Complete the activity to continue." locknote is shown; both clear the moment the activity completes.

---

### 9. Triage is the only judged activity with no retry

**Lessons:** `s2` (u1), `mcomp` (u2) · **Both tracks**

Every other judged type lets the learner correct themselves. Triage grades on the first stamp and
disables the item. The learner _is_ told what happened —
`✗ You stamped "Audit the repos, then build the gaps", correct: "Build nothing". …` — but cannot re-answer.
Completion is unaffected. Noting it only because the brief asked that a wrong answer be retryable.

---

### 10. Repo hygiene (not user-facing)

`nul` — a 323 KB file created by a stray Windows `> nul` redirect (it is a copy of `course.js`) — and
`engine.js.bak` are both sitting in the repo root and will be served by the static host.

---

## Regression re-checks — all known bug classes are clear

| Bug class                                                                   | Result    | Evidence                                                                                                                                                                                                                                                                                                                                                   |
| --------------------------------------------------------------------------- | --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `review` item with `good:false` and no `ok:true` reason dead-ends the queue | **CLEAR** | All 13 review activities drive to completion. Every `good:false` item that offers reasons has exactly one `ok:true`. The 4 items with `good:false` and _no_ reasons (`wj` #5 and #7, `d4i` #2 and #5) hit the engine's auto-advance branch, advance correctly, and render their `why` text. Verified item-by-item.                                         |
| Journal `model` rendering raw JavaScript source                             | **CLEAR** | All 9 journals render prose model answers. No `model()` returns a function; no output matches JS-source patterns; none render `[object Object]`.                                                                                                                                                                                                           |
| Literal `${...}` from a plain string                                        | **CLEAR** | Zero literal `${}` in any of the 78 rendered lessons or any of the 21 Handbook sections. The one intentional `${GUIDE}` token in `coach` is substituted by `coachBar()`.                                                                                                                                                                                   |
| `undefined` from a missing `fbGood`/`fbBad`                                 | **CLEAR** | All 8 feedback-bearing activity types declare both. No rendered lesson text, feedback line, or result line contains `undefined` or `NaN`.                                                                                                                                                                                                                  |
| Clicking a control scrolls back to the top                                  | **CLEAR** | Measured `main.scrollTop` before/after a real click at the bottom of the page. `sort`, `story`, `fix`, `day`, `rubric`, `repo`: unchanged. `triage` and `review` move ~220–270px, which is the deliberate `scrollIntoView({block:'nearest'})` reveal in the engine — the answered item ends up on screen at `top≈48px` and `scrollTop` never approaches 0. |
| `{{DOMAIN}}` / `{{ROLE}}` / `{{TAG}}` left unsubstituted                    | **CLEAR** | Zero unsubstituted tokens in any lesson on either track.                                                                                                                                                                                                                                                                                                   |

## Also verified working

- **Both tracks.** `itsupport` and `software` complete identically. Only `s6` carries a `variants.swe`
  activity; everything else is re-skinned through `domainise()` and substitutes cleanly on both.
- **Demo dismissal.** 16 lessons carry a worked example. "Skip: I've got it" clears it on all 16 on both
  tracks; stepping through with "Show me the thinking →" (tested on `wj` and `s7`) also clears it and
  reveals the activity. Neither path throws or loses scroll position.
- **Wrong answers.** Every activity type gives a specific, useful message and allows a retry
  (triage excepted, see #9). Sampled: commit "Tick both to continue"; journal "A sentence or two per box,
  then save"; review "✗ This one is ours. Re-read the four responsibilities before deciding."; story
  "✗ Not that one. …Pick again."; fix "That sentence is fine, plain, accurate, on-objective. Look again.";
  repo "✗ No pending file matches that name. Check the prefix…"; day "Not yet, still missing: Warm-up,
  ≥1 lab, Exit ticket, 240 min filled, Activated ≥75%…"; rubric "Score all three dimensions first.";
  capstone "Fill in all three plan fields to submit". A **wrong reason** inside a review send-back is
  also recoverable: the reason buttons stay live, the correct one advances, and the attempt is recorded
  (`ST.data['w00r-t1'] === 1`).
- **Points.** All 28 point-bearing activities award exactly their declared value on both tracks
  (355 total across the course). The `res-*` "Complete. N of N right on the first try." line renders with
  no `undefined`/`NaN`.
- **Persistence.** After completing all 38 activities and reloading: `ST.done` = 38 entries, `ST.cap` =
  true, `ST.track` preserved, per-unit bookmarks restored (opening unit3 while holding a unit1 bookmark
  resolved to unit3's own bookmark; returning to unit1 restored `s2`).
- **Handbook.** Opens from 📘, 21 sections, every nav link present, every `<h2>` matches its section
  title, no thin or empty sections, no placeholder artifacts, content pane scrolls to top on section
  change, closes from × and from the scrim. Search works (`rubric` → 7, `kba` → 8, `sba` → 8) apart from
  finding #3.
- **Glossary links.** 34 `data-g` links across the course, 15 distinct targets, all resolving to real
  `GUIDE` sections. One link is missing `data-g` — finding #4.
- **Lessons menu.** Opens from ☰, lists this unit's lessons only, navigates on click, closes on
  navigation. The in-drawer project switcher changes `ST.track` and re-renders.
- **Next-button walk.** Clicking only "Next →" reaches every lesson in order in all four units:
  11/11, 8/8, 11/11, 9/9.
- **Drag-and-drop.** Real mouse drags work for `sort` (card → bucket) and `day` (palette → schedule);
  click-to-place works as an alternative for both.
- **Unit files.** Each unit page carries only its own lessons (11 / 8 / 11 / 9 = 39). Content is
  **no longer duplicated** across the four unit files — they are 2.2 KB shells generated from
  `unit.template.html`, and `node check.js` confirms zero drift.
- **Assets.** `index.html`, all four units, `course.js`, `engine.js`, `guide.js`, `storage.js` and
  `course.css` all return 200. The four unit links on the landing page resolve and each page boots.
- **`node check.js`** passes: 0 failures, 0 warnings.

---

## Full results — every lesson × every track

Legend: `(n/m pts)` = points awarded / points declared. Demo = lesson carries a worked example that was
dismissed before driving the activity.
| Unit | Lesson | Type | Pts | Demo | IT Support | Software Engineering |
|---|---|---|---|---|---|---|
| 1 | `w00` Welcome to Product Development | commit | — | — | PASS | PASS |
| 1 | `pick` Choose your primary project | track | 5 | — | PASS (5/5 pts) | PASS (5/5 pts) |
| 1 | `w0` Why we build the way we do | journal | — | — | PASS | PASS |
| 1 | `wj` The job, defined | review | 12 | yes | PASS (12/12 pts) | PASS (12/12 pts) |
| 1 | `s0` How a course is put together | sort | 12 | — | PASS (12/12 pts) | PASS (12/12 pts) |
| 1 | `s1` Walk a course through the pipeline | story | 14 | — | PASS (14/14 pts) | PASS (14/14 pts) |
| 1 | `sip` Review what Design sent you | review | 15 | yes | PASS (15/15 pts) | PASS (15/15 pts) |
| 1 | `s1b` What every stage has to produce | sort | 12 | yes | PASS (12/12 pts) | PASS (12/12 pts) |
| 1 | `s2` Read the intake decision | triage | 10 | yes | PASS (10/10 pts) | PASS (10/10 pts) |
| 1 | `s3` Build the module repo | repo | 12 | yes | PASS (12/12 pts) | PASS (12/12 pts) |
| 1 | `d1x` Unit 1 check: reply to Design, then stage the repo | journal | — | — | PASS | PASS |
| 2 | `d2i` Unit 2 · Planning the module | journal | — | — | PASS | PASS |
| 2 | `sob` Review the draft objectives | review | 15 | yes | PASS (15/15 pts) | PASS (15/15 pts) |
| 2 | `modref` What goes in a module | none | — | — | PASS | PASS |
| 2 | `arh` Plan the assessment rhythm | sort | 12 | — | PASS (12/12 pts) | PASS (12/12 pts) |
| 2 | `mcomp` Compose the module | triage | 12 | — | PASS (12/12 pts) | PASS (12/12 pts) |
| 2 | `s4` Plan a lesson package | day | 15 | yes | PASS (15/15 pts) | PASS (15/15 pts) |
| 2 | `sws` Design the workplace around the lessons | review | 15 | yes | PASS (15/15 pts) | PASS (15/15 pts) |
| 2 | `d2x` Unit 2 check: write the objective and its assessment | journal | — | — | PASS | PASS |
| 3 | `d3i` Unit 3 · Building content | journal | — | — | PASS | PASS |
| 3 | `slb` Build the lab steps | fix | 15 | yes | PASS (15/15 pts) | PASS (15/15 pts) |
| 3 | `s5b` Write a KBA item | journal | — | — | PASS | PASS |
| 3 | `s5` Run the KBA review queue | review | 15 | yes | PASS (15/15 pts) | PASS (15/15 pts) |
| 3 | `sbab` Build the SBA | journal | — | — | PASS | PASS |
| 3 | `s7` Test whether your rubric holds | rubric | 15 | yes | PASS (15/15 pts) | PASS (15/15 pts) |
| 3 | `sax` Run the accessibility audit | review | 15 | yes | PASS (15/15 pts) | PASS (15/15 pts) |
| 3 | `aico` Work with AI, do not hand it the work | story | 12 | — | PASS (12/12 pts) | PASS (12/12 pts) |
| 3 | `s6` Red-pen the AI draft | fix | 15 | yes | PASS (15/15 pts) | PASS (15/15 pts) |
| 3 | `sai` Use AI without outsourcing responsibility | review | 12 | yes | PASS (12/12 pts) | PASS (12/12 pts) |
| 3 | `d3x` Unit 3 check: write a lab step that survives a room | journal | — | — | PASS | PASS |
| 4 | `d4i` Unit 4 · Clearing the gates | review | 8 | — | PASS (8/8 pts) | PASS (8/8 pts) |
| 4 | `msy` When the build changes under you | story | 18 | — | PASS (18/18 pts) | PASS (18/18 pts) |
| 4 | `mbp` Assemble the blueprint | review | 14 | — | PASS (14/14 pts) | PASS (14/14 pts) |
| 4 | `fgq` Complete the facilitator guide | review | 15 | yes | PASS (15/15 pts) | PASS (15/15 pts) |
| 4 | `qagate` Answer the QA findings | review | 14 | — | PASS (14/14 pts) | PASS (14/14 pts) |
| 4 | `schg` Route the change evidence | review | 12 | yes | PASS (12/12 pts) | PASS (12/12 pts) |
| 4 | `drev` Decide what the next revision inherits | review | 12 | — | PASS (12/12 pts) | PASS (12/12 pts) |
| 4 | `d4x` Unit 4 check: write the plan you will hand your manager | journal | — | — | PASS | PASS |
| 4 | `cap` Plan your first real module | capstone | — | — | PASS | PASS |
