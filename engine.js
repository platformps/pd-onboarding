/* engine.js - shared runtime. Reads DAY (set by each unit shell) and ALL (course.js). */

/* ================= ENGINE ================= */
const COURSE=ALL.filter(m=>DAY==="__ALL__"||String(m.day)===DAY);
// Where the capstone assignment lives. In Canvas this is overridden by the course
// page; locally it resolves to the packaged copy.
var CAPSTONE_ASSIGNMENT_URL = (typeof CAPSTONE_ASSIGNMENT_URL !== "undefined" && CAPSTONE_ASSIGNMENT_URL) || "capstone/Capstone-Module-Development-Package.html";
const ALLFLAT=[];ALL.forEach(m=>m.lessons.forEach(l=>ALLFLAT.push(l)));
function globalPrev(id){const i=ALLFLAT.findIndex(x=>x.id===id);return i>0?ALLFLAT[i-1]:null;}
function leadHtml(l){
  // The callback to the previous lesson is deliberately not labelled or boxed:
  // it is the first paragraph of this lesson's prose, so the course reads continuously.
  const b=typeof l.bridge==="function"?l.bridge():l.bridge;
  const lead=typeof l.lead==="function"?l.lead():l.lead;
  const parts=[];
  if(b) parts.push(`<p class="lp">${b}</p>`);
  if(lead) parts.push(`<p class="lp">${lead}</p>`);
  return `<div class="lead">${parts.join("")}</div>`;
}
const FLAT=[];COURSE.forEach(m=>m.lessons.forEach(l=>{l._mod=m.mod;l._day=m.day;FLAT.push(l);}));
const TOTAL=FLAT.reduce((s,l)=>s+((l.activity&&l.activity.points)||0),0);
let ST={current:FLAT[0].id,done:{},earned:{},cap:false,data:{},track:null,mem:{}};

function load(){
  const s=SCORM.getSuspend();if(s)ST=Object.assign(ST,s);
  // The unit files share one storage, so ST.current may point at a lesson that
  // does not exist in this file. Resolve a valid starting lesson for THIS unit.
  try{
    const bm=SCORM.getBookmark(DAY);           // per-unit bookmark
    if(bm && FLAT.some(l=>l.id===bm)){ ST.current=bm; return; }
  }catch(e){}
  if(!FLAT.some(l=>l.id===ST.current)){
    // no valid bookmark: open at the first lesson of this unit that is not finished,
    // which is where the learner actually left off
    const firstUndone=FLAT.find(l=>!ST.done[l.id]);
    ST.current=(firstUndone||FLAT[FLAT.length-1]).id;
  }
}
function persist(){
  SCORM.setSuspend(ST);
  try{ if(ST.current) SCORM.setBookmark(ST.current, DAY); }catch(e){}
  // completion progress (%). How many of THIS unit's activities are done, ignoring correctness
  try{
    const acts=FLAT.filter(l=>l.activity);
    if(acts.length){
      const doneCount=acts.filter(l=>ST.done[l.id]).length;
      SCORM.setScore(Math.round(100*doneCount/acts.length));
    }
  }catch(e){}
  if(FLAT.length&&FLAT.every(x=>ST.done[x.id]))SCORM.markComplete();
  const d=document.getElementById("savedot");d.textContent="saving…";clearTimeout(persist._t);persist._t=setTimeout(()=>d.textContent="saved",500);
  updateRing();
}
function updateRing(){
  const pct=Math.round(FLAT.filter(l=>ST.done[l.id]).length/FLAT.length*100);
  const _r=document.getElementById("ring"); if(_r)_r.style.setProperty("--p",pct);
  const _rp=document.getElementById("ringpct"); if(_rp)_rp.textContent=pct+"%";
  let earned=0,avail=0;
  FLAT.forEach(l=>{if(l.activity&&l.activity.points!=null&&ST.done[l.id]){avail+=l.activity.points;earned+=(ST.earned[l.activity.id]||0);}});
  const _dn=FLAT.filter(x=>ST.done[x.id]).length;const _sc=document.getElementById("scorechip"); if(_sc)_sc.textContent = _dn? "✓ "+_dn+" / "+FLAT.length+" done": "✓, ";
}
function idx(id){return FLAT.findIndex(l=>l.id===id);}


function unlocked(i){
  // Lesson gating is handled by Canvas module requirements, not here.
  // Each unit is a separate page, so this file cannot see whether earlier units
  // were finished. Everything in this unit is open; Canvas decides unit order.
  return true;
}
function markDone(id,pts){
  ST.done[id]=true;
  if(pts!=null)ST.earned[FLAT[idx(id)].activity.id]=pts;
  // analytics: log activity completion as a SCORM interaction (harmless if LMS ignores it)
  try{
    const l=FLAT[idx(id)];const a=l&&l.activity;
    if(a&&a.id&&!ST.data['int-'+a.id]){
      const track=ST.track||"none";
      SCORM.logInteraction(a.id+"|"+track, "completed", true, "completed");
      ST.data['int-'+a.id]=1;
    }
  }catch(e){}
  persist();renderLessonNav();refreshNav();paintResult(FLAT[idx(id)]);
}
function paintResult(l){
  const a=l.activity;if(!a||a.points==null||!ST.done[l.id])return;
  const pts=ST.earned[a.id]??0,max=a.points;
  const fb=document.getElementById("fb-"+a.id);if(!fb)return;
  let r=document.getElementById("res-"+a.id);
  if(!r){r=document.createElement("div");r.id="res-"+a.id;fb.parentNode.insertBefore(r,fb.nextSibling);}
  r.className="result full";
  // Report what actually happened. Per-item try counts exist for judged activities
  // (review, triage); anything else just reports completion.
  let firstTry=0, tracked=0;
  for(let i=0;i<40;i++){
    const t=ST.data[a.id+'-t'+i];
    if(t===undefined) continue;
    tracked++; if(t===0) firstTry++;
  }
  let msg;
  if(tracked>0 && firstTry===tracked){
    msg='<b>Complete. '+tracked+' of '+tracked+' right on the first try.</b>';
  }else if(tracked>0){
    msg='<b>Complete. '+firstTry+' of '+tracked+' right on the first try.</b> Review the items you corrected: the explanation for each is above.';
  }else{
    msg='<b>Activity complete.</b>';
  }
  r.innerHTML='<span class="star">★</span><span>'+msg+'</span>';
}

/* ---------- lesson drawer ---------- */
function renderLessonNav(){
  const el=document.getElementById("ldbody");
  const _pj=ST.track&&CASES[ST.track]?CASES[ST.track].domain:"not chosen yet";
  const projBox=`<div style="background:#f3f0ea;border:1px solid #e8e1d6;border-radius:9px;padding:9px 11px;margin:0 0 12px">
    <div style="font-size:10px;letter-spacing:.06em;color:#7a8a99;font-family:var(--mono);margin-bottom:3px">YOUR PROJECT</div>
    <div style="font-size:12.5px;font-weight:700;color:#1c2b3a;margin-bottom:7px">${_pj}</div>
    <div id="pjsw" style="display:flex;gap:6px">${CASE_ORDER.map(id=>`<button type="button" data-t="${id}" style="flex:1;padding:5px 6px;font-size:10.5px;border-radius:6px;cursor:pointer;border:1.5px solid ${ST.track===id?'#1d5fa8':'#e8e1d6'};background:${ST.track===id?'#e3edf8':'#fff'};color:${ST.track===id?'#164a85':'#5a6b7b'};font-weight:${ST.track===id?'700':'400'}">${CASES[id].tag}</button>`).join("")}</div>
  </div>`;
  const adminBtn=projBox+`<div style="font-family:var(--mono);font-size:9.5px;color:#b9c6d2;text-align:right;margin:0 0 8px">build ${BUILD}</div>`;
  el.innerHTML=adminBtn+COURSE.map(m=>{
    const _note=``;
    return `<div><div class="mod-title">${m.mod}</div>${_note}<div class="lnav">${
    m.lessons.map(l=>{const i=idx(l.id),u=unlocked(i),d=ST.done[l.id];
      return `<a data-id="${l.id}" class="${ST.current===l.id?'on':''} ${u?'':'locked'}"${u?'':' title="Locked until you finish the previous unit"'}><span class="dot ${d?'done':''}">${d?'✓':(u?'':'🔒')}</span><span>${l.title}${l.mins?` <small style="opacity:.55">· ${l.mins}m</small>`:``}</span></a>`;}).join("")
  }</div></div>`;}).join("");
  try{ document.querySelectorAll("#pjsw button").forEach(b=>{
    b.onclick=()=>{ ST.track=b.dataset.t; remember("track",CASES[b.dataset.t].domain); persist(); renderLessonNav(); render(); };
  }); }catch(e){ console.warn("project switch:",e); }
  el.querySelectorAll("a").forEach(a=>a.onclick=()=>{
    const i=idx(a.dataset.id);if(!unlocked(i))return;
    ST.current=a.dataset.id;closeLessons();render();});
}
function openLessons(){renderLessonNav();document.getElementById("ld").classList.add("open");document.getElementById("ldscrim").classList.add("open");}
function closeLessons(){document.getElementById("ld").classList.remove("open");document.getElementById("ldscrim").classList.remove("open");}
document.getElementById("menuopen").onclick=openLessons;
document.getElementById("ldclose").onclick=closeLessons;
document.getElementById("ldscrim").onclick=closeLessons;

/* ---------- guide drawer ---------- */
let gdSection=GUIDE[0].id;
let gdQ="";
function renderGuide(){
  const list=GUIDE.filter(g=>!gdQ||g.title.toLowerCase().includes(gdQ)||g.html.toLowerCase().includes(gdQ));
  document.getElementById("gdnav").innerHTML=
    `<input id="gdsearch" value="${gdQ.replace(/"/g,'&quot;')}" placeholder="🔎 Search the Handbook…" style="width:100%;box-sizing:border-box;margin:2px 0 8px;padding:8px 10px;border:1.5px solid var(--line);border-radius:8px;font-family:var(--sans);font-size:12.5px">`+
    (list.length?list.map(g=>`<a data-g="${g.id}" class="${gdSection===g.id?'on':''}"><span class="gi">${g.icon}</span><span>${g.title}</span></a>`).join(""):`<div style="font-size:12px;color:var(--faint);padding:8px">No sections match.</div>`);
  const si=document.getElementById("gdsearch");
  si.oninput=()=>{gdQ=si.value.toLowerCase();const p=si.selectionStart;renderGuide();const s2=document.getElementById("gdsearch");s2.focus();s2.setSelectionRange(p,p);};
  const g=GUIDE.find(x=>x.id===gdSection);
  document.getElementById("gdcontent").innerHTML=`<h2>${g.title}</h2>${g.html}`;
  document.querySelectorAll("#gdnav a").forEach(a=>a.onclick=()=>{gdSection=a.dataset.g;renderGuide();document.getElementById("gdcontent").scrollTop=0;});
}
function openGuide(sec){if(sec)gdSection=sec;renderGuide();document.getElementById("gd").classList.add("open");document.getElementById("gdscrim").classList.add("open");}
function closeGuide(){document.getElementById("gd").classList.remove("open");document.getElementById("gdscrim").classList.remove("open");}
document.getElementById("guideopen").onclick=()=>openGuide();
document.getElementById("gdclose").onclick=closeGuide;
document.getElementById("gdscrim").onclick=closeGuide;

/* ---------- activity HTML ---------- */
function briefHtml(b){
  return `<div class="brief"><div class="bh2">📋 Scenario</div><div class="bfrom"><b>From:</b> ${b.from}</div><div class="bfrom"><b>Re:</b> ${b.re}</div><div class="btext">${b.text}</div></div>`;
}

/* ---------- journal self-check ----------
   A check is {want|avoid|minWords, ok, no}. want/avoid are "|"-separated words
   matched on word boundaries, case-insensitively. */
function runChecks(field, value){
  if(!field.checks || !field.checks.length) return null;
  const v = String(value||"");
  const words = v.trim().split(/\s+/).filter(Boolean).length;
  const hasAny = list => list.split("|").some(w => {
    const t = w.trim(); if(!t) return false;
    return new RegExp("(^|[^a-z])" + t.replace(/[.*+?^${}()|[\]\\]/g,"\\function coachBar(l){") + "([^a-z]|$)","i").test(v);
  });
  return field.checks.map(c => {
    let pass;
    if(c.pattern) pass = new RegExp(c.pattern,"i").test(v);
    else if(c.minWords !== undefined) pass = words >= c.minWords;
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
      '<div class="sc-r '+(r.pass?"ok":"no")+'"><span class="sc-i">'+(r.pass?"\u2713":"\u25cb")+'</span><span>'+r.text+'</span></div>'));
  });
  if(!rows.length) return "";
  return '<div class="selfcheck"><div class="sc-h">Your answer against the standard</div>'+rows.join("")+
         '<p class="sc-n">These check the rule, not the wording. A circle is a prompt to look again, not a mark.</p></div>';
}

function coachBar(l){
  if(!l.coach)return"";
  const coach=l.coach.replace("${GUIDE}",'<span class="glink" data-g="process">The Handbook</span>');
  return `<div class="coach"><div class="cface">🧭</div><div class="ct"><b>What to do:</b> ${coach}</div>${l.hint?'<button type="button" class="hint-btn" id="hintbtn">Hint</button>':''}</div>${l.hint?`<div class="hint" id="hintbox">💡 ${l.hint}</div>`:''}`;
}
function getAct(l){
  // Some lessons carry a variant for the Software Engineering project. Use the
  // learner's chosen project (set in Unit 1) rather than a separate control.
  if(l.variants && ST.track==="software" && l.variants.swe) return domainise(l.variants.swe);
  return domainise(l.activity);
}
// Activity text can carry {{DOMAIN}} and {{ROLE}} so a queue sits in the learner's
// own project instead of mixing both. Substitution happens at render time, because
// the project is not known when these objects are defined.
function domainise(a){
  if(!a) return a;
  const c = (typeof primary==="function") ? primary() : null;
  if(!c) return a;
  const map = {"{{DOMAIN}}": c.domain, "{{ROLE}}": c.role, "{{TAG}}": c.tag};
  const sub = s => { let o=s; for(const k in map) o=o.split(k).join(map[k]); return o; };
  const walk = v => {
    if(typeof v==="string") return sub(v);
    if(Array.isArray(v)) return v.map(walk);
    if(v && typeof v==="object"){ const o={}; for(const k in v) o[k]=walk(v[k]); return o; }
    return v;
  };
  return walk(a);
}
function actHtml(l){
  const a=getAct(l);if(!a)return"";
  const done=!!ST.done[l.id];
  if(a.type==="commit")return`<div class="checklist" id="cl-${a.id}">${a.items.map(it=>`<label><input type="checkbox" ${done?'checked disabled':''}> <span>${it}</span></label>`).join("")}</div>
    <button type="button" class="act-btn" id="b-${a.id}" ${done?'disabled':''}>${done?'Done ✓':'Confirm'}</button>`;
  if(a.type==="story"){
    return `<div class="pipe" id="pipe-${a.id}"></div><div id="story-${a.id}"></div><div class="fb" id="fb-${a.id}"></div>`;
  }
  if(a.type==="triage"){
    return `<div class="inbox" id="in-${a.id}"></div><div class="fb" id="fb-${a.id}"></div>`;
  }
  if(a.type==="repo"){
    return `<div class="repo-wrap">
      <div class="goals"><h4>To create</h4>${repoGoals(a).map((g,i)=>`<div class="goal" data-i="${i}"><span class="gk"></span><span>${g.desc}</span></div>`).join("")}</div>
      <div class="tree"><h4>${primary()?primary().tag+" repo (staging)":"module repo (staging)"}</h4><div id="tree-${a.id}"></div></div>
    </div>
    <div class="mkfile"><input id="mk-${a.id}" placeholder="Type a file label, e.g. GLAB 301.1.1" ${done?'disabled':''}><button type="button" id="b-${a.id}" ${done?'disabled':''}>Create</button></div>
    <div class="mk-msg" id="msg-${a.id}"></div><div class="fb" id="fb-${a.id}"></div>`;
  }
  if(a.type==="track"){
    return `<div class="track-pick" id="tp-${a.id}">${CASE_ORDER.map(id=>{const c=CASES[id];
      return `<button type="button" class="tcard ${ST.track===id?'sel':''}" data-t="${id}" aria-pressed="${ST.track===id?'true':'false'}"><span class="tcd">${c.tag} track</span><div class="tcp">${c.domain}</div><div class="tcr" title="${c.ph_role?'Role title still being confirmed with the client':''}">${c.role}${c.ph_role?' (title to be confirmed)':''} · ${c.productType}</div></button>`;}).join("")}</div>
      ${ST.track?`<div class="mk-msg okc" style="margin-top:10px">\u2713 Primary project set: <b>${CASES[ST.track].domain}</b>. Units 2\u20134 build this one; you can switch it here anytime before you continue.</div>`:''}
      <div class="mk-msg" id="msg-${a.id}"></div>`;
  }
  if(a.type==="sort"){
    return `<div class="sort-pool" id="sp-${a.id}"></div>
    <div class="sbuckets" id="sb-${a.id}">${a.buckets.map((b,bi)=>`<div class="sbucket" data-b="${bi}" tabindex="0" role="button" aria-label="Place the selected card in ${b.label}"><h5>${b.label}</h5><div class="sb-slot"></div></div>`).join("")}</div>
    <div class="mk-msg" id="msg-${a.id}"></div><div class="fb" id="fb-${a.id}"></div>`;
  }
  if(a.type==="day"){
    return `<div class="day-wrap">
      <div class="palette"><h4>Palette: select to add</h4>${a.palette.map((p,i)=>`<div class="pal-item ${p.act?'':'pas'}" data-i="${i}" tabindex="0" role="button">${p.t}<small>${p.min} min · ${p.act?'activated':'passive'}</small></div>`).join("")}</div>
      <div class="sched"><h4>Your schedule</h4><div id="slots-${a.id}"></div>
        <div class="day-meters">
          <div class="meter-bar"><div class="meter-fill" id="am-${a.id}">0%</div><div class="meter-t"></div></div>
          <div class="meter-lbl"><span>Activated share · black line = 75%</span><span id="tm-${a.id}">0 / ${a.total} min</span></div>
          <div class="reqs" id="rq-${a.id}">${a.reqs.map(r=>`<span class="req" data-k="${r.k}">${r.label}</span>`).join("")}</div>
        </div>
      </div>
    </div>
    <button type="button" class="act-btn" id="b-${a.id}" ${done?'disabled':''}>Check my day</button><div class="fb" id="fb-${a.id}"></div>`;
  }
  if(a.type==="fix"){
    return `<div class="box info"><span class="bh">${a.intro}</span><div class="doc" id="doc-${a.id}">${a.sents.map((s,i)=>`<span class="sent" data-i="${i}" tabindex="0" role="button">${s.t}</span>`).join("")}</div></div>
    <div class="fixpanel" id="fp-${a.id}"><div class="fq" id="fq-${a.id}"></div><div id="fo-${a.id}"></div><div class="fix-msg" id="fm-${a.id}"></div></div>
    <div class="fix-count" id="fc-${a.id}"></div><div class="fb" id="fb-${a.id}"></div>`;
  }
  if(a.type==="review"){
    return `<div class="inbox" id="rv-${a.id}"></div><div class="fb" id="fb-${a.id}"></div>`;
  }
  if(a.type==="rubric"){
    return `<div class="dossier"><div class="dh"><span>QA queue · item 1 of 1</span><span>${a.dossier.meta}</span></div><div class="db">${a.dossier.text}</div></div>
    ${a.dims.map((d,i)=>`<div class="rb-dim" data-i="${i}"><div class="rt">${d.t}</div><div class="rb-scale">${[0,1,2,3].map(n=>`<button type="button" data-n="${n}">${n}</button>`).join("")}</div><div class="rb-why">${d.why}</div></div>`).join("")}
    <button type="button" class="act-btn" id="b-${a.id}" ${done?'disabled':''}>Compare with expert scoring</button><div class="fb" id="fb-${a.id}"></div>`;
  }
  if(a.type==="journal"){const dj=ST.data[a.id]||{};
    return a.fields.map((f,i)=>`<div style="margin-bottom:13px"><label for="ja-${a.id}-${i}" style="display:block;font-weight:600;font-size:13.5px;margin-bottom:6px">${f.label}</label><textarea id="ja-${a.id}-${i}" data-j="${i}" aria-label="${f.label.replace(/"/g,'&quot;')}" placeholder="${f.ph||''}" ${done?'disabled':''}>${dj['f'+i]||''}</textarea></div>`).join("")+
    `<button type="button" class="act-btn" id="b-${a.id}" ${done?'disabled':''}>${done?'Saved ✓':'Save & continue'}</button>`+
    `<div id="jm-${a.id}">${done&&a.model?`<div class="box info" style="margin-top:12px"><span class="bh">${a.modelHead||"Compare notes: a strong response usually touches on"}</span>${typeof a.model==="function"?a.model():a.model}</div>`:''}</div>`;
  }
  if(a.type==="capstone"){const d=ST.data[a.id]||{};
    const asgn=(typeof CAPSTONE_ASSIGNMENT_URL!=="undefined"&&CAPSTONE_ASSIGNMENT_URL)?CAPSTONE_ASSIGNMENT_URL:"";
    return `<div class="mk-label" style="font-family:var(--mono);font-size:10px;letter-spacing:.06em;text-transform:uppercase;color:var(--muted);margin-bottom:8px">Reflect before you plan: private, for your own thinking</div>
    ${a.fields.map((f,i)=>`<div style="margin-bottom:12px"><label for="ca-${i}" style="display:block;font-weight:600;font-size:13.5px;margin-bottom:6px">${f.label}</label><textarea id="ca-${i}" data-f="${i}" aria-label="${f.label.replace(/"/g,'&quot;')}" placeholder="${f.ph}" ${ST.cap?'disabled':''}>${d['f'+i]||''}</textarea></div>`).join("")}
    <div style="font-weight:600;font-size:14px;margin:16px 0 4px">Commit to the standard you'll be QA'd against:</div>
    <div class="checklist" id="caprub">${a.rubric.map(r=>`<label><input type="checkbox" ${ST.cap?'checked disabled':''}> <span>${r}</span></label>`).join("")}</div>
    <div class="ctrans" style="border-left-color:var(--gold);background:#fff7e8;margin-top:18px"><span class="ct-h" style="color:#7d5600">→ Your final step, in Canvas</span><div>Open the <b>Module Development Package</b> assignment. Build your module repo in Google Drive (the plan plus one built lesson, activity, and assessment), then submit the folder link. Your manager reviews it against the readiness rubric. This is your first real assignment, not a quiz.${asgn?` <a href="${asgn}" target="_blank" rel="noopener" style="font-weight:700;color:#7d5600">Open the capstone assignment →</a>`:` <b>(Find it in this course\u2019s Assignments.)</b>`}</div></div>
    <button type="button" class="act-btn" id="b-${a.id}" ${ST.cap?'disabled':''}>${ST.cap?'Completed ✓: course done':'Save & complete the course'}</button>`;
  }
  return"";
}

/* ---------- activity wiring ---------- */
function wire(l){
  const a=getAct(l);if(!a)return;const A=a.id;const done=!!ST.done[l.id];
  const btn=document.getElementById("b-"+A);
  const hb=document.getElementById("hintbtn");
  if(hb)hb.onclick=()=>document.getElementById("hintbox").classList.toggle("show");

  if(a.type==="commit"&&!done)btn.onclick=()=>{
    const bs=[...document.querySelectorAll("#cl-"+A+" input")];
    if(!bs.every(b=>b.checked)){btn.textContent="Tick all "+bs.length+" to continue";return;}
    bs.forEach(b=>b.disabled=true);btn.disabled=true;btn.textContent="Done ✓";markDone(l.id,null);
  };

  if(a.type==="story"){
    let step=done?a.steps.length:0,wrongs=0;
    const pipeEl=document.getElementById("pipe-"+A),host=document.getElementById("story-"+A);
    function pipe(){
      pipeEl.innerHTML=a.steps.map((_,i)=>{
        const n=`<div class="pnode ${i<step?'done':(i===step?'here':'')}">${i<step?'✓':i+1}</div>`;
        return n+(i<a.steps.length-1?`<div class="pseg ${i<step?'done':''}"></div>`:'');
      }).join("");
    }
    function scene(){
      pipe();
      if(step>=a.steps.length){
        host.innerHTML="";
        if(!done){
          const perfect=wrongs===0;
          const fb=document.getElementById("fb-"+A);fb.className="fb show "+(perfect?"good":"bad");fb.textContent=perfect?a.fbGood:a.fbBad;
          markDone(l.id,a.points);
        } else {
          const fb=document.getElementById("fb-"+A);fb.className="fb show good";fb.textContent=a.fbGood;
        }
        return;
      }
      const s=a.steps[step];
      host.innerHTML=`<div class="scene"><div class="sc-tag">${s.tag}</div><div class="sc-text">${s.text}</div>
        ${s.opts.map((o,i)=>`<button type="button" class="choice" data-i="${i}">${o.t}</button>`).join("")}
        <div class="sc-fb" id="scfb-${A}"></div></div>`;
      host.querySelectorAll(".choice").forEach(c=>c.onclick=()=>{
        const o=s.opts[+c.dataset.i];const fb=document.getElementById("scfb-"+A);
        if(o.ok){c.classList.add("yes");fb.className="sc-fb show good";fb.textContent="✓ "+o.fb;
          host.querySelectorAll(".choice").forEach(x=>x.disabled=true);
          const nb=document.createElement("button");nb.className="act-btn";
          nb.textContent=step<a.steps.length-1?"Continue to the next step →":"Finish the walk →";
          fb.parentNode.appendChild(nb);nb.onclick=()=>{step++;scene();};}
        else{wrongs++;c.classList.add("no");c.disabled=true;fb.className="sc-fb show bad";fb.textContent="✗ Not that one. "+o.fb+" Pick again.";}
      });
    }
    scene();
  }

  if(a.type==="triage"){
    const host=document.getElementById("in-"+A);
    let iCur=done?a.items.length:0,right=0;
    if(done)right=a.items.length;
    function draw(){
      host.innerHTML=a.items.map((m,i)=>{
        const graded=i<iCur||done;
        const state=done?'correct':(ST.data[A+'-'+i]!=null?(ST.data[A+'-'+i]?'correct':'wrong'):'');
        return `<div class="mail ${i>iCur&&!done?'pending':''} ${graded?('graded '+state):''}" data-i="${i}">
          <div class="mh"><span class="from">${m.from}</span><span class="mtag">intake</span></div>
          <div class="subj">${m.subj}</div><div class="body">${m.body}</div>
          <div class="stamps">${a.buckets.map((b,bi)=>{
            let cls="";
            if(graded){ if(bi===m.ans)cls="st-ok"; else if(ST.data[A+'-c'+i]===bi)cls="st-no"; }
            return `<button type="button" class="${cls}" data-b="${bi}" ${graded?'disabled':''}>${b}</button>`;}).join("")}</div>
          <div class="verdict">${graded?((ST.data[A+'-c'+i]==null||ST.data[A+'-c'+i]===m.ans)?'✓ Right call. ':'✗ You stamped “'+a.buckets[ST.data[A+'-c'+i]].replace(/^..\s*/,'')+'”, correct: “'+a.buckets[m.ans].replace(/^..\s*/,'')+'”. '):''}${m.why}</div></div>`;
      }).join("");
      host.querySelectorAll(".mail").forEach(mEl=>{
        const i=+mEl.dataset.i;if(i!==iCur||done)return;
        mEl.querySelectorAll("button").forEach(b=>b.onclick=()=>{
          const ok=+b.dataset.b===a.items[i].ans;
          ST.data[A+'-c'+i]=+b.dataset.b;
          ST.data[A+'-'+i]=ok;if(ok)right++;
          try{ SCORM.logInteraction(A+".item"+i, a.buckets[+b.dataset.b].replace(/^..\s*/,''), ok, a.buckets[a.items[i].ans].replace(/^..\s*/,'')); }catch(e){}
          const justAnswered=i;iCur++;draw();
          requestAnimationFrame(()=>{const t=host.querySelector('.mail[data-i="'+justAnswered+'"]');if(t&&t.scrollIntoView)t.scrollIntoView({behavior:'smooth',block:'nearest'});});
          if(iCur>=a.items.length){
            const perfect=right===a.items.length;
            const fb=document.getElementById("fb-"+A);fb.className="fb show "+(perfect?"good":"bad");fb.textContent=perfect?a.fbGood:a.fbBad;
            markDone(l.id,a.points);
          }
        });
      });
    }
    draw();
    if(done){const fb=document.getElementById("fb-"+A);fb.className="fb show good";fb.textContent=a.fbGood;}
  }

  if(a.type==="repo"){
    const treeEl=document.getElementById("tree-"+A);
    const doneGoals=ST.data[A+'-goals']||(done?repoGoals(a).map((_,i)=>i):[]);
    let wrongs=ST.data[A+'-w']||0;
    function tree(){
      let h="";
      for(const f in a.folders){
        h+=`<div class="tnode"><span class="tf">📁 ${f}/</span></div>`;
        a.folders[f].forEach(x=>h+=`<div class="tnode">&nbsp;&nbsp;📄 ${x}</div>`);
        repoGoals(a).forEach((g,i)=>{if(g.folder===f&&doneGoals.includes(i))h+=`<div class="tnode">&nbsp;&nbsp;📄 <span class="new">${g.label}</span></div>`;});
      }
      treeEl.innerHTML=h;
      document.querySelectorAll(".goal").forEach(g=>{g.classList.toggle("done",doneGoals.includes(+g.dataset.i));});
    }
    tree();
    if(done)return;
    const norm=s=>s.toLowerCase().replace(/[\u2013, -]+/g," ").replace(/\s+/g," ").trim().replace(/^r /,"r-");
    btn.onclick=()=>{
      const inp=document.getElementById("mk-"+A),msg=document.getElementById("msg-"+A);
      const v=norm(inp.value);if(!v)return;
      const gi=repoGoals(a).findIndex((g,i)=>!doneGoals.includes(i)&&(v===norm(g.ans)||v.startsWith(norm(g.ans))));
      if(gi>=0){
        doneGoals.push(gi);ST.data[A+'-goals']=doneGoals;
        msg.className="mk-msg okc";msg.textContent="✓ Created "+repoGoals(a)[gi].label+" → "+repoGoals(a)[gi].folder+"/";
        inp.value="";tree();persist();
        if(doneGoals.length===repoGoals(a).length){
          const perfect=wrongs===0;
          const fb=document.getElementById("fb-"+A);fb.className="fb show "+(perfect?"good":"bad");fb.textContent=perfect?a.fbGood:a.fbBad;
          inp.disabled=true;btn.disabled=true;
          markDone(l.id,a.points);
        }
      } else {
        wrongs++;ST.data[A+'-w']=wrongs;
        msg.className="mk-msg err";
        msg.textContent="✗ No pending file matches that name. Check the prefix (GLAB / R-GLAB / ALAB / Quiz / KBA / MBP) and whether it's lesson-level (301.1) or module-level (301).";
      }
    };
    document.getElementById("mk-"+A).addEventListener("keydown",e=>{if(e.key==="Enter"){e.preventDefault();btn.click();}});
  }

  if(a.type==="track"){
    document.querySelectorAll("#tp-"+A+" .tcard").forEach(b=>b.onclick=()=>{
      ST.track=b.dataset.t; remember("track",CASES[b.dataset.t].domain);
      markDone(l.id,a.points);
      const _m=document.querySelector("main"); render._sy=_m?_m.scrollTop:0; render(true);
    });
  }
  if(a.type==="sort"){
    const pool=document.getElementById("sp-"+A),bwrap=document.getElementById("sb-"+A),msg=document.getElementById("msg-"+A);
    let placed=ST.data[A+'-p']||(done?a.cards.map((c,i)=>i):[]);
    let wrongs=ST.data[A+'-w']||0,selCard=null;
    function draw(){
      pool.innerHTML=a.cards.map((c,i)=>placed.includes(i)?'':`<div class="scard ${selCard===i?'sel':''}" draggable="${!done}" data-c="${i}" tabindex="0" role="button" aria-label="${c.t}">${c.t}</div>`).join("");
      bwrap.querySelectorAll(".sbucket").forEach(bEl=>{
        const bi=+bEl.dataset.b;
        bEl.querySelector(".sb-slot").innerHTML=a.cards.map((c,i)=>placed.includes(i)&&c.k===a.buckets[bi].k?`<span class="placed">✓ ${c.t}</span>`:'').join("");
      });
      if(done)return;
      pool.querySelectorAll(".scard").forEach(el=>{
        el.ondragstart=e=>{e.dataTransfer.setData("text/plain",el.dataset.c);};
        el.onclick=()=>{selCard=(selCard===+el.dataset.c?null:+el.dataset.c);draw();};
        el.onkeydown=e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();el.onclick();}};
      });
      bwrap.querySelectorAll(".sbucket").forEach(bEl=>{
        const bi=+bEl.dataset.b;
        bEl.ondragover=e=>{e.preventDefault();bEl.classList.add("over");};
        bEl.ondragleave=()=>bEl.classList.remove("over");
        bEl.ondrop=e=>{e.preventDefault();bEl.classList.remove("over");attempt(+e.dataTransfer.getData("text/plain"),bi,bEl);};
        bEl.onclick=()=>{if(selCard!=null)attempt(selCard,bi,bEl);};
      });
    }
    function attempt(ci,bi,bEl){
      if(ci==null||isNaN(ci)||placed.includes(ci))return;
      if(a.cards[ci].k===a.buckets[bi].k){
        placed.push(ci);selCard=null;ST.data[A+'-p']=placed;persist();
        msg.className="mk-msg okc";msg.textContent='✓ "'+a.cards[ci].t+'" filed under '+a.buckets[bi].label+'.';
        draw();
        if(placed.length===a.cards.length){
          const perfect=wrongs===0;
          const fb=document.getElementById("fb-"+A);fb.className="fb show "+(perfect?"good":"bad");fb.textContent=perfect?a.fbGood:a.fbBad;
          markDone(l.id,a.points);
        }
      } else {
        wrongs++;ST.data[A+'-w']=wrongs;selCard=null;
        bEl.classList.add("no");setTimeout(()=>bEl.classList.remove("no"),450);
        msg.className="mk-msg err";msg.textContent='✗ "'+a.cards[ci].t+'" isn\u2019t belong under '+a.buckets[bi].label+'. Read the card again against what that bucket holds.';
        draw();
      }
    }
    draw();
    if(done){const fb=document.getElementById("fb-"+A);fb.className="fb show good";fb.textContent=a.fbGood;}
  }

  if(a.type==="day"){
    let sched=ST.data[A]||[];
    if(done&&!sched.length)sched=[0,3,4,6,8].map(i=>i).filter(i=>i<a.palette.length);
    const slotsEl=document.getElementById("slots-"+A);
    function stats(){
      let tot=0,act=0;const met={};
      sched.forEach(i=>{const p=a.palette[i];tot+=p.min;if(p.act)act+=p.min;if(p.req)met[p.req]=true;});
      met.t240=tot===a.total;met.a75=tot>0&&(act/tot)>=0.75;
      return{tot,act,met,pct:tot?Math.round(act/tot*100):0};
    }
    function draw(){
      slotsEl.innerHTML=sched.length?sched.map((pi,si)=>{const p=a.palette[pi];
        return `<div class="slot ${p.act?'':'pas'}"><span>${p.t} <small>${p.min}m · ${p.act?'activated':'passive'}</small></span>${done?'':`<button type="button" class="rm" data-s="${si}">×</button>`}</div>`;}).join("")
        :`<div style="font-size:12.5px;color:var(--faint);padding:10px 4px">Empty: select blocks in the palette to build the day.</div>`;
      const s=stats();
      const am=document.getElementById("am-"+A);am.style.width=s.pct+"%";am.textContent=s.pct+"%";
      document.getElementById("tm-"+A).textContent=s.tot+" / "+a.total+" min";
      document.querySelectorAll("#rq-"+A+" .req").forEach(r=>r.classList.toggle("met",!!s.met[r.dataset.k]));
      if(!done)slotsEl.querySelectorAll(".rm").forEach(b=>b.onclick=()=>{sched.splice(+b.dataset.s,1);ST.data[A]=sched;draw();});
    }
    draw();
    if(done)return;
    const schedBox=slotsEl.closest(".sched");
    function tryAdd(pi){
      const s=stats();const add=a.palette[pi];
      if(s.tot+add.min>a.total){const fb=document.getElementById("fb-"+A);fb.className="fb show bad";fb.textContent="That block would overflow the 240-minute day, remove something first.";return;}
      document.getElementById("fb-"+A).className="fb";
      sched.push(pi);ST.data[A]=sched;draw();
    }
    schedBox.ondragover=e=>{e.preventDefault();schedBox.style.borderColor="var(--indigo)";};
    schedBox.ondragleave=()=>{schedBox.style.borderColor="";};
    schedBox.ondrop=e=>{e.preventDefault();schedBox.style.borderColor="";const pi=+e.dataTransfer.getData("text/plain");if(!isNaN(pi))tryAdd(pi);};
    document.querySelectorAll(".pal-item").forEach(p=>{
      p.setAttribute("draggable","true");
      p.ondragstart=e=>{e.dataTransfer.setData("text/plain",p.dataset.i);};
    });
    document.querySelectorAll(".pal-item").forEach(p=>p.onclick=()=>tryAdd(+p.dataset.i));
    btn.onclick=()=>{
      const s=stats();
      const fails=a.reqs.filter(r=>!s.met[r.k]).map(r=>r.label);
      const fb=document.getElementById("fb-"+A);
      if(fails.length){fb.className="fb show bad";fb.textContent="Not yet, still missing: "+fails.join(", ")+". "+a.fbBad;
        markDoneSoft();return;}
      fb.className="fb show good";fb.textContent=a.fbGood;
      btn.disabled=true;markDone(l.id,a.points);
      function markDoneSoft(){/* allow retry, partial credit only on success-with-history */}
    };
  }

  if(a.type==="fix"){
    let wrongs=0;const fixedSet=new Set(done?a.sents.map((s,i)=>s.bad?i:null).filter(x=>x!=null):[]);
    const docEl=document.getElementById("doc-"+A),panel=document.getElementById("fp-"+A),fq=document.getElementById("fq-"+A),fo=document.getElementById("fo-"+A),fm=document.getElementById("fm-"+A),fc=document.getElementById("fc-"+A);
    let active=null;
    function draw(){
      docEl.innerHTML=a.sents.map((s,i)=>{
        const txt=fixedSet.has(i)?(s.fixed!==undefined?s.fixed:s.t):s.t;
        if(fixedSet.has(i)&&txt==="")return"";
        return `<span class="sent ${fixedSet.has(i)?'fixed':''} ${active===i?'active':''}" data-i="${i}"${fixedSet.has(i)?'':' tabindex="0" role="button"'}>${txt}</span>`;
      }).join("");
      const badTotal=a.sents.filter(s=>s.bad).length;
      fc.textContent="Fixed "+fixedSet.size+" of "+badTotal+" problems"+(wrongs?" · "+wrongs+" missteps":"");
      if(!done)docEl.querySelectorAll(".sent").forEach(el=>el.onclick=()=>{
        const i=+el.dataset.i;if(fixedSet.has(i))return;
        const s=a.sents[i];
        if(!s.bad){wrongs++;fm.className="fix-msg err";fm.textContent="That sentence is fine, plain, accurate, on-objective. Look again.";draw();return;}
        active=i;draw();
        panel.classList.add("show");fq.innerHTML="You flagged: \u201C"+s.t.trim()+"\u201D. Pick the correct repair:";
        fo.innerHTML=s.fixes.map((f,fi)=>`<button type="button" class="fixopt" data-f="${fi}">${f.t}</button>`).join("");
        fm.textContent="";
        fo.querySelectorAll(".fixopt").forEach(b=>b.onclick=()=>{
          const f=s.fixes[+b.dataset.f];
          if(f.ok){fixedSet.add(i);active=null;panel.classList.remove("show");fm.textContent="";
            const note=document.getElementById("fb-"+A);note.className="fb show good";note.textContent="✓ "+f.fb;
            draw();
            if(fixedSet.size===a.sents.filter(x=>x.bad).length){
              const perfect=wrongs===0;
              note.className="fb show "+(perfect?"good":"bad");note.textContent=perfect?a.fbGood:a.fbBad;
              markDone(l.id,a.points);
            }
          } else {wrongs++;fm.className="fix-msg err";fm.textContent=f.fb;fc.textContent="Fixed "+fixedSet.size+" · "+wrongs+" missteps";}
        });
      });
    }
    draw();
    if(done){const fb=document.getElementById("fb-"+A);fb.className="fb show good";fb.textContent=a.fbGood;}
  }

  if(a.type==="review"){
    const host=document.getElementById("rv-"+A);
    let cur=done?a.items.length:0,wrongs=0,itemTries=0;
    function finish(){
      const perfect=wrongs===0;
      const fb=document.getElementById("fb-"+A);fb.className="fb show "+(perfect?"good":"bad");fb.textContent=perfect?a.fbGood:a.fbBad;
      if(!done)markDone(l.id,a.points);
    }
    function scrollToItem(idx){
      // keep the learner where they are: reveal the answer they just gave, then bring the next item
      // into view smoothly, never snap the page to the top.
      requestAnimationFrame(()=>{
        const target = host.querySelector('.mail[data-i="'+(idx)+'"]');
        if(target && target.scrollIntoView){ target.scrollIntoView({behavior:'smooth', block:'nearest'}); }
      });
    }
    function draw(){
      host.innerHTML=a.items.map((it,i)=>{
        const graded=i<cur||done;
        const active=i===cur&&!done;
        const tr=ST.data[A+'-t'+i];
        const perf=graded?((tr==null||tr===0)?'correct':'wrong'):'';
        const pre=graded?((tr==null||tr===0)?'✓ First try. ':'↺ Took '+(tr+1)+' attempts, worth a re-read. '):'';
        return `<div class="mail ${i>cur&&!done?'pending':''} ${graded?'graded '+perf:''}" data-i="${i}">
          <div class="mh"><span class="from">Item ${i+1} of ${a.items.length}</span><span class="mtag">${a.queueTag||'review queue'}</span></div>
          <div class="body" style="font-style:normal;color:var(--text)">${typeof it.content==="function"?it.content():it.content}</div>
          ${active?`<div class="stamps"><button type="button" data-v="ok">${(a.labels&&a.labels.yes)||'✓ Approve'}</button><button type="button" data-v="bad">${(a.labels&&a.labels.no)||'✗ Send back'}</button></div>
            <div id="rr-${A}" style="margin-top:9px"></div><div class="fix-msg" id="rm-${A}"></div>`:''}
          <div class="verdict" style="color:${!graded?'inherit':(perf==='correct'?'#186b52':'#9a2f2f')}"><b>${pre}</b>${graded?it.why:''}</div></div>`;
      }).join("");
      if(done||cur>=a.items.length)return;
      const it=a.items[cur];
      // Verdict wording defaults to approve/send back, but a queue asking a different
      // question (ours or not, keep or drop) declares its own labels.
      const L=Object.assign({
        missYes:"✗ Look again: something in this item violates the standard.",
        missNo:"✗ This one actually meets the standard: re-read it against the rules before stamping.",
        reasonPrompt:"Right, it goes back. Now name the violation:"
      },a.labels||{});
      const card=host.querySelector('.mail[data-i="'+cur+'"]');
      const msg=document.getElementById("rm-"+A),rr=document.getElementById("rr-"+A);
      card.querySelectorAll(".stamps button").forEach(b=>b.onclick=()=>{
        const v=b.dataset.v;
        const advance=()=>{ST.data[A+'-t'+cur]=itemTries;try{SCORM.logInteraction(A+".item"+cur,(it.good?'approve':'sendback')+' ('+(itemTries+1)+' tries)',itemTries===0,it.good?'approve':'sendback');}catch(e){}const justAnswered=cur;itemTries=0;cur++;draw();scrollToItem(justAnswered);if(cur>=a.items.length)finish();};
        if(v==="ok"){
          if(it.good){advance();}
          else{wrongs++;itemTries++;msg.className="fix-msg err";msg.textContent=L.missYes;}
        } else {
          if(it.good){wrongs++;itemTries++;msg.className="fix-msg err";msg.textContent=L.missNo;rr.innerHTML="";}
          else if(!it.reasons||!it.reasons.length){
            // Correct verdict, and this item asks for no follow-up reason: accept it.
            msg.textContent="";advance();
          }
          else{
            msg.textContent="";
            rr.innerHTML=`<div style="font-size:12.5px;color:var(--muted);margin-bottom:6px">${L.reasonPrompt}</div>`+
              it.reasons.map((r,ri)=>`<button type="button" class="fixopt" data-r="${ri}">${r.t}</button>`).join("");
            rr.querySelectorAll(".fixopt").forEach(rb=>rb.onclick=()=>{
              const r=it.reasons[+rb.dataset.r];
              if(r.ok){advance();}
              else{wrongs++;itemTries++;msg.className="fix-msg err";msg.textContent="✗ "+r.fb;}
            });
          }
        }
      });
    }
    draw();
    if(done){const fb=document.getElementById("fb-"+A);fb.className="fb show good";fb.textContent=a.fbGood;}
  }

  if(a.type==="rubric"){
    const dims=[...document.querySelectorAll(".rb-dim")];
    if(done){dims.forEach(d=>{const i=+d.dataset.i;d.classList.add("graded","correct");d.querySelectorAll("button").forEach(b=>{b.disabled=true;if(+b.dataset.n===a.dims[i].ans)b.classList.add("pick");});});return;}
    dims.forEach(d=>d.querySelectorAll("button").forEach(b=>b.onclick=()=>{
      d.querySelectorAll("button").forEach(x=>x.classList.remove("pick"));b.classList.add("pick");d.dataset.pick=b.dataset.n;}));
    btn.onclick=()=>{
      if(!dims.every(d=>d.dataset.pick!=null)){const fb=document.getElementById("fb-"+A);fb.className="fb show bad";fb.textContent="Score all three dimensions first.";return;}
      let right=0;
      dims.forEach(d=>{const i=+d.dataset.i,ok=+d.dataset.pick===a.dims[i].ans;
        d.classList.add("graded",ok?"correct":"wrong");if(ok)right++;d.querySelectorAll("button").forEach(x=>x.disabled=true);});
      const perfect=right===dims.length;
      const fb=document.getElementById("fb-"+A);fb.className="fb show "+(perfect?"good":"bad");fb.textContent=perfect?a.fbGood:a.fbBad;
      btn.disabled=true;markDone(l.id,a.points);
    };
  }

  if(a.type==="journal"&&!done){
    const dj=ST.data[A]||{};
    const jhost=document.getElementById("content")||document;
    jhost.querySelectorAll("[data-j]").forEach(t=>t.oninput=()=>{dj['f'+t.dataset.j]=t.value;ST.data[A]=dj;persist();});
    btn.onclick=()=>{
      const fs=[...jhost.querySelectorAll("[data-j]")];
      if(!fs.every(t=>t.value.trim().length>=8)){btn.textContent="A sentence or two per box, then save";return;}
      fs.forEach(t=>t.disabled=true);btn.disabled=true;btn.textContent="Saved ✓";markDone(l.id,null);
      const _sc = checksHtml(a, jhost);
      if(a.model||_sc){document.getElementById("jm-"+A).innerHTML= _sc + (!a.model ? "" : `<div class="box info" style="margin-top:12px"><span class="bh">${a.modelHead||"Compare notes: a strong response usually touches on"}</span>${typeof a.model==="function"?a.model():a.model}</div>`);}
    };
  }
  if(a.type==="capstone"&&!ST.cap){
    const d=ST.data[A]||{};
    document.querySelectorAll("[data-f]").forEach(t=>t.oninput=()=>{d['f'+t.dataset.f]=t.value;ST.data[A]=d;});
    btn.onclick=()=>{
      const rub=[...document.querySelectorAll("#caprub input")];
      const fields=[...document.querySelectorAll("[data-f]")];
      if(!fields.every(t=>t.value.trim().length>10)){btn.textContent="Fill in all three plan fields to submit";return;}
      if(!rub.every(b=>b.checked)){btn.textContent="Tick every standard to submit";return;}
      rub.forEach(b=>b.disabled=true);fields.forEach(t=>t.disabled=true);
      btn.disabled=true;btn.textContent="Submitted ✓, course complete";
      ST.cap=true;ST.done[l.id]=true;SCORM.complete();persist();renderLessonNav();refreshNav();
      let e=0,av=0;FLAT.forEach(x=>{if(x.activity&&x.activity.points!=null&&ST.done[x.id]){av+=x.activity.points;e+=(ST.earned[x.activity.id]||0);}});
      const done_div=document.createElement("div");done_div.className="result "+(av&&e>=av*0.85?"full":"part");
      done_div.innerHTML='<span class="star">🎓</span><span><b>Course complete</b>, and marked complete in Canvas. There\u2019s no grade here; this was always for your learning. Take your finished Brief to your manager or mentor. That review is your first real assignment. The 📘 Handbook stays with you from here.</span>';
      btn.parentNode.appendChild(done_div);
    };
  }
}


/* ---------- render ---------- */
function refreshNav(){
  const l=FLAT.find(x=>x.id===ST.current),i=idx(l.id),next=FLAT[i+1];
  const gate=((l.activity&&!ST.done[l.id])||(l.demo&&ST.data['dm-'+l.id]!=='done'&&!ST.done[l.id]));
  const nb=document.getElementById("nextb");if(!nb)return;
  nb.disabled=gate;
  const ln=document.getElementById("locknote");if(ln)ln.style.display=gate?"block":"none";
  if(gate) return;
  if(next){ nb.onclick=()=>{ST.current=next.id;render();}; return; }
  // Last lesson of the unit: finish rather than dead-end.
  nb.onclick=()=>{
    try{ SCORM.markComplete(); }catch(e){}
    try{ SCORM.finish(); }catch(e){}
    const c=document.getElementById("content");
    if(c){
      const d=document.createElement("div");
      d.className="unit-done";
      d.innerHTML='<div class="ud-h">Unit complete</div>'+
        '<p>Your progress is saved. Close this page to return to Canvas, or open the next unit from the course page.</p>'+
        '<a class="act-btn" href="index.html">All units</a>';
      c.appendChild(d);
      d.scrollIntoView({behavior:"smooth",block:"center"});
    }
    nb.disabled=true;
  };
}
function render(keepScroll){
  // Re-rendering the same lesson (rewatching a demo, stepping an activity, switching
  // track) must not throw the reader back to the top. Only moving to a different
  // lesson starts at the top.
  {
    const _m0 = document.querySelector("main");
    if (_m0 && render._last === ST.current && _m0.scrollTop > 0) render._sy = _m0.scrollTop;
    if (render._last !== ST.current) render._sy = 0;
  }
  // Guard: a shared-storage ST.current can point outside this unit. Recover rather than throw.
  if(!FLAT.some(x=>x.id===ST.current)){
    const fu=FLAT.find(x=>!ST.done[x.id]);
    ST.current=(fu||FLAT[0]).id;
  }
  const l=FLAT.find(x=>x.id===ST.current),i=idx(l.id);
  const prev=FLAT[i-1],next=FLAT[i+1];
  let h=`<div class="crumb">${String(l.crumb).replace(/^Unit \d+\s*[·:]\s*/,"")}${l.mins?` <span style="margin-left:6px;background:#e9eef4;color:#5b6b7a;border-radius:10px;padding:1px 9px;font-size:9.5px;letter-spacing:.05em">≈ ${l.mins} MIN</span>`:``}</div><h1>${l.title}</h1>${leadHtml(l)}${l.frame?frame(typeof l.frame==='function'?l.frame():l.frame):''}${(typeof l.html==='function'?l.html():(l.html||''))}${(l.activity||l.brief||l.coach)?`<section class="work"><div class="work-h"><span class="wl">Your turn</span></div>${l.brief?briefHtml(typeof l.brief==='function'?l.brief():l.brief):''}${coachBar(l)}`:''}`;
  const _hasWork=!!(l.activity||l.brief||l.coach);
  if(l.prompt)h+=`<div class="prompt"><div class="prompt-h"><span class="pl">${l.prompt.label}</span><button type="button" class="copy" id="cpy">Copy</button></div><pre>${l.prompt.text.replace(/\[([^\]]+)\]/g,'<span class="v">[$1]</span>')}</pre></div>`;
  const _dmv=ST.data['dm-'+l.id];
  const dmDone=!l.demo||_dmv==='done'||ST.done[l.id];
  if(l.demo&&!dmDone){
    const k=(typeof _dmv==='number')?_dmv:0;
    h+=`<div class="demo"><div class="dh3"><span class="dt">🎬 Watch one first: a worked example</span><button type="button" class="dskip" id="dmskip">Skip: I’ve got it</button></div>
      <div class="deg">${l.demo.eg}</div>
      ${l.demo.steps.slice(0,k).map((s,i)=>`<div class="dstep"><span class="dnum">${i+1}</span><span>${s}</span></div>`).join("")}
      <button type="button" class="act-btn" id="dmnext">${k===0?'Show me the thinking →':(k<l.demo.steps.length?'Next →':'Your turn →')}</button></div>`;
  } else {
    if(l.demo){
      h+=`<button type="button" class="demo-re" id="dmre">🎬 ${ST.data['dm-re-'+l.id]?'Hide':'Rewatch'} the worked example</button>`;
      if(ST.data['dm-re-'+l.id])h+=`<div class="demo"><div class="deg">${l.demo.eg}</div>${l.demo.steps.map((s,i)=>`<div class="dstep"><span class="dnum">${i+1}</span><span>${s}</span></div>`).join("")}</div>`;
    }
    h+=actHtml(l);
  }
  if(_hasWork) h+=`</section>`;
  if(l.transition&&ST.done[l.id])h+=transition(typeof l.transition==='function'?l.transition():l.transition);
  h+=`<div class="nav-btns"><button type="button" class="btn" id="prevb" ${prev?'':'disabled'}>← Back</button>
      <button type="button" class="btn primary" id="nextb">${next?'Next →':'Finish'}</button></div>
      <div class="locknote" id="locknote" style="display:none">Complete the activity to continue.</div>`;
  document.getElementById("content").innerHTML=h;
  document.body.dataset.day=String(l._day||1);
  // cross-package safety: Day 2-4 opened without a primary set
  if((DAY==="1"||DAY==="2"||DAY==="3"||DAY==="4") && !ST.track){
    const host=document.getElementById("content");
    const bar=document.createElement("div");
    bar.className="box rule"; bar.style.marginBottom="14px";
    bar.innerHTML='<span class="bh">Confirm your project to continue</span><p class="tight">This unit builds on the project you chose at the start of Unit 1. Confirm it so your work stays consistent:</p><div class="track-pick" id="reconf">'+CASE_ORDER.map(id=>`<button type="button" class="tcard" data-t="${id}"><span class="tcd">${CASES[id].tag}</span><div class="tcp">${CASES[id].domain}</div></button>`).join("")+'</div>';
    host.insertBefore(bar, host.firstChild);
    bar.querySelectorAll("#reconf .tcard").forEach(b=>b.onclick=()=>{ST.track=b.dataset.t;remember("track",CASES[b.dataset.t].domain);persist();const _m=document.querySelector("main");render._sy=_m?_m.scrollTop:0;render(true);});
  }
  { const _m=document.querySelector("main");
    const _same = render._last === ST.current;
    if(_m && (keepScroll || _same)){ const _y=render._sy||0; requestAnimationFrame(()=>{ _m.scrollTop=_y; }); }
    else if(_m){ _m.scrollTop=0; }
    render._last = ST.current; }
  try{ const _cp=document.getElementById("cpy");
    if(l.prompt&&_cp)_cp.onclick=function(){navigator.clipboard.writeText(l.prompt.text).then(()=>{this.textContent="Copied ✓";this.classList.add("ok");setTimeout(()=>{this.textContent="Copy";this.classList.remove("ok");},1500);});};
  }catch(e){ console.warn("copy button:",e); }
  try{ document.querySelectorAll(".glink").forEach(g=>{ if(!g.dataset.g) return; g.onclick=()=>openGuide(g.dataset.g); }); }catch(e){ console.warn("guide links:",e); }
  try{
  const dmn=document.getElementById("dmnext");
  if(dmn)dmn.onclick=()=>{
    const v=ST.data['dm-'+l.id];const k=(typeof v==='number')?v:0;
    const _m=document.querySelector("main"); render._sy=_m?_m.scrollTop:0;
    ST.data['dm-'+l.id]=k<l.demo.steps.length?k+1:'done';persist();render(true);
  };
  const dms=document.getElementById("dmskip");
  if(dms)dms.onclick=()=>{const _m=document.querySelector("main"); render._sy=_m?_m.scrollTop:0; ST.data['dm-'+l.id]='done';persist();render(true);};
  const dmr=document.getElementById("dmre");
  if(dmr)dmr.onclick=()=>{ST.data['dm-re-'+l.id]=!ST.data['dm-re-'+l.id];render();};
  }catch(e){ console.warn("demo stepper:",e); }
  if(dmDone){
    wire(l);
    paintResult(l);
  }
  if(prev)document.getElementById("prevb").onclick=()=>{ST.current=prev.id;render();};
  updateRing();refreshNav();
}


/* ---------- interactive diagrams ---------- */
function diagTap(t){
  const hot=t.closest?t.closest('.hot'):null;if(!hot)return;
  const diag=hot.closest('.diag, .pwrap');if(!diag)return;
  diag.querySelectorAll('.hot.sel').forEach(x=>x.classList.remove('sel'));
  hot.classList.add('sel');
  const cap=diag.querySelector('.dcap');
  if(cap)cap.innerHTML='<b>'+(hot.dataset.name||'')+'</b>: '+(hot.dataset.info||'');
}
document.addEventListener('click',e=>diagTap(e.target));
document.addEventListener('keydown',e=>{
  if((e.key==='Enter'||e.key===' ')&&e.target.classList&&e.target.classList.contains('hot')){e.preventDefault();diagTap(e.target);}
});

window.addEventListener("error",e=>{
  try{
    console.error("PD Onboarding error:", e.message, e.filename+":"+e.lineno);
    let n=document.getElementById("errnote");
    if(!n){ n=document.createElement("div"); n.id="errnote";
      n.style.cssText="position:fixed;bottom:12px;left:12px;right:12px;z-index:99999;background:#fdecea;border:1.5px solid #c0392b;color:#7a2018;font:12px Arial;padding:9px 12px;border-radius:8px";
      document.body.appendChild(n); }
    n.textContent="Something on this page failed to load: "+e.message+". Please send this message to the course owner.";
  }catch(_){}
});
const BUILD="b0825-1730";
window.addEventListener("load",()=>{try{console.log("PD Onboarding build "+BUILD);}catch(e){}SCORM.init();load();render();renderGuide();
  if(SCORM.storageAvailable===false){
    const c=document.getElementById("content");
    if(c){const w=document.createElement("div");w.className="box rule";w.style.marginBottom="14px";
      w.innerHTML='<span class="bh">Progress will not save</span><p class="tight">This browser is blocking local storage, so your place in the course cannot be remembered. You can still work through everything, but closing the tab will lose your progress. Opening the course in a normal (non-private) window usually fixes it.</p>';
      c.insertBefore(w,c.firstChild);}
  }

});
window.addEventListener("pagehide",()=>{persist();SCORM.finish();});
window.addEventListener("beforeunload",()=>{persist();SCORM.finish();});

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
