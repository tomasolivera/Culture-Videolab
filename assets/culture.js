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

// =====================================================================
// Movimiento: intro, portada viva, transición entre páginas y cinta
// =====================================================================
(function () {
  var root = document.documentElement;
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------- transición entre páginas ----------
  function go(url) {
    if (reduce) { location.href = url; return; }
    try { sessionStorage.setItem('cvPt', '1'); } catch (e) {}
    root.classList.add('pt-out');
    setTimeout(function () { location.href = url; }, 620);
  }
  window.cvGo = go;

  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href]');
    if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (a.target && a.target !== '_self') return;
    var url = new URL(a.href, location.href);
    if (url.origin !== location.origin || !/\.html$|\/$/.test(url.pathname)) return;
    if (url.pathname === location.pathname && url.hash) return;
    e.preventDefault();
    go(url.href);
  });

  // al llegar: las placas se abren
  if (root.classList.contains('pt-in')) {
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { root.classList.add('pt-go'); });
    });
    setTimeout(function () { root.classList.remove('pt-in', 'pt-go'); }, 1000);
  }
  // volver atrás con la caché del navegador: sacar la cortina
  window.addEventListener('pageshow', function (e) {
    if (e.persisted) root.classList.remove('pt-out', 'pt-in', 'pt-go');
  });

  // ---------- intro: el sol sale sobre el horizonte y la pantalla se abre ----------
  if (root.classList.contains('intro')) {
    var layer = document.createElement('div');
    layer.className = 'intro-layer';
    layer.setAttribute('aria-hidden', 'true');
    var scene =
      '<div class="intro-stage">' +
        '<div class="intro-sun"></div>' +
        '<div class="intro-horizon"></div>' +
        '<div class="intro-logo-wrap"><span class="logo intro-logo"></span></div>' +
        '<div class="intro-tag">Video <b>·</b> Experience</div>' +
      '</div>';
    layer.innerHTML =
      '<div class="intro-half top">' + scene + '</div>' +
      '<div class="intro-half bot">' + scene + '</div>' +
      '<span class="intro-skip">Saltar intro</span>';
    document.body.appendChild(layer);
    root.classList.add('intro-ready');

    var done = false;
    var open = function () {
      if (done) return;
      done = true;
      layer.classList.add('is-open');
      setTimeout(function () { root.classList.remove('intro'); }, 260);
      setTimeout(function () { layer.remove(); }, 1200);
    };
    var t = setTimeout(open, 2500);
    layer.addEventListener('click', function () { clearTimeout(t); open(); });
    window.addEventListener('keydown', function () { clearTimeout(t); open(); }, { once: true });
    try { sessionStorage.setItem('cvIntro', '1'); } catch (e) {}
  }

  if (reduce) return;

  // ---------- portada viva: el sol y el flyer siguen el mouse ----------
  var hero = document.querySelector('.hero');
  if (hero && matchMedia('(pointer: fine)').matches) {
    var tx = 0, ty = 0, cx = 0, cy = 0, raf = 0;
    var tick = function () {
      raf = 0;
      cx += (tx - cx) * 0.08;
      cy += (ty - cy) * 0.08;
      hero.style.setProperty('--mx', cx.toFixed(4));
      hero.style.setProperty('--my', cy.toFixed(4));
      if (Math.abs(tx - cx) > 0.001 || Math.abs(ty - cy) > 0.001) raf = requestAnimationFrame(tick);
    };
    window.addEventListener('pointermove', function (e) {
      if (window.scrollY > hero.offsetHeight) return;
      tx = (e.clientX / innerWidth) * 2 - 1;
      ty = (e.clientY / innerHeight) * 2 - 1;
      if (!raf) raf = requestAnimationFrame(tick);
    }, { passive: true });
  }

  // ---------- cinta: acelera con la velocidad del scroll ----------
  var track = document.querySelector('.ticker-track');
  if (track && track.getAnimations) {
    var anim = null, last = window.scrollY, rate = 1, target = 1, traf = 0;
    var step = function () {
      traf = 0;
      if (!anim) anim = track.getAnimations()[0];
      if (!anim) return;
      rate += (target - rate) * 0.12;
      target += (1 - target) * 0.08;
      anim.playbackRate = rate;
      if (Math.abs(rate - 1) > 0.01 || Math.abs(target - 1) > 0.01) traf = requestAnimationFrame(step);
      else anim.playbackRate = 1;
    };
    window.addEventListener('scroll', function () {
      var y = window.scrollY;
      target = Math.min(6, 1 + Math.abs(y - last) * 0.12);
      last = y;
      if (!traf) traf = requestAnimationFrame(step);
    }, { passive: true });
  }
})();
