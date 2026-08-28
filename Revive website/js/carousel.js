/* =========================================================
   REVIVE ORGANISATION — IMAGE CAROUSEL
   Auto-rotating crossfade carousel. Pass an array of image
   URLs; pass null/empty strings for slides that should show
   the shared placeholder art instead of a real photo.
   ========================================================= */

var PLACEHOLDER_ICON_SVG = '<svg viewBox="0 0 24 24" fill="none"><path d="M4 5C4 4.44772 4.44772 4 5 4H19C19.5523 4 20 4.44772 20 5V19C20 19.5523 19.5523 20 19 20H5C4.44772 20 4 19.5523 4 19V5Z" stroke="currentColor" stroke-width="1.5"/><circle cx="9" cy="10" r="1.5" stroke="currentColor" stroke-width="1.5"/><path d="M4 16L9 12L13 15L16 12L20 16" stroke="currentColor" stroke-width="1.5"/></svg>';

function initCarousel(root, images, options) {
  options = options || {};
  var intervalMs = options.interval || 1800;
  var label = options.placeholderLabel || 'Photo';

  if (!images || !images.length) images = [null];

  root.classList.add('carousel');
  root.innerHTML = images.map(function (src, i) {
    var activeClass = i === 0 ? ' active' : '';
    if (src) {
      return '<div class="carousel-slide' + activeClass + '"><img src="' + src + '" alt="" loading="' + (i === 0 ? 'eager' : 'lazy') + '"></div>';
    }
    return '<div class="carousel-slide' + activeClass + '"><div class="img-slot">' + PLACEHOLDER_ICON_SVG + label + ' ' + (i + 1) + '</div></div>';
  }).join('');

  if (images.length <= 1) return;

  var slides = root.querySelectorAll('.carousel-slide');
  var idx = 0;
  var timer = null;

  function next() {
    slides[idx].classList.remove('active');
    idx = (idx + 1) % slides.length;
    slides[idx].classList.add('active');
  }
  function start() {
    if (!timer) timer = setInterval(next, intervalMs);
  }
  function stop() {
    clearInterval(timer);
    timer = null;
  }

  start();
  root.addEventListener('mouseenter', stop);
  root.addEventListener('mouseleave', start);
}
