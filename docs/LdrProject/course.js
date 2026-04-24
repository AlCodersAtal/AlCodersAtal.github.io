/* ============================================================
   ALCODERS LDR COURSE — course.js
   ============================================================ */

const COURSE_KEY = 'alcoders_ldr';

const LESSONS = [
  '1-1','1-2',
  '2-1','2-2',
  '3-1','3-2',
  '4-1','4-2',
  '5-1','5-2',
  '6-1','6-2',
  'sim-1',
  'code-1','code-2','code-3',
  'models-1',
  'quiz-1'
];

const LESSON_LABELS = {
  '1-1': { icon:'01', label:'What is an LDR?',      sub:'Module 1' },
  '1-2': { icon:'01', label:'Resistance Reference',  sub:'Module 1' },
  '2-1': { icon:'02', label:'Voltage Divider',       sub:'Module 2' },
  '2-2': { icon:'02', label:'Wiring & Schematic',    sub:'Module 2' },
  '3-1': { icon:'03', label:'analogRead() Explained',sub:'Module 3' },
  '3-2': { icon:'03', label:'Threshold Code',        sub:'Module 3' },
  '4-1': { icon:'04', label:'What is PWM?',          sub:'Module 4' },
  '4-2': { icon:'04', label:'PWM Code & map()',      sub:'Module 4' },
  '5-1': { icon:'05', label:'Light Meter Zones',     sub:'Module 5' },
  '5-2': { icon:'05', label:'3-LED Code',            sub:'Module 5' },
  '6-1': { icon:'06', label:'Final Project Intro',   sub:'Module 6' },
  '6-2': { icon:'06', label:'Full Project Code',     sub:'Module 6' },
  'sim-1':    { icon:'⚡', label:'Live Simulator',   sub:'Tools' },
  'code-1':   { icon:'💻', label:'Level 1 — Basic',  sub:'Code Ref' },
  'code-2':   { icon:'💻', label:'Level 2 — PWM',    sub:'Code Ref' },
  'code-3':   { icon:'💻', label:'Level 3 — Meter',  sub:'Code Ref' },
  'models-1': { icon:'🔧', label:'6 Project Models', sub:'Projects' },
  'quiz-1':   { icon:'❓', label:'Course Quiz',       sub:'Quiz' }
};

const MODULE_FILES = {
  '1-1':'module1.html','1-2':'module1.html',
  '2-1':'module2.html','2-2':'module2.html',
  '3-1':'module3.html','3-2':'module3.html',
  '4-1':'module4.html','4-2':'module4.html',
  '5-1':'module5.html','5-2':'module5.html',
  '6-1':'module6.html','6-2':'module6.html',
  'sim-1':'simulator.html',
  'code-1':'code.html','code-2':'code.html','code-3':'code.html',
  'models-1':'models.html',
  'quiz-1':'quiz.html'
};

/* ── Storage ── */
function getSaved() {
  try { return new Set(JSON.parse(localStorage.getItem(COURSE_KEY) || '[]')); }
  catch(e){ return new Set(); }
}
function saveLesson(id) {
  const s = getSaved(); s.add(id);
  localStorage.setItem(COURSE_KEY, JSON.stringify([...s]));
}

/* ── Progress ring ── */
function updateProgress() {
  const done = getSaved().size;
  const total = LESSONS.length;
  const pct = Math.round((done / total) * 100);
  const ring = document.querySelector('.progress-ring-fill');
  const pctEl = document.querySelector('.progress-pct');
  const doneEl = document.querySelector('.progress-done');
  if (ring) {
    const r = 17; const circ = 2 * Math.PI * r;
    ring.setAttribute('stroke-dasharray', circ);
    ring.setAttribute('stroke-dashoffset', circ - (pct / 100) * circ);
  }
  if (pctEl) pctEl.textContent = pct + '%';
  if (doneEl) doneEl.textContent = done + ' / ' + total + ' done';
}

/* ── Sidebar links ── */
function updateSidebarLinks(activeId) {
  const saved = getSaved();
  document.querySelectorAll('.sidebar-link[data-id]').forEach(el => {
    const id = el.dataset.id;
    el.classList.toggle('active', id === activeId);
    el.classList.toggle('done', saved.has(id));
    const icon = el.querySelector('.sl-icon');
    if (icon) icon.textContent = saved.has(id) ? '✓' : (LESSON_LABELS[id]?.icon || id);
  });
}

/* ── Current lesson detection ── */
function getCurrentFile() {
  return window.location.pathname.split('/').pop() || 'index.html';
}
function getFirstLessonForFile(file) {
  return LESSONS.find(id => MODULE_FILES[id] === file) || LESSONS[0];
}
function getCurrentLesson() {
  const params = new URLSearchParams(window.location.search);
  const go = params.get('goto');
  if (go && LESSONS.includes(go)) return go;
  return getFirstLessonForFile(getCurrentFile());
}

/* ── goto ── */
function goto(id) {
  if (!id) return;
  const file = MODULE_FILES[id];
  const currentFile = getCurrentFile();
  if (file !== currentFile) {
    window.location.href = file + '?goto=' + id;
    return;
  }
  // Hide all lesson pages
  document.querySelectorAll('.lesson-page').forEach(p => p.classList.remove('active'));
  // Show correct one
  const target = document.querySelector('.lesson-page[data-id="' + id + '"]');
  if (target) {
    target.classList.add('active');
    document.querySelector('.main')?.scrollTo(0, 0);
  }
  // Update breadcrumb
  const info = LESSON_LABELS[id];
  const bc = document.querySelector('.breadcrumb');
  if (bc && info) bc.innerHTML = info.sub + ' &rsaquo; <span>' + info.label + '</span>';
  // Update nav btns
  const idx = LESSONS.indexOf(id);
  const prevBtn = document.querySelector('.nav-btn.prev');
  const nextBtn = document.querySelector('.nav-btn.next');
  if (prevBtn) prevBtn.disabled = idx <= 0;
  if (nextBtn) nextBtn.disabled = idx >= LESSONS.length - 1;
  updateSidebarLinks(id);
  // Store current
  window._currentLesson = id;
}

function prevLesson() {
  const idx = LESSONS.indexOf(window._currentLesson || getCurrentLesson());
  if (idx > 0) goto(LESSONS[idx - 1]);
}
function nextLesson() {
  const idx = LESSONS.indexOf(window._currentLesson || getCurrentLesson());
  if (idx < LESSONS.length - 1) goto(LESSONS[idx + 1]);
}

/* ── markDone ── */
function markDone(btn) {
  const page = btn.closest('.lesson-page');
  if (!page) return;
  const id = page.dataset.id;
  saveLesson(id);
  btn.textContent = '✓ Completed';
  btn.disabled = true;
  btn.style.opacity = '.6';
  updateSidebarLinks(window._currentLesson || id);
  updateProgress();
}

/* ── copyCode ── */
function copyCode(btn) {
  const block = btn.closest('.code-block');
  if (!block) return;
  const body = block.querySelector('.code-body');
  if (!body) return;
  navigator.clipboard.writeText(body.innerText).then(() => {
    const orig = btn.textContent;
    btn.textContent = 'Copied!';
    btn.style.color = 'var(--green)';
    setTimeout(() => { btn.textContent = orig; btn.style.color = ''; }, 1800);
  });
}

/* ── Quiz ── */
const _quizState = {};
function initQuiz() {
  document.querySelectorAll('.quiz-box').forEach(box => {
    const qId = box.dataset.question;
    box.querySelectorAll('.quiz-opt').forEach(opt => {
      opt.addEventListener('click', () => {
        if (_quizState[qId] !== undefined) return;
        const correct = opt.dataset.correct === 'true';
        _quizState[qId] = correct;
        box.querySelectorAll('.quiz-opt').forEach(o => o.style.pointerEvents = 'none');
        opt.classList.add(correct ? 'correct' : 'wrong');
        const fb = box.querySelector('.quiz-feedback');
        if (fb) { fb.classList.add('show', correct ? 'ok' : 'bad'); }
        checkQuizComplete();
      });
    });
  });
}
function checkQuizComplete() {
  const boxes = document.querySelectorAll('.quiz-box');
  if (Object.keys(_quizState).length < boxes.length) return;
  const score = Object.values(_quizState).filter(Boolean).length;
  const total = boxes.length;
  const el = document.getElementById('quizScore');
  if (!el) return;
  el.style.display = 'block';
  const big = el.querySelector('.score-big');
  const msg = el.querySelector('.score-msg');
  if (big) big.textContent = score + ' / ' + total;
  if (msg) {
    if (score === total) msg.textContent = 'Perfect score! Course completed! 🏆';
    else if (score >= total - 1) msg.textContent = 'Great job! Review the missed question above.';
    else msg.textContent = 'Keep studying — revisit the modules and try again!';
  }
  if (score === total) { saveLesson('quiz-1'); updateProgress(); updateSidebarLinks('quiz-1'); }
}

/* ── FAQ ── */
function initFaq() {
  document.querySelectorAll('.faq-item').forEach(item => {
    const q = item.querySelector('.faq-q');
    if (q) q.addEventListener('click', () => item.classList.toggle('open'));
  });
}

/* ── Sidebar HTML ── */
const SIDEBAR_HTML = `
<div class="sidebar-inner">
  <div class="sidebar-course">
    <div class="sidebar-course-label">AlCoders ATL</div>
    <div class="sidebar-course-name">LDR Controlled LED</div>
  </div>
  <div class="sidebar-progress">
    <div class="progress-ring-wrap">
      <svg width="40" height="40" viewBox="0 0 40 40">
        <circle class="progress-ring-bg" cx="20" cy="20" r="17"/>
        <circle class="progress-ring-fill" cx="20" cy="20" r="17" stroke-dasharray="106.8" stroke-dashoffset="106.8"/>
      </svg>
      <div class="progress-pct">0%</div>
    </div>
    <div class="progress-text">
      <strong>Progress</strong>
      <span class="progress-done">0 / 18 done</span>
    </div>
  </div>

  <div class="sidebar-section">
    <div class="sidebar-section-label">Modules</div>
    <button class="sidebar-link" data-id="1-1" onclick="goto('1-1')"><span class="sl-icon">01</span><span class="sl-label">What is an LDR?<span class="sl-sublabel">Module 1</span></span></button>
    <button class="sidebar-link" data-id="1-2" onclick="goto('1-2')"><span class="sl-icon">01</span><span class="sl-label">Resistance Reference<span class="sl-sublabel">Module 1</span></span></button>
    <button class="sidebar-link" data-id="2-1" onclick="goto('2-1')"><span class="sl-icon">02</span><span class="sl-label">Voltage Divider<span class="sl-sublabel">Module 2</span></span></button>
    <button class="sidebar-link" data-id="2-2" onclick="goto('2-2')"><span class="sl-icon">02</span><span class="sl-label">Wiring &amp; Schematic<span class="sl-sublabel">Module 2</span></span></button>
    <button class="sidebar-link" data-id="3-1" onclick="goto('3-1')"><span class="sl-icon">03</span><span class="sl-label">analogRead() Explained<span class="sl-sublabel">Module 3</span></span></button>
    <button class="sidebar-link" data-id="3-2" onclick="goto('3-2')"><span class="sl-icon">03</span><span class="sl-label">Threshold Code<span class="sl-sublabel">Module 3</span></span></button>
    <button class="sidebar-link" data-id="4-1" onclick="goto('4-1')"><span class="sl-icon">04</span><span class="sl-label">What is PWM?<span class="sl-sublabel">Module 4</span></span></button>
    <button class="sidebar-link" data-id="4-2" onclick="goto('4-2')"><span class="sl-icon">04</span><span class="sl-label">PWM Code &amp; map()<span class="sl-sublabel">Module 4</span></span></button>
    <button class="sidebar-link" data-id="5-1" onclick="goto('5-1')"><span class="sl-icon">05</span><span class="sl-label">Light Meter Zones<span class="sl-sublabel">Module 5</span></span></button>
    <button class="sidebar-link" data-id="5-2" onclick="goto('5-2')"><span class="sl-icon">05</span><span class="sl-label">3-LED Code<span class="sl-sublabel">Module 5</span></span></button>
    <button class="sidebar-link" data-id="6-1" onclick="goto('6-1')"><span class="sl-icon">06</span><span class="sl-label">Final Project Intro<span class="sl-sublabel">Module 6</span></span></button>
    <button class="sidebar-link" data-id="6-2" onclick="goto('6-2')"><span class="sl-icon">06</span><span class="sl-label">Full Project Code<span class="sl-sublabel">Module 6</span></span></button>
  </div>

  <div class="sidebar-section">
    <div class="sidebar-section-label">Tools</div>
    <button class="sidebar-link" data-id="sim-1" onclick="goto('sim-1')"><span class="sl-icon">⚡</span><span class="sl-label">Live Simulator<span class="sl-sublabel">Interactive</span></span></button>
    <button class="sidebar-link" data-id="code-1" onclick="goto('code-1')"><span class="sl-icon">💻</span><span class="sl-label">Level 1 — Basic<span class="sl-sublabel">Code Ref</span></span></button>
    <button class="sidebar-link" data-id="code-2" onclick="goto('code-2')"><span class="sl-icon">💻</span><span class="sl-label">Level 2 — PWM<span class="sl-sublabel">Code Ref</span></span></button>
    <button class="sidebar-link" data-id="code-3" onclick="goto('code-3')"><span class="sl-icon">💻</span><span class="sl-label">Level 3 — Meter<span class="sl-sublabel">Code Ref</span></span></button>
  </div>

  <div class="sidebar-section">
    <div class="sidebar-section-label">Projects</div>
    <button class="sidebar-link" data-id="models-1" onclick="goto('models-1')"><span class="sl-icon">🔧</span><span class="sl-label">6 Project Models<span class="sl-sublabel">Build Ideas</span></span></button>
  </div>

  <div class="sidebar-section">
    <div class="sidebar-section-label">Quiz</div>
    <button class="sidebar-link" data-id="quiz-1" onclick="goto('quiz-1')"><span class="sl-icon">❓</span><span class="sl-label">Course Quiz<span class="sl-sublabel">Knowledge Check</span></span></button>
  </div>
</div>
`;

/* ── Simulator ── */
function updateSim(value) {
  value = parseInt(value);
  const dark = 100 - value;
  const res = Math.round(1 + (dark / 100) * 999);
  const analog = Math.round((dark / 100) * 1023);
  const brightness = Math.round((dark / 100) * 255);
  const ledOn = dark > 40;

  const setText = (id, txt) => { const el = document.getElementById(id); if (el) el.textContent = txt; };
  setText('lightPct', value + '%');
  setText('ldrRes', res + ' kΩ');
  setText('analogVal', analog + ' / 1023');
  setText('ledBright', brightness + ' / 255');
  setText('ledStatus', ledOn ? 'ON' : 'OFF');

  const statusEl = document.getElementById('ledStatus');
  if (statusEl) statusEl.className = 'reading-val ' + (ledOn ? 'grn' : '');

  const dome = document.getElementById('ledDome');
  if (dome) dome.classList.toggle('on', ledOn);

  const ledLbl = document.getElementById('ledLabel');
  if (ledLbl) { ledLbl.textContent = ledOn ? 'LED ON' : 'LED OFF'; ledLbl.style.color = ledOn ? 'var(--warm)' : ''; }

  const sun = document.getElementById('sunIcon');
  if (sun) sun.classList.toggle('bright', value > 60);

  const chip = document.getElementById('ldrChip');
  if (chip) { chip.classList.toggle('active', value > 60); chip.classList.toggle('dark', value <= 60); }
}

/* ── DOMContentLoaded ── */
document.addEventListener('DOMContentLoaded', () => {
  const aside = document.querySelector('aside.sidebar');
  const isModulePage = !!aside;

  // Active nav link (runs on all pages)
  const file = getCurrentFile();
  document.querySelectorAll('.top-nav ul a').forEach(a => {
    const href = (a.getAttribute('href') || '').split('/').pop();
    if (href === file) a.classList.add('active');
  });

  // Index-only: FAQ + completed module highlight
  if (!isModulePage) {
    initFaq();
    const saved = getSaved();
    document.querySelectorAll('.module-row[data-mod]').forEach(row => {
      const mod = row.dataset.mod;
      const modLessons = LESSONS.filter(id => id.startsWith(mod + '-'));
      if (modLessons.length && modLessons.every(id => saved.has(id))) {
        row.style.borderColor = 'rgba(22,163,74,.35)';
      }
    });
    return; // stop here for index
  }

  // Module pages only from here
  aside.innerHTML = SIDEBAR_HTML;

  const currentLesson = getCurrentLesson();
  window._currentLesson = currentLesson;
  goto(currentLesson);
  updateProgress();
  initQuiz();
  initFaq();

  // Hamburger
  const ham = document.querySelector('.hamburger');
  const sidebar = document.querySelector('.sidebar');
  if (ham && sidebar) {
    ham.addEventListener('click', () => sidebar.classList.toggle('open'));
    document.addEventListener('click', e => {
      if (!sidebar.contains(e.target) && !ham.contains(e.target)) sidebar.classList.remove('open');
    });
  }

  // Simulator slider
  const slider = document.getElementById('lightSlider');
  if (slider) { slider.addEventListener('input', () => updateSim(slider.value)); updateSim(slider.value); }
});
