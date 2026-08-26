/* The capstone is take-home work, so it should not be folded into Unit 4's minutes.
   It gets its own card with its own estimate. */
const fs = require("fs");
let b = fs.readFileSync("build.js", "utf8");

const oldMins = `const minsFor = (day) =>
  ALL.filter((g) => String(g.day) === String(day)).reduce(
    (s, g) => s + g.lessons.reduce((t, l) => t + (l.mins || 0), 0),
    0,
  );`;
const newMins = `const isCapstone = (g) => /Capstone/i.test(g.mod || "");
const minsFor = (day) =>
  ALL.filter((g) => String(g.day) === String(day) && !isCapstone(g)).reduce(
    (s, g) => s + g.lessons.reduce((t, l) => t + (l.mins || 0), 0),
    0,
  );`;
if (!b.includes(oldMins)) throw new Error("minsFor block not found");
b = b.replace(oldMins, newMins);

const card = [
  "",
  'const capstoneCard = `  <a href="unit4.html" style="display:block;text-decoration:none;background:#ffffff;border:1px solid #e2dccf;border-left:5px solid #15755a;border-radius:10px;padding:16px 20px;margin-bottom:12px;">',
  '    <div style="display:flex;justify-content:space-between;flex-wrap:wrap;align-items:baseline;gap:8px;">',
  '      <div style="font-weight:bold;font-size:16px;color:#12283f;">Capstone: Module Development Package</div>',
  "      <div style=\"font-family:'IBM Plex Mono',ui-monospace,monospace;font-size:11px;color:#59697a;\">~8 hours</div>",
  "    </div>",
  '    <p style="font-size:14px;color:#42566a;margin:8px 0 10px;">Take a module objective, plan how it gets met, and build one lesson of it for real: eight items filed in a repo you name yourself. Your manager reviews it against the standards you have been working to. Nothing is graded. Set aside a working day, and do not attempt it in one sitting.</p>',
  '    <div style="font-size:13.5px;font-weight:bold;color:#004878;">Open the capstone &rarr;</div>',
  "  </a>`;",
  "",
].join("\n");

const anchor = 'let idx = fs.readFileSync("index.html", "utf8");';
if (!b.includes(anchor)) throw new Error("index read anchor not found");
b = b.replace(anchor, card + anchor);

const joinLine = b.match(/\}\)\.join\("\\n\\n"\);/);
if (!joinLine) throw new Error("cards join not found");
b = b.replace(joinLine[0], '}).join("\\n\\n");');

const useAnchor = '" + START.length) + "\\n" + cards';
if (b.includes(useAnchor))
  b = b.replace(
    useAnchor,
    '" + START.length) + "\\n" + cards + "\\n\\n" + capstoneCard',
  );
else {
  const alt = '+ "\\n" +\n    cards +';
  if (!b.includes(alt)) throw new Error("cards insertion point not found");
  b = b.replace(alt, '+ "\\n" +\n    cards + "\\n\\n" + capstoneCard +');
}

fs.writeFileSync("build.js", b);
console.log(
  "build.js: capstone excluded from unit minutes and given its own card",
);
