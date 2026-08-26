/* Adds deterministic self-check to journal answers.

   This does not grade meaning. Each field declares `checks`, and each check tests
   one signal the lesson already teaches: a measurable verb is present, an
   unmeasurable one is not, a file name follows the convention, the answer is long
   enough to be specific. The learner sees which criteria their own words met,
   next to the model answer. Nothing is scored; the feedback is the point. */
const fs = require("fs");
let e = fs.readFileSync("engine.js", "utf8");

const helper = `
/* ---------- journal self-check ----------
   A check is {want|avoid|minWords, ok, no}. want/avoid are "|"-separated words
   matched on word boundaries, case-insensitively. */
function runChecks(field, value){
  if(!field.checks || !field.checks.length) return null;
  const v = String(value||"");
  const words = v.trim().split(/\\s+/).filter(Boolean).length;
  const hasAny = list => list.split("|").some(w => {
    const t = w.trim(); if(!t) return false;
    return new RegExp("(^|[^a-z])" + t.replace(/[.*+?^\${}()|[\\]\\\\]/g,"\\\\$&") + "([^a-z]|$)","i").test(v);
  });
  return field.checks.map(c => {
    let pass;
    if(c.minWords !== undefined) pass = words >= c.minWords;
    else if(c.want) pass = hasAny(c.want);
    else if(c.avoid) pass = !hasAny(c.avoid);
    else pass = true;
    return {pass, text: pass ? c.ok : c.no};
  });
}

function checksHtml(a, host){
  const rows = [];
  a.fields.forEach((f,i) => {
    const el = host.querySelector('[data-j="'+i+'"]');
    const res = runChecks(f, el ? el.value : "");
    if(!res) return;
    rows.push('<div class="sc-f">'+(f.short || ("Box "+(i+1)))+'</div>');
    res.forEach(r => rows.push(
      '<div class="sc-r '+(r.pass?"ok":"no")+'"><span class="sc-i">'+(r.pass?"\\u2713":"\\u25cb")+'</span><span>'+r.text+'</span></div>'));
  });
  if(!rows.length) return "";
  return '<div class="selfcheck"><div class="sc-h">Your answer against the standard</div>'+rows.join("")+
         '<p class="sc-n">These check the rule, not the wording. A circle is a prompt to look again, not a mark.</p></div>';
}
`;

const anchor = "function coachBar(l){";
if (!e.includes(anchor)) throw new Error("coachBar anchor not found");
e = e.replace(anchor, helper + "\n" + anchor);

// render the self-check above the model answer, on save
const saveLine = `      if(a.model){document.getElementById("jm-"+A).innerHTML=`;
if (!e.includes(saveLine)) throw new Error("journal save line not found");
e = e.replace(
  saveLine,
  `      const _sc = checksHtml(a, jhost);\n` +
    `      if(a.model||_sc){document.getElementById("jm-"+A).innerHTML= _sc + (!a.model ? "" : `,
);

// close the added parenthesis at the end of that statement
e = e.replace(
  '</span>${typeof a.model==="function"?a.model():a.model}</div>`;}\n    };',
  '</span>${typeof a.model==="function"?a.model():a.model}</div>`);}\n    };',
);

fs.writeFileSync("engine.js", e);
console.log("engine: journal self-check wired");
