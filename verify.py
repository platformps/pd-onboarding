#!/usr/bin/env python3
"""verify.py - renders the course and checks what static analysis cannot see.

check.js validates the data. This validates the pages a learner actually gets:
every lesson on both tracks, template placeholders that leak as literal text,
function sources printed instead of their output, stray "undefined", and
WCAG 2.1 AA contrast. The course teaches AA, so it cannot fail it.

    python verify.py                 # all checks
    python verify.py --contrast      # contrast only

Needs a local server on port 8899 and Playwright:
    python -m http.server 8899
    pip install playwright && python -m playwright install chromium
"""
import sys
from playwright.sync_api import sync_playwright

BASE = "http://localhost:8899"
UNITS = ["1", "2", "3", "4"]
TRACKS = ["itsupport", "software"]

# The accessibility lesson demonstrates failing contrast on purpose.
CONTRAST_EXEMPT = {"Gray on gray", "Cream on cream"}


def _lum(c):
    def f(v):
        v = v / 255
        return v / 12.92 if v <= 0.03928 else ((v + 0.055) / 1.055) ** 2.4
    return 0.2126 * f(c[0]) + 0.7152 * f(c[1]) + 0.0722 * f(c[2])


def _ratio(a, b):
    la, lb = _lum(a), _lum(b)
    hi, lo = max(la, lb), min(la, lb)
    return (hi + 0.05) / (lo + 0.05)


def _rgb(s):
    return [int(x) for x in s.replace("rgba(", "").replace("rgb(", "").replace(")", "").split(",")[:3]]


COLLECT = """() => {
  const eff = el => { let n = el;
    while (n) { const bg = getComputedStyle(n).backgroundColor;
      if (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') return bg;
      n = n.parentElement; }
    return 'rgb(250,247,242)'; };
  const out = [];
  document.querySelectorAll('#content *').forEach(el => {
    const t = (el.textContent || '').trim();
    if (!t || el.children.length) return;
    const s = getComputedStyle(el);
    out.push({ text: t, color: s.color, bg: eff(el),
               size: parseFloat(s.fontSize), weight: s.fontWeight });
  });
  return out;
}"""


def main():
    only_contrast = "--contrast" in sys.argv
    leaks, contrast, errors, walked = [], [], [], 0

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        for track in TRACKS:
            for unit in UNITS:
                ctx = browser.new_context(viewport={"width": 1280, "height": 900})
                page = ctx.new_page()
                page.on("pageerror", lambda e, u=unit: errors.append(f"unit{u}: {e}"))
                page.goto(f"{BASE}/unit{unit}.html")
                page.wait_for_load_state("networkidle")
                page.evaluate(f"() => {{ ST.track = '{track}'; }}")
                for lid in page.evaluate("() => FLAT.map(l => l.id)"):
                    page.evaluate(f"() => {{ ST.current = '{lid}'; render(); }}")
                    page.wait_for_timeout(30)
                    walked += 1
                    text = page.locator("#content").inner_text()

                    if not only_contrast:
                        for bad in ("${", "function()", "[object Object]", "undefined"):
                            if bad in text:
                                line = next(l for l in text.split("\n") if bad in l)
                                leaks.append(f"{track}/unit{unit}/{lid}: {line.strip()[:100]}")

                    for node in page.evaluate(COLLECT):
                        if node["text"][:40] in CONTRAST_EXEMPT:
                            continue
                        large = node["size"] >= 24 or (node["size"] >= 18.66 and int(node["weight"]) >= 700)
                        need = 3.0 if large else 4.5
                        got = _ratio(_rgb(node["color"]), _rgb(node["bg"]))
                        if got < need:
                            contrast.append(
                                f"{track}/unit{unit}/{lid}: {got:.2f}:1 (need {need}) "
                                f"{node['color']} on {node['bg']} -- {node['text'][:45]}")
                ctx.close()
        browser.close()

    print(f"walked {walked} lesson renders across {len(TRACKS)} tracks")
    for label, items in (("page errors", errors), ("template/undefined leaks", leaks),
                         ("contrast failures", contrast)):
        if items:
            seen = set()
            print(f"\n{label}:")
            for i in items:
                if i in seen:
                    continue
                seen.add(i)
                print(f"  {i}")
        else:
            print(f"  ok  no {label}")

    return 1 if (errors or leaks or contrast) else 0


if __name__ == "__main__":
    sys.exit(main())
