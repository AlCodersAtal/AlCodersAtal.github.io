/**
 * loadNav.js — AlCoders Navigation + Footer Loader
 *
 * Loads nav.html    into  <div id="nav"></div>
 * Loads footer.html into  <div id="footer"></div>
 *
 * Usage — add both divs to every page:
 *   <div id="nav"></div>        ← very top of <body>
 *   <div id="footer"></div>     ← very bottom of <body>
 *   <script src="loadNav.js"></script>
 */
(function () {
  // Resolve base path relative to where loadNav.js lives
  const base = document.currentScript
    ? document.currentScript.src.replace(/loadNav\.js$/, '')
    : '';

  /* ── LOAD NAV ── */
  const navHolder = document.getElementById('nav');
  if (navHolder) {
    fetch(base + 'nav.html')
      .then(res => {
        if (!res.ok) throw new Error('nav.html not found');
        return res.text();
      })
      .then(html => {
        navHolder.insertAdjacentHTML('beforebegin', html);
        navHolder.remove();
      })
      .catch(err => console.warn('[loadNav.js] Nav:', err.message));
  }

  /* ── LOAD FOOTER ── */
  const footerHolder = document.getElementById('footer');
  if (footerHolder) {
    fetch(base + 'footer.html')
      .then(res => {
        if (!res.ok) throw new Error('footer.html not found');
        return res.text();
      })
      .then(html => {
        footerHolder.innerHTML = html;
      })
      .catch(err => console.warn('[loadNav.js] Footer:', err.message));
  }
})();