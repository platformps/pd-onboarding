/* The capstone is take-home work and should not be folded into Unit 4's minutes.
   It gets its own card with its own estimate. */
const fs = require("fs");
const lines = fs.readFileSync("build.js", "utf8").split("\n");

// 1. exclude the capstone group from unit minutes
const mi = lines.findIndex((l) => l.includes("const minsFor = (day) =>"));
if (mi < 0) throw new Error("minsFor not found");
lines.splice(mi, 0, 'const isCapstone = (g) => /Capstone/i.test(g.mod || "");');
const fi = lines.findIndex(
  (l, i) => i > mi && l.includes("String(g.day) === String(day)"),
);
if (fi < 0) throw new Error("filter line not found");
lines[fi] = lines[fi].replace(
  "String(g.day) === String(day)",
  "String(g.day) === String(day) && !isCapstone(g)",
);

// 2. define the capstone card just before index.html is read
const ri = lines.findIndex((l) => l.includes('fs.readFileSync("index.html"'));
if (ri < 0) throw new Error("index read not found");
const card = [
  "const MONO = \"font-family:'IBM Plex Mono',ui-monospace,monospace\";",
  "const capstoneCard =",
  '  `  <a href="unit4.html" style="display:block;text-decoration:none;background:#ffffff;border:1px solid #e2dccf;border-left:5px solid #15755a;border-radius:10px;padding:16px 20px;margin-bottom:12px;">',
  '    <div style="display:flex;justify-content:space-between;flex-wrap:wrap;align-items:baseline;gap:8px;">',
  '      <div style="font-weight:bold;font-size:16px;color:#12283f;">Capstone: Module Development Package</div>',
  '      <div style="${MONO};font-size:11px;color:#59697a;">~8 hours</div>',
  "    </div>",
  '    <p style="font-size:14px;color:#42566a;margin:8px 0 10px;">Take a module objective, plan how it gets met, and build one lesson of it for real: eight items filed in a repo you name yourself. Your manager reviews it against the standards you have been working to. Nothing is graded, and it is not done in one sitting.</p>',
  '    <div style="font-size:13.5px;font-weight:bold;color:#004878;">Open the capstone &rarr;</div>',
  "  </a>`;",
  "",
];
lines.splice(ri, 0, ...card);

// 3. append it after the unit cards
const ci = lines.findIndex((l) => l.trim() === "cards +");
if (ci < 0) throw new Error("cards concat not found");
lines.splice(ci + 1, 0, '    "\\n\\n" +', "    capstoneCard +");

fs.writeFileSync("build.js", lines.join("\n"));
console.log(
  "build.js: capstone split out of unit minutes and given its own card",
);
