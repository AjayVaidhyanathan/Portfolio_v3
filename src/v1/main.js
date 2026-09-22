import '../shared/base.css';
import './sidebar.css';
import './hero.css';
import './about.css';
import '../shared/work.css';
import '../shared/capabilities.css';
import '../shared/chat.css';
import '../shared/faq.css';
import './sections.css';

import { ScrollTrigger, $, isDesktop, reducedMotion, initScroll, initScrubs, initReveals, fitText, reloadOnResize } from '../shared/core.js';
import { initMorph } from './morph.js';
import { playIntro } from './intro.js';
import { initSidebar, initCopy } from './sidebar.js';
import { initTimeline } from './timeline.js';
import { initWork } from '../shared/work.js';
import { initCapabilities } from '../shared/capabilities.js';
import { initChat } from '../shared/chat.js';
import { initTestimonials } from './testimonials.js';
import { initFaq } from '../shared/faq.js';
import { initFooterLogo, initMobileMenu } from './footer.js';

async function boot() {
  // Everything below measures text, so wait for the real fonts
  await Promise.all([
    document.fonts.load('900 100px "Schibsted Grotesk Variable"'),
    document.fonts.load('700 100px "Schibsted Grotesk Variable"'),
    document.fonts.load('450 16px "General Sans"'),
  ]);
  await document.fonts.ready;
  window.scrollTo(0, 0);

  const desktop = isDesktop();
  const year = $('[data-year]');
  if (year) year.textContent = new Date().getFullYear();

  fitText($('.hero-wordmark'), desktop ? window.innerWidth * 0.944 : window.innerWidth - 32);

  initScroll();
  if (desktop) {
    initMorph(); // must measure before anything else transforms the page
    initScrubs();
    initSidebar();
    initWork();
  } else {
    initMobileMenu();
    initCopy();
  }
  initReveals();
  initTimeline();
  initCapabilities();
  initChat();
  initTestimonials();
  initFaq();
  initFooterLogo();

  ScrollTrigger.refresh();

  if (desktop && !reducedMotion()) playIntro();
  else document.documentElement.classList.remove('is-loading');

  reloadOnResize();
}

boot();
