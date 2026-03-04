// ── AlCoders Course Shared JS ──

// Progress tracking (localStorage)
function getProgress() {
  try { return JSON.parse(localStorage.getItem('ac_progress') || '{}'); } catch { return {}; }
}
function saveProgress(data) {
  try { localStorage.setItem('ac_progress', JSON.stringify(data)); } catch {}
}
function markLessonDone(lessonId) {
  const p = getProgress(); p[lessonId] = true; saveProgress(p);
}
function isLessonDone(lessonId) { return !!getProgress()[lessonId]; }

// Current active lesson
let currentLesson = null;

function goto(id) {
  // hide all
  document.querySelectorAll('.lesson-page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.sidebar-lesson').forEach(l => l.classList.remove('active'));
  // show target
  const page = document.getElementById('lesson-' + id);
  if (!page) return;
  page.classList.add('active');
  document.querySelector('.main').scrollTo(0, 0);
  // highlight sidebar
  const link = document.querySelector(`.sidebar-lesson[data-id="${id}"]`);
  if (link) link.classList.add('active');
  currentLesson = id;
  updateTopbar(id);
  // init any tryit editors in this page
  initEditors(page);
}

function updateTopbar(id) {
  const link = document.querySelector(`.sidebar-lesson[data-id="${id}"]`);
  const title = link ? link.querySelector('.lesson-link-text')?.textContent : id;
  const modEl = document.querySelector('.breadcrumb');
  if (modEl && title) modEl.querySelector('strong').textContent = title;
}

function initEditors(container) {
  container.querySelectorAll('.tryit-editor').forEach(ed => {
    const id = ed.dataset.tryit;
    if (!id) return;
    const iframe = document.getElementById('preview-' + id);
    if (iframe && !ed.dataset.inited) {
      iframe.srcdoc = ed.value;
      ed.dataset.inited = '1';
      let timer;
      ed.addEventListener('keyup', () => {
        clearTimeout(timer);
        timer = setTimeout(() => { iframe.srcdoc = ed.value; }, 500);
      });
    }
  });
}

function runCode(id) {
  const ed = document.querySelector(`.tryit-editor[data-tryit="${id}"]`);
  const iframe = document.getElementById('preview-' + id);
  if (ed && iframe) iframe.srcdoc = ed.value;
}

function copyCode(btn) {
  const body = btn.closest('.code-block').querySelector('.code-body');
  navigator.clipboard.writeText(body.innerText).then(() => {
    btn.textContent = 'Copied!'; btn.classList.add('copied');
    setTimeout(() => { btn.textContent = 'Copy'; btn.classList.remove('copied'); }, 2000);
  });
}

function markDone(btn) {
  if (btn.classList.contains('done')) return;
  btn.classList.add('done'); btn.textContent = '✓ Completed!';
  if (currentLesson) {
    markLessonDone(currentLesson);
    const link = document.querySelector(`.sidebar-lesson[data-id="${currentLesson}"]`);
    if (link) { link.classList.add('done'); link.classList.remove('active'); link.querySelector('.lesson-dot').style.background = 'var(--green)'; }
  }
}

function nextLesson() {
  const lessons = Array.from(document.querySelectorAll('.sidebar-lesson[data-id]'));
  const idx = lessons.findIndex(l => l.dataset.id === currentLesson);
  if (idx < lessons.length - 1) goto(lessons[idx + 1].dataset.id);
}

function prevLesson() {
  const lessons = Array.from(document.querySelectorAll('.sidebar-lesson[data-id]'));
  const idx = lessons.findIndex(l => l.dataset.id === currentLesson);
  if (idx > 0) goto(lessons[idx - 1].dataset.id);
}

// Scroll progress bar
window.addEventListener('scroll', () => {
  const main = document.querySelector('.main');
  if (!main) return;
}, { passive: true });

document.addEventListener('DOMContentLoaded', () => {
  // Mark already-done lessons
  document.querySelectorAll('.sidebar-lesson[data-id]').forEach(link => {
    if (isLessonDone(link.dataset.id)) {
      link.classList.add('done');
      const dot = link.querySelector('.lesson-dot');
      if (dot) dot.style.background = 'var(--green)';
    }
  });
  // Open first lesson
  const first = document.querySelector('.sidebar-lesson[data-id]');
  if (first) goto(first.dataset.id);
});
