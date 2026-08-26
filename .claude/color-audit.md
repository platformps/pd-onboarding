# Visual / colour audit — PD Onboarding

Scope: `course.css`, `course.js`, `engine.js`, `guide.js`, `index.html`.
Method: static extraction of every hex literal (785 occurrences, 148 distinct values), plus a
Playwright sweep that rendered all **36 lessons across unit1–unit4** and all 22 Handbook sections,
reading real computed `color` / `fill` against real composited backgrounds. Contrast ratios are
WCAG 2.1 relative-luminance, computed — not estimated. SVG font sizes are the _rendered_ px after
viewBox scaling.

**Headline:** the user's "wrong/inconsistent font colours" is two separate problems.
There are **three places where lesson-critical text renders invisible** (ratios 1.00–1.01:1), and
there is a **systemic tokenisation failure** — one semantic role ("secondary diagram label") is
drawn in six different greys, three of which fail AA. Separately, `--faint` is a token that
_cannot_ pass AA at any size it is used, and it is used 151 times.

This matters beyond aesthetics: Unit 3 lessons `s6`/`sax` teach WCAG 2.1 AA and audit contrast.
The course fails its own gate, and the ratios it quotes to learners are wrong.


> **Line-number caveat.** Another process was editing `course.js`, `guide.js`, and `index.html`
> concurrently while this audit ran, so line numbers drift. Every citation below was re-verified
> against the working tree at the end of the audit, but if one does not match, grep for the hex
> value itself — all colour values and occurrence counts were confirmed unchanged by the concurrent
> edits (they were prose/content changes only).

---

## (A) Findings — worst first

### P0 — Text that is invisible or unreadable

**1. `course.js:513` — the intake package list is invisible. 1.01:1**

    <p class="tight" style="background:#f3f0ea;border-left:3px solid var(--blue);...">

This `<p>` sits inside `<div class="box rule">`, which sets `color:#e8f0f9` (near-white, for the
navy box). The inline `background:#f3f0ea` overrides the navy but **nothing overrides the text
colour**, so #e8f0f9 lands on #f3f0ea = **1.01:1**. Screenshot-confirmed: the four lines listing what
Design handed over ("Build specifications, present. / Client notes, present… / Target job
description… / Classroom technology inventory…") render as a blank cream box.
This is Unit 1 lesson `d1x` — the artefact the whole lesson asks the learner to judge.

**2. `course.js:805` — the module objective is invisible. 1.01:1**

Same defect, same construction. Unit 2 lesson `d2x`. The quoted module objective Design "handed
you" — the exact string the learner is asked to decompose and write against — renders as a blank
cream bar. Both track variants (itsupport and software) are affected.

**3. `course.js:1110` — the `[VERIFY]` tag is invisible. 1.00:1**

`<span class="mono">[VERIFY]</span>` inside `<div class="box rule">`. `.mono` (course.css:36) sets
`background:#eeeef6` but no `color`, so it inherits #e8f0f9 from `.box.rule` → **1.00:1**, an exact
tie. The sentence reads "…or tag it ␣␣␣␣␣ and confirm it before release" with the tag name blank.
Unit 3 lesson `s6`. This is the only `.mono` inside a `.box.rule` in the codebase, so it is a
one-line fix, but the class combination is a latent trap.

**4. `course.js:513`, `course.js:805` — `var(--blue)` is not a defined token.**

`--blue` is referenced twice and defined nowhere (`:root` defines `--indigo`, not `--blue`).
The declaration becomes invalid-at-computed-value-time, so `border-left-color` falls back to
`currentColor` — which is the same invisible #e8f0f9. The accent rule on both boxes is also
invisible. Every `var(--x)` reference in the project was checked against the defined set; this is
the only undefined one.

### P1 — A token that cannot pass AA

**5. `course.css:5` — `--faint:#8fa0ae` fails AA everywhere it is used. 2.25–2.69:1. 151 rendered instances.**

| background                  | ratio      | verdict          |
| --------------------------- | ---------- | ---------------- |
| `--card` #ffffff            | **2.69:1** | fail (needs 4.5) |
| `--paper` #faf7f2           | **2.52:1** | fail             |
| `--indigo-bg` #e3edf8       | **2.27:1** | fail             |
| day-3 `--indigo-bg` #e7eaf9 | **2.25:1** | fail             |
| `--line2` #f3eee6           | **2.33:1** | fail             |

`--faint` is only ever used on small text (9.5–12.5px), so the 3:1 large-text allowance never
applies. 17 rules consume it — `course.css:63,69,85,102,122,125,129,138,154,247,263,271,337,341,345,361,369`:
`.pnode`, `.sc-tag`, `.mail .mtag`, `.goals h4`, `.tree h4`, `.palette h4`, `.sched h4`,
`.pal-item small`, `.slot small`, `.req`, `.fix-count`, `.brief .bh2`, `.sbucket h5`, `.terms .th`,
`.mod-title`, `.lnav a.locked`, `.x-btn`, `.gd-nav .gi`, `.g-table th`.

Highest-volume victims measured: `.g-table th` x72 (10px, every Handbook table header),
`.gd-nav .gi` x36 (12.5px), `.mail .mtag` x17 (9.5px), `.brief .bh2` x11 (9.5px).
Every eyebrow label, every scenario-ticket header, and every Handbook table header in the course
currently fails AA.

**6. `course.css:5,7` — `--gold:#7d8ea1` fails AA as body text. 3.14–3.36:1. 55 instances.**

- `.locknote` (course.css:186, 12px) on `--paper` → **3.14:1** — 35 instances. This is the
  "Complete the activity to continue." line, i.e. the one message a stuck learner needs to read.
- `.g-links em` (course.css:378, 11.5px) on white → **3.36:1** — 20 instances.
- `.pal-item.pas small` (course.css:126, 10px) → same range.

**7. `course.css:318` — `.portfolio-badge` white on #3f88c5. 3.79:1.**

9px uppercase white on a mid-blue chip. Fails AA (needs 4.5). #3f88c5 matches no token.

**8. `course.js` SVG labels below AA** (rendered sizes 10.3–11.9px, so 4.5:1 applies):

| colour    | on      | ratio      | lines                            |
| --------- | ------- | ---------- | -------------------------------- |
| `#8a97a4` | #f3f0ea | **2.62:1** | 221, 223                         |
| `#8fa0ae` | #f3eee6 | **2.33:1** | rendered in unit1/unit4 diagrams |
| `#8fa0ae` | #ffffff | **2.69:1** | 3 instances, unit2               |
| `#7a8a99` | #f3f0ea | **3.12:1** | 426, 458, 1052, 1054             |
| `#7a8a99` | #ffffff | **3.55:1** | 400, 1185, 1211, 1444–1460       |
| `#4a7fb5` | #e3edf8 | **3.55:1** | 222                              |
| `#3f88c5` | #ffffff | **3.79:1** | 136, 336, 496, 547, 1288         |
| `#8a6a00` | #f3f0ea | **4.46:1** | 234, 237 (marginal miss)         |

Screenshot-confirmed example: unit2 `s4`, the activated-learning bar — `passive ≤ 25%` renders in
#8fa0ae on #f3eee6 (2.33:1) and is barely legible next to the fully legible white-on-blue segment.

**9. `engine.js:256` — `.ct-h` #9a6a00 on #fff7e8. 4.45:1.**

Marginal miss on the "→ Your final step, in Canvas" heading and the capstone link beside it (10px).

**10. `index.html:95,104,113,122` — `~90 min` duration chips, #8a97a4 on white. 2.98:1.**

11px mono on the four unit cards. Fails AA.

**11. `course.css:118,155` — `--ok` #1f9d76 used as text on `--paper`. 3.20:1.**

`.mk-msg.okc` / `.fix-msg.okc`, e.g. "✓ Primary project set: IT Support…" at 12.5px.
`--ok` is fine as a fill or border but fails as text.

### P2 — The course states contrast ratios that are wrong

`course.js:997` (Unit 3, lesson `sax`) is the WCAG teaching activity. The three swatches are
_deliberately_ failing examples — correctly so — but the `data-info` values shown to the learner
do not match the swatches:

| swatch             | course claims | actual      | error    |
| ------------------ | ------------- | ----------- | -------- |
| #ffffff on #12283f | 15.6:1        | **14.99:1** | −0.6     |
| #8a8a8a on #d4d4d4 | 1.9:1         | **2.33:1**  | **+23%** |
| #e6d9b8 on #f7efdc | 1.3:1         | **1.22:1**  | −6%      |

The verdicts (pass / FAILS / FAILS) are all correct; only the numbers are wrong. In a lesson whose
whole point is "verify, never assume," quoting unverified ratios is the credibility problem.
The swatch colours themselves — #d4d4d4, #8a8a8a, #f7efdc, #e6d9b8 — are intentional and should
**not** be tokenised or "fixed."

### P3 — Near-duplicate colours (same intent, two values)

| value                  | token / sibling      | Δ (sum RGB) | where                                                                            |
| ---------------------- | -------------------- | ----------- | -------------------------------------------------------------------------------- |
| `#5a6b7b`              | `--muted` `#5b6b7a`  | **2**       | course.js:180,218,220,1462 · engine.js:115 · index.html:33,50,89,139,151         |
| `#f3f0ea`              | `--line2` `#f3eee6`  | 6           | course.js x14 (178,215,217,426,458,513,806,842,895,976,1052,1461) · engine.js x1 |
| `#fdecea`              | `--bad-bg` `#fbe9e9` | 6           | course.js x1 · engine.js:732                                                     |
| `#9a6a00` vs `#8a6a00` | each other           | 16          | engine.js:256 vs course.js:234,237,1452,1453                                     |
| `#7a8a99`              | `--gold` `#7d8ea1`   | 15          | course.js x13                                                                    |
| `#e2dccf`              | `--line` `#e8e1d6`   | 18          | index.html x11                                                                   |
| `#8a97a4`              | `--faint` `#8fa0ae`  | 24          | course.js:221,223 · index.html:95,104,113,122                                    |
| `#0c4878` vs `#004878` | each other           | 25          | index.html:36,37,119 vs 7 other lines                                            |
| `#e0d8c8`              | `--line` `#e8e1d6`   | 31          | course.js:233,236,241                                                            |
| `#c0392b`              | `--bad` `#cf4747`    | 57          | course.js x1 · engine.js:732                                                     |

`#5a6b7b` vs `#5b6b7a` is a digit transposition — indistinguishable on screen, and it means a
global search for the muted token misses ten call sites.

### P4 — One semantic role, six colours

Every `<text>` fill in `course.js` (283 total), grouped by intent:

**Primary diagram label (dark):** `#1c2b3a` x94 (= `--text`), `#12283f` x1 (= `--ink`) — 2 values.

**Secondary / supporting diagram label (grey): 6 values, no token:**
`#42566a` x72 · `#5b6b7a` x20 (`--muted`) · `#7a8a99` x12 · `#8fa0ae` x6 (`--faint`) ·
`#5a6b7b` x4 · `#8a97a4` x2

**Accent / emphasis (blue):** `#164a85` x60 (`--indigo-d`), `#3f88c5` x4, `#4a7fb5` x1 — 3 values.

`#42566a` is the single most-used untokened colour in the project — **90 occurrences**
(72 in `course.js` SVG fills, 18 in `index.html` as body text). It is not `--ink2` (#2a4763),
not `--muted` (#5b6b7a), and not `--text`. It passes AA comfortably (7.58:1 on white), so this
is a naming defect, not a contrast one — but it means the de-facto secondary text colour of the
course exists only as a repeated literal.

The same drift exists in `course.css` itself: `--faint`, `--gold`, `#7a8a99`, and `#8a97a4` are all
used for "small uppercase mono eyebrow label," in four different values.

### P5 — `index.html` is a different design system

`index.html` shares almost nothing with `course.css`. Its palette:

`#004878`, `#0c4878`, `#0078c0`, `#009cd8`, `#fcc048`, `#78c0cc`, `#42566a`, `#5a6b7b`,
`#8a97a4`, `#e2dccf`, `#eaf4fa`, `#b9dcec`, `#cfe6f2`, `#3c4d5e`

Of these, **only three** (`#12283f`, `#1c2b3a`, `#faf7f2`) are course tokens. The rest are the
Per Scholas brand blues/gold, which appear **nowhere** in `course.css`. Meanwhile `course.css:334`
carries the comment `/* ---- Per Scholas skin — paste official brand hexes into :root above ---- */`
— i.e. the brand palette was applied to the landing page and the course skin was never updated.
The landing page and the units it links to are visibly different products.

It also uses `font-family:Arial,Helvetica,sans-serif` while the units use Atkinson Hyperlegible /
Bricolage Grotesque / IBM Plex Mono, and `'Courier New'` where the units use IBM Plex Mono.

Contrast-wise `index.html` is mostly sound — `#78c0cc` on `#004878` is 4.64:1, `#0078c0` on white
is 4.72:1, `#42566a` on white is 7.58:1, `#cfe6f2` on `#004878` is 7.39:1, all pass. `#009cd8` is
border-only, never text. The only failure is finding 10 (`#8a97a4`, 2.98:1).

### Verified NOT defects

Checked and passing — do not "fix" these:

- All dark-box text: `#e8f0f9` / `#e9eaf8` / `#cfe0ee` on `--ink` (11.1–13.0:1), `#8fc1f7` on
  `--ink` (7.95:1), `#9fc0da` on `#1a344d` (6.71:1), `#7fa3c4` save-dot on topbar (5.67:1),
  `#dbe8f3` on `#1d3a56` (9.40:1), `#7fe0c0` on `--ink` (9.51:1).
- Feedback text: `#186b52` on `--ok-bg` (5.69:1), `#9a2f2f` on `--bad-bg` (6.36:1),
  `#35577d` on `--gold-bg` (6.40:1), `#7a2018` on `#fdecea` (8.97:1).
- All four per-day accents as link text and as button backgrounds: day1 `#1d5fa8` 6.45:1,
  day2 `#0f7490` 5.36:1, day3 `#4054b2` 6.71:1, day4 `#35618c` 6.48:1; each on its own
  `--indigo-bg` variant: 5.45 / 4.61 / 5.60 / 5.49:1.
- `.terms dt` `--indigo-d` on white 8.93:1; `.meta` `--ink2` on `#eef4fb` 8.70:1.
- The Unit 3 failing-contrast demo swatches (intentional teaching examples).
- White on blue in the unit2 activated-learning bar (a static-analysis false positive; the
  rendered fill is `--indigo`, confirmed by screenshot).

---

## (B) Remediation plan

### Step 1 — Fix the invisible text (do this first; it is content loss, not styling)

| file:line        | change                                                                                                                                                                   |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `course.js:513`  | add `color:var(--text)` to the inline style; replace `var(--blue)` with `var(--indigo)`; replace `#f3f0ea` with `var(--line2)`. Result: #1c2b3a on #f3eee6 = **12.9:1**. |
| `course.js:805`  | identical change.                                                                                                                                                        |
| `course.js:1110` | give the tag an explicit colour. Prefer the structural fix below.                                                                                                        |

Structural fix so this cannot recur — add to `course.css` next to the `.box.rule` rule (line 51):

    .box.rule .mono{color:var(--ink)}

Better still, stop overriding `.box.rule`'s background inline. Introduce a proper class:

    .box.rule .quoted{background:var(--line2);color:var(--text);
      border-left:3px solid var(--indigo);border-radius:6px;
      padding:9px 12px;margin:8px 0}

and use `<p class="tight quoted">` at `course.js:513` and `:805`. That removes the inline styles,
the undefined `--blue`, and the inherited-colour trap in one move.

Add a guard to `check.js`: fail the build on any `var(--x)` whose `--x` is not defined in
`course.css`'s `:root`. That alone would have caught `--blue`.

### Step 2 — Retune the failing tokens

The greys need to move down one step. Because `--faint` darkened to AA lands almost exactly on
today's `--muted`, keep the two-tier hierarchy by shifting both:

| token     | current   | → proposed    | worst-case ratio now → after                               |
| --------- | --------- | ------------- | ---------------------------------------------------------- |
| `--faint` | `#8fa0ae` | **`#59697a`** | 2.25 → **4.71:1** (white 5.64, paper 5.27, indigo-bg 4.76) |
| `--muted` | `#5b6b7a` | **`#455567`** | 4.58 → **6.38:1** (white 7.64, paper 7.15)                 |
| `--gold`  | `#7d8ea1` | **`#5b6d82`** | 3.14 → **4.97:1** on paper, 5.31:1 on white                |

`--gold` is only ever a text colour (`.locknote`, `.g-links em`, `.pal-item.pas small`) plus the
non-text `--gold-bg` pair, so darkening it has no fill side-effects. `--gold-bg` (#e9eef4) stays.

Leave `--ok`, `--bad`, `--indigo*`, `--ink*`, `--text`, `--paper`, `--card`, `--line*` unchanged —
all measured pass.

Add an `--ok-d` for the one place `--ok` is used as text:

    --ok-d:#17755a;   /* 5.27:1 on --paper, 5.63:1 on --card, 4.98:1 on --ok-bg */

and switch `.mk-msg.okc` (`course.css:118`) and `.fix-msg.okc` (`course.css:155`) to `var(--ok-d)`.
`--ok` stays as-is for fills, borders, and `.req.met`.

### Step 3 — Fix the remaining contrast misses

| file:line                                             | current               | →                             | after                          |
| ----------------------------------------------------- | --------------------- | ----------------------------- | ------------------------------ |
| `course.css:318` `.portfolio-badge`                   | `background:#3f88c5`  | `background:var(--indigo)`    | white on #1d5fa8 = **6.45:1**  |
| `course.js:136,336,496,547,1288`                      | `fill="#3f88c5"`      | `fill="var(--indigo)"`        | **6.45:1**                     |
| `course.js:222`                                       | `fill="#4a7fb5"`      | `fill="var(--indigo)"`        | **5.45:1** on indigo-bg        |
| `course.js:400,426,458,1052,1054,1185,1211,1444–1460` | `#7a8a99`             | `var(--muted)` (new #455567)  | **≥6.5:1**                     |
| `course.js:221,223` · `index.html:95,104,113,122`     | `#8a97a4`             | `var(--muted)` / `#455567`    | **7.64:1**                     |
| `course.js:234,237,1452,1453` · `engine.js:256`       | `#8a6a00` / `#9a6a00` | new token `--amber-d:#7d5f00` | **5.26–5.98:1**                |
| `course.js:1451`                                      | `stroke="#c9a227"`    | `var(--amber-d)`              | non-text, but unifies the pair |

`#3f88c5` at `course.js:310,312` is a `stroke` on a rect, not text — safe either way, but switching
it too keeps the diagram accent single-valued.

### Step 4 — Tokenise the secondary label colour

Add one token and stop the six-way drift:

    --label:#42566a;   /* secondary diagram label / card body
                          7.58:1 on white, 6.66:1 on --line2 */

Then replace all 72 `fill="#42566a"` in `course.js` and all 18 `color:#42566a` in `index.html`
with `var(--label)`. No visual change; it just makes the role addressable.

After steps 3–4 the secondary-label role collapses from **six values to two** (`--label` for
supporting text, `--muted` for de-emphasised text), and every one passes AA.

### Step 5 — Kill the near-duplicates

Pure find-and-replace, zero visual change:

| replace   | with                       | sites                                                                    |
| --------- | -------------------------- | ------------------------------------------------------------------------ |
| `#5a6b7b` | `var(--muted)` / `#5b6b7a` | course.js:180,218,220,1462 · engine.js:115 · index.html:33,50,89,139,151 |
| `#f3f0ea` | `var(--line2)` (#f3eee6)   | course.js x14 · engine.js x1                                             |
| `#fdecea` | `var(--bad-bg)`            | course.js x1 · engine.js:732                                             |
| `#e0d8c8` | `var(--line)`              | course.js:233,236,241                                                    |
| `#c0392b` | `var(--bad)`               | course.js x1 · engine.js:732                                             |
| `#e2dccf` | `#e8e1d6` (`--line`)       | index.html x11                                                           |
| `#0c4878` | `#004878`                  | index.html:36,37,119                                                     |

SVG attributes accept `fill="var(--x)"` in every current browser, and the codebase already relies
on `var()` inside inline styles, so this is safe. If you would rather avoid `var()` in SVG
attributes, drop the `fill` attribute and set it via a CSS class on the `<svg>` instead.

### Step 6 — Correct the ratios the course quotes

`course.js:997`, `data-info` strings:

- `"15.6:1, far above the bar."` → **`"15.0:1, far above the bar."`**
- `"1.9:1, FAILS."` → **`"2.3:1, FAILS."`**
- `"1.3:1, FAILS."` → **`"1.2:1, FAILS."`**

Leave the swatch colours and the pass/fail verdicts alone — they are correct and intentional.

### Step 7 — Reconcile `index.html` with the course palette

The largest-surface, lowest-urgency item, and a decision rather than a bug fix. Two options:

**Option A (recommended) — adopt the brand palette into `:root`.** The landing page already
carries the real Per Scholas blues. Promote them to tokens and let the units inherit:

    --brand-navy:#004878; --brand-blue:#0078c0; --brand-cyan:#009cd8;
    --brand-gold:#fcc048;  --brand-teal:#78c0cc;

Then decide whether `--indigo` (#1d5fa8) becomes `--brand-blue` (#0078c0). Both pass AA on white
(6.45 vs 4.72:1), so it is an aesthetic call — but #0078c0 at 4.72:1 leaves almost no headroom, so
if you switch, use `#0078c0` for fills and a darker `#00639f` (6.0:1) for small text.
`course.css:334`'s own comment asks for exactly this.

**Option B — restyle `index.html` to the existing course tokens.** Cheaper, but throws away the
brand colours that are presumably the correct ones.

Either way, also align the landing page's typography: it uses `Arial,Helvetica,sans-serif` and
`'Courier New'` where the units use Atkinson Hyperlegible and IBM Plex Mono. The font stacks should
match, or the transition from index → unit1 reads as leaving the product.

### Step 8 — Add a regression gate

The sweep used for this audit is reusable. Add it to `check.js` or CI: render every lesson, walk
every text node and `<svg text>`, compute contrast against the composited background, and fail on
anything below 4.5:1 (3:1 for ≥18.66px bold / ≥24px), with an explicit allowlist for the three
intentional demo swatches at `course.js:997`. A course that teaches WCAG 2.1 AA should enforce it
on itself.

---

## Priority summary

1. **Step 1** — three lessons currently withhold their own source material. Ship today.
2. **Step 2** — one token change fixes 151 AA failures, another fixes 55 more.
3. **Steps 3, 6** — remaining AA misses, and the wrong ratios quoted to learners.
4. **Steps 4, 5** — tokenisation; no visual change, prevents recurrence.
5. **Step 7** — palette reconciliation; a design decision to schedule.
6. **Step 8** — the gate that keeps all of it fixed.
