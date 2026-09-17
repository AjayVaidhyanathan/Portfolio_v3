import { $, $$ } from './core.js';

export function initFaq() {
  $$('.faq').forEach((item) => {
    // Keep <details> open so the body can animate; the class drives visibility
    item.open = true;
    const summary = $('summary', item);
    summary.setAttribute('aria-expanded', 'false');
    summary.addEventListener('click', (e) => {
      e.preventDefault();
      const open = item.classList.toggle('is-open');
      summary.setAttribute('aria-expanded', String(open));
    });
  });
}
