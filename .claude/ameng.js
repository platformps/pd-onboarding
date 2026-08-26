/* The course is written in American English. Converts the British spellings that
   crept in, preserving capitalization. */
const fs = require("fs");

const PAIRS = [
  ["behaviours", "behaviors"],
  ["behaviour", "behavior"],
  ["judgements", "judgments"],
  ["judgement", "judgment"],
  ["colours", "colors"],
  ["colour", "color"],
  ["centred", "centered"],
  ["licence", "license"],
  ["practising", "practicing"],
  ["practises", "practices"],
  ["practise", "practice"],
  ["recognises", "recognizes"],
  ["recognise", "recognize"],
  ["organisation", "organization"],
  ["organise", "organize"],
  ["realise", "realize"],
  ["summarise", "summarize"],
  ["prioritise", "prioritize"],
  ["analyse", "analyze"],
  ["catalogue", "catalog"],
  ["whilst", "while"],
  ["amongst", "among"],
  ["learnt", "learned"],
  ["defence", "defense"],
  ["favour", "favor"],
  ["labour", "labor"],
];

const cap = (from, to) => to.charAt(0).toUpperCase() + to.slice(1);

for (const file of [
  "course.js",
  "guide.js",
  "index.html",
  "capstone/Capstone-Module-Development-Package.html",
]) {
  if (!fs.existsSync(file)) continue;
  let s = fs.readFileSync(file, "utf8");
  const before = s;
  let n = 0;
  for (const [uk, us] of PAIRS) {
    const lower = new RegExp("\\b" + uk + "\\b", "g");
    const upper = new RegExp(
      "\\b" + uk.charAt(0).toUpperCase() + uk.slice(1) + "\\b",
      "g",
    );
    const a = (s.match(lower) || []).length + (s.match(upper) || []).length;
    if (!a) continue;
    s = s.replace(lower, us).replace(upper, cap(uk, us));
    n += a;
  }
  if (s !== before) {
    fs.writeFileSync(file, s);
    console.log(`${file}: ${n} British spellings converted`);
  }
}
