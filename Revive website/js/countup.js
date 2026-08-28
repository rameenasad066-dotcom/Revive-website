/* =========================================================
   REVIVE ORGANISATION — SCROLL-TRIGGERED COUNT-UP
   Any element with [data-countup="1548"] holds its final text
   as a static fallback, then animates 0 -> target the first
   time it scrolls into view. Optional data-countup-suffix
   (e.g. "+") is appended after the number on every frame.
   ========================================================= */

(function () {
  var els = document.querySelectorAll('[data-countup]');
  if (!els.length) return;

  var DURATION = 1200;

  function easeOutExpo(t) {
    return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
  }

  function animate(el) {
    var target = parseInt(el.getAttribute('data-countup'), 10);
    var suffix = el.getAttribute('data-countup-suffix') || '';
    if (isNaN(target)) return;

    var start = null;
    function frame(ts) {
      if (!start) start = ts;
      var progress = Math.min((ts - start) / DURATION, 1);
      var value = Math.round(easeOutExpo(progress) * target);
      el.textContent = value.toLocaleString('en-US') + suffix;
      if (progress < 1) {
        requestAnimationFrame(frame);
      } else {
        el.textContent = target.toLocaleString('en-US') + suffix;
      }
    }
    requestAnimationFrame(frame);
  }

  if (!('IntersectionObserver' in window)) return;

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        animate(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  els.forEach(function (el) { observer.observe(el); });
})();
