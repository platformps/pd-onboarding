import sys
from playwright.sync_api import sync_playwright
sys.stdout.reconfigure(encoding="utf-8")

CASES = [
    ("2", "d2x", ["Understand networking fundamentals and know the OSI model",
                  "A quiz at the end of the module"], "weak answer"),
    ("2", "d2x", ["Configure wireless security on a SOHO router to the provided checklist",
                  "R-GLAB 301.2.1, because the learner produces the configuration, which is what the objective names"], "strong answer"),
]
with sync_playwright() as p:
    br = p.chromium.launch(headless=True)
    for day, lid, answers, label in CASES:
        ctx = br.new_context(viewport={"width": 1280, "height": 900}); pg = ctx.new_page()
        errs = []; pg.on("pageerror", lambda e: errs.append(str(e)))
        pg.goto(f"http://localhost:8899/unit{day}.html"); pg.wait_for_load_state("networkidle")
        pg.evaluate(f"() => {{ ST.track='itsupport'; ST.current='{lid}'; render(); }}"); pg.wait_for_timeout(350)
        sk = pg.locator("text=Skip: I")
        if sk.count(): sk.first.click(); pg.wait_for_timeout(300)
        tas = pg.locator("#content textarea")
        for i, a in enumerate(answers):
            if i < tas.count():
                tas.nth(i).fill(a)
        pg.wait_for_timeout(200)
        btn = pg.locator("button:has-text('Save')")
        if btn.count(): btn.first.click(); pg.wait_for_timeout(600)
        sc = pg.locator(".selfcheck")
        print(f"\n--- {lid}: {label} ---")
        if not sc.count():
            print("  NO SELF-CHECK RENDERED"); ctx.close(); continue
        for line in sc.inner_text().split("\n"):
            if line.strip(): print("   ", line.strip()[:105])
        print("  errors:", errs)
        ctx.close()
    br.close()
