import { gsap, $, $$, lenis, splitLines } from '../shared/core.js';

/* Intro: the wordmark slides in from the right while its letters rise, parks in the
   hero, then the rest of the hero assembles around it. */
export function playIntro() {
  const html = document.documentElement;
  if (!html.classList.contains('is-loading')) return;

  const ghost = $('.hero-wordmark');
  const wordmark = $('.intro-wordmark');
  const letters = $$('.intro-letter');
  const brand = $('.brand');
  const g = ghost.getBoundingClientRect();

  wordmark.style.fontSize = getComputedStyle(ghost).fontSize;
  const centerX = (window.innerWidth - g.width) / 2;
  const centerY = (window.innerHeight - g.height) / 2;

  // ---- Initial states (applied before the page becomes visible) ----
  gsap.set(wordmark, { x: window.innerWidth, y: centerY, visibility: 'visible' });
  gsap.set(letters, { yPercent: 140 });
  gsap.set(brand, { autoAlpha: 0 });

  const portrait = $('.portrait');
  const titleLines = splitLines($('.hero-title'), false); // no mask: the blur must not be clipped
  const linkLines = $$('.menu-label .intro-line');
  const seps = $$('.hero-sep');
  const blurEls = ['stat1-bg', 'stat1-icon', 'stat1-text', 'stat2-bg', 'stat2-icon', 'stat2-text']
    .map((id) => $(`[data-morph="${id}"]`))
    .concat($('.traits-inner'));
  const buttons = $$('.sb-btn');
  const sideLines = [...splitLines($('.hero-side--left')), ...splitLines($('.hero-side--right'))];

  gsap.set(portrait, { autoAlpha: 0, scale: 0.88, filter: 'blur(20px)', transformOrigin: '50% 100%' });
  gsap.set(titleLines, { autoAlpha: 0, scale: 0.9, filter: 'blur(10px)' });
  gsap.set(linkLines, { yPercent: 100 });
  gsap.set(seps, { scaleY: 0 });
  gsap.set(blurEls, { autoAlpha: 0, filter: 'blur(8px)' });
  gsap.set(buttons, { autoAlpha: 0, scale: 0.94, filter: 'blur(10px)' });
  gsap.set(sideLines, { yPercent: 100, autoAlpha: 0, filter: 'blur(6px)' });

  lenis?.stop();
  html.classList.remove('is-loading');

  // ---- Timeline ----
  const tl = gsap.timeline({
    delay: 0.2,
    onComplete: () => {
      lenis?.start();
      // Only filter: clearing a transform prop would wipe the morph offsets too
      gsap.set([portrait, ...titleLines, ...buttons, ...blurEls], { clearProps: 'filter' });
      gsap.set(linkLines, { clearProps: 'transform' }); // hand hover back to CSS
    },
  });

  tl.to(wordmark, { x: centerX, duration: 1, ease: 'power3.inOut' }, 0)
    .to(letters, { yPercent: 0, duration: 0.9, stagger: 0.1, ease: 'power3.out' }, 0)
    .to(wordmark, { x: g.left, y: g.top, duration: 1, ease: 'power2.inOut' }, 1)
    .set(brand, { autoAlpha: 1 }, 2)
    .set(wordmark, { autoAlpha: 0 }, 2);

  const hero = 1.4;
  tl.to(portrait, { autoAlpha: 1, scale: 1, filter: 'blur(0px)', duration: 1.1, ease: 'power2.out' }, hero)
    .to(titleLines, { autoAlpha: 1, scale: 1, filter: 'blur(0px)', duration: 1, stagger: 0.1, ease: 'power2.out' }, hero + 0.3)
    .to(linkLines, { yPercent: 0, duration: 0.4, ease: 'power2.out' }, hero + 0.6)
    .to(seps, { scaleY: 1, duration: 0.2, ease: 'power2.out' }, hero + 0.6);

  blurEls.forEach((el, i) => {
    tl.to(el, { autoAlpha: 1, filter: 'blur(0px)', duration: 0.9, ease: 'power2.out' }, hero + 0.6 + i * 0.1);
  });

  tl.to(buttons, { autoAlpha: 1, scale: 1, filter: 'blur(0px)', duration: 0.8, stagger: 0.08, ease: 'power2.out' }, hero + 1.25)
    .to(sideLines, { yPercent: 0, autoAlpha: 1, filter: 'blur(0px)', duration: 0.7, stagger: 0.075, ease: 'power2.out' }, hero + 1.65);
}
