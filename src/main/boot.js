import { gsap, ScrollTrigger, SplitText, $, $$, isDesktop, reducedMotion, initScroll, initReveals, splitLines, fitText, reloadOnResize } from '../shared/core.js';
import * as core from '../shared/core.js'; // namespace import: core.lenis is assigned after initScroll
import { initFaq } from '../shared/faq.js';
import { initWork } from '../shared/work.js';
import { initCapabilities } from '../shared/capabilities.js';
import { initChat } from '../shared/chat.js';
import { initAbout, initProcess, initServicesExtras, initQuotesExtras, initFaqExtras, whenNear } from './sections.js';

const motion = !reducedMotion();
const finePointer = matchMedia('(pointer: fine)').matches;
// Plain objects GSAP animates; the WebGL scenes read them once their chunk has loaded
const heroGL = { reveal: 0, y: 0, scale: 1, spin: 0 };
const footerGL = { rise: 0 };
// Start downloading the hero scene right away, in parallel with the fonts
const heroScene = motion ? import('./three-hero.js') : null;

/* Boots the whole page: fonts, scroll, every section's animations and the intro.
   Called once from App's mount effect (see App.jsx) instead of running at module load,
   since it needs the JSX to already be in the DOM before it can query for elements. */
export async function boot() {
  await Promise.all([
    document.fonts.load('900 100px "Schibsted Grotesk Variable"'),
    document.fonts.load('450 16px "General Sans"'),
  ]);
  await document.fonts.ready;
  window.scrollTo(0, 0);

  const gutter = parseFloat(getComputedStyle($('.wrap')).paddingLeft); // resolved --g (the var itself reads back as clamp())
  fitText($('.hero-wordmark'), window.innerWidth - gutter * 2);
  fitText($('.footer-wordmark'), window.innerWidth - gutter * 2);

  initScroll();
  initNav();
  initReveals();
  initFaq();
  initRail();
  initCapabilities();
  initChat();
  if (isDesktop()) initWork(); // same as v1: pinned sideways track on desktop, swipe rail on mobile

  if (motion) {
    initHeroScroll();
    initBand();
    initJourney();
    initAbout();
    initProcess();
    initPlans();
    initServicesExtras();
    initQuotesExtras();
    initFaqExtras();
    initFooter();
    initChars();
    initMagnets();
    initTilt();
    initBandVelocity();
    initProgress();
    initEntrances();
    if (finePointer) initCursor();
  }

  ScrollTrigger.sort(); // the process pin is created mid-page; refresh triggers in page order
  ScrollTrigger.refresh();
  if (motion) {
    playIntro();
    initGL();
  } else document.documentElement.classList.remove('is-loading');

  reloadOnResize();
}

/* ---------- Intro: ~1.6s, the page is usable almost immediately ---------- */
function playIntro() {
  const html = document.documentElement;
  const titleLines = splitLines($('.hero-title'));
  const leadLines = splitLines($('.hero-lead'));

  gsap.set('.hero-letter', { yPercent: 110 });
  gsap.set(titleLines, { yPercent: 105 });
  gsap.set(leadLines, { yPercent: 105 });
  gsap.set('.hero-portrait', { yPercent: 12, autoAlpha: 0 });
  gsap.set('.nav', { yPercent: -150 });
  gsap.set(heroGL, { reveal: 0, spin: -2.5 });
  gsap.set(['.hero-buttons .btn', '.hero-stat', '.hero-scroll'], { autoAlpha: 0, y: 20 });

  core.lenis?.stop();
  html.classList.remove('is-loading');

  gsap.timeline({ delay: 0.15, defaults: { ease: 'expo.out' }, onComplete: () => core.lenis?.start() })
    .to('.hero-letter', { yPercent: 0, duration: 1.3, stagger: 0.07 }, 0)
    .to('.hero-portrait', { yPercent: 0, autoAlpha: 1, duration: 1.4 }, 0.25)
    .to(titleLines, { yPercent: 0, duration: 1.1, stagger: 0.08 }, 0.45)
    .to('.nav', { yPercent: 0, duration: 1 }, 0.6)
    .to(leadLines, { yPercent: 0, duration: 1, stagger: 0.05 }, 0.7)
    .to(['.hero-buttons .btn', '.hero-stat', '.hero-scroll'], { autoAlpha: 1, y: 0, duration: 1, stagger: 0.06 }, 0.8);
}

/* ---------- Nav: hides on scroll down, returns on scroll up; pill follows hover / active section ---------- */
function initNav() {
  const nav = $('.nav');
  const links = $$('.nav-links a');
  const pill = $('.nav-pill');
  let active = null;

  const moveTo = (a) => {
    if (!a) return gsap.to(pill, { autoAlpha: 0, duration: 0.3 });
    gsap.to(pill, { x: a.offsetLeft, width: a.offsetWidth, autoAlpha: 1, duration: 0.5, ease: 'expo.out' });
  };
  links.forEach((a) => {
    a.addEventListener('mouseenter', () => moveTo(a));
    ScrollTrigger.create({
      trigger: a.getAttribute('href'),
      start: 'top 50%',
      end: 'bottom 50%',
      onToggle: (self) => {
        if (self.isActive) active = a;
        else if (active === a) active = null;
        links.forEach((l) => l.classList.toggle('is-active', l === active));
        moveTo(active);
      },
    });
  });
  $('.nav-links').addEventListener('mouseleave', () => moveTo(active));

  ScrollTrigger.create({
    start: 200,
    end: 'max',
    onUpdate: (self) => nav.classList.toggle('is-hidden', self.direction === 1),
    onLeaveBack: () => nav.classList.remove('is-hidden'),
  });
  // Dark sections flip the nav's glass to dark
  $$('.work, .process, .footer').forEach((section) =>
    ScrollTrigger.create({ trigger: section, start: 'top 40px', end: 'bottom 40px', toggleClass: { targets: nav, className: 'is-dark' } })
  );
}

/* ---------- Hero: letters drift at different speeds, content lifts while the band and work section cover it ---------- */
function initHeroScroll() {
  const st = { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true };
  $$('.hero-letter').forEach((l, i) => gsap.to(l, { yPercent: -18 - i * 12, ease: 'none', scrollTrigger: st }));
  gsap.to('.hero-portrait', { yPercent: 10, scale: 0.94, ease: 'none', scrollTrigger: st });
  gsap.to(['.hero-title', '.hero-aside', '.hero-stat'], { y: -120, autoAlpha: 0, ease: 'none', scrollTrigger: { ...st, end: '60% top' } });
  gsap.to(heroGL, { y: -1.4, scale: 0.6, spin: 3, ease: 'none', scrollTrigger: st });
  gsap.to('.hero-inner', { yPercent: 45, scale: 0.96, ease: 'none', scrollTrigger: st }); // parallax: the dark curtain overtakes it
}

/* ---------- Tools band: moves with scroll ---------- */
function initBand() {
  gsap.fromTo('.band-row', { xPercent: 0 }, { xPercent: -30, ease: 'none', scrollTrigger: { trigger: '.band', start: 'top bottom', end: 'bottom top', scrub: true } });
}

/* ---------- Journey: the line draws with scroll, steps light up as it reaches them ---------- */
function initJourney() {
  gsap.fromTo('.journey-fill', { scaleY: 0 }, { scaleY: 1, ease: 'none', scrollTrigger: { trigger: '.journey', start: 'top 60%', end: 'bottom 60%', scrub: true } });
  $$('.step').forEach((step) =>
    ScrollTrigger.create({ trigger: step, start: 'top 60%', toggleClass: 'is-on' })
  );
}

function initPlans() {
  gsap.from('.plan', {
    y: 80,
    autoAlpha: 0,
    rotate: (i) => (i - 1) * 3,
    duration: 1.2,
    stagger: 0.1,
    ease: 'expo.out',
    scrollTrigger: { trigger: '.plans', start: 'top 85%', toggleActions: 'play none none reverse' },
  });
}

/* ---------- Footer: the wordmark rises out of the bottom edge ---------- */
function initFooter() {
  gsap.fromTo('.footer-letter', { yPercent: 110 }, {
    yPercent: 0,
    stagger: 0.08,
    ease: 'none',
    scrollTrigger: { trigger: '.footer', start: 'top 70%', end: 'bottom bottom', scrub: true },
  });
  gsap.fromTo(footerGL, { rise: 0 }, { rise: 1, ease: 'none', scrollTrigger: { trigger: '.footer', start: 'top 90%', end: 'top 20%', scrub: true } });
}

/* ---------- WebGL scenes (skipped quietly if WebGL is unavailable) ---------- */
function initGL() {
  const fail = (err) => console.warn('WebGL disabled:', err);
  // The blob grows in once its shaders are compiled, so the intro never waits on the GPU
  heroScene
    .then((m) => m.initHeroGL($('.hero-gl'), heroGL))
    .then(({ ready, dispose }) => {
      ready.then(() => gsap.to(heroGL, { reveal: 1, spin: 0, duration: 2.2, ease: 'expo.out' }));
      // By the time About reaches the top, the hero (and its WebGL context) is long
      // off-screen behind the pinned work track and won't be seen again on the way down.
      ScrollTrigger.create({ trigger: '.about', start: 'top top', onEnter: (self) => { dispose(); self.kill(); } });
    })
    .catch(fail);
  whenNear($('.footer'), () => import('./three-footer.js').then((m) => m.initFooterGL($('.footer-gl'), footerGL)).catch(fail));
}

/* ---------- Headings: characters rise and untwist, line by line ---------- */
function initChars() {
  $$('[data-reveal="chars"]').forEach((el) => {
    const split = SplitText.create(el, { type: 'lines,words,chars', mask: 'lines', linesClass: 'line' });
    gsap.from(split.chars, {
      yPercent: 110,
      rotate: 12,
      transformOrigin: '0% 100%',
      duration: 1,
      stagger: 0.018,
      ease: 'expo.out',
      scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none reverse' },
    });
  });
}

/* ---------- Magnetic elements: data-magnet="strength" ---------- */
function initMagnets() {
  if (!finePointer) return;
  $$('[data-magnet]').forEach((el) => {
    const k = parseFloat(el.dataset.magnet) || 0.25;
    const inner = el.firstElementChild;
    const x = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'expo.out' });
    const y = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'expo.out' });
    const ix = inner && gsap.quickTo(inner, 'x', { duration: 0.6, ease: 'expo.out' });
    const iy = inner && gsap.quickTo(inner, 'y', { duration: 0.6, ease: 'expo.out' });
    const move = (dx, dy) => { x(dx * k); y(dy * k); ix?.(dx * k * 0.5); iy?.(dy * k * 0.5); };
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      move(e.clientX - (r.left + r.width / 2), e.clientY - (r.top + r.height / 2));
    });
    el.addEventListener('pointerleave', () => move(0, 0));
  });
}

/* ---------- Plans + quotes tilt toward the cursor in 3D ---------- */
function initTilt() {
  if (!finePointer) return;
  $$('.plan, .quote').forEach((el) => {
    gsap.set(el, { transformPerspective: 900 });
    const rx = gsap.quickTo(el, 'rotationX', { duration: 0.8, ease: 'expo.out' });
    const ry = gsap.quickTo(el, 'rotationY', { duration: 0.8, ease: 'expo.out' });
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      ry(((e.clientX - r.left) / r.width - 0.5) * 12);
      rx(-((e.clientY - r.top) / r.height - 0.5) * 12);
      el.style.setProperty('--mx', `${((e.clientX - r.left) / r.width) * 100}%`);
      el.style.setProperty('--my', `${((e.clientY - r.top) / r.height) * 100}%`);
    });
    el.addEventListener('pointerleave', () => { rx(0); ry(0); });
  });
}

/* ---------- Band skews with scroll speed ---------- */
function initBandVelocity() {
  const skew = gsap.quickTo('.band-row', 'skewX', { duration: 0.5, ease: 'power3.out' });
  ScrollTrigger.create({
    trigger: '.band',
    start: 'top bottom',
    end: 'bottom top',
    onUpdate: (self) => skew(gsap.utils.clamp(-14, 14, self.getVelocity() / -250)),
    onLeave: () => skew(0),
  });
}

function initProgress() {
  gsap.fromTo('.progress', { scaleX: 0 }, { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: 0.3 } });
}

/* ---------- Staggered entrances for grids ---------- */
function initEntrances() {
  const batch = (selector, vars) =>
    ScrollTrigger.batch(selector, {
      start: 'top 90%',
      onEnter: (els) => gsap.fromTo(els, vars, { y: 0, x: 0, autoAlpha: 1, scale: 1, duration: 1, stagger: 0.08, ease: 'expo.out', overwrite: true }),
    });
  gsap.set('.quote', { x: 120, autoAlpha: 0 });
  batch('.quote', { x: 120, autoAlpha: 0 });
  gsap.set('.faq', { y: 40, autoAlpha: 0 });
  batch('.faq', { y: 40, autoAlpha: 0 });
  // Hero stats bob gently once the intro is done
  $$('.hero-stat').forEach((el, i) =>
    gsap.to(el, { yPercent: -18, duration: 2.4 + i * 0.5, delay: 2, ease: 'sine.inOut', yoyo: true, repeat: -1 })
  );
}

/* ---------- Cursor: dot that swells over links and shows a label over projects ---------- */
function initCursor() {
  const cursor = $('.cursor');
  const label = $('.cursor-label', cursor);
  const x = gsap.quickTo(cursor, 'x', { duration: 0.45, ease: 'power3.out' });
  const y = gsap.quickTo(cursor, 'y', { duration: 0.45, ease: 'power3.out' });
  document.documentElement.classList.add('has-cursor');

  window.addEventListener('pointermove', (e) => {
    x(e.clientX);
    y(e.clientY);
    cursor.classList.add('is-visible');
  });
  document.addEventListener('pointerleave', () => cursor.classList.remove('is-visible'));
  document.addEventListener('pointerover', (e) => {
    const labelled = e.target.closest('[data-cursor]');
    const link = e.target.closest('a, button, summary');
    cursor.classList.toggle('is-label', !!labelled);
    cursor.classList.toggle('is-link', !labelled && !!link);
    if (labelled) label.textContent = labelled.dataset.cursor;
  });
}

/* ---------- Testimonials rail: native scroll-snap, buttons scroll one card ---------- */
function initRail() {
  const rail = $('.rail');
  $$('.rail-btn').forEach((btn) =>
    btn.addEventListener('click', () => rail.scrollBy({ left: +btn.dataset.dir * $('.quote', rail).offsetWidth, behavior: 'smooth' }))
  );
}
