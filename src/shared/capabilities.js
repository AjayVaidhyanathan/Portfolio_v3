import { gsap, $, $$ } from './core.js';

export function initCapabilities() {
  const text = $('.capa-text');
  if (!text) return;

  // Split into word-wrapped chars (so lines still break between words), leaving chips intact
  const chars = [];
  [...text.childNodes].forEach((node) => {
    if (node.nodeType !== Node.TEXT_NODE) return;
    const frag = document.createDocumentFragment();
    node.textContent.split(/(\s+)/).forEach((part) => {
      if (!part) return;
      if (/^\s+$/.test(part)) return frag.append(' ');
      const word = document.createElement('span');
      word.style.cssText = 'display:inline-block;white-space:nowrap';
      [...part].forEach((ch) => {
        const c = document.createElement('span');
        c.className = 'char';
        c.textContent = ch;
        word.append(c);
        chars.push(c);
      });
      frag.append(word);
    });
    node.replaceWith(frag);
  });

  gsap.fromTo(
    chars,
    { color: '#e8dfd2', opacity: 0.1, y: 5 },
    {
      color: '#000',
      opacity: 1,
      y: 0,
      stagger: 0.1,
      ease: 'power1.out',
      scrollTrigger: { trigger: text, start: 'top 92%', end: 'top 25%', scrub: 1 },
    }
  );

  const chips = $$('.chip', text);
  chips.forEach((chip) => {
    gsap.fromTo(
      chip,
      { scale: 0.5, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        duration: 0.6,
        ease: 'back.out(1.6)',
        scrollTrigger: { trigger: text, start: chip.dataset.chipStart || 'top 80%', toggleActions: 'play none none reverse' },
      }
    );

    // Open towards the side with room
    const flip = () => {
      const open = window.innerWidth >= 768 ? window.innerWidth * 0.21 : Math.min(window.innerWidth * 0.78, 300);
      chip.classList.toggle('is-flip', chip.getBoundingClientRect().left + open > window.innerWidth - 16);
    };
    chip.addEventListener('mouseenter', flip);

    // Touch: tap to open, tap elsewhere to close
    chip.addEventListener('click', (e) => {
      if (matchMedia('(hover: hover)').matches) return;
      e.stopPropagation();
      flip();
      const open = !chip.classList.contains('is-open');
      chips.forEach((c) => c.classList.remove('is-open'));
      chip.classList.toggle('is-open', open);
    });
  });
  document.addEventListener('click', () => chips.forEach((c) => c.classList.remove('is-open')));
}
