// ── AlCoders ATL · Python Course ──────────────────────────────────────────

const MODULES = [
  { id: 1, title: "Getting Started",        lessons: ["1-1","1-2","1-3","1-4","1-5"] },
  { id: 2, title: "Variables & Data Types", lessons: ["2-1","2-2","2-3","2-4","2-5","2-6"] },
  { id: 3, title: "Operators & Expressions",lessons: ["3-1","3-2","3-3","3-4","3-5"] },
  { id: 4, title: "Control Flow",           lessons: ["4-1","4-2","4-3","4-4","4-5","4-6"] },
  { id: 5, title: "Functions",              lessons: ["5-1","5-2","5-3","5-4","5-5","5-6","5-7"] },
  { id: 6, title: "Data Structures",        lessons: ["6-1","6-2","6-3","6-4","6-5","6-6","6-7"] },
  { id: 7, title: "Strings In-Depth",       lessons: ["7-1","7-2","7-3","7-4"] },
  { id: 8, title: "Files & Exceptions",     lessons: ["8-1","8-2","8-3","8-4","8-5"] },
  { id: 9, title: "Object-Oriented Python", lessons: ["9-1","9-2","9-3","9-4","9-5","9-6","9-7"] },
  { id:10, title: "Modules & Packages",     lessons: ["10-1","10-2","10-3","10-4","10-5"] },
  { id:11, title: "Advanced Python",        lessons: ["11-1","11-2","11-3","11-4","11-5","11-6"] },
  { id:12, title: "Capstone Projects",      lessons: ["12-1","12-2","12-3","12-4","12-5"] },
];

const LESSON_NAMES = {
  "1-1":"What is Python","1-2":"Installing Python & VS Code","1-3":"First Program","1-4":"How Python Works","1-5":"Quiz & Practice",
  "2-1":"Variables & Assignment","2-2":"Numbers","2-3":"Strings","2-4":"Booleans & None","2-5":"Type Conversion","2-6":"User Input",
  "3-1":"Arithmetic Operators","3-2":"Comparison Operators","3-3":"Logical Operators","3-4":"String Operations","3-5":"Operator Precedence",
  "4-1":"if / elif / else","4-2":"Nested Conditions","4-3":"for Loops","4-4":"while Loops","4-5":"break / continue / pass","4-6":"Loop Patterns",
  "5-1":"Defining Functions","5-2":"Parameters & Arguments","5-3":"Return Values","5-4":"Default Arguments","5-5":"*args & **kwargs","5-6":"Lambda Functions","5-7":"Scope & Closures",
  "6-1":"Lists","6-2":"List Methods & Slicing","6-3":"Tuples","6-4":"Dictionaries","6-5":"Sets","6-6":"List Comprehensions","6-7":"Nested Data Structures",
  "7-1":"String Methods","7-2":"String Formatting","7-3":"Regular Expressions","7-4":"String Projects",
  "8-1":"Reading & Writing Files","8-2":"CSV & JSON","8-3":"Try / Except / Finally","8-4":"Custom Exceptions","8-5":"Context Managers",
  "9-1":"Classes & Objects","9-2":"__init__ & self","9-3":"Methods & Attributes","9-4":"Inheritance","9-5":"Encapsulation & Polymorphism","9-6":"Dunder Methods","9-7":"Dataclasses",
  "10-1":"Importing Modules","10-2":"Standard Library Tour","10-3":"pip & Virtual Envs","10-4":"Building Your Own Module","10-5":"Popular Libraries",
  "11-1":"Iterators & Generators","11-2":"Decorators","11-3":"Threads & Async","11-4":"Type Hints","11-5":"Testing with pytest","11-6":"Functional Tools",
  "12-1":"Project: CLI To-Do App","12-2":"Project: File Organiser","12-3":"Project: Web Scraper","12-4":"Project: REST API Client","12-5":"What's Next?",
};

// flat ordered list of all lesson IDs
const LESSONS = MODULES.flatMap(m => m.lessons);

// current module number — detect from filename
const CURRENT_MODULE = (() => {
  const m = location.pathname.match(/module(\d+)\.html/);
  return m ? parseInt(m[1]) : 1;
})();

// ── Sidebar ────────────────────────────────────────────────────────────────
function buildSidebar() {
  const aside = document.querySelector("aside.sidebar");
  if (!aside) return;

  let html = '<div class="sidebar-inner">';
  for (const mod of MODULES) {
    const isCurrentMod = mod.id === CURRENT_MODULE;
    html += `<div class="sidebar-mod${isCurrentMod ? " active-mod" : ""}">`;
    html += `<a class="mod-title" href="module${mod.id}.html">
               <span class="mod-num">M${mod.id}</span>${mod.title}
             </a>`;
    html += '<ul class="lesson-list">';
    for (const lid of mod.lessons) {
      const done = localStorage.getItem(`alcoders-python-done-${lid}`) === "1";
      const clickable = isCurrentMod ? `onclick="goto('${lid}')"` : `onclick="window.location='module${mod.id}.html#${lid}'"`;
      html += `<li class="lesson-item${done ? " done" : ""}${isCurrentMod ? "" : " other-mod"}" id="li-${lid}" ${clickable}>
                 ${done ? "✓ " : ""}${LESSON_NAMES[lid] || lid}
               </li>`;
    }
    html += '</ul>';
    html += '</div>';
  }
  html += '</div>';
  aside.innerHTML = html;
}

// ── Lesson Navigation ──────────────────────────────────────────────────────
function goto(id) {
  // hide all lesson pages
  document.querySelectorAll(".lesson-page").forEach(p => {
    p.classList.remove("active");
    p.style.display = "none";
  });
  // show target
  const target = document.getElementById("lesson-" + id);
  if (!target) return;
  target.style.display = "block";
  target.classList.add("active");

  // update sidebar highlight
  document.querySelectorAll(".lesson-item").forEach(li => li.classList.remove("current"));
  const li = document.getElementById("li-" + id);
  if (li) li.classList.add("current");

  // update breadcrumb
  const crumb = document.querySelector(".breadcrumb span");
  if (crumb) crumb.textContent = LESSON_NAMES[id] || id;

  // update prev/next buttons
  const idx = LESSONS.indexOf(id);
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  if (prevBtn) prevBtn.disabled = idx <= 0;
  if (nextBtn) {
    const isLast = idx >= LESSONS.length - 1;
    nextBtn.textContent = isLast ? "Finish 🎉" : "Next →";
    nextBtn.disabled = false;
  }

  // store current lesson in URL hash
  history.replaceState(null, "", "#" + id);
  window.scrollTo(0, 0);
  document.querySelector(".main").scrollTo(0, 0);
}

function navigateTo(id) {
  const modNum = parseInt(id.split("-")[0]);
  window.location.href = `module${modNum}.html?goto=${id}`;
}

function prevLesson() {
  const active = document.querySelector(".lesson-page.active");
  if (!active) return;
  const id = active.id.replace("lesson-", "");
  const idx = LESSONS.indexOf(id);
  if (idx <= 0) return;
  const prev = LESSONS[idx - 1];
  const prevMod = parseInt(prev.split("-")[0]);
  if (prevMod !== CURRENT_MODULE) {
    navigateTo(prev);
  } else {
    goto(prev);
  }
}

function nextLesson() {
  const active = document.querySelector(".lesson-page.active");
  if (!active) return;
  const id = active.id.replace("lesson-", "");
  const idx = LESSONS.indexOf(id);
  if (idx >= LESSONS.length - 1) return;
  const next = LESSONS[idx + 1];
  const nextMod = parseInt(next.split("-")[0]);
  if (nextMod !== CURRENT_MODULE) {
    navigateTo(next);
  } else {
    goto(next);
  }
}

// ── Mark Complete ──────────────────────────────────────────────────────────
function markDone(btn) {
  const id = btn.dataset.lesson;
  localStorage.setItem(`alcoders-python-done-${id}`, "1");
  btn.textContent = "✓ Completed";
  btn.disabled = true;
  btn.classList.add("done");
  const li = document.getElementById("li-" + id);
  if (li) {
    li.classList.add("done");
    if (!li.textContent.startsWith("✓")) li.textContent = "✓ " + li.textContent;
  }
}

// ── Copy Code ──────────────────────────────────────────────────────────────
function copyCode(btn) {
  const body = btn.closest(".code-block").querySelector(".code-body");
  const text = body ? body.innerText : "";
  navigator.clipboard.writeText(text).then(() => {
    btn.textContent = "Copied!";
    setTimeout(() => btn.textContent = "Copy", 1500);
  });
}

// ── Quiz ───────────────────────────────────────────────────────────────────
function initQuiz() {
  document.querySelectorAll(".quiz-opt").forEach(opt => {
    opt.addEventListener("click", () => {
      const box = opt.closest(".quiz-box");
      if (box.dataset.answered) return;
      box.dataset.answered = "1";
      const correct = opt.dataset.correct === "true";
      opt.classList.add(correct ? "correct" : "wrong");
      const fb = box.querySelector(correct ? ".quiz-feedback[data-ok]" : ".quiz-feedback[data-bad]");
      if (fb) fb.style.display = "block";
    });
  });
}

// ── FAQ ────────────────────────────────────────────────────────────────────
function initFaq() {
  document.querySelectorAll(".faq-q").forEach(q => {
    q.addEventListener("click", () => {
      const item = q.closest(".faq-item");
      item.classList.toggle("open");
    });
  });
}

// ── Scroll Progress ────────────────────────────────────────────────────────
function initProgress() {
  const bar = document.querySelector(".progress-bar");
  if (!bar) return;
  const scroller = document.querySelector(".main") || window;
  const getScroll = () => scroller === window
    ? { top: window.scrollY, height: document.body.scrollHeight - window.innerHeight }
    : { top: scroller.scrollTop, height: scroller.scrollHeight - scroller.clientHeight };
  const update = () => {
    const { top, height } = getScroll();
    bar.style.width = height > 0 ? (top / height * 100) + "%" : "0%";
  };
  scroller.addEventListener("scroll", update);
  update();
}

// ── Init ───────────────────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  buildSidebar();
  initQuiz();
  initFaq();
  initProgress();

  // Determine which lesson to show first
  const params = new URLSearchParams(location.search);
  const gotoParam = params.get("goto");
  const hashId = location.hash.slice(1);

  // Find first lesson of this module
  const modObj = MODULES.find(m => m.id === CURRENT_MODULE);
  const firstLesson = modObj ? modObj.lessons[0] : null;

  const startId = gotoParam || hashId || firstLesson;
  if (startId) goto(startId);

  // Mark done buttons that are already completed
  document.querySelectorAll(".complete-btn").forEach(btn => {
    const id = btn.dataset.lesson;
    if (localStorage.getItem(`alcoders-python-done-${id}`) === "1") {
      btn.textContent = "✓ Completed";
      btn.disabled = true;
      btn.classList.add("done");
    }
  });
});