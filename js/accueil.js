/* Page d'accueil : menu, toit généré, formulaire, carrousel et animations GSAP + ScrollTrigger. */
(() => {
  const root = document.documentElement;
  root.classList.add('js');

  /* ---------- Menu mobile ---------- */
  const burger = document.querySelector('.burger');
  const menu = document.getElementById('menu');
  const setMenu = (open) => {
    if (!menu) return;
    menu.hidden = !open;
    burger.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
    if (open) { const a = menu.querySelector('nav a'); a && a.focus(); }
  };
  burger && burger.addEventListener('click', () => setMenu(menu.hidden));
  menu && menu.querySelector('.menu-close').addEventListener('click', () => { setMenu(false); burger.focus(); });
  menu && menu.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && menu && !menu.hidden) { setMenu(false); burger.focus(); } });

  /* ---------- Navigation locale : filet au défilement ---------- */
  const lnav = document.getElementById('lnav');
  const gnavH = 44;
  const onScroll = () => lnav && lnav.classList.toggle('is-stuck', window.scrollY > gnavH + 4);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Toit : ardoises posées rang par rang (de l'égout au faîtage) ---------- */
  const NS = 'http://www.w3.org/2000/svg';
  const slates = document.getElementById('slates');
  if (slates) {
    const tones = ['#46505c', '#4b5562', '#414a55', '#4f5966', '#3e4651', '#485260', '#525c69'];
    const W = 24, H = 15, TOP = 100, BOTTOM = 440;
    let seed = 11;
    const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    let row = 0;
    for (let y = BOTTOM - H; y > TOP - H; y -= H, row++) {
      const g = document.createElementNS(NS, 'g');
      g.setAttribute('class', 'course');
      const off = row % 2 ? W / 2 : 0;
      for (let x = 100 - off - W; x < 905; x += W) {
        const r = document.createElementNS(NS, 'rect');
        r.setAttribute('x', (x + 0.8).toFixed(1));
        r.setAttribute('y', y);
        r.setAttribute('width', W - 1.6);
        r.setAttribute('height', H - 1.4);
        r.setAttribute('rx', 1.6);
        r.setAttribute('fill', tones[Math.floor(rnd() * tones.length)]);
        g.appendChild(r);
      }
      slates.appendChild(g);
    }
    document.getElementById('roof-base').setAttribute('fill', '#22272d');
  }

  /* ---------- Formulaire (maquette : aucun envoi) ---------- */
  const form = document.getElementById('devis-form');
  if (form) {
    const typeSel = form.querySelector('#f-type');
    const h = location.hash.replace('#', '');
    if (h && typeSel.querySelector(`option[value="${CSS.escape(h)}"]`)) typeSel.value = h;
    const setErr = (id, msg) => {
      const f = form.querySelector('#f-' + id).closest('.field');
      f.classList.toggle('has-error', !!msg);
      const e = form.querySelector('#e-' + id);
      if (e) e.textContent = msg || '';
    };
    form.addEventListener('submit', (ev) => {
      ev.preventDefault();
      const v = (id) => form.querySelector('#f-' + id).value.trim();
      let ok = true;
      const check = (id, cond, msg) => { setErr(id, cond ? '' : msg); if (!cond) ok = false; };
      check('nom', v('nom').length > 1, 'Indiquez votre nom.');
      check('tel', /^(?:\+33\s?|0)[1-9](?:[\s.-]?\d{2}){4}$/.test(v('tel')), 'Indiquez un numéro à 10 chiffres, par exemple 06 12 34 56 78.');
      check('email', !v('email') || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v('email')), "Cette adresse e-mail n'est pas valide.");
      check('type', !!v('type'), 'Choisissez le type de travaux.');
      check('message', v('message').length >= 10, 'Décrivez votre demande en quelques mots.');
      if (!ok) { const first = form.querySelector('.has-error input, .has-error select, .has-error textarea'); first && first.focus(); return; }
      form.innerHTML = '<div class="form-done" role="status"><h3>Merci, ' + v('nom').replace(/[<>&"]/g, '') + '.</h3><p>Votre demande est prête. Sur cette maquette, rien n’est encore envoyé : l’envoi sera branché à la mise en ligne.</p></div>';
    });
  }

  /* ---------- Carrousel des prestations ---------- */
  const vp = document.querySelector('.hl-viewport');
  const cards = Array.from(document.querySelectorAll('.card'));
  const dots = Array.from(document.querySelectorAll('.dot'));
  let pinnedST = null;
  const setActive = (i) => dots.forEach((d, k) => { d.classList.toggle('is-active', k === i); d.setAttribute('aria-current', k === i ? 'true' : 'false'); });
  if (vp) {
    vp.addEventListener('scroll', () => {
      if (vp.classList.contains('is-pinned')) return;
      const max = vp.scrollWidth - vp.clientWidth;
      setActive(Math.round((max > 0 ? vp.scrollLeft / max : 0) * (cards.length - 1)));
    }, { passive: true });
    dots.forEach((d, i) => d.addEventListener('click', () => {
      if (pinnedST) {
        const y = pinnedST.start + (pinnedST.end - pinnedST.start) * i / (cards.length - 1);
        window.scrollTo({ top: y, behavior: 'smooth' });
      } else {
        const max = vp.scrollWidth - vp.clientWidth;
        vp.scrollTo({ left: max * i / (cards.length - 1), behavior: 'smooth' });
      }
    }));
  }

  /* ---------- Animations GSAP ---------- */
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!window.gsap || !window.ScrollTrigger || reduce) return;
  gsap.registerPlugin(ScrollTrigger);
  const E = 'power3.out';

  // Entrée : texte révélé ligne à ligne, puis le toit se couvre rang par rang
  const intro = gsap.timeline({ defaults: { ease: E } });
  intro
    .from('.gnav, .lnav', { y: -14, opacity: 0, duration: .8, stagger: .08 })
    .from('.hero .kicker', { y: 18, opacity: 0, duration: .8 }, .15)
    .from('.hero-title .line > span', { yPercent: 115, duration: 1.15, stagger: .13, ease: 'power4.out' }, .25)
    .from('.hero-sub, .hero-ctas', { y: 22, opacity: 0, duration: .9, stagger: .1 }, .7)
    .from('.roof .walls', { y: 50, opacity: 0, duration: 1.1 }, .75)
    .from('.roof .course', { y: -28, opacity: 0, duration: .55, stagger: .035, ease: 'power2.out' }, 1.0)
    .from('.roof .hips, .roof .gutter', { opacity: 0, duration: .6 }, 1.6)
    .from('.roof .ridge', { scaleX: 0, transformOrigin: '50% 50%', duration: .8 }, 1.75)
    .from('.roof .dormer', { y: 34, opacity: 0, duration: .8, stagger: .12 }, 1.7)
    .from('.roof .chimney', { y: 70, duration: .9 }, 1.8)
    .from('.callout', { y: 26, opacity: 0, scale: .96, duration: .9 }, 2.1);

  // Hero au défilement : le texte s'efface, le toit avance
  const heroST = { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true };
  gsap.to('.hero-copy', { yPercent: -22, opacity: .15, ease: 'none', scrollTrigger: heroST });
  gsap.to('.roof', { scale: 1.12, yPercent: -4, transformOrigin: '50% 35%', ease: 'none', scrollTrigger: { ...heroST } });
  gsap.to('.callout-wrap', { y: -50, ease: 'none', scrollTrigger: { ...heroST } });

  // Manifeste : les mots s'allument au fil de la lecture
  const st = document.querySelector('[data-words]');
  if (st) {
    const words = st.textContent.trim().split(/\s+/);
    st.textContent = '';
    words.forEach((w, i) => {
      const s = document.createElement('span');
      s.className = 'w'; s.textContent = w;
      st.appendChild(s);
      if (i < words.length - 1) st.appendChild(document.createTextNode(' '));
    });
    gsap.fromTo(st.querySelectorAll('.w'), { opacity: .16 }, {
      opacity: 1, stagger: .1, ease: 'none',
      scrollTrigger: { trigger: st, start: 'top 82%', end: 'bottom 48%', scrub: true }
    });
  }
  gsap.from('.statement .link-chev', { y: 16, opacity: 0, duration: .8, ease: E, scrollTrigger: { trigger: '.statement .link-chev', start: 'top 92%', once: true } });

  gsap.from('.hl-head > *', { y: 30, opacity: 0, duration: .9, stagger: .1, ease: E, scrollTrigger: { trigger: '.highlights', start: 'top 80%', once: true } });

  // Anatomie : les couches se séparent, de la couverture vers la charpente
  const anatomyTl = () => {
    const layers = gsap.utils.toArray('.layer');
    const labels = gsap.utils.toArray('.anat-labels li');
    const tl = gsap.timeline({ defaults: { ease: 'power2.inOut' } });
    tl.fromTo(layers, { y: (i) => (1.5 - i) * 14 }, { y: (i) => (1.5 - i) * 112, duration: 1.2, stagger: { each: .16, from: 'end' } }, 0)
      .fromTo('.stack-inner', { rotate: -4 }, { rotate: 0, duration: 1.4 }, 0)
      .fromTo(labels, { opacity: .28, x: -10 }, { opacity: 1, x: 0, duration: .35, stagger: .22 }, .15)
      .to({}, { duration: .35 });
    return tl;
  };

  const mm = gsap.matchMedia();
  mm.add('(min-width: 821px)', () => {
    // Prestations : défilement horizontal épinglé
    const track = document.querySelector('.hl-track');
    vp.classList.add('is-pinned');
    const dist = () => Math.max(0, track.scrollWidth - document.documentElement.clientWidth);
    const tween = gsap.to(track, { x: () => -dist(), ease: 'none' });
    pinnedST = ScrollTrigger.create({
      trigger: '.highlights', start: 'top top', end: () => '+=' + dist(),
      pin: true, scrub: .6, animation: tween, invalidateOnRefresh: true,
      onUpdate: (s) => setActive(Math.round(s.progress * (cards.length - 1)))
    });
    // Anatomie : section épinglée
    ScrollTrigger.create({ trigger: '.anatomy', start: 'top top+=52', end: '+=1300', pin: true, scrub: .6, animation: anatomyTl() });
    return () => { vp.classList.remove('is-pinned'); pinnedST = null; };
  });
  mm.add('(max-width: 820px)', () => {
    gsap.from('.card', { y: 40, opacity: 0, duration: .9, stagger: .08, ease: E, scrollTrigger: { trigger: '.hl-track', start: 'top 85%', once: true } });
    ScrollTrigger.create({ trigger: '.stack', start: 'top 90%', end: 'bottom 40%', scrub: .6, animation: anatomyTl() });
  });

  // Matériaux : l'image entre par la droite, texture en parallaxe
  gsap.utils.toArray('.mat').forEach((m) => {
    const media = m.querySelector('.mat-media');
    gsap.fromTo(media, { clipPath: 'inset(8% 0% 8% 26% round 28px)', x: 90 }, {
      clipPath: 'inset(0% 0% 0% 0% round 28px)', x: 0, ease: 'none',
      scrollTrigger: { trigger: m, start: 'top 92%', end: 'top 30%', scrub: .5 }
    });
    gsap.fromTo(m.querySelector('.mat-svg'), { yPercent: -7 }, { yPercent: 7, ease: 'none', scrollTrigger: { trigger: m, start: 'top bottom', end: 'bottom top', scrub: true } });
    gsap.from(m.querySelectorAll('.mat-text > *'), { y: 34, opacity: 0, duration: .9, stagger: .09, ease: E, scrollTrigger: { trigger: m, start: 'top 78%', once: true } });
    gsap.from(m.querySelector('.mat-tag'), { y: 14, opacity: 0, duration: .7, ease: E, scrollTrigger: { trigger: m, start: 'top 55%', once: true } });
  });
  gsap.from('#mat-title', { y: 30, opacity: 0, duration: .9, ease: E, scrollTrigger: { trigger: '#mat-title', start: 'top 88%', once: true } });

  // Méthode : la ligne se trace, les étapes suivent
  gsap.from('.process .section-title, .process .lead', { y: 30, opacity: 0, duration: .9, stagger: .1, ease: E, scrollTrigger: { trigger: '.process', start: 'top 78%', once: true } });
  gsap.fromTo('.proc-line span', { scaleX: 0 }, { scaleX: 1, ease: 'none', scrollTrigger: { trigger: '.proc-line', start: 'top 85%', end: 'top 35%', scrub: true } });
  gsap.from('.step', { y: 40, opacity: 0, duration: .9, stagger: .12, ease: E, scrollTrigger: { trigger: '.steps', start: 'top 85%', once: true } });

  // Zone
  gsap.from('.zone .section-title, .zone .lead', { y: 30, opacity: 0, duration: .9, stagger: .1, ease: E, scrollTrigger: { trigger: '.zone', start: 'top 78%', once: true } });
  gsap.from('.dept', { y: 40, opacity: 0, duration: .9, stagger: .1, ease: E, scrollTrigger: { trigger: '.depts', start: 'top 85%', once: true } });
  gsap.from('.dept-n > span', { yPercent: 105, duration: 1.1, stagger: .12, ease: 'power4.out', delay: .15, scrollTrigger: { trigger: '.depts', start: 'top 85%', once: true } });
  gsap.from('.communes li', { y: 14, opacity: 0, duration: .6, stagger: .025, ease: E, scrollTrigger: { trigger: '.communes', start: 'top 92%', once: true } });

  // Contact
  gsap.from('.contact-info > *', { y: 30, opacity: 0, duration: .9, stagger: .08, ease: E, scrollTrigger: { trigger: '.contact', start: 'top 78%', once: true } });
  gsap.from('.form', { y: 50, opacity: 0, duration: 1.1, ease: E, scrollTrigger: { trigger: '.contact', start: 'top 72%', once: true } });

  // Lien actif de la navigation locale (créés en dernier, après les épinglages)
  document.querySelectorAll('.lnav-links a').forEach((a) => {
    const sec = document.querySelector(a.getAttribute('href'));
    if (sec) ScrollTrigger.create({ trigger: sec, start: 'top 50%', end: 'bottom 50%', onToggle: (s) => a.classList.toggle('is-active', s.isActive) });
  });

  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => ScrollTrigger.refresh());
})();
