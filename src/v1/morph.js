import { gsap, $, $$ } from '../shared/core.js';

/* Hero → sidebar morph.
   Every [data-morph] element lives in the fixed sidebar. Its [data-ghost] twin marks
   where it sits inside the hero. At scroll 0 the real element is transformed onto the
   ghost; scrolling the hero scrubs it back to its natural sidebar position. */

// [start, end] as % of the hero scroll ruler
const RANGES = {
  brand: [0, 44],
  'link-home': [7, 30],
  'link-about': [6, 31],
  'link-projects': [4, 32],
  'link-overview': [5, 33],
  'link-services': [3, 34],
  'link-clients': [2, 35],
  'link-faq': [1, 36],
  cta: [5, 35],
  'about-btn': [5, 35],
};

export function initMorph() {
  const track = $('.hero-track');

  // The brand animates font-size (stays crisp), so take it out of flow and lock its pill.
  const brand = $('.brand');
  const pill = brand.parentElement;
  const pr = pill.getBoundingClientRect();
  Object.assign(pill.style, { position: 'relative', width: pr.width + 'px', height: pr.height + 'px' });
  const cs = getComputedStyle(pill);
  Object.assign(brand.style, { position: 'absolute', left: cs.paddingLeft, top: cs.paddingTop });

  // Measure everything before any transform is applied
  const pairs = $$('[data-morph]')
    .map((real) => {
      const ghost = $(`[data-ghost="${real.dataset.morph}"]`);
      return ghost && { real, ghost, id: real.dataset.morph, r: real.getBoundingClientRect(), g: ghost.getBoundingClientRect() };
    })
    .filter(Boolean);

  // Menu icons have no hero twin: keep them hidden until their pills form in the sidebar
  gsap.fromTo('.menu-icon', { opacity: 0, scale: 0.5 }, {
    opacity: 1, scale: 1, ease: 'none', stagger: 0.1,
    scrollTrigger: { trigger: track, start: '28% top', end: '36% top', scrub: 1 },
  });

  pairs.forEach(({ real, ghost, id, r, g }) => {
    const [start, end] = RANGES[id] || [0, 40];
    const scrollTrigger = { trigger: track, start: `${start}% top`, end: `${end}% top`, scrub: 1 };
    const ease = 'power1.inOut';
    const x = g.left - r.left;
    const y = g.top - r.top;

    if (id === 'brand') {
      gsap.fromTo(
        real,
        { x, y, fontSize: parseFloat(getComputedStyle(ghost).fontSize) },
        { x: 0, y: 0, fontSize: parseFloat(getComputedStyle(real).fontSize), ease, scrollTrigger }
      );
      return;
    }

    if (id === 'cta' || id === 'about-btn') {
      // Width/height instead of scale so the label is never distorted
      gsap.fromTo(
        real,
        { x, y, width: g.width, height: g.height, opacity: 1 },
        { x: 0, y: 0, width: r.width, height: r.height, opacity: id === 'about-btn' ? 0 : 1, ease, scrollTrigger }
      );
      return;
    }

    const sx = g.width / r.width;
    const sy = g.height / r.height;

    if (id.endsWith('-bg')) {
      // Glass card in the hero that dissolves into the sidebar stat.
      // Elliptical radii compensate the non-uniform scale so corners stay round.
      const radius = parseFloat(getComputedStyle(ghost).borderRadius) || 8;
      const endRadius = parseFloat(getComputedStyle(real).borderRadius) || 0;
      gsap.fromTo(
        real,
        { x, y, scaleX: sx, scaleY: sy, opacity: 1, borderRadius: `${radius / sx}px / ${radius / sy}px` },
        { x: 0, y: 0, scaleX: 1, scaleY: 1, opacity: 0, borderRadius: `${endRadius}px / ${endRadius}px`, ease, scrollTrigger }
      );
      return;
    }

    gsap.fromTo(real, { x, y, scaleX: sx, scaleY: sy }, { x: 0, y: 0, scaleX: 1, scaleY: 1, ease, scrollTrigger });
  });
}
