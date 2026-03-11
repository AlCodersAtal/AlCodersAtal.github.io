/* ═══════════════════════════════════════════════
   AlCoders — Introduction to Sensors
   Shared Course JavaScript  (course.js)
   ═══════════════════════════════════════════════ */

const STORAGE_KEY = 'alcoders_sensors_progress';

/* ── Load saved progress ─────────────────────── */
function loadProgress() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    Object.keys(saved).forEach(id => {
      if (!saved[id]) return;
      const link = document.querySelector(`[data-lesson="${id}"]`);
      if (link) link.classList.add('done');
      const btn = document.querySelector(`#${id} .complete-btn`);
      if (btn) { btn.textContent = 'Completed ✓'; btn.classList.add('done'); }
    });
  } catch(e) {}
}

/* ── Mark lesson complete ────────────────────── */
function markDone(btn, id) {
  if (btn.classList.contains('done')) return;
  btn.textContent = 'Completed ✓';
  btn.classList.add('done');
  const link = document.querySelector(`[data-lesson="${id}"]`);
  if (link) link.classList.add('done');
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    saved[id] = true;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
  } catch(e) {}
  updateProgressBar();
}

/* ── Navigate between lessons ────────────────── */
function goLesson(id) {
  const idx = lessonOrder.indexOf(id);
  if (idx === -1) return;
  currentIndex = idx;

  document.querySelectorAll('.lesson-page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.sidebar-lesson').forEach(l => l.classList.remove('active'));

  const page = document.getElementById(id);
  if (page) page.classList.add('active');

  const link = document.querySelector(`[data-lesson="${id}"]`);
  if (link) {
    link.classList.add('active');
    link.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }

  const main = document.getElementById('mainContent');
  if (main) main.scrollTo({ top: 0, behavior: 'smooth' });

  updateNavButtons();
  updateBreadcrumb(id);
  updateProgressBar();
}

/* ── Prev / Next buttons ─────────────────────── */
function updateNavButtons() {
  const prev = document.getElementById('prevBtn');
  const next = document.getElementById('nextBtn');
  if (prev) prev.disabled = (currentIndex === 0);
  if (next) next.disabled = (currentIndex === lessonOrder.length - 1);
}

function initNavButtons() {
  const prev = document.getElementById('prevBtn');
  const next = document.getElementById('nextBtn');
  if (prev) prev.addEventListener('click', () => {
    if (currentIndex > 0) goLesson(lessonOrder[currentIndex - 1]);
  });
  if (next) next.addEventListener('click', () => {
    if (currentIndex < lessonOrder.length - 1) goLesson(lessonOrder[currentIndex + 1]);
  });
}

/* ── Breadcrumb ──────────────────────────────── */
function updateBreadcrumb(id) {
  const bc = document.querySelector('.breadcrumb');
  if (!bc) return;
  const link = document.querySelector(`[data-lesson="${id}"]`);
  const lessonName = link ? link.textContent.trim() : id;
  bc.innerHTML = `AlCoders / <strong>Sensors</strong> / ${lessonName}`;
}

/* ── Overall progress bar ────────────────────── */
function updateProgressBar() {
  const bar = document.getElementById('progressBar');
  if (!bar) return;
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    const totalLessons = 35;
    const done = Object.values(saved).filter(Boolean).length;
    bar.style.width = Math.min((done / totalLessons) * 100, 100) + '%';
  } catch(e) {}
}

/* ── Copy code button ────────────────────────── */
function copyCode(btn) {
  const body = btn.closest('.code-block').querySelector('.code-body');
  const text = body.innerText;
  const fallback = () => {
    const ta = document.createElement('textarea');
    ta.value = text; document.body.appendChild(ta); ta.select();
    document.execCommand('copy'); document.body.removeChild(ta);
  };
  const done = () => {
    btn.textContent = 'Copied!'; btn.classList.add('copied');
    setTimeout(() => { btn.textContent = 'Copy'; btn.classList.remove('copied'); }, 1800);
  };
  if (navigator.clipboard) navigator.clipboard.writeText(text).then(done).catch(() => { fallback(); done(); });
  else { fallback(); done(); }
}

/* ── Sidebar click handlers ──────────────────── */
function initSidebarLinks() {
  document.querySelectorAll('.sidebar-lesson').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const id = link.dataset.lesson;
      if (id) goLesson(id);
    });
  });
}

/* ── Boot ────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  loadProgress();
  initSidebarLinks();
  initNavButtons();
  if (typeof lessonOrder !== 'undefined' && lessonOrder.length > 0) {
    goLesson(lessonOrder[0]);
  }
  updateProgressBar();
});
