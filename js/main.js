// Menu mobile
const toggle = document.querySelector('.nav-toggle');
const menu = document.getElementById('menu');
if (toggle && menu) {
  toggle.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });
  menu.addEventListener('click', (e) => {
    if (e.target.closest('a')) { menu.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); }
  });
}

// Apparition douce au défilement
document.documentElement.classList.add('js');
const items = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.1 });
  items.forEach((el) => io.observe(el));
} else {
  items.forEach((el) => el.classList.add('in'));
}

// Filtre des réalisations
const chips = document.querySelectorAll('.chip[data-filter]');
const shots = document.querySelectorAll('.gallery .photo');
chips.forEach((chip) => {
  chip.addEventListener('click', () => {
    const f = chip.dataset.filter;
    chips.forEach((c) => c.setAttribute('aria-pressed', String(c === chip)));
    shots.forEach((s) => { s.hidden = f !== 'all' && s.dataset.cat !== f; s.classList.add('in'); });
  });
});

// Formulaire de devis : l'envoi réel sera branché à la mise en ligne
const form = document.getElementById('devis-form');
const statusEl = document.getElementById('form-status');
if (form && statusEl) {
  // Présélection du type de travaux selon la page d'où vient le visiteur (contact.html#toiture)
  const preselect = () => {
    const wanted = location.hash.replace('#', '');
    if ([...form.type.options].some((o) => o.value && o.value === wanted)) form.type.value = wanted;
  };
  preselect();
  window.addEventListener('hashchange', preselect);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const missing = [form.nom, form.tel, form.type].filter((f) => !f.value.trim());
    [form.nom, form.tel, form.type].forEach((f) => f.setAttribute('aria-invalid', String(missing.includes(f))));
    if (missing.length) {
      statusEl.textContent = 'Indiquez votre nom, votre téléphone et le type de travaux pour être rappelé.';
      missing[0].focus();
      return;
    }
    statusEl.textContent = "Maquette : l'envoi du formulaire sera activé à la mise en ligne du site.";
  });
}
