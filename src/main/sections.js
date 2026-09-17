import { gsap, ScrollTrigger, $, $$ } from '../shared/core.js';

const finePointer = () => matchMedia('(pointer: fine)').matches;

/* Run cb once, when el comes within a screen of the viewport */
export function whenNear(el, cb) {
  const io = new IntersectionObserver(([e]) => {
    if (!e.isIntersecting) return;
    io.disconnect();
    cb();
  }, { rootMargin: '100% 0px' });
  io.observe(el);
}

/* ---------- About: 3D path, chapter counter, highlighted steps, floating image preview ---------- */
export function initAbout() {
  const steps = $$('.step');
  const num = $('.about-chapter-num');
  const gl = { progress: 0, reveal: 0 };
  gsap.to(gl, { reveal: 1, duration: 1.6, ease: 'expo.out', scrollTrigger: { trigger: '.about', start: 'top 70%', toggleActions: 'play none none reverse' } });
  ScrollTrigger.create({
    trigger: '.journey',
    start: 'top 60%',
    end: 'bottom 60%',
    onUpdate: (self) => (gl.progress = self.progress),
  });
  whenNear($('.about'), () =>
    import('./three-journey.js')
      .then((m) => m.initJourneyGL($('.about-gl'), steps.length, gl))
      .catch((err) => console.warn('WebGL disabled:', err))
  );

  // Chapter counter rolls to the step in view
  const setChapter = (i) => {
    const next = String(i + 1).padStart(2, '0');
    if (num.textContent === next) return;
    gsap.timeline()
      .to(num, { yPercent: -100, autoAlpha: 0, duration: 0.25, ease: 'power2.in' })
      .add(() => (num.textContent = next))
      .fromTo(num, { yPercent: 100, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.5, ease: 'expo.out' });
  };
  steps.forEach((step, i) =>
    ScrollTrigger.create({
      trigger: step,
      start: 'top 60%',
      end: 'bottom 60%',
      onToggle: (self) => self.isActive && setChapter(i),
    })
  );

  if (!finePointer()) return;

  // Hover a step: its image floats next to the cursor, tilting with movement
  const preview = $('.preview');
  const img = $('img', preview);
  const x = gsap.quickTo(preview, 'x', { duration: 0.6, ease: 'expo.out' });
  const y = gsap.quickTo(preview, 'y', { duration: 0.6, ease: 'expo.out' });
  const rot = gsap.quickTo(preview, 'rotation', { duration: 0.6, ease: 'expo.out' });
  let lastX = 0;
  gsap.set(preview, { scale: 0.4, autoAlpha: 0 });

  steps.forEach((step) => {
    step.addEventListener('pointerenter', () => {
      img.src = step.dataset.img;
      gsap.to(preview, { scale: 1, autoAlpha: 1, duration: 0.5, ease: 'expo.out', overwrite: 'auto' });
    });
    step.addEventListener('pointerleave', () => gsap.to(preview, { scale: 0.4, autoAlpha: 0, duration: 0.35, ease: 'power2.in', overwrite: 'auto' }));
    step.addEventListener('pointermove', (e) => {
      x(e.clientX + 24);
      y(e.clientY - 90);
      rot(gsap.utils.clamp(-12, 12, (e.clientX - lastX) * 0.8));
      lastX = e.clientX;
    });
  });
}

/* ---------- Process: pinned, the track scrolls sideways; cards swing in, counter + bar follow ---------- */
export function initProcess() {
  const mm = gsap.matchMedia();
  mm.add('(min-width: 768px)', () => {
    const track = $('.process-track');
    const cards = $$('.pcard', track);
    const num = $('.process-count-num');
    const distance = () => track.scrollWidth - window.innerWidth;

    const scroll = gsap.to(track, {
      x: () => -distance(),
      ease: 'none',
      scrollTrigger: {
        trigger: '.process',
        pin: '.process-pin',
        start: 'top top',
        end: () => '+=' + distance(),
        scrub: 0.6,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const i = Math.min(3, Math.floor(self.progress * 4));
          num.textContent = String(i + 1).padStart(2, '0');
        },
      },
    });

    gsap.fromTo('.process-bar i', { scaleX: 0 }, { scaleX: 1, ease: 'none', scrollTrigger: { trigger: '.process', start: 'top top', end: () => '+=' + distance(), scrub: 0.6 } });

    cards.forEach((card) => {
      gsap.fromTo(card,
        { rotationY: -35, rotationZ: 4, z: -200, autoAlpha: 0.2, transformPerspective: 1200, transformOrigin: '0% 50%' },
        { rotationY: 0, rotationZ: 0, z: 0, autoAlpha: 1, ease: 'power2.out',
          scrollTrigger: { trigger: card, containerAnimation: scroll, start: 'left 100%', end: 'left 55%', scrub: true } }
      );
      const icon = $('.pcard-icon', card);
      if (icon) {
        gsap.fromTo(icon, { rotation: -180, scale: 0.3 }, { rotation: 0, scale: 1, ease: 'back.out(2)',
          scrollTrigger: { trigger: card, containerAnimation: scroll, start: 'left 90%', end: 'left 50%', scrub: true } });
      }
    });
  });
}

/* ---------- Services: panel grows into place, prices count up ---------- */
export function initServicesExtras() {
  gsap.fromTo('.services', { scale: 0.92 }, {
    scale: 1, ease: 'none',
    scrollTrigger: { trigger: '.services', start: 'top bottom', end: 'top 30%', scrub: true },
  });

  $$('[data-price]').forEach((el) => {
    const value = +el.dataset.price;
    const counter = { v: 0 };
    gsap.to(counter, {
      v: value,
      duration: 1.8,
      ease: 'expo.out',
      onUpdate: () => (el.textContent = Math.round(counter.v).toLocaleString('en')),
      scrollTrigger: { trigger: el, start: 'top 90%', toggleActions: 'play none none reset' },
    });
  });
}

/* ---------- Testimonials: drag the rail with the mouse; cards lean with its speed ---------- */
export function initQuotesExtras() {
  const rail = $('.rail');
  const quotes = $$('.quote', rail);
  const skew = quotes.map((q) => gsap.quickTo(q, 'skewX', { duration: 0.6, ease: 'power3.out' }));
  let last = rail.scrollLeft;
  let settle;
  rail.addEventListener('scroll', () => {
    const v = gsap.utils.clamp(-8, 8, (rail.scrollLeft - last) * -0.25);
    last = rail.scrollLeft;
    skew.forEach((s) => s(v));
    clearTimeout(settle);
    settle = setTimeout(() => skew.forEach((s) => s(0)), 80);
  });

  if (!finePointer()) return;
  let down = null;
  rail.addEventListener('pointerdown', (e) => {
    if (e.pointerType !== 'mouse') return;
    down = { x: e.clientX, left: rail.scrollLeft };
    rail.classList.add('is-dragging');
  });
  window.addEventListener('pointermove', (e) => {
    if (!down) return;
    rail.scrollLeft = down.left - (e.clientX - down.x);
  });
  window.addEventListener('pointerup', () => {
    if (!down) return;
    down = null;
    rail.classList.remove('is-dragging'); // snap resumes and settles on the nearest card
  });
}

/* ---------- FAQ: the question mark turns in 3D with scroll; answers slide in when opened ---------- */
export function initFaqExtras() {
  gsap.fromTo('.faq-mark', { rotationY: -180, rotationZ: -20, yPercent: 20 }, {
    rotationY: 540, rotationZ: 12, yPercent: -10, ease: 'none',
    scrollTrigger: { trigger: '.faqs', start: 'top bottom', end: 'bottom top', scrub: true },
  });
}
