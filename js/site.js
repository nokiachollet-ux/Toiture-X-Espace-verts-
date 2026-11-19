/* RF Rénovation : script commun aux pages refaites.
   Menu mobile, navigation locale, toit généré, formulaire, carrousel, comparateur avant/après
   et animations GSAP + ScrollTrigger. Chaque bloc ne s'exécute que si la page contient
   les éléments concernés. Sans JavaScript ou sans GSAP, tout le contenu reste visible. */
(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  document.documentElement.classList.add('js');

  /* ---------- Menu mobile ---------- */
  const burger = $('.burger');
  const menu = $('#menu');
  const setMenu = (open) => {
    if (!menu || !burger) return;
    menu.hidden = !open;
    burger.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
    if (open) { const a = $('nav a', menu); a && a.focus(); }
  };
  if (burger && menu) {
    burger.addEventListener('click', () => setMenu(menu.hidden));
    $('.menu-close', menu).addEventListener('click', () => { setMenu(false); burger.focus(); });
    menu.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !menu.hidden) { setMenu(false); burger.focus(); } });
  }

  /* ---------- En-tête collant : filet au défilement ---------- */
  const gnavEl = $('#gnav');
  const onScroll = () => gnavEl && gnavEl.classList.toggle('is-stuck', window.scrollY > 4);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Toit de l'accueil : ardoises posées rang par rang (de l'égout au faîtage) ---------- */
  const slates = $('#slates');
  if (slates) {
    const NS = 'http://www.w3.org/2000/svg';
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
    const base = $('#roof-base');
    base && base.setAttribute('fill', '#22272d');
  }

  /* ---------- Formulaire de devis (maquette : aucun envoi) ---------- */
  const form = $('#devis-form');
  if (form) {
    const typeSel = $('#f-type', form);
    // contact.html#couverture présélectionne « couverture » : les value des <option> = ancres des services
    const h = decodeURIComponent(location.hash.replace('#', ''));
    if (h && /^[a-z-]+$/.test(h) && $(`option[value="${h}"]`, typeSel)) typeSel.value = h;
    const setErr = (id, msg) => {
      const field = $('#f-' + id, form).closest('.field');
      field.classList.toggle('has-error', !!msg);
      const e = $('#e-' + id, form);
      if (e) e.textContent = msg || '';
    };
    form.addEventListener('submit', (ev) => {
      ev.preventDefault();
      const v = (id) => $('#f-' + id, form).value.trim();
      let ok = true;
      const check = (id, cond, msg) => { setErr(id, cond ? '' : msg); if (!cond) ok = false; };
      check('nom', v('nom').length > 1, 'Indiquez votre nom.');
      check('tel', /^(?:\+33\s?|0)[1-9](?:[\s.-]?\d{2}){4}$/.test(v('tel')), 'Indiquez un numéro à 10 chiffres, par exemple 06 12 34 56 78.');
      check('email', !v('email') || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v('email')), "Cette adresse e-mail n'est pas valide.");
      check('type', !!v('type'), 'Choisissez le type de travaux.');
      check('message', v('message').length >= 10, 'Décrivez votre demande en quelques mots.');
      if (!ok) { const first = $('.has-error input, .has-error select, .has-error textarea', form); first && first.focus(); return; }
      const done = document.createElement('div');
      done.className = 'form-done';
      done.setAttribute('role', 'status');
      const t = document.createElement('h3');
      t.textContent = 'Merci, ' + v('nom') + '.';
      const p = document.createElement('p');
      p.textContent = "Votre demande est prête. L'envoi en ligne n'est pas encore branché : en attendant, appelez-nous au 05 00 00 00 00.";
      done.append(t, p);
      form.replaceChildren(done);
    });
  }

  /* ---------- Carrousel des prestations (accueil) ---------- */
  const vp = $('.hl-viewport');
  const cards = $$('.card');
  const dots = $$('.dot');
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
        window.scrollTo({ top: pinnedST.start + (pinnedST.end - pinnedST.start) * i / (cards.length - 1), behavior: 'smooth' });
      } else {
        const max = vp.scrollWidth - vp.clientWidth;
        vp.scrollTo({ left: max * i / (cards.length - 1), behavior: 'smooth' });
      }
    }));
  }

  /* ---------- Comparateur avant / après (curseur) ---------- */
  const setCut = (ba, v) => { ba.style.setProperty('--cut', v + '%'); };
  $$('.ba-range').forEach((ba) => {
    const input = $('input[type="range"]', ba);
    input.addEventListener('input', () => setCut(ba, input.value));
    setCut(ba, input.value);
  });

  /* ---------- Animations GSAP ---------- */
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!window.gsap || !window.ScrollTrigger || reduce) {
    $$('[data-fix]').forEach((el) => el.classList.add('is-fixed'));
    return;
  }
  gsap.registerPlugin(ScrollTrigger);
  const E = 'power3.out';
  const has = (s) => $$(s).length > 0;
  const once = (trigger, start = 'top 85%') => ({ trigger, start, once: true });
  const rise = (sel, trigger, start, extra = {}) => {
    if (!has(sel)) return;
    gsap.from(sel, { y: 34, opacity: 0, duration: .9, stagger: .09, ease: E, ...extra, scrollTrigger: once(trigger || sel, start) });
  };

  /* Entrée de page */
  const intro = gsap.timeline({ defaults: { ease: E } });
  // clearProps : aucune transformation ne doit rester sur l'en-tête collant
  intro.from('.gnav-in, .lnav-in', { y: -14, opacity: 0, duration: .8, stagger: .08, clearProps: 'transform,opacity' });
  if (has('.hero')) {
    // Accueil : titre révélé ligne à ligne, puis le toit se couvre rang par rang
    intro
      .from('.hero .kicker', { y: 18, opacity: 0, duration: .8 }, .15)
      .from('.hero .hero-title .line > span', { yPercent: 115, duration: 1.15, stagger: .13, ease: 'power4.out' }, .25)
      .from('.hero .hero-sub, .hero .hero-ctas', { y: 22, opacity: 0, duration: .9, stagger: .1 }, .7)
      .from('.roof .walls', { y: 50, opacity: 0, duration: 1.1 }, .75)
      .from('.roof .course', { y: -28, opacity: 0, duration: .55, stagger: .035, ease: 'power2.out' }, 1.0)
      .from('.roof .hips, .roof .gutter', { opacity: 0, duration: .6 }, 1.6)
      .from('.roof .ridge', { scaleX: 0, transformOrigin: '50% 50%', duration: .8 }, 1.75)
      .from('.roof .dormer', { y: 34, opacity: 0, duration: .8, stagger: .12 }, 1.7)
      .from('.roof .chimney', { y: 70, duration: .9 }, 1.8)
      .from('.callout', { y: 26, opacity: 0, scale: .96, duration: .9 }, 2.1);
    const heroST = { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true };
    gsap.to('.hero-copy', { yPercent: -22, opacity: .15, ease: 'none', scrollTrigger: { ...heroST } });
    gsap.to('.roof', { scale: 1.12, yPercent: -4, transformOrigin: '50% 35%', ease: 'none', scrollTrigger: { ...heroST } });
    gsap.to('.callout-wrap', { y: -50, ease: 'none', scrollTrigger: { ...heroST } });
  }
  if (has('.phero')) {
    // Pages intérieures : même révélation du titre, puis le visuel
    intro
      .from('.phero .kicker', { y: 18, opacity: 0, duration: .8 }, .15)
      .from('.phero .hero-title .line > span', { yPercent: 115, duration: 1.1, stagger: .12, ease: 'power4.out' }, .25)
      .from('.phero .hero-sub, .phero .hero-ctas', { y: 22, opacity: 0, duration: .9, stagger: .1 }, .65);
    if (has('.phero-media')) {
      intro.from('.phero-media .frame', { y: 70, opacity: 0, scale: .97, duration: 1.2 }, .8);
      if (has('.phero-media [data-rise]')) intro.from('.phero-media [data-rise]', { y: 90, opacity: 0, duration: 1.1, stagger: .12 }, 1.0);
      const st = { trigger: '.phero-media', start: 'top 80%', end: 'bottom top', scrub: true };
      $$('.phero-media [data-depth]').forEach((g) => {
        gsap.to(g, { y: () => -parseFloat(g.dataset.depth) * 70, ease: 'none', scrollTrigger: { ...st } });
      });
      gsap.to('.phero-copy', { yPercent: -18, opacity: .3, ease: 'none', scrollTrigger: { trigger: '.phero', start: 'top top', end: 'bottom top', scrub: true } });
    }
  }

  /* Texte qui s'allume mot à mot */
  $$('[data-words]').forEach((st) => {
    const words = st.textContent.trim().split(/\s+/);
    st.textContent = '';
    words.forEach((w, i) => {
      const s = document.createElement('span');
      s.className = 'w'; s.textContent = w;
      st.appendChild(s);
      if (i < words.length - 1) st.appendChild(document.createTextNode(' '));
    });
    gsap.fromTo($$('.w', st), { opacity: .16 }, {
      opacity: 1, stagger: .1, ease: 'none',
      scrollTrigger: { trigger: st, start: 'top 82%', end: 'bottom 48%', scrub: true }
    });
  });
  rise('.statement .link-chev', '.statement .link-chev', 'top 92%');
  rise('.hl-head > *', '.highlights', 'top 80%');

  /* Anatomie : les couches se séparent, de la couverture vers la charpente */
  const anatomyTl = () => {
    const tl = gsap.timeline({ defaults: { ease: 'power2.inOut' } });
    tl.fromTo('.layer', { y: (i) => (1.5 - i) * 14 }, { y: (i) => (1.5 - i) * 112, duration: 1.2, stagger: { each: .16, from: 'end' } }, 0)
      .fromTo('.stack-inner', { rotate: -4 }, { rotate: 0, duration: 1.4 }, 0)
      .fromTo('.anat-labels li', { opacity: .28, x: -10 }, { opacity: 1, x: 0, duration: .35, stagger: .22 }, .15)
      .to({}, { duration: .35 });
    return tl;
  };

  const mm = gsap.matchMedia();
  mm.add('(min-width: 821px)', () => {
    if (vp) {
      // Prestations : défilement horizontal épinglé
      const track = $('.hl-track');
      vp.classList.add('is-pinned');
      const dist = () => Math.max(0, track.scrollWidth - document.documentElement.clientWidth);
      pinnedST = ScrollTrigger.create({
        trigger: '.highlights', start: 'top top', end: () => '+=' + dist(),
        pin: true, scrub: .6, invalidateOnRefresh: true,
        animation: gsap.to(track, { x: () => -dist(), ease: 'none' }),
        onUpdate: (s) => setActive(Math.round(s.progress * (cards.length - 1)))
      });
    }
    if (has('.anatomy')) {
      ScrollTrigger.create({ trigger: '.anatomy', start: 'top top', end: '+=1300', pin: true, scrub: .6, animation: anatomyTl() });
    }
    return () => { if (vp) vp.classList.remove('is-pinned'); pinnedST = null; };
  });
  mm.add('(max-width: 820px)', () => {
    rise('.card', '.hl-track');
    if (has('.anatomy')) ScrollTrigger.create({ trigger: '.stack', start: 'top 90%', end: 'bottom 40%', scrub: .6, animation: anatomyTl() });
  });

  /* Blocs éditoriaux (matériaux, services) : l'image entre par la droite, texture en parallaxe */
  $$('.mat').forEach((m) => {
    const media = $('.mat-media', m);
    gsap.fromTo(media, { clipPath: 'inset(8% 0% 8% 26% round 28px)', x: 90 }, {
      clipPath: 'inset(0% 0% 0% 0% round 28px)', x: 0, ease: 'none',
      scrollTrigger: { trigger: m, start: 'top 92%', end: 'top 30%', scrub: .5 }
    });
    gsap.fromTo($$('.mat-svg', m), { yPercent: -7 }, { yPercent: 7, ease: 'none', scrollTrigger: { trigger: m, start: 'top bottom', end: 'bottom top', scrub: true } });
    gsap.from($$('.mat-text > *', m), { y: 34, opacity: 0, duration: .9, stagger: .08, ease: E, scrollTrigger: once(m, 'top 78%') });
    const tag = $('.mat-tag', m);
    if (tag) gsap.from(tag, { y: 14, opacity: 0, duration: .7, ease: E, scrollTrigger: once(m, 'top 55%') });
  });

  /* Ardoise remise en place quand l'illustration devient visible */
  $$('[data-fix]').forEach((el) => ScrollTrigger.create({ trigger: el, start: 'top 65%', onEnter: () => el.classList.add('is-fixed') }));

  /* Démonstration du comparateur : le curseur balaie une fois l'image */
  $$('.ba-range').forEach((ba) => {
    const input = $('input[type="range"]', ba);
    const o = { v: 92 };
    gsap.to(o, {
      v: 34, duration: 1.8, ease: 'power2.inOut', scrollTrigger: once(ba, 'top 65%'),
      onStart: () => setCut(ba, o.v),
      onUpdate: () => { input.value = Math.round(o.v); setCut(ba, o.v); }
    });
  });

  /* Titres de section, tuiles, étapes, zone, contact */
  $$('[data-reveal]').forEach((el) => gsap.from(el, { y: 34, opacity: 0, duration: .9, ease: E, scrollTrigger: once(el, 'top 88%') }));
  $$('[data-reveal-group]').forEach((g) => gsap.from(g.children, { y: 40, opacity: 0, duration: .9, stagger: .1, ease: E, scrollTrigger: once(g, 'top 85%') }));
  $$('.proc-line span').forEach((l) => gsap.fromTo(l, { scaleX: 0 }, { scaleX: 1, ease: 'none', scrollTrigger: { trigger: l, start: 'top 85%', end: 'top 35%', scrub: true } }));
  $$('.steps').forEach((s) => gsap.from(s.children, { y: 40, opacity: 0, duration: .9, stagger: .12, ease: E, scrollTrigger: once(s) }));
  if (has('.depts')) {
    gsap.from('.dept', { y: 40, opacity: 0, duration: .9, stagger: .1, ease: E, scrollTrigger: once('.depts') });
    gsap.from('.dept-n > span', { yPercent: 105, duration: 1.1, stagger: .12, delay: .15, ease: 'power4.out', scrollTrigger: once('.depts') });
  }
  if (has('.communes li')) gsap.from('.communes li', { y: 14, opacity: 0, duration: .6, stagger: .025, ease: E, scrollTrigger: once('.communes', 'top 92%') });
  if (has('.contact')) {
    gsap.from('.contact-info > *', { y: 30, opacity: 0, duration: .9, stagger: .08, ease: E, scrollTrigger: once('.contact', 'top 78%') });
    gsap.from('.form', { y: 50, opacity: 0, duration: 1.1, ease: E, scrollTrigger: once('.contact', 'top 72%') });
  }

  /* Lien actif de la navigation locale (créés en dernier, après les épinglages) */
  $$('.lnav-links a[href^="#"]').forEach((a) => {
    const sec = $(a.getAttribute('href'));
    if (sec) ScrollTrigger.create({ trigger: sec, start: 'top 50%', end: 'bottom 50%', onToggle: (s) => a.classList.toggle('is-active', s.isActive) });
  });

  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => ScrollTrigger.refresh());
})();
