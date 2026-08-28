/* =========================================================
   REVIVE ORGANISATION — GENERIC SCROLL-REVEAL
   Any element with [data-reveal] fades/slides/sharpens into
   view (see [data-reveal] rules in style.css) as it scrolls
   into the viewport, replaying every time it re-enters — same
   behaviour as the homepage's Three Verticals cards. Elements
   sharing a data-reveal-group value are staggered in DOM order;
   elements with no group each animate independently.
   ========================================================= */

(function () {
  var els = document.querySelectorAll('[data-reveal]');
  if (!els.length || !('IntersectionObserver' in window)) return;

  var STAGGER_MS = 180;
  var groups = {};
  els.forEach(function (el, i) {
    var key = el.getAttribute('data-reveal-group') || ('__solo' + i);
    (groups[key] = groups[key] || []).push(el);
  });

  Object.keys(groups).forEach(function (key) {
    var members = groups[key];
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var idx = members.indexOf(entry.target);
        if (entry.isIntersecting && entry.intersectionRatio >= 0.35) {
          setTimeout(function () { entry.target.classList.add('reveal-visible'); }, idx * STAGGER_MS);
        } else if (!entry.isIntersecting) {
          entry.target.classList.remove('reveal-visible');
        }
      });
    }, { threshold: [0, 0.35] });
    members.forEach(function (el) { observer.observe(el); });
  });
})();
