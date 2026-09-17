import { gsap, ScrollTrigger, $, $$ } from '../shared/core.js';

export function initSidebar() {
  const track = $('.hero-track');
  const sidebar = $('.sidebar');
  const portrait = $('.portrait');

  // Portrait fades into a blurred glow that stays behind the whole page
  gsap.fromTo(
    '.portrait-img',
    { filter: 'blur(0px)', opacity: 1 },
    { filter: 'blur(90px)', opacity: 0.3, ease: 'none', scrollTrigger: { trigger: track, start: 'top top', end: '70% top', scrub: 1 } }
  );

  // In the hero the portrait sits between the wordmark and the sidebar cards; after that it
  // moves behind the page content. Both positions are fixed, so the swap is invisible.
  ScrollTrigger.create({
    trigger: track,
    start: '50% top',
    onEnter: () => document.body.insertBefore(portrait, sidebar),
    onLeaveBack: () => sidebar.prepend(portrait),
  });

  // Sidebar goes above the page content once the hero has handed over
  ScrollTrigger.create({
    trigger: track,
    start: '53% top',
    onEnter: () => sidebar.classList.add('is-front'),
    onLeaveBack: () => sidebar.classList.remove('is-front'),
  });

  initTheme();
  initActiveLink();
  initCopy();
}

/* Cards turn dark while a dark section passes behind them */
function initTheme() {
  const els = $$('[data-theme-el]');
  const setDark = (el, on) => el.classList.toggle('is-dark', on);

  $$('[data-dark]').forEach((section) => {
    ScrollTrigger.create({
      trigger: section,
      start: 'top bottom',
      end: 'bottom top',
      onUpdate: () => {
        const s = section.getBoundingClientRect();
        els.forEach((el) => {
          const r = el.getBoundingClientRect();
          const mid = r.top + r.height / 2;
          setDark(el, mid > s.top && mid < s.bottom);
        });
      },
      onLeave: () => els.forEach((el) => setDark(el, false)),
      onLeaveBack: () => els.forEach((el) => setDark(el, false)),
    });
  });
}

function initActiveLink() {
  const items = $$('.menu-item');
  items.forEach((item) => {
    const section = $('#' + item.dataset.section);
    if (!section) return;
    ScrollTrigger.create({
      trigger: section,
      start: 'top 50%',
      end: 'bottom 50%',
      onToggle: (self) => {
        if (!self.isActive) return;
        items.forEach((i) => i.classList.toggle('is-active', i === item));
      },
    });
  });
}

export function initCopy() {
  $$('[data-copy]').forEach((btn) => {
    const label = $('.email-toast-label', btn);
    let timer;
    btn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(btn.dataset.copy);
      } catch {
        return;
      }
      btn.classList.add('is-copied');
      if (label) label.textContent = 'Email copied';
      clearTimeout(timer);
      timer = setTimeout(() => {
        btn.classList.remove('is-copied');
        if (label) label.textContent = 'Copy to clipboard';
      }, 2000);
    });
  });
}
