/* =========================================================
   REVIVE ORGANISATION — SHARED NAV/FOOTER INCLUDE
   Fetches partials/nav.html and partials/footer.html into
   any page with <div data-include="nav"></div> / "footer",
   then wires up active-link state and the mobile nav overlay.
   ========================================================= */

function normalizePath(path) {
  path = path.replace(/index\.html$/, '');
  if (path.length > 1 && !path.endsWith('/')) path += '/';
  return path;
}

function markActiveLinks() {
  var current = normalizePath(window.location.pathname);
  document.querySelectorAll('[data-nav-link]').forEach(function (a) {
    var href = normalizePath(new URL(a.getAttribute('href'), window.location.origin).pathname);
    a.classList.toggle('active', href === current);
  });
}

function wireMobileNav() {
  var hamburger = document.querySelector('[data-hamburger]');
  var panel = document.querySelector('[data-mobile-panel]');
  var backdrop = document.querySelector('[data-mobile-backdrop]');
  var closeBtn = document.querySelector('[data-mobile-close]');
  if (!hamburger || !panel || !backdrop) return;

  panel.setAttribute('inert', '');

  function openMenu() {
    panel.classList.add('open');
    backdrop.classList.add('open');
    hamburger.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    panel.removeAttribute('inert');
  }
  function closeMenu() {
    panel.classList.remove('open');
    backdrop.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    panel.setAttribute('inert', '');
  }

  hamburger.addEventListener('click', function () {
    if (panel.classList.contains('open')) closeMenu(); else openMenu();
  });
  backdrop.addEventListener('click', closeMenu);
  if (closeBtn) closeBtn.addEventListener('click', closeMenu);
  panel.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', closeMenu);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeMenu();
  });
}

function loadInclude(mount) {
  var name = mount.getAttribute('data-include');
  return fetch('/partials/' + name + '.html')
    .then(function (res) { return res.text(); })
    .then(function (html) { mount.outerHTML = html; })
    .catch(function () {
      mount.innerHTML = '<!-- failed to load ' + name + ' partial -->';
    });
}

function renderAnnouncement() {
  var bar = document.getElementById('announceBar');
  if (!bar) return;
  var evt = window.CURRENT_EVENT;
  if (!evt || !evt.active || !evt.text) return;
  document.getElementById('announceLink').setAttribute('href', evt.eventPageUrl || '/happening/');
  var itemHTML = '<div class="announce-item">' + evt.text + '</div>';
  document.getElementById('announceMarquee').innerHTML = itemHTML + itemHTML;
  bar.hidden = false;
}

document.addEventListener('DOMContentLoaded', function () {
  var mounts = [].slice.call(document.querySelectorAll('[data-include]'));
  Promise.all(mounts.map(loadInclude)).then(function () {
    markActiveLinks();
    wireMobileNav();
    renderAnnouncement();
  });
});
