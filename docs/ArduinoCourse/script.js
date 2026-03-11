/* AlCoders Arduino Course – script.js */

/* ── READING PROGRESS BAR ── */
(function(){
  var bar = document.createElement('div');
  bar.className = 'reading-progress';
  document.body.prepend(bar);
  var main = document.querySelector('.main-content') || document.body;
  function updateBar(){
    var el = document.querySelector('.main-content') || document.documentElement;
    var scrollTop = el.scrollTop || window.scrollY;
    var scrollHeight = el.scrollHeight - el.clientHeight;
    bar.style.width = scrollHeight > 0 ? (scrollTop / scrollHeight * 100) + '%' : '0%';
  }
  (document.querySelector('.main-content') || window).addEventListener('scroll', updateBar);
})();

/* ── COPY BUTTONS ── */
document.querySelectorAll('.copy-btn').forEach(function(btn){
  btn.addEventListener('click', function(){
    var pre = btn.closest('.code-block').querySelector('pre');
    if(!pre) return;
    navigator.clipboard.writeText(pre.innerText).then(function(){
      btn.textContent = 'Copied!';
      btn.classList.add('copied');
      setTimeout(function(){ btn.textContent = 'Copy'; btn.classList.remove('copied'); }, 2000);
    });
  });
});

/* ── PROGRESS TRACKING ── */
var TOTAL_LESSONS = 60;
function getLessons(){ try{ return JSON.parse(localStorage.getItem('arduino_done')||'{}'); }catch(e){ return {}; } }
function saveLessons(d){ try{ localStorage.setItem('arduino_done', JSON.stringify(d)); }catch(e){} }

function updateProgress(){
  var done = Object.keys(getLessons()).filter(function(k){ return getLessons()[k]; });
  var pct = Math.round(done.length / TOTAL_LESSONS * 100);
  document.querySelectorAll('.progress-bar-fill').forEach(function(el){ el.style.width = pct + '%'; });
  document.querySelectorAll('.progress-text').forEach(function(el){ el.textContent = done.length + ' / ' + TOTAL_LESSONS + ' lessons completed'; });
  var d = getLessons();
  document.querySelectorAll('.lesson-link[data-lesson]').forEach(function(link){
    var id = link.dataset.lesson;
    if(d[id]) { link.classList.add('done'); link.querySelector('.lesson-dot') && (link.querySelector('.lesson-dot').style.background = 'var(--green)'); }
  });
}

document.querySelectorAll('.btn-complete').forEach(function(btn){
  var id = btn.dataset.lesson;
  if(!id) return;
  var d = getLessons();
  if(d[id]){ btn.textContent = '✓ Completed'; btn.classList.add('done'); }
  btn.addEventListener('click', function(){
    var d2 = getLessons();
    d2[id] = true;
    saveLessons(d2);
    btn.textContent = '✓ Completed';
    btn.classList.add('done');
    updateProgress();
  });
});

/* ── QUIZ BOXES ── */
document.querySelectorAll('.quiz-box').forEach(function(box){
  box.querySelectorAll('.quiz-option').forEach(function(opt){
    opt.addEventListener('click', function(){
      if(box.dataset.answered) return;
      box.dataset.answered = '1';
      var isCorrect = opt.dataset.correct === 'true';
      opt.classList.add(isCorrect ? 'correct' : 'wrong');
      if(!isCorrect){
        box.querySelectorAll('.quiz-option').forEach(function(o){
          if(o.dataset.correct === 'true') o.classList.add('correct');
        });
      }
      var result = box.querySelector('.quiz-result');
      if(result){
        result.style.display = 'block';
        result.style.color = isCorrect ? 'var(--green)' : 'var(--accent2)';
        result.textContent = isCorrect ? '✓ Correct!' : '✗ Not quite — see the highlighted answer.';
      }
    });
  });
});

updateProgress();