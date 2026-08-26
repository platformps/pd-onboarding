/* U+1F527 needs a surrogate pair in a JS string literal; ὒ7 is ὒ + "7",
   which renders as a broken glyph. Also swap the lightning bolt for a clearer
   siren, and keep all four route icons in the same visual family. */
const fs = require("fs");
let s = fs.readFileSync("course.js", "utf8");

const before = String.raw`buckets:["⚡ Hotfix","ὒ7 Maintenance","💬 No product change","📋 Planned revision"]`;
const after = String.raw`buckets:["🔥 Hotfix","🔧 Maintenance","💬 No product change","📋 Planned revision"]`;

if (!s.includes(before)) throw new Error("buckets line not found");
s = s.split(before).join(after);
fs.writeFileSync("course.js", s);
console.log("route icons fixed (maintenance was a broken surrogate)");
