/* ============================================================
   GSAP-ANIMATIONS.JS — Solo desktop
   - Animación de entrada del hero
   - Tilt 3D en las cards
   El navbar "scrolled" lo maneja main.js (antes estaba duplicado aquí).
   ============================================================ */
'use strict';

(function () {

  const prefersLess = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile    = window.innerWidth <= 768;

  if (typeof gsap === 'undefined' || isMobile || prefersLess) return;

  /* ──────────────────────────────────────────────────────────
     HERO — entrada escalonada
     Se usa gsap.from: anima desde "oculto" hasta el estilo real del CSS
     (así cada orb conserva su opacidad propia) y clearProps devuelve el
     control al CSS al terminar, para que el hover de botones, redes y
     stat-cards siga funcionando.
  ────────────────────────────────────────────────────────── */
  function initHero() {
    const tl  = gsap.timeline({ defaults: { ease: 'power3.out', clearProps: 'opacity,transform' } });
    const has = sel => document.querySelector(sel);

    if (has('.hero__orb')) {
      // Solo se limpia la opacidad: el movimiento parallax de los orbs (main.js) usa "translate"
      tl.from('.hero__orb', { opacity: 0, scale: 0.7, duration: 1.8, stagger: 0.2, clearProps: 'opacity' }, 0);
    }
    if (has('.hero .badge')) {
      tl.from('.hero .badge', { opacity: 0, y: -15, duration: 0.5, ease: 'back.out(0.6)' }, 0.2);
    }
    if (has('.hero h1')) {
      tl.from('.hero h1', { opacity: 0, y: 24, duration: 0.8 }, 0.5);
    }
    if (has('.hero p')) {
      tl.from('.hero p', { opacity: 0, y: 18, duration: 0.7 }, 0.8);
    }
    if (has('.hero .btn')) {
      tl.from('.hero .btn', { opacity: 0, y: 14, duration: 0.6, stagger: 0.1 }, 1.0);
    }
    if (has('.hero .social-link')) {
      tl.from('.hero .social-link', { opacity: 0, x: -12, duration: 0.5, stagger: 0.07 }, 1.2);
    }
    if (has('.avatar')) {
      tl.from('.avatar', { opacity: 0, scale: 0.88, duration: 1.0 }, 0.6);
    }
    if (has('.stat-card')) {
      tl.from('.stat-card', { opacity: 0, y: 18, duration: 0.6, stagger: 0.12 }, 0.9);
    }
  }

  /* ──────────────────────────────────────────────────────────
     TILT 3D en cards
     Mientras GSAP mueve la card se quita la transición CSS de "transform"
     (si no, las dos se pisan y el movimiento se siente gomoso).
     Al salir se limpia el transform inline para que el CSS recupere el control.
  ────────────────────────────────────────────────────────── */
  function initCardTilt() {
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const cards = document.querySelectorAll('.card--glow, .version-card');

    cards.forEach(card => {
      if (getComputedStyle(card).position === 'static') card.style.position = 'relative';

      const glowEl = document.createElement('div');
      glowEl.setAttribute('aria-hidden', 'true');
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
        card.style.transition = 'border-color 0.35s ease, box-shadow 0.35s ease';
        glowEl.style.opacity = '1';
        gsap.to(card, { scale: 1.01, duration: 0.4, ease: 'power2.out', overwrite: 'auto' });
      });

      card.addEventListener('mousemove', e => {
        if (!bounds) return;
        const px = (e.clientX - bounds.left) / bounds.width;
        const py = (e.clientY - bounds.top)  / bounds.height;
        gsap.to(card, {
          rotateY: (px - 0.5) * 4,
          rotateX: -(py - 0.5) * 4,
          duration: 0.5,
          ease: 'power1.out',
          transformPerspective: 900,
          overwrite: 'auto',
        });
        glowEl.style.background = `radial-gradient(circle at ${px * 100}% ${py * 100}%,
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
          overwrite: 'auto',
          onComplete: () => {
            gsap.set(card, { clearProps: 'transform' });
            card.style.transition = '';
          },
        });
      });
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    initHero();
    initCardTilt();
  });

})();
