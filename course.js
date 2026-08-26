/* course.js - the single source of truth for all lesson content.
   Edited once; unit1-4.html all load this file. Do not duplicate lessons. */
function gl(id,txt){return '<span class="glink" data-g="'+id+'">'+txt+'</span>';}

/* ================= COURSE ================= */
/* ============================================================
   v3: RECURRING DOMAIN CASE FILES (two live tracks: IT, SWE)
   Based on REAL shipped Per Scholas products:
     • IT Support: blended CompTIA third-party content + own content
     • Software Engineering: MERN stack, own content
   ⚠ PLACEHOLDER (needs PD validation): UCI numbers, exact module names,
     job titles, starter-objective wording, AI-misuse & change specifics.
   ============================================================ */
const CASES = {
  itsupport: {
    id:"itsupport", domain:"IT Support", tag:"IT",
    accent:"#35618c",
    project:"IT Support · UCI 10## (re-run, new cohort)", ph_project:true,
    productType:"Existing immersive: blended vendor + own content",
    role:"Help Desk / Service Desk Technician", ph_role:true,
    audience:"Entry-level IT support; ticket workflow + virtual labs",
    content:"Blended: CompTIA third-party content (knowledge/cert) + Per Scholas own content (job performance)",
    request:"Stand up an existing IT Support course for a new cohort, keeping the CompTIA blend but making sure independent job-performance evidence is covered by our own content.",
    gate:"Design Readiness",
    stakeholders:"ID&D Director, IT Product Developer, CompTIA/vendor liaison, QA, delivery site",
    tensions:[
      "CompTIA content covers knowledge & cert prep, not all on-the-job performance",
      "Learners must show individual troubleshooting ability, beyond vendor quizzes",
      "The line between vendor-owned and Per-Scholas-owned content must stay clear",
      "The Workplace Simulation must connect lessons, not decorate them"],
    package:{
      overview:"present", specs:"present",
      jd:"present",
      tech:"present: virtual environment & ticketing platform confirmed",
      notes:"present, but the plan leans on CompTIA quizzes for evidence; independent performance evidence is thin"},
    readiness:"constraints", // proceed, but the performance-evidence gap must be owned before Development Review
    readinessGap:"Independent job-performance evidence relies on vendor quizzes; our own SBA/performance task must fill the gap.",
    uci:"nochange", // existing course, new cohort/site = no new UCI, no revision
    module:"Module ##: Hardware & OS Troubleshooting", ph_module:true,
    objectiveDraft:"Know how to troubleshoot common issues and understand the ticket system, escalating when needed.", ph_obj:true,
    objectiveFixed:"Given a service-desk ticket, diagnose the hardware or OS fault, resolve or escalate it per policy, and document the resolution in the knowledge base.",
    repoFiles:["MBP ##: blueprint","Lesson ##.1","Troubleshooting GLAB ##.1.1","Ticket activity ##.1","KBA ## (own content)","SBA ## (own content)","FG ##"],
    perfTask:"A ticket-driven troubleshooting lab in the virtual environment, ending in a knowledge-base write-up",
    a11y:"Uncaptioned troubleshooting demo video; ticket-interface screenshots without alt text",
    fgGap:"No guidance for instructors on managing multiple valid troubleshooting paths",
    aiDraft:"AI-generated troubleshooting steps: an overconfident single diagnosis, one risky command, and weak escalation guidance", ph_ai:true,
    change:"CompTIA retires/updates a module the course maps to, affecting two of our modules", ph_change:true,
    vendorNote:"Where CompTIA owns the content, we map & supplement. We don't rewrite it; our own content carries the performance evidence."
  },
  software: {
    id:"software", domain:"Software Engineering", tag:"SWE",
    accent:"#0f7490",
    project:"Software Engineering (MERN) · UCI 20## ", ph_project:true,
    productType:"Immersive, Per Scholas own content, full-stack",
    role:"Junior Full-Stack (MERN) Developer", ph_role:true,
    audience:"Entry-level developers; team-based full-stack work",
    content:"Per Scholas own content end to end. MongoDB, Express, React, Node",
    request:"Build/maintain our own MERN full-stack program so graduates can work on a development team and show individual competence inside team projects.",
    gate:"Design Readiness",
    stakeholders:"ID&D Director, SWE Product Developer, QA (no external vendor. Content is all ours)",
    tensions:[
      "It's all our own content. Every objective, assessment & lab is ours to get right",
      "Full-stack MERN spans four technologies; sequencing & scope must stay coherent",
      "Team projects can hide individual competence. Individual evidence is the hard problem",
      "AI-assisted coding must preserve learner judgment and verification"],
    package:{
      overview:"present", specs:"present",
      jd:"present: emphasizes Git workflow, REST APIs, React components, debugging, code review",
      tech:"present: coding environment & repo workflow confirmed",
      notes:"n/a. Internal build, our own content (no external client transcript)"},
    readiness:"ready", // our content, package complete, but individual-evidence design must be verified at Development Review
    readinessGap:"Package is complete; the open design risk is ensuring individual evidence exists inside team-based MERN projects.",
    uci:"new", // treat as our own product line
    module:"Module ##: REST APIs with Express & Node", ph_module:true,
    objectiveDraft:"Understand how to build APIs and use Git in a team.", ph_obj:true,
    objectiveFixed:"Given a feature spec, implement a documented REST endpoint in Express, and submit it as a reviewed pull request on the team repo.",
    repoFiles:["MBP ##: blueprint","Lesson ##.1","ALAB ##.1.1 (build a REST endpoint)","Code-review check ##.1","SBA ## (individual)","Rubric ##","FG ##"],
    perfTask:"An individual REST-endpoint build submitted as a reviewed pull request on the team repo",
    a11y:"Code samples distinguished by color only; IDE screenshots without alt text or described output",
    fgGap:"No guidance on assessing individual contribution inside a shared team repository",
    aiDraft:"AI-generated Express example using a deprecated middleware pattern and an unvalidated request body (injection risk)", ph_ai:true,
    change:"A core dependency ships a breaking major version mid-build, affecting the API modules", ph_change:true,
    vendorNote:"No vendor content. Everything is ours, which means everything is our responsibility to verify."
  }
};
const CASE_ORDER = ["itsupport","software"];

/* ---------- v3: decision memory ---------- */

/* ST.track = chosen primary case id; ST.mem = decisions that carry forward */
function primary(){ return CASES[ST.track] || null; }
function repoGoals(a){
  if(a.goalsFromCase){ const c=primary(); if(c) return c.repoFiles.map(f=>({desc:f,match:f})); }
  return a.goals||[];
}
function remember(key,val){ ST.mem = ST.mem||{}; ST.mem[key]=val; persist(); }
function recall(key){ return (ST.mem||{})[key]; }
/* context frame: the standardized block from the brief §6 */
function frame(f){
  if(!f) return "";
  // A compact strip, not a metadata table. `now` is deliberately not rendered:
  // it restated the bridge directly above it on every lesson.
  const line=(k,t)=> t? `<p class="tl"><b>${k}</b>${t}</p>` : "";
  const body=line("Role",f.role)+line("Task",f.resp)+line("Rule",f.use);
  if(!body) return "";
  return `<div class="task">${body}${f.why?`<p class="tw">${f.why}</p>`:""}</div>`;
}
/* transition block that closes each activity (brief §12) */
function transition(t){
  if(!t) return "";
  return `<div class="ctrans"><span class="ct-h">→ Handoff</span><div>${t}</div></div>`;
}

const ALL=[
{day:1,mod:"1 · Welcome & intake",lessons:[
{id:"w00",title:"Welcome to Product Development",crumb:"Unit 1 · Welcome",
 frame:{now:"The first page of Unit 1. Nothing is graded, and nothing is assumed of you yet.",role:"You are new here, and this page exists to make the rest of the course make sense.",resp:"Read it, select through the four stages of the journey map, then tick the three checkpoints and confirm.",use:"Nothing yet. Every term this course needs is taught at the moment you first need it.",why:"The rest of the course assumes you know what Per Scholas builds and where your work lands in it."},
 mins:8,
 lead:"Welcome to the team. This page covers what Per Scholas builds, where your work sits inside it, and what the next few hours will ask of you.",
 coach:"Read top to bottom, <b>select through all four stages of the journey map</b>, then tick the three checkpoints and press Confirm. Nothing here is graded.",
 html:`<p><strong>Welcome to Product Development.</strong> You have joined the team that builds every course Per Scholas teaches, and we are glad you are here. This onboarding is the shortest route into how that work gets done.</p>
 <p>Per Scholas trains adults into technology careers at no cost to them, most shut out of tech by price or credentials. It works because the training is rigorous and shaped like the job, built to a standard on evidence.</p>
 <div class="ruleline"><b>What to expect.</b> Four units, roughly five hours, stopped and resumed whenever you like. Each teaches a short concept then hands you the real job: reading what Design sent, writing an objective, building a lab, answering QA. Nothing is graded, and wrong answers explain themselves. It ends with you planning a real module for your manager.</div>
 <p>Onboarding runs on two real Per Scholas courses: <strong>IT Support</strong>, which blends CompTIA content with our own, and <strong>MERN Software Engineering</strong>, which is ours end to end. The next page asks you to choose one. No vocabulary is assumed: every term is taught at the point you first need it.</p>
 <p><strong>Where our work sits in a learner’s life:</strong></p>
<div class="diag"><svg viewBox="0 0 720 158" role="img" aria-labelledby="dj-t"><title id="dj-t">The learner journey: select each stage to see where our work lives in it</title>
<line class="draw" x1="30" y1="58" x2="690" y2="58" stroke="#1d5fa8" stroke-width="2.5"/>
<g class="fdu hot" tabindex="0" role="button" aria-label="Admissions and prep" data-name="Admissions &amp; prep" data-info="Learners apply, assess, and get ready. Our Program Prerequisites doc defines what they need before day one: the journey touches our work before class even starts.">
<rect x="30" y="28" width="150" height="60" rx="10" fill="#fff" stroke="#e8e1d6" stroke-width="1.5"/><text x="105" y="53" text-anchor="middle" font-size="12.5" fill="#1c2b3a" font-weight="600">Admissions</text><text x="105" y="72" text-anchor="middle" font-size="10.5" fill="#5b6b7a">&amp; prep</text></g>
<g class="fdu hot" tabindex="0" role="button" style="animation-delay:.2s" aria-label="Immersive training" data-name="Immersive training" data-info="Weeks of full-time, hands-on training. Every lesson, lab, quiz, and graded project a learner touches here is Product Development's work: this stage IS our product.">
<rect x="200" y="20" width="180" height="76" rx="10" fill="#1d5fa8"/><text x="290" y="50" text-anchor="middle" font-size="13.5" fill="#fff" font-weight="700">Immersive training</text><text x="290" y="70" text-anchor="middle" font-size="10.5" fill="#cfe0ee">the part we build</text></g>
<g class="fdu hot" tabindex="0" role="button" style="animation-delay:.4s" aria-label="Career support" data-name="Career support" data-info="Coaching toward hiring. The Resume Skills doc and Mock Interview Guide the coaches use come out of the same course build. Deliverables you'll create.">
<rect x="400" y="28" width="150" height="60" rx="10" fill="#fff" stroke="#e8e1d6" stroke-width="1.5"/><text x="475" y="53" text-anchor="middle" font-size="12.5" fill="#1c2b3a" font-weight="600">Career support</text><text x="475" y="72" text-anchor="middle" font-size="10.5" fill="#5b6b7a">coaching → hiring</text></g>
<g class="fdu hot" tabindex="0" role="button" style="animation-delay:.6s" aria-label="Tech career and alumni" data-name="Tech career &amp; alumni" data-info="Graduates launch careers, and keep learning. The 3000-series alumni courses are ours too, so the relationship continues.">
<rect x="570" y="28" width="120" height="60" rx="10" fill="#fff" stroke="#e8e1d6" stroke-width="1.5"/><text x="630" y="53" text-anchor="middle" font-size="12.5" fill="#1c2b3a" font-weight="600">Tech career</text><text x="630" y="72" text-anchor="middle" font-size="10.5" fill="#5b6b7a">&amp; alumni</text></g>
<text class="fdu" style="animation-delay:.8s" x="360" y="128" text-anchor="middle" font-size="11" fill="#3f88c5">everything you build sits somewhere on this line, and most of it in the blue box</text>
</svg>
<div class="dcap">👆 <b>Select each stage</b> to see where Product Development’s work shows up in a learner’s life.</div></div>
 <div class="terms"><div class="th">🔤 How this course runs</div><dl>
 <dt>🧭 Coach bar</dt><dd>Sits above every activity and names the action to take. A Hint button waits beside it.</dd>
 <dt>📘 Handbook</dt><dd>Every term, rule, and template, one select away. Living source: the <a href="https://productops.perscholas.org/product-hub" target="_blank" rel="noopener" class="glink" style="cursor:pointer">Product Hub</a>.</dd>
 </dl></div>
 <table class="mtbl"><tr><th>Unit</th><th>What it settles</th></tr>
 <tr><td>1 · Welcome &amp; intake</td><td>The system: course structure, the seven pipeline steps, where every file belongs.</td></tr>
 <tr><td>2 · Planning</td><td>The decisions: objectives, module contents, a day of lessons, assessment evidence.</td></tr>
 <tr><td>3 · Building</td><td>The materials those decisions call for, held to our accessibility and AI standards.</td></tr>
 <tr><td>4 · Handoff</td><td>QA, the handover to the people who teach it, and the revision that follows.</td></tr></table>
 <p style="margin-top:4px"><strong>By the end of Unit 1 you’ll be able to:</strong></p>
 <ul class="obj"><li>Read any file ID like an address.</li><li>Walk a course through all seven pipeline steps.</li><li>Route an intake request and stage a module repo.</li></ul>
 <div class="ruleline"><b>The standing rule.</b> AI drafts, you decide. Every AI output is a proposal you verify, correct, and own, held to the same standard learners are graded on.</div>
 <div class="meta"><span class="mi">🔍</span><div><b>Design note:</b> mission, map, and mechanics came before any instruction. Orientation ahead of instruction is worth copying.</div></div>`,
 activity:{type:"commit",id:"w00c",items:["I clicked all four stages of the journey map","I know the 🧭 coach bar tells me what to do, and the 📘 Handbook (top right) holds every term and rule","I understand wrong answers explain themselves. This is for my learning, not a grade; the feedback is the point"]}},
{id:"pick",title:"Choose your primary project",crumb:"Unit 1 · Your project",mins:5,
 bridge:"The work from here is easier to follow in a domain you recognize, so the course runs on one of two example builds and you pick which.",
 lead:"Pick the domain you want to practice in. These are two of our real programs, used here as worked examples: nothing you do in this course reaches a live course or a cohort. Choose whichever sits closer to the work you were hired into, because familiar content makes the standards easier to see. You can change it later from the lessons menu.",
 frame:function(){return {
   prev:"The welcome page showed you both of the courses you can work in, and where our work sits in a learner journey.",
   now:"Two example domains. One of them carries every exercise from here.",
   role:"You are a developer learning the standards, working in whichever domain you read most fluently.",
   resp:"Pick the domain closest to the work you were hired into. It is a practice setting, not an assignment.",
   use:"The two project descriptions below. The ☰ Lessons menu, top left, shows where you are, what is left, and which project is currently selected.",
   why:"Every later exercise runs in the domain you pick, so the standards land against content you already recognize instead of content you have to learn first.",
   next:"You stage this module repo at the end of Unit 1, design it in Unit 2, and build it in Unit 3."
 };},
 html:`<p>Both are real Per Scholas programs, used here as worked examples. Nothing you do in this course touches either of them. Pick whichever sits closest to the domain you will actually build for:</p>`,
 coach:"<b>Select a card</b> to set your practice domain. You can reopen both case files from the ☰ Lessons menu, top left, where the project switcher lives. This only decides which one your hands-on work uses, and you can change it before you continue.",
 activity:{type:"track",id:"pickt",points:5}},
{id:"w0",title:"Why we build the way we do",crumb:"Unit 1 · Why we build this way",
 bridge:"The project is chosen. The standards come next, and before them the beliefs they rest on, because a rule you understand is one you can still apply when the situation is not in the book.",
 frame:{now:"Before any standard, the beliefs the standards rest on.",role:"You are setting your own starting position.",resp:"Write a short answer to each prompt. Model answers appear once you commit yours, so answer first.",why:"A rule you understand is one you can still apply when the situation is not in the book."},
 mins:7,
 lead:"Every standard in this course comes from a few beliefs about how adults learn. Those beliefs come first, because the standards make more sense once you know what they are for.",
 coach:"Read the five principles and the four commitments below, then <b>type a short answer in the box</b> and press Save. Model answers appear only after you save, so answer first.",
 html:`<p><strong>Who we serve.</strong> Per Scholas trains adults excluded from technology careers, at no cost, against what employers hire for. Learners arrive with jobs, families, and fifteen weeks riding on the outcome, which is the design constraint behind everything you build.</p>
 <p><strong>What we make.</strong> Product Development builds the courses across IT support, networking, cybersecurity, cloud, software engineering, and data, and it designs them for andragogy. Five principles govern every material decision:</p>
 <div class="pcards-v"><div class="pcard-v"><div class="pcard-h">Relevance first</div><div class="pcard-b">Adults need the why before the what. Every lesson opens by stating its purpose.</div></div><div class="pcard-v"><div class="pcard-h">Experience counts</div><div class="pcard-b">Strong activities put the careers learners already have to work.</div></div><div class="pcard-v"><div class="pcard-h">Self-direction</div><div class="pcard-b">Adults steer their own learning, so we build in choices and reference tools.</div></div><div class="pcard-v"><div class="pcard-h">Problem-centered</div><div class="pcard-b">The classroom mirrors the job, which is why this course runs on simulations.</div></div><div class="pcard-v"><div class="pcard-h">Internal motivation</div><div class="pcard-b">Career change is internally driven. We answer it with real stakes and no busywork.</div></div></div>
 <p style="margin-top:14px">Those five principles become four house commitments, stated in full in ${gl('philosophy','our philosophy')}:</p>
 <ul class="cl"><li><b>Learning by doing.</b> Skill comes from performing, not from watching.</li><li><b>At least 75 percent activated learning</b> in every lesson.</li><li><b>Backward design.</b> Outcomes and evidence before content, always.</li><li><b>AI inside real work,</b> because graduates are expected to use it on the job, transparently.</li></ul>
 <div class="ruleline"><b>The 75 percent rule is not a house preference.</b> Students in lecture-only courses fail at about 1.5 times the rate of those in active classrooms <span style="color:var(--muted)">(Freeman et al, 2014)</span>. Watching somebody troubleshoot a ticket proves nothing about the watcher.</div>
 <p><strong>What only a person can do.</strong> A tool can produce a lesson that looks finished. It cannot know that someone changing careers at forty needs an early win before the doubt sets in. Those calls are judgments about people.</p>
 <div class="diag"><svg viewBox="0 0 720 176" role="img" aria-labelledby="coa-t"><title id="coa-t">Where AI helps and where human judgment is required when building curriculum</title>
  <rect x="14" y="16" width="330" height="146" rx="12" fill="#f3f0ea" stroke="#e8e1d6" stroke-width="1.5"/>
  <rect x="376" y="16" width="330" height="146" rx="12" fill="#e3edf8" stroke="#1d5fa8" stroke-width="2"/>
  <text x="179" y="42" text-anchor="middle" font-size="12.5" font-weight="700" fill="#5a6b7b">AI CAN DRAFT</text>
  <text x="541" y="42" text-anchor="middle" font-size="12.5" font-weight="700" fill="#164a85">YOU HAVE TO DECIDE</text>
  <text x="179" y="68" text-anchor="middle" font-size="11.5" fill="#42566a">First-pass wording</text>
  <text x="179" y="88" text-anchor="middle" font-size="11.5" fill="#42566a">Structure to react to</text>
  <text x="179" y="108" text-anchor="middle" font-size="11.5" fill="#42566a">Variations of an example</text>
  <text x="179" y="128" text-anchor="middle" font-size="11.5" fill="#42566a">Boilerplate and formatting</text>
  <text x="541" y="68" text-anchor="middle" font-size="11.5" fill="#1c2b3a">Whether it is true</text>
  <text x="541" y="88" text-anchor="middle" font-size="11.5" fill="#1c2b3a">Whether these learners can use it</text>
  <text x="541" y="108" text-anchor="middle" font-size="11.5" fill="#1c2b3a">What to cut when time runs out</text>
  <text x="541" y="128" text-anchor="middle" font-size="11.5" fill="#1c2b3a">What counts as ready for the job</text>
  <text x="541" y="148" text-anchor="middle" font-size="11.5" fill="#1c2b3a">Whose name is on it</text>
 </svg>
<div class="dcap">AI drafts the left column. Every line on the right is yours.</div></div>
 <div class="video"><iframe src="https://www.youtube.com/embed/rhgwIhB58PA" title="Veritasium: The Biggest Myth in Education" loading="lazy" allowfullscreen></iframe></div><div class="vidcap">🎯 <b>Watch task, 14 minutes.</b> Veritasium tests whether teaching to a preferred learning style improves anything, and finds it does not. Watch what he replaces it with: evidence of what the learner can do. That is the move our objectives make. (<a href="https://www.youtube.com/watch?v=rhgwIhB58PA" target="_blank" rel="noopener">Open on YouTube</a>)</div>
 <p>Co-authorship is the standard. Reach a draft faster with AI, then correct what it got wrong about your learners, and own what ships.</p>`,
 activity:{type:"journal",id:"w0j",fields:[
  {label:"Warm-up: what drew you to building learning for career-changers, and which of the five principles is closest to how you already work?",ph:"Honestly…"}],modelHead:"What those five principles commit us to, now that you have written your answer",model:`<p class="tight">Learning by doing: skill comes from performing, not from watching someone perform. At least 75 percent activated learning in every lesson. Backward design: decide the evidence first, then build toward it. Scaffolding that fades, so guided work gives way to independent work. And assessment that produces evidence rather than a completion tick.</p><p class="tight">Those commitments are what the five principles above turn into in practice: relevance and problem-centered design become learning by doing, self-direction becomes scaffolding that fades, and internal motivation is why the evidence has to be real rather than a completion tick. Whichever principle you picked, one of these commitments is how we act on it.</p>`}},
{id:"wj",title:"The job, defined",crumb:"Unit 1 · The job",
 bridge:"The principles are on the table. What is left to settle before the work starts is the work itself: which parts of a course are ours to make, and where Delivery takes over.",
 frame:{now:"Four responsibilities make up this job, and one boundary marks where it ends.",role:"You are working out which parts of a course are ours to make.",resp:"Stamp each responsibility ours or not ours, then read the verdict against your reasoning.",use:"The roles section of the Handbook, and the template library it points to.",why:"Both sides fail when the line blurs. If we assume Delivery will fill gaps, the guide ships thin."},
 mins:8,
 lead:"Curriculum development here covers four responsibilities, and one boundary marks where our work ends and Delivery’s begins.",
 demo:{eg:"“Deciding which assessments close module 2, and writing their rubrics.”",steps:["First question I always ask: does this shape what a learner <em>experiences</em>, or how we <em>know it worked</em>? Assessments and rubrics are the definition of ‘how we know.’","Second: is anyone else’s lane closer? Delivery teaches the class; Design scopes the outline. Designing evidence sits squarely with us, under Measurement.","Verdict: ✓ Approve, ours. Take the queue with the same two questions on every statement."]},
 coach:"Read the four responsibilities and the boundary below. <b>The queue only asks about what is on this page.</b> Each statement gets one of two stamps. <b>✓ Approve</b> means <b>“yes, this is our job”</b>; <b>✗ Send back</b> means <b>“no, this belongs to another team”</b>. When you send one back, a short list of reasons appears; pick the one that says <em>whose</em> job it actually is.",
 hint:"The test for “our job”: does it shape what a learner experiences, or how we know it worked? Designing evidence, writing materials, improving from feedback, ours. Building the Canvas course and running the live classroom belong to others in the delivery stage.",
 html:`<div class="terms"><div class="th">🔤 What this job covers</div><dl>
 <dt>Architecture</dt><dd>Deciding outcomes and the evidence that proves them, before content exists. Artifacts: outlines, objectives, assessment plans.</dd>
 <dt>Authorship</dt><dd>Writing what learners touch: lessons, labs, assessments, guides. Artifacts: the materials in the repo.</dd>
 <dt>Measurement</dt><dd>Rubrics, module assessments, and the data that says a course worked. Artifacts: assessments and their results.</dd>
 <dt>Stewardship</dt><dd>Improving courses cohort after cohort from real feedback. Artifact: the revision, the .1 on a course ID.</dd></dl></div>
 <div class="ruleline"><b>The boundary,</b> in one line: Product Development builds everything about a course except the live classroom.</div>
 <p>We design the outcomes, write the materials, build the assessments, and produce what an instructor needs in order to teach it. Delivery runs it with learners. Both sides fail when the line blurs. Assume Delivery will fill the gaps and the guide ships thin. Script the classroom and the instructor loses judgment.</p>
 <div class="diag"><svg viewBox="0 0 720 250" role="img" aria-labelledby="wjb-t"><title id="wjb-t">Design sets the objectives, Development decides how they are met, and the delivery stage covers both building the Canvas course and teaching it</title>
 <rect x="14" y="14" width="216" height="222" rx="12" fill="#f3f0ea" stroke="#e8e1d6" stroke-width="1.5"/>
 <rect x="246" y="14" width="216" height="222" rx="12" fill="#e3edf8" stroke="#1d5fa8" stroke-width="2"/>
 <rect x="478" y="14" width="228" height="222" rx="12" fill="#f3f0ea" stroke="#e8e1d6" stroke-width="1.5"/>
 <text x="122" y="38" text-anchor="middle" font-size="12.5" font-weight="700" fill="#5a6b7b">DESIGN STAGE</text>
 <text x="354" y="38" text-anchor="middle" font-size="12.5" font-weight="700" fill="#164a85">DEVELOPMENT STAGE</text>
 <text x="592" y="38" text-anchor="middle" font-size="12.5" font-weight="700" fill="#5a6b7b">DELIVERY STAGE</text>
 <text x="122" y="54" text-anchor="middle" font-size="9.5" fill="#8a97a4">Design team, with us</text>
 <text x="354" y="54" text-anchor="middle" font-size="9.5" fill="#4a7fb5">us</text>
 <text x="592" y="54" text-anchor="middle" font-size="9.5" fill="#8a97a4">three different groups</text>
 <text x="122" y="82" text-anchor="middle" font-size="11.5" fill="#42566a">Module outcomes</text>
 <text x="122" y="100" text-anchor="middle" font-size="11.5" fill="#42566a">Module objectives</text>
 <text x="122" y="118" text-anchor="middle" font-size="11.5" fill="#42566a">Key topics</text>
 <text x="122" y="136" text-anchor="middle" font-size="11.5" fill="#42566a">New course or revision</text>
 <text x="354" y="82" text-anchor="middle" font-size="11.5" fill="#1c2b3a">Lesson objectives</text>
 <text x="354" y="100" text-anchor="middle" font-size="11.5" fill="#1c2b3a">Activities and labs</text>
 <text x="354" y="118" text-anchor="middle" font-size="11.5" fill="#1c2b3a">Assessments and rubrics</text>
 <text x="354" y="136" text-anchor="middle" font-size="11.5" fill="#1c2b3a">Technology and sequence</text>
 <text x="354" y="154" text-anchor="middle" font-size="11.5" fill="#1c2b3a">Facilitator guide</text>
 <line x1="490" y1="70" x2="694" y2="70" stroke="#e0d8c8" stroke-width="1"/>
 <text x="496" y="86" font-size="10" font-weight="700" fill="#8a6a00">Canvas team</text>
 <text x="496" y="102" font-size="11" fill="#42566a">Builds the course in Canvas</text>
 <line x1="490" y1="114" x2="694" y2="114" stroke="#e0d8c8" stroke-width="1"/>
 <text x="496" y="130" font-size="10" font-weight="700" fill="#8a6a00">Instructors</text>
 <text x="496" y="146" font-size="11" fill="#42566a">Teach the cohort</text>
 <text x="496" y="162" font-size="11" fill="#42566a">Grade learner work</text>
 <text x="496" y="178" font-size="11" fill="#42566a">Classroom decisions</text>
 <line x1="490" y1="190" x2="694" y2="190" stroke="#e0d8c8" stroke-width="1"/>
 <text x="496" y="206" font-size="10" font-weight="700" fill="#164a85">Us, with IDQA</text>
 <text x="496" y="222" font-size="11" fill="#42566a">Instructor training</text>
 <line x1="230" y1="120" x2="244" y2="120" stroke="#1d5fa8" stroke-width="2"/><polygon points="244,120 238,116 238,124" fill="#1d5fa8"/>
 <line x1="462" y1="120" x2="476" y2="120" stroke="#1d5fa8" stroke-width="2"/><polygon points="476,120 470,116 470,124" fill="#1d5fa8"/>
</svg>
<div class="dcap">Three stages, not three teams. The delivery stage alone involves three groups, and one of them is us. <b>IDQA</b> is Instructional Design &amp; Quality Assurance, the team we work with so instructors learn the content before they teach it.</div></div>
 <p><strong>Delivery</strong> and <strong>planning</strong> each name two things here, and mixing them up misfiles the work.</p>
 <div class="vs"><div class="a"><div class="vh">The delivery stage</div><p>A phase of the pipeline. Three groups work inside it: the Canvas team builds the course, instructors teach it, and we run instructor training with IDQA.</p></div><div class="b"><div class="vh">The Delivery team</div><p>Narrower than the stage. Most call them the Canvas team, and building the Canvas course is what they do. None of the folders in our shared drive are theirs.</p></div></div>
 <div class="vs"><div class="a"><div class="vh">Planning, in our pipeline</div><p>Development plans the build: how to reach the objectives, in what order, with which activities and tools. Decisions rather than content.</p></div><div class="b"><div class="vh">Planning, at Design</div><p>Design plans the package: what the course is, what learners must be able to do, and what the outline contains.</p></div></div>
 <div class="meta"><span class="mi">🔍</span><div><b>Design note:</b> teach, then assess. This queue only tests what this page taught. Do not assess learners on material they have not been given.</div></div>
 <p class="tight" style="color:var(--muted)">Every artifact named above has a template in ${gl('templates','the Handbook')}.</p>`,
 activity:{type:"review",id:"w00r",points:12,queueTag:"Unit 1 · is this our job?",
  labels:{yes:"✓ Ours",no:"✗ Not ours",
    missYes:"✗ Look again: this one belongs to another team.",
    missNo:"✗ This one is ours. Re-read the four responsibilities before deciding.",
    reasonPrompt:"Right, not ours. Now say why:"},
  items:[
   {content:"Deciding what evidence proves a learner can actually do the job, before writing any content.",
    good:true,
    why:"✓ Ours. This is the architecture face. Outcomes and evidence come first; you will apply it as backward design in Unit 2.",
    reasons:[]},
   {content:"Standing in front of a cohort and teaching the course live, week by week.",
    good:false,
    why:"✗ Not ours. Instructors teach the cohorts. Note that this is not the Canvas team either: they build the course, instructors run it. We make the teaching possible through facilitator guides, blueprints, and working with IDQA so instructors can upskill on the content first. Building the handoff is our job; the classroom is the instructor's.",
    reasons:[
     {t:"Live instruction belongs to instructors, and the Canvas build to the Canvas team. Our job is making the course runnable without us, through guides, blueprints, and working with IDQA so instructors can upskill",ok:true,fb:""},
     {t:"Teaching is beneath the Product Development team",fb:"Nothing beneath anyone. It's a division of craft, not status. Delivery are experts at the classroom; we're experts at what goes into it."},
     {t:"We do teach, but only the first cohort",fb:"Not even the first. If a course needs its author in the room to work, the facilitator guide failed QA."}]},
   {content:"Writing the labs, assessments, and rubrics learners will work through.",
    good:true,
    why:"✓ Ours. Authorship and measurement, the two faces you'll practice most. Every lab, quiz, and rubric in a course comes from this team.",
    reasons:[]},
   {content:"Making the slides look impressive, since polish is what makes a course good.",
    good:false,
    why:"✗ Sent back, polish serves learning; it isn't learning. A course is good when learners can do the job afterward, which is why we design evidence first and check activated-learning time, not slide beauty.",
    reasons:[
     {t:"Polish is in service of learning outcomes, not a substitute for them. Quality here means evidence, not aesthetics",ok:true,fb:""},
     {t:"Slides are banned at Per Scholas",fb:"Slides are fine. There's a house template for them. The error is treating polish as the measure of quality."},
     {t:"Impressive slides are actually the most important deliverable",fb:"The most important deliverables are the ones that prove learning: assessments, rubrics, labs. Slides carry content to them."}]},
   {content:"Deciding the module\u2019s outcomes and objectives, and which topics the course covers.",
    good:false,
    why:"\u2717 Not ours. Design sets the module outcomes and objectives and hands them over in the outline. We can send one back if it is not measurable enough to build an assessment from, but we do not author it.",
    reasons:[]},
   {content:"Choosing which activities, assessments, and tools get learners to those objectives.",
    good:true,
    why:"\u2713 Ours. Design says what learners must be able to do. How they get there is our call: the activities, the assessments, the technology, and the order. Design may suggest an approach at a high level; we decide it.",
    reasons:[]},
   {content:"Deciding whether a client request becomes a new course or a revision of an existing one.",
    good:false,
    why:"\u2717 Not ours. That is Design\u2019s intake decision, and the course identifier comes with it. We read the classification and work out what it obligates us to build.",
    reasons:[]},
   {content:"Reading cohort feedback after a course runs and revising module 3 because learners struggled there.",
    good:true,
    why:"✓ Ours, stewardship, the fourth face. A shipped course isn't a finished course; evaluation feeding revision is literally step 7 of the pipeline you're about to walk.",
    reasons:[]}],
  fbGood:"Eight for eight. Those four responsibilities are the shape of the job: architect, author, measurer, steward.",
  fbBad:"Queue done: reread any verdicts you missed. The boundary to remember: we build everything about the course except the live classroom."}},
{id:"s0",title:"How a course is put together",crumb:"Unit 1 · Reading a file name",
 bridge:"A real build starts with a file name somebody can read. Every term on this page is one you will be creating for yourself before this unit is out.",
 frame:{now:"Every artifact in our system has a name that tells you what it is and where it sits.",role:"You are learning to read our file names before you have to write them.",resp:"Select each layer of the diagram, read the terms, then drag each ID card to its level.",use:"The glossary and the file naming sections of the Handbook.",why:"Every file you create for the rest of this course is named by this grammar, starting with the repo you stage in this unit."},
 mins:8,
 lead:"Course, module, lesson, and UCI all mean something specific here, and the rest of the course uses them constantly. This page defines each one before you meet it in real work.",
 coach:"<b>Select every layer of the diagram</b> to learn what it is, read the terms box, then <b>drag each ID card to its level</b>. Wrong drops bounce with an explanation.",
 hint:"Read the number like an address, right to left: 301.2.1 is item 1, of lesson 2, of module 301. Whole-course things (the UCI, the capstone) carry no module number at all; module-closers (KBA, blueprint) stop at the module number.",
 html:`<div class="diag"><svg viewBox="0 0 720 238" role="img" aria-labelledby="dan-t"><title id="dan-t">The anatomy of a course: select each layer</title>
<g class="fdu hot" tabindex="0" role="button" aria-label="Course level" data-name="Course" data-info="The full program a cohort takes, weeks long. Every course carries a UCI: a Unique Course Identifier, as its ID in every system we run. (The numbers on this diagram are a teaching example; your real projects carry their own.)">
<rect x="14" y="10" width="692" height="216" rx="12" fill="#fff" stroke="#1d5fa8" stroke-width="2"/><text x="30" y="34" font-size="13.5" font-weight="700" fill="#164a85">Course · example · UCI 10## </text></g>
<g class="fdu" style="animation-delay:.15s"><rect x="30" y="48" width="130" height="164" rx="9" fill="#f3eee6" stroke="#e8e1d6"/><text x="95" y="72" text-anchor="middle" font-size="12" fill="#8fa0ae">Module 300</text></g>
<g class="fdu hot" tabindex="0" role="button" style="animation-delay:.3s" aria-label="Module level" data-name="Module" data-info="A multi-week unit of the course. Numbered like 301. Every module closes with a summative assessment. A KBA (knowledge) and/or SBA (skill), and has its own blueprint (MBP), built alongside its content.">
<rect x="172" y="48" width="380" height="164" rx="9" fill="#e3edf8" stroke="#1d5fa8" stroke-width="2"/><text x="362" y="70" text-anchor="middle" font-size="12.5" font-weight="700" fill="#164a85">Module 301 — Hardware &amp; OS</text></g>
<g class="fdu" style="animation-delay:.45s"><rect x="564" y="48" width="130" height="164" rx="9" fill="#f3eee6" stroke="#e8e1d6"/><text x="629" y="72" text-anchor="middle" font-size="12" fill="#8fa0ae">Module 302</text></g>
<g class="fdu hot" tabindex="0" role="button" style="animation-delay:.55s" aria-label="Lesson level" data-name="Lesson" data-info="The daily unit inside a module. 301.2 reads as: module 301, lesson 2. Each lesson day runs on a rhythm: warm-up in, hands-on practice in the middle, exit ticket out.">
<rect x="190" y="84" width="164" height="52" rx="8" fill="#fff" stroke="#3f88c5" stroke-width="1.6"/><text x="272" y="106" text-anchor="middle" font-size="12" font-weight="600" fill="#1c2b3a">Lesson 301.1</text><text x="272" y="124" text-anchor="middle" font-size="10.5" fill="#5b6b7a">day one of the module</text></g>
<g class="fdu hot" tabindex="0" role="button" style="animation-delay:.65s" aria-label="Lesson 301.2" data-name="Lesson" data-info="The daily unit inside a module. 301.2 reads as: module 301, lesson 2. Each lesson day runs on a rhythm: warm-up in, hands-on practice in the middle, exit ticket out.">
<rect x="370" y="84" width="164" height="52" rx="8" fill="#fff" stroke="#3f88c5" stroke-width="1.6"/><text x="452" y="106" text-anchor="middle" font-size="12" font-weight="600" fill="#1c2b3a">Lesson 301.2</text><text x="452" y="124" text-anchor="middle" font-size="10.5" fill="#5b6b7a">day two</text></g>
<g class="fdu hot" tabindex="0" role="button" style="animation-delay:.8s" aria-label="Materials" data-name="Materials" data-info="What learners actually touch: GLAB 301.2.1 is a guided lab (step-by-step, hands-on): first lab of lesson 2. Quiz 301.2 checks that lesson. KBA 301 is the graded knowledge assessment closing the whole module. Note it carries no lesson number.">
<rect x="190" y="150" width="344" height="48" rx="8" fill="#fff" stroke="#e8e1d6"/><text x="362" y="170" text-anchor="middle" font-size="11.5" font-family="IBM Plex Mono, monospace" fill="#1c2b3a">GLAB 301.2.1 · Quiz 301.2 · KBA 301</text><text x="362" y="188" text-anchor="middle" font-size="10.5" fill="#5b6b7a">the materials, labs, quizzes, assessments</text></g>
</svg><div class="dcap">👆 <b>Select each layer</b>: course, module, lesson, materials. The numbers are the whole grammar: 301.2.1 = module 301 → lesson 2 → item 1.</div><div class="box info" style="margin-top:12px"><span class="bh">Course, module, lesson</span><ul class="blist"><li><b>Course</b>: the full program a cohort takes, weeks long. Every course carries a UCI (Unique Course Identifier), its ID in every system.</li><li><b>Module</b>: a multi-week unit of the course, numbered like 301. Every module closes with a summative assessment (a KBA for knowledge and/or SBA for skill) and has its own blueprint (MBP).</li><li><b>Lesson</b>: the daily unit inside a module. \u201C301.2\u201D reads as module 301, lesson 2. Each lesson day runs on a rhythm: warm-up in, hands-on practice in the middle, exit ticket out.</li></ul></div></div><div class="terms"><div class="th">🔤 Terms you will use constantly</div><dl><dt>UCI</dt><dd>Unique Course Identifier: a course’s ID number in every system (e.g. 1042). New course, new UCI; changed course, a decimal revision (e.g. 10##.1).</dd><dt>Outline</dt><dd>The course’s skeleton from the Design team: objectives, outcomes, and key topics. Every build starts from one.</dd><dt>Module</dt><dd>A multi-week unit (301). Closes with a graded assessment.</dd><dt>Lesson</dt><dd>A day of class inside a module (301.2).</dd><dt>KBA</dt><dd>Knowledge-Based Assessment: the graded quiz that closes a module. It measures what a learner <em>knows</em>.</dd><dt>SBA</dt><dd>Skill-Based Assessment: the graded performance task that closes a module. It measures what a learner can <em>do</em>. Both get planned in Unit 2, and you write one of each in Unit 3.</dd><dt>GLAB</dt><dd>Guided lab: a step-by-step, hands-on activity. Where most skill is actually built.</dd><dt>ALAB</dt><dd>Assignment lab: the learner drives from a problem instead of following steps. Always graded.</dd><dt>FG</dt><dd>Facilitator Guide: what an instructor teaches from. Unit 4 is where you review one before handoff.</dd><dt>MBP — Module Blueprint</dt><dd>The index of one module: every material, listed in delivery order and linked. Created during Developing, as soon as the module has content, then kept current as each file is built. One per module. QA and Delivery navigate by it.</dd><dt>Course Blueprint (CBP)</dt><dd>Assembled once the modules are built and put together: the index of every file Delivery adds to the Canvas course. One per course.</dd></dl></div><div class="meta"><span class="mi">🔍</span><div><b>Design note:</b> this lesson defines every term before the course uses it elsewhere. Do the same, so vocabulary supports learners instead of filtering them. Every term here also appears in the 📘 Handbook glossary, and the Product Hub holds the current source for anything that changes.</div></div>`,
 activity:{type:"sort",id:"s0s",points:12,
  buckets:[{k:"c",label:"Course level"},{k:"m",label:"Module level"},{k:"l",label:"Lesson level"}],
  cards:[
   {t:"UCI 10## (example)",k:"c"},
   {t:"Capstone (CAP)",k:"c"},
   {t:"KBA 301",k:"m"},
   {t:"MBP 301 — blueprint",k:"m"},
   {t:"Quiz 301.2",k:"l"},
   {t:"GLAB 301.2.1",k:"l"}],
  fbGood:"All correct. You can read any file name or ID in our system and tell what it is and where it belongs.",
  fbBad:"All sorted. Read the numbering right to left: item, lesson, module, course."}},
{id:"s1",title:"Walk a course through the pipeline",crumb:"Unit 1 · The seven steps",
 bridge:"File names are readable now. Seven pipeline steps produce them, and they tell you at any moment who is waiting on you.",
 frame:{now:"A new build has arrived, and it has seven steps to travel.",role:"You are the Product Developer carrying one build from request through to revision.",resp:"Make the call at each step. A wrong call explains itself and lets you try again, so this is practice rather than a test.",use:"The development process section of the Handbook if you get lost.",why:"Knowing which step you are standing in tells you what you owe next and who is waiting on it."},
 mins:12,
 lead:"A new build has arrived from the Design team. Carry it through all seven pipeline steps by making the right call at each one: the same path every project you will work on follows.",
 coach:"Read each scene, then <b>select the action you'd take</b>. A right call advances the tracker; a wrong one explains why and lets you try again. This is practice, not a graded test. The map is in the Handbook if you get lost.",
 hint:"Backward design is the thread: outcomes are defined before evidence, evidence before materials, and QA always stands between building and delivery.",
 html:`<div class="terms"><div class="th">🔤 Terms this walk introduces</div><dl><dt>ADDIE</dt><dd>Analysis, design, development, implementation, evaluation: the five phases our department is structured around. The seven steps below are how we run them.</dd><dt>Handoff</dt><dd>Design passing the finished outline to Product Development: step 1 of every build.</dd><dt>Charter</dt><dd>The project’s one-page agreement: scope, stakeholders, timeline. Written at Initiation.</dd><dt>Infrastructure request</dt><dd>Asking the infra team for environments (VMs, sandboxes), filed early, before any material assumes they exist.</dd><dt>Facilitator Guide</dt><dd>The instructor’s delivery companion: content breakdown, tips, troubleshooting. A required deliverable.</dd><dt>QA</dt><dd>Product Quality &amp; Experience reviewing everything against the standards before release.</dd><dt>Intake package</dt><dd>The five documents Development needs before accepting a handoff: the next-but-one lesson runs that check.</dd></dl></div><p><strong>Two models, doing two different jobs.</strong> The department is structured on <b>ADDIE</b>: analysis, design, development, implementation, evaluation. That is why our stages carry the names they do, and it is how work is divided between teams. <b>Backward design</b> is the method we use inside it: outcomes first, then the evidence that proves them, then the materials that get a learner there. ADDIE tells you which stage you are standing in. Backward design tells you what order to think in once you are there.</p>
 <p><strong>The seven steps, in one look:</strong> every product travels the same seven steps, and each step exists to make the next one cheaper. Problems caught at Planning cost minutes; the same problems at Delivery cost a launch.</p>
 ${''}`+`<div class="diag"><svg viewBox="0 0 720 100" role="img" aria-labelledby="dp-t"><title id="dp-t">The seven-step development pipeline: select a step for detail</title><line x1="40" y1="34" x2="680" y2="34" stroke="#e8e1d6" stroke-width="3"/><line class="draw" x1="40" y1="34" x2="680" y2="34" stroke="#1d5fa8" stroke-width="3"/><g class="fdu hot" tabindex="0" role="button" style="animation-delay:0.1s" aria-label="Handoff" data-name="Handoff" data-info="Design delivers objectives, outcomes, and key topics, your raw material."><circle cx="40" cy="34" r="13" fill="#fff" stroke="#1d5fa8" stroke-width="2.5"/><text x="40" y="38.5" text-anchor="middle" font-size="12" fill="#164a85">1</text><text x="40" y="70" text-anchor="middle" font-size="10.5" fill="#5b6b7a">Handoff</text></g><g class="fdu hot" tabindex="0" role="button" style="animation-delay:0.23s" aria-label="Initiation" data-name="Initiation" data-info="Project charter, intake call, infrastructure requests. 3–5 days that prevent weeks of rework."><circle cx="147" cy="34" r="13" fill="#fff" stroke="#1d5fa8" stroke-width="2.5"/><text x="147" y="38.5" text-anchor="middle" font-size="12" fill="#164a85">2</text><text x="147" y="70" text-anchor="middle" font-size="10.5" fill="#5b6b7a">Initiation</text></g><g class="fdu hot" tabindex="0" role="button" style="animation-delay:0.36s" aria-label="Planning" data-name="Planning" data-info="Outcomes → evidence → experiences. Backward design happens here, before any content exists."><circle cx="253" cy="34" r="13" fill="#fff" stroke="#1d5fa8" stroke-width="2.5"/><text x="253" y="38.5" text-anchor="middle" font-size="12" fill="#164a85">3</text><text x="253" y="70" text-anchor="middle" font-size="10.5" fill="#5b6b7a">Planning</text></g><g class="fdu hot" tabindex="0" role="button" style="animation-delay:0.49s" aria-label="Developing" data-name="Developing" data-info="Lessons, labs, assessments, rubrics, guides. The module blueprint starts here too, as soon as there is content. Duration is set per build by the ID&amp;D Director."><circle cx="360" cy="34" r="13" fill="#fff" stroke="#1d5fa8" stroke-width="2.5"/><text x="360" y="38.5" text-anchor="middle" font-size="12" fill="#164a85">4</text><text x="360" y="70" text-anchor="middle" font-size="10.5" fill="#5b6b7a">Developing</text></g><g class="fdu hot" tabindex="0" role="button" style="animation-delay:0.62s" aria-label="QA" data-name="QA" data-info="Module and course review; findings go back for fixes before anything ships."><circle cx="467" cy="34" r="13" fill="#fff" stroke="#1d5fa8" stroke-width="2.5"/><text x="467" y="38.5" text-anchor="middle" font-size="12" fill="#164a85">5</text><text x="467" y="70" text-anchor="middle" font-size="10.5" fill="#5b6b7a">QA</text></g><g class="fdu hot" tabindex="0" role="button" style="animation-delay:0.75s" aria-label="Delivery" data-name="Delivery" data-info="Handoff via the course blueprint, plus instructor training."><circle cx="573" cy="34" r="13" fill="#fff" stroke="#1d5fa8" stroke-width="2.5"/><text x="573" y="38.5" text-anchor="middle" font-size="12" fill="#164a85">6</text><text x="573" y="70" text-anchor="middle" font-size="10.5" fill="#5b6b7a">Delivery</text></g><g class="fdu hot" tabindex="0" role="button" style="animation-delay:0.88s" aria-label="Evaluate" data-name="Evaluate" data-info="Cohort feedback becomes the next revision's inputs, the loop closes."><circle cx="680" cy="34" r="13" fill="#fff" stroke="#1d5fa8" stroke-width="2.5"/><text x="680" y="38.5" text-anchor="middle" font-size="12" fill="#164a85">7</text><text x="680" y="70" text-anchor="middle" font-size="10.5" fill="#5b6b7a">Evaluate</text></g><path d="M 680 86 Q 360 108 46 88" fill="none" stroke="#3f88c5" stroke-width="1.6" stroke-dasharray="4 4"/><text x="360" y="94" text-anchor="middle" font-size="10" fill="#3f88c5">findings feed the next revision</text></svg><div class="dcap">👆 <b>Select any step</b> (or Tab + Enter) to see what happens there. Duration is set per build by the ID&amp;D Director.</div></div>`+`
 ${''}<p>Your job now: get this build from handoff to continuous improvement. Full detail: ${gl('process','the process map')}.</p>
 <div class="meta"><span class="mi">🔍</span><div><b>Design note:</b> the concept arrived as a diagram before you were asked to do anything. Concept, then visual, then practice is a sequence worth reusing.</div></div>`,
 activity:{type:"story",id:"s1s",points:14,
  steps:[
   {tag:"Step 1 of 7 · The outline arrives",text:"Design sends you the outline: objectives, outcomes, key topics. What happens first?",
    opts:[{t:"Start building slide decks: the outline tells us the topics.",fb:"Not yet. Building before initiation means no charter, no stakeholders, no infrastructure, and rework later."},
          {t:"Initiate: draft the project charter, schedule the intake call, flag any infrastructure needs.",ok:true,fb:"Right. Initiation sets the charter, the stakeholders, and the intake call before anything gets built."},
          {t:"Send it straight to QA to check the outline.",fb:"QA reviews built materials. An outline gets clarified at the intake call, not QA'd."}]},
   {tag:"Step 2 of 7 · The intake call",text:"On the intake call you learn the course needs a virtual lab environment learners can break and reset. What do you do with that?",
    opts:[{t:"Note it for later. Infrastructure can be sorted during development.",fb:"Dangerous. Discovering mid-build that the environment can't exist is the classic expensive failure."},
          {t:"Submit an infrastructure request to the infrastructure team now, during initiation.",ok:true,fb:"Exactly. Infrastructure requests belong in initiation, before a single material assumes an environment exists."},
          {t:"Change the design so no lab environment is needed.",fb:"You don't quietly redesign around a constraint, you surface it. The request goes in; design changes only if it can't be met."}]},
   {tag:"Step 3 of 7 · Planning",text:"Now you plan. Which order does planning follow?",
    opts:[{t:"Pick the content first, then figure out how to test it.",fb:"That's forward design: it produces content in search of a purpose. We work backward."},
          {t:"Define outcomes → define the assessment evidence and rubrics → then plan the learning experiences.",ok:true,fb:"Backward design: outcomes, then evidence, then instruction in service of both."},
          {t:"Start with the capstone and improvise the rest.",fb:"The capstone matters, but it's one piece of the evidence plan. Outcomes come first."}]},
   {tag:"Step 4 of 7 · Developing",text:"You're building module materials. A colleague suggests skipping facilitator guides \u201Csince instructors can wing it.\u201D",
    opts:[{t:"Agree. Guides are busywork.",fb:"Facilitator guides are a required deliverable: content breakdown, delivery detail, tips, troubleshooting. Instructors don't wing our courses."},
          {t:"Build the full deliverable set: lessons, labs, assessments, rubrics, facilitator guides, blueprints.",ok:true,fb:"That's the set. The blueprint links it all, and the facilitator guide is how your build survives contact with a classroom."},
          {t:"Build only what QA checks.",fb:"QA checks everything on the deliverables list, which is what the list is for."}]},
   {tag:"Step 5 of 7 · QA",text:"QA reviews module 3 and flags: a lab with no rubric, and a lesson that drifts off-objective. What now?",
    opts:[{t:"Fix both, resubmit to QA.",ok:true,fb:"Findings go back, get fixed, get re-checked. QA sign-off is what releases the course toward delivery."},
          {t:"Argue the lab doesn't need a rubric.",fb:"Every graded item carries a rubric. That's standard, not preference."},
          {t:"Ship it; instructors will catch problems live.",fb:"Problems caught in a live cohort cost a launch. Problems caught at QA cost an afternoon."}]},
   {tag:"Step 6 of 7 · Implementation",text:"QA has signed off. What does handing off to Delivery include?",
    opts:[{t:"Email a folder link. Done.",fb:"A link is not a handoff. Delivery builds the course in Canvas from the blueprint, and the instructors teaching it need to upskill on the content first."},
          {t:"Handoff via the course blueprint, then work with IDQA so instructors can upskill on the content, grading, and approach.",ok:true,fb:"Right. The blueprint is what Delivery builds the Canvas course from, and instructor readiness is part of the handoff rather than something that happens after it."},
          {t:"Personally teach the first cohort.",fb:"Tempting, but delivery is Delivery's lane. Your job is making them able to run it without you."}]},
   {tag:"Step 7 of 7 · After the cohort",text:"The first cohort finishes. Feedback shows learners struggled in module 3's labs. What's the move?",
    opts:[{t:"Nothing, the course shipped; it's done.",fb:"A shipped course isn't a finished course. Evaluation feeds revision. That's step 7 existing at all."},
          {t:"Analyze the feedback, update module 3, and log the change. The next revision starts with evidence.",ok:true,fb:"That's continuous improvement: feedback in, revision out, change logged. You've walked the whole pipeline."},
          {t:"Blame the instructor.",fb:"The data points at module 3's design. We follow evidence, not blame."}]}],
  fbGood:"The build went from outline to revision with you making every call. The full pipeline reference is in the Handbook.",
  fbBad:"You got the build through: review the steps you missed on the way; the map is in the Handbook."}},
{id:"sip",title:"Review what Design sent you",crumb:"Unit 1 · Readiness check",
 bridge:"The seven steps have been walked as a map. Step two arrives as a package from Design, and this is the first one you handle.",
 frame:function(){const c=primary()||{domain:"your course"};return {
  now:"Five packages for "+c.domain+" are waiting on your read.",
  role:"You are the developer on the receiving end of a handoff, reading as a colleague rather than a gatekeeper.",
  resp:"For each package, say whether you would raise anything with Design, and when you would, name what is missing and what it costs.",
  use:`The design-intake package in ${gl('process','the Handbook')}.`,
  why:"Design cannot fix what nobody names. A gap raised in week one costs a conversation; the same gap found in week six costs the build."};},
 mins:8,
 lead:function(){const c=primary()||{domain:"your course"};return "Design sends a package before anyone builds, and it is our job to read it and answer. Five have arrived for "+c.domain+". Some are complete, and in the rest something is missing that Design would want to know about.";},
 coach:`This is a conversation, not a gate. For each package: <b>select ✓ Nothing to raise</b> if it is complete enough to build from, or <b>✗ Raise it with Design</b> if it is not. Choosing to raise it then asks you to <b>name what is missing and what it costs</b>, which is the part that takes practice. A wrong call costs that one package and explains itself. The queue closes when all five carry an answer.`,
 hint:"Two questions sort every package. Is anything load-bearing missing, meaning something you would have to invent in order to start? And if it is missing, can work begin anyway while somebody owns the gap, or does building now mean building a guess? Missing client notes on a customization is a guess. A stale job description is not.",
 html:`<p><strong>The five documents a complete package carries.</strong> A missing one is either a documented constraint, where work proceeds and somebody owns the gap with a date, or a block, where work waits. That call is made together with Design, which is why naming the gap precisely matters more than the verdict attached to it.</p>
 <div class="terms"><div class="th">The design-intake package</div><dl>
 <dt>Program Overview</dt><dd>What the course is, for whom, and why now.</dd>
 <dt>Module Build Specs</dt><dd>What each module must contain. This is the document you build from.</dd>
 <dt>Target Job Description</dt><dd>The job the outcomes map to. A stale one makes stale outcomes.</dd>
 <dt>Tech Inventory</dt><dd>What the classrooms and labs can actually run.</dd>
 <dt>Client Notes</dt><dd>On a customized build, what the client asked for. There, the notes are the specification.</dd>
 </dl></div>
 <div class="ruleline"><b>Say it early or pay for it later.</b> Accepting a thin package quietly is how a build fails six weeks in, and by then the gap is somebody's fault rather than somebody's task.</div>
 <p class="tight" style="color:var(--muted)">Five packages, five answers. Where you raise something, name what is missing and what it costs.</p>`,
 brief:function(){const c=primary()||{domain:"your course"};return {from:"Design Team",re:c.domain+": intake packages awaiting your read",text:"Five packages are queued for Design Review. Read each one and answer Design directly: is there anything here we should fix before you start?"};},
 demo:{eg:"Package: overview present, specs present, job description present, tech inventory present, client notes not applicable.",
  steps:["Check the load-bearing documents first: specs and tech inventory, because both decide whether the thing can be built at all.",
   "Nothing is missing, so there is nothing to raise. Complete does not mean perfect; it means you could start on Monday without inventing anything.",
   "Answer: ✓ Nothing to raise. Work the rest of the queue the same way, and when you do raise something, say what it costs."]},
 activity:{type:"review",id:"sipr",points:15,queueTag:"Unit 1 · feedback to Design",
  labels:{yes:"✓ Nothing to raise",no:"✗ Raise it with Design",
   missYes:"✗ Look again: something in this package is missing, and Design would want to hear it now.",
   missNo:"✗ This package is complete enough to build from. Raising a non-issue costs Design time and your credibility.",
   reasonPrompt:"Agreed, this one goes back to Design. Now say what is missing and what it costs:"},
  items:[
   {content:function(){const c=primary()||{domain:"your course"};return "<b>"+c.domain+", new cohort.</b> Overview, build specs, job description and tech inventory are all present and current. The evidence plan leans on "+(primary()&&primary().id==="software"?"team-based project work, and nothing yet guarantees evidence of what each individual learner can do":"vendor quizzes, and our own independent performance evidence is thin")+".";},
    good:false,
    why:"✗ Raise it. Everything load-bearing is present, so the build can start. What is thin is the evidence plan, and that is exactly the kind of gap Design would rather hear in week one. Work proceeds; the gap gets an owner and a date before Development Review.",
    reasons:[
     {t:"The evidence plan will not show individual performance, so it needs an owner and a date before Development Review, and work can start meanwhile",ok:true,fb:""},
     {t:"The package is incomplete, so work waits",fb:"Nothing load-bearing is missing. Specs, job description and tech inventory are all there, so stopping the build costs weeks for a gap that can be closed in parallel."},
     {t:"Evidence is a Development problem, so there is nothing to raise with Design",fb:"The evidence plan comes from the module outcomes, which are Design's. Fixing it alone means quietly redesigning what a learner has to prove."}]},

   {content:"<b>Existing course, refresh.</b> Every package document is present and current, the content is ours end to end, and the tech inventory confirms the environments the labs need.",
    good:true,
    why:"✓ Nothing to raise. Complete does not mean flawless: it means you could start on Monday without inventing anything. Risks that surface later go through change control, not through blocking the handoff.",
    reasons:[]},

   {content:"<b>Client customization.</b> Overview present, build specs present. No client conversation summary, and the account team cannot yet say what the client wants changed.",
    good:false,
    why:"✗ Raise it, and work waits. On a customized build the client notes are the specification. Building before they exist means building a guess, and a guess gets rebuilt.",
    reasons:[
     {t:"On a customization the client notes are the specification, so there is nothing to build from until they exist",ok:true,fb:""},
     {t:"Start on the parts that are not customized, and add the client changes later",fb:"Reasonable-sounding and expensive. Until the notes exist nobody knows which parts are not customized, so this is still a guess with more work attached."},
     {t:"The account team owns this, so it is not ours to raise",fb:"Raising it is exactly how it gets owned. Saying nothing leaves a build scheduled against a specification nobody has written."}]},

   {content:"<b>Update to an existing course.</b> Program overview attached. The note reads: build specs to follow in a couple of weeks, you can start updating in the meantime.",
    good:false,
    why:"✗ Raise it, and work waits. Specs to follow is how scope arrives mid-build and rework becomes normal. An overview alone does not say what any module must contain.",
    reasons:[
     {t:"The build specs are the document we build from, so without them there is nothing to start against",ok:true,fb:""},
     {t:"Start with the parts that never change, like the syllabus",fb:"Those parts are shaped by the specs too. Starting now means redoing it when the specs land, which is the rework the gate exists to prevent."},
     {t:"Two weeks is short enough to absorb quietly",fb:"Absorbing it quietly is how it becomes six. A date agreed in writing costs one message; an assumed date costs the schedule."}]},

   {content:"<b>Re-run for a new cohort.</b> All package documents present. The target job description predates the current hiring shift, so it describes a role employers have moved on from.",
    good:false,
    why:"✗ Raise it, and work proceeds. The job description is what the outcomes map to, so a stale one quietly makes stale outcomes. Nothing is missing, so the build can start while Design refreshes it.",
    reasons:[
     {t:"Outcomes map to the job description, so a stale one makes stale outcomes; flag it for refresh with an owner and start on the modules that do not depend on it",ok:true,fb:""},
     {t:"Update the job description yourself, since you can see what changed",fb:"The job description is Design's document, and rewriting it alone changes what learners must prove without anyone agreeing to it."},
     {t:"It is only a reference document, so it does not block anything",fb:"It blocks nothing, and it is not only a reference. Every objective traces to it, so an outdated one sends the whole module slightly off target."}]}],
  fbGood:"Five answers, and each one Design can act on. That is the job: complete packages accepted without ceremony, gaps named precisely, and each gap sorted into work-proceeds or work-waits.",
  fbBad:"Look again at the ones you got wrong. The question is never whether the package is perfect. It is whether anything load-bearing is missing, and if so whether work can start anyway while somebody owns it."},
 transition:function(){const c=primary()||{domain:"your course"};return "Design has your answers on all five "+c.domain+" packages. Next, what a build produces once it starts, and where each document lives.";}},
{id:"s1b",title:"What every stage has to produce",crumb:"Unit 1 · The paper trail",
 bridge:"The package Design sent is one document out of the dozens a build produces. Every stage leaves its own, and knowing which stage produced a file is how anyone reads the state of a project without having to ask.",
 frame:{now:"A build's documents are spread across the stages that produced them.",role:"You are filing the paperwork so that anyone can pick this build up.",resp:"Drag each document into the folder of the stage that produced it.",use:"The file naming and prefixes section of the Handbook.",why:"Which stage produced a file tells the team what it is and whether it is finished, without anyone having to ask."},
 mins:6,
 lead:"Each stage of the pipeline produces its own documents and files. Which stage a file came from tells you what it is and whether it is finished, so the team can work out the state of a build without asking anyone.",
 
 brief:{from:"Product Quality & Experience (QA)",re:"Post-migration cleanup: six strays",text:"The drive migration scrambled where these deliverables live. Refile each one under the pipeline stage that produces it; anything that lands wrong bounces back to you."},
 demo:{eg:"Card: “Cohort survey results.”",steps:["I don’t ask where it gets <em>used</em>: I ask which stage <em>produces</em> it. Surveys get answered after a cohort runs.","After delivery the loop closes: results come back at Evaluate and become the next revision’s inputs.","So it files under 7 · Evaluate. Seven cards, same single question: which stage produces this?"]},
 coach:`<b>Drag each card onto a stage</b>, or select a card, then select its stage; both work, and keyboard works too. A wrong stage bounces the card with an explanation. The map is in the pipeline walk earlier in this unit, and in ${gl('process','the Handbook')}.`,
 hint:"Charters open projects (Initiation). Planning produces lesson objectives and assessment design: decisions, not content. Materials, facilitator guides, and the module blueprint are all made in Developing: MBP 301 is created as soon as the module has content, then kept current as each file is built. Findings logs come out of review (QA). Instructor training happens at handoff (Delivery), with us and IDQA making sure instructors have the content to upskill on. Surveys close the loop (Evaluate).",
 html:`<p><strong>The pipeline as a paper trail.</strong> Each stage of a build produces its own artifacts, and knowing which stage produces what is how anyone reconstructs the state of a project without asking. Initiation produces the charter. Planning produces decisions: lesson objectives and assessment design, no content yet. Developing produces the materials, the facilitator guide, and the module blueprint, which starts as soon as there is content to map. QA produces the findings log. Delivery builds the course in Canvas and runs instructor training, which we support alongside IDQA. Evaluate produces cohort results that feed the next revision.</p>
 <div class="diag"><svg viewBox="0 0 720 154" role="img" aria-labelledby="s1b-d"><title id="s1b-d">Which stage produces which documents, and therefore which folder they live in</title><rect x="12" y="12" width="164" height="128" rx="12" fill="#f3f0ea" stroke="#e8e1d6" stroke-width="1.5"/><text x="94" y="36" text-anchor="middle" font-size="12" font-weight="700" fill="#7a8a99">DESIGN</text><text x="94" y="60" text-anchor="middle" font-size="11" fill="#42566a">Outline</text><text x="94" y="79" text-anchor="middle" font-size="11" fill="#42566a">Objectives</text><text x="94" y="98" text-anchor="middle" font-size="11" fill="#42566a">Key topics</text><rect x="190" y="12" width="164" height="128" rx="12" fill="#e3edf8" stroke="#1d5fa8" stroke-width="2"/><text x="272" y="36" text-anchor="middle" font-size="12" font-weight="700" fill="#164a85">DEVELOPMENT</text><text x="272" y="60" text-anchor="middle" font-size="11" fill="#1c2b3a">Blueprint (MBP)</text><text x="272" y="79" text-anchor="middle" font-size="11" fill="#1c2b3a">Lessons and labs</text><text x="272" y="98" text-anchor="middle" font-size="11" fill="#1c2b3a">Assessments</text><text x="272" y="117" text-anchor="middle" font-size="11" fill="#1c2b3a">Facilitator guide</text><rect x="368" y="12" width="164" height="128" rx="12" fill="#f3f0ea" stroke="#e8e1d6" stroke-width="1.5"/><text x="450" y="36" text-anchor="middle" font-size="12" font-weight="700" fill="#7a8a99">QA</text><text x="450" y="60" text-anchor="middle" font-size="11" fill="#42566a">Findings log</text><rect x="546" y="12" width="164" height="128" rx="12" fill="#f3f0ea" stroke="#e8e1d6" stroke-width="1.5"/><text x="628" y="36" text-anchor="middle" font-size="12" font-weight="700" fill="#7a8a99">DELIVERY STAGE</text><text x="628" y="60" text-anchor="middle" font-size="11" fill="#42566a">Instructor training</text><text x="628" y="79" text-anchor="middle" font-size="9.5" fill="#7a8a99">(us, with IDQA)</text></svg><div class="dcap">Each stage keeps its documents in its own folder. Knowing the producer tells you where to look.</div></div>
 <div class="box info"><span class="bh">Where each file lives</span><p class="tight">An outline is Design’s, the blueprint and the materials are ours, a findings log is QA’s. File something in the wrong folder and the people who need it will not look there. The blueprint is the one people get wrong most, because it sounds like a design document and is produced during Developing, once there is content to map.</p></div>
 <p class="tight" style="color:var(--muted)">Six deliverables came loose in the migration. File each under the stage that produces it.</p>`,
 activity:{type:"sort",id:"s1bs",points:12,
  buckets:[{k:"init",label:"2 · Initiation"},{k:"plan",label:"3 · Planning"},{k:"dev",label:"4 · Developing"},{k:"qa",label:"5 · QA"},{k:"del",label:"6 · Delivery"},{k:"eval",label:"7 · Evaluate"}],
  cards:[
   {t:"Project charter",k:"init"},
   {t:"Lesson objectives + assessment design (no content yet)",k:"plan"},
   {t:"Facilitator Guide draft",k:"dev"},
   {t:"Module Blueprint (MBP 301)",k:"dev"},
   {t:"QA findings log",k:"qa"},
   {t:"Instructor training session",k:"del"},
   {t:"Cohort survey results",k:"eval"}],
  fbGood:"Seven for seven. Each stage produces its own artifacts, which is how QA spots what is missing from a build.",
  fbBad:"All filed. Review the process diagram for the ones you missed. The blueprint is the one people get wrong most: it is produced during Developing, not by Design."}},
{id:"s2",title:"Read the intake decision",crumb:"Unit 1 · Intake decisions",
 bridge:"Something has to start the paper trail. Design classifies every request that arrives, and the classification is theirs to make, not ours. What it decides is the size of the build you owe.",
 mins:8,
 lead:"Design has already classified these five requests. That call is theirs, not ours. Your job is to read the classification and know what it obligates you to build.",
 frame:function(){return {
   prev:"Both design packages have readiness verdicts.",
   now:"Design has stamped each request. You are working out what each stamp means for the build.",
   role:"You are the developer receiving the intake decisions.",
   resp:"For each request, identify what Development actually has to produce.",
   use:"The UCI & Versions section of the Handbook.",
   why:"Misreading a classification means building the wrong thing, or rebuilding what already exists.",
   next:"With the classification read, the last move in this unit is staging the repo those files will live in."
 };},
 portfolio:true,
 brief:{from:"Product Developer \u00b7 IT domain",re:"Monday intake: five decisions came through",text:"Design sent their classifications this morning. Read each one and tell me what it means for us. I want to know what we are building before I plan anyone\u2019s week."},
 html:`
 <p><strong>Who decides what.</strong> Whether a request becomes a new course, a revision of an existing one, or no product change at all is a <b>Design decision</b>. They own the intake call and the identifier. Development receives that decision and works out the build. Knowing the vocabulary matters anyway, because the classification on a handoff tells you the scope of your own work before you read a single specification.</p>
 <div class="diag"><svg viewBox="0 0 720 154" role="img" aria-labelledby="s2-d"><title id="s2-d">What Development builds for each classification Design assigns</title><rect x="12" y="12" width="224" height="128" rx="12" fill="#e3edf8" stroke="#1d5fa8" stroke-width="2"/><text x="124" y="36" text-anchor="middle" font-size="12" font-weight="700" fill="#164a85">NEW UCI</text><text x="124" y="60" text-anchor="middle" font-size="11" fill="#1c2b3a">Audit the repos first</text><text x="124" y="79" text-anchor="middle" font-size="11" fill="#1c2b3a">Modules, lessons</text><text x="124" y="98" text-anchor="middle" font-size="11" fill="#1c2b3a">Assessments, guide</text><text x="124" y="117" text-anchor="middle" font-size="11" fill="#1c2b3a">New repo</text><rect x="250" y="12" width="224" height="128" rx="12" fill="#e3edf8" stroke="#1d5fa8" stroke-width="2"/><text x="362" y="36" text-anchor="middle" font-size="12" font-weight="700" fill="#164a85">REVISION (.1)</text><text x="362" y="60" text-anchor="middle" font-size="11" fill="#1c2b3a">Update named modules</text><text x="362" y="79" text-anchor="middle" font-size="11" fill="#1c2b3a">Version bump</text><text x="362" y="98" text-anchor="middle" font-size="11" fill="#1c2b3a">Leave the rest alone</text><rect x="488" y="12" width="224" height="128" rx="12" fill="#f3f0ea" stroke="#e8e1d6" stroke-width="1.5"/><text x="600" y="36" text-anchor="middle" font-size="12" font-weight="700" fill="#7a8a99">NO PRODUCT CHANGE</text><text x="600" y="60" text-anchor="middle" font-size="11" fill="#42566a">Build nothing</text><text x="600" y="79" text-anchor="middle" font-size="11" fill="#42566a">Request belongs</text><text x="600" y="98" text-anchor="middle" font-size="11" fill="#42566a">to another team</text></svg><div class="dcap">Design assigns the classification. It tells you the size of your own work.</div></div>
 <div class="box info"><span class="bh">What each classification obligates us to build</span><ul class="blist"><li><b>New UCI.</b> A course that does not exist yet under that identifier. This does not mean building every module from nothing. Your first job is a reuse audit: go through our module repos and sort each module in the outline into reuse as it stands, reuse with modifications, or build new. Most new courses land mostly in the first two, and the build is smaller than the classification makes it sound.</li><li><b>New revision (.1).</b> The course exists. Development updates the specific modules named in the handoff, bumps the version, and keeps everything else intact. The risk here is scope creep: a revision is not an excuse to rebuild pages nobody asked about.</li><li><b>No product change.</b> The course runs as it is. Development builds nothing. If someone is asking us for work anyway, the real request belongs to Delivery or Operations, and the answer is a conversation rather than an edit.</li></ul></div>
 <div class="box rule"><span class="bh">Does the course exist, and is the content changing?</span><p class="tight">You do not make the call, but you should be able to follow the reasoning: <b>does the course already exist</b>, and <b>is the content changing</b>? Existing plus unchanged is no product change. Existing plus changed is a revision. Not existing, or customized for a specific client, is a new UCI. If a handoff\u2019s classification does not match that logic, that is worth raising before you build.</p></div>
 <p class="tight" style="color:var(--muted)">Five decisions follow. For each, sort it by what Development has to produce.</p>
 `,
 coach:`Read Design\u2019s classification, then sort each request by what <b>we</b> have to build. Wrong sorts bounce back with an explanation. Rules: ${gl('uci','UCI numbers & versions')} in the Handbook.`,
 hint:"Work from the classification, not from how urgent the request sounds. New UCI means a course that does not exist yet, so audit the module repos and build only what is missing. Revision means update only the named modules and bump the version. No product change means we build nothing and the request belongs to another team.",
 demo:{eg:"Worked example. Design classified this as no product change: \u201CChicago would like to run the same Java course New York delivered last year. No changes.\u201D",steps:[
  "Step 1. Read the classification, not the request. Design stamped it no product change. That is the decision; we are not re-litigating it.",
  "Step 2. Work out our obligation. The course exists and the content is not changing, so Development produces nothing. No new repo, no version bump, no build time in anyone\u2019s week.",
  "Step 3. Note where the work does sit. Someone still has to schedule and staff the delivery, which is Delivery and Operations, not us. Say so rather than absorbing it.",
  "Sort the five below the same way: what does this classification require Development to produce?"]},
 activity:{type:"triage",id:"s2t",points:10,fbGood:"Five for five. You read the classification rather than the urgency, which is what stops us building the wrong size of thing.",fbBad:"Queue cleared. Re-read the ones you missed: the classification, not the tone of the request, decides what Development owes.",
   buckets:["\uD83D\uDD0D Audit the repos, then build the gaps","\uD83D\uDD01 Update named modules","\u2705 Build nothing"],
   items:[
    {from:"IT Support",subj:"Design says: no product change",body:"We are delivering the existing {{DOMAIN}} course to a new cohort. Same modules, same content, same hours.",ans:2,why:"Build nothing. The course exists and nothing about the content changes, so there is no development work. Scheduling and staffing the cohort sits with Delivery and Operations."},
    {from:"MERN SWE",subj:"Design says: new UCI",body:"We are standing up a second {{DOMAIN}} program for a different entry level. There is no course under that identifier yet.",ans:0,why:"Audit first. A new UCI means a course that does not exist yet, so start in the module repos. Sort each module in the outline into reuse as it stands, reuse with modifications, or build new, then scope the build from what is actually missing."},
    {from:"IT Support",subj:"Design says: revision (.1)",body:"Two modules in the {{DOMAIN}} course are out of date against current practice and need updating. Hours unchanged.",ans:1,why:"Update named modules. Two modules and the mapping, version bumped, everything else left alone. The trap is treating a revision as license to rework pages nobody asked about."},
    {from:"MERN SWE",subj:"Design says: new UCI",body:"A client wants our {{DOMAIN}} course customized to their stack and timeline.",ans:0,why:"Audit first. A customized build gets its own identifier because its content and constraints diverge from the market course, but the market course is exactly where you start looking. Much of it will reuse with modifications. The client notes tell you which parts cannot."},
    {from:"Delivery",subj:"Design says: no product change",body:"Instructors are asking for extra practice material because learners arrive without the prerequisites.",ans:2,why:"Build nothing, at least not from this request. The problem is admissions or prerequisites, not the course. Raise it rather than quietly adding material that papers over an intake gap."}]},
 transition:"You can now read an intake decision and say what it costs us to build. Next, the naming convention that keeps all of that work findable."},
{id:"s3",title:"Build the module repo",crumb:"Unit 1 · Staging the repo",
 bridge:"The classification is read and the build is scoped. None of it exists on disk yet.",
 mins:8,
 lead:"Every build starts with a correctly-named repository. Practice the naming convention on a standard module example: create each required file with the right prefix and number, and watch the repo assemble. The same convention applies to every project you'll build.",
 brief:{from:"Product Quality & Experience (QA)",re:"Module staging repo. Naming practice",text:"Before anything gets built: the staging repo is empty except for one example file. Create the required files, named exactly to convention. If three teams can\u2019t find a file from its name alone, the name is wrong. Master this on the example and it\u2019s automatic on your real builds."},
 demo:{eg:"Worked example. Needed: “the quiz for lesson 1 of this module.”",steps:["Step 1: Identify what it is. A quiz takes the prefix <span class='mono'>Quiz</span>. Look this up in the table rather than from memory. Using the reference is the skill.","Step 2: Identify its level. Quizzes are lesson-level, so the number carries the lesson: module 301, lesson 1 becomes <span class='mono'>301.1</span>.","Step 3: Name it and file it. <span class='mono'>Quiz 301.1</span> lands in Assessments. Build your five the same way: first what it is, then what level."]},
 frame:function(){const c=primary()||{domain:"chosen",role:"the target role"};return {
   prev:"You chose "+c.domain+" as your primary project and logged its readiness and identifier.",
   now:"The intake decision is read, so the build has a shape. Nothing exists on disk yet.",
   role:"You are the Product Developer preparing the build workspace.",
   resp:"Create each required file, named to convention, for this project's module.",
   use:"The naming-convention section of the Handbook. The required files depend on your project's domain.",
   why:"If three teams can't find a file from its name alone, the name is wrong. Clean staging is where good builds start.",
   next:"With the repo staged, the Unit 1 check asks you to do this pair in your own words, and Unit 2 begins the design work."
 };},
 coach:`Look at the <b>to-create list</b>, type each file's name in the box (prefix + numbers, e.g. <b>GLAB 301.1.1</b>), and press Create. Right names drop into the tree; wrong ones tell you what's off. Keep ${gl('naming','the prefix table')} open. Using the reference is the skill.`,
 hint:"Labs and quizzes carry lesson numbers (301.1); KBAs, SBAs, and blueprints are module-level (301). Graded items take R- in front, except ALAB, where the grading is already in the name.",
 html:`<div class="terms"><div class="th">🔤 The files you are about to create</div><dl><dt>GLAB</dt><dd>Guided lab: step-by-step hands-on work. Numbered to its lesson: GLAB 301.1.1.</dd><dt>ALAB</dt><dd>Assignment lab: the learner drives from a problem statement. Always graded, and written as ALAB, because the grading is implied and no R- is needed.</dd><dt>Quiz</dt><dd>The lesson-level knowledge check: Quiz 301.2.</dd><dt>KBA</dt><dd>The module-closing graded assessment: module-level, so KBA 301 with no lesson number.</dd><dt>MBP</dt><dd>Module Blueprint: the module’s index, one per module. Also module-level: MBP 301. Started during Developing, not during Planning.</dd></dl></div><p><strong>The concept:</strong> a file name is an address. Anyone on any team should be able to find any material, or know exactly what a file is before opening it, from the name alone.</p><div class="diag"><svg viewBox="0 0 720 150" role="img" aria-labelledby="dn-t"><title id="dn-t">Anatomy of a file name: select each part</title><text x="360" y="52" text-anchor="middle" font-size="42" font-family="IBM Plex Mono, monospace" fill="#12283f" font-weight="600">R-GLAB 301.2.1</text><g class="fdu hot" tabindex="0" role="button" style="animation-delay:0.2s" aria-label="R-" data-name="R-" data-info="Graded / required. ALABs, Quizzes, KBAs, SBAs, and Capstones are always graded: the R- makes it visible in a file list."><line x1="205" y1="64" x2="205" y2="86" stroke="#3f88c5" stroke-width="2"/><text x="205" y="102" text-anchor="middle" font-size="11" fill="#3f88c5" font-weight="600">R- = graded</text></g><g class="fdu hot" tabindex="0" role="button" style="animation-delay:0.38s" aria-label="GLAB" data-name="GLAB" data-info="The prefix says what a file is before anyone opens it: guided lab, in this case. The full prefix table lives in the Handbook."><line x1="298" y1="64" x2="298" y2="120" stroke="#1d5fa8" stroke-width="2"/><text x="298" y="136" text-anchor="middle" font-size="11" fill="#164a85" font-weight="600">GLAB</text></g><g class="fdu hot" tabindex="0" role="button" style="animation-delay:0.56s" aria-label="301" data-name="301" data-info="The module number. Module-level items: KBA, SBA, MBP. Stop here."><line x1="437" y1="64" x2="437" y2="86" stroke="#1d5fa8" stroke-width="2"/><text x="437" y="102" text-anchor="middle" font-size="11" fill="#164a85" font-weight="600">301</text></g><g class="fdu hot" tabindex="0" role="button" style="animation-delay:0.74s" aria-label=".2" data-name=".2" data-info="The lesson number. Only lesson-level items (labs, quizzes, activities) carry it."><line x1="497" y1="64" x2="497" y2="120" stroke="#1d5fa8" stroke-width="2"/><text x="497" y="136" text-anchor="middle" font-size="11" fill="#164a85" font-weight="600">.2</text></g><g class="fdu hot" tabindex="0" role="button" style="animation-delay:0.92s" aria-label=".1" data-name=".1" data-info="The item number. This is the first lab of lesson 2."><line x1="547" y1="64" x2="547" y2="86" stroke="#1d5fa8" stroke-width="2"/><text x="547" y="102" text-anchor="middle" font-size="11" fill="#164a85" font-weight="600">.1</text></g></svg><div class="dcap">👆 <b>Select each labeled part</b> to see what it encodes.</div></div><div class="ruleline"><b>A real one to look at.</b> <a href="https://docs.google.com/document/d/1oVfC3B3Bz3fdJ-dhkqVRBqPxNRkoP7xEtw_YCZwtbCs/edit?tab=t.0#heading=h.qyjfmdipkf8v" target="_blank" rel="noopener">Open the worked example</a> and read it beside what you are about to build: the same convention at full size, on a real module rather than a teaching example.</div>`,
 transition:function(){const c=primary()||{domain:"chosen"};return "The "+c.domain+" module repo is staged and named to convention. The Unit 1 check asks you to do the reply and the file list again in your own words, and Unit 2 then designs what goes inside this module.";},
 activity:{type:"repo",id:"s3r",points:12,
  folders:{"Lessons":["Lesson 301.1 — Hardware Foundations  ·  (example, already created)"],"Assignments":[],"Assessments":[],"Resources":[]},
  goals:[
   {desc:"The guided lab for lesson 1 (first lab of that lesson)",ans:"glab 301.1.1",folder:"Assignments",label:"GLAB 301.1.1"},
   {desc:"An assignment lab for lesson 2, item 1 (always graded, no R-)",ans:"alab 301.2.1",folder:"Assignments",label:"ALAB 301.2.1"},
   {desc:"The quiz for lesson 2",ans:"quiz 301.2",folder:"Assessments",label:"Quiz 301.2"},
   {desc:"The knowledge-based assessment closing the module",ans:"kba 301",folder:"Assessments",label:"KBA 301"},
   {desc:"The module blueprint",ans:"mbp 301",folder:"Resources",label:"MBP 301"}],
  fbGood:"Repo complete. Every file is findable by name alone, which is the point of the convention.",
  fbBad:"Repo complete. The prefix table is in the Handbook, and looking it up is the intended method."}},
{id:"d1x",title:"Unit 1 check: reply to Design, then stage the repo",crumb:"Unit 1 \u00b7 Unit check",mins:12,
 bridge:"Unit 1 took a request from handoff to a staged repo: received, understood, filed, and named to convention. Do the last two moves again in your own words, because your capstone opens with exactly this pair.",
 frame:{now:"Unit 1 asked you to receive work and set it up. This is you doing both, in writing.",role:"You are the developer answering Design and staging the build.",resp:"Write the reply, then list the files the repo needs. Model answers appear once you commit yours.",use:"Your intake verdict and the naming convention.",why:"Your capstone opens with exactly this pair, at full size."},
 lead:"Unit 1 was about receiving work and setting it up correctly. Do both here, in writing. Your capstone starts with a handoff and a repo, so this is the first part of it at small scale.",
 html:()=>`<div class="box rule"><span class="bh">What landed on your desk</span><p class="tight">Design classified a client request as a <b>new UCI</b>: our ${primary()?primary().domain:"MERN"} course, customized to the client\u2019s stack and timeline. The handoff contains:</p>
 <p class="tight" style="background:#f3f0ea;color:var(--text);border-left:3px solid var(--indigo);padding:9px 12px;margin:8px 0">Build specifications, present.<br>Client notes, present, with two constraints on tooling.<br>Target job description, present, dated fourteen months ago. The client has since renamed the role.<br>Classroom technology inventory, present, dated last week.</p>
 <p class="tight">Your director wants to start module 1 this week. Nothing is scored here. When you save, you get an experienced developer\u2019s version and the criteria to check yours against.</p></div>`,
 coach:"Write your reply to Design, what you tell your director, and the three file names, then press Save. An experienced developer\u2019s version appears beside each answer.",
 activity:{type:"journal",id:"d1xw",
  fields:[
   {label:"1. Your reply to Design. What, if anything, do you raise, and can we start?",
    ph:"Thanks. Before we start, \u2026"},
   {label:"2. Your director asks if module 1 can begin this week. What do you tell them?",
    ph:"We can begin on \u2026 but \u2026"},
   {label:"3. Name three files you would create first, to convention: the module blueprint, a graded guided lab as item 1 of lesson 2, and the lesson itself.",
    ph:"MBP \u2026 / \u2026 / \u2026"}],
  modelHead:"An experienced developer\u2019s version, and how to check yours",
  model:`<p class="tight"><b>1. Reply to Design.</b> \u201CSpecs and client notes are here, so we can start. One thing to raise: the job description is fourteen months old and the role has been renamed, so any objective derived from it is built on something stale. Who is re-confirming the role with the client, and by when? Recording this as a constraint and proceeding on the parts that do not depend on it.\u201D</p>
  <p class="tight"><b>2. To your director.</b> \u201CYes, on the parts that do not depend on the role definition. Module 1 covers environment setup, which is unaffected, so that starts now. The modules whose objectives come from the job description wait until we have the confirmed role. Here is what is waiting and who I am waiting on.\u201D</p>
  <p class="tight"><b>3. Files.</b> <span class="mono">MBP 301</span> for the blueprint, produced during Developing and filed in our folder rather than Design\u2019s. <span class="mono">R-GLAB 301.2.1</span> for the graded guided lab: R- because it is graded, GLAB because it is guided, then module 301, lesson 2, item 1. <span class="mono">Lesson 301.2</span> for the lesson itself.</p>
  <div class="box rule" style="margin-top:10px"><span class="bh">Check your own against these</span><ul class="blist"><li>\u2610 You started work rather than blocking it. A stale input is a documented constraint, not a reason to stop.</li><li>\u2610 You did not stay silent about the job description. Absorbing it quietly is the failure this unit exists to prevent.</li><li>\u2610 You named an owner and asked for a date, so the flag has somewhere to go.</li><li>\u2610 You told your director what <em>can</em> proceed, as well as what cannot.</li><li>\u2610 The blueprint is ours, produced during Developing.</li><li>\u2610 R- appears on the graded lab, and the numbering reads module, lesson, item.</li></ul></div>`},
 transition:"You have taken a request from handoff to a staged repo. Unit 2 moves from checking what arrives to designing what goes inside it."}]},
{day:2,mod:"2 · Planning the module",lessons:[
{id:"d2i",title:"Unit 2 · Planning the module",crumb:"Unit 2 · Unit opener",
 bridge:"Unit 1 ended with a staged repo: the right files, correctly named, and empty. Unit 2 fills them, starting with the question that decides everything else: what must the learner be able to do?",
 mins:7,
 lead:"Unit 1 covered how work moves through the team. This unit covers how the learning itself gets designed, starting from what learners need to prove and working back to the content.",
 frame:function(){const c=primary();return {
   prev: c ? ("Unit 1: you set "+c.domain+" as your primary project, logged its readiness, and staged its module repo."): "Unit 1 covered intake, readiness, and identifiers.",
   now:"This unit is where you design. Outcomes, then evidence, then the lesson day, all for your module.",
   role:"You are the Product Developer designing "+(c?"your module, "+c.module.replace(/^Module ##:\s*/,""):"your module")+".",
   resp:"Approve objectives, compose the module, plan its assessment rhythm, and plan a lesson day. All against your project.",
   use:"The Design sections of the Handbook. The Lessons tab, top left, shows which unit you are in.",
   why:"Everything a learner touches inherits from what is decided in this unit.",
   next:"Your approved objective flows straight into the schedule and assessment work."
 };},
 coach:"Read the objectives, take in the two diagrams, then answer the warm-up and Save to begin.",
 html:`<div class="box info"><span class="bh">Confirm your project</span><p class="tight">Your Unit 1 choice carries over automatically. If a picker appears above, this browser has no saved choice: reselect your project so the rest of this unit adapts to it.</p></div><p><strong>By the end of Unit 2 you'll be able to:</strong></p>
 <ul class="obj"><li>Approve or reject draft objectives using the observable-verb test.</li><li>Assemble a 240-minute lesson day that clears the 75% activated-learning bar.</li><li>Compose a module to the right pattern, and plan where its formative and summative checks sit in the week.</li></ul><div class="terms"><div class="th">🔤 Planning vocabulary</div><dl><dt>Objective</dt><dd>One sentence stating what a learner will be able to do. Outlines are built from these.</dd><dt>Outcome</dt><dd>The job-level capability a whole course produces; objectives ladder up to it.</dd><dt>Evidence</dt><dd>The assessments and rubrics that prove an objective was met, designed before content.</dd><dt>Activated learning</dt><dd>Learners producing (discussing, building, solving) vs. passively receiving. Budgeted at ≥75% of every lesson.</dd></dl></div><div class="diag"><svg viewBox="0 0 720 112" role="img" aria-labelledby="db-t"><title id="db-t">Backward design. Select each stage</title><g class="fdu hot" tabindex="0" role="button" aria-label="1 · Outcomes" data-name="1 · Outcomes" data-info="Written first, sourced from the target job: what a graduate can DO. Everything downstream traces back here."><rect x="18" y="26" width="200" height="60" rx="10" fill="#e3edf8" stroke="#1d5fa8" stroke-width="1.5"/><text x="118" y="16" text-anchor="middle" font-size="11" font-family="monospace" fill="#8fa0ae">FIRST</text><text x="118" y="51" text-anchor="middle" font-size="13.5" fill="#164a85" font-weight="600">Outcomes</text><text x="118" y="70" text-anchor="middle" font-size="11" fill="#5b6b7a">what a graduate can DO</text></g><path class="fdu" style="animation-delay:.3s" d="M 222 56 L 252 56" stroke="#1d5fa8" stroke-width="2.5" marker-end="url(#arrB)"/><g class="fdu hot" tabindex="0" role="button" style="animation-delay:.4s" aria-label="2 · Evidence" data-name="2 · Evidence" data-info="Assessments and rubrics designed before any content exists, so teaching aims at proof, not coverage."><rect x="260" y="26" width="200" height="60" rx="10" fill="#e3edf8" stroke="#1d5fa8" stroke-width="1.5"/><text x="360" y="16" text-anchor="middle" font-size="11" font-family="monospace" fill="#8fa0ae">SECOND</text><text x="360" y="51" text-anchor="middle" font-size="13.5" fill="#164a85" font-weight="600">Evidence</text><text x="360" y="70" text-anchor="middle" font-size="11" fill="#5b6b7a">assessments &amp; rubrics</text></g><path class="fdu" style="animation-delay:.7s" d="M 464 56 L 494 56" stroke="#1d5fa8" stroke-width="2.5" marker-end="url(#arrB)"/><g class="fdu hot" tabindex="0" role="button" style="animation-delay:.8s" aria-label="3 · Experiences" data-name="3 · Experiences" data-info="Lessons, labs, and lesson days: designed LAST, in service of the outcomes and the evidence."><rect x="502" y="26" width="200" height="60" rx="10" fill="#fff" stroke="#e8e1d6" stroke-width="1.5"/><text x="602" y="16" text-anchor="middle" font-size="11" font-family="monospace" fill="#8fa0ae">LAST</text><text x="602" y="51" text-anchor="middle" font-size="13.5" fill="#1c2b3a" font-weight="600">Experiences</text><text x="602" y="70" text-anchor="middle" font-size="11" fill="#5b6b7a">lessons · labs · days</text></g><defs><marker id="arrB" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" fill="#1d5fa8"/></marker></defs></svg><div class="dcap">👆 <b>Select each stage</b>. The order is the whole idea: content comes last.</div></div><div class="diag"><svg viewBox="0 0 720 92" role="img" aria-labelledby="dr-t"><title id="dr-t">The assessment rhythm: select a beat</title><line class="draw" x1="50" y1="40" x2="670" y2="40" stroke="#1d5fa8" stroke-width="2.5"/><g class="fdu hot" tabindex="0" role="button" style="animation-delay:0.2s" aria-label="Daily" data-name="Daily" data-info="Warm-up opens the day, exit ticket closes it. Both are formative and both run every day."><circle cx="80" cy="40" r="9" fill="#1d5fa8"/><text x="80" y="66" text-anchor="middle" font-size="11.5" fill="#1c2b3a" font-weight="600">Daily</text></g><g class="fdu hot" tabindex="0" role="button" style="animation-delay:0.4s" aria-label="Weekly" data-name="Weekly" data-info="2–3 labs reinforcing the week’s skills; at least one graded individual assessment."><circle cx="270" cy="40" r="9" fill="#1d5fa8"/><text x="270" y="66" text-anchor="middle" font-size="11.5" fill="#1c2b3a" font-weight="600">Weekly</text></g><g class="fdu hot" tabindex="0" role="button" style="animation-delay:0.6s" aria-label="Module end" data-name="Module end" data-info="KBA (knowledge) and/or SBA (skill) close every module: the summative gate."><circle cx="470" cy="40" r="9" fill="#3f88c5"/><text x="470" y="66" text-anchor="middle" font-size="11.5" fill="#1c2b3a" font-weight="600">Module end</text></g><g class="fdu hot" tabindex="0" role="button" style="animation-delay:0.8s" aria-label="Course end" data-name="Course end" data-info="The capstone integrates everything, produces a real deliverable, and is presented."><circle cx="650" cy="40" r="9" fill="#1f9d76"/><text x="650" y="66" text-anchor="middle" font-size="11.5" fill="#1c2b3a" font-weight="600">Course end</text></g></svg><div class="dcap">👆 <b>Select a beat</b> to see its instruments. Notice this course follows the same rhythm you’re reading about.</div></div><p style="margin-top:14px"><strong>Go deeper</strong>, backward design, from its co-creator:</p><div class="video"><iframe src="https://www.youtube.com/embed/4isSHf3SBuQ" title="Grant Wiggins: Understanding by Design workshop, part 1" loading="lazy" allowfullscreen></iframe></div><div class="vidcap">🎯 <b>Watch task, first 12 minutes.</b> This is a full workshop recording; you do not need all of it now. Listen for how Wiggins separates “interesting activities” from “evidence of learning”. It’s the exact distinction your objectives review will hinge on. (<a href="https://www.youtube.com/watch?v=4isSHf3SBuQ" target="_blank" rel="noopener">Open on YouTube</a>)</div><div class="media-row"><a class="media-card" href="https://www.pnas.org/doi/10.1073/pnas.1319030111" target="_blank" rel="noopener"><span class="mc-ic">📄</span><span><span class="mc-t">Freeman et al. (2014), PNAS</span><span class="mc-m">The 225-study meta-analysis: active learning raises scores ~0.47 SD and cuts failure rates</span></span></a></div>`,
 activity:{type:"journal",id:"d2ij",fields:[
  {label:"Warm-up: think of the best class you ever took. What were you doing during most of it: listening, or making something?",ph:"I remember…"}],modelHead:"What the research says about that class",model:`<p class="tight">Most people describe doing something: building, arguing, solving, presenting. Almost nobody describes listening. That is the finding this unit is built on, and it is why the standard is 75 percent activated learning rather than a suggestion to add activities.</p><p class="tight">If your best class was mostly lecture, it is worth asking what you were doing in your head. Predicting, arguing back, connecting it to something. That is still activated. What does not work is receiving content with nothing asked of you.</p>`}},
{id:"sob",title:"Review the draft objectives",crumb:"Unit 2 · Objectives review",
 bridge:"Planning works backward from what learners must prove, which makes objectives the first thing to settle. Design has drafted five for your module and sent them over for review.",
 mins:8,
 lead:"Design owns the module objectives, and we sit at the table while they are written. This review is where that collaboration gets concrete. Read each draft against one standard, approve the drafts that hold, and send back the rest.",
 demo:{eg:"Draft objective: “Know the OSI model.”",steps:["Verb first: could an instructor watch a learner ‘know’, and would two of them agree it happened? No. The verb names something nobody can see.","Topic next: ‘the OSI model’ is a subject area, not a behavior. Nothing here says what the learner does with it.","Verdict: ✗ Send back. An unwatchable verb, on a topic no single assessment could cover. Run those two checks on each of your five."]},
 frame:function(){const c=primary()||{domain:"chosen",objectiveDraft:"a draft objective",module:"your module"};return {
   prev:"Design sent draft objectives for your "+c.domain+" module ahead of the handoff meeting.",
   now:"One draft reads: \u201C"+c.objectiveDraft+"\u201D "+(c.ph_obj?"(sample wording. Pending validation)":"")+"",
   role:"You are reviewing objectives the way a reviewer does at the handoff.",
   resp:"Approve the drafts that meet the standard. Send the rest back, naming the violation.",
   use:"The Objectives section of the Handbook, and the draft at the top of this page.",
   why:"Every assessment, lab and lesson day in this module is derived from an approved objective.",
   next:"The objective you approve is logged, and the assessment plan is built against it."
 };},
 coach:`<b>✓ Approve</b> a draft that meets the standard, <b>✗ Send back</b> one that does not, then pick the violation from the list that appears. A wrong stamp bounces with a note and costs the clean run. You are finished when all five drafts carry a verdict. The standard: ${gl('objectives','writing objectives')}.`,
 hint:"One measurable verb, one topic, one behavior. Send it back when the verb names a state inside a head, or when the topic is the size of a course. Send it back when an “and” joins two behaviors in one sentence.",
 html:()=>`${(function(){const c=primary();return c?`<div class="pullquote"><div class="pq">Draft objective for review: \u201C${c.objectiveDraft}\u201D</div><div class="pa">${c.domain} · ${c.module}${c.ph_obj?" · sample wording pending validation":""}</div></div>`:"";})()}<p><strong>Why we review objectives we did not write.</strong> Design owns the module objectives, with us at the table while they are drafted. An unmeasurable objective leaves nothing to assess and no way to tell whether a lesson worked. A weak one has to be caught here. Sending one back is part of the process, not a complaint.</p>
 <div class="ruleline"><b>The standard,</b> one measurable verb, one topic, one behavior at a time.</div>
 <p>No sentence shape is required. \u201CConfigure wireless security on a SOHO router\u201D is a complete objective, and extra clauses add nothing a reviewer can check.</p>
 <div class="spec"><div class="spec-h">One objective, met and broken</div><div class="spec-b">\u2713 <span class="an">Configure</span> wireless security on a <span class="an">SOHO router</span>.<br>\u2717 Understand networking fundamentals.<br>\u2717 Explain the OSI model <span class="an">and</span> configure a router.<br>\u2717 Complete GLAB 301.1.1.</div><div class="spec-n">Line two names a state inside a head, on a topic the size of a course. Line three is two behaviors in one sentence, and they get assessed separately anyway. Line four names the evidence, not the capability it proves.</div></div>
 <p><strong>The verb decides what evidence you owe.</strong></p>
 <table class="mtbl"><tr><th>Level</th><th>Verbs</th><th>Evidence it commits you to</th></tr>
 <tr><td><b>Know</b></td><td>identify, define, explain, describe</td><td>A question can measure it. Legitimate as scaffolding, never as the end of a module.</td></tr>
 <tr><td><b>Do</b></td><td>configure, build, write, query, resolve</td><td>The learner produces something. A quiz cannot measure this honestly.</td></tr>
 <tr><td><b>Decide</b></td><td>diagnose, choose, prioritize, justify</td><td>More than one defensible answer, plus the reasoning behind the choice.</td></tr></table>
 <p class="tight">Four questions settle every draft:</p>
 <ul class="cl"><li>Could an instructor watch this happen, and would two of them agree that it did?</li>
 <li>Is the topic narrow enough for one assessment to cover?</li>
 <li>Is one behavior named, rather than two joined by an \u201Cand\u201D?</li>
 <li>Does it name a capability, rather than a lab or a quiz the learner finishes?</li></ul>
 <p class="tight">Approved objectives are written into the <b>Module Blueprint Template</b>, in ${gl('templates','templates &amp; links')}, and the assessment plan hangs off them.</p>
 <p class="tight" style="color:var(--muted)">Five drafts are in the queue below. Stamp each one, and name the violation on every send-back.</p>`,
 transition:function(){const c=primary()||{objectiveFixed:"the corrected objective"};remember("objective",c.objectiveFixed);return "Approved objective logged: \u201C"+c.objectiveFixed+"\u201D "+((c&&c.ph_obj)?"(sample, validate)":"")+". Next comes what a whole module built from those objectives has to contain.";},
 activity:{type:"review",id:"sobr",points:15,queueTag:"Outline draft · objectives",
  items:[
   {content:"\u201CUnderstand networking fundamentals.\u201D",
    good:false,
    why:"✗ Sent back: \u201Cunderstand\u201D isn't observable or measurable. No two instructors could agree on when it happened, and \u201Cnetworking fundamentals\u201D is a whole domain, not a behavior.",
    reasons:[
     {t:"The verb isn't observable or measurable, and the scope is an entire domain rather than a specific behavior",ok:true,fb:""},
     {t:"It's too short. Objectives need to be at least a full sentence",fb:"Length isn't the standard; observability is. A short objective with a performance verb would pass."},
     {t:"It should mention which lesson covers it",fb:"Mapping to lessons happens in the blueprint. The violation here is the unmeasurable verb and boundless scope."}]},
   {content:"\u201CConfigure wireless security settings on a SOHO router to a provided checklist.\u201D",
    good:true,
    why:"✓ Approved. A performance verb you can watch (\u201Cconfigure\u201D), a specific scope (SOHO router, wireless security), and built-in evidence (the checklist). An assessment practically writes itself from this.",
    reasons:[]},
   {content:"\u201CLearn about and appreciate the importance of cybersecurity in the modern workplace.\u201D",
    good:false,
    why:"✗ Sent back: \u201Clearn about\u201D and \u201Cappreciate\u201D are unmeasurable. It's compound (two verbs, one objective), and it describes an attitude rather than a performance.",
    reasons:[
     {t:"Unmeasurable verbs, compound structure, and it targets an attitude instead of an observable performance",ok:true,fb:""},
     {t:"Cybersecurity is off-topic for this course",fb:"Topic fit is a design-scope question. Structurally, the verbs are the violation. Nothing here can be assessed."},
     {t:"It's missing a time limit",fb:"Time boxes belong on assessments. The objective fails because nothing in it is observable, timed or not."}]},
   {content:"\u201CExplain when to use TCP versus UDP, giving one example of each.\u201D",
    good:true,
    why:"✓ Approved. It's Know-level, and that's legitimate scaffolding: \u201Cexplain\u201D is observable, the scope is tight, and \u201Cone example of each\u201D builds the evidence right into the objective. Not every objective must be hands-on; it must be measurable.",
    reasons:[]},
   {content:"\u201CComplete GLAB 301.1.1.\u201D",
    good:false,
    why:"✗ Sent back: that's an activity, not an objective. The lab is how a learner produces evidence of some capability. The objective is the capability. Name what completing the lab proves, and that's your objective.",
    reasons:[
     {t:"It names an activity rather than a capability. The lab is evidence for an objective, not the objective",ok:true,fb:""},
     {t:"The file name is wrong for this module",fb:"Even with a perfect file name, an activity still isn't an objective. The category error is the violation."},
     {t:"Labs can't appear in outlines",fb:"Labs appear all over outlines, as assessments and evidence. They cannot stand in for the objective itself."}]}],
  fbGood:"Five for five, violations named. Assessments, labs, and lesson days are all built from these objectives, so their quality carries downstream.",
  fbBad:"Queue cleared: study the verdicts where you missed. The one test to carry: observable verb, specific scope, evidence you could point to."}},
{id:"modref",title:"What goes in a module",crumb:"Unit 2 · Reference",mins:9,
 bridge:"Objectives get checked one at a time, but a module is a set of them working together, and it has its own standard for what it must contain.",
 lead:"This page sets the standard. What a module must contain, the two tests that size everything else, and how the shape changes with the situation. Read it here, then keep it open in the Handbook while you compose.",
 html:`<p>New developers ask how many quizzes, labs and graded assignments a module needs. No number answers it. One rule and two tests do.</p>
 <div class="ruleline"><b>Every module ends</b> with a summative task that poses a real problem the learner solves without step-by-step guidance.</div>
 <p>That task is the competency check, and everything before it exists to get the learner ready. An IT Support module ends with an unscripted ticket resolved. A MERN module ends with an endpoint built from a spec.</p>
 <p><strong>How much of everything else?</strong> Enough to support and verify each objective, and no more. Two tests replace counting.</p>
 <div class="terms"><div class="th">Alignment and sufficiency</div><dl>
 <dt>Alignment</dt><dd>Every assessment maps to an objective, and every objective has at least one piece of evidence. A check that measures no objective is noise. An objective with no evidence is a gap.</dd>
 <dt>Sufficiency</dt><dd>A formative check goes wherever a learner could go wrong undetected before a high-stakes moment. More checks are not better: over-assessing fragments attention.</dd>
 </dl></div>
 <p><strong>The scaffold has to fade.</strong> Across a module, activated time shifts from guided (I do, we do) to independent (you do), and the summative is pure you-do. A module that stays guided the whole way feels active and proves nothing.</p>
 <p><strong>Duration and content ownership change the shape, never the rule.</strong></p>
 <table class="mtbl"><tr><th>Module type</th><th>What it needs</th></tr>
 <tr><td><b>Standard</b><br><span class="mnote">~4\u20136+ lessons</span></td><td>The full arc: teach, guided practice, fading scaffold, independent practice, summative competency task.</td></tr>
 <tr><td><b>Short</b><br><span class="mnote">1\u20132 days</span></td><td>Compress the ramp and keep the proof. One teach-and-guided pass, then an independent performance task. Drop the mid-module checkpoint, never the summative.</td></tr>
 <tr><td><b>Prep / foundational</b></td><td>Where a module genuinely is prerequisite (terminology, safety, setup), its check may be a knowledge check or a gated readiness task, and no larger.</td></tr>
 <tr><td><b>Vendor-constrained</b></td><td>Where third-party content teaches only \u201Cfollow the steps,\u201D author the competency assessment on top: our own SBA, on the vendor material.</td></tr></table>
 <p class="tight">Run this before any module plan is finalized:</p>
 <ul class="cl"><li>Name the module type, and check the summative matches that type.</li>
 <li>Point at the independent evidence for every objective.</li>
 <li>Confirm the scaffold fades, rather than staying guided to the end.</li>
 <li>Find the assessments that map to no objective, and cut them.</li>
 <li>Find the objectives with no evidence, and fix them.</li>
 <li>Check the time split: doing should outweigh consuming.</li></ul>
 <p class="tight" style="color:var(--muted)">When in doubt, protect the summative and cut the filler. The full reference sits in the ${gl('composition','Handbook \u2192 What goes in a module')}. The plan goes into the <b>Module Blueprint Template</b> in ${gl('templates','templates &amp; links')}.</p>`,
 transition:"That is the standard. It says a module needs enough evidence to verify every objective, without saying how much or when. Next settles both."},
{id:"arh",title:"Plan the assessment rhythm",crumb:"Unit 2 · Assessment cadence",
 bridge:"The composition standard says a module needs enough evidence to verify every objective. It stops short of saying how much, or when. That is what this page settles.",
 frame:{now:"The module has objectives and a shape. Nothing yet says when anyone finds out whether it is working.",
  role:"You are planning the evidence for a module that has not been built.",
  resp:"Sort each proposed check by the job it does, then read the cadence it has to fit.",
  use:"The assessment rhythm section of the Handbook.",
  why:"Settling the cadence now is what stops Unit 3 from guessing what to build."},
 mins:8,
 lead:"Every check you plan either reports how the learning is going while there is still time to act, or records whether the learner met the standard. Confusing the two fills a module with activity that produces no evidence.",
 coach:"<b>Drag each card</b> into the job it does, or click a card and then click a bucket. Formative if it tracks the journey, summative if it measures against the standard. A wrong drop bounces the card back to the pool and costs the clean run. You are finished when the pool is empty.",
 hint:"Ask who the result is for. If it exists so that the instructor and the learner can change something while the module is still running, it is formative. If it exists to record whether the standard was met, it is summative. A score attached does not settle it. The job does.",
 html:`<p>Sorting a check by its job is what decides where it sits in the module. A check that exists to change what happens next belongs early enough for that to be possible. A check that exists for the record belongs at the end.</p>
 <div class="vs">
  <div class="a"><div class="vh">Formative \u00b7 tracks the journey</div><p>A warm-up, a lab, an exit ticket. Somebody acts on what it shows while the module is still running. An exit ticket showing that half the room missed a concept is worth having on Tuesday, when Wednesday can still change.</p></div>
  <div class="b"><div class="vh">Summative \u00b7 measures the standard</div><p>A knowledge check, a skills-based assessment, the capstone. Formal, graded, and answering one question: did this learner meet the objective? It arrives too late to change anything, which is not its job.</p></div>
 </div>
 <div class="terms"><div class="th">The default cadence for an immersive module</div><dl>
 <dt>Each lesson</dt><dd>The lesson, a lab or activity that acts as the formative check, and a quiz where the knowledge has to stick.</dd>
 <dt>Midway</dt><dd>A knowledge check placed early enough that a bad result can still change what happens next.</dd>
 <dt>Module end</dt><dd>A knowledge check, plus the skills-based evidence. Any module of two days or longer carries at least two SBAs.</dd>
 <dt>Course end</dt><dd>The capstone: integrative, collaborative, presented.</dd>
 </dl></div>
 <div class="spec"><div class="spec-h">Module 301 \u00b7 the cadence planned across ten lesson days</div><div class="spec-b">Day 1&nbsp;&nbsp;&nbsp;Lesson 301.1 \u00b7 GLAB 301.1.1 \u00b7 exit ticket&nbsp;&nbsp;<span class="an">formative</span><br>Day 3&nbsp;&nbsp;&nbsp;Lesson 301.2 \u00b7 GLAB 301.2.1 \u00b7 exit ticket&nbsp;&nbsp;<span class="an">formative</span><br>Day 5&nbsp;&nbsp;&nbsp;Midway knowledge check&nbsp;&nbsp;<span class="an">summative</span><br>Day 8&nbsp;&nbsp;&nbsp;SBA 301.1&nbsp;&nbsp;<span class="an">summative</span><br>Day 10&nbsp;&nbsp;SBA 301.2 \u00b7 KBA 301&nbsp;&nbsp;<span class="an">summative</span></div><div class="spec-n">The midway check sits on day 5 so that a bad result still has five days to act on. Two SBAs on different problems, so one weak performance is not the whole picture.</div></div>
 <p class="tight">Both formal instruments are written into a template, not a blank page: the <b>KBA Template</b> and the <b>SBA Template</b> are in ${gl('templates','templates &amp; links')}.</p>
 <p class="tight" style="color:var(--muted)">That is the immersive default. Shorter or specialized products flex, with approval. Sort the six checks below by the job each one does.</p>`,
 activity:{type:"sort",id:"arhs",points:12,
  buckets:[{k:"f",label:"Formative · tracks the journey"},{k:"s",label:"Summative · measures the standard"}],
  cards:[
   {t:"Warm-up discussion",k:"f"},
   {t:"The lab inside a lesson package",k:"f"},
   {t:"Exit ticket",k:"f"},
   {t:"Module-end knowledge check",k:"s"},
   {t:"SBA 301",k:"s"},
   {t:"Capstone",k:"s"}],
  fbGood:"Correct. The three on the left exist so that somebody can act while the module is still running. The three on the right exist to record whether the standard was met. Your module needs both, and the cadence decides where each one sits.",
  fbBad:"All sorted. The question that separates them is who the result is for and when: formative results are for adjusting now, summative results are for the record."},
 transition:"The cadence is settled: what evidence this module produces, and when. Next comes a real module situation, and the shape that has to carry those checks."},
{id:"mcomp",title:"Compose the module",crumb:"Unit 2 · Module composition",mins:8,
 bridge:"The standard is in front of you. This page puts it to work on a real module: what it needs, and a reason you can defend.",
 lead:"Now that the composition standard has been read, this is where it gets applied. Four situations cover most of what arrives, and each one tells you how the rule bends without breaking.",
 html:`<div class="box info"><span class="bh">Every module ends with an unaided task</span><p class="tight">Every module ends with a <b>summative task that poses a real problem the learner solves unaided</b>: the competency check. If a learner could finish having only followed instructions, it is not competency-based yet. The <em>type</em> of module changes how you get there, never whether you get there. Full detail lives in the Handbook \u2192 <b>What goes in a module</b>.</p></div>
 <p><strong>Why the answer is a pattern, not a number.</strong> Product Developers and the subject matter experts (SMEs) who own a domain ask the same thing: how many quizzes, labs, and assessments a module needs. There is no number, because a two-day vendor-constrained module and a six-lesson module we own end to end have genuinely different shapes. What is constant is the rule, and there are four recognizable situations that tell you how to apply it.</p>
 <div class="box rule"><span class="bh">What never changes, whatever the module</span><p class="tight">Every module ends with a summative task where the learner solves a real problem unaided. Duration and content ownership change how you get there. They never change whether you get there.</p></div>
 <p><strong>Alignment and sufficiency decide the rest.</strong> Both were defined two pages back, on “What goes in a module”: alignment means every assessment maps to an objective and every objective has evidence; sufficiency means a check goes wherever a learner could go wrong undetected before something high-stakes. Here they do the deciding: alignment tells you whether a piece belongs at all, and sufficiency tells you when to stop adding.</p>
 <table class="mtbl"><tr><th>Pattern</th><th>What it carries</th></tr><tr><td><b>Standard</b></td><td>Lessons with labs through the week, weekly graded evidence of individual performance, a module-end knowledge check and at least two skills-based assessments.</td></tr><tr><td><b>Short, one to two days</b></td><td>Lessons and labs, and one summative that is the competency check. Too short to carry a separate knowledge check and still leave room to practice.</td></tr><tr><td><b>Prep or foundational</b></td><td>Heavier scaffolding and frequent formative checks, closing on one summative that proves readiness for the module it feeds.</td></tr><tr><td><b>Vendor-constrained</b></td><td>Vendor content carries the knowledge; our own performance task sits on top, because a vendor quiz cannot show job performance.</td></tr></table>
 <p class="tight" style="color:var(--muted)">Match each real situation below to the pattern that fits it. Watch for the trap: the summative adapts, and never disappears.</p>`,
 coach:"Read each module situation, then <b>press one of the four pattern buttons under it</b>: Standard, Short, Prep / foundational, or Vendor-constrained. One card at a time, and each verdict explains itself before the next card unlocks. Watch for the trap: no situation drops the summative. A module that never fades to independent work is still a <b>Standard</b> module, built badly.",
 frame:function(){return {
   prev:"You read the standard for what a module contains, then planned when its checks happen.",
   now:"A module is several lesson days plus its assessments. You're deciding its overall shape.",
   role:"You are the Product Developer composing the module.",
   resp:"Match each situation to the right composition pattern.",
   use:"The Handbook section \u201CWhat goes in a module.\u201D",
   why:"This is the question your SMEs ask most. Answering it by pattern, not guesswork, is what makes a module competency-based.",
   next:"Next you drop one level down, from the shape of a whole module to how a single 240-minute day inside it is spent."
 };},
 activity:{type:"triage",id:"mcompt",points:12,fbGood:"Four situations, four patterns, and you spotted the anti-pattern for what it is. Size a module by which situation it is in, not by a count of quizzes.",fbBad:"Queue cleared. Re-read the ones you missed: duration and content ownership change how a module reaches its unaided task, never whether it has one.",
   buckets:["\uD83C\uDFAF Standard","\u26A1 Short (1\u20132 days)","\uD83E\uDDF1 Prep / foundational","\uD83D\uDD12 Vendor-constrained"],
   items:[
    {from:"MERN SWE",subj:"REST APIs module. 5 lessons",body:"A full module: you can teach, give guided labs, fade the scaffold, then have learners build an endpoint on their own. Time and content are yours.",ans:0,why:"Standard: run the full arc: teach \u2192 guided \u2192 fading \u2192 independent \u2192 a summative where they build unaided. This is the default every module aims for."},
    {from:"Data-adjacent course",subj:"Two-day module, tight timeline",body:"Only two days for this module. Only enough time for one teach-and-guided pass before learners need to perform.",ans:1,why:"Short: compress the ramp, keep the proof. Drop the mid-module checkpoint, not the summative, even two days ends with the learner doing the work rather than watching it."},
    {from:"IT Support (CompTIA)",subj:"Safety & terminology before the hands-on labs",body:"This module is prerequisite knowledge. Terminology and safety rules learners must have before they can touch equipment in later modules.",ans:2,why:"Prep / foundational: its check can be a knowledge check or gated readiness task rather than a full problem-solve, but only because it's honestly foundational, and only the minimum needed to unlock the hands-on work."},
    {from:"IT Support (CompTIA)",subj:"Vendor module teaches step-by-step only",body:"The CompTIA content walks learners through procedures step by step. You can't rewrite it, and inside it there's no room to pose an open problem.",ans:3,why:"Vendor-constrained: author the competency assessment on top: your own SBA posing a real problem, using the vendor material as input. Flag any equipment or authoring needs in the design phase, before development."},
    {from:"MERN SWE",subj:"Module that's all guided labs",body:"A developer proposes a module made entirely of guided labs learners follow to completion. No independent task at the end.",ans:0,why:"This is the anti-pattern, not a real type. The closest correct answer is Standard, which must FADE to independent work. A module that stays guided the whole way feels active but never proves mastery. Add a summative where the scaffold comes off."}]},
 transition:"You can size a module by pattern now instead of guessing at counts. Next you drop down a level, from the shape of a module to the shape of a single day inside it."},
{id:"s4",title:"Plan a lesson package",crumb:"Unit 2 · The lesson package",
 bridge:"A module reaches learners as a run of lesson packages. Planning one is the last decision Unit 2 asks for: what a package holds, and how its 240 minutes get spent.",
 mins:10,
 lead:"A lesson package is everything one day of the module needs: the lesson itself, the lab or activity that acts as its formative check, and a quiz where the knowledge has to stick. Planning it means deciding how 240 minutes are spent, and the plan has to clear the 75% activated-learning bar while still earning its objective.",
 
 brief:{from:"Product Developer · IT domain",re:"Lesson 301.2 — day plan needed",text:"This day is 240 minutes and the current draft is lecture-heavy. Rebuild it so the activated-learning meter clears the bar."},
 demo:{eg:"The first block I place: Warm-up discussion: 15 min, activated.",steps:["I anchor the skeleton first: warm-up opens the day, exit ticket closes it. That rhythm is non-negotiable; content fits <em>between</em>.","Then I budget the big activated block: a lab, before spending a single passive minute. Passive time is the luxury I buy last, inside the 25%.","The meter runs the same math QA does: watch it as you place. Your 240 minutes: build."]},
 frame:function(){const c=primary()||{domain:"chosen"};const obj=recall("objective");return {
   prev: obj ? ("You approved this objective: \u201C"+obj+"\u201D"): ("You're designing a lesson day for your "+c.domain+" module."),
   now:"That objective needs a lesson day built around it. 240 minutes, \u226575% activated.",
   role:"You are the Product Developer planning the lesson day.",
   resp:"Build the day so it earns its objective without slipping below the activated-learning bar.",
   use:"The Rhythm & Modality sections of the Handbook; the live meter.",
   why:"A day that drifts from its objective wastes the learner's time no matter how active it looks.",
   next:"The day you build is what the workplace review on the next page has to hold up around."
 };},
 coach:"<b>Drag blocks from the palette into the schedule</b> (clicking works too); select ✕ on a scheduled block to remove it. Watch the two meters: fill all 240 minutes, keep Activated ≥ 75%, and include the required elements (chips turn green). Then press Check my day.",
 hint:"A 90-minute lecture alone eats 37% of the day as passive time. Convert lecture into demo-along, labs, or discussion, and don't forget the day opens with a warm-up and closes with an exit ticket.",
 html:()=>`${(function(){const o=recall("objective");return o?`<div class="box info"><span class="bh">Designing toward</span><p class="tight">\u201C${o}\u201D</p></div>`:"";})()}<p><strong>The concept:</strong> skill comes from doing, so class time is budgeted, and listening costs the most.</p><div class="diag"><svg viewBox="0 0 720 78" role="img" aria-labelledby="d7-t"><title id="d7-t">The 75 percent activated-learning budget: select a segment</title><rect x="20" y="24" width="680" height="34" rx="9" fill="#f3eee6"/><g class="fdu hot" tabindex="0" role="button" aria-label="Activated ≥75%" data-name="Activated ≥75%" data-info="Discussion, labs, building, pair work, share-outs, anything where learners PRODUCE. This is where skill actually forms."><rect x="20" y="24" width="510" height="34" rx="9" fill="#1d5fa8"><animate attributeName="width" from="0" to="510" dur="1s" fill="freeze"/></rect><text x="265" y="46" text-anchor="middle" font-size="13" fill="#fff" font-weight="600">ACTIVATED ≥ 75%</text></g><g class="fdu hot" tabindex="0" role="button" style="animation-delay:.5s" aria-label="Passive ≤25%" data-name="Passive ≤25%" data-info="Listening and watching. Useful in doses: the budget caps it at a quarter of the day. A 90-minute lecture alone eats 37% of a 240-minute day."><rect x="530" y="24" width="170" height="34" rx="9" fill="transparent"/><text x="615" y="46" text-anchor="middle" font-size="12" fill="#5b6b7a">passive ≤ 25%</text></g><line x1="530" y1="16" x2="530" y2="66" stroke="#12283f" stroke-width="2.5"/></svg><div class="dcap">👆 <b>Select either segment.</b> The black line is the bar you’ll design against in a minute.</div></div><p>Guide references: ${gl('modality','modality & the 75% rule')} · ${gl('rhythm','assessment rhythm')}.</p>
 <div class="meta"><span class="mi">🔍</span><div><b>Design note:</b> this course budgets its own minutes by the rule it teaches: one warm-up, then simulations, builders, and review queues.</div></div><p>A lesson day has a <b>rhythm</b>. Two things anchor every day:</p>
 <p><b>The 75% bar is a floor, not a target.</b> \u201CActivated\u201D means the learner is doing, deciding, or producing, not watching. Lecture and demo have a place (they set up practice), but if they cross 25% of the day, the day has drifted from performance back to consumption. As you place blocks, watch the meter: it\u2019s telling you whether the day trains a skill or covers a topic.</p>
 <div class="spec"><div class="spec-h">A day that clears the bar &middot; lesson 301.2, 240 minutes</div>
 <div class="spec-b">09:00&nbsp; Warm-up discussion<span class="an"> &nbsp;15 min &middot; activated</span><br>
 09:15&nbsp; Demo-along: firewall rules<span class="an"> &nbsp;30 min &middot; activated</span><br>
 09:45&nbsp; Guided lab GLAB 301.2.1<span class="an"> &nbsp;90 min &middot; activated</span><br>
 11:15&nbsp; Break &nbsp;15 min<br>
 11:30&nbsp; Lecture: what the fault classes are &nbsp;30 min &middot; passive<br>
 12:00&nbsp; Pair troubleshooting<span class="an"> &nbsp;45 min &middot; activated</span><br>
 12:45&nbsp; Exit ticket<span class="an"> &nbsp;15 min &middot; activated</span></div>
 <div class="spec-n">195 of 240 minutes activated, or 81%. The lecture sits immediately before the practice that needs it, the longest block is the lab where the objective is earned, and the day opens and closes with the learner working.</div></div>
 <p><strong>Input is cheap in small doses and expensive in large ones,</strong> because a learner who has listened still cannot do the work. Practice blocks are where the objective gets earned, so they take the longest. Warm-up and exit ticket bracket the day and tell you whether it worked. Breaks are real and they count against the clock.</p>
 <p><strong>A day plan is also an access decision.</strong> A block that turns on hearing an unrecorded discussion, a lab timed so tightly that anyone using assistive technology falls behind, or a demo whose only record is what happened on screen, each narrow who can take part. The fix is structural: captioned media, a written record of anything spoken that carries instruction, and enough time in a block that working differently is not the same as working too slowly.</p>
 <div class="ruleline"><b>Before you commit a schedule,</b> point at the block where the objective actually gets earned. If you cannot, the day is a sequence of topics rather than a lesson.</div>
 <p><strong>In our courses.</strong> An IT Support day that is three hours of vendor video and a twenty-minute lab fails the bar and, more importantly, does not produce anyone who can resolve a ticket. A MERN day that front-loads all theory then runs one long build usually leaves no time for review, so the mistakes ship into the next lesson.</p>
 <p class="tight" style="color:var(--muted)">Build the day below and watch the meter.</p>`,
 activity:{type:"day",id:"s4d",points:15,total:240,
  palette:[
   {t:"Warm-up discussion",min:15,act:true,req:"warmup"},
   {t:"Lecture",min:30,act:false},
   {t:"Lecture (long)",min:60,act:false},
   {t:"Demo-along (learners follow on their machines)",min:30,act:true},
   {t:"Guided lab",min:60,act:true,req:"lab"},
   {t:"Guided lab (long)",min:90,act:true,req:"lab"},
   {t:"Pair troubleshooting scenario",min:30,act:true},
   {t:"Research activity + share-out",min:30,act:true},
   {t:"Exit ticket",min:15,act:true,req:"exit"}],
  reqs:[{k:"warmup",label:"Warm-up"},{k:"lab",label:"≥1 lab"},{k:"exit",label:"Exit ticket"},{k:"t240",label:"240 min filled"},{k:"a75",label:"Activated ≥75%"}],
  fbGood:"That day clears the bar: full, activated, and rhythmically correct: warm-up in, exit ticket out, hands on a lab in between. This is the shape of every day you'll design.",
  fbBad:"Check the red chips. That's exactly what QA (and learners) would feel. Adjust and check again."}},
{id:"sws",title:"Design the workplace around the lessons",crumb:"Unit 2 · Workplace design",
 bridge:"Objectives, module shape, assessment cadence, a lesson day: the learning is planned, and the workplace it runs inside is not.",
 frame:{now:"Five workplace decisions from the module draft are waiting on a verdict.",role:"You are deciding the working conditions the lessons happen in.",resp:"Approve the proposals that hold the workplace the course promises, and send back the ones that cut it.",use:"The workplace expectations in the Handbook.",why:"Employers hire for the rehearsal of the job as much as for the technical skill."},
 mins:8,
 lead:"Immersive courses run as a simulated workplace. The day opens with a stand-up, roles rotate, work arrives as tickets, and the course closes with a handoff rather than a test. Those conditions are a design decision, made module by module.",
 coach:"<b>✓ Approve</b> a decision that holds the workplace and <b>✗ Send back</b> one that cuts a thread. On a send-back, pick the thread it cuts from the list that appears. A wrong stamp bounces with a note and costs the clean run. You are finished when all five decisions carry a verdict. The six threads are in the diagram above.",
 hint:"Six threads carry the simulation: the daily cadence, rotating roles, the running job scenario, shared artifacts, reflection on performance, and the capstone handoff. Every module decision reinforces a thread or cuts one.",
 demo:{eg:"Design decision: “Lab 2 arrives as a ticket: ‘Client reports intermittent Wi-Fi drops in the east office. Investigate, resolve, and document your fix.’”",steps:[
 "Name the thread. Two of them: the job scenario, because work arrives as a client problem, and shared artifacts, because the output leaves as documentation.",
 "Check the voice. It addresses the learner as the professional inside the scenario, not as a student completing exercise 4.",
 "Verdict: ✓ Approve. Name the thread, then check the voice, on each of your five."]},
 html:`<div class="ruleline"><b>A module can be finished</b> and still break the simulation: every lesson written, every assessment planned, and the learner handed a worksheet.</div>
 <p><strong>What the simulation is doing.</strong> The framing puts learners in the conditions of employment: collaboration, communication, and work that arrives incomplete. When the framing drops, the content still gets taught and the job stops being rehearsed.</p>
 <div class="vs"><div class="a"><div class="vh">Holds the simulation</div><p>“A client reports intermittent Wi-Fi drops in the east office. Diagnose the fault, resolve or escalate it, and record what you did in the ticket.”</p></div><div class="b"><div class="vh">Breaks it</div><p>“Quiz 3: Wireless troubleshooting. Answer the questions below and submit for grading.”</p></div></div>
 <p class="tight" style="color:var(--muted)">Same content, same objective, same twenty minutes. One rehearses the job, the other tests recall of it.</p>
 <p><strong>The six threads.</strong> The daily cadence, rotating roles, the running job scenario, shared artifacts, reflection on performance, and the handoff finale. A module keeps the simulation by keeping these running through it; it loses the simulation one thread at a time, usually without anyone deciding to drop one.</p>
 <p><strong>Where it breaks.</strong> In the wording more than in the schedule.
 An assessment labelled \u201CQuiz 3\u201D instead of arriving as a ticket. Instructions addressing learners as students rather than as the professionals the scenario names.</p>
 <div class="diag"><svg viewBox="0 0 720 212" role="img" aria-labelledby="sws-d"><title id="sws-d">The six threads a module has to carry for the workplace simulation to hold</title><rect x="12" y="12" width="336" height="50" rx="9" fill="#fff" stroke="#e8e1d6" stroke-width="1.5"/><circle cx="32" cy="37" r="11" fill="#e3edf8" stroke="#1d5fa8" stroke-width="1.5"/><text x="32" y="41" text-anchor="middle" font-size="11" font-weight="700" fill="#164a85">1</text><text x="52" y="33" font-size="11.5" font-weight="700" fill="#1c2b3a">Cadence held</text><text x="52" y="49" font-size="10.5" fill="#42566a">Stand-ups and retros sit in the lesson days</text><rect x="362" y="12" width="336" height="50" rx="9" fill="#fff" stroke="#e8e1d6" stroke-width="1.5"/><circle cx="382" cy="37" r="11" fill="#e3edf8" stroke="#1d5fa8" stroke-width="1.5"/><text x="382" y="41" text-anchor="middle" font-size="11" font-weight="700" fill="#164a85">2</text><text x="402" y="33" font-size="11.5" font-weight="700" fill="#1c2b3a">Roles used</text><text x="402" y="49" font-size="10.5" fill="#42566a">Activities require the scrum lead and note-taker</text><rect x="12" y="74" width="336" height="50" rx="9" fill="#fff" stroke="#e8e1d6" stroke-width="1.5"/><circle cx="32" cy="99" r="11" fill="#e3edf8" stroke="#1d5fa8" stroke-width="1.5"/><text x="32" y="103" text-anchor="middle" font-size="11" font-weight="700" fill="#164a85">3</text><text x="52" y="95" font-size="11.5" font-weight="700" fill="#1c2b3a">Scenario voice</text><text x="52" y="111" font-size="10.5" fill="#42566a">Work arrives as tickets and specs, not as Quiz 3</text><rect x="362" y="74" width="336" height="50" rx="9" fill="#fff" stroke="#e8e1d6" stroke-width="1.5"/><circle cx="382" cy="99" r="11" fill="#e3edf8" stroke="#1d5fa8" stroke-width="1.5"/><text x="382" y="103" text-anchor="middle" font-size="11" font-weight="700" fill="#164a85">4</text><text x="402" y="95" font-size="11.5" font-weight="700" fill="#1c2b3a">Shared artifacts</text><text x="402" y="111" font-size="10.5" fill="#42566a">Docs, commits and handoff notes a team would keep</text><rect x="12" y="136" width="336" height="50" rx="9" fill="#fff" stroke="#e8e1d6" stroke-width="1.5"/><circle cx="32" cy="161" r="11" fill="#e3edf8" stroke="#1d5fa8" stroke-width="1.5"/><text x="32" y="165" text-anchor="middle" font-size="11" font-weight="700" fill="#164a85">5</text><text x="52" y="157" font-size="11.5" font-weight="700" fill="#1c2b3a">Reflection on performance</text><text x="52" y="173" font-size="10.5" fill="#42566a">How they worked, alongside what they learned</text><rect x="362" y="136" width="336" height="50" rx="9" fill="#fff" stroke="#e8e1d6" stroke-width="1.5"/><circle cx="382" cy="161" r="11" fill="#e3edf8" stroke="#1d5fa8" stroke-width="1.5"/><text x="382" y="165" text-anchor="middle" font-size="11" font-weight="700" fill="#164a85">6</text><text x="402" y="157" font-size="11.5" font-weight="700" fill="#1c2b3a">The handoff finale</text><text x="402" y="173" font-size="10.5" fill="#42566a">The capstone is presented work, not a test</text></svg><div class="dcap">Each design decision in the queue reinforces one of these threads or cuts one.</div></div>
 <p class="tight" style="color:var(--muted)">Five decisions from the module draft are below. Approve the ones that hold, and name the thread that each send-back cuts.</p>`,
 activity:{type:"review",id:"swsr",points:15,queueTag:"Module draft · WS integration",
  items:[
   {content:"<strong>Daily rhythm:</strong> “Each day opens with a 10-minute stand-up: yesterday, today, blockers: logged in the team channel.”",
    good:true,
    why:"✓ Approved. The cadence thread, made concrete, and it normalizes surfacing blockers early, which is the workplace habit the whole simulation exists to build.",
    reasons:[]},
   {content:"<strong>Lab voice:</strong> instructions address learners as “students completing Exercise 4” and remind them the work “counts toward your grade.”",
    good:false,
    why:"✗ Sent back: breaks the scenario voice. Inside the simulation, work arrives as tickets and tasks addressed to professionals; grading language lives in the syllabus layer, not the workplace layer.",
    reasons:[
     {t:"It breaks the in-simulation voice. Work should arrive as professional tasks, with grading language kept out of the workplace layer",ok:true,fb:""},
     {t:"Exercises shouldn’t be numbered",fb:"Numbering is fine, tickets have numbers too. The register is the problem, not the count."},
     {t:"Grades shouldn’t exist in immersive courses",fb:"Grades absolutely exist. The KBA that closes the module is one. The flaw is where the grading voice intrudes, not that grading happens."}]},
   {content:"<strong>Roles:</strong> “Team roles rotate weekly; this module’s schedule names who leads stand-up and who owns the documentation log.”",
    good:true,
    why:"✓ Approved. The roles thread with named ownership. Rotation means everyone practices leading and everyone practices documenting.",
    reasons:[]},
   {content:"<strong>Work products:</strong> “Deliverables are submitted privately to the instructor; there is no shared documentation trail.”",
    good:false,
    why:"✗ Sent back: cuts the artifact thread. Workplace output lives where the team can build on it: shared docs, ticket logs, runbooks. Instructor-only submission turns work products back into homework.",
    reasons:[
     {t:"It cuts the shared-documentation thread. Workplace artifacts must be visible to the team that depends on them",ok:true,fb:""},
     {t:"Instructors shouldn’t collect work at all",fb:"Instructors still assess. The flaw is that nothing lives in the shared trail, not that the instructor sees it."},
     {t:"All work must always be public to the whole cohort",fb:"“Always public” overshoots, some assessment stays private. The team-facing artifacts are what belong in the shared trail."}]},
   {content:"<strong>Module finale:</strong> “Capstone: a 20-question quiz covering the module’s concepts.”",
    good:false,
    why:"✗ Sent back: wrong instrument for the thread. The capstone is the simulation’s finale: work presented as a real handoff, evidence of <em>doing</em>. A quiz measures knowing; that’s what the KBA is for.",
    reasons:[
     {t:"The capstone thread is a presented handoff of real work. A quiz measures the wrong thing and belongs to the KBA, not the finale",ok:true,fb:""},
     {t:"Quizzes are never acceptable",fb:"Quizzes are fine, as quizzes. KBA 301 is one. The finale is the one place the simulation must end as work, not as a test."},
     {t:"Capstones should be optional",fb:"The capstone is the simulation’s payoff and a required deliverable in immersive courses. The fix is its format, not its existence."}]}],
  fbGood:"Five for five: you reviewed the module the way the simulation experiences it. Lessons teach skills; the workplace threads turn them into habits.",
  fbBad:"Queue cleared. The test behind every send-back: which thread. Cadence, roles, scenario, artifacts, reflection, handoff. Does the decision reinforce or cut?"}},
{id:"d2x",title:"Unit 2 check: write the objective and its assessment",crumb:"Unit 2 \u00b7 Unit check",mins:12,
 bridge:"Unit 2 worked over objectives, module shape, cadence and a day plan, all of it written by somebody else. It closes with you writing the pair a module hangs on.",
 frame:{now:"Everything so far was judging work somebody else wrote. This is your own.",role:"You are writing the first page of your own module.",resp:"Write one objective and the assessment that would prove it. Model answers appear once you commit yours.",use:"The objectives and assessment rhythm sections of the Handbook.",why:"This is Part 1 of your capstone at one-fifth the size, so the capstone is not the first time you do it."},
 lead:"Everything in this unit was reviewing work someone else wrote. Now write your own. This is the same job as Part 1 of your capstone, at one-fifth the size, so the capstone is not the first time you do it.",
 html:()=>`<div class="box rule"><span class="bh">Write the objective and its assessment</span><p class="tight">Design has handed you this module objective:</p>
 <p class="tight" style="font-family:var(--mono);background:#f3f0ea;color:var(--text);border-left:3px solid var(--indigo);padding:8px 11px;margin:8px 0">${primary()&&primary().id==="software"?"\u201CGiven a feature specification and the team\u2019s repository, implement a documented REST endpoint that passes the provided tests.\u201D":"\u201CGiven a workstation with a reported fault, diagnose the cause and document the resolution to the team standard.\u201D"}</p>
 <p class="tight">You are building lesson 2 of that module. Write one lesson objective that breaks the module objective into a teachable step, then write the assessment that measures it and name it to convention. Nothing is scored. When you save, you get an experienced developer\u2019s version and the criteria to check yours against.</p></div>`,
 coach:"Write the lesson objective in the first box and the assessment that measures it in the second, named to convention, then press Save. An experienced developer\u2019s version appears beside yours.",
 activity:{type:"journal",id:"d2xw",
  fields:[
   {label:"1. Your lesson objective. One observable behavior, with the conditions and what counts as good enough.",
    ph:"Given \u2026 the learner will \u2026 to \u2026",short:"Box 1 · the objective",checks:[{"want":"configure|build|troubleshoot|diagnose|document|resolve|identify|implement|write|create|deploy|verify|escalate|route|assemble|score|audit|repair|query|install","ok":"Uses a verb somebody can watch happen.","no":"No measurable verb found. Configure, diagnose, document and resolve can be watched; the objective needs one."},{"avoid":"understand|know|learn|appreciate|familiar|aware|grasp|comprehend","ok":"No unmeasurable verbs.","no":"Contains understand, know or similar. Two instructors cannot agree on whether that happened."},{"avoid":" and ","ok":"One behavior, not two.","no":"Contains \"and\", which often joins two behaviors. If it does, split it: they get assessed separately anyway."},{"minWords":8,"ok":"Specific enough to build from.","no":"Short enough that a reviewer would have to invent the topic. Name what the verb acts on."}]},
   {label:"2. The assessment that measures it, named to convention, and one line on why it measures that objective and not something else.",
    ph:"e.g. R-GLAB 301.2.1 \u2026 because \u2026",short:"Box 2 · the assessment",checks:[{"pattern":"(GLAB|ALAB|KBA|SBA|R-GLAB|Quiz|CAP)\s*[0-9]","ok":"Named to convention.","no":"No file name to convention. An assessment nobody can find by name is not planned yet."},{"want":"because|since|so that|measures","ok":"Says why it measures that objective.","no":"No reason given. The point is why this instrument measures this objective and not something adjacent."}]}],
  modelHead:"An experienced developer\u2019s version, and how to check yours",
  model:()=>(primary()&&primary().id==="software"?`<p class="tight"><b>Lesson objective.</b> \u201CGiven a feature specification and a running Express server, implement a single GET endpoint that returns the documented shape and passes the provided test.\u201D</p>
  <p class="tight"><b>Assessment.</b> R-GLAB 301.2.1, a graded guided lab. The learner writes the route, runs the test suite, and submits the passing output alongside the endpoint documentation. It measures the objective because the learner produces the endpoint and its documentation, which is what the objective names. A quiz on HTTP verbs would measure something adjacent and easier.</p>`:`<p class="tight"><b>Lesson objective.</b> \u201CGiven a workstation that fails to reach the network and a provided checklist, identify the layer at fault and state the next diagnostic step, with the reasoning recorded.\u201D</p>
  <p class="tight"><b>Assessment.</b> R-GLAB 301.2.1, a graded guided lab. The learner works a seeded fault on a live machine and submits the layer they identified, the step they took next, and why. It measures the objective because the learner produces the diagnosis and the reasoning, which is exactly what the objective names. A quiz on the OSI model would measure something adjacent and easier.</p>`)+`
  <div class="box rule" style="margin-top:10px"><span class="bh">Check your own against these</span><ul class="blist"><li>\u2610 One observable verb, and only one behavior.</li><li>\u2610 Conditions stated: what the learner has, or does not have, while performing.</li><li>\u2610 A criterion: what counts as good enough.</li><li>\u2610 The objective is a step toward the module objective, not a restatement of it.</li><li>\u2610 The assessment produces the thing the verb names. If the verb is diagnose, the learner diagnoses something.</li><li>\u2610 Every learner can produce that evidence. If your assessment assumes someone can see a color-coded output or hear an unrecorded exchange, it measures their access rather than their skill.</li><li>\u2610 If you drafted either box with a tool, you can say what you checked before keeping it. Unit 3 sets that standard; the habit starts here.</li><li>\u2610 Named to convention, with R- if it is graded.</li></ul></div>
  <p class="tight" style="color:var(--muted)">Where yours differs, the useful question is not whose wording is nicer. It is whether a reviewer could build your assessment from your objective without asking you anything.</p>`},
 transition:"You have written the pair the whole module hangs on. Unit 3 builds the materials that get a learner there."}]},
{day:3,mod:"3 · Building content",lessons:[
{id:"d3i",title:"Unit 3 · Building content",crumb:"Unit 3 · Unit opener",
 bridge:"Unit 2 decided what learners must be able to do and how you will know they can. The decisions are made and the files are still empty. Unit 3 produces what goes in them.",
 frame:{now:"The design decisions are made and the files are still empty.",role:"You are the Product Developer producing the materials your own design called for.",resp:"Read what this unit expects of you, then work through the builds.",why:"This is the unit where most of a course's actual hours get made."},
 mins:6,
 lead:"The design decisions are made. This unit is about producing the materials: writing labs learners can follow, making them accessible, and correcting the AI drafts you use along the way.",
 coach:"Read the objectives and the loop diagram, then answer the warm-up and Save to begin.",
 html:`<p><strong>By the end of Unit 3 you'll be able to:</strong></p>
 <ul class="obj"><li>Review a guided-lab draft against the GLAB skeleton, section by section.</li><li>Audit module elements against the accessibility launch prerequisite.</li><li>Take an AI draft from fluent-but-wrong to shippable, and own every line.</li></ul><div class="diag"><svg viewBox="0 0 720 96" role="img" aria-labelledby="da-t"><title id="da-t">The AI workflow loop: select each stage</title><g class="fdu hot" tabindex="0" role="button" style="animation-delay:0.0s" aria-label="AI drafts" data-name="AI drafts" data-info="Seconds, 70% of the way there. Prompt from the Handbook library, filled from the approved objective, never a blank page."><rect x="24" y="30" width="150" height="48" rx="10" fill="#e3edf8" stroke="#1d5fa8" stroke-width="1.5"/><text x="99" y="58" text-anchor="middle" font-size="12.5" fill="#164a85" font-weight="600">AI drafts</text></g><g class="fdu hot" tabindex="0" role="button" style="animation-delay:0.22s" aria-label="You verify" data-name="You verify" data-info="Every statistic, path, version, and claim. [VERIFY] tags resolved or cut. Fluent is not the same as accurate."><rect x="210" y="30" width="150" height="48" rx="10" fill="#fff" stroke="#e8e1d6" stroke-width="1.5"/><text x="285" y="58" text-anchor="middle" font-size="12.5" fill="#1c2b3a" font-weight="600">You verify</text></g><g class="fdu hot" tabindex="0" role="button" style="animation-delay:0.44s" aria-label="You correct" data-name="You correct" data-info="House voice restored, scope trimmed to the objective, structure fixed."><rect x="396" y="30" width="150" height="48" rx="10" fill="#fff" stroke="#e8e1d6" stroke-width="1.5"/><text x="471" y="58" text-anchor="middle" font-size="12.5" fill="#1c2b3a" font-weight="600">You correct</text></g><g class="fdu hot" tabindex="0" role="button" style="animation-delay:0.66s" aria-label="You own it" data-name="You own it" data-info="Your name goes on it at QA. “The AI wrote it” is never a defense: the reviewer checks the material, not the prompt."><rect x="582" y="30" width="122" height="48" rx="10" fill="#e7f4ee" stroke="#1f9d76" stroke-width="1.5"/><text x="643" y="58" text-anchor="middle" font-size="12.5" fill="#186b52" font-weight="600">You own it</text></g><path class="fdu" style="animation-delay:0.12s" d="M 178 54 L 202 54" stroke="#1d5fa8" stroke-width="2.5" marker-end="url(#arrA)"/><path class="fdu" style="animation-delay:0.34s" d="M 364 54 L 388 54" stroke="#1d5fa8" stroke-width="2.5" marker-end="url(#arrA)"/><path class="fdu" style="animation-delay:0.56s" d="M 550 54 L 574 54" stroke="#1d5fa8" stroke-width="2.5" marker-end="url(#arrA)"/><defs><marker id="arrA" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" fill="#1d5fa8"/></marker></defs></svg><div class="dcap">👆 <b>Select each stage.</b> The first is the machine’s; the other three are permanently yours.</div></div><div class="pullquote"><div class="pq">“Learners do better when extraneous material is cut, even when it’s interesting.”</div><div class="pa">Richard Mayer’s coherence principle, <em>Multimedia Learning</em>, the research behind deleting the fun-fact from an AI draft.</div></div><div class="video"><iframe src="https://www.youtube.com/embed/IlU-zDU6aQ0" title="Marty Lobdell: Study Less, Study Smart (Pierce College)" loading="lazy" allowfullscreen></iframe></div><div class="vidcap">🎯 <b>Watch task, first 15 minutes, or save the hour for later.</b> catch his case for why re-reading fails, then connect it to why our labs teach more than our lectures do. (<a href="https://www.youtube.com/watch?v=IlU-zDU6aQ0" target="_blank" rel="noopener">Open on YouTube</a>)</div>`,
 activity:{type:"journal",id:"d3ij",fields:[
  {label:"Warm-up: what's your biggest worry about using AI to draft learning content? (Keep it. You'll check it against this unit's failure patterns at the unit check.)",ph:"Honestly, I worry that…"}],modelHead:"What to watch for, and what this unit will do about it",model:`<p class="tight">The worries that come up most: it invents facts confidently, it writes fluent material that teaches nothing, it does not know our learners, and using it feels like cheating.</p><p class="tight">The first three are real and this unit gives you a method for each. The fourth is worth naming directly: using AI is not the problem. Handing over the judgment is. By the end of the unit you should be able to say exactly which parts of a draft are yours.</p>`}},

{id:"slb",title:"Build the lab steps",crumb:"Unit 3 · Lab steps",mins:10,
 bridge:"Planning is over. The first thing the plan called for is a guided lab, and it has to survive a room of twenty people working at different speeds. This draft does not.",
 frame:{now:"A guided lab draft has come back written fast. The bones are right; the steps are not usable.",role:"You are the developer repairing a lab before it reaches a classroom.",resp:"Select each broken step and choose the repair that makes it followable.",use:"The labs section of the Handbook.",why:"A lab is the largest block of class time we control, and a step that stalls one learner stalls the room."},
 lead:"A guided lab draft came back from a developer who wrote it fast. The bones are right and the steps are not usable yet. Your job is to repair them, because a lab is the biggest block of class time we control.",
 brief:{from:"Product Developer \u00b7 IT domain",re:"GLAB 301.2.1, draft steps need work",text:"I got the structure down but the steps need another pass. Fix the ones that would not survive a room of learners working alone."},
 html:`
 <p><strong>What a lab step has to do.</strong> A learner working alone reads one step at a time and acts on it. If a step leaves them deciding what you meant, they stop and wait for the instructor, and the whole room slows to the speed of one conversation. So a step is finished when someone who has never seen the software could carry it out and know whether it worked.</p>
 <div class="diag"><svg viewBox="0 0 720 242" role="img" aria-labelledby="slb-d"><title id="slb-d">The parts of a usable lab step</title><rect x="12" y="12" width="696" height="44" rx="9" fill="#f3f0ea" stroke="#e8e1d6" stroke-width="1.5"/><text x="360" y="40" text-anchor="middle" font-size="13" font-family="IBM Plex Mono, monospace" fill="#1c2b3a">Open Windows Security, then Firewall, and confirm it shows On</text><circle cx="30" cy="88" r="11" fill="#e3edf8" stroke="#1d5fa8" stroke-width="1.5"/><text x="30" y="92" text-anchor="middle" font-size="11" font-weight="700" fill="#164a85">1</text><text x="50" y="85" font-size="11.5" font-weight="700" fill="#1c2b3a">One action</text><text x="50" y="101" font-size="10.5" fill="#42566a">Two verbs means two steps, and a hidden place to get stuck.</text><circle cx="30" cy="128" r="11" fill="#e3edf8" stroke="#1d5fa8" stroke-width="1.5"/><text x="30" y="132" text-anchor="middle" font-size="11" font-weight="700" fill="#164a85">2</text><text x="50" y="125" font-size="11.5" font-weight="700" fill="#1c2b3a">Named specifics</text><text x="50" y="141" font-size="10.5" fill="#42566a">The exact menu, field, value, or file. Never "as needed".</text><circle cx="30" cy="168" r="11" fill="#e3edf8" stroke="#1d5fa8" stroke-width="1.5"/><text x="30" y="172" text-anchor="middle" font-size="11" font-weight="700" fill="#164a85">3</text><text x="50" y="165" font-size="11.5" font-weight="700" fill="#1c2b3a">A visible result</text><text x="50" y="181" font-size="10.5" fill="#42566a">What the learner should see, so they can tell success from silent failure.</text><circle cx="30" cy="208" r="11" fill="#e3edf8" stroke="#1d5fa8" stroke-width="1.5"/><text x="30" y="212" text-anchor="middle" font-size="11" font-weight="700" fill="#164a85">4</text><text x="50" y="205" font-size="11.5" font-weight="700" fill="#1c2b3a">The reason, if unclear</text><text x="50" y="221" font-size="10.5" fill="#42566a">One clause, so they can recover when their screen differs.</text></svg><div class="dcap">Read it as someone with no context. One thing to do, no guessing, and a way to know it worked.</div></div>
 <div class="box info"><span class="bh">One action, named specifics, a visible result</span><ul class="blist"><li><b>One action.</b> A step that contains two verbs is two steps. \u201CInstall the client and configure the connection\u201D hides a place to get stuck.</li><li><b>Named specifics.</b> The exact menu, field, value, or file. \u201COpen settings and adjust as needed\u201D is a decision handed to someone who does not have the information to make it.</li><li><b>A visible result.</b> What the learner should see when the step worked. Without it they cannot tell success from silent failure, and they carry the failure into the next step.</li><li><b>The reason, where it is not obvious.</b> One clause. Learners who know why a step exists can recover when their screen does not match yours.</li></ul></div>
 <div class="box rule"><span class="bh">The test before you ship a step</span><p class="tight">Read it as someone with no context. Is there exactly one thing to do, do I know precisely where and what to type, and will I know whether it worked? If any answer is no, the step is not finished.</p><p class="tight">Then read it again as someone using a screen reader, or someone who cannot distinguish red from green. Any instruction that lives only inside a screenshot, or that depends on spotting a color, fails for them and passes for everyone else, which is why it survives review. Same question either way: can this person carry out the step and know it worked?</p></div>
 <p>Labs are written into the <b>Lab Template</b>, in ${gl('templates','templates &amp; links')}. It already carries the section structure, so a lab that fights the template usually has a structural problem rather than a wording one.</p>
 <p><strong>What this looks like in our courses.</strong> For IT Support, \u201CConfigure the firewall appropriately\u201D leaves a learner staring at a settings panel; \u201CIn Windows Defender Firewall, open Advanced Settings, create an inbound rule blocking TCP port 23, and confirm it appears in the rule list\u201D does not. For MERN, \u201CSet up your environment\u201D versus \u201CRun npm install, then confirm the server starts on port 3000 and returns 200 at /health.\u201D</p>
 `,
  coach:"<b>Select only the steps you think are broken.</b> Three of the six are. Selecting a sound step tells you so and counts as a misstep, so read before you click rather than working down the list in order. Selecting a broken one opens the repair options; choose the right one and the step rewrites itself in the draft. The counter underneath tracks steps fixed and missteps taken, and a clean run has none.",
 hint:"Look for two verbs in one step, a value you cannot see (appropriately, as needed, properly), a step with no visible result, and an instruction that assumes the learner already knows where something lives.",
 demo:{eg:"Worked example. The draft step: \u201CStep 2: Install VirtualBox and set up a VM with reasonable specs.\u201D",steps:[
  "Step 1. Count the actions. Install, and set up a VM. That is two things, so it is two steps, and the learner can stall on either without you knowing which.",
  "Step 2. Find the invisible value. \u201CReasonable specs\u201D means nothing to someone who has not built a VM before. Reasonable to whom, and measured how?",
  "Step 3. Check for a result. Nothing here tells the learner what a working VM looks like, so they cannot tell whether to continue.",
  "Step 4. Rewrite it. \u201CInstall VirtualBox 7.0 and confirm it opens\u201D, then \u201CCreate a VM with 4 GB RAM and a 40 GB disk, and confirm it appears in the VirtualBox list.\u201D Two steps, named values, visible results.",
  "Now repair the three below the same way."]},
 activity:{type:"fix",id:"slbf",points:15,
  intro:"Lab objective: \u201CConfigure a secure baseline on a Windows workstation and verify it.\u201D The draft steps:",
  sents:[
   {t:"Step 1: Log in to the lab workstation using the credentials in the course shell.",bad:false},
   {t:" Step 2: Open the security settings and configure them appropriately for a work environment.",bad:true,
    fixes:[
     {t:"Add \u201Cif you are unsure, ask your instructor.\u201D",fb:"That moves the problem into the room instead of fixing it. Thirty learners asking the same question is the cost of the vague step, not a solution to it."},
     {t:"Replace with: \u201COpen Windows Security, then Firewall & network protection, and confirm the firewall is On for Domain, Private, and Public.\u201D",ok:true,fb:"Named location, named setting, and a result the learner can see. One action, and they know whether it worked."},
     {t:"Change \u201Cappropriately\u201D to \u201Ccorrectly.\u201D",fb:"Both words hide the same missing information. The learner still does not know which settings or what value."}],
    fixed:" Step 2: Open Windows Security, then Firewall & network protection, and confirm the firewall is On for Domain, Private, and Public."},
   {t:" Step 3: Install the endpoint agent and register the device with the management console.",bad:true,
    fixes:[
     {t:"Split it: \u201CInstall the endpoint agent from the provided installer, and confirm the tray icon shows Connected.\u201D Then a separate step for registering.",ok:true,fb:"Two actions became two steps, each with a visible result. A learner who stalls now stalls somewhere you can identify."},
     {t:"Leave it, since both actions are part of the same task.",fb:"They are related but not simultaneous, and either can fail on its own. A learner stuck between them cannot tell you where they are."},
     {t:"Add a screenshot of the finished state.",fb:"A screenshot helps, but it does not fix a step that asks for two things at once. Split first, then illustrate."}],
    fixed:" Step 3: Install the endpoint agent from the provided installer, and confirm the tray icon shows Connected."},
   {t:" Step 4: Run the baseline verification script.",bad:true,
    fixes:[
     {t:"Add where the script lives and what a pass looks like: \u201CFrom the lab folder, run verify-baseline.ps1. A pass prints OK for all six checks.\u201D",ok:true,fb:"The learner now knows where the script is and how to read the output. Without the expected result they cannot tell a pass from a partial run."},
     {t:"Add \u201Cthe script is in the usual place.\u201D",fb:"Usual to whom? A learner on day one has no usual place. Name the path."},
     {t:"Leave it, since the script name is enough.",fb:"The name tells them what to run but not where it is or what success looks like, which are the two things that stop people."}],
    fixed:" Step 4: From the lab folder, run verify-baseline.ps1. A pass prints OK for all six checks."},
   {t:" Step 5: Take a screenshot of the passing output and attach it to your submission.",bad:false},
   {t:" Step 6: If any check fails, review the checklist and try again, then note which check failed and what you changed.",bad:false}],
  fbGood:"Every step now has one action, a named value, and a result the learner can see, and none of them depend on seeing a color or reading text inside an image. That is the difference between a lab a room can work through and a lab that turns into a queue at the instructor\u2019s desk.",
  fbBad:"Read the repairs on the ones you changed. The pattern is the same each time: one action per step, name the thing you are referring to, and say what the learner should see when it worked."},
 transition:"You have repaired steps a learner could actually follow. Next, the assessment items that measure whether any of it stuck."},
{id:"s5b",title:"Write a KBA item",crumb:"Unit 3 · Writing an item",
 bridge:"The lab is built and it carries the weekly practice the plan called for. The graded quiz that closes the module is still an empty file, and the items in it have to be written by somebody.",
 frame:{now:"The queue is clear. The bank still needs items, and nobody else is going to write them.",
  role:"You are the author this time, not the reviewer.",
  resp:"Write one knowledge-check item for the objective below, then check it against the rules you were enforcing a page ago.",
  use:"The KBA rules in the Handbook, and the five verdicts you gave.",
  why:"Reviewing teaches you to spot a broken item. Only writing one shows you where it breaks."},
 mins:10,
 lead:"A KBA is the graded quiz that closes the module, and every item in it is a measuring instrument. Writing one is the smallest piece of assessment authoring there is, and a module needs dozens of them.",
 coach:"<b>Type your item into the two boxes</b>: the stem in the first, the four options in the second with the correct one marked. Nothing is graded. When you <b>Save</b>, an experienced developer's version appears next to yours, with a checklist you can run your own item through.",
 hint:"Start from the objective, not from a fact you happen to know. Write the correct answer first, then build three distractors out of misconceptions you have actually seen, not filler. If a distractor is obviously silly, it is not doing any work, and the item is a three-option item in practice.",
 html:`<p><strong>The objective this item has to serve.</strong> An item that is not tied to a stated objective is trivia, however interesting it is. So the item you write here answers to one line:</p>
 <div class="box rule"><span class="bh">The objective</span><p class="tight">Given a workstation that cannot reach a network resource, the learner will identify the OSI layer the fault sits at, and state the next diagnostic step.</p></div>
 <div class="spec"><div class="spec-h">KBA 301 · item 7, approved</div><div class="spec-b">Stem: a workstation shows a 169.254.14.2 address after boot. Which service failed to respond?<br>A) DNS &nbsp;<span class="an">the learner who blames name resolution for every fault</span><br>B) DHCP &nbsp;<span class="an">the key: one defensible answer</span><br>C) NTP &nbsp;<span class="an">the time service confused with the address service</span><br>D) SMTP &nbsp;<span class="an">mail, reached for when the symptom is unclear</span></div><div class="spec-n">The stem can be answered before the options are read. Each wrong option names a mistake somebody has actually made.</div></div>
 <p><strong>What a knowledge check can and cannot carry here.</strong> That objective names two behaviors, and only one of them a quiz item can measure honestly. Identifying a layer from a described symptom is knowledge, and an item can test it. Performing the diagnostic step is performance, and no multiple-choice item can measure it: that is what the lab and the SBA are for. Writing the item well starts with naming which half you are measuring.</p>
 <div class="box info"><span class="bh">The rules you enforced, turned on your own writing</span><ul class="blist"><li><b>One idea.</b> If a wrong answer could mean two different misunderstandings, split the item.</li><li><b>A complete stem.</b> The learner should know what is being asked before reading a single option.</li><li><b>Four plausible options, one defensible answer.</b> Every distractor should be a mistake somebody has actually made.</li><li><b>No giveaways.</b> Watch length, grammar, absolutes, and the a/an tell.</li><li><b>It stands alone.</b> It must not depend on another item to make sense.</li></ul></div>
 <div class="meta"><span class="mi">🔍</span><div><b>Design note:</b> this page teaches by having you build rather than by explaining again. That is the pattern to copy. If a module defines something and never asks a learner to produce one, the module has covered a topic rather than taught a skill.</div></div>
 <p class="tight">In real work this is not typed into a blank box. Items are written into the KBA Template, which is in ${gl('templates','templates &amp; links')} alongside the SBA and Lab templates.</p>
 <p class="tight" style="color:var(--muted)">Write your item below. The model answer appears once you save yours, so write first.</p>`,
 activity:{type:"journal",id:"s5bw",
  fields:[
   {label:"1. Your stem. One complete question, tied to the objective above.",ph:"A workstation can reach other machines on its own subnet but cannot reach any external address. Which OSI layer is the most likely location of the fault?",short:"Box 1 · the stem",checks:[{"want":"?","ok":"A complete question.","no":"No question mark. The stem should be answerable before the options are read."},{"avoid":"all of the above|none of the above","ok":"No filler options in the stem.","no":"Mentions all or none of the above, which measures test-taking rather than knowledge."},{"minWords":8,"ok":"Enough context to answer.","no":"Too short to set up the fault. A learner should know what is being asked before reading an option."}]},
   {label:"2. Your four options. Mark the correct one, and say in one line what misconception each distractor represents.",ph:"A) Layer 1 - ... B) Layer 2 - ... C) Layer 3 (correct) - ... D) Layer 7 - ...",short:"Box 2 · the options",checks:[{"want":"correct|key|answer","ok":"The correct option is marked.","no":"Nothing marks which option is the key."},{"minWords":14,"ok":"Each distractor is explained.","no":"Too short to say what misconception each wrong option represents. A distractor you cannot explain is filler."}]}],
  modelHead:"An experienced developer's version, and how to check yours",
  model:`<p class="tight"><b>Stem.</b> "A workstation reaches other hosts on its own subnet but cannot reach any address outside it. Which layer is the most likely location of the fault?"</p>
  <p class="tight"><b>Options.</b> A) Layer 1, physical. B) Layer 2, data link. <b>C) Layer 3, network (correct).</b> D) Layer 7, application.</p>
  <p class="tight"><b>What each distractor is doing.</b> Layer 1 catches the learner who reaches for cabling whenever anything fails to connect. Layer 2 catches the more plausible mistake, that local connectivity working and remote failing is a switching problem. Layer 7 catches the learner who has not separated transport from application. Every one of them is a real misconception, so a wrong answer tells you which one this learner holds.</p>
  <div class="box rule" style="margin-top:10px"><span class="bh">Check your own against these</span><ul class="blist"><li>&#9744; The stem is answerable before the options are read.</li><li>&#9744; It measures the knowledge half of the objective, not the performance half.</li><li>&#9744; Exactly one option is defensible to somebody who knows the material.</li><li>&#9744; Every distractor names a mistake you have actually seen, and you can say what it is.</li><li>&#9744; No option is longest-and-most-qualified, and no absolutes give the answer away.</li><li>&#9744; The item makes sense on its own, with no other item in view.</li></ul></div>
  <p class="tight" style="color:var(--muted)">If a distractor made you pause because you could not say what misconception it represents, that is the one to rewrite. Filler options quietly turn a four-option item into a two-option guess.</p>`},
 transition:"One item exists and it meets the standard. A bank holds dozens, written by several people, and none of them reach a cohort unread."},
{id:"s5",title:"Run the KBA review queue",crumb:"Unit 3 · Item review",
 bridge:"KBA 301 needs a full bank of items, and one of them is now written. Five more drafts, from several people, are sitting in the review queue unread.",
 frame:{now:"Five draft items are queued against KBA 301, from a bank that has never been reviewed.",role:"You are the reviewer standing between a draft item bank and a live quiz.",resp:"Approve each item that meets the rules, and name the exact violation on each one you send back.",use:"The KBA rules in the Handbook, and the KBA Template the bank was written into.",why:"A flawed item measures test-taking instead of knowledge, and it does that to every learner who sits it."},
 mins:8,
 lead:"Checking an item uses the same standard you just wrote against, turned on somebody else's work. Five drafts are waiting on a verdict, and \u201Cthis one feels weak\u201D is not one. Approve what passes, and send the rest back with the violation named.",
 brief:{from:"Product Quality & Experience (QA)",re:"KBA 301 — draft item bank review",text:"Five draft items are in your queue, from a bank that has not been reviewed. Give each a verdict plus the specific violation."},
 demo:{eg:"Q: Which OSI layer handles routing?&nbsp; A) Layer 2 &nbsp;B) Layer 3 &nbsp;C) Layer 4 &nbsp;D) Layer 5",steps:["Structure before content: concise stem, no negatives, no absolutes, no grammatical giveaways. Clean so far.","Options: parallel, mutually exclusive, plausible, in logical order, one best answer. Yes, it’s recall, and recall, cleanly built, is legal.","Verdict: ✓ Approve. Work your queue the same way: judge the structure before you judge the difficulty."]},
 coach:`Stamp each item <b>✓ Approve</b> or <b>✗ Send back</b>. Sending one back opens a list of violations, and you pick the one that names the defect. A wrong stamp or a wrong violation holds the item open and costs you the clean run. The queue closes with its summary once all five carry a verdict. Rules: ${gl('kba','writing KBAs')}.`,
 hint:"Read the structure before the difficulty. The tells are an unmarked negative, an a/an vowel clue, an absolute in the stem, overlapping options, and an item that quotes another item. Clean recall is legal.",
 html:`<p>A KBA is the graded quiz that closes the module, and every item in it is a measuring instrument. A giveaway, an overlap, or an answer leaked from another item moves the score away from knowledge and toward test-taking. Review is where that gets caught, because the live quiz catches nothing.</p>
 <div class="ruleline"><b>One item, one idea.</b> Two concepts in a single stem means a wrong answer tells you nothing about which one the learner missed.</div>
 <div class="box rule"><span class="bh">The failure modes to send back</span><ul class="blist"><li><b>Trick question.</b> Measures careful reading rather than knowledge.</li><li><b>Give-away.</b> Grammar, option length, or an absolute that points at the key.</li><li><b>Overlap.</b> Two options a knowledgeable person could defend, so no single best answer exists.</li><li><b>Leakage.</b> An item that quotes or depends on another item in the same bank.</li><li><b>Wrong instrument.</b> Recall asked where the objective says <em>configure</em>. That performance belongs to the SBA.</li></ul></div>
 <div class="vs"><div class="a"><div class="vh">A usable verdict</div><p>Unmarked negative in the stem, and All of the above standing in as a fourth option.</p></div><div class="b"><div class="vh">A stalled verdict</div><p>This one feels weak. Take another look before it goes in the bank.</p></div></div>
 <div class="meta"><span class="mi">🔍</span><div><b>Design note:</b> two items in this queue sit outside your home domain deliberately. Where subject expertise cannot carry you, the standard has to.</div></div>
 <p class="tight">The bank was written into the <b>KBA Template</b>, in ${gl('templates','templates &amp; links')}. Reviewing against the structure you author in is the point: the rules are already encoded there.</p>
 <p class="tight" style="color:var(--muted)">Five items, five verdicts. Name the defect on every one you send back.</p>`,
 activity:{type:"review",id:"s5r",points:15,queueTag:"KBA 301 · draft bank",
  items:[
   {content:"Q: How will the text and photo be aligned using the code below?<br><span class=\"mono\">CSS: .photo { float: right; }</span> &nbsp;<span class=\"mono\">HTML: My Cat &lt;img src=\"cat.jpg\" class=\"photo\"&gt;</span><br>A) Photo on the right, text wraps on the left &nbsp;B) Photo on the left, text wraps on the right &nbsp;C) Photo centered above the text &nbsp;D) Photo below the text",
    good:true,
    why:"✓ Approved. Higher-order thinking: the learner applies CSS knowledge to predict behavior instead of recalling a definition. Concise stem, parallel, mutually exclusive options. This is the framework's own model of a good item.",
    reasons:[]},
   {content:"Q: Which of the following is not an example of an input device?<br>A) Keyboard &nbsp;B) Mouse &nbsp;C) Scanner &nbsp;D) All of the above",
    good:false,
    why:"✗ Sent back: an unmarked negative (\u201Cnot\u201D), the \u201Can\u201D vowel giveaway, and \u201CAll of the above\u201D as a one-off crutch: three violations in one item.",
    reasons:[
     {t:"Unmarked negative in the stem, a grammatical (\u201Can\u201D) giveaway, and \u201CAll of the above\u201D used as a lazy default",ok:true,fb:""},
     {t:"The stem is too short. Stems should give more context",fb:"Concise stems are the rule, not the violation. The problems are the negative, the giveaway, and the crutch option."},
     {t:"It tests recall, and recall questions aren't allowed",fb:"Recall items are allowed: KBAs mix recall with higher-order. The violations here are structural, not cognitive."}]},
   {content:"Q: How often should backups always be verified?<br>A) Never &nbsp;B) Sometimes &nbsp;C) Often &nbsp;D) Always",
    good:false,
    why:"✗ Sent back: \u201Calways\u201D in the stem is an absolute, and the options overlap. \u201Csometimes,\u201D \u201Coften,\u201D and \u201Calways\u201D aren't mutually exclusive, so there's no one best answer.",
    reasons:[
     {t:"An absolute in the stem, and overlapping options with no single best answer",ok:true,fb:""},
     {t:"The options should be in alphabetical order",fb:"Logical ordering matters, but reordering these wouldn't fix them, they overlap. No arrangement produces one best answer."},
     {t:"It needs an image to be engaging",fb:"Engagement isn't the standard, measurement is. The item fails because it can't be answered, not because it's plain."}]},
   {content:"Q: Which port does HTTPS use by default?<br>A) 21 &nbsp;B) 80 &nbsp;C) 443 &nbsp;D) 3389",
    good:true,
    why:"✓ Approved. Yes. It's recall, and that's fine: KBAs mix recall with higher-order items. This one is cleanly built: concise stem, one best answer, parallel real-port distractors in logical order, no giveaways.",
    reasons:[]},
   {content:"Q: As you saw in question 2, scanners are input devices. Which category does a printer belong to, and why is documentation important in IT support?<br>A) Output; because clients require it &nbsp;B) Input; because of compliance &nbsp;C) Output; documentation is optional &nbsp;D) Storage; because of backups",
    good:false,
    why:"✗ Sent back: it leans on another question (\u201Cas you saw in question 2\u201D. Items must never feed each other answers) and it's double-barreled, asking two unrelated things at once, so the options can't be parallel.",
    reasons:[
     {t:"It references another question's content and asks two unrelated things in one item",ok:true,fb:""},
     {t:"Printers are too easy a topic for a KBA",fb:"Difficulty isn't the violation. The structure is: cross-item leakage plus a double-barreled stem."},
     {t:"The options are too long",fb:"Length isn't the issue. The options can't be parallel because the stem asks two different questions."}]}],
  fbGood:"Five verdicts, five correct, every violation named. Your own items get the same review at QA.",
  fbBad:"Queue cleared. Where you missed, re-read the verdict. The skill being built is naming the exact violation rather than sensing that something is off."}},
{id:"sbab",title:"Build the SBA",crumb:"Unit 3 · Writing the SBA",mins:8,
 bridge:"A knowledge item measures what a learner knows, and KBA 301 now has one. The module also owes evidence of what a learner can do, and nobody has written that yet.",
 frame:{now:"The knowledge check has an item. The module's performance evidence is still an empty file.",
  role:"You are the author of the module's skills-based assessment.",
  resp:"Write one SBA task for the module objective below, then say how it is scored and what the learner hands in.",
  use:"The labs, SBAs & capstones section of the Handbook, and the SBA Template.",
  why:"A module that never asks one learner to perform alone cannot report whether that learner can perform."},
 lead:"An item measures what a learner knows. The task you write here measures what one learner can do, alone, on a problem nobody walked them through. Every module owes both, and only one of them has been written so far.",
 coach:"<b>Type the task into the first box and the scoring into the second.</b> Nothing is graded. The model stays hidden until you press <b>Save</b>, so write yours first. When you save, an experienced developer's version appears beside yours, with a checklist to run your draft through.",
 hint:"Start from what the learner hands over at the end, then work back to the conditions that make it theirs. Name the time, the materials they may open, and that the work is individual. If your draft could be finished in a document without touching a machine or a repository, it is a quiz.",
 html:()=>`<p><strong>What an SBA is.</strong> The skills-based assessment is the graded task where one learner solves a real problem alone, then submits the product and the reasoning behind it. Guided labs were the ramp toward it. Nothing here is scaffolded.</p>
 <div class="box rule"><span class="bh">The module objective this task has to prove</span><p class="tight" style="font-family:var(--mono);background:#f3f0ea;color:var(--text);border-left:3px solid var(--indigo);padding:8px 11px;margin:8px 0">${primary()&&primary().id==="software"?"\u201CGiven a feature specification and the team\u2019s repository, implement a documented REST endpoint that passes the provided tests.\u201D":"\u201CGiven a workstation with a reported fault, diagnose the cause and document the resolution to the team standard.\u201D"}</p></div>
 <p><strong>Alone is the constraint doing the work.</strong> A team lab tells you the team can do the thing, because the strongest member carries the result. So the task states its conditions: what the learner may open, what they produce, and that the work is theirs. A quiz stretched to ninety minutes is still a quiz.</p>
 <p><strong>Two of them, on different problems.</strong> Any module of two days or longer carries at least two SBAs. One performance is a sample, and two is a pattern.</p>
 <p class="tight">Tasks are written into the SBA Template in ${gl('templates','templates &amp; links')}. Every graded item carries a rubric, and its criteria come from the objectives.</p>
 <p class="tight" style="color:var(--muted)">Write your task below. The model appears once you save yours, so write first.</p>`,
 activity:{type:"journal",id:"sbabw",
  fields:[
   {label:"1. The task. What the learner performs, working alone, and under what conditions.",
    ph:"R-SBA 301. Working alone, in one sitting, the learner \u2026"},
   {label:"2. How it is scored, and what the learner hands in as evidence.",
    ph:"Submits \u2026 Scored on a rubric with one row per objective: \u2026"}],
  modelHead:"An experienced developer\u2019s version, and how to check yours",
  model:()=>(primary()&&primary().id==="software"?`<p class="tight"><b>The task.</b> R-SBA 301. Each learner gets a feature specification and their own branch of the team repository. Working alone in one 90-minute sitting, they build the endpoint the specification describes and document it. They may open the language documentation and their own notes from the module. They may not open a classmate\u2019s branch.</p>
  <p class="tight"><b>The evidence.</b> The pull request, the passing output of the provided test suite, and the endpoint documentation: method, path, request shape, response shape, and error cases.</p>
  <p class="tight"><b>The scoring.</b> A rubric with one row per objective, at Exemplary, Proficient and Needs Improvement. Rows: the endpoint returns the documented shape. Input is validated before use, and the tests pass unmodified. The documentation is enough for another developer to call the endpoint. SBA 301.2 poses a different problem, a write path with a failure case, so two performances make a pattern.</p>`:`<p class="tight"><b>The task.</b> R-SBA 301. Each learner gets a workstation carrying a seeded fault and the ticket the user filed, which describes the symptom rather than the cause. Working alone in one 90-minute sitting, they restore the machine. They may open the vendor documentation and their own notes from the module. They may not ask a classmate, and the instructor answers only about the environment.</p>
  <p class="tight"><b>The evidence.</b> A knowledge-base article on the Student KB Template. It names the fault, the tests run to isolate it, the change made, and how the fix was confirmed.</p>
  <p class="tight"><b>The scoring.</b> A rubric with one row per objective, at Exemplary, Proficient and Needs Improvement. Rows: the cause is isolated by a documented test before any setting changes. The resolution is verified rather than assumed. The write-up lets a colleague repeat the fix. SBA 301.2 seeds a different class of fault, so two performances make a pattern.</p>`)+`
  <div class="box rule" style="margin-top:10px"><span class="bh">Check your own against these</span><ul class="blist"><li>\u2610 The task names something the learner produces, not a topic they cover.</li><li>\u2610 The conditions are on the page: time, what may be opened, and that the work is individual.</li><li>\u2610 Nothing in it can be finished by following steps you already supplied.</li><li>\u2610 The evidence is an artifact a grader can open, and every learner can produce it.</li><li>\u2610 Every rubric row traces to a stated objective, and every objective has a row.</li><li>\u2610 A second SBA on a different problem exists, because this module runs longer than two days.</li></ul></div>
  <p class="tight" style="color:var(--muted)">Where yours differs, ask whether a learner reading your task alone would know what to hand in and when to stop.</p>`},
 transition:"The task is written and its scoring is still one sentence long. A sentence is not a rubric yet, and a rubric only counts if two people scoring the same submission land in the same place. Test one."},
{id:"rubw",title:"Write the rubric",crumb:"Unit 3 · Writing a rubric",mins:8,
 bridge:"SBA 301 exists as a task, and the line that scores it is still one sentence. A sentence cannot be handed to a second grader, and a learner sitting the task has nothing to aim at.",
 frame:{now:"The performance task is written. What scores it is one line of intent.",
  role:"You are writing the rubric that gets attached to SBA 301 in Canvas.",
  resp:"Write two criteria for the task you drafted two lessons ago, each at three levels a second reader could tell apart.",
  use:"The rubrics section of the Handbook, and the module objective SBA 301 measures.",
  why:"A rubric is what turns one grader's reading of a submission into a score somebody else can reproduce."},
 lead:"Two lessons back you wrote SBA 301, and its scoring is still a sentence. Every graded item carries a rubric, and the criteria come from the objective the task measures rather than from the steps a learner walks through. Write two rows, each at three levels.",
 coach:"<b>Type one criterion into each box</b>, with its three levels underneath: Exemplary, Proficient, Needs Improvement. Nothing is graded. Wording a grader has to interpret costs you the thing the rubric exists for, because two people then score the same submission differently. When you <b>Save</b>, an experienced developer's rows appear beside yours with a checklist to run your own through.",
 hint:"Write the Proficient level first, because that is the line a submission passes or misses. Then ask what a submission would have to add to reach Exemplary, and what would be missing at Needs Improvement. Where two levels differ by one adverb, the grader is guessing.",
 html:function(){const swe=primary()&&primary().id==="software";return `<p><strong>Where the criteria come from.</strong> SBA 301 measures one objective: ${swe?"implement a documented REST endpoint that passes the provided tests":"diagnose the reported fault and document the resolution to the team standard"}. Each row scores one part of that sentence.</p>
 <div class="vs"><div class="a"><div class="vh">Traces to the objective</div><p>${swe?"Documents the endpoint so another developer can call it.":"Documents the resolution so a colleague can repeat the fix."}</p></div><div class="b"><div class="vh">Traces to the activity</div><p>Worked the six lab steps in the order given.</p></div></div>
 <div class="ruleline"><b>No trace, no row.</b> A criterion that does not lead back to an objective gets cut.</div>
 <div class="spec"><div class="spec-h">R-SBA 301 &middot; rubric row 3, drafted</div><div class="spec-b">Criterion: ${swe?"documents the endpoint for another developer":"documents the resolution to the team standard"}<span class="an"> &nbsp;the objective's own wording</span><br>Exemplary 3 &nbsp;<span class="an">${swe?"method, path, request shape, response shape, error cases":"names the fault, the confirming test, and the check that proved the fix"}</span><br>Proficient 2 &nbsp;<span class="an">${swe?"method, path and response shape, no error cases":"names the fault and the fix, with no confirming test"}</span><br>Needs improvement 1 &nbsp;<span class="an">${swe?"reports that the endpoint works":"reports that the machine works"}</span></div><div class="spec-n">Each level names something a reader can find in the submission. Canvas shows five per criterion at most.</div></div>
 <p class="tight">Wording rules: ${gl('rubrics','rubrics &amp; building them in Canvas')}. These rows score the task in the SBA Template: ${gl('templates','templates &amp; links')}. Where a task permits an AI assistant, three Integrity Rubric criteria join yours: ${gl('ai','AI standards')}.</p>
 <p class="tight" style="color:var(--muted)">Write two rows below. The model appears once you save.</p>`;},
 activity:{type:"journal",id:"rubww",
  fields:[
   {label:"1. Your first criterion, at three levels. Name what is being judged, then what Exemplary, Proficient and Needs Improvement each look like.",
    ph:"Criterion: isolates the cause before changing settings\nExemplary: …\nProficient: …\nNeeds improvement: …",
    short:"Box 1 · criterion one",
    checks:[{"want":"exemplary|proficient|needs improvement|developing","ok":"Three levels are named.","no":"No levels named. A criterion on its own is a heading, and a grader has nothing to score against."},{"avoid":"steps|instructions|followed|attended|participated","ok":"Scores the objective rather than the activity.","no":"Scores the steps of the activity. Criteria come from the objective, so a row about working through instructions measures compliance."},{"avoid":"appropriately|as needed|as appropriate|good understanding|excellent|adequate|strong","ok":"No wording a grader has to interpret.","no":"Contains wording such as \"appropriately\" or \"excellent\". A reader cannot tell two levels apart from an adverb."},{"minWords":20,"ok":"Enough wording to tell the levels apart.","no":"Too short to carry three levels a second grader could apply without seeing an example."}]},
   {label:"2. Your second criterion, at three levels, and the objective both of your rows trace back to.",
    ph:"Criterion: …\nExemplary: … Proficient: … Needs improvement: …\nBoth rows trace to the objective: “…”",
    short:"Box 2 · criterion two and its trace",
    checks:[{"want":"objective","ok":"The rows are traced to an objective.","no":"No objective named. A criterion that does not lead back to a stated objective gets cut."},{"want":"exemplary|proficient|needs improvement|developing","ok":"Three levels are named on this row too.","no":"No levels named on the second row."},{"pattern":"[0-9]","ok":"The levels carry points.","no":"No points on the levels. A rubric total that does not reconcile with the gradebook is a QA finding."},{"minWords":20,"ok":"Enough wording to tell the levels apart.","no":"Too short. Each level has to name something a grader can find in the submission."}]}],
  modelHead:"An experienced developer's rows, and how to check yours",
  model:function(){const swe=primary()&&primary().id==="software";return (swe?`<p class="tight"><b>Row 1.</b> Implements the endpoint to the specification. <b>Exemplary 3:</b> returns the documented shape, and validates the request body before it is used. <b>Proficient 2:</b> returns the documented shape, with the body taken as given. <b>Needs improvement 1:</b> returns a shape the specification does not describe.</p>
  <p class="tight"><b>Row 3.</b> Documents the endpoint for another developer. <b>Exemplary 3:</b> method, path, request shape, response shape and the error cases. <b>Proficient 2:</b> method, path and response shape. <b>Needs improvement 1:</b> the pull request states that the endpoint works.</p>`:`<p class="tight"><b>Row 1.</b> Diagnoses the reported fault. <b>Exemplary 3:</b> states a suspected cause and the observation behind it, then runs the test that confirms it. <b>Proficient 2:</b> states the cause after testing, with nothing said about what pointed there. <b>Needs improvement 1:</b> names the fix and no cause.</p>
  <p class="tight"><b>Row 3.</b> Documents the resolution to the team standard. <b>Exemplary 3:</b> a colleague could repeat the fix from the write-up without asking a question. <b>Proficient 2:</b> the change is recorded, and one step would need asking about. <b>Needs improvement 1:</b> the entry states that the machine works.</p>`)+`
  <p class="tight"><b>The row that was cut.</b> A draft row scored whether the learner worked the diagnostic tools in the order the lab taught. That is the activity, and the objective says nothing about order, so it came out.</p>
  <div class="box rule" style="margin-top:10px"><span class="bh">Check your own against these</span><ul class="blist"><li>&#9744; Every row traces to a stated objective, and every objective has a row.</li><li>&#9744; No row scores the order the activity was worked through.</li><li>&#9744; A reader can tell the levels apart without being shown an example.</li><li>&#9744; Each level names something visible in the submission, not a quality of the learner.</li><li>&#9744; The points reconcile with what the gradebook expects for SBA 301.</li><li>&#9744; Learners get the simplified rubric; the look-fors go to the instructor version.</li></ul></div>
  <p class="tight" style="color:var(--muted)">Where a level made you reach for an adverb, that is the level to rewrite. An adverb is where two graders part company.</p>`;}},
 transition:"Two rows exist, and the wording reads clearly to the person who wrote it. That proves nothing on its own. A rubric holds when a second scorer reads the same submission and lands on the same number, so the next thing to do with it is test that."},
{id:"s7",title:"Test whether your rubric holds",crumb:"Unit 3 · Rubric calibration",
 bridge:"The rubric rows for SBA 301 exist, and so far only the person who wrote them has read them. Wording that reads clearly to its author proves nothing: the test is whether a second grader reaches the same score from it.",
 frame:{now:"A submission has already been scored once. You are the second scorer.",role:"You are testing whether a rubric produces the same result in a second pair of hands.",resp:"Score the submission on each dimension, then compare with an experienced developer's scoring.",use:"The AI Integrity Rubric, and the rubrics section of the Handbook.",why:"Where two scorers land in different places, the wording is what has to change, not the scorers."},
 mins:8,
 lead:"A rubric holds when two people scoring the same submission land in the same place. Testing that takes a piece of work somebody has already scored. Score this one dimension by dimension, then compare.",
 demo:{eg:"Dimension 1, Purposeful AI Use. The submission reads: “I asked the AI for a plan, then reordered its steps based on the symptoms.”",steps:["I score against the anchors, never my mood: explaining <em>how</em> AI was used earns a 2 on this dimension.","But the reorder is <em>refinement</em>: visible judgment applied to the output. Refinement is what separates a 3 from a 2.","I’d score it 3, then check my reasoning against the anchor text. Now score all three dimensions yourself; we compare after."]},
 coach:`Read the submission, then <b>choose a score from 0 to 3</b> on each of the three dimensions. Score all three before you press <b>Compare with expert scoring</b>. Comparing early turns this into copying, and every score locks once you compare. The dimension-by-dimension comparison is the finish line. The rubric: ${gl('ai','AI standards')}.`,
 hint:"Explaining how AI was used earns a 2. A 3 needs visible refinement: a step added, an order changed, or a suggestion rejected for a stated reason.",
 html:`<p>A rubric exists so that two graders reach the same score, and so a learner knows the target before submitting. Criteria come from the objectives rather than from the steps of the activity, because what is being measured is whether the capability was demonstrated.</p>
 <div class="spec"><div class="spec-h">R-SBA 301 · rubric, row 2 of 4</div><div class="spec-b">Criterion: isolates the fault before changing settings<br>Exemplary 3 &nbsp;<span class="an">names the suspected cause, runs one test that confirms it, then changes one setting</span><br>Proficient 2 &nbsp;<span class="an">runs a test before changing settings, without naming the cause first</span><br>Needs improvement 1 &nbsp;<span class="an">changes settings first, then reports which one restored service</span></div><div class="spec-n">Each level names something a grader can see in the submission, and the row traces to a stated objective. Canvas shows a maximum of five levels per criterion, and the points have to reconcile with the gradebook.</div></div>
 <div class="ruleline"><b>Two graders, one score.</b> Where the line between Proficient and Needs Improvement moves with the grader, the descriptions are not observable yet.</div>
 <div class="vs"><div class="a"><div class="vh">Observable</div><p>Isolates the cause with a documented test before any change.</p></div><div class="b"><div class="vh">Adjectives with points attached</div><p>Demonstrates strong troubleshooting. Shows excellent organization.</p></div></div>
 <div class="box info"><span class="bh">The AI Integrity Rubric</span><p class="tight">Where a task permits AI, three criteria go in alongside your own, each scored 0 to 3: <b>purposeful use</b>, <b>verification and human judgment</b>, and <b>responsible use and reflection</b>. A pass is 2 or better on all three. Scoring a submission an experienced reviewer has already scored, then comparing, is how a grader gets calibrated to those anchors.</p></div>
 <p>Learners get the simplified rubric so they know the target before they start. Instructors get the full version with look-fors: the common wrong turns, what partial credit looks like, and an example of work at each level.</p>
 <p class="tight">Rows are built in Canvas from the same criteria: ${gl('templates','Canvas: adding rubrics')}. The wording rules live in ${gl('rubrics','rubrics &amp; building them in Canvas')}.</p>
 <p class="tight" style="color:var(--muted)">Score all three dimensions below, then compare. Where you differ from the expert, ask which score the wording supports.</p>`,
 activity:{type:"rubric",id:"s7r",points:15,
  dossier:{meta:"GLAB 402.1.1 · AI-assisted troubleshooting plan · Learner: J.R.",
   text:"\u201CI asked the AI assistant to draft a troubleshooting plan for the ticket. Its first plan skipped checking the event logs, so I added that step and reordered it to check hardware last since the symptoms pointed to software. I used its wording for the client-facing summary but rewrote the technical steps from what we did in GLAB 402.1.1. One thing it suggested. Resetting the BIOS. I left out because it didn't match the symptoms and I couldn't verify it was safe on our hardware.\u201D"},
  dims:[
   {t:"Purposeful AI Use: used AI intentionally and explained how it supported the task?",ans:3,why:"Expert: 3. Explains how AI was used AND how the approach was refined (added a step, reordered): refinement pushes past a 2."},
   {t:"Verification & Human Judgment: checked the output and applied their own thinking?",ans:3,why:"Expert: 3. Caught the missing step, reordered on evidence, rejected an unverifiable suggestion: strong independent judgment."},
   {t:"Responsible Use & Reflection: appropriate, acknowledged use with real reflection?",ans:2,why:"Expert: 2. Acknowledged and appropriate, with honest notes on what was kept and cut, but the reflection stays task-level, so it meets rather than exceeds."}],
  fbGood:"3 / 3 / 2 = 8: a clear pass, scored exactly like the expert. Note what earned the 3s: visible refinement, described rather than asserted.",
  fbBad:"Compare with the expert calls above: the calibration point: explanation earns a 2; visible refinement and judgment earn the 3."}},
{id:"sax",title:"Run the accessibility audit",crumb:"Unit 3 · Accessibility audit",
 bridge:"The lab, the assessments and the rubric are built, and Module 301 still does not move until somebody answers who can actually use them.",
 frame:{now:"Six elements of Module 301 are queued at the accessibility gate.",role:"You are the last accessibility check before the module leaves the team.",resp:"Rule on each element against WCAG 2.1 Level AA, and name the check it failed on the ones you send back.",use:"The accessibility essentials section of the Handbook, and the Canvas accessibility standards.",why:"An inaccessible lab is not a lower-quality lab. It is one some learners cannot complete at all."},
 mins:8,
 lead:"Accessibility is a condition of release rather than a later improvement, so Module 301 stops here until every element passes. Six are queued. Approve what meets the standard, and name the failure on the rest.",
 brief:{from:"Product Quality & Experience (QA)",re:"Module 301 — accessibility audit before Delivery Check",text:"Six elements are queued for the accessibility gate. Nothing in this module releases until they pass. The test is the same each time: same information, equivalent ease of access."},
 demo:{eg:"Element: recorded lecture narration over slides. No captions, no transcript.",steps:["One test, always: does a learner with a disability get the <em>same information</em> with <em>equivalent ease</em>? This information exists only as audio.","A deaf or hard-of-hearing learner gets nothing, and so does anyone in a loud room. Captions plus a transcript are required for media, not optional polish.","Verdict: ✗ Send back, missing captions/transcript. Run your six elements through the same single test."]},
 coach:`Rule on each of the six elements. <b>✓ Approve</b> what meets the standard, <b>✗ Send back</b> what does not, then pick the check it failed. A wrong call leaves the element open in the queue and costs you the clean run. The audit is finished when all six carry a verdict. The checklist: ${gl('access','accessibility essentials')}.`,
 hint:"One test decides every element: can a learner with a disability get the same information and interactions with substantially equivalent ease? Then name which check it failed.",
 html:`<p>Accessible has a legal definition: the same information and the same interactions, with substantially equivalent ease of use. It is verified rather than assumed, and it is a prerequisite for launch. Per Scholas learners include people working by screen reader, keyboard, magnification, and captions.</p>
 <div class="diag" role="group" aria-label="Contrast examples: select a pair for its ratio verdict"><div style="display:flex;flex-wrap:wrap;justify-content:center"><span class="swatch hot" tabindex="0" role="button" data-name="White on navy" data-info="15.6:1, far above the bar. Safe for body text at any size." style="background:#12283f;color:#ffffff">White on navy</span><span class="swatch hot" tabindex="0" role="button" data-name="Ink on white" data-info="14.9:1: the default for a reason." style="background:#ffffff;color:#1c2b3a;border:1.5px solid #e8e1d6">Ink on white</span><span class="swatch hot" tabindex="0" role="button" data-name="Gray on gray" data-info="1.9:1, FAILS. Low-vision learners lose this content entirely; so does anyone in sunlight." style="background:#d4d4d4;color:#8a8a8a">Gray on gray</span><span class="swatch hot" tabindex="0" role="button" data-name="Cream on cream" data-info="1.3:1, FAILS. Decorative at best; never for text." style="background:#f7efdc;color:#e6d9b8">Cream on cream</span></div><div class="dcap">👆 <b>Select a pair</b> to see its contrast ratio and verdict. A pair you have to squint at fails somebody.</div></div>
 <div class="ruleline"><b>Eight checks,</b> each one a yes or no on the element in front of you.</div>
 <ul class="cl"><li><b>Text alternatives.</b> Alt text says what the image tells the learner: a network diagram gets its topology. Decorative images take empty alt.</li>
 <li><b>Real text.</b> Code and output are selectable text. A screenshot of a terminal cannot be read aloud, zoomed, or copied.</li>
 <li><b>Contrast.</b> 4.5:1 for body text, 3:1 for large text.</li>
 <li><b>Color is never the only signal.</b> Pair it with a label, an icon, or text.</li>
 <li><b>Link text describes its destination.</b> Screen readers list links out of context, and a page of select here is unusable.</li>
 <li><b>Keyboard reach.</b> Every control works from the keyboard, with a visible focus ring.</li>
 <li><b>Captions and transcripts.</b> Spoken instruction is captioned, and audio-first material gets a transcript.</li>
 <li><b>Real headings, in order.</b> Screen-reader users navigate by heading structure, and bold text sized up is invisible to it.</li></ul>
 <div class="box rule"><span class="bh">The standard we hold</span><p class="tight"><b>WCAG 2.1 Level AA.</b> WCAG is the Web Content Accessibility Guidelines, the standard Per Scholas holds every course to, and AA is the conformance level we ship at. Where an element cannot meet it, the fix is an accessible equivalent that teaches the same thing.</p></div>
 <div class="meta"><span class="mi">🔍</span><div><b>Design note:</b> this course meets the standard it asks you to enforce. Every diagram carries a text title, every interaction has a keyboard path, contrast passes, and animation respects reduced-motion settings.</div></div>
 <p class="tight">Canvas adds requirements of its own, in ${gl('templates','the Canvas accessibility standards')}, and the Delivery Check is run against them.</p>
 <p class="tight" style="color:var(--muted)">Run each queued element against the eight checks, and name the one it failed.</p>`,
 activity:{type:"review",id:"saxr",points:15,queueTag:"Module 301 · accessibility audit",
  items:[
   {content:"A 12-minute chaptered demo video with closed captions and a downloadable transcript.",
    good:true,
    why:"\u2713 Approved. Captions plus a transcript: both required for media, and chaptering helps everyone navigate.",
    reasons:[]},
   {content:"Network architecture diagram. Alt text: <span class=\"mono\">\u201Cimage.png\u201D</span>",
    good:false,
    why:"\u2717 Sent back: alt text must concisely describe what the image shows (\u201CRouter connecting three VLANs to the internet through a firewall\u201D), not restate the filename. A screen-reader user currently gets nothing.",
    reasons:[
     {t:"The alt text doesn't describe the image's content. A filename conveys nothing",ok:true,fb:""},
     {t:"Diagrams aren't allowed in modules",fb:"Diagrams are fine. They need descriptive alt text so the information isn't visual-only."},
     {t:"The alt text is too short",fb:"Short is fine if it describes. \u2018image.png\u2019 fails because it describes nothing, not because of length."}]},
   {content:"In the lesson text: \u201CFor the template, <u>select here</u>.\u201D",
    good:false,
    why:"\u2717 Sent back: links need descriptive text. \u201Cdownload the Lab Template\u201D, because screen readers often navigate by a list of links, and a page of \u201Cclick here\u201D is unusable.",
    reasons:[
     {t:"The link text describes nothing. Out of context, \u201Cclick here\u201D is meaningless to a screen-reader user",ok:true,fb:""},
     {t:"Links must always be buttons instead",fb:"Links are fine. The requirement is descriptive text, not a different control."},
     {t:"The sentence is too casual in tone",fb:"Tone is a style-guide question. The accessibility failure is the undescriptive link text."}]},
   {content:"Slide 6: body text in medium gray <span class=\"mono\">#8a8a8a</span> on a light gray <span class=\"mono\">#d4d4d4</span> background.",
    good:false,
    why:"\u2717 Sent back: that combination fails contrast: low-vision and colorblind learners lose the content. Use high-contrast pairings (and colorblind-safe palettes like blue/orange for meaning-carrying color).",
    reasons:[
     {t:"Insufficient color contrast between text and background",ok:true,fb:""},
     {t:"Gray is a banned color",fb:"No color is banned, contrast is the standard. Dark gray on white passes."},
     {t:"Slide 6 has too much text",fb:"Density is a design note. The accessibility failure is that the text is hard to physically see."}]},
   {content:"An interactive matching activity that can only be completed by dragging tiles with the mouse.",
    good:false,
    why:"\u2717 Sent back: all content and interactions must be operable by keyboard alone. Drag-only interactions lock out learners who can't use a mouse. Add keyboard controls or an equivalent alternative.",
    reasons:[
     {t:"The interaction has no keyboard path. Mouse-only operation excludes learners",ok:true,fb:""},
     {t:"Matching activities are too easy for this module",fb:"Difficulty isn't the audit's concern. Operability is: no keyboard path, no pass."},
     {t:"Interactive content requires instructor approval",fb:"No such rule. The failure is the missing keyboard access."}]},
   {content:"A code sample presented as a selectable, syntax-highlighted text block with a copy button.",
    good:true,
    why:"\u2713 Approved. Selectable text (never a screenshot of code), so it works with screen readers, zoom, and copy-paste: exactly the standard.",
    reasons:[]}],
  fbGood:"Clean audit, six calls, six right. Accessibility verified at build time costs minutes; discovered at Delivery Check, it holds a launch.",
  fbBad:"Audit complete, study the misses. Every one of these failures is cheap now and expensive later; that's why it's a launch prerequisite."}},
{id:"aico",title:"Work with AI, do not hand it the work",crumb:"Unit 3 · Working with AI",mins:10,
 bridge:"Every lab, item and rubric in this module was written by hand, which is what set the standard. Most drafts now start with AI instead, and the question is how much of the thinking goes with it.",
 frame:{now:"You are about to draft with AI, at the point where most people hand over too much.",role:"You are deciding how much of the work a tool is allowed to do.",resp:"Choose the move at each point in the drafting process, and see where each one leads.",use:"The AI standards and the prompt library in the Handbook.",why:"The judgment is the job. The typing is not."},
 lead:"The most common mistake we see is a developer opening a blank prompt, asking for a lesson, and editing whatever comes back. That hands over the judgment. This lesson is about the difference, because the work you do before you prompt determines whether anything usable comes out.",
 html:`
 <p><strong>Why the blank prompt fails.</strong> A tool asked to write a lesson with no context will produce a lesson for nobody in particular. It will be fluent, plausibly structured, pitched at an average learner who does not exist, and aimed at an objective it invented. You then spend longer repairing it than you would have spent writing from your own outline, and the repairs are the hard part, because you are arguing with something that sounds confident.</p>
 <div class="diag"><svg viewBox="0 0 720 173" role="img" aria-labelledby="aic-l"><title id="aic-l">What each side brings to a draft</title><rect x="12" y="12" width="343" height="147" rx="12" fill="#e3edf8" stroke="#1d5fa8" stroke-width="2"/><text x="183" y="36" text-anchor="middle" font-size="12" font-weight="700" fill="#164a85">WHAT YOU BRING</text><text x="183" y="60" text-anchor="middle" font-size="11" fill="#1c2b3a">The objective and why it exists</text><text x="183" y="79" text-anchor="middle" font-size="11" fill="#1c2b3a">Who these learners are</text><text x="183" y="98" text-anchor="middle" font-size="11" fill="#1c2b3a">What broke last cohort</text><text x="183" y="117" text-anchor="middle" font-size="11" fill="#1c2b3a">Time and equipment limits</text><text x="183" y="136" text-anchor="middle" font-size="11" fill="#1c2b3a">What good enough means here</text><rect x="369" y="12" width="343" height="147" rx="12" fill="#f3f0ea" stroke="#e8e1d6" stroke-width="1.5"/><text x="540" y="36" text-anchor="middle" font-size="12" font-weight="700" fill="#7a8a99">WHAT IT BRINGS</text><text x="540" y="60" text-anchor="middle" font-size="11" fill="#42566a">Speed to a first pass</text><text x="540" y="79" text-anchor="middle" font-size="11" fill="#42566a">Phrasings you did not consider</text><text x="540" y="98" text-anchor="middle" font-size="11" fill="#42566a">Patience for revision</text><text x="540" y="117" text-anchor="middle" font-size="11" fill="#42566a">No stake in the outcome</text><text x="540" y="136" text-anchor="middle" font-size="11" fill="#42566a">No knowledge of your room</text></svg><div class="dcap">Only the left column decides what the course teaches.</div></div>
 <p><strong>What changes when you direct instead of ask.</strong> The same tool, given the objective, the learners, the time available, and what went wrong last cohort, produces something you can actually react to. The difference is that you decided first and used the draft as material, not as an answer.</p>
 <div class="diag"><svg viewBox="0 0 720 112" role="img" aria-labelledby="aic-d"><title id="aic-d">Where your judgment enters when drafting with AI</title><rect x="12" y="26" width="119" height="60" rx="10" fill="#e3edf8" stroke="#1d5fa8" stroke-width="1.5"/><text x="71" y="50" text-anchor="middle" font-size="11.5" font-weight="700" fill="#1c2b3a">You decide</text><text x="71" y="68" text-anchor="middle" font-size="10" fill="#42566a">Objective, learners, constraints</text><line x1="135" y1="56" x2="151" y2="56" stroke="#7a8a99" stroke-width="1.6"/><polygon points="153,56 147,52 147,60" fill="#7a8a99"/><rect x="157" y="26" width="119" height="60" rx="10" fill="#fff" stroke="#e8e1d6" stroke-width="1.5"/><text x="216" y="50" text-anchor="middle" font-size="11.5" font-weight="700" fill="#1c2b3a">You direct</text><text x="216" y="68" text-anchor="middle" font-size="10" fill="#42566a">A brief, not a blank prompt</text><line x1="280" y1="56" x2="296" y2="56" stroke="#7a8a99" stroke-width="1.6"/><polygon points="298,56 292,52 292,60" fill="#7a8a99"/><rect x="302" y="26" width="119" height="60" rx="10" fill="#fff" stroke="#e8e1d6" stroke-width="1.5"/><text x="361" y="50" text-anchor="middle" font-size="11.5" font-weight="700" fill="#1c2b3a">It drafts</text><text x="361" y="68" text-anchor="middle" font-size="10" fill="#42566a">A first pass to react to</text><line x1="425" y1="56" x2="441" y2="56" stroke="#7a8a99" stroke-width="1.6"/><polygon points="443,56 437,52 437,60" fill="#7a8a99"/><rect x="447" y="26" width="119" height="60" rx="10" fill="#fff" stroke="#e8e1d6" stroke-width="1.5"/><text x="506" y="50" text-anchor="middle" font-size="11.5" font-weight="700" fill="#1c2b3a">You judge</text><text x="506" y="68" text-anchor="middle" font-size="10" fill="#42566a">Keep, cut, redirect</text><line x1="570" y1="56" x2="586" y2="56" stroke="#7a8a99" stroke-width="1.6"/><polygon points="588,56 582,52 582,60" fill="#7a8a99"/><rect x="592" y="26" width="119" height="60" rx="10" fill="#fff" stroke="#e8e1d6" stroke-width="1.5"/><text x="651" y="50" text-anchor="middle" font-size="11.5" font-weight="700" fill="#1c2b3a">You own it</text><text x="651" y="68" text-anchor="middle" font-size="10" fill="#42566a">Your name at QA</text></svg><div class="dcap">Four of the five steps are yours. Hand step one to the tool and the rest cannot be done properly.</div></div>
 <div class="box rule"><span class="bh">What directing looks like in practice</span><ul class="blist"><li><b>Bring the objective, do not ask for one.</b> The objective comes from Design or from your own lesson breakdown. A tool inventing one is inventing the point of the lesson.</li><li><b>Say who the learners are.</b> Week three of an IT Support cohort with no prior networking is a different brief from week nine of MERN. Without it you get an average that fits neither.</li><li><b>Name the constraints.</b> Ninety minutes, no admin rights on the lab machines, one shared server. Constraints are most of what makes a lesson buildable and a tool cannot guess them.</li><li><b>Ask for a draft, not a deliverable.</b> Expecting to rewrite half of it changes how you read it. Expecting to ship it changes what you accept.</li><li><b>Reject and redirect rather than patch.</b> If the shape is wrong, say what is wrong and ask again. Editing a badly shaped draft sentence by sentence keeps the bad shape.</li></ul></div>
 <div class="box info"><span class="bh">The tell that someone outsourced instead of collaborated</span><p class="tight">You can usually see it in the finished material. The examples are generic where they should be domain-specific. The lesson covers a topic evenly instead of weighting what learners actually struggle with. The tone shifts between sections. Nobody can say why a particular activity is there. Every one of those is a decision the developer skipped, and no amount of proofreading puts them back.</p></div>
 <p><strong>Where this leaves you.</strong> Handing over the judgment looks like heavy AI use from the outside, which is why we care about how you work rather than whether you used a tool. The next two lessons cover checking what comes back and the rules about what you may put in. This one is about the part that comes first.</p>
 `,
 coach:"Read each of the five scenes, then select the move you would make. A wrong pick explains what it costs and lets you choose again.",
 activity:{type:"story",id:"aicos",points:12,
  steps:[
   {tag:"Step 1 of 5 \u00b7 The task",
    text:"You need a lesson for week three of the IT Support course, covering basic network troubleshooting. You have the module objective from Design and forty minutes before your next meeting. Where do you start?",
    opts:[
     {t:"Ask the tool to write a lesson on network troubleshooting for a beginner IT course.",fb:"This is the blank prompt. You will get something generic aimed at an invented objective, and you will spend your forty minutes arguing with it. Nothing about your cohort or your constraints reached the tool."},
     {t:"Write down the objective, who the learners are at week three, and what equipment the lab has. Then prompt.",ok:true,fb:"Right. Five minutes of your own decisions makes the draft usable instead of generic. You are giving it a brief rather than a topic."},
     {t:"Write the lesson yourself, since the tool will not know your cohort.",fb:"Defensible, but it gives up real speed. The tool cannot know your cohort, which is why you tell it. Refusing to use it is not the same as using it well."}]},
   {tag:"Step 2 of 5 \u00b7 The draft comes back",
    text:"The draft has a clear structure, a decent explanation of the OSI model, and a lab where learners run ping and tracert and write down what they see. Your cohort has no prior networking and the lab machines have no admin rights.",
    opts:[
     {t:"Accept the structure and fix the wording as you go.",fb:"The wording is not the problem. A lab that needs admin rights cannot run on your machines, and that is a shape problem. Patching sentences leaves the broken lab in place."},
     {t:"Tell it the constraint it did not have, and ask for a lab that works without admin rights.",ok:true,fb:"Right. You found a shape problem and redirected instead of patching. This is the iteration the tool is actually good for."},
     {t:"Keep the lab and add a note asking the instructor to sort out permissions.",fb:"That moves your problem into the classroom. Delivery inherits a lab that does not run, and finds out on the day."}]},
   {tag:"Step 3 of 5 \u00b7 It adds something you did not ask for",
    text:"The second draft includes a paragraph claiming most network faults occur at layer 1, with a specific percentage.",
    opts:[
     {t:"Keep it, since it sounds right and gives learners a useful rule of thumb.",fb:"Sounding right is the problem. That figure has no source, and a learner repeating it in an interview is repeating something we invented."},
     {t:"Cut it, or replace it with something you can stand behind.",ok:true,fb:"Right. Physical-layer faults being common is defensible. A precise percentage with no source is not, and you own every line that ships."},
     {t:"Soften it to \u201Cresearch suggests\u201D and move on.",fb:"That launders the invention rather than removing it. A vague attribution on a made-up number is worse than the number alone."}]},
   {tag:"Step 4 of 5 \u00b7 The part it cannot help with",
    text:"You have a usable draft with fifteen minutes left. What do you spend them on?",
    opts:[
     {t:"Ask the tool to double the practice activities so learners have more to do.",fb:"More volume is not better practice. Whether the practice is right depends on what your learners struggle with, which is a judgment the tool cannot make."},
     {t:"Decide where last cohort got stuck and weight the practice toward that.",ok:true,fb:"Right. This is the decision only you can make, because it comes from having watched a room. It is also what turns a generic lesson into one that fits your cohort."},
     {t:"Proofread the whole thing for typos.",fb:"Worth doing eventually, but not the best use of your last fifteen minutes. A typo costs a learner a second; misplaced practice costs them the lesson."}]},
   {tag:"Step 5 of 5 \u00b7 Handing it over",
    text:"The lesson goes into the repo for QA. What do you record about how it was made?",
    opts:[
     {t:"Nothing. The material stands on its own.",fb:"QA reviews claims, and knowing which parts came from a draft tells a reviewer where to look hardest. Silence also makes it impossible to improve how the team uses these tools."},
     {t:"Note that you drafted with AI, what you verified, and what you rewrote.",ok:true,fb:"Right. It is honest, it directs QA to the right places, and it keeps ownership visible. Using the tool is not the thing to hide; unexamined use is."},
     {t:"Note that AI wrote it, so QA knows to check everything.",fb:"That hands your responsibility to QA. You are the one who verified it, and the record should say what you checked rather than asking someone else to start over."}]}],
  fbGood:"You brought the decisions, gave the tool a brief, redirected when the shape was wrong, cut what could not be defended, and spent your last minutes on the judgment only you could make. That is co-authorship.",
  fbBad:"Look again at the ones you changed. The pattern in each: the tool cannot know your objective, your learners, your equipment, or where last cohort struggled. Everything it does well depends on you supplying those first."},
 transition:"You have worked the partnership from both ends. Next, the four patterns to look for in whatever comes back."},
{id:"s6",title:"Red-pen the AI draft",crumb:"Unit 3 · Red-pen the draft",
 bridge:"The two rules for working with AI are established. This is what they look like at sentence level: a draft back from the house prompt, carrying the defects the last lesson named.",
 frame:{now:"The house prompt has returned a draft of Lesson 301.2 narration.",role:"You are the named human who owns whatever this draft becomes.",resp:"Select each defect in the text and choose the repair that makes the line shippable.",use:"The AI standards and the prompt library in the Handbook.",why:"Whatever ships carries your name at QA, not the model's."},
 mins:10,
 lead:"The house prompt drafted Lesson 301.2 narration in seconds. Four defects came back with it, and not one of them looks like a defect. Work down the draft: select the problem, choose the repair.",
 brief:{from:"Product Developer · IT domain",re:"Lesson 301.2 narration. AI draft attached",text:"The house prompt produced this draft in seconds. It reads well, which is the reason it still needs checking: fluent is not the same as accurate."},
 demo:{eg:"Worked example. Draft sentence: “Studies confirm 73.6% of help-desk tickets are printer-related.”",steps:["Step 1: Spot the problem. A suspiciously precise statistic with no source is the classic AI tell: fluent, confident, and unverifiable. Flag it.","Step 2: Choose the right repair. The fix is not to round the number or add ‘(source: research)’. Either replace it with a claim that stands on its own, such as ‘printer issues are a common ticket category’, or tag it [VERIFY] and find real data before it ships.","Step 3: Repeat for every problem. That was one of four patterns. Now find all four in the draft below: select the sentence, then choose the repair."]},
 coach:`<b>Select only the sentences that should not ship</b>: four of the eight. Selecting a sound sentence tells you it is sound and counts as a misstep, so read the draft through before the first click. Selecting a defective one opens the repairs, and the right one rewrites the line in the draft. The counter under the draft reads four fixed, and a clean run shows no missteps. Prompt library: ${gl("prompts","the Handbook")}.`,
 hint:"Fluent prose can still be wrong. Four defects are here: a precise number, a confident file path, an off-objective fun fact, and marketing voice. Find all four.",
 html:`<p>Reviewing a draft from a model is a different job from editing a colleague's. With a colleague you edit the expression. With a model you verify the content, because well-formed prose gives no signal that it was invented.</p>
 <div class="diag"><svg viewBox="0 0 720 150" role="img" aria-labelledby="s6-d"><title id="s6-d">The four patterns to look for in an AI draft</title><rect x="12" y="12" width="336" height="50" rx="9" fill="#fff" stroke="#e8e1d6" stroke-width="1.5"/><circle cx="32" cy="37" r="11" fill="#e3edf8" stroke="#1d5fa8" stroke-width="1.5"/><text x="32" y="41" text-anchor="middle" font-size="11" font-weight="700" fill="#164a85">1</text><text x="52" y="33" font-size="11.5" font-weight="700" fill="#1c2b3a">Factual drift</text><text x="52" y="49" font-size="10.5" fill="#42566a">Versions, flags, paths that are plausible and wrong</text><rect x="362" y="12" width="336" height="50" rx="9" fill="#fff" stroke="#e8e1d6" stroke-width="1.5"/><circle cx="382" cy="37" r="11" fill="#e3edf8" stroke="#1d5fa8" stroke-width="1.5"/><text x="382" y="41" text-anchor="middle" font-size="11" font-weight="700" fill="#164a85">2</text><text x="402" y="33" font-size="11.5" font-weight="700" fill="#1c2b3a">Invented specifics</text><text x="402" y="49" font-size="10.5" fill="#42566a">Statistics and citations added to sound authoritative</text><rect x="12" y="74" width="336" height="50" rx="9" fill="#fff" stroke="#e8e1d6" stroke-width="1.5"/><circle cx="32" cy="99" r="11" fill="#e3edf8" stroke="#1d5fa8" stroke-width="1.5"/><text x="32" y="103" text-anchor="middle" font-size="11" font-weight="700" fill="#164a85">3</text><text x="52" y="95" font-size="11.5" font-weight="700" fill="#1c2b3a">Filler</text><text x="52" y="111" font-size="10.5" fill="#42566a">Sentences that restate or announce, teaching nothing</text><rect x="362" y="74" width="336" height="50" rx="9" fill="#fff" stroke="#e8e1d6" stroke-width="1.5"/><circle cx="382" cy="99" r="11" fill="#e3edf8" stroke="#1d5fa8" stroke-width="1.5"/><text x="382" y="103" text-anchor="middle" font-size="11" font-weight="700" fill="#164a85">4</text><text x="402" y="95" font-size="11.5" font-weight="700" fill="#1c2b3a">Voice mismatch</text><text x="402" y="111" font-size="10.5" fill="#42566a">Generic tone, or vocabulary not yet introduced</text></svg><div class="dcap">Every one of these reads perfectly on the page. That is what makes the pass necessary.</div></div>
 <div class="terms"><div class="th">🔤 How each one is caught</div><dl><dt>Factual drift</dt><dd>Check anything a learner will type or rely on against the source: version, flag, port, menu path.</dd><dt>Invented specifics</dt><dd>Ask where the number came from. A figure you cannot trace does not ship.</dd><dt>Filler</dt><dd>Delete the sentence and read the paragraph again. If nothing was lost, it was filler.</dd><dt>Voice mismatch</dt><dd>Read the draft beside a page you already trust, and listen for the register changing.</dd></dl></div>
 <div class="spec"><div class="spec-h">Lesson 301.2 narration · one line, red-penned</div><div class="spec-b">Draft: the agent runs on any supported Windows release.<br>Marked: <span class="an">[VERIFY]</span> the agent runs on Windows 11 23H2, the build on the lab image.</div><div class="spec-n">The tag stays in the file until somebody confirms the claim against the vendor page. A sentence with no tag is one you have vouched for.</div></div>
 <div class="box rule"><span class="bh">The repair rules</span><p class="tight">Fix the claim rather than softening it. Rounding a fabricated figure produces a rounder fabrication, and \u201Cresearch suggests\u201D launders it. Three repairs are legitimate: replace the claim with one that stands on its own, tag it <span class="mono">[VERIFY]</span> and confirm before release, or cut it outright.</p></div>
 <p><strong>Ownership is the part that carries.</strong> Whatever ships carries your name at QA, and the model's name appears nowhere. \u201CThe AI wrote it\u201D is no defense for a wrong command in a lab a room of learners will run. Learners are held to the same standard, which is why we hold it visibly.</p>
 <p>An AI draft of an IT Support lesson will name a Windows settings path that moved two releases ago. A MERN draft will invent an npm flag or a method signature that does not exist. Both read perfectly, and both break in a classroom.</p>
 <p class="tight" style="color:var(--muted)">Select each problem sentence in the draft below, choose the repair, and note which of the four patterns it was.</p>`,
 variants:{swe:{type:"fix",id:"s6f",points:15,
  intro:"Lesson objective: \u201CReview a pull request for a Node.js Express route and document the required changes.\u201D. The AI draft:",
  sents:[
   {t:"A code review starts by reading the whole diff end to end before leaving any comment.",bad:false},
   {t:" Research shows 92.4% of production bugs are introduced in pull requests under 50 lines.",bad:true,
    fixes:[{t:"Round it to \u201Cabout 92%.\u201D",fb:"Rounding a fabricated number produces a rounder fabrication. The statistic doesn\u2019t exist."},
           {t:"Replace with: \u201CSmall diffs are easier to review, but bugs enter at any size. Review depth matters more than diff length.\u201D",ok:true,fb:"True, verifiable, and teaches the same point without an invented citation. Or tag [VERIFY] and find a real source."},
           {t:"Add \u201C(source: industry research).\u201D",fb:"A vague attribution on a fake number is worse. It launders the fabrication."}],
    fixed:" Small diffs are easier to review, but bugs enter at any size. Review depth matters more than diff length."},
   {t:" Open the route handler and trace the request path from middleware to response.",bad:false},
   {t:" You\u2019ll find the middleware configuration in src/System32/express.config.js, which every Node version uses.",bad:true,
    fixes:[{t:"Replace with the verified path in the actual course repo, and name the Node version the course uses.",ok:true,fb:"Right: verify against the real repo, and never claim \u201Cevery version.\u201D AI invents plausible-looking paths constantly."},
           {t:"Keep it. Learners will find the real file eventually.",fb:"Learners following instructions that don\u2019t work is exactly the defect QA exists to stop."},
           {t:"Delete the sentence entirely.",fb:"The learner does need the path, deleting dodges the fix. Verify and correct instead."}],
    fixed:" You\u2019ll find the middleware configuration in src/middleware/index.js in the course repo (Node 20 LTS build)."},
   {t:" Fun fact: the first computer bug was an actual moth taped into a logbook in 1947!",bad:true,
    fixes:[{t:"Delete. It doesn\u2019t serve the objective.",ok:true,fb:"Charming, true enough, and irrelevant: the objective is reviewing a pull request. Every sentence earns its place or goes."},
           {t:"Keep it. Engagement matters.",fb:"Engagement comes from doing, not trivia. This eats minutes the 75% rule already budgets."},
           {t:"Move it to the exit ticket.",fb:"The exit ticket synthesizes the objective. It isn\u2019t trivia storage."}],
    fixed:""},
   {t:" Then confirm input validation runs before the database call, and note anything missing.",bad:false},
   {t:" Our industry-leading review process will turn you into a 10x-engineer rockstar.",bad:true,
    fixes:[{t:"Replace with: \u201CBy the end of this lesson you\u2019ll have reviewed and documented a real pull request yourself.\u201D",ok:true,fb:"Plain, direct, second person, states the outcome. The house voice."},
           {t:"Tone it down to \u201Ca code-review pro.\u201D",fb:"Still marketing. The register is the problem, not the noun."},
           {t:"Keep it. It\u2019s motivating.",fb:"House voice is plain and direct. Hype erodes trust in the material around it."}],
    fixed:" By the end of this lesson you\u2019ll have reviewed and documented a real pull request yourself."},
   {t:" Finally, document each requested change and the reason for it.",bad:false}],
  fbGood:"The draft now ships: real claims, verified paths, everything on-objective, house voice. AI got you 70% of the way in seconds. This pass is the 30% that makes it yours.",
  fbBad:"Draft repaired. Those four patterns are what to look for in any AI draft: factual drift, invented specifics, filler, and voice mismatch."}},
 activity:{type:"fix",id:"s6f",points:15,
  intro:"Lesson objective: \u201CConfigure and secure a Windows workstation against common vulnerabilities, and document the steps taken.\u201D: the AI draft:",
  sents:[
   {t:"Securing a workstation starts with the firewall.",bad:false},
   {t:" Studies show 87.3% of breaches begin at an unpatched endpoint.",bad:true,
    fixes:[{t:"Keep it but round to \u201Cabout 87%.\u201D",fb:"Rounding a fabricated number produces a rounder fabrication. The statistic doesn't exist."},
           {t:"Replace with: \u201CUnpatched endpoints are a common entry point for attacks.\u201D",ok:true,fb:"True, verifiable, and teaches the same point without an invented citation. Or mark [VERIFY] and find a real source."},
           {t:"Add \u201C(source: industry research).\u201D",fb:"A vague attribution on a fake number is worse. It launders the fabrication."}],
    fixed:" Unpatched endpoints are a common entry point for attacks."},
   {t:" Open Windows Defender Firewall and review the inbound rules.",bad:false},
   {t:" You'll find this under Control Panel > System32 > FirewallAdvanced in all Windows versions.",bad:true,
    fixes:[{t:"Replace with the verified path for the OS version this course uses, and say which version.",ok:true,fb:"Right: verify the real path on the actual environment, and never claim \u201Call versions.\u201D"},
           {t:"Keep it. Learners will figure out the real path.",fb:"Learners following instructions that don't work is exactly the defect QA exists to stop."},
           {t:"Delete the sentence entirely.",fb:"The learner does need the path: deleting it dodges the fix. Verify and correct instead."}],
    fixed:" You'll find this in Windows Security → Firewall & network protection on the Windows 11 build this course uses."},
   {t:" Fun fact: the first computer virus was written in 1971 and was called Creeper!",bad:true,
    fixes:[{t:"Delete. It doesn't serve the objective.",ok:true,fb:"Charming, possibly true, and irrelevant: the objective is configuration. Every sentence earns its place or goes."},
           {t:"Keep it. Engagement matters.",fb:"Engagement comes from doing, not trivia. This eats class minutes the 75% rule already budgets."},
           {t:"Move it to the exit ticket.",fb:"The exit ticket is for synthesis of the objective, not trivia storage."}],
    fixed:""},
   {t:" Then check that antivirus is running.",bad:false},
   {t:" Our industry-leading approach will make you a security rockstar.",bad:true,
    fixes:[{t:"Replace with: \u201CBy the end of this lesson you'll have secured and documented a workstation yourself.\u201D",ok:true,fb:"Plain, direct, second person, and it states the outcome. That's the house voice."},
           {t:"Tone it down to \u201Ca security pro.\u201D",fb:"Still marketing. The register is the problem, not the noun."},
           {t:"Keep it. It's motivating.",fb:"House voice is plain and direct. Hype erodes trust in the material around it."}],
    fixed:" By the end of this lesson you'll have secured and documented a workstation yourself."},
   {t:" Finally, document each change and why you made it.",bad:false}],
  fbGood:"The draft now ships: real claims, verified path, everything on-objective, house voice. AI got you 70% of the way in seconds. This pass is the 30% that makes it yours.",
  fbBad:"Draft repaired. Those four patterns are what to look for in any AI draft: factual drift, invented specifics, filler, and voice mismatch."}},
{id:"sai",title:"Use AI without outsourcing responsibility",crumb:"Unit 3 · AI governance",
 bridge:"A red-penned draft is technically clean, which is half the standard. Governance is the other half, and it decides what may go into a tool at all.",
 frame:{now:"Technical verification is only half the standard. This is the other half.",role:"You are accountable for what goes into the tool as well as what comes out.",resp:"Rule on each workflow as defensible or not, and name the rule it breaks.",use:"The AI standards and Integrity Rubric in the Handbook.",why:"Protected information does not come back out once it has gone in."},
 mins:8,
 lead:"Technical verification is only half the standard. The other half is governance: protected information, approved tools, and a named human who owns the output.",
 coach:`<b>✓ Approve</b> responsible workflows; <b>✗ Send back</b> risky inputs, unverifiable outputs, hidden assessment generation, or vague human review, naming the exact failure. Guardrails: ${gl('ai','the AI section')}.`,
 hint:"Run the checks in order: what went IN (confidential? learner data? approved tool?), what came OUT (verified? sourced?), and who OWNS it (named reviewer? disclosed where required?).",
 demo:{eg:"Workflow: “I pasted the client’s job-task analysis: company name and all: into a free public chatbot to draft objectives. Way faster.”",steps:[
 "Input check comes first, always: client-identifying material entered into an unapproved public tool is protected information leaving our custody. No matter how good the output is.",
 "‘Faster’ is true and irrelevant. The standard is a workflow we could defend to the client whose data it is; speed defends nothing.",
 "Verdict: ✗ Send back, approved tool with scrubbed input, or don’t. Your queue runs the same order: input, tool, verification, ownership."]},
 html:`
 <p><strong>Technical correctness is only half the review.</strong> A draft can be accurate and still be a workflow we cannot defend. Governance asks a different question from \u201Cis this right?\u201D It asks: if a learner, a client, an instructor, or an auditor saw exactly how this was made, would it hold up?</p>
 <div class="diag"><svg viewBox="0 0 720 112" role="img" aria-labelledby="sai-d"><title id="sai-d">The three questions that decide whether an AI workflow is defensible</title><rect x="12" y="26" width="216" height="60" rx="10" fill="#e3edf8" stroke="#1d5fa8" stroke-width="1.5"/><text x="120" y="50" text-anchor="middle" font-size="11.5" font-weight="700" fill="#1c2b3a">What went in?</text><text x="120" y="68" text-anchor="middle" font-size="10" fill="#42566a">Learner or client data?</text><line x1="232" y1="56" x2="248" y2="56" stroke="#7a8a99" stroke-width="1.6"/><polygon points="250,56 244,52 244,60" fill="#7a8a99"/><rect x="254" y="26" width="216" height="60" rx="10" fill="#fff" stroke="#e8e1d6" stroke-width="1.5"/><text x="362" y="50" text-anchor="middle" font-size="11.5" font-weight="700" fill="#1c2b3a">Which tool?</text><text x="362" y="68" text-anchor="middle" font-size="10" fill="#42566a">Approved for that data?</text><line x1="474" y1="56" x2="490" y2="56" stroke="#7a8a99" stroke-width="1.6"/><polygon points="492,56 486,52 486,60" fill="#7a8a99"/><rect x="496" y="26" width="216" height="60" rx="10" fill="#fff" stroke="#e8e1d6" stroke-width="1.5"/><text x="604" y="50" text-anchor="middle" font-size="11.5" font-weight="700" fill="#1c2b3a">Who owns it?</text><text x="604" y="68" text-anchor="middle" font-size="10" fill="#42566a">A named human signs off</text></svg><div class="dcap">All three have to pass. Any one failing makes the workflow indefensible, however useful the output.</div></div>
 <div class="box info"><span class="bh">What went in, which tool, who owns the output</span><ul class="blist"><li><b>What went in?</b> Learner data, client-confidential material, unreleased curriculum, and anything under NDA do not go into a tool that is not approved for them. Once pasted, you cannot take it back. Pseudonymized or synthetic examples usually do the same job.</li><li><b>Which tool?</b> Approved, org-sanctioned tools only. \u201CIt was free and quick\u201D is how content ends up in a system nobody has vetted for retention or training use.</li><li><b>Who owns the output?</b> A named human verifies and signs off. If the answer is \u201Cthe tool produced it and we shipped it,\u201D the tool has quietly become the author, and no one checked the claims.</li></ul></div>
 <div class="box rule"><span class="bh">The two rules for learner-facing AI</span><p class="tight">When learners use AI in an activity, the activity must make their <b>own thinking visible</b> (what they asked, what they changed, what they rejected and why), and it must be assessed with the <b>AI Integrity Rubric</b> so \u201CI used AI\u201D is not itself the finding. Unexamined AI use is the problem.</p></div>
 <p><strong>Where the line usually falls.</strong> Drafting a lesson outline from your own module blueprint with an approved tool, then verifying every claim, is fine. Pasting a cohort\u2019s submissions into an unapproved tool to \u201Csummarize the trends\u201D is not, regardless of how useful the summary is. The difference is what went in and who is accountable for what came out.</p>
 <p class="tight" style="color:var(--muted)">Review each workflow below. Approve the ones we could defend, and when you send one back, name which of the three questions it fails.</p>`,
 activity:{type:"review",id:"sair",points:12,queueTag:"AI governance",
  items:[
   {content:"A Product Developer uses an approved assistant to outline a lab from approved objectives, replaces client names with neutral placeholders, marks uncertain technical details [VERIFY], tests every command, and records the human reviewer.",good:true,why:"✓ Approved. The input is controlled, uncertainty is visible, and human verification is concrete.",reasons:[]},
   {content:"A developer pastes a client conversation transcript containing names, pricing, internal systems, and unresolved contract details into a public AI tool to generate the module plan.",good:false,why:"✗ Send back. Confidential and proprietary information cannot be treated as prompt material without an approved tool and data pathway.",reasons:[{t:"Use an approved tool and remove or abstract confidential, personal, contractual, and proprietary information before prompting",ok:true,fb:""},{t:"Add a note that the AI output is confidential",fb:"A note after disclosure does not undo the disclosure."},{t:"Ask the AI not to remember it",fb:"A prompt instruction is not an organizational data-control mechanism."}]},
   {content:"An AI assistant drafts distractors. The author checks the source content, verifies one best answer, tests for grammatical cues, documents revisions, and submits the bank through normal QA.",good:true,why:"✓ Approved. AI accelerated drafting; the author and QA still own validity and security.",reasons:[]},
   {content:"A complete KBA is generated and uploaded directly to Canvas because the questions 'look right' and the SME is busy.",good:false,why:"✗ Send back. Appearance is not validity; assessment security and accuracy require human review.",reasons:[{t:"Require objective alignment, source verification, item-quality review, SME validation where needed, and normal QA before release",ok:true,fb:""},{t:"Generate twice as many questions",fb:"Quantity does not repair validity or review."},{t:"Tell learners the quiz was AI-generated",fb:"Disclosure does not substitute for quality assurance."}]},
   {content:"A learner activity permits an AI assistant for brainstorming, requires the learner to verify two claims, show one rejected suggestion, explain the final decision, and avoid entering employer/client or personal data.",good:true,why:"✓ Approved. The activity preserves human evidence and teaches responsible use.",reasons:[]}],
  fbGood:"AI workflow approved. Speed is useful; accountability is non-transferable.",
  fbBad:"Review complete. Recheck the rejected workflows: approved tools, protected inputs, visible verification, and named ownership are the floor."}},
{id:"airec",title:"Write the AI-use record",crumb:"Unit 3 · AI-use record",mins:6,
 bridge:"Three pages have set the standard for building with an AI assistant: verify every claim, control what goes into the tool, and keep a named human on the output. None of that is visible to anybody who opens the finished module.",
 frame:{now:"The AI standards are settled. Nothing in the module shows how they were met on this build.",
  role:"You are writing the record that ships in the module repo beside the blueprint.",
  resp:"Write half a page: what an assistant drafted, what you verified and how, what you corrected or cut, and what you wrote yourself.",
  use:"The AI standards in the Handbook, and your own build of module 301.",
  why:"Keeping your review evidence is an organizational guardrail, and a record written at handoff is written from memory."},
 lead:"Working with an assistant leaves no trace on the file it produced. The AI-use record is that trace: half a page, filed with the module, naming what a tool drafted and what a person did about it. It is item 3 of your capstone package, and it is the only item that says how the rest were made.",
 coach:"<b>Type the record into the two boxes</b>: what was drafted and how you verified it in the first, what you corrected or cut and what you wrote yourself in the second. Nothing is graded. A record that names the tool and stops leaves QA nothing to check, which is the same as filing none. When you <b>Save</b>, an experienced developer's record appears beside yours with a checklist to run your own through.",
 hint:"Write it while you build rather than afterward. Name the file and the claim instead of the category: \"the four commands in step 4, run on the lab image and checked against the vendor documentation\" is a record, and \"verified for accuracy\" is a sentence about verification.",
 html:`<p><strong>What the record settles.</strong> Drafting heavily with an approved assistant is expected here. An unexamined draft is a QA finding. From outside the build, the two look the same.</p>
 <div class="terms"><div class="th">Half a page, in four lines</div><dl>
 <dt>Drafted</dt><dd>Which files, and which parts of them.</dd>
 <dt>Verified</dt><dd>Each claim you checked, and what against.</dd>
 <dt>Corrected or cut</dt><dd>What came back wrong, and what you removed.</dd>
 <dt>Wrote yourself</dt><dd>The parts no tool touched.</dd></dl></div>
 <div class="spec"><div class="spec-h">Module 301 &middot; AI-use record</div><div class="spec-b">Drafted: GLAB 301.2.1 steps 1 to 6, approved assistant<span class="an"> &nbsp;the file, not the category</span><br>Verified: ran the four commands on the lab image; checked service names against the vendor documentation<br>Corrected: step 4 named a service not on our image<br>Cut: a BIOS reset, unverifiable on this hardware<span class="an"> &nbsp;removed rather than repaired</span><br>Wrote myself: the scenario, the reflection question, the FG 301 look-fors</div><div class="spec-n">Half a page, and no claim a reviewer cannot check.</div></div>
 <p class="tight">The standard learners meet under the Integrity Rubric is the one we meet here: ${gl('ai','AI standards &amp; the Integrity Rubric')}. The record is filed in the repo beside the blueprint, with everything in ${gl('templates','templates &amp; links')}.</p>
 <p class="tight" style="color:var(--muted)">Write yours below. The model appears once you save.</p>`,
 activity:{type:"journal",id:"airecw",
  fields:[
   {label:"1. What an assistant drafted for module 301, and how you verified it. Name the file, the claim, and what you checked it against.",
    ph:"Drafted: GLAB 301.2.1 steps 1 to 6 …\nVerified: ran … and checked … against …",
    short:"Box 1 · drafted and verified",
    checks:[{"want":"drafted|draft|generated|produced","ok":"Names what the tool drafted.","no":"Nothing marked as drafted. The record opens with what came out of the tool."},{"want":"verified|checked|ran|tested|confirmed","ok":"Names the verification.","no":"No verification named. \"I used an assistant\" is a disclosure, and the record has to carry the check as well."},{"want":"against|documentation|image|source|standard|objective","ok":"Says what the claim was checked against.","no":"Says it was verified without saying against what. The thing it was checked against is the part QA can repeat."},{"minWords":15,"ok":"Specific enough for a reviewer to follow.","no":"Too short to carry the file, the claim, and what it was checked against."}]},
   {label:"2. What you corrected or cut, and what you wrote yourself.",
    ph:"Corrected: …\nCut: …\nWrote myself: …",
    short:"Box 2 · corrected, cut, and your own",
    checks:[{"want":"corrected|fixed|rewrote|repaired|replaced","ok":"Names a correction.","no":"No correction named. A draft that needed nothing changed is a draft nobody read closely."},{"want":"cut|removed|dropped|rejected|left out","ok":"Names something cut.","no":"Nothing cut. What you removed rather than repaired is where your judgment shows."},{"pattern":"(wrote|written|my own|mine|myself)","ok":"Marks what you wrote yourself.","no":"Nothing marked as your own writing. A reviewer needs the boundary between the tool and you."},{"minWords":12,"ok":"All three parts carry detail.","no":"Too short to carry a correction, a cut, and what you wrote yourself."}]}],
  modelHead:"An experienced developer's record, and how to check yours",
  model:`<p class="tight"><b>Drafted.</b> "First pass at GLAB 301.2.1 steps 1 to 6, and the distractors for four KBA 301 items. Approved assistant. Nothing client-identifying went in, and the fault scenarios are synthetic."</p>
  <p class="tight"><b>Verified.</b> "Ran all four commands on the lab image with a standard account. Checked every service name against the vendor documentation. Checked each distractor against the objective the item is supposed to measure."</p>
  <p class="tight"><b>Corrected or cut.</b> "Step 4 named a service that is not on our image, so it now names the one that is. The draft suggested a BIOS reset I could not verify as safe on this hardware, so it is out. Two distractors were filler, and I rewrote them from mistakes I have watched learners make."</p>
  <p class="tight"><b>Wrote myself.</b> "The scenario, the reflection question, the rubric rows, and every look-for in FG 301."</p>
  <div class="box rule" style="margin-top:10px"><span class="bh">Check your own against these</span><ul class="blist"><li>&#9744; Every line names a file or an item rather than a category of work.</li><li>&#9744; Verification says what the claim was checked against, and a reviewer could repeat it.</li><li>&#9744; Something was corrected and something was cut, both named.</li><li>&#9744; What you wrote yourself is on the page, so the boundary is visible.</li><li>&#9744; No client-confidential material and no learner data went into the tool.</li><li>&#9744; It fits on half a page and reads as a record rather than a defense.</li></ul></div>
  <p class="tight" style="color:var(--muted)">A line that would stay true whatever the tool returned is carrying no information. Rewrite that one.</p>`},
 transition:"How this module was made is now on the record. What Unit 3 owes at the end is a piece of the material itself, written to the standard every page of this unit has been setting."},
{id:"d3x",title:"Unit 3 check: write a lab step that survives a room",crumb:"Unit 3 \u00b7 Unit check",mins:12,
 bridge:"Unit 3 produced material other people can use without you in the room. Write one piece of it, held to the same standard.",
 frame:{now:"This unit was about producing material other people can use. Produce a piece of it.",role:"You are writing one step of a lab for a learner you will never meet.",resp:"Write it so it can be followed without you in the room. Model answers appear once you commit yours.",use:"The labs section of the Handbook.",why:"Your capstone asks for a finished lesson and activity. This is one step of it, held to the same standard."},
 lead:"This unit was about producing material other people can use. Write a piece of it. Your capstone asks for a finished lesson and activity; This is one step of it, held to the same standards.",
 html:()=>`<div class="box rule"><span class="bh">Write step 3 of the lab</span><p class="tight">${primary()&&primary().id==="software"?"You are writing the lab for the objective from the last unit: the learner implements a documented REST endpoint that passes the provided tests. Write step 3, the point where the learner first runs the test suite.":"You are writing the lab for the objective from the last unit: the learner diagnoses a network fault and records the reasoning. Write step 3, the point where the learner runs their first diagnostic."}</p>
 <p class="tight">Thirty learners will work this alone, on lab machines with no admin rights, while one instructor circulates. Write it so nobody has to raise a hand to find out what you meant.</p></div>`,
 coach:"Write the step, then note what you did about accessibility and about AI. Save to compare.",
 activity:{type:"journal",id:"d3xw",
  fields:[
   {label:"1. Step 3 of the lab. One action, named specifics, and a result the learner can see.",
    ph:"Step 3: \u2026",short:"Your lab step",checks:[{"avoid":" and ","ok":"One action.","no":"Contains \"and\", which usually means two actions. A step with two verbs is two steps."},{"want":"configure|build|troubleshoot|diagnose|document|resolve|identify|implement|write|create|deploy|verify|escalate|route|assemble|score|audit|repair|query|install|open|select|click|enter|run|save|attach","ok":"Starts from an action the learner takes.","no":"No concrete action. Name what the learner does, not what they should understand."},{"avoid":"as needed|appropriately|as appropriate|correctly|properly","ok":"No vague qualifiers.","no":"Contains a vague qualifier such as \"as needed\". That hands the decision to somebody who does not have it yet."},{"minWords":12,"ok":"Names specifics and a result.","no":"Too short to carry the exact menu, field or value, plus what the learner should see when it worked."}]},
   {label:"2. One accessibility problem your step could have had, and what you did so it does not.",
    ph:"e.g. I did not say \u201Cclick the red icon\u201D because \u2026"},
   {label:"3. If you drafted any of this with AI, what did you check before keeping it? If you did not use AI, what would you have checked?",
    ph:"I verified \u2026"}],
  modelHead:"An experienced developer\u2019s version, and how to check yours",
  model:()=>(primary()&&primary().id==="software"?`<p class="tight"><b>Step 3.</b> \u201CIn the project root, run <span class="mono">npm test -- routes/health</span>. Record how many tests pass and the text of the first failure. A failing test here is expected: you have not written the route yet.\u201D</p>`:`<p class="tight"><b>Step 3.</b> \u201COpen a terminal and run <span class="mono">ping 10.0.0.1</span>, the lab gateway. Record whether you get replies or a timeout. A timeout here points below the network layer, so do not change any settings yet.\u201D</p>`)+`
  <p class="tight"><b>Accessibility.</b> The step names the command as selectable text rather than a screenshot, so it can be read aloud, zoomed, and copied. It also describes the outcome in words (replies or timeout) rather than telling the learner to look for a color or an icon.</p>
  <p class="tight"><b>AI.</b> If a draft produced this, verify the exact command, that it exists on the lab image, and that it runs without admin rights. All three are the kind of detail a tool supplies confidently and gets wrong.</p>
  <div class="box rule" style="margin-top:10px"><span class="bh">Check your own against these</span><ul class="blist"><li>\u2610 One action. If your step contains two verbs, it is two steps.</li><li>\u2610 Named specifics: the exact command, address, menu, or file. No \u201Cas needed\u201D or \u201Cappropriately\u201D.</li><li>\u2610 A visible result, so the learner can tell success from silent failure.</li><li>\u2610 It works within the stated constraint: no admin rights.</li><li>\u2610 Nothing depends on seeing a color, and no instruction lives only inside an image.</li><li>\u2610 Anything a tool drafted, you can say what you checked.</li></ul></div>`},
 transition:"You have written material a room could work through. Unit 4 is about deciding whether the whole thing is ready to ship."}]},
{day:4,mod:"4 · Handoff & revision",lessons:[
{id:"d4i",title:"Unit 4 · Clearing the gates",crumb:"Unit 4 · Unit opener",
 bridge:"Units 1 to 3 took a module from a request to built, accessible material. None of it has left the building yet, and it does not leave on your say-so. Four review gates stand between a built module and a cohort, and this unit is you walking through all four of them.",
 frame:{now:"The module is built. The question is whether it is finished.",role:"You are judging whether a module is done and ready to leave the team.",resp:"Approve the claims that belong on the done list and send back the ones that do not.",use:"The module deliverables checklist in the Handbook.",why:"Done is a set of things that exist and can be found, not a feeling that the work went well."},
 mins:8,
 lead:"Our process has seven steps and four review gates. You have worked inside steps 1 to 4. You cleared Design Review in Unit 1, when you ruled on what Design sent you. Three gates are left: Development Review, the Delivery Check, and after the cohort runs, Delivery Review. Step 5, Module and Course QA, sits before the Delivery Check. Each one asks a different question, and each one can send work back.",
 coach:"<b>Select each gate</b> in the diagram to see what it decides and who runs it. Then work the queue: for each claim about a finished module, <b>select ✓ Approve</b> if it belongs on the done list, or <b>✗ Send back</b> if it does not. Every verdict explains itself once you commit it.",
 html:`<p><strong>By the end of Unit 4 you'll be able to:</strong></p>
 <ul class="obj"><li>Name the four review gates, what each one decides, and which one you are standing at.</li><li>Clear Development Review: say when a module is done, and why done means ready for QA rather than past it.</li><li>Submit a module to QA, read the findings you get back, and know which ones to fix and which to question.</li><li>Pass the Delivery Check on all three legs: accessible, instructor-enabled, environment-verified.</li><li>Turn cohort evidence at Delivery Review into the inputs for the next revision.</li></ul>
 <div class="diag"><svg viewBox="0 0 720 150" role="img" aria-labelledby="gates-t"><title id="gates-t">The four review gates, in the order a build meets them, with the Module and Course QA step between Development Review and the Delivery Check</title>
 <line class="draw" x1="24" y1="52" x2="696" y2="52" stroke="#1d5fa8" stroke-width="2.5"/>
 <g class="fdu hot" tabindex="0" role="button" aria-label="Design Review" data-name="Design Review" data-info="Is the design package complete and buildable? Nothing is developed against an unapproved design. You met this gate in Unit 1, when you ruled on what Design sent you.">
 <rect x="24" y="26" width="150" height="52" rx="9" fill="#f3eee6" stroke="#e8e1d6" stroke-width="1.5"/><text x="99" y="48" text-anchor="middle" font-size="12" fill="#5b6b7a" font-weight="600">Design Review</text><text x="99" y="65" text-anchor="middle" font-size="10" fill="#8fa0ae">Unit 1 · done</text></g>
 <g class="fdu hot" tabindex="0" role="button" style="animation-delay:.15s" aria-label="Development Review" data-name="Development Review" data-info="Do the built materials match the approved intent and meet our standards? This is the gate you clear to leave development, and the one this page is about.">
 <rect x="192" y="20" width="156" height="64" rx="9" fill="#1d5fa8"/><text x="270" y="46" text-anchor="middle" font-size="12.5" fill="#fff" font-weight="700">Development Review</text><text x="270" y="66" text-anchor="middle" font-size="10" fill="#cfe0ee">you are here</text></g>
 <g class="fdu hot" tabindex="0" role="button" style="animation-delay:.3s" aria-label="Module and Course QA" data-name="Module &amp; Course QA" data-info="QA reviews each module, then the whole course, for accuracy, alignment, and readiness. They work from a checklist and return written findings. You fix what is flagged and resubmit.">
 <rect x="366" y="26" width="150" height="52" rx="9" fill="#fff" stroke="#1d5fa8" stroke-width="1.8"/><text x="441" y="48" text-anchor="middle" font-size="12" fill="#164a85" font-weight="600">Module &amp; Course QA</text><text x="441" y="65" text-anchor="middle" font-size="10" fill="#5b6b7a">step 5</text></g>
 <g class="fdu hot" tabindex="0" role="button" style="animation-delay:.45s" aria-label="Delivery Check" data-name="Delivery Check" data-info="Is the course launch-ready: accessible, instructor-enabled, and environment-verified? All three legs, or it does not launch.">
 <rect x="534" y="26" width="162" height="52" rx="9" fill="#fff" stroke="#1d5fa8" stroke-width="1.8"/><text x="615" y="48" text-anchor="middle" font-size="12" fill="#164a85" font-weight="600">Delivery Check</text><text x="615" y="65" text-anchor="middle" font-size="10" fill="#5b6b7a">step 6</text></g>
 <g class="fdu hot" tabindex="0" role="button" style="animation-delay:.6s" aria-label="Delivery Review" data-name="Delivery Review" data-info="After the cohort runs: what did the evidence say, and what does the next revision inherit? This is where a course stops being finished and starts being maintained.">
 <rect x="258" y="100" width="204" height="38" rx="9" fill="#f3eee6" stroke="#1d5fa8" stroke-width="1.5" stroke-dasharray="4 3"/><text x="360" y="124" text-anchor="middle" font-size="11.5" fill="#164a85" font-weight="600">Delivery Review · after the cohort</text></g>
 </svg><div class="dcap">👆 <b>Select each gate</b> to see what it decides. Three of the four gates can send your work back, and the fourth decides what the next version of the course has to fix. The white box in the middle is step 5 of the process, not a gate.</div></div>
 <div class="box rule"><span class="bh">The gate this page is about</span><p class="tight"><b>Development Review</b> asks one question: do the built materials match the approved intent and meet the standards? You do not get to answer it by feel. Before a module goes anywhere, it is checked against the module deliverables list, and “done” means every item on that list exists, is named to convention, and can be found. Not that the work went well.</p></div><div class="diag"><svg viewBox="0 0 720 118" role="img" aria-labelledby="dq-t"><title id="dq-t">The quality loop: select each stage</title><g class="fdu hot" tabindex="0" role="button" style="animation-delay:0.0s" aria-label="Build" data-name="Build" data-info="Materials made to the standards, which you now know cold."><rect x="20" y="26" width="118" height="44" rx="9" fill="#fff" stroke="#e8e1d6"/><text x="79" y="52" text-anchor="middle" font-size="12" fill="#1c2b3a" font-weight="600">Build</text></g><g class="fdu hot" tabindex="0" role="button" style="animation-delay:0.18s" aria-label="QA review" data-name="QA review" data-info="Module and course review against the deliverables list; findings documented."><rect x="172" y="26" width="118" height="44" rx="9" fill="#e3edf8" stroke="#1d5fa8"/><text x="231" y="52" text-anchor="middle" font-size="12" fill="#164a85" font-weight="600">QA review</text></g><g class="fdu hot" tabindex="0" role="button" style="animation-delay:0.36s" aria-label="Fix & recheck" data-name="Fix & recheck" data-info="Findings go back, get fixed, get re-verified. Cheap here, expensive later."><rect x="324" y="26" width="118" height="44" rx="9" fill="#fff" stroke="#e8e1d6"/><text x="383" y="52" text-anchor="middle" font-size="12" fill="#1c2b3a" font-weight="600">Fix & recheck</text></g><g class="fdu hot" tabindex="0" role="button" style="animation-delay:0.54s" aria-label="Ship" data-name="Ship" data-info="QA sign-off releases the course to Delivery and instructor training."><rect x="476" y="26" width="108" height="44" rx="9" fill="#e7f4ee" stroke="#1f9d76"/><text x="530" y="52" text-anchor="middle" font-size="12" fill="#186b52" font-weight="600">Ship</text></g><g class="fdu hot" tabindex="0" role="button" style="animation-delay:0.72s" aria-label="Cohort" data-name="Cohort" data-info="Surveys and results come back, and become the next revision’s inputs."><rect x="618" y="26" width="88" height="44" rx="9" fill="#fff" stroke="#e8e1d6"/><text x="662" y="52" text-anchor="middle" font-size="12" fill="#1c2b3a" font-weight="600">Cohort</text></g><path class="fdu" style="animation-delay:0.1s" d="M 142 48 L 164 48" stroke="#1d5fa8" stroke-width="2.5" marker-end="url(#arrQ)"/><path class="fdu" style="animation-delay:0.28s" d="M 294 48 L 316 48" stroke="#1d5fa8" stroke-width="2.5" marker-end="url(#arrQ)"/><path class="fdu" style="animation-delay:0.46s" d="M 446 48 L 468 48" stroke="#1d5fa8" stroke-width="2.5" marker-end="url(#arrQ)"/><path class="fdu" style="animation-delay:0.64s" d="M 588 48 L 610 48" stroke="#1d5fa8" stroke-width="2.5" marker-end="url(#arrQ)"/><path d="M 662 74 Q 360 122 82 74" fill="none" stroke="#3f88c5" stroke-width="1.8" stroke-dasharray="4 4" marker-end="url(#arrQg)"/><text x="372" y="108" text-anchor="middle" font-size="10.5" fill="#3f88c5">findings become the next revision’s inputs</text><defs><marker id="arrQ" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" fill="#1d5fa8"/></marker><marker id="arrQg" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" fill="#3f88c5"/></marker></defs></svg><div class="dcap">👆 <b>Select each stage</b> of the loop your capstone plan will enter.</div></div>
 <div class="pullquote"><div class="pq">“Feedback is one of the most powerful influences on learning and achievement, but its impact depends entirely on the kind of feedback given.”</div><div class="pa">Hattie &amp; Timperley, “The Power of Feedback,” Review of Educational Research, 2007. Why every activity in this course answers you, and every rubric you write must too.</div></div><div class="meta"><span class="mi">🔍</span><div><b>Design note:</b> across the four units you got objectives up front, warm-ups, concepts with visuals, activated practice, unit checks, and a capstone that produces something real. That arc is the template.</div></div>`,
 activity:{type:"review",id:"d4ir",points:8,queueTag:"Unit 4 · does this belong on the done list?",
  labels:{yes:"✓ On the list",no:"✗ Not on the list",
    missYes:"✗ Look again: this one does not belong on the done list.",
    missNo:"✗ This one does belong. Re-read the deliverables checklist before deciding.",
    reasonPrompt:"Right, it is not on the list. Now say why:"},
  intro:"Five claims about a module being finished, of the kind people actually make at Development Review. Approve the ones that belong on the done list, and send back the ones that do not.",
  items:[
   {content:"Every deliverable on the module\u2019s list exists and is filed to convention.",
    good:true,
    why:"\u2713 On the list. \u201CDone\u201D is a set of things that exist and can be found. If a reviewer cannot locate a file from its name, the module is not finished regardless of how good the content is.",
    reasons:[]},
   {content:"The lessons read well and the developer is satisfied with them.",
    good:false,
    why:"\u2717 Not on the list. This is the misconception this unit exists to correct. Satisfaction is not evidence, and a module that feels finished can still be missing a rubric, an accessibility fix, or the summative.",
    reasons:[]},
   {content:"Every graded item has a rubric attached, and the rubric wording would produce the same score from two reviewers.",
    good:true,
    why:"\u2713 On the list. A graded item without a rubric hands the decision to whoever happens to mark it, which is how two learners doing equivalent work get different results.",
    reasons:[]},
   {content:"Accessibility has been checked against WCAG 2.1 AA.",
    good:true,
    why:"\u2713 On the list, and it is a condition of release rather than an improvement for later. An inaccessible lab is not a lower-quality lab; it is one some learners cannot complete at all.",
    reasons:[]},
   {content:"QA has signed off on the module.",
    good:false,
    why:"\u2717 Not on our list, because it is not ours to complete. Done means ready for QA. Waiting for their sign-off before calling our part finished confuses the handoff with the work.",
    reasons:[]}],
  fbGood:"That is the list: the deliverables exist, they are findable, graded items carry usable rubrics, accessibility is verified, and the module is ready for QA rather than already past it.",
  fbBad:"Look again at the two that are not on the list. One is a feeling rather than evidence. The other belongs to QA, not to us. Both are the common ways a module gets called finished when it is not."}},

{id:"msy",title:"When the build changes under you",crumb:"Unit 4 · When plans move",
 bridge:"Development Review measures a module against what was agreed for it. Between the design package and the gate, the agreement moves: scope changes, the domain expert goes quiet, the lab environment stops working.",
 frame:{now:"You are part-way through developing module 301 when the ground moves under it three separate times.",role:"You are the developer mid-build, holding a schedule that no longer describes the work.",resp:"Make the call at each turn, and be ready to say what it costs and who needs to know.",use:"The development process section of the Handbook, and your project charter.",why:"A change nobody recorded arrives at Development Review as a surprise, and a surprise at a gate costs more than the original problem did."},
 mins:10,
 lead:"Every build meets something it did not plan for. Six of those moments follow, taken from real builds, and each one needs a call you can defend in writing to your director.",
 
 brief:{from:"ID&D Director",re:"Six situations from real builds",text:"None of these have a comfortable answer, which is why they are worth practicing. What I care about is the pattern in your calls: never silent. Document, propose options, escalate early, and let the owner of the decision decide."},
 coach:"Read the situation, then <b>select the call you would make</b>. A wrong pick is disabled and explains what it costs downstream, and you pick again on the same situation, so the walk is only scored in full if you go clean. The pipeline at the top fills in as you go, and the walk ends when the sixth situation is stamped.",
 hint:"Every right answer has the same shape: constraints get documented, options get proposed, decisions get made by the people who own them, and all of it happens in writing while there is still room to act.",
 html:`<p><strong>Plans meet reality on every build.</strong> Clients change direction, reviewers miss dates, environments fail, equipment arrives late. None of that is a planning failure. It is the normal condition of the work, and what gets assessed is the response.</p>
 <div class="ruleline"><b>Whatever moved,</b> the shape of the response matters more than the option you land on.</div>
 <div class="diag"><svg viewBox="0 0 720 112" role="img" aria-labelledby="msy-d"><title id="msy-d">The three moves when a plan meets reality</title><rect x="12" y="26" width="216" height="60" rx="10" fill="#e3edf8" stroke="#1d5fa8" stroke-width="1.5"/><text x="120" y="50" text-anchor="middle" font-size="11.5" font-weight="700" fill="#1c2b3a">Document</text><text x="120" y="68" text-anchor="middle" font-size="10" fill="#42566a">What changed, dated, with impact</text><line x1="232" y1="56" x2="248" y2="56" stroke="#7a8a99" stroke-width="1.6"/><polygon points="250,56 244,52 244,60" fill="#7a8a99"/><rect x="254" y="26" width="216" height="60" rx="10" fill="#fff" stroke="#e8e1d6" stroke-width="1.5"/><text x="362" y="50" text-anchor="middle" font-size="11.5" font-weight="700" fill="#1c2b3a">Bring options</text><text x="362" y="68" text-anchor="middle" font-size="10" fill="#42566a">With tradeoffs, not a dead end</text><line x1="474" y1="56" x2="490" y2="56" stroke="#7a8a99" stroke-width="1.6"/><polygon points="492,56 486,52 486,60" fill="#7a8a99"/><rect x="496" y="26" width="216" height="60" rx="10" fill="#fff" stroke="#e8e1d6" stroke-width="1.5"/><text x="604" y="50" text-anchor="middle" font-size="11.5" font-weight="700" fill="#1c2b3a">Escalate early</text><text x="604" y="68" text-anchor="middle" font-size="10" fill="#42566a">While there is room to act</text></svg><div class="dcap">The same three moves, in this order, whatever moved.</div></div>
 <p><strong>Options are what make a change routable.</strong> \u201CThis cannot be done\u201D ends the conversation. Two routes with their costs attached hands the decision to the person who owns it. Name the tradeoff you would accept, and give them a date to answer by.</p>
 <p><strong>Timing decides what a warning is worth.</strong> A flag raised in week two is a decision. The same flag in week six is too late, because the room to act has gone.</p>
 <div class="spec"><div class="spec-h">Escalation note &middot; SME review on module 3, five days late</div>
 <div class="spec-b">To:&nbsp; ID&amp;D Director<br>
 Re:&nbsp; Module 3 SME review, 14 Oct, not received<span class="an"> &nbsp;what changed, dated</span><br>
 <br>
 QA submission is 21 Oct. Review is the gate before it.<span class="an"> &nbsp;impact</span><br>
 <br>
 A.&nbsp; Move QA one week. Launch date holds.<br>
 B.&nbsp; Review critical items only. QA date holds.<br>
 C.&nbsp; Alternate reviewer. Two days to brief them.<span class="an"> &nbsp;options, with what each costs</span><br>
 <br>
 I would take B and log the untouched items.<span class="an"> &nbsp;the tradeoff you would accept</span><br>
 Need your call by Thursday.<span class="an"> &nbsp;a date</span></div>
 <div class="spec-n">Nine lines, and the director can decide from them. The date on the note is what makes it evidence later, when somebody asks when this was known.</div></div>
 <div class="box rule"><span class="bh">The move that is always wrong</span><p class="tight">Absorbing the problem quietly. Leadership then plans the next build on a record saying this one ran clean, so the same slip repeats on somebody else. A shared problem becomes a personal one, at your own expense.</p></div>
 <p><strong>When scope has to give, protect the evidence.</strong> The summative that proves competency is the last thing cut. Without it, the module cannot show that a learner can do the job. Trim practice volume, reduce polish, narrow scope, or move the date.</p>
 <p class="tight" style="color:var(--muted)">Six situations follow. For each, pick the response you would defend in writing to your director.</p>`, activity:{type:"story",id:"msys",points:18,
  steps:[
   {tag:"Situation 1 of 6 · Mid-build platform change",text:"Six weeks into a customized build, the client announces their environment is moving to a different platform. Half your labs assume the old one. What’s your first move?",
    opts:[{t:"Quietly start rewriting the labs for the new platform: it’s going to happen anyway.",fb:"Now the blueprint, charter, and timeline all describe a project that no longer exists. Undocumented scope change is how builds lose their paper trail."},
          {t:"File a change request with an impact assessment: affected materials, added time, environment needs, before touching anything.",ok:true,fb:"Right. Client changes are routed, not absorbed: impact first, decision by the owner, then work. The change log is the project’s memory."},
          {t:"Push back. The charter says the old platform, so the client is out of scope.",fb:"Charters are agreements, not walls. Client-driven change is normal; the discipline is routing it, not blocking it unilaterally."}]},
   {tag:"Situation 2 of 6 · The SME misses the deadline",text:"Your domain reviewer is a week late on module 3 review, and QA is scheduled. You could probably cover it yourself over the weekend.",
    opts:[{t:"Absorb it. Work the weekend, keep the timeline green.",fb:"The timeline is now lying. Hidden absorption means leadership plans the next build on data that says this one was fine. The same slip repeats on the next build."},
          {t:"Escalate early with options: shift QA a week, descope module 3 review to critical items, or bring in an alternate reviewer.",ok:true,fb:"Exactly, escalation is options, not blame. Early and with alternatives, it’s a professional act; late and bare, it’s a crisis."},
          {t:"Report the SME to leadership and demand consequences.",fb:"Escalation is about the work, not the person. Bring options for the schedule, not a case for the prosecution."}]},
   {tag:"Situation 3 of 6 · The environment can’t support the lab",text:"Infrastructure confirms the planned lab environment can’t exist as designed. The lab is the evidence for a key objective.",
    opts:[{t:"Ship the lab as written. Infra will probably catch up by launch.",fb:"“Probably” is not an environment. Learners hitting a lab that cannot run is the most expensive possible way to discover this."},
          {t:"Document the constraint, propose alternative evidence for the same objective, and get the change approved.",ok:true,fb:"Right: the objective stays, the evidence adapts, and the decision is documented and owned. Constraints are design inputs, not secrets."},
          {t:"Delete the objective: no environment, no objective.",fb:"Objectives trace to job tasks, not to environments. When evidence can’t exist, the evidence changes: the outcome shouldn’t silently vanish."}]},
   {tag:"Situation 4 of 6 · QA finds a serious problem near launch",text:"Ten days out, QA flags a serious defect in module 2. Fixing it properly risks the launch date.",
    opts:[{t:"Ship quietly and patch after the cohort starts. Nobody will notice week-one.",fb:"Learners will notice, instructors will notice, and the defect log will notice that it was known. Quiet shipping converts a product problem into a trust problem."},
          {t:"Force a readiness decision: fix before ship, or ship with a documented, owner-approved exception and a dated fix plan.",ok:true,fb:"That’s the discipline: launch readiness is a decision someone owns, made in the open. Either outcome can be right. Silence never is."},
          {t:"Push back on QA for flagging it this late.",fb:"The timing stings, but the defect is real regardless of when it was found. Shooting the messenger teaches QA to stop finding things."}]},
   {tag:"Situation 5 of 6 · The hours get cut",text:"The client cuts the program’s hours substantially, but wants “all the same outcomes.”",
    opts:[{t:"Compress, same content, faster. Learners will keep up.",fb:"Compression collapses the activated-learning time where skill actually forms. Same topics, less learning: the outcomes become fiction."},
          {t:"Renegotiate scope openly: fewer outcomes, done to standard, documented and agreed.",ok:true,fb:"Right. Hours are the budget outcomes are bought with. Fewer hours honestly buys fewer outcomes, done well. That conversation belongs in daylight, in writing."},
          {t:"Quietly pad the difference with self-study homework.",fb:"That’s a modality and scope change wearing a disguise: it needs the same open approval as any other scope decision."}]},
   {tag:"Situation 6 of 6 · The vendor pulls the lab",text:"Two weeks before launch, the vendor discontinues the hosted lab environment module 2 depends on. A similar free alternative exists. What’s the move?",
    opts:[{t:"Swap in the free alternative quietly: it covers the same skills.",fb:"Content changed after review, unseen by QA, undocumented in the blueprint, and the instructors discover the surprise live, in front of a cohort. Fast isn’t the problem; silent is."},
          {t:"Run change control: impact assessment, approval by the review owner, blueprint and change log updated, and Delivery notified with an updated facilitator guide before day one.",ok:true,fb:"Right. A fix can be fast AND governed. Approve it, document it, and above all: the instructors find out from you, not from a broken link."},
          {t:"Push the launch until the original vendor environment is restored.",fb:"Launch dates have owners too. Delaying unilaterally is the same governance failure as swapping silently, pointed the other way. Bring options to the owner."}]}],
  fbGood:"Six situations, one pattern: never silent. Document what changed, propose options, escalate while there is room to act, and let the owner of the decision decide. That pattern is the whole skill.",
  fbBad:"Six situations answered. Reread any step where the first pick was wrong. Every wrong call in this walk was a form of silence."}},
{id:"mbp",title:"Assemble the blueprint",crumb:"Unit 4 · The blueprint",
 bridge:"Done means a list of files that exist and can be found. Something has to make them findable, and that document is the blueprint.",
 frame:{now:"The module's files exist. Nothing yet tells anyone else what they are or what order they run in.",
  role:"You are assembling the handoff document QA and Delivery will navigate the module by.",
  resp:"Decide what belongs on the blueprint and what does not, then check the order against the way the module is taught.",
  use:"The module deliverables checklist and the file naming section of the Handbook.",
  why:"A blueprint is how somebody who was not on the build finds their way around it. Without one, the module is only navigable by the person who made it, which is the failure this whole unit exists to prevent."},
 mins:8,
 lead:"You met the term MBP in Unit 1, on the page where you learned to read our file names, and you have been creating the files it indexes ever since. This is where you build one. A module blueprint is the index of a single module: every material, in delivery order, linked.",
 coach:"<b>Write the rows into the two boxes.</b> The first is the module's own list in delivery order; the second is what you deliberately left off and why. Nothing is graded. When you <b>Save</b>, an experienced developer's blueprint appears beside yours with a checklist to run your own against.",
 hint:"A blueprint indexes what is delivered, in the order it is delivered. Anything a learner or instructor never touches, and anything that lives at course level rather than module level, is somebody else's document. If a row would not help a stranger find a file, it is not earning its place.",
 html:`<p><strong>What a blueprint is for.</strong> Everything in the module now exists. That is not the same as the module being usable by anyone else. QA reviews from the blueprint, Delivery builds the Canvas course from the blueprint, and an instructor who inherits the module reads it to see what runs when. It is the one document whose whole job is making the other documents findable.</p>
 <div class="box rule"><span class="bh">One per module, current at handoff</span><p class="tight">One blueprint per module. It lists every material a learner or instructor touches, in delivery order, each linked and named exactly as the file is named. It is created during Developing, as soon as the module has content, and kept current as each file is built. A blueprint written at the end is written from memory.</p></div>
 <div class="box info"><span class="bh">What goes on it, and what does not</span><ul class="blist"><li><b>On it:</b> every lesson, every lab, every quiz, the module's KBA and SBA, the rubrics attached to graded work, and the facilitator guide.</li><li><b>Not on it:</b> anything at course level, which belongs on the Course Blueprint instead, and anything internal to us. Project charters, intake decisions, QA findings and draft notes are all real documents, and none of them are things a learner or instructor touches.</li><li><b>The test:</b> would this row help somebody who was not on the build find a file they need in order to run the module? If not, it belongs somewhere else.</li></ul></div>
 <div class="spec"><div class="spec-h">MBP 301 &middot; rows in delivery order</div><div class="spec-b">Lesson 301.1&nbsp; Hardware foundations<span class="an"> &nbsp;linked</span><br>GLAB 301.1.1&nbsp; Component identification<span class="an"> &nbsp;linked</span><br>Quiz 301.1&nbsp; Lesson check<span class="an"> &nbsp;linked</span><br>Lesson 301.2&nbsp; Operating systems<span class="an"> &nbsp;linked</span><br>GLAB 301.2.1&nbsp; Fault isolation<span class="an"> &nbsp;linked</span><br>KBA 301&nbsp; Module knowledge check<span class="an"> &nbsp;linked</span><br>SBA 301&nbsp; Ticket resolution<span class="an"> &nbsp;Rubric 301 linked from this row</span><br>FG 301&nbsp; Facilitator guide<span class="an"> &nbsp;module level</span></div><div class="spec-n">Teaching order, not build order. The rubric hangs off the row it grades. A MERN blueprint is the same document with an ALAB where the GLAB sits.</div></div>
 <p class="tight">You never draw a blueprint from scratch. The Module Blueprint Template, and the Course Blueprint Template for the course level, are in ${gl('templates','templates &amp; links')}, and both come with the columns already named.</p>
 <div class="ruleline"><b>Real blueprints to read.</b> <a href="https://docs.google.com/document/d/1oVfC3B3Bz3fdJ-dhkqVRBqPxNRkoP7xEtw_YCZwtbCs/edit?tab=t.0#heading=h.qyjfmdipkf8v" target="_blank" rel="noopener">Open the worked example</a> and compare its rows with the ones you are about to write. These are blueprints from shipped modules, so the columns, the ordering and the linking are all what ours actually look like.</div>
 <p class="tight" style="color:var(--muted)">Write your own rows below, then say what you left off and why.</p>`,
 activity:{type:"journal",id:"mbpw",
  fields:[
   {label:"1. Your blueprint rows. Every material a learner or instructor touches, in delivery order, named to convention.",
    ph:"Lesson 301.1 \u2014 ...\nGLAB 301.1.1 \u2014 ...\nQuiz 301.1 \u2014 ...\nKBA 301 \u2014 ...\nSBA 301 + Rubric 301 \u2014 ...\nFG 301 \u2014 ...",short:"Box 1 · the rows",checks:[{"pattern":"(GLAB|ALAB|KBA|SBA|FG|Quiz|Lesson)\s*[0-9]","ok":"Rows named to convention.","no":"No file names to convention. A row that cannot be found from its name is not doing its job."},{"want":"FG","ok":"The facilitator guide is on it.","no":"No facilitator guide row. A module handed over without one has no instructions for running it."},{"minWords":12,"ok":"Enough rows to be a blueprint.","no":"Too few rows. A blueprint lists every material a learner or instructor touches."}]},
   {label:"2. What you left off, and why. Name two documents that exist for this build but do not belong on this blueprint.",
    ph:"The project charter, because \u2026 and the QA findings log, because \u2026",short:"Box 2 · what you left off",checks:[{"want":"because|since|internal|not delivered|never touch","ok":"Says why each one is off.","no":"No reason given. The test is whether a learner or instructor ever touches it."}]}],
  modelHead:"An experienced developer\u2019s blueprint, and how to check yours",
  model:`<p class="tight"><b>The rows.</b> Lesson 301.1 and 301.2 in teaching order, each linked. GLAB 301.2.1 positioned after the lesson it belongs to. Quiz 301.2. KBA 301 and SBA 301 at the end where they are sat, with Rubric 301 linked from the SBA row it grades. FG 301 at module level.</p>
  <p class="tight"><b>Left off.</b> The project charter and the QA findings log. Both are real documents and neither is delivered material, so neither helps somebody find a file they need in order to run the module.</p>
  <div class="box rule" style="margin-top:10px"><span class="bh">Check your own against these</span><ul class="blist"><li>Every row is a material a learner or instructor actually touches.</li><li>Delivery order, not the order you built them in.</li><li>Every graded row links its rubric.</li><li>Names match the files exactly, so a row can be found from its name alone.</li><li>Nothing internal to us: charters, findings, drafts.</li><li>The facilitator guide is on it. A module handed over without one has no instructions for running it.</li></ul></div>
 <p class="tight" style="color:var(--muted)">A row that would not help a stranger find a file is not earning its place.</p>`},
 transition:"The module is indexed and the handoff has a document. What is left is the guide the instructor teaches from, and then what happens once the course runs."},
{id:"fgq",title:"Complete the facilitator guide",crumb:"Unit 4 · The facilitator guide",
 bridge:"The blueprint indexes the module for whoever opens it next. Nothing in it says how to teach any of it. That is the facilitator guide, and it is the last thing built before the module leaves the team.",
 frame:{now:"Module 301 is built and indexed. FG 301 has been drafted a section at a time.",role:"You are reading those drafts as the instructor who was not in the room when this was built.",resp:"Approve each section an instructor could run the module from, and name what is missing in the ones they could not.",use:"The facilitator guide standard in the Handbook, and the FG template.",why:"A module that needs its author in the room to run has not been handed over."},
 mins:8,
 lead:"The Module Facilitator Guide is what an instructor teaches from. It carries six named sections: content breakdown, materials, delivery detail, tips, troubleshooting and FAQ, and closure. FG 301 has one draft per section, and some of those drafts would leave an instructor stranded.",
 
 brief:{from:"Product Quality & Experience (QA)",re:"FG 301: pre-Delivery review",text:"Instructors report receiving courses without understanding how to teach them. Five drafted sections from FG 301 follow. Approve what would hold up for an instructor at 2pm on a hard day, and send back what would not."},
 demo:{eg:"FG 301 excerpt: \u201CWarm-up (20 min): if the room is quiet, seed with the two starter questions below. If it runs long, cut to one and move on. The lab needs its full hour.\u201D",steps:["My lens: could an instructor who did not build this course act on it at 2pm on a hard day? This hands them a concrete move for a real classroom moment.","It also protects the load-bearing block by naming the tradeoff out loud. Pacing plus priority is the teaching layer.","Verdict: \u2713 Approve. Read your five the same way, with the author out of the building."]},
 coach:"<b>Write one section into each box.</b> Take the troubleshooting and FAQ section first, then the delivery detail. Write for an instructor who was in none of your design conversations and teaches this next month. Nothing is graded. When you <b>Save</b>, a worked version of both appears beside yours.",
 hint:"A facilitator guide is the teaching layer over the learner materials: pacing with priorities, the misconceptions this module reliably produces, demo notes, and troubleshooting the instructor can work through alone.",
 html:`<p><strong>The instructor teaching module 301 was in none of the design conversations.</strong> They meet it the week it runs, and what they have is FG 301. Design intent survives that handoff only in writing.</p>
 <div class="terms"><div class="th">The six sections of a Module FG</div><dl>
 <dt>Content breakdown</dt><dd>What happens and why, activity by activity, so a block can be adapted without breaking the objective.</dd>
 <dt>Materials</dt><dd>What has to exist before class: accounts, environments, files, printed handouts.</dd>
 <dt>Delivery detail</dt><dd>How long each block runs, what compresses when the morning overruns, and what is never cut.</dd>
 <dt>Tips</dt><dd>Look-fors, model answers, and the misconceptions this module reliably produces.</dd>
 <dt>Troubleshooting &amp; FAQ</dt><dd>The predictable wrong turns, and a failed environment. The section instructors open most.</dd>
 <dt>Closure</dt><dd>How the module ends, what gets checked, and what the instructor hands on.</dd></dl></div>
 <div class="spec"><div class="spec-h">FG 301 &middot; delivery detail and troubleshooting, lesson 301.2</div>
 <div class="spec-b">09:45&nbsp; GLAB 301.2.1 &nbsp;90 min<span class="an"> &nbsp;never cut: produces the evidence KBA 301 measures</span><br>
 11:30&nbsp; Fault-class lecture &nbsp;30 min<span class="an"> &nbsp;compress to 15 if the morning overran</span><br>
 <br>
 Stall point, step 6:<span class="an"> &nbsp;the wrong turn this lab reliably produces</span><br>
 &nbsp; Learners restart the service before saving the rule file.<br>
 &nbsp; Ask what the config showed when they saved it.<br>
 <br>
 If the VM image fails to load:<span class="an"> &nbsp;what to try before paging anyone</span><br>
 &nbsp; 1. Re-issue the token from the instructor console.<br>
 &nbsp; 2. Fall back to the browser sandbox, linked in Materials.<br>
 &nbsp; 3. Still down after 10 minutes: page infra on #infra-support.</div>
 <div class="spec-n">Every line carries a decision: what flexes, the question to ask at the stall point, and what to try before anybody is paged.</div></div>
 <div class="vs">
 <div class="a"><div class="vh">A guide</div><p>Says what runs, what it may compress to, what is never cut, where learners stall, and what to say when one of them does.</p></div>
 <div class="b"><div class="vh">A schedule</div><p>Says what runs and for how long. The instructor rebuilds the intent by guessing, and classroom quality drifts from what was designed.</p></div></div>
 <p class="tight">The Module Facilitator Guide Template and the completed module 601 guide, kept as the exemplar, are in ${gl('templates','templates &amp; links')}. Draft into the template.</p>
 <p class="tight" style="color:var(--muted)">Five drafted sections follow. Approve what an instructor could run the module from, and name what is missing in the rest.</p>`,
 activity:{type:"journal",id:"fgqw",
  fields:[
   {label:"1. Troubleshooting and FAQ, for GLAB 301.2.1. Where learners predictably stall, and what the instructor does about it.",
    ph:"Stall point, step 6: \u2026\nWhat to ask: \u2026\nIf the environment fails: \u2026",short:"Box 1 · troubleshooting and FAQ",checks:[{"want":"ask|question|check|confirm","ok":"Gives the instructor something to ask.","no":"No question for the instructor to ask. A diagnosis without a next move is not troubleshooting."},{"minWords":15,"ok":"Names the stall point and the response.","no":"Too short to carry both where learners stall and what the instructor does about it."}]},
   {label:"2. Delivery detail for the same lesson. How long each block runs, what may compress when the morning overruns, and what is never cut.",
    ph:"09:00 warm-up 15 min \u2026\nNever cut: \u2026",short:"Box 2 · delivery detail",checks:[{"want":"min|minutes","ok":"Timing is stated.","no":"No timing. Delivery detail says how long each block runs."},{"want":"never|not cut|protect|hold","ok":"Says what is never cut.","no":"Nothing marked as protected. A guide that flexes everything tells an instructor nothing about priority."}]}],
  modelHead:"A worked version of both sections, and how to check yours",
  model:`<p class="tight"><b>Troubleshooting and FAQ.</b> \u201CStall point, step 6: learners restart the service before saving the rule file, so the change disappears and the lab looks broken. Ask what the config showed when they saved it. If the VM image fails to load: re-issue the token from the instructor console, fall back to the browser sandbox linked in Materials, and if it is still down after ten minutes page infra on #infra-support.\u201D</p>
  <p class="tight"><b>Delivery detail.</b> \u201CWarm-up 15 min. Configuration demo 15 min, compress to 8 if the morning ran long. GLAB 301.2.1 90 min, never cut: it produces the evidence KBA 301 measures. Exit ticket 15 min.\u201D</p>
  <div class="box rule" style="margin-top:10px"><span class="bh">Check your own against these</span><ul class="blist"><li>Every line carries a decision, not a description of what happens.</li><li>The stall point names the wrong turn the lab reliably produces.</li><li>There is a question to ask, not just a diagnosis.</li><li>The fallback path ends with who to contact and when.</li><li>Timing says what flexes and what is never cut, and why.</li><li>An instructor could run it without asking you anything.</li></ul></div>
  <p class="tight" style="color:var(--muted)">If a section only lists what happens, it is a schedule. The guide is the part that says what to do about it.</p>`}},
{id:"qagate",title:"Answer the QA findings",crumb:"Unit 4 · QA findings",
 bridge:"The module is built, indexed, and documented for an instructor who was not on the build. That is the point where it leaves our desks. Product Quality & Experience reads it next, and what comes back has your name on every row.",
 frame:{now:"Module 301 went to QA. The findings document is back, seven rows long.",
  role:"You are the developer answering findings on your own module.",
  resp:"Decide row by row whether the finding gets fixed or gets questioned, then name what you are putting back.",
  use:"The module deliverables checklist in the Handbook.",
  why:"A defect caught on this document costs an afternoon. The same defect found by an instructor mid-cohort costs a class, and costs a learner the evidence they came for."},
 mins:10,
 lead:"Module and Course QA is step 5. Product Quality & Experience reviews each module, then the whole course, and returns written findings. You fix what is flagged and resubmit. Not every row is fixable as written, and one of these is wrong.",
 brief:{from:"Product Quality & Experience (QA)",re:"Module 301 QA: findings, round 1",text:"Reviewed module 301 against the module deliverables checklist. Seven findings follow. Fix what applies, respond on each row so we can re-verify it, and resubmit. If you disagree with a row, say so on it and point at the standard."},
 coach:"One finding at a time. <b>✓ Fix it</b> stamps the row as actionable and sends you to the file. <b>✗ Question it</b> holds the row and asks you to pick what you are writing back to QA. Fixing a row you did not understand costs a rebuild and a second round of findings on the same file; questioning a row that already named the file and the defect costs QA a reply they should not have needed. Each verdict explains itself before the next row appears, and the queue ends when all seven rows carry an answer.",
 hint:"Test each finding twice. Could you act on it today without asking anyone what it meant? And does it hold against a standard you can point at in the Handbook? Failing the first test earns a question. Failing the second earns a reply with the rule.",
 html:`<p><strong>What comes back from QA.</strong> Product Quality &amp; Experience reviews module 301 against ${gl('deliverables','the module deliverables checklist')}. What returns is a findings document: one row per problem, naming the file and the defect, with a column for your response.</p>
 <table class="mtbl"><tr><th>File</th><th>QA finding</th><th>Developer response</th></tr>
 <tr><td><span class="mono">GLAB301.2.1</span></td><td>Step 6 runs the dev server before the install step.</td><td>Fixed. Steps 5 and 6 swapped, lab re-run. Resubmitted.</td></tr></table>
 <div class="box rule"><span class="bh">Every row gets an answer</span><ul class="blist"><li><b>Fix it.</b> The row is specific and correct. Change the file, note the change on the row, resubmit. Rebuild from ${gl('templates','templates &amp; links')} when a document is replaced.</li><li><b>Question it.</b> The row is too vague to act on, or it contradicts a standard. Ask what they saw, or answer with the rule you built to.</li><li>A blank row returns at course QA, with less time left to spend on it.</li></ul></div>
 <p class="tight" style="color:var(--muted)">Work the findings below.</p>`,
 activity:{type:"review",id:"qagr",points:14,queueTag:"Module 301 · QA findings, round 1",
  labels:{yes:"✓ Fix it",no:"✗ Question it",
    missYes:"✗ Look again: acting on this row as written means guessing what QA meant, or changing something that is already right.",
    missNo:"✗ This row names the file and the defect. Fix it and resubmit rather than sending a question back.",
    reasonPrompt:"Right, this row goes back to QA. Now pick what you write in it:"},
  intro:"Seven findings on module 301, in the words QA used. Fix the ones you can act on. Question the ones you cannot, and name what you are asking.",
  items:[
   {content:"SBA 301 is graded and listed on the blueprint. No rubric is attached to it.",
    good:true,
    why:"✓ Fix it. Specific, correct, and straight off the checklist: every graded item carries a rubric scaled to course weight. Build it, link it from the SBA row on the blueprint, and record the fix on the finding.",
    reasons:[]},
   {content:"Lesson 301.2 needs work in the second half.",
    good:false,
    why:"✗ Question it. Reviewers write rows like this when they are moving fast. There is nothing here to change: no section, no defect, no standard named. One message settles what they saw.",
    reasons:[
     {t:"Ask QA which part of 301.2 they mean and what they saw there, then fix what they name",ok:true,fb:""},
     {t:"Rewrite the second half of 301.2 and resubmit",fb:"That rebuilds a lesson without knowing what was wrong with it. If QA meant the lab timing, the rewrite misses it and the row comes back."},
     {t:"Close the row, since pacing is a matter of opinion",fb:"Closing a finding you never understood puts it on the record as resolved. It reappears at course QA, with less time left to act on it."}]},
   {content:"KBA 301, item 7: two of the four options are defensible, and only one is keyed.",
    good:true,
    why:"✓ Fix it. A defect you can see and repair the same day. Rewrite the distractor so one option stands, re-key the item, and say so on the row. Every learner who picked the unkeyed correct answer would have been marked wrong.",
    reasons:[]},
   {content:"The blueprint lists GLAB 301.2.1, which was cut when the module was reordered. The link opens nothing.",
    good:true,
    why:"✓ Fix it. The blueprint is the document QA and Delivery navigate the module by, and a row pointing at a deleted file breaks that on the first click. Remove the row, then check the rows below it are still in delivery order.",
    reasons:[]},
   {content:"Module 301 has two labs and one KBA. Add a second KBA so each lab has an assessment behind it.",
    good:false,
    why:"✗ Question it, with the rule in hand. The deliverables checklist calls for a module-end KBA and/or SBA, not one per lab. Building a second KBA changes an assessment rhythm that was approved at Design Review, and QA does not own that decision. Answer on the row and leave the module as designed.",
    reasons:[
     {t:"Answer with the deliverables checklist: assessments close the module, and this rhythm was approved at Design Review",ok:true,fb:""},
     {t:"Write the second KBA, because arguing with QA delays the resubmission",fb:"It also ships an assessment the design never called for, which QA then has to review. Answering a wrong finding with the standard takes one row."},
     {t:"Skip the row and resubmit the module",fb:"An unanswered row reads as unresolved. It returns at course QA with nothing on the record explaining why it was dropped."}]},
   {content:"Three screenshots in Lesson 301.1 carry no alt text.",
    good:true,
    why:"✓ Fix it, ahead of everything else on this list. Accessibility is a condition of release rather than an improvement for later. A screenshot with no alt text is content a learner using a screen reader never receives.",
    reasons:[]},
   {content:"FG 301: the troubleshooting and FAQ section is a heading with nothing under it.",
    good:true,
    why:"✓ Fix it. QA read the guide the way an instructor will, and landed on the section instructors reach for hardest. Write the wrong turns this module produces and what an instructor does about each one.",
    reasons:[]}],
  fbGood:"Seven rows answered: five fixed, one sent back for detail, one answered with the standard behind it. That is a resubmission QA can re-verify row by row, because every row says what happened to it.",
  fbBad:"Look again at the two you did not fix. One named no file and no defect, so there was nothing to change yet. The other asked for an assessment the checklist does not require. Both still leave with an answer written on the row."},
 transition:"The findings are answered and module 301 goes back for re-verification. What arrives after a course clears QA and starts running is a different kind of request: changes to a course that already has a cohort in it."},
{id:"handoff",title:"Hand the course to Delivery",crumb:"Unit 4 · Handing over",
 bridge:"QA has re-verified the module, and the course around it has cleared review. None of it is in Canvas yet. Step 6, Implementing and Facilitating, is where the whole course leaves this team at once and the Canvas team builds it.",
 frame:{now:"The course has cleared QA. Nothing has been built in Canvas, and the Canvas team is waiting on what we send.",
  role:"You are the developer assembling the package that leaves the team.",
  resp:"File each material at the level it hands over at, and hold back anything that is not ours to send.",
  use:"The module deliverables checklist, which names the course-level documents alongside the module ones.",
  why:"A handover that sends the Canvas team back to ask what a file is, where it lives, or whether a link is final, spends their build week and ours on questions the package should have answered."},
 mins:8,
 lead:"Delivery means two things here, and both matter today. The delivery stage covers the Canvas build, instructor training, and teaching. The Delivery team, which most call the Canvas team, builds the Canvas course. They do not teach it, and they do not write materials. What they build from is the Course Blueprint, which holds every module blueprint in the course.",
 brief:{from:"Delivery (Canvas team)",re:"UCI 1042: what to send us",text:"We build the Canvas course out of what you hand over, and we write none of it. Send the module packages and the course-level documents, each named to convention and linked from a blueprint we can follow. Flag anything we have to build inside Canvas rather than upload, because we will not guess at it."},
 coach:"<b>Drag each card onto one of the three trays</b>, or select a card and then select a tray. The keyboard works the same way. A card in the wrong tray bounces with a line saying what that tray holds, and every bounce costs the clean run. The sort closes when the ninth card is placed.",
 hint:"Module level is what one module needs in order to run: its lessons, labs, quizzes, KBA, SBA, rubrics, MBP and facilitator guide. Course level is written once for the whole course, and the CBP sits there. Anything produced on the other side of the handover, by the Canvas team or by an instructor, is not ours to send.",
 html:`<p><strong>The handover happens once, at the end of development.</strong> Everything goes at the same time, because Delivery does the Canvas build in one pass and a course arriving module by module leaves them rebuilding around gaps. ${gl('deliverables','The deliverables checklist')} names what sits at each level.</p>
 <div class="ruleline"><b>The Course Blueprint (CBP)</b> is the index the Canvas team builds from, and it holds every module blueprint in the course. Every file on it exists, is named to convention, and is linked.</div>
 <div class="spec"><div class="spec-h">CBP 1042 &middot; handover rows</div>
 <div class="spec-b">MBP 301<span class="an"> &nbsp;linked, current at handover</span><br>
 Syllabus 1042<span class="an"> &nbsp;linked, current</span><br>
 KBA 301<span class="an"> &nbsp;New Quizzes item bank: Delivery builds this</span><br>
 SBA 301 + Rubric 301<span class="an"> &nbsp;rubric attaches to the assignment in Canvas</span><br>
</div>
 <div class="spec-n">Anything Delivery must build rather than upload is named on its row. What is not named comes back as a question.</div></div>
 <p class="tight">Both blueprint templates and the syllabus are in ${gl('templates','templates &amp; links')}.</p>
 <p class="tight" style="color:var(--muted)">File the seven deliverables below.</p>`,
 activity:{type:"sort",id:"hdos",points:12,
  buckets:[{k:"m",label:"Module level"},{k:"c",label:"Course level"}],
  cards:[
   {t:"MBP 301, the module blueprint",k:"m"},
   {t:"FG 301, the module facilitator guide",k:"m"},
   {t:"KBA 301, SBA 301 and Rubric 301",k:"m"},
   {t:"Course Blueprint (CBP)",k:"c"},
   {t:"Syllabus and training schedule",k:"c"},
   {t:"Capstone, resume skills doc, interview questions",k:"c"},
   {t:"Course facilitator guide, the course-level index",k:"c"}],
  fbGood:"Seven placed clean. Module level is what one module needs in order to run; course level is written once and holds the modules together. The Course Blueprint sits at course level and links out to every module blueprint under it.",
  fbBad:"All filed. The CBP is the card people misfile: one per course, holding every module blueprint under it, and the Canvas team builds the whole course from it in one pass."},
 transition:"The package is with the Canvas team and the Canvas course gets built from it. Nobody has yet been shown how to teach it, and that is a request to change a course that is already running."},
{id:"itrain",title:"Prepare the instructors to teach it",crumb:"Unit 4 \u00b7 Instructor enablement",
 bridge:"A module that clears QA is finished as a set of files. The people who will teach it have not seen any of it, and step 6 is where that gets fixed: handoff to Delivery, then instructor training, which we run with IDQA.",
 frame:{now:"Module 301 has cleared QA and moves to Delivery. Its instructors have not met it yet.",
  role:"You are the developer who built the module, deciding how its instructors get trained on it.",
  resp:"For each situation, pick the enablement it calls for, or say the facilitator guide already carries it.",
  use:"The development process section of the Handbook: step 6 and the Delivery Check.",
  why:"Instructor-enabled is one of three legs of the Delivery Check. A course nobody was trained on does not launch."},
 mins:8,
 lead:"Enablement takes one of two forms, and the developer picks. Recorded curriculum walkthroughs cover the module, its intent, and where learners stall. A live session over Zoom covers the same ground with instructors in the room asking questions, and it is recorded too. The choice carries costs on both sides, which makes it a design decision rather than a calendar one.",
 coach:"<b>Read each situation, then press the enablement it calls for.</b> Three stamps: recorded walkthrough, live session recorded, or the facilitator guide already covers it. Booking a room for six sites in four time zones costs a scheduling round nobody can win; sending an instructor to the guide when they needed a conversation costs a week of class. Each stamp explains itself before the next situation loads, and the queue closes when all five are stamped.",
 hint:"Go live where the risk is the question you did not anticipate: a new build, an untested environment, a domain the instructor has not taught. Record where the same content has to reach people on different start dates: several sites, a later cohort, someone picking the module up mid-run. Send it to the guide where nothing changed about how the module is taught.",
 html:`<p><strong>Instructor-enabled is one of three legs of the Delivery Check.</strong> The facilitator guide is the reference; training with IDQA makes an instructor confident using it.</p>
 <div class="vs">
 <div class="a"><div class="vh">Live over Zoom, recorded</div><p>Questions answered in the room, including the ones nobody anticipated, and the instructor meets whoever built the module. Costs a scheduling round, and reaches whoever attends.</p></div>
 <div class="b"><div class="vh">Recorded walkthrough</div><p>Watchable before teaching, consistent across sites and cohorts, no scheduling. Nothing in a recording surfaces the question an instructor did not know to ask.</p></div></div>
 <p class="tight">Either format covers the same ground, and ${gl('templates','the Instructor Prep Guide template')} holds it:</p>
 <ul class="cl"><li>Module intent, and where it sits in the course</li>
 <li>The objectives, and the evidence that proves them</li>
 <li>The labs, and the environment they need</li>
 <li>Where learners predictably stall</li>
 <li>How the graded items are scored</li></ul>
 <div class="ruleline"><b>The recording is the artifact that outlasts the cohort.</b></div>
 <p class="tight" style="color:var(--muted)">Five situations follow. Stamp each with what it needs.</p>`,
 activity:{type:"triage",id:"itrt",points:12,
  buckets:["\uD83C\uDFAC Recorded walkthrough","\uD83D\uDCAC Live session, recorded","\uD83D\uDCD8 The facilitator guide already covers it"],
  items:[
   {from:"ID&D Director",subj:"Module 402 starts in three weeks",
    body:"New build. The lab runs in a vendor sandbox no instructor here has taught in. Two instructors assigned.",ans:1,
    why:"Live session, recorded. An environment nobody has taught in produces questions that were never written down, and two instructors is a room worth booking. Record it, and the next site inherits the answers without a second session."},
   {from:"Delivery, cohort 1108-02",subj:"Instructor covering module 301 from Thursday",
    body:"Our instructor is out. A colleague picks up module 301, which has run four times, and teaches it in two days.",ans:0,
    why:"Recorded walkthrough. The walkthroughs for this module exist, and one person can watch them tonight. Waiting on a calendar spends the two days they have, and a session held for a single instructor teaches nobody else."},
   {from:"Delivery operations",subj:"Module 305 runs at six sites next quarter",
    body:"Six instructors, four time zones, start dates spread across the quarter.",ans:0,
    why:"Recorded walkthrough. Six instructors starting on six dates cannot share one room, and repeating the session drifts: the fourth telling is not the first. One recording gives every site the same account of the module."},
   {from:"Product Quality & Experience",subj:"KBA 301 item 5 rekeyed after a maintenance fix",
    body:"One distractor rewritten, one answer key corrected. Nothing else in the module moved.",ans:2,
    why:"The facilitator guide already covers it. The tips section carries the model answers, so the correction is filed there and the instructor reads it where they were going to look anyway. Calling a session for one item trains people to skip sessions."},
   {from:"ID&D Director",subj:"Module 210 networking, new instructor",
    body:"Strong classroom record, has taught support rather than networking. Module 210 has run two years and its walkthroughs are recorded.",ans:1,
    why:"Live session, recorded. Recordings answer the questions an instructor knows to ask. Somebody new to the domain cannot yet name which parts of module 210 will trip them, and that gap surfaces in conversation. Keep the recording: the next instructor arriving from outside networking gets it too."}],
  fbGood:"Five stamped, and two of them against the format that would have cost less. The risk decides: unanticipated questions buy a room, spread start dates buy a recording, and a change that leaves the teaching untouched buys neither.",
  fbBad:"Look again at the ones you missed. Two questions sort all five: is somebody about to ask what we did not anticipate, and do the people who need this start on the same day."},
 transition:"Module 301 is handed over and its instructors are trained, so the course is running with learners in it. The next thing to arrive is a request to change it while a cohort is mid-course."},
{id:"schg",title:"Route the change evidence",crumb:"Unit 4 · Change requests",
 bridge:"A cohort is running the course now. Requests to change it land with us, because we built it, and the first decision on every one of them is which route it takes.",
 frame:{now:"The course is live, and the requests to change it are landing on our desk.",role:"You are the owner of a running course, deciding what each request actually is.",resp:"Route each one: ours to fix now, or back to Design because it changes what learners must prove.",use:"The UCI and versions section of the Handbook.",why:"A change that alters what a learner must be able to do is a new version, and the version number is not ours to issue."},
 mins:8,
 lead:"Requests to change a live course land with us. Corrections that leave what learners must prove untouched are ours to make. Anything that moves an objective, an assessment, or the hours goes back to Design, because the revision number is their decision.",
 coach:"<b>Read each request, then press the route it takes.</b> Four routes: hotfix, maintenance, no product change, or planned revision. The sender's proposed route is on the card and is a proposal, not the answer. A wrong route explains itself and the next request loads. The queue closes when all five are routed.",
 hint:"Hotfix = a narrow live blocker or material defect. Maintenance = a low-risk correction. Planned revision = changed intent, scope, hours, outcomes, technology, or assessment strategy. No product change = a delivery, access, or support issue, not a product one.",
 demo:{eg:"Delivery reports: \u201CModule 2 quiz, question 4 has a typo. \u2018teh\u2019 for \u2018the.\u2019 Proposed route: planned revision, next quarter.\u201D",steps:[
 "Diagnose before routing: is anything blocked? No. Is intent, scope, or the assessment strategy changing? No: it is a spelling defect.",
 "That is maintenance: a low-risk correction, logged and done. Parking it behind a quarterly revision leaves a known defect live for months, and escalating it to hotfix burns the emergency lane.",
 "Verdict: \u2717 Send back, reroute as maintenance. Your queue: match the route to the impact, never to the urgency."]},
 html:`<p><strong>The first decision on a change request is which route it takes.</strong> Requests arrive urgent and unsorted, and misrouting costs in both directions. A small correction treated as a full revision burns weeks. A real content change treated as a small fix ships an unversioned course that nobody can reconstruct later.</p>
 <div class="spec"><div class="spec-h">Change request &middot; CR 1042-014, as it lands</div>
 <div class="spec-b">Raised by:&nbsp; Delivery, cohort 1042-03<br>
 Date:&nbsp; 12 Nov, day 4 of module 302<br>
 File:&nbsp; GLAB 302.3.1<span class="an"> &nbsp;what to open</span><br>
 Reported:&nbsp; step 4 links to the retired vendor console.<br>
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 18 learners blocked in class this morning.<span class="an"> &nbsp;what is broken, and for whom</span><br>
 Proposed route:&nbsp; planned revision, next quarter<span class="an"> &nbsp;a proposal, not the decision</span></div>
 <div class="spec-n">Everything above the last line is evidence. The last line is an opinion. Learners blocked this morning routes this today, whatever the sender proposed.</div></div>
 <div class="vs">
 <div class="a"><div class="vh">Ours to fix</div><p><b>Hotfix.</b> Live and broken: a dead link, a wrong command, a missing file. Fix now, log it, no version change.<br><b>Maintenance.</b> A correction with no instructional impact. Verified and logged, no new version.<br><b>No product change.</b> The fault is in delivery, access, or expectation. The fix is a conversation.</p></div>
 <div class="b"><div class="vh">Back to Design</div><p><b>Planned revision.</b> Content, objectives, sequence, or assessments change, and what a learner must prove changes with them. That earns a revision number, which Design issues. We diagnose it, size it, and hand it over with the evidence attached.</p></div></div>
 <div class="diag"><svg viewBox="0 0 720 240" role="img" aria-labelledby="schg-t"><title id="schg-t">Routing a change request: three questions decide the route</title>
 <rect x="270" y="10" width="180" height="40" rx="8" fill="#e3edf8" stroke="#1d5fa8" stroke-width="1.5"/>
 <text x="360" y="35" text-anchor="middle" font-size="12" font-weight="600" fill="#164a85">A change request arrives</text>
 <line x1="360" y1="50" x2="360" y2="70" stroke="#8a97a4" stroke-width="1.5"/>
 <rect x="248" y="70" width="224" height="34" rx="8" fill="#fff" stroke="#e8e1d6" stroke-width="1.5"/>
 <text x="360" y="92" text-anchor="middle" font-size="11.5" fill="#1c2b3a">Broken for learners right now?</text>
 <line x1="248" y1="87" x2="150" y2="87" stroke="#8a97a4" stroke-width="1.5"/><text x="196" y="82" text-anchor="middle" font-size="10" fill="#7a8a99">yes</text>
 <rect x="30" y="70" width="118" height="34" rx="8" fill="#fdecea" stroke="#c0392b" stroke-width="1.5"/>
 <text x="89" y="92" text-anchor="middle" font-size="11.5" font-weight="600" fill="#9a2f2f">Hotfix (ours)</text>
 <line x1="360" y1="104" x2="360" y2="124" stroke="#8a97a4" stroke-width="1.5"/><text x="374" y="118" font-size="10" fill="#7a8a99">no</text>
 <rect x="228" y="124" width="264" height="34" rx="8" fill="#fff" stroke="#e8e1d6" stroke-width="1.5"/>
 <text x="360" y="146" text-anchor="middle" font-size="11.5" fill="#1c2b3a">Changes what learners must know or do?</text>
 <line x1="492" y1="141" x2="580" y2="141" stroke="#8a97a4" stroke-width="1.5"/><text x="536" y="136" text-anchor="middle" font-size="10" fill="#7a8a99">yes</text>
 <rect x="580" y="124" width="126" height="34" rx="8" fill="#fff7e8" stroke="#c9a227" stroke-width="1.5"/>
 <text x="643" y="140" text-anchor="middle" font-size="11" font-weight="600" fill="#8a6a00">Revision</text>
 <text x="643" y="152" text-anchor="middle" font-size="9.5" fill="#8a6a00">back to Design</text>
 <line x1="360" y1="158" x2="360" y2="178" stroke="#8a97a4" stroke-width="1.5"/><text x="374" y="172" font-size="10" fill="#7a8a99">no</text>
 <rect x="248" y="178" width="224" height="34" rx="8" fill="#fff" stroke="#e8e1d6" stroke-width="1.5"/>
 <text x="360" y="200" text-anchor="middle" font-size="11.5" fill="#1c2b3a">Is the problem in the course at all?</text>
 <line x1="248" y1="195" x2="150" y2="195" stroke="#8a97a4" stroke-width="1.5"/><text x="196" y="190" text-anchor="middle" font-size="10" fill="#7a8a99">yes</text>
 <rect x="30" y="178" width="118" height="34" rx="8" fill="#e7f4ee" stroke="#186b52" stroke-width="1.5"/>
 <text x="89" y="200" text-anchor="middle" font-size="11.5" font-weight="600" fill="#186b52">Maintenance</text>
 <line x1="472" y1="195" x2="580" y2="195" stroke="#8a97a4" stroke-width="1.5"/><text x="526" y="190" text-anchor="middle" font-size="10" fill="#7a8a99">no</text>
 <rect x="580" y="178" width="126" height="34" rx="8" fill="#f3f0ea" stroke="#8a97a4" stroke-width="1.5"/>
 <text x="643" y="200" text-anchor="middle" font-size="11" font-weight="600" fill="#5a6b7b">No product change</text>
</svg><div class="dcap">Three questions, asked in this order. Only the revision route leaves our hands.</div></div>
 <div class="box rule"><span class="bh">Where routing goes wrong</span><p class="tight"><b>Volume is not impact.</b> A loud request, or a senior one, is not a hotfix by virtue of who sent it. The route follows what is broken and for whom.<br><b>\u201CWhile you are in there.\u201D</b> Bundling extra changes onto a hotfix turns a one-line fix into an untested release. Each additional change gets its own route.</p></div>
 <p><strong>In our courses.</strong> A lab link returning 404 is a hotfix. A confusing explanation is maintenance, unless the confusion sits in the objective, which makes it a revision. Learners arriving without prerequisites is no product change, however urgent it feels.</p>
 <p class="tight" style="color:var(--muted)">Route each request in the queue and name the evidence that put it there.</p>`,
 activity:{type:"triage",id:"schgt",points:14,
  buckets:["\ud83d\udd25 Hotfix","\ud83d\udd27 Maintenance","\ud83d\udcac No product change","\ud83d\udccb Planned revision"],
  items:[
   {from:"Delivery, cohort 1042-03",subj:"GLAB 302.3.1 step 4 links to the retired vendor console",
    body:"Eighteen learners blocked in class this morning. Proposed route: planned revision, next quarter.",ans:0,
    why:"Hotfix. Live and broken, with learners stopped today. Fix it now, verify it, log it. No version change, because nothing about what a learner must prove has moved. The proposed route would have left a cohort blocked for a quarter."},
   {from:"Instructor, cohort 1042-03",subj:"Replace SBA 302 with a group presentation next week",
    body:"The cohort responds better to presenting than to writing up. Proposed route: maintenance.",ans:3,
    why:"Planned revision. A group presentation changes the evidence, and it stops measuring the individual performance the objective names. That is a change to what a learner must prove, so it is Design\u2019s call and it earns a version number."},
   {from:"Site operations",subj:"Learners cannot sign in to the vendor environment",
    body:"Accounts were never provisioned for this cohort. Proposed route: hotfix the lab.",ans:2,
    why:"No product change. The lab is correct; the accounts do not exist. Nothing in the course needs editing, and hotfixing the material would hide an access problem that will recur with the next cohort."},
   {from:"Vendor liaison",subj:"CompTIA releases a new exam version",
    body:"Objectives, software versions and question weighting all change. Proposed route: update the affected labs.",ans:3,
    why:"Planned revision. Objectives and scope both move, so the module outcomes move with them. We diagnose and size it, then hand it to Design with the evidence. Patching the labs alone would leave the course claiming outcomes it no longer teaches."},
   {from:"Product Quality & Experience",subj:"Typo in a non-graded handout",
    body:"Two letters reversed. Meaning is unaffected. Proposed route: no product change.",ans:1,
    why:"Maintenance. A correction with no instructional impact still gets made, verified and logged. It does not need a version, and it is not nothing: the log is how anyone later knows the file changed."}],
  fbGood:"Five routed correctly, and two of them against what the sender proposed. That is the job: the evidence on the card decides the route, not the opinion at the bottom of it.",
  fbBad:"Look again at the ones you missed. Two questions sort every request: has anything a learner must prove changed, and is anybody blocked right now?"}},
{id:"drev",title:"Read the cohort evidence",crumb:"Unit 4 · Delivery Review",
 bridge:"Change requests arrive while a course is running, and routing handles those. Delivery Review is the scheduled look back after the cohort finishes: the whole run’s evidence read in one sitting, deciding what the next version has to fix.",
 frame:{now:"The cohort has finished and Delivery Review is on the calendar.",role:"You are the developer reading a finished cohort’s evidence.",resp:"Decide which findings the next revision has to act on, and which ones are not actionable.",use:"The development process section of the Handbook: step 7 and gate 4.",why:"A revision built on opinion changes the wrong things, and a pattern nobody acts on runs again in the next cohort."},
 mins:8,
 lead:"Delivery Review closes step 7, the last gate and the only one that meets the course after learners have used it. Its output is one document: the list of inputs the next version starts from.",
 coach:`Six findings, one at a time. <b>Select ✓ Feeds the revision</b> to put a finding on the input list for the next version, or <b>✗ Not actionable</b> to set it aside, which then asks you to pick the reason. Stamping an opinion as evidence puts work into a revision nobody can defend, and setting a pattern aside ships the same defect to the next cohort. You are done when the sixth verdict is in and the queue closes. Step 7 and the four gates: ${gl('process','the Handbook')}.`,
 hint:"Three tests. Does the finding hold across the cohort, or is it one voice? Does the data say which artifact is wrong, or only that something is? Is it still open, or was it found and fixed during the run?",
 html:`<p><strong>What gate 4 asks.</strong> Step 7 collects the run’s evidence: assessment scores, item statistics, survey responses, instructor notes, and everything logged during the cohort. The gate reads it and names what the next revision inherits.</p>
 <p><strong>Where the evidence already lives.</strong> Assessment data from every module, across every cohort, feeds <a href="https://productops.perscholas.org/surveys" target="_blank" rel="noopener">the surveys dashboard on the Product Hub</a>, where it comes back aggregated for viewing. The numbers are waiting rather than needing to be gathered, so reading them is the first move at this gate. Going there before deciding what needs changing is the practice: the pattern is usually already visible, and a finding that contradicts it is usually a sample of one.</p>
 <p><strong>A pilot earns a retrospective too.</strong> A first run has more to say than its numbers do. Sitting down with the instructors and the team while it is fresh surfaces what the data cannot: what confused people, what got cut for time, and what the instructor quietly worked around.</p>
 <div class="box rule"><span class="bh">Evidence, or one voice</span><p class="tight">A finding earns its place when it holds across the cohort. One comment is a sample of one. An item 80% of learners failed is either a defective item or a teaching gap, and the list must say which. A lab that overran in every cohort is a design defect; asking instructors to move faster does not repair it.</p></div>
 <p>Findings that change what a learner must prove are not ours to act on. They go back to Design as a revision, and the course carries a new version: 1001 becomes 1001.1. See ${gl('uci','UCI numbers and versions')}.</p>
 <div class="spec"><div class="spec-h">Surveys dashboard &middot; module 205, two cohorts, aggregated</div><div class="spec-b">KBA 205&nbsp; avg 88%<span class="an"> &nbsp;item 9 flagged: most-chosen answer is not the key</span><br>SBA 205&nbsp; avg 61%<span class="an"> &nbsp;lowest dimension: works unaided</span><br>GLAB 205.2.1&nbsp; block overrun<span class="an"> &nbsp;+25 to +35 min, both cohorts</span><br>Survey&nbsp; pacing raised<span class="an"> &nbsp;2 of 31 responses</span></div><div class="spec-n">This is the shape the evidence arrives in. A flag is a prompt to look, not a finding: item 9 needs the item reviewed before anyone decides whether it is a bad question or a teaching gap.</div></div>
 <p class="tight" style="color:var(--muted)">Six findings from the closed cohort. Decide which the next version acts on.</p>`,
 activity:{type:"review",id:"drevr",points:12,queueTag:"Unit 4 · does this feed the next revision?",
  labels:{yes:"✓ Feeds the revision",no:"✗ Not actionable",
    missYes:"✗ Look again: no pattern sits under this one, and a revision built on it changes the wrong thing.",
    missNo:"✗ This one holds across the cohort. Re-read the evidence before setting it aside.",
    reasonPrompt:"Right, not actionable. Now say why:"},
  intro:"Six findings from the closed cohort of module 302. Put the ones the next version has to act on onto the input list, set the rest aside, and name the reason each time.",
  items:[
   {content:"KBA 302, item 14: 22 of 27 learners chose the same wrong option. The item review confirms the key is correct, the stem is unambiguous, and the distractor is defensible. The concept the item tests gets one sentence in lesson 302.2 and appears in no lab.",
    good:true,
    why:"✓ Feeds the revision. An item most of a cohort failed is one of two things: a defective item, or a teaching gap. The key check and the distractor review rule out the item, so the gap is in lesson 302.2. Skip that diagnosis and the revision rewrites the wrong artifact.",
    reasons:[]},
   {content:"GLAB 301.3 overran the timetabled block in all four cohorts that have run it, by 40 to 55 minutes each time. Three different instructors cut the last two steps to finish on schedule.",
    good:true,
    why:"✓ Feeds the revision. Four cohorts, four overruns, three instructors, the same two steps lost. A lab that overruns for everyone who teaches it is a design defect: the timing was estimated wrong, or the lab carries more steps than the block holds. The fix belongs in the lab file.",
    reasons:[]},
   {content:"One survey free-text response reads: “The instructor talked too fast and I could not keep up.” The other 26 responses do not mention pacing, and the module rates 4 or 5 from 24 of them.",
    good:false,
    why:"✗ Not actionable as a curriculum input. One response out of 27, with nothing else in the data pointing at pacing. Read it, log it, pass the pacing observation to Delivery, and watch whether the next cohort repeats it. One voice is a sample, not a pattern.",
    reasons:[
     {t:"A sample of one with no pattern behind it. Log the comment, hand the pacing observation to Delivery, and see whether the next cohort produces the same signal",ok:true,fb:""},
     {t:"Every learner comment earns a change in the next version",fb:"A revision that acts on single comments moves the course toward whoever wrote the most, rather than toward the evidence."},
     {t:"The comment names the instructor, so no part of it is ours to handle",fb:"Reading it and finding no pattern is what closes it. Discarding comments unread is how a real pattern gets missed."}]},
   {content:"An instructor note submitted at the end of the run: “I would rather teach module 3 before module 2. It flows better for me that way.” No learner evidence is attached, and scores in both modules sit inside the expected range.",
    good:false,
    why:"✗ Not actionable. A stated preference with no finding under it. No other instructor raised the sequence, and neither module’s results show a cost. Ask what the current order is costing learners; if there is an answer, it arrives as data.",
    reasons:[
     {t:"A preference with no learner evidence behind it. Ask what the current sequence costs learners, and treat it as a finding when the data says so",ok:true,fb:""},
     {t:"Instructors run the room, so sequence changes are theirs to make",fb:"Sequence is a design decision. Changing it in the room without evidence also makes the cohorts non-comparable."},
     {t:"Reorder the modules in the next revision",fb:"Nothing in the cohort data says the current order cost anyone anything, so that is a change with no finding under it."}]},
   {content:"Across both cohorts, the module KBA averaged 91% and the module SBA averaged 54%. The rubric dimension scored lowest on the SBA is the one no lab or practice task in the module asks for.",
    good:true,
    why:"✓ Feeds the revision. Ninety-one on recall and fifty-four on performance, twice, is a shape rather than a fluke. The module teaches at one level and measures at another, and the rubric names the missing dimension. The next version needs practice at the level the SBA measures, before the SBA.",
    reasons:[]},
   {content:"A handout in lesson 302.1 listed a superseded command. It was reported in week two, corrected in the live course the same week, and recorded in the change log with the date and the fix.",
    good:false,
    why:"✗ Not actionable. Found, fixed, and logged inside the run. The input list carries what the next version still has to repair; work that closed during delivery is already in the change log.",
    reasons:[
     {t:"Already found, fixed, and logged during the run, so it is closed rather than inherited",ok:true,fb:""},
     {t:"Re-list it so the revision keeps a record of it",fb:"The change log already holds the record. Re-listing closed work lengthens the input list without improving the next version."},
     {t:"Reopen it as a revision item because it reached learners before the fix",fb:"It reached learners and was repaired inside the run. A revision inherits what is still broken."}]}],
  fbGood:"Input list set. Three findings hold across the cohort, and three do not survive the pattern test. That list is what the next revision starts from.",
  fbBad:"Queue complete. Revisit any miss: a finding belongs on the list when it holds across the cohort and names which artifact is wrong."},
 transition:"The evidence is sorted and the next version has its inputs. That closes the loop: what one cohort proves is what the next build starts from. The unit check asks you to write the page a manager reads first."},
{id:"d4x",title:"Unit 4 check: write the plan you will hand your manager",crumb:"Unit 4 \u00b7 Unit check",mins:12,
 bridge:"The full pipeline runs request, intake, plan, build, QA, handoff, revision, and Unit 4 has now walked the last of it. Write the plan you would hand your manager for a real module, because that is the page your capstone opens with.",
 frame:{now:"This is the page your capstone opens with, written small first.",role:"You are writing the plan your manager will read before anything else.",resp:"State the objective you were given, how you intend to meet it, and how you will know it worked. Model answers appear once you commit yours.",use:"Everything from Units 1 through 4, and the Handbook.",why:"A plan your manager can read in two minutes is what makes the rest of the build reviewable."},
 lead:"Your capstone opens with a plan: the objective you were given, how you intend to meet it, and how you will know it worked. Write a short version of that now, on the module you have been working, so the capstone starts from something rather than a blank page.",
 html:`<div class="box rule"><span class="bh">Draft Part 1 of your capstone</span><p class="tight">Three boxes. This is the capstone\u2019s Part 1 compressed into about ten minutes. Whatever you write here is a usable first draft of it.</p></div>`,
 coach:"Write your approach, how the module ends, and what could go wrong on this build, then press Save. An experienced developer\u2019s version appears beside each answer.",
 activity:{type:"journal",id:"d4xw",
  fields:[
   {label:"1. Your approach. Which activities and tools will get learners to the objective, and why those rather than something else?",
    ph:"A guided lab, because \u2026"},
   {label:"2. How the module ends. What does the learner do, unaided, that proves they can do the job?",
    ph:"The summative asks them to \u2026"},
   {label:"3. What could go wrong on this build, and what you would do about it now rather than in week six.",
    ph:"The risk is \u2026 so I would \u2026"}],
  modelHead:"An experienced developer\u2019s version, and how to check yours",
  model:`<p class="tight"><b>Approach.</b> \u201CA guided lab first, because the diagnostic sequence has an order and getting it wrong early teaches the wrong habit. Then an assignment lab on a different fault, so the learner drives it. Tools are the lab image we already have, so nothing depends on admin rights I cannot guarantee.\u201D</p>
  <p class="tight"><b>How it ends.</b> \u201CAn unseen fault on a live machine. The learner diagnoses it, resolves it, and writes the knowledge-base entry. No checklist, no prompts. That is the job.\u201D</p>
  <p class="tight"><b>Risk.</b> \u201CThe job description is fourteen months old and the client renamed the role. I would raise it now, name who is re-confirming it, and build the two lessons that do not depend on the role definition while we wait.\u201D</p>
  <div class="box rule" style="margin-top:10px"><span class="bh">Check your own against these</span><ul class="blist"><li>\u2610 Your approach says <em>why</em> as well as what. A list of activities on its own is not a plan.</li><li>\u2610 The module ends with the learner working unaided. If your ending is guided, it is practice, not proof.</li><li>\u2610 The summative matches the objective\u2019s verb.</li><li>\u2610 Your risk is specific to this build, and your response is something you would do this week.</li><li>\u2610 Your approach works for every learner in the room. Tooling that assumes a mouse, or media without captions, is a decision you are making now whether you name it or not.</li><li>\u2610 Nothing in your plan needs a decision that belongs to Design.</li></ul></div>
  <p class="tight" style="color:var(--muted)">Your capstone runs on a different module, so this is practice rather than a draft you carry over. What transfers is the habit: say why, end unaided, and name the risk before it becomes a surprise.</p>`},
 transition:"That is the plan. The capstone is the same thinking at full size, with the files built."}]},
{day:4,mod:"5 · Capstone",lessons:[
{id:"cap",title:"Plan your first real module",crumb:"Capstone",
 bridge:"Four units, and each unit check produced one piece of what follows. This is the same job at full size, on a module you choose, and it is the work you were hired to do.",
 frame:{now:"Onboarding turns into real work here.",role:"You are the Product Developer on a module of your own.",resp:"Plan the module, build one lesson of it, and review the package with your manager.",use:"The Handbook, the project you chose in Unit 1, and every unit check you have written.",why:"This is the job. Everything before it was this job at smaller scale."},
 mins:25,
 hours:"16 h",
 lead:"This is where onboarding turns into real work. Until now you have worked on projects handed to you; this one you build. Set aside 16 hours, which is two full working days. Your capstone is a <b>Module Development Package</b>: you take a module objective Design gave you, decide how it gets met, and build one lesson of it for real, filed in a repo you create. Your manager reviews the package the way real work gets reviewed. First reflect below, for your own thinking only, then complete the course; your final step is the assignment in Canvas.",
 brief:function(){const c=primary()||{domain:"chosen"};return {from:"ID&D Director",re:"Your first module: plan requested",text:"You\u2019ve walked your "+c.domain+" project end to end across the four units: set its readiness, built its repo, reviewed its objectives, planned its lesson package, developed and repaired its materials, and judged its quality. Take one of the module objectives from your project\u2019s outline and show me how you would meet it. Your lesson objectives, your choice of activities and tools, one lesson built for real, and a repo I would actually want on my desk."};},
 coach:"Jot a short answer to each reflection below. These are <b>private, for your own thinking</b>, not graded or submitted. Then hit <b>Save &amp; complete</b> to finish the course. Your real deliverable, the Module Development Package, gets built and submitted in the linked Canvas assignment, where your manager reviews it against the readiness rubric.",
 hint:"A strong assessment plan looks like the repo you staged in Unit 1: named files on a cadence, labs weekly, KBA and SBA at module end.",
 prompt:{label:"Module Development Package: what goes in your repo",text:"MODULE DEVELOPMENT PACKAGE\n\nStart from a module objective Design has given you. You are not writing the module objective; you are deciding how it gets met.\n\nSubmit: a link to one Google Drive folder (your module repo), named to convention, holding all eight items filed correctly.\n\nPART 1: THE PLAN (three documents)\n1. Module plan: the objective as it arrived and the job task it serves, your lesson objectives, your approach and what you ruled out, the assessment plan named to convention, the summative competency check, and your accessibility plan\n2. Module blueprint (MBP): every item in delivery order, named and linked, on the Module Blueprint Template\n3. AI-use record: half a page on what you drafted with AI, what you verified and how, what you corrected or cut\n\nPART 2: THE BUILT SLICE (five files)\n4. One lesson, built for real, on the lesson-day rhythm\n5. One activity: a guided or assignment lab, each step one action with named specifics and a visible result\n6. One aligned assessment measuring that same lesson objective, with an instrument that fits it\n7. A rubric for the graded item, criteria traced to objectives rather than to the activity's steps\n8. The facilitator-guide section for that lesson, written for an instructor who was in none of your design conversations\n\nPlan on 16 hours, which is two full working days. Do not attempt it in one sitting."},
 html:function(){const c=primary()||{domain:"chosen"};return `<p>Across the four units you set <b>${c.domain}</b> readiness, staged its repo, worked over its objectives, planned its assessment cadence, built a lab and an item, and cleared it for handoff. The capstone puts all of that to work at once, on a module you choose.</p>
 <div class="ruleline"><b>Plan on 16 hours,</b> two full working days, and do not attempt it in one sitting. Most people spread it over a week or two, which is the right way to work on it.</div>
 <p>Nothing goes to a gradebook. Your manager reads the package against the standards you have been working to, gives you feedback, and makes one call: is this ready to build from?</p>
 <p class="tight" style="color:var(--muted)">Reflect below on the module you would build first, then finish the course. The package itself is submitted in Canvas.</p>`;},
 activity:{type:"capstone",id:"capf",
  fields:[
   {label:"What module would you build first, and what job task does it serve?",ph:"The module I\u2019d build is… it prepares learners to…"},
   {label:"What evidence would prove a learner met its objective?",ph:"A learner would demonstrate it by…"},
   {label:"What\u2019s the biggest risk you\u2019d flag before building?",ph:"The risk I\u2019d raise is… and who owns it…"}],
  rubric:[
   "My lesson days clear the 75% activated-learning bar",
   "Every file follows the naming convention (prefixes, R- for graded)",
   "The module ends with a KBA and/or SBA; every graded item has a rubric",
   "Learner AI activities follow the two rules and embed the Integrity Rubric",
   "Everything AI drafts for me gets verified before it ships. I own every line",
   "Accessibility is built in as I go: alt text, contrast, captions, keyboard access"]}}
]}
];
