import { gsap, ScrollTrigger, $, $$ } from './core.js';

/* CTA chat: typing indicator → message → button, like a live conversation */
export function initChat() {
  const chat = $('.chat');
  if (!chat) return;

  const msgRow = $('.chat-row--msg', chat);
  const btnRow = $('.chat-row--btn', chat);
  const typingRow = $('.chat-typing', chat);
  const msg = $('.chat-bubble', msgRow);
  const btn = $('.chat-bubble', btnRow);
  const typing = $('.chat-bubble', typingRow);
  const msgText = $('.chat-text', msgRow);
  const btnText = $('.roll', btnRow);
  const dots = $$('i', typing);
  const gap = getComputedStyle(msgRow).paddingTop;

  gsap.set([msgRow, btnRow], { height: 0, paddingTop: 0 });
  gsap.set([msg, btn, typing], { scale: 0, opacity: 0, transformOrigin: '0% 100%' });
  gsap.set([msgText, btnText], { opacity: 0, filter: 'blur(4px)' });

  const dotsTl = gsap
    .timeline({ repeat: -1, paused: true })
    .to(dots, { y: -5, opacity: 1, duration: 0.25, stagger: 0.11, ease: 'power1.inOut' })
    .to(dots, { y: 0, opacity: 0.6, duration: 0.25, stagger: 0.11, ease: 'power1.inOut' });

  const pop = (bubble, text) => {
    const t = gsap.timeline();
    t.to(bubble, { scale: 1.03, opacity: 1, duration: 0.36, ease: 'back.out(1.7)' }).to(bubble, { scale: 1, duration: 0.12, ease: 'power2.inOut' });
    if (text) t.to(text, { opacity: 1, filter: 'blur(0px)', duration: 0.3, ease: 'power2.out' }, '-=0.2');
    return t;
  };

  const tl = gsap.timeline({ paused: true });
  tl.add(pop(typing))
    .call(() => dotsTl.play(), null, '-=0.1')
    .to(msgRow, { height: 'auto', paddingTop: gap, duration: 0.25, ease: 'power2.out' }, '+=0.7')
    .add(pop(msg, msgText), '-=0.05')
    .to(btnRow, { height: 'auto', paddingTop: gap, duration: 0.25, ease: 'power2.out' }, '+=0.7')
    .add(pop(btn, btnText), '-=0.05')
    .call(() => dotsTl.pause(), null, '+=0.2')
    .to(typing, { scale: 0, opacity: 0, duration: 0.3, ease: 'back.in(1.7)' })
    .set(btnText, { clearProps: 'filter' });

  ScrollTrigger.create({ trigger: chat, start: 'top 90%', once: true, onEnter: () => tl.play() });
}
