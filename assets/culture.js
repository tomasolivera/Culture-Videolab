// Culture Videolab — comportamiento visual compartido (no toca la lógica de cada página)
(function () {
  // revelado al hacer scroll: [data-sr] recibe .in cuando entra en pantalla
  var items = document.querySelectorAll('[data-sr]');
  if (!('IntersectionObserver' in window)) {
    items.forEach(function (el) { el.classList.add('in'); });
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
  items.forEach(function (el) { io.observe(el); });
})();

// Portada: el logo del header aparece recién cuando el logo grande sale de pantalla
(function () {
  var heroLogo = document.querySelector('.hero-logo');
  if (!heroLogo || !('IntersectionObserver' in window)) return;
  var root = document.documentElement;
  root.classList.add('hero-logo-on');
  var header = document.querySelector('.site-header');
  var offset = header ? header.offsetHeight : 0;
  new IntersectionObserver(function (entries) {
    root.classList.toggle('hero-logo-on', entries[0].isIntersecting);
  }, { rootMargin: '-' + offset + 'px 0px 0px 0px', threshold: 0 }).observe(heroLogo);
})();
