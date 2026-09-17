import { gsap, ScrollTrigger, $, $$ } from './core.js';

/* Pinned stage (CSS sticky) whose card track is scrubbed sideways by vertical scroll */
export function initWork() {
  const section = $('.work');
  const wrap = $('.work-track-wrap');
  const track = $('.work-track');
  if (!section) return;

  const distance = () => Math.max(0, track.scrollWidth - wrap.clientWidth);

  const move = gsap.to(track, {
    x: () => -distance(),
    ease: 'none',
    scrollTrigger: { trigger: section, start: 'top top', end: 'bottom bottom', scrub: 1, invalidateOnRefresh: true },
  });

  // Cards pop in: the visible ones together, the rest as they slide into view
  const cards = $$('.work-card', track);
  const edge = wrap.getBoundingClientRect().right;
  const visible = cards.filter((c) => c.getBoundingClientRect().left < edge);
  const offscreen = cards.filter((c) => !visible.includes(c));
  const from = { y: '10%', opacity: 0, scale: 0.6 };
  const to = { y: '0%', opacity: 1, scale: 1, duration: 1.1, ease: 'expo.out' };

  gsap.set(cards, from);
  ScrollTrigger.create({
    trigger: section,
    start: 'top 80%',
    once: true,
    onEnter: () => gsap.to(visible, { ...to, stagger: 0.1 }),
  });
  offscreen.forEach((card) => {
    gsap.to(card, {
      ...to,
      scrollTrigger: { trigger: card, containerAnimation: move, start: 'left 95%', toggleActions: 'play none none none' },
    });
  });

  initHoverMedia(cards);
}

/* Optional foreground/background videos: play on hover, rewind on leave */
export function initHoverMedia(cards = $$('.work-card')) {
  cards.forEach((card) => {
    const videos = $$('video', card);
    if (!videos.length) return;
    card.addEventListener('mouseenter', () => videos.forEach((v) => v.play().catch(() => {})));
    card.addEventListener('mouseleave', () =>
      videos.forEach((v) => {
        v.pause();
        v.currentTime = 0;
      })
    );
  });
}
