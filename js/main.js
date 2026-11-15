// Menu mobile
const toggle = document.querySelector('.nav-toggle');
const menu = document.getElementById('menu');
if (toggle && menu) {
  toggle.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });
}

// Apparition douce au scroll
document.documentElement.classList.add('js');
const items = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.12 });
  items.forEach((el) => io.observe(el));
} else {
  items.forEach((el) => el.classList.add('in'));
}

// Parallaxe douce des crêtes et du soleil
(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const layers = document.querySelectorAll('.ridge[data-speed]');
  const sun = document.querySelector('.sun');
  const hero = document.querySelector('.hero');
  if (!hero || !layers.length) return;
  let ticking = false;
  function update() {
    const y = Math.min(window.scrollY, hero.offsetHeight);
    layers.forEach((l) => { l.style.transform = 'translateY(' + (y * l.dataset.speed) + 'px)'; });
    if (sun) sun.style.transform = 'translateY(' + (y * 0.3) + 'px)';
    ticking = false;
  }
  window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
})();
