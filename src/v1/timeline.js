import { gsap, $, $$, isDesktop } from '../shared/core.js';

export function initTimeline() {
  const timeline = $('.timeline');
  if (!timeline) return;
  const cards = $$('.tl-card', timeline);

  if (isDesktop()) drawCurve(timeline);

  cards.forEach((card) => {
    const tl = gsap.timeline({
      scrollTrigger: { trigger: card, start: 'top 80%', toggleActions: 'play none none reverse' },
    });
    tl.fromTo($('.tl-body', card), { y: '10%', opacity: 0, scale: 0.6 }, { y: '0%', opacity: 1, scale: 1, duration: 1.1, ease: 'expo.out' }, 0.3)
      .fromTo($('.tl-line', card), { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.5, ease: 'expo.out' }, 0.2)
      .fromTo($('.tl-dot', card), { scale: 0 }, { scale: 1, duration: 0.8, ease: 'back.out(2.5)' }, 0.5);
  });

  // Read-more popups
  const close = () => cards.forEach((c) => c.classList.remove('is-open'));
  cards.forEach((card) => {
    $('.tl-more', card).addEventListener('click', (e) => {
      e.stopPropagation();
      close();
      card.classList.add('is-open');
    });
    $('.tl-close', card).addEventListener('click', (e) => {
      e.stopPropagation();
      close();
    });
    $('.tl-popup', card).addEventListener('click', (e) => e.stopPropagation());
  });
  document.addEventListener('click', close);
  document.addEventListener('keydown', (e) => e.key === 'Escape' && close());
}

/* Dashed curve through every card's dot, revealed top-to-bottom while scrolling */
function drawCurve(timeline) {
  const svg = $('.timeline-curve', timeline);
  const path = $('.timeline-path', timeline);
  const box = timeline.getBoundingClientRect();
  const pts = $$('.tl-dot', timeline).map((dot) => {
    const r = dot.getBoundingClientRect();
    return { x: r.left + r.width / 2 - box.left, y: r.top + r.height / 2 - box.top };
  });
  if (pts.length < 2) return;

  svg.setAttribute('viewBox', `0 0 ${box.width} ${box.height}`);

  // Vertical tangents at each dot give the soft S-curves between cards
  let d = `M${pts[0].x},${pts[0].y}`;
  for (let i = 1; i < pts.length; i++) {
    const a = pts[i - 1];
    const b = pts[i];
    const k = (b.y - a.y) * 0.55;
    d += ` C${a.x},${a.y + k} ${b.x},${b.y - k} ${b.x},${b.y}`;
  }
  path.setAttribute('d', d);

  const top = (pts[0].y / box.height) * 100;
  gsap.fromTo(
    svg,
    { clipPath: `inset(0% 0% ${100 - top}% 0%)` },
    {
      clipPath: 'inset(0% 0% 0% 0%)',
      ease: 'none',
      scrollTrigger: { trigger: timeline, start: 'top 60%', end: 'bottom 70%', scrub: 1 },
    }
  );
}
