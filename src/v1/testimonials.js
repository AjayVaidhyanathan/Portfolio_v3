import Swiper from 'swiper';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import { gsap, $, $$, isDesktop } from '../shared/core.js';

export function initTestimonials() {
  const el = $('.testi-swiper');
  if (!el) return;

  const swiper = new Swiper(el, {
    modules: [Pagination],
    slidesPerView: 'auto',
    spaceBetween: isDesktop() ? window.innerWidth * 0.011 : 10,
    speed: 600,
    resistanceRatio: 0.85,
    pagination: {
      el: '.testi-pagination',
      clickable: true,
      bulletClass: 'testi-bullet',
      bulletActiveClass: 'is-active',
    },
  });

  if (isDesktop()) initDragCursor(el, swiper);
}

/* Custom "drag" cursor that follows the pointer over the slider */
function initDragCursor(el, swiper) {
  const cursor = $('.drag-cursor');
  const [left, right] = $$('.drag-arrow', cursor);
  gsap.set(cursor, { xPercent: -50, yPercent: -50, x: 0, y: 0 });
  const moveX = gsap.quickTo(cursor, 'x', { duration: 0.35, ease: 'power3.out' });
  const moveY = gsap.quickTo(cursor, 'y', { duration: 0.35, ease: 'power3.out' });

  let inside = false;
  let dragging = false;
  const show = (on) => gsap.to(cursor, { opacity: on ? 1 : 0, scale: on ? 1 : 0.8, duration: 0.3, ease: on ? 'power2.out' : 'power2.in' });
  const arrows = (dir) => {
    gsap.to(left, { scale: dir === 'left' ? 1.5 : dir ? 0.8 : 1, duration: 0.2, ease: 'back.out(2)' });
    gsap.to(right, { scale: dir === 'right' ? 1.5 : dir ? 0.8 : 1, duration: 0.2, ease: 'back.out(2)' });
  };

  window.addEventListener('mousemove', (e) => {
    moveX(e.clientX);
    moveY(e.clientY);
  });
  el.addEventListener('mouseenter', (e) => {
    inside = true;
    gsap.set(cursor, { x: e.clientX, y: e.clientY });
    show(true);
  });
  el.addEventListener('mouseleave', () => {
    inside = false;
    if (!dragging) show(false);
  });

  swiper.on('touchStart', () => {
    dragging = true;
    cursor.classList.add('is-dragging');
  });
  swiper.on('sliderMove', (s) => {
    const dx = s.touches.currentX - s.touches.startX;
    if (Math.abs(dx) > 5) arrows(dx < 0 ? 'left' : 'right');
  });
  swiper.on('touchEnd', () => {
    dragging = false;
    cursor.classList.remove('is-dragging');
    arrows(null);
    if (!inside) show(false);
  });
}
