/* Sort buckets, day-plan palette items and fix-activity sentences were mouse-only.
   `.scard` already had tabindex and Enter handling, but its drop target did not, so a
   keyboard user could select a card and had nowhere to put it. This course teaches
   WCAG 2.1 AA, so it cannot ship a mouse-only interaction. */
const fs = require("fs");
let e = fs.readFileSync("engine.js", "utf8");
let n = 0;

const R = [
  // sort: the bucket becomes a focusable button
  [
    '<div class="sbucket" data-b="${bi}"><h5>${b.label}</h5><div class="sb-slot"></div></div>',
    '<div class="sbucket" data-b="${bi}" tabindex="0" role="button" aria-label="Place the selected card in ${b.label}"><h5>${b.label}</h5><div class="sb-slot"></div></div>',
  ],
  // day plan: palette blocks become focusable
  [
    "<div class=\"pal-item ${p.act?'':'pas'}\" data-i=\"${i}\">",
    '<div class="pal-item ${p.act?\'\':\'pas\'}" data-i="${i}" tabindex="0" role="button">',
  ],
  // fix activity: each candidate sentence becomes focusable
  [
    '<span class="sent" data-i="${i}">${s.t}</span>',
    '<span class="sent" data-i="${i}" tabindex="0" role="button">${s.t}</span>',
  ],
  [
    "<span class=\"sent ${fixedSet.has(i)?'fixed':''} ${active===i?'active':''}\" data-i=\"${i}\">${txt}</span>",
    "<span class=\"sent ${fixedSet.has(i)?'fixed':''} ${active===i?'active':''}\" data-i=\"${i}\"${fixedSet.has(i)?'':' tabindex=\"0\" role=\"button\"'}>${txt}</span>",
  ],
];

for (const [a, b] of R) {
  if (!e.includes(a)) {
    console.log("  MISS: " + a.slice(0, 60));
    continue;
  }
  e = e.split(a).join(b);
  n++;
}

/* One global handler: Enter or Space on any of these fires the element's click.
   Placed at the end so it sees elements rendered by any activity. */
const handler = `
/* Keyboard parity for the drag-and-drop activities. Enter or Space activates any
   focusable activity control, so sort, day-plan and fix are operable without a mouse. */
document.addEventListener("keydown", e => {
  if(e.key !== "Enter" && e.key !== " ") return;
  const t = e.target;
  if(!t || !t.classList) return;
  if(t.classList.contains("sbucket") || t.classList.contains("pal-item") || t.classList.contains("sent")){
    e.preventDefault();
    t.click();
  }
});
`;
if (!e.includes("Keyboard parity for the drag-and-drop activities")) {
  e += handler;
  n++;
}

fs.writeFileSync("engine.js", e);
console.log(`${n}/5 keyboard fixes applied`);
