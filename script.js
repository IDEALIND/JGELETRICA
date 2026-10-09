// JG ELÉTRICA — interações
(() => {
  const header = document.getElementById('header');
  const burger = document.getElementById('burger');
  const nav = document.getElementById('nav');
  const links = [...document.querySelectorAll('.nav__link')];

  // Header on scroll
  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 40);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // Mobile menu
  const toggleMenu = (open) => {
    const state = open ?? !nav.classList.contains('is-open');
    nav.classList.toggle('is-open', state);
    burger.classList.toggle('is-open', state);
    burger.setAttribute('aria-expanded', state);
    document.body.style.overflow = state ? 'hidden' : '';
  };
  burger.addEventListener('click', () => toggleMenu());
  nav.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => toggleMenu(false)));

  // Reveal on scroll (staggered)
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const siblings = [...e.target.parentElement.children].filter((c) => c.classList.contains('reveal'));
      e.target.style.transitionDelay = `${Math.max(0, siblings.indexOf(e.target)) * 90}ms`;
      e.target.classList.add('is-visible');
      revealObs.unobserve(e.target);
    });
  }, { threshold: 0.15 });
  document.querySelectorAll('.reveal').forEach((el) => revealObs.observe(el));

  // Active nav link by section
  const sections = links.map((l) => document.querySelector(l.getAttribute('href'))).filter(Boolean);
  const navObs = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      links.forEach((l) => l.classList.toggle('is-active', l.getAttribute('href') === `#${e.target.id}`));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  sections.forEach((s) => navObs.observe(s));

  // Animated counters
  const countObs = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = +el.dataset.count;
      const suffix = el.dataset.suffix || '';
      const start = performance.now();
      const dur = 1800;
      const tick = (now) => {
        const p = Math.min((now - start) / dur, 1);
        const val = Math.round(target * (1 - Math.pow(1 - p, 3)));
        el.textContent = val.toLocaleString('pt-BR') + suffix;
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      countObs.unobserve(el);
    });
  }, { threshold: 0.6 });
  document.querySelectorAll('[data-count]').forEach((el) => countObs.observe(el));

  // Card spotlight following cursor
  document.querySelectorAll('.card').forEach((card) => {
    card.addEventListener('pointermove', (ev) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${ev.clientX - r.left}px`);
      card.style.setProperty('--my', `${ev.clientY - r.top}px`);
    });
  });

  // Electric sparks in hero
  const sparks = document.querySelector('.hero__sparks');
  if (sparks && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    for (let i = 0; i < 26; i++) {
      const s = document.createElement('i');
      s.style.left = `${40 + Math.random() * 60}%`;
      s.style.animationDuration = `${6 + Math.random() * 8}s`;
      s.style.animationDelay = `${Math.random() * 8}s`;
      s.style.setProperty('--dx', `${(Math.random() - 0.5) * 160}px`);
      const size = 1 + Math.random() * 3;
      s.style.width = s.style.height = `${size}px`;
      sparks.appendChild(s);
    }
  }

  // Year
  document.getElementById('year').textContent = new Date().getFullYear();
})();
