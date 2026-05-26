/* ============================================================
   GSAP-ANIMATIONS.JS — Solo desktop, sin conflictos
   CORREGIDO: Sin conflictos con main.js
   ============================================================ */
'use strict';

(function () {

  const prefersLess = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile    = window.innerWidth <= 768;

  if (typeof gsap === 'undefined' || isMobile || prefersLess) return;

  if (typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.config({ ignoreMobileResize: true });
  }

  function initHero() {
    setTimeout(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      gsap.set('.hero__orb', { opacity: 0, scale: 0.7 });
      tl.to('.hero__orb', {
        opacity:  0.15,
        scale:    1,
        duration: 1.8,
        stagger:  0.2,
      }, 0);

const badge = document.querySelector('.hero .badge');
if (badge) {
  // Asegurar que el badge existe y está listo
  gsap.set(badge, { 
    opacity: 0, 
    y: -15,
    clearProps: "all" 
  });
  tl.to(badge, { 
    opacity: 1, 
    y: 0, 
    duration: 0.5, 
    ease: "back.out(0.6)",
    delay: 0.2
  }, 0.2);
}

      const h1 = document.querySelector('.hero h1');
      if (h1) {
        gsap.set(h1, { opacity: 0, y: 24 });
        tl.to(h1, { opacity: 1, y: 0, duration: 0.8 }, 0.5);
      }

      const p = document.querySelector('.hero p');
      if (p) {
        gsap.set(p, { opacity: 0, y: 18 });
        tl.to(p, { opacity: 1, y: 0, duration: 0.7 }, 0.8);
      }

      const btns = document.querySelectorAll('.hero .btn');
      if (btns.length) {
        gsap.set(btns, { opacity: 0, y: 14 });
        tl.to(btns, { opacity: 1, y: 0, duration: 0.6, stagger: 0.1 }, 1.0);
      }

      const socials = document.querySelectorAll('.hero .social-link');
      if (socials.length) {
        gsap.set(socials, { opacity: 0, x: -12 });
        tl.to(socials, { opacity: 1, x: 0, duration: 0.5, stagger: 0.07 }, 1.2);
      }

      const avatar = document.querySelector('.avatar');
      if (avatar) {
        gsap.set(avatar, { opacity: 0, scale: 0.88 });
        tl.to(avatar, { opacity: 1, scale: 1, duration: 1.0 }, 0.6);
      }

      const statCards = document.querySelectorAll('.stat-card');
      if (statCards.length) {
        gsap.set(statCards, { opacity: 0, y: 18 });
        tl.to(statCards, { opacity: 1, y: 0, duration: 0.6, stagger: 0.12 }, 0.9);
      }

    }, 0);
  }

  function initSectionHeaders() {
    if (typeof ScrollTrigger === 'undefined') return;

    // Hacer visibles todos los títulos inmediatamente
    gsap.utils.toArray('.section__eyebrow, .section__title, .section__subtitle').forEach(el => {
      gsap.set(el, { opacity: 1, y: 0 });
    });
  }

  function initNavbar() {
    if (typeof ScrollTrigger === 'undefined') return;
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    ScrollTrigger.create({
      start:      'top -30',
      onEnter:    () => navbar.classList.add('scrolled'),
      onLeaveBack:() => navbar.classList.remove('scrolled'),
    });
  }

  function initCardTilt() {
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const cards = document.querySelectorAll('.card--glow, .version-card');

    cards.forEach(card => {
      const cs = getComputedStyle(card);
      if (cs.position === 'static') card.style.position = 'relative';

      const glowEl = document.createElement('div');
      glowEl.style.cssText = `
        position: absolute; inset: 0; border-radius: inherit;
        pointer-events: none; opacity: 0;
        transition: opacity 0.35s ease;
        background: radial-gradient(circle at 50% 50%,
          rgba(167,139,250,0.07) 0%, transparent 65%);
      `;
      card.appendChild(glowEl);

      let bounds = null;

      card.addEventListener('mouseenter', () => {
        bounds = card.getBoundingClientRect();
        glowEl.style.opacity = '1';
        gsap.to(card, { scale: 1.01, duration: 0.4, ease: 'power2.out' });
      });

      card.addEventListener('mousemove', e => {
        if (!bounds) return;
        const x = (e.clientX - bounds.left) / bounds.width  - 0.5;
        const y = (e.clientY - bounds.top)  / bounds.height - 0.5;
        gsap.to(card, {
          rotateY: x * 4,
          rotateX: -y * 4,
          duration: 0.5,
          ease: 'power1.out',
          transformPerspective: 900,
        });
        glowEl.style.background = `radial-gradient(circle at ${
          (e.clientX - bounds.left) / bounds.width  * 100}% ${
          (e.clientY - bounds.top)  / bounds.height * 100}%,
          rgba(167,139,250,0.09) 0%, transparent 65%)`;
      });

      card.addEventListener('mouseleave', () => {
        bounds = null;
        glowEl.style.opacity = '0';
        gsap.to(card, {
          rotateY: 0, rotateX: 0, scale: 1,
          duration: 0.55,
          ease: 'power2.out',
          transformPerspective: 900,
        });
      });
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    initHero();
    initSectionHeaders();
    initNavbar();
    initCardTilt();
  });

})();