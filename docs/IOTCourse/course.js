// ── COURSE STRUCTURE ──────────────────────────────────────────
const COURSE_ID = 'iot-course';

const MODULES = [
  { id: 1, title: 'Introduction to IoT', file: 'module1.html', lessons: [
    { id: '1-1', title: 'What is IoT?' },
    { id: '1-2', title: 'History & Evolution of IoT' },
    { id: '1-3', title: 'How IoT Works: Big Picture' },
    { id: '1-4', title: 'Real-World IoT Applications' },
    { id: '1-5', title: 'IoT Ecosystem & Players' },
  ]},
  { id: 2, title: 'IoT Hardware Essentials', file: 'module2.html', lessons: [
    { id: '2-1', title: 'Microcontrollers vs Microprocessors' },
    { id: '2-2', title: 'Arduino for IoT' },
    { id: '2-3', title: 'ESP8266 & ESP32 (Wi-Fi Boards)' },
    { id: '2-4', title: 'Raspberry Pi in IoT' },
    { id: '2-5', title: 'Choosing the Right Board' },
  ]},
  { id: 3, title: 'Sensors & Actuators', file: 'module3.html', lessons: [
    { id: '3-1', title: 'What are Sensors?' },
    { id: '3-2', title: 'Temperature & Humidity Sensors' },
    { id: '3-3', title: 'Motion & Proximity Sensors' },
    { id: '3-4', title: 'Light, Sound & Gas Sensors' },
    { id: '3-5', title: 'Actuators: Motors, Relays, LEDs' },
  ]},
  { id: 4, title: 'Connectivity & Protocols', file: 'module4.html', lessons: [
    { id: '4-1', title: 'Wireless Communication Basics' },
    { id: '4-2', title: 'Wi-Fi for IoT' },
    { id: '4-3', title: 'Bluetooth & BLE' },
    { id: '4-4', title: 'MQTT Protocol' },
    { id: '4-5', title: 'HTTP & REST APIs in IoT' },
  ]},
  { id: 5, title: 'IoT Programming', file: 'module5.html', lessons: [
    { id: '5-1', title: 'Arduino IDE Setup for IoT' },
    { id: '5-2', title: 'Reading Sensor Data in Code' },
    { id: '5-3', title: 'Sending Data to the Cloud' },
    { id: '5-4', title: 'Receiving Commands from Cloud' },
    { id: '5-5', title: 'MicroPython on ESP32' },
  ]},
  { id: 6, title: 'Cloud & IoT Platforms', file: 'module6.html', lessons: [
    { id: '6-1', title: 'What is the IoT Cloud?' },
    { id: '6-2', title: 'ThingSpeak Platform' },
    { id: '6-3', title: 'Adafruit IO' },
    { id: '6-4', title: 'Blynk App for Mobile Control' },
    { id: '6-5', title: 'AWS IoT & Google Cloud IoT' },
  ]},
  { id: 7, title: 'Data, Dashboards & Automation', file: 'module7.html', lessons: [
    { id: '7-1', title: 'Storing IoT Data' },
    { id: '7-2', title: 'Visualising Data with Dashboards' },
    { id: '7-3', title: 'Alerts & Notifications' },
    { id: '7-4', title: 'IFTTT & Automation Workflows' },
    { id: '7-5', title: 'Introduction to Edge Computing' },
  ]},
  { id: 8, title: 'IoT Security', file: 'module8.html', lessons: [
    { id: '8-1', title: 'Why IoT Security Matters' },
    { id: '8-2', title: 'Common IoT Vulnerabilities' },
    { id: '8-3', title: 'Securing Your Device' },
    { id: '8-4', title: 'Encryption & Authentication' },
    { id: '8-5', title: 'Best Practices Checklist' },
  ]},
  { id: 9, title: 'Beginner IoT Projects', file: 'module9.html', lessons: [
    { id: '9-1', title: 'Project: Temperature Monitor' },
    { id: '9-2', title: 'Project: Smart LED Controller' },
    { id: '9-3', title: 'Project: Motion Alarm System' },
    { id: '9-4', title: 'Project: Plant Watering Monitor' },
    { id: '9-5', title: 'Project: Weather Station' },
  ]},
  { id: 10, title: 'Advanced IoT Projects', file: 'module10.html', lessons: [
    { id: '10-1', title: 'Project: Smart Home Dashboard' },
    { id: '10-2', title: 'Project: GPS Tracker' },
    { id: '10-3', title: 'Project: Voice-Controlled Device' },
    { id: '10-4', title: 'Project: Industrial Sensor Node' },
    { id: '10-5', title: 'Capstone: Full IoT System' },
  ]},
];

// Flat lessons list for prev/next
const ALL_LESSONS = MODULES.flatMap(m => m.lessons.map(l => ({ ...l, file: m.file })));

// ── SIDEBAR HTML BUILDER ──────────────────────────────────────
function buildSidebarHTML() {
  let html = '<h2>🌐 IoT Course</h2>';
  MODULES.forEach(mod => {
    html += `<div class="mod-group">`;
    html += `<div class="mod-title">Module ${mod.id}: ${mod.title}</div>`;
    mod.lessons.forEach(lesson => {
      html += `<a class="lesson-link" data-id="${lesson.id}" onclick="goto('${lesson.id}')">${lesson.title}</a>`;
    });
    html += `</div>`;
  });
  return html;
}

// ── GOTO ─────────────────────────────────────────────────────
function goto(id) {
  document.querySelectorAll('.lesson-page').forEach(p => p.classList.remove('active'));
  const page = document.getElementById('lesson-' + id);
  if (page) {
    page.classList.add('active');
    document.querySelector('.main').scrollTo({ top: 0, behavior: 'smooth' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  document.querySelectorAll('.lesson-link').forEach(l => {
    l.classList.toggle('active', l.dataset.id === id);
    if (localStorage.getItem(COURSE_ID + '-' + l.dataset.id)) l.classList.add('done');
  });
  // breadcrumb
  const entry = ALL_LESSONS.find(l => l.id === id);
  const mod = MODULES.find(m => m.lessons.some(l => l.id === id));
  if (entry && mod) {
    const bc = document.querySelector('.breadcrumb');
    if (bc) bc.innerHTML = `Module ${mod.id} › <span>${entry.title}</span>`;
  }
  history.replaceState(null, '', '?goto=' + id);
}

function prevLesson() {
  const cur = currentLesson();
  const idx = ALL_LESSONS.findIndex(l => l.id === cur);
  if (idx > 0) {
    const prev = ALL_LESSONS[idx - 1];
    if (prev.file !== ALL_LESSONS[idx].file) { window.location = prev.file + '?goto=' + prev.id; }
    else goto(prev.id);
  }
}

function nextLesson() {
  const cur = currentLesson();
  const idx = ALL_LESSONS.findIndex(l => l.id === cur);
  if (idx < ALL_LESSONS.length - 1) {
    const next = ALL_LESSONS[idx + 1];
    if (next.file !== ALL_LESSONS[idx].file) { window.location = next.file + '?goto=' + next.id; }
    else goto(next.id);
  }
}

function currentLesson() {
  const active = document.querySelector('.lesson-page.active');
  return active ? active.id.replace('lesson-', '') : null;
}

function markDone(btn) {
  const page = btn.closest('.lesson-page');
  const id = page.id.replace('lesson-', '');
  localStorage.setItem(COURSE_ID + '-' + id, '1');
  btn.textContent = '✓ Completed';
  btn.classList.add('done');
  document.querySelectorAll('.lesson-link').forEach(l => {
    if (l.dataset.id === id) l.classList.add('done');
  });
}

function copyCode(btn) {
  const body = btn.closest('.code-block').querySelector('.code-body');
  navigator.clipboard.writeText(body.innerText).then(() => {
    btn.textContent = 'Copied!';
    setTimeout(() => btn.textContent = 'Copy', 1500);
  });
}

function initQuiz() {
  document.querySelectorAll('.quiz-box').forEach(box => {
    box.querySelectorAll('.quiz-opt').forEach(opt => {
      opt.addEventListener('click', () => {
        if (box.dataset.answered) return;
        box.dataset.answered = '1';
        const isCorrect = opt.dataset.correct !== undefined;
        opt.classList.add(isCorrect ? 'correct' : 'wrong');
        if (!isCorrect) {
          box.querySelectorAll('.quiz-opt[data-correct]').forEach(c => c.classList.add('correct'));
        }
        const fb = box.querySelector(isCorrect ? '.quiz-feedback[data-ok]' : '.quiz-feedback[data-bad]');
        if (fb) fb.style.display = 'block';
      });
    });
  });
}

function initFaq() {
  document.querySelectorAll('.faq-item').forEach(item => {
    item.querySelector('.faq-q').addEventListener('click', () => item.classList.toggle('open'));
  });
}

function initProgress() {
  const bar = document.getElementById('mod-progress') || document.getElementById('progress-bar');
  if (!bar) return;
  const scroller = document.querySelector('.main') || document.documentElement;
  const update = () => {
    const scrollEl = document.querySelector('.main') ? document.querySelector('.main') : document.documentElement;
    const scrolled = scrollEl.scrollTop || window.scrollY;
    const total = (scrollEl.scrollHeight || document.body.scrollHeight) - (scrollEl.clientHeight || window.innerHeight);
    bar.style.width = (total > 0 ? (scrolled / total) * 100 : 0) + '%';
  };
  (document.querySelector('.main') || window).addEventListener('scroll', update);
}

// ── INIT ─────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // inject sidebar
  const aside = document.querySelector('aside.sidebar');
  if (aside) aside.innerHTML = buildSidebarHTML();

  // restore done state
  document.querySelectorAll('.lesson-link').forEach(l => {
    if (localStorage.getItem(COURSE_ID + '-' + l.dataset.id)) l.classList.add('done');
  });

  // goto param
  const params = new URLSearchParams(location.search);
  const startId = params.get('goto');
  if (startId && document.getElementById('lesson-' + startId)) {
    goto(startId);
  } else {
    const first = document.querySelector('.lesson-page');
    if (first) {
      first.classList.add('active');
      const firstId = first.id.replace('lesson-', '');
      document.querySelector(`.lesson-link[data-id="${firstId}"]`)?.classList.add('active');
    }
  }

  initQuiz();
  initFaq();
  initProgress();
});
