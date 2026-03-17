/* ── AlCoders Robotics Course — course.js ── */
/* Handles: lesson navigation, progress (localStorage),
   sidebar active state, copy buttons, quizzes          */

const KEY = 'alcoders_robotics_v2';
const getP = () => { try{return JSON.parse(localStorage.getItem(KEY))||{};}catch{return{};} };
const saveP = d => localStorage.setItem(KEY, JSON.stringify(d));

/* ── Sidebar: inject shared HTML ── */
const SIDEBAR_HTML = `
<div class="sidebar-logo">
  <a href="index.html">
    <div class="logo-text">Al<span>Coders</span></div>
    <div class="logo-sub">Intro to Robotics</div>
  </a>
</div>
<a href="index.html" class="sidebar-back">← Course Overview</a>
<div class="sidebar-module-block">
  <div class="sidebar-module-title"><span class="mod-badge">Module 01</span> What is a Robot?</div>
  <a class="sidebar-lesson" data-id="1-1" onclick="goto('1-1')" href="#"><span class="lesson-dot"></span>Robots Around Us</a>
  <a class="sidebar-lesson" data-id="1-2" onclick="goto('1-2')" href="#"><span class="lesson-dot"></span>How Robots Work</a>
  <a class="sidebar-lesson" data-id="1-3" onclick="goto('1-3')" href="#"><span class="lesson-dot"></span>Robot Anatomy</a>
</div>
<div class="sidebar-module-block">
  <div class="sidebar-module-title"><span class="mod-badge">Module 02</span> Electronics Basics</div>
  <a class="sidebar-lesson" data-id="2-1" onclick="goto('2-1')" href="#"><span class="lesson-dot"></span>Voltage, Current &amp; Resistance</a>
  <a class="sidebar-lesson" data-id="2-2" onclick="goto('2-2')" href="#"><span class="lesson-dot"></span>Breadboard &amp; Wiring</a>
  <a class="sidebar-lesson" data-id="2-3" onclick="goto('2-3')" href="#"><span class="lesson-dot"></span>LEDs, Resistors &amp; Buttons</a>
</div>
<div class="sidebar-module-block">
  <div class="sidebar-module-title"><span class="mod-badge">Module 03</span> Arduino Fundamentals</div>
  <a class="sidebar-lesson" data-id="3-1" onclick="goto('3-1')" href="#"><span class="lesson-dot"></span>Meet the Arduino Uno</a>
  <a class="sidebar-lesson" data-id="3-2" onclick="goto('3-2')" href="#"><span class="lesson-dot"></span>Arduino IDE Setup</a>
  <a class="sidebar-lesson" data-id="3-3" onclick="goto('3-3')" href="#"><span class="lesson-dot"></span>Digital Pins &amp; Blink</a>
  <a class="sidebar-lesson" data-id="3-4" onclick="goto('3-4')" href="#"><span class="lesson-dot"></span>Analog Pins &amp; Serial Monitor</a>
</div>
<div class="sidebar-module-block">
  <div class="sidebar-module-title"><span class="mod-badge">Module 04</span> Programming Arduino</div>
  <a class="sidebar-lesson" data-id="4-1" onclick="goto('4-1')" href="#"><span class="lesson-dot"></span>Variables &amp; Data Types</a>
  <a class="sidebar-lesson" data-id="4-2" onclick="goto('4-2')" href="#"><span class="lesson-dot"></span>Conditionals &amp; Loops</a>
  <a class="sidebar-lesson" data-id="4-3" onclick="goto('4-3')" href="#"><span class="lesson-dot"></span>Functions</a>
  <a class="sidebar-lesson" data-id="4-4" onclick="goto('4-4')" href="#"><span class="lesson-dot"></span>Libraries</a>
</div>
<div class="sidebar-module-block">
  <div class="sidebar-module-title"><span class="mod-badge">Module 05</span> Sensors</div>
  <a class="sidebar-lesson" data-id="5-1" onclick="goto('5-1')" href="#"><span class="lesson-dot"></span>Ultrasonic Sensor (HC-SR04)</a>
  <a class="sidebar-lesson" data-id="5-2" onclick="goto('5-2')" href="#"><span class="lesson-dot"></span>IR Sensor</a>
  <a class="sidebar-lesson" data-id="5-3" onclick="goto('5-3')" href="#"><span class="lesson-dot"></span>Reading &amp; Interpreting Data</a>
</div>
<div class="sidebar-module-block">
  <div class="sidebar-module-title"><span class="mod-badge">Module 06</span> Motors &amp; Movement</div>
  <a class="sidebar-lesson" data-id="6-1" onclick="goto('6-1')" href="#"><span class="lesson-dot"></span>DC Motors Explained</a>
  <a class="sidebar-lesson" data-id="6-2" onclick="goto('6-2')" href="#"><span class="lesson-dot"></span>L298N Motor Driver</a>
  <a class="sidebar-lesson" data-id="6-3" onclick="goto('6-3')" href="#"><span class="lesson-dot"></span>Speed Control with PWM</a>
  <a class="sidebar-lesson" data-id="6-4" onclick="goto('6-4')" href="#"><span class="lesson-dot"></span>Servo Motors</a>
</div>
<div class="sidebar-module-block">
  <div class="sidebar-module-title"><span class="mod-badge">Module 07</span> Chassis &amp; Power</div>
  <a class="sidebar-lesson" data-id="7-1" onclick="goto('7-1')" href="#"><span class="lesson-dot"></span>Chassis Types</a>
  <a class="sidebar-lesson" data-id="7-2" onclick="goto('7-2')" href="#"><span class="lesson-dot"></span>Power Supply &amp; Battery</a>
  <a class="sidebar-lesson" data-id="7-3" onclick="goto('7-3')" href="#"><span class="lesson-dot"></span>Wiring the Full Robot</a>
</div>
<div class="sidebar-module-block">
  <div class="sidebar-module-title"><span class="mod-badge">Module 08</span> Robot Logic</div>
  <a class="sidebar-lesson" data-id="8-1" onclick="goto('8-1')" href="#"><span class="lesson-dot"></span>Decision Making in Code</a>
  <a class="sidebar-lesson" data-id="8-2" onclick="goto('8-2')" href="#"><span class="lesson-dot"></span>State Machines</a>
  <a class="sidebar-lesson" data-id="8-3" onclick="goto('8-3')" href="#"><span class="lesson-dot"></span>Debugging Techniques</a>
</div>
<div class="sidebar-module-block">
  <div class="sidebar-module-title"><span class="mod-badge">Module 09</span> Final Project</div>
  <a class="sidebar-lesson proj-link" data-id="9-1" onclick="goto('9-1')" href="#"><span class="lesson-dot"></span>Overview &amp; Planning</a>
  <a class="sidebar-lesson proj-link" data-id="9-2" onclick="goto('9-2')" href="#"><span class="lesson-dot"></span>Hardware Assembly</a>
  <a class="sidebar-lesson proj-link" data-id="9-3" onclick="goto('9-3')" href="#"><span class="lesson-dot"></span>Complete Program</a>
  <a class="sidebar-lesson proj-link" data-id="9-4" onclick="goto('9-4')" href="#"><span class="lesson-dot"></span>Testing &amp; Improvements</a>
</div>
<div class="sidebar-module-block">
  <div class="sidebar-module-title">Navigation</div>
  <a id="prev-module-link" href="index.html" class="sidebar-lesson">← Previous Module</a>
  <a id="next-module-link" href="index.html" class="sidebar-lesson">Next Module →</a>
</div>`;

/* ── Lesson order (used for prev/next buttons) ── */
const LESSONS = [
  '1-1','1-2','1-3',
  '2-1','2-2','2-3',
  '3-1','3-2','3-3','3-4',
  '4-1','4-2','4-3','4-4',
  '5-1','5-2','5-3',
  '6-1','6-2','6-3','6-4',
  '7-1','7-2','7-3',
  '8-1','8-2','8-3',
  '9-1','9-2','9-3','9-4'
];

const MODULE_FILES = {
  '1':'module1.html','2':'module2.html','3':'module3.html',
  '4':'module4.html','5':'module5.html','6':'module6.html',
  '7':'module7.html','8':'module8.html','9':'module9.html'
};

let currentId = null;

/* ── goto: show a lesson by id ── */
function goto(id) {
  document.querySelectorAll('.lesson-page').forEach(p => p.classList.remove('active'));
  const page = document.getElementById('lesson-' + id);
  if (page) { page.classList.add('active'); window.scrollTo(0,0); }
  currentId = id;
  // update sidebar active
  document.querySelectorAll('.sidebar-lesson[data-id]').forEach(el => {
    el.classList.toggle('active', el.dataset.id === id);
  });
  // update breadcrumb
  const bc = document.querySelector('.breadcrumb');
  const activeLink = document.querySelector('.sidebar-lesson[data-id="'+id+'"]');
  if (bc && activeLink) {
    const modTitle = activeLink.closest('.sidebar-module-block')?.querySelector('.sidebar-module-title')?.textContent?.trim() || '';
    const lessonTitle = activeLink.querySelector('.lesson-link-text')?.textContent || activeLink.textContent.trim();
    bc.innerHTML = modTitle + ' › <strong>' + lessonTitle + '</strong>';
  }
  // update prev/next button states
  updateNavBtns();
}

function prevLesson() {
  const idx = LESSONS.indexOf(currentId);
  if (idx > 0) {
    const prev = LESSONS[idx - 1];
    const prevMod = prev.split('-')[0];
    const curMod  = currentId ? currentId.split('-')[0] : '';
    if (prevMod !== curMod) {
      window.location.href = MODULE_FILES[prevMod] + '?goto=' + prev;
    } else { goto(prev); }
  }
}

function nextLesson() {
  const idx = LESSONS.indexOf(currentId);
  if (idx < LESSONS.length - 1) {
    const next = LESSONS[idx + 1];
    const nextMod = next.split('-')[0];
    const curMod  = currentId ? currentId.split('-')[0] : '';
    if (nextMod !== curMod) {
      window.location.href = MODULE_FILES[nextMod] + '?goto=' + next;
    } else { goto(next); }
  }
}

function updateNavBtns() {
  const idx = LESSONS.indexOf(currentId);
  const prevBtn = document.querySelector('.nav-btn[onclick="prevLesson()"]');
  const nextBtn = document.querySelector('.nav-btn[onclick="nextLesson()"]');
  if (prevBtn) prevBtn.disabled = idx <= 0;
  if (nextBtn) nextBtn.disabled = idx >= LESSONS.length - 1;
}

/* ── markDone: called by complete button ── */
function markDone(btn) {
  if (!currentId) return;
  const p = getP(); p[currentId] = true; saveP(p);
  btn.textContent = '✓ Completed'; btn.classList.add('done');
  const dot = document.querySelector('.sidebar-lesson[data-id="'+currentId+'"] .lesson-dot');
  if (dot) dot.style.background = 'var(--green)';
  const link = document.querySelector('.sidebar-lesson[data-id="'+currentId+'"]');
  if (link) link.classList.add('done');
  updateProgressBar();
}

/* ── Progress bar (scroll-based on module pages) ── */
function updateProgressBar() {
  const bar = document.querySelector('.progress-bar');
  if (!bar) return;
  if (document.querySelector('.layout')) {
    // module page: scroll progress of .main
    const main = document.querySelector('.main');
    if (main) {
      const pct = main.scrollTop / (main.scrollHeight - main.clientHeight) * 100;
      bar.style.width = pct + '%';
    }
  } else {
    // index page: page scroll
    const t = document.documentElement.scrollTop;
    const h = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (t / h * 100) + '%';
  }
}

/* ── Copy buttons ── */
function copyCode(btn) {
  const code = btn.closest('.code-block')?.querySelector('.code-body')?.innerText || '';
  navigator.clipboard.writeText(code).then(() => {
    btn.textContent = 'Copied!'; btn.classList.add('copied');
    setTimeout(() => { btn.textContent = 'Copy'; btn.classList.remove('copied'); }, 2000);
  });
}

/* ── Quizzes ── */
function initQuiz() {
  document.querySelectorAll('.quiz-box').forEach(box => {
    const opts = box.querySelectorAll('.quiz-opt');
    const fb   = box.querySelector('.quiz-feedback');
    opts.forEach(opt => {
      opt.addEventListener('click', () => {
        if (box.dataset.answered) return;
        box.dataset.answered = '1';
        opts.forEach(o => o.style.pointerEvents = 'none');
        const ok = opt.dataset.correct === 'true';
        opt.classList.add(ok ? 'correct' : 'wrong');
        if (!ok) opts.forEach(o => { if (o.dataset.correct==='true') o.classList.add('correct'); });
        if (fb) { fb.textContent = ok ? (fb.dataset.ok||'✓ Correct!') : (fb.dataset.bad||'✗ Not quite.'); fb.classList.add('show', ok?'ok':'bad'); }
      });
    });
  });
}

/* ── FAQ (index page) ── */
function initFaq() {
  document.querySelectorAll('.faq-q').forEach(q => {
    q.addEventListener('click', () => q.closest('.faq-item').classList.toggle('open'));
  });
}

/* ── Boot ── */
document.addEventListener('DOMContentLoaded', () => {
  // Inject sidebar if on a module page
  const sidebar = document.querySelector('.sidebar');
  if (sidebar) sidebar.innerHTML = SIDEBAR_HTML;

  // Restore progress dots
  const p = getP();
  document.querySelectorAll('.sidebar-lesson[data-id]').forEach(el => {
    if (p[el.dataset.id]) { el.classList.add('done'); const d = el.querySelector('.lesson-dot'); if(d) d.style.background='var(--green)'; }
  });

  // Determine which lesson to show
  const params = new URLSearchParams(location.search);
  const gotoParam = params.get('goto');
  // find first lesson on this page
  const firstPage = document.querySelector('.lesson-page');
  let firstId = firstPage ? firstPage.id.replace('lesson-','') : null;

  const target = gotoParam || firstId;
  if (target) goto(target);

  // Module prev/next nav links
  if (firstId) {
    const mod = firstId.split('-')[0];
    const modNum = parseInt(mod);
    const prevLink = document.getElementById('prev-module-link');
    const nextLink = document.getElementById('next-module-link');
    if (prevLink) prevLink.href = modNum > 1 ? MODULE_FILES[String(modNum-1)] : 'index.html';
    if (nextLink) nextLink.href = modNum < 9 ? MODULE_FILES[String(modNum+1)] : 'index.html';
    if (prevLink && modNum <= 1) prevLink.textContent = '← Course Overview';
    if (nextLink && modNum >= 9) nextLink.textContent = '← Course Overview';
  }

  // Scroll progress
  const main = document.querySelector('.main');
  if (main) main.addEventListener('scroll', updateProgressBar);
  window.addEventListener('scroll', updateProgressBar);

  initQuiz();
  initFaq();
});
