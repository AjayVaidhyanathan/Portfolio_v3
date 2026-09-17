import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger, SplitText);

export { gsap, ScrollTrigger, SplitText };

export const $ = (s, root = document) => root.querySelector(s);
export const $$ = (s, root = document) => [...root.querySelectorAll(s)];

export const isDesktop = () => window.innerWidth >= 768;
export const reducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- Smooth scroll ---------- */
export let lenis = null;

export function initScroll() {
  if (!reducedMotion()) {
    lenis = new Lenis({ lerp: 0.1 });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  $$('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const hash = a.getAttribute('href');
      const target = hash.length > 1 && $(hash);
      if (!target) return;
      e.preventDefault();
      const y = hash === '#home' ? 0 : target;
      if (lenis) lenis.scrollTo(y, { duration: 1.4 });
      else window.scrollTo({ top: y === 0 ? 0 : target.offsetTop, behavior: 'smooth' });
    });
  });
}

/* ---------- Line splitting (masked) ---------- */
export function splitLines(el, mask = true) {
  if (el._lines) return el._lines;
  const split = SplitText.create(el, { type: 'lines', linesClass: 'line', ...(mask && { mask: 'lines' }) });
  el._lines = split.lines;
  return split.lines;
}

/* ---------- Scroll-scrubbed attributes, timed against the hero ruler ----------
   data-scrub='{"from":{...},"to":{...},"start":"35% top","end":"39% top"}'
   data-scrub-lines — same, applied to the element's split lines          */
export function initScrubs() {
  const track = $('.hero-track');

  $$('[data-scrub]').forEach((el) => {
    const c = JSON.parse(el.dataset.scrub);
    gsap.fromTo(el, c.from, {
      ...c.to,
      ease: 'none',
      scrollTrigger: { trigger: track, start: c.start, end: c.end, scrub: 1 },
    });
  });

  $$('[data-scrub-lines]').forEach((el) => {
    const c = JSON.parse(el.dataset.scrubLines);
    gsap.fromTo(splitLines(el), c.from || { yPercent: 100 }, {
      ...(c.to || { yPercent: 0 }),
      ease: 'none',
      scrollTrigger: { trigger: track, start: c.start, end: c.end, scrub: 1 },
    });
  });
}

/* ---------- Scroll-triggered reveal presets ----------
   data-reveal="lines | label | pop | pop-small | fade"
   optional: data-trigger (selector), data-start, data-delay, data-once        */
const PRESETS = {
  lines: {
    from: { yPercent: 100 },
    to: { yPercent: 0, duration: 0.6, stagger: 0.1, delay: 0.3, ease: 'power2.out' },
  },
  label: {
    from: { width: 0, opacity: 0 },
    to: { width: 'auto', opacity: 1, duration: 0.7, ease: 'expo.inOut' },
  },
  pop: {
    from: { y: '10%', opacity: 0, scale: 0.6 },
    to: { y: '0%', opacity: 1, scale: 1, duration: 1.1, delay: 0.3, ease: 'expo.out' },
  },
  'pop-small': {
    from: { y: '10%', opacity: 0, scale: 0.6 },
    to: { y: '0%', opacity: 1, scale: 1, duration: 0.5, delay: 0.45, ease: 'expo.out' },
  },
  fade: {
    from: { opacity: 0 },
    to: { opacity: 1, duration: 1.4, delay: 0.8, ease: 'expo.out' },
  },
};

function triggerFor(el) {
  if (el.dataset.trigger) return $(el.dataset.trigger);
  return el.closest('[data-reveal-scope], .tl-card') || el;
}

export function initReveals() {
  $$('[data-reveal]').forEach((el) => {
    const preset = PRESETS[el.dataset.reveal];
    if (!preset) return;
    const inCard = el.closest('.tl-card');
    const targets = el.dataset.reveal === 'lines' ? splitLines(el) : el;
    const to = { ...preset.to };
    if (el.dataset.delay) to.delay = parseFloat(el.dataset.delay);
    const once = 'once' in el.dataset;

    gsap.fromTo(targets, preset.from, {
      ...to,
      scrollTrigger: {
        trigger: triggerFor(el),
        start: el.dataset.start || (inCard ? 'top 80%' : 'top 90%'),
        toggleActions: once ? 'play none none none' : 'play none none reverse',
      },
    });
  });

  // Rolling digit counters: every digit spins up to its value
  $$('[data-count]').forEach((el) => {
    const value = el.dataset.count;
    el.textContent = '';
    const tracks = [...value].map((d) => {
      const mask = document.createElement('span');
      mask.className = 'digit';
      const track = document.createElement('span');
      track.className = 'digit-track';
      for (let i = 0; i <= 9; i++) track.append(Object.assign(document.createElement('span'), { textContent: i }));
      mask.append(track);
      el.append(mask);
      return { track, digit: +d };
    });
    const tl = gsap.timeline({
      scrollTrigger: { trigger: triggerFor(el), start: 'top 80%', toggleActions: 'play none none reverse' },
    });
    tracks.forEach(({ track, digit }, i) => {
      tl.fromTo(track, { yPercent: 90 }, { yPercent: -digit * 10, duration: 1.5, ease: 'expo.out' }, 0.2 + i * 0.1);
    });
  });
}

/* Fit a single-line wordmark to a pixel width */
export function fitText(el, width) {
  el.style.fontSize = '100px';
  const w = el.getBoundingClientRect().width;
  el.style.fontSize = (100 * width) / w + 'px';
}

/* Layout depends on viewport width everywhere, so rebuild cleanly on width changes */
export function reloadOnResize() {
  let w = window.innerWidth;
  let timer;
  window.addEventListener('resize', () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      if (window.innerWidth === w) return; // mobile URL bar show/hide only changes height
      w = window.innerWidth;
      window.location.reload();
    }, 250);
  });
}
