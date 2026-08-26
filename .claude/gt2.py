import sys
from playwright.sync_api import sync_playwright
sys.stdout.reconfigure(encoding="utf-8")
CASES=[("3","rubw",["The learner followed the steps appropriately and did an excellent job",
                    "Row two: adequate work"],"weak"),
       ("3","airec",["I used AI a lot for this module","It was fine"],"weak")]
with sync_playwright() as p:
    br=p.chromium.launch(headless=True)
    for day,lid,ans,label in CASES:
        ctx=br.new_context(viewport={"width":1280,"height":900}); pg=ctx.new_page()
        errs=[]; pg.on("pageerror", lambda e: errs.append(str(e)))
        pg.goto(f"http://localhost:8899/unit{day}.html"); pg.wait_for_load_state("networkidle")
        pg.evaluate(f"() => {{ ST.track='itsupport'; ST.current='{lid}'; render(); }}"); pg.wait_for_timeout(350)
        sk=pg.locator("text=Skip: I")
        if sk.count(): sk.first.click(); pg.wait_for_timeout(300)
        tas=pg.locator("#content textarea")
        for i,a in enumerate(ans):
            if i<tas.count(): tas.nth(i).fill(a)
        pg.wait_for_timeout(150)
        b=pg.locator("button:has-text('Save')")
        if b.count(): b.first.click(); pg.wait_for_timeout(600)
        sc=pg.locator(".selfcheck")
        print(f"\n--- {lid} ({label}) ---")
        if not sc.count(): print("  no self-check"); ctx.close(); continue
        for line in sc.inner_text().split("\n"):
            if line.strip(): print("   ", line.strip()[:100])
        print("  errors:", errs)
        ctx.close()
    br.close()
