import { $, $$, isDesktop } from '../shared/core.js';

const TRAIL_IMAGES = ['/img/work-1.svg', '/img/work-2.svg', '/img/work-3.svg', '/img/work-4.svg', '/img/work-5.svg', '/img/work-6.svg'];

/* Footer wordmark: an SVG sized to its text, with an image trail clipped to the letters */
export function initFooterLogo() {
  const svg = $('.footer-wordmark');
  if (!svg) return;
  const [, text] = $$('.wm-text', svg);
  const box = text.getBBox();
  const fontSize = 200;
  const top = -0.74 * fontSize; // cap height; getBBox includes the full ascender
  const vb = { x: box.x, y: top, w: box.width, h: box.y + box.height - top };
  svg.setAttribute('viewBox', `${vb.x} ${vb.y} ${vb.w} ${vb.h}`);

  if (!isDesktop()) return;

  const group = $('.trail', svg);
  const cfg = { minDistance: 14, max: 18, w: 70, h: 96, rotation: 30 };
  const images = [];
  let index = 0;
  let last = { x: -999, y: -999 };
  let idle;
  let fade;

  const toSvg = (e) => {
    const r = svg.getBoundingClientRect();
    return { x: vb.x + ((e.clientX - r.left) / r.width) * vb.w, y: vb.y + ((e.clientY - r.top) / r.height) * vb.h };
  };
  const remove = (img) => {
    img.style.opacity = '0';
    setTimeout(() => img.remove(), 300);
  };
  const add = ({ x, y }) => {
    const img = document.createElementNS('http://www.w3.org/2000/svg', 'image');
    img.setAttribute('href', TRAIL_IMAGES[index++ % TRAIL_IMAGES.length]);
    img.setAttribute('x', x - cfg.w / 2);
    img.setAttribute('y', y - cfg.h / 2);
    img.setAttribute('width', cfg.w);
    img.setAttribute('height', cfg.h);
    img.setAttribute('preserveAspectRatio', 'xMidYMid slice');
    img.setAttribute('transform', `rotate(${(Math.random() - 0.5) * cfg.rotation} ${x} ${y})`);
    img.style.cssText = 'opacity:0;transition:opacity .3s ease-out';
    group.append(img);
    requestAnimationFrame(() => (img.style.opacity = '1'));
    images.push(img);
    if (images.length > cfg.max) remove(images.shift());
  };
  const fadeOut = () => {
    if (fade) return;
    fade = setInterval(() => {
      if (!images.length) {
        clearInterval(fade);
        fade = null;
        return;
      }
      remove(images.shift());
    }, 50);
  };

  svg.addEventListener('mousemove', (e) => {
    clearInterval(fade);
    fade = null;
    const p = toSvg(e);
    if (Math.hypot(p.x - last.x, p.y - last.y) > cfg.minDistance) {
      add(p);
      last = p;
    }
    clearTimeout(idle);
    idle = setTimeout(fadeOut, 100);
  });
  svg.addEventListener('mouseleave', () => {
    clearTimeout(idle);
    fadeOut();
  });
}

export function initMobileMenu() {
  const bar = $('.mbar');
  const toggle = $('.mbar-toggle', bar);
  const set = (open) => {
    bar.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
  };
  toggle.addEventListener('click', () => set(!bar.classList.contains('is-open')));
  $$('.mbar-menu a', bar).forEach((a) => a.addEventListener('click', () => set(false)));
}
