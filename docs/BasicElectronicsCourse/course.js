// ===== ALCODERS ELECTRONICS COURSE - SHARED JS =====

// ---- PROGRESS PERSISTENCE ----
const COURSE_KEY = 'elec_progress_v1';

function getProgress() {
  try { return JSON.parse(localStorage.getItem(COURSE_KEY)) || {}; }
  catch { return {}; }
}

function saveProgress(data) {
  localStorage.setItem(COURSE_KEY, JSON.stringify(data));
}

function markLesson(lessonId, done = true) {
  const p = getProgress();
  if (done) p[lessonId] = true;
  else delete p[lessonId];
  saveProgress(p);
}

function isLessonDone(lessonId) {
  return !!getProgress()[lessonId];
}

// ---- PROGRESS BAR ----
function updateProgressBar(moduleId, totalLessons) {
  const p = getProgress();
  const prefix = moduleId + '_';
  const done = Object.keys(p).filter(k => k.startsWith(prefix) && p[k]).length;
  const pct = totalLessons > 0 ? Math.round((done / totalLessons) * 100) : 0;

  const fill = document.querySelector('.progress-bar-fill');
  const label = document.querySelector('.progress-label');
  if (fill) fill.style.width = pct + '%';
  if (label) label.textContent = pct + '% complete';
  return pct;
}

function updateGlobalProgress(allLessons) {
  const p = getProgress();
  const done = Object.keys(p).filter(k => p[k]).length;
  const pct = allLessons > 0 ? Math.round((done / allLessons) * 100) : 0;
  const fill = document.querySelector('.progress-bar-fill');
  const label = document.querySelector('.progress-label');
  if (fill) fill.style.width = pct + '%';
  if (label) label.textContent = done + ' / ' + allLessons + ' lessons complete';
  return pct;
}

// ---- MARK DONE BUTTON ----
function initMarkDone(lessonId) {
  const btn = document.querySelector('.mark-done-btn');
  if (!btn) return;
  const isDone = isLessonDone(lessonId);
  btn.textContent = isDone ? '✓ Completed' : 'Mark as Complete';
  if (isDone) btn.classList.add('done-active');

  btn.addEventListener('click', () => {
    const nowDone = !isLessonDone(lessonId);
    markLesson(lessonId, nowDone);
    btn.textContent = nowDone ? '✓ Completed' : 'Mark as Complete';
    btn.classList.toggle('done-active', nowDone);
    refreshSidebarDone();
  });
}

// ---- SIDEBAR DONE STATES ----
function refreshSidebarDone() {
  const p = getProgress();
  document.querySelectorAll('.lesson-item a[data-lid]').forEach(a => {
    const lid = a.getAttribute('data-lid');
    if (p[lid]) a.classList.add('done');
    else a.classList.remove('done');
  });
}

// ---- COPY CODE BUTTON ----
function initCopyBtns() {
  document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const pre = btn.closest('.code-block').querySelector('pre');
      navigator.clipboard.writeText(pre.innerText).then(() => {
        btn.textContent = 'Copied!';
        setTimeout(() => btn.textContent = 'Copy', 1500);
      });
    });
  });
}

// ---- QUIZ ----
function initQuizzes() {
  document.querySelectorAll('.quiz-section').forEach(quiz => {
    const opts = quiz.querySelectorAll('.quiz-opt');
    const feedback = quiz.querySelector('.quiz-feedback');
    opts.forEach(opt => {
      opt.addEventListener('click', () => {
        if (quiz.dataset.answered) return;
        quiz.dataset.answered = '1';
        const correct = opt.dataset.correct === 'true';
        opt.classList.add(correct ? 'correct' : 'wrong');
        if (!correct) {
          opts.forEach(o => { if (o.dataset.correct === 'true') o.classList.add('correct'); });
        }
        if (feedback) {
          feedback.textContent = correct ? '✓ Correct! ' + (feedback.dataset.ok || '') : '✗ Not quite. ' + (feedback.dataset.bad || '');
          feedback.classList.add('show', correct ? 'ok' : 'bad');
        }
      });
    });
  });
}

// ---- MODULE RING PROGRESS (index page) ----
function updateRings() {
  const p = getProgress();
  document.querySelectorAll('.module-card').forEach(card => {
    const mid = card.dataset.module;
    const total = parseInt(card.dataset.lessons || '0');
    if (!mid || !total) return;
    const done = Object.keys(p).filter(k => k.startsWith(mid + '_') && p[k]).length;
    const pct = done / total;
    const ring = card.querySelector('.ring-fill');
    if (ring) {
      const r = 14;
      const circ = 2 * Math.PI * r;
      ring.style.strokeDasharray = circ;
      ring.style.strokeDashoffset = circ * (1 - pct);
    }
  });
}

// ---- COLLAPSIBLE SIDEBAR MODULES ----
function initSidebarCollapse() {
  document.querySelectorAll('.module-title-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const group = btn.closest('.module-group');
      const list = group.querySelector('.lesson-list');
      if (!list) return;
      const open = list.style.display !== 'none';
      list.style.display = open ? 'none' : 'block';
    });
  });
}

// ---- INIT ----
document.addEventListener('DOMContentLoaded', () => {
  initCopyBtns();
  initQuizzes();
  initSidebarCollapse();
  refreshSidebarDone();
});
