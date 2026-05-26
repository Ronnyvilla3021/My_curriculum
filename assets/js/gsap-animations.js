/* ============================================================
   GSAP-ANIMATIONS.JS  v2 — Sistema cinematográfico de animaciones
   Requiere: gsap.min.js + ScrollTrigger.min.js (CDN)
   ============================================================ */
'use strict';

gsap.registerPlugin(ScrollTrigger);

/* ── Utilidad: reducir movimiento ── */
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.addEventListener('DOMContentLoaded', () => {
  if (prefersReducedMotion) {
    document.querySelectorAll('.reveal,.reveal--left,.reveal--right').forEach(el => {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
    initParticles();
    initNavbarScroll();
    initProgressBars();
    initStatCounters();
    return;
  }

  initHeroAnimation();
  initScrollReveal();
  initTimelineAnimation();
  initProgressBars();
  initStatCounters();
  initNavbarScroll();
  initParallaxOrbs();
  initMagneticButtons();
  initTextScramble();
  initCardTilt();
  initSectionTitles();
  initCursorGlow();
  initAudioBars();
  initParticles();
});

/* ============================================================
   HERO — Entrada cinematográfica en capas
   ============================================================ */
function initHeroAnimation() {
  /* Ocultar elementos antes de animar */
  gsap.set('.hero .badge',         { autoAlpha: 0, y: -20, scale: 0.9 });
  gsap.set('.hero h1',             { autoAlpha: 0 });
  gsap.set('.hero h1 > *',         { autoAlpha: 0, y: 60, skewY: 4 });
  gsap.set('.hero p',              { autoAlpha: 0, y: 30 });
  gsap.set('.hero .btn',           { autoAlpha: 0, y: 20, scale: 0.92 });
  gsap.set('.hero .social-link',   { autoAlpha: 0, x: -16 });
  gsap.set('.avatar',              { autoAlpha: 0, scale: 0.7, rotate: -8 });
  gsap.set('.stat-card',           { autoAlpha: 0, y: 40, scale: 0.88 });
  gsap.set('.hero__orb',           { autoAlpha: 0, scale: 0.6 });
  gsap.set('.dots-grid',           { autoAlpha: 0 });

  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });

  /* Fondo: orbs y grid */
  tl.to('.hero__orb', {
      autoAlpha: 0.15, scale: 1,
      duration: 2.2, stagger: 0.2, ease: 'power2.out'
    }, 0)
    .to('.dots-grid', { autoAlpha: 0.5, duration: 1.8 }, 0.3)

  /* Badges con rebote */
    .to('.hero .badge', {
      autoAlpha: 1, y: 0, scale: 1,
      duration: 0.7, stagger: 0.12, ease: 'back.out(2)'
    }, 0.4)

  /* Título: reveal línea por línea con skew */
    .to('.hero h1', { autoAlpha: 1, duration: 0.01 }, 0.6)
    .to('.hero h1 > *', {
      autoAlpha: 1, y: 0, skewY: 0,
      duration: 1, stagger: 0.15, ease: 'expo.out'
    }, 0.65)

  /* Descripción */
    .to('.hero p', {
      autoAlpha: 1, y: 0,
      duration: 0.9, ease: 'power3.out'
    }, 1.1)

  /* Botones con bounce */
    .to('.hero .btn', {
      autoAlpha: 1, y: 0, scale: 1,
      duration: 0.65, stagger: 0.1, ease: 'back.out(1.8)'
    }, 1.3)

  /* Social links en cascada */
    .to('.hero .social-link', {
      autoAlpha: 1, x: 0,
      duration: 0.55, stagger: 0.08, ease: 'power2.out'
    }, 1.5)

  /* Avatar: giro + aparición */
    .to('.avatar', {
      autoAlpha: 1, scale: 1, rotate: 0,
      duration: 1.2, ease: 'elastic.out(1, 0.6)'
    }, 0.75)

  /* Stat cards escalonadas con rebote */
    .to('.stat-card', {
      autoAlpha: 1, y: 0, scale: 1,
      duration: 0.7, stagger: 0.15, ease: 'back.out(2)'
    }, 1.0);
}

/* ============================================================
   SECCIÓN TÍTULOS — reveal con split y clip
   ============================================================ */
function initSectionTitles() {
  gsap.utils.toArray('.section__eyebrow').forEach(el => {
    gsap.from(el, {
      autoAlpha: 0, x: -30, duration: 0.7, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 88%', once: true }
    });
  });

  gsap.utils.toArray('.section__title').forEach(el => {
    gsap.from(el, {
      autoAlpha: 0, y: 40, duration: 0.9, ease: 'expo.out',
      scrollTrigger: { trigger: el, start: 'top 88%', once: true }
    });
  });

  gsap.utils.toArray('.section__subtitle').forEach(el => {
    gsap.from(el, {
      autoAlpha: 0, y: 20, duration: 0.8, delay: 0.15, ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 88%', once: true }
    });
  });
}

/* ============================================================
   SCROLL REVEAL — reemplaza .reveal con IntersectionObserver
   ============================================================ */
function initScrollReveal() {
  gsap.set('.reveal',        { autoAlpha: 0, y: 40 });
  gsap.set('.reveal--left',  { autoAlpha: 0, x: -40 });
  gsap.set('.reveal--right', { autoAlpha: 0, x: 40 });

  function revealGroup(selector, vars) {
    gsap.utils.toArray(selector).forEach(el => {
      const siblings = Array.from(el.parentElement.children).filter(
        c => c.matches(selector)
      );
      const idx = siblings.indexOf(el);

      ScrollTrigger.create({
        trigger: el,
        start: 'top 86%',
        once: true,
        onEnter: () => gsap.to(el, {
          ...vars, delay: idx * 0.1,
          duration: 0.8, ease: 'expo.out'
        })
      });
    });
  }

  revealGroup('.reveal',        { autoAlpha: 1, y: 0 });
  revealGroup('.reveal--left',  { autoAlpha: 1, x: 0 });
  revealGroup('.reveal--right', { autoAlpha: 1, x: 0 });
}

/* ============================================================
   TIMELINE EXPERIENCIA — entrada cinematográfica por card
   ============================================================ */
function initTimelineAnimation() {
  gsap.utils.toArray('.timeline__item').forEach((item, i) => {
    const card  = item.querySelector('.version-card');
    const tags  = item.querySelectorAll('.skill-tag');
    const tag   = item.querySelector('.version-card__tag');
    const title = item.querySelector('.version-card__title');
    const desc  = item.querySelector('.version-card__desc');

    if (!card) return;

    gsap.set(card, { autoAlpha: 0, x: -60, rotateY: 8 });
    if (tag)   gsap.set(tag,   { autoAlpha: 0, x: -20 });
    if (title) gsap.set(title, { autoAlpha: 0, y: 16 });
    if (desc)  gsap.set(desc,  { autoAlpha: 0, y: 12 });
    if (tags.length) gsap.set(tags, { autoAlpha: 0, scale: 0.8, y: 8 });

    ScrollTrigger.create({
      trigger: item,
      start: 'top 82%',
      once: true,
      onEnter: () => {
        const tl = gsap.timeline({ delay: i * 0.07 });

        tl.to(card, { autoAlpha: 1, x: 0, rotateY: 0, duration: 0.85, ease: 'expo.out' });

        if (tag)   tl.to(tag,   { autoAlpha: 1, x: 0, duration: 0.5, ease: 'power2.out' }, '-=0.55');
        if (title) tl.to(title, { autoAlpha: 1, y: 0, duration: 0.55, ease: 'power2.out' }, '-=0.45');
        if (desc)  tl.to(desc,  { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '-=0.4');

        if (tags.length) {
          tl.to(tags, {
            autoAlpha: 1, scale: 1, y: 0,
            duration: 0.4, stagger: 0.05, ease: 'back.out(2)'
          }, '-=0.3');
        }
      }
    });
  });
}

/* ============================================================
   SKILL BARS — animación con física de resorte
   ============================================================ */
function initProgressBars() {
  const bars = document.querySelectorAll('.progress-fill[data-width]');
  if (!bars.length) return;

  bars.forEach(bar => {
    const targetWidth = bar.getAttribute('data-width');
    gsap.set(bar, { width: '0%' });

    ScrollTrigger.create({
      trigger: bar,
      start: 'top 88%',
      once: true,
      onEnter: () => {
        gsap.to(bar, {
          width: targetWidth,
          duration: 1.6,
          ease: 'power4.out',
          onStart: () => {
            /* Pulso en el punto de inicio */
            gsap.from(bar, { boxShadow: '0 0 20px rgba(139,92,246,0.8)', duration: 0.6 });
          }
        });
      }
    });
  });
}

/* ============================================================
   STAT COUNTERS — conteo animado con GSAP
   ============================================================ */
function initStatCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  counters.forEach(el => {
    const target   = parseFloat(el.getAttribute('data-count'));
    const suffix   = el.getAttribute('data-suffix') ?? '';
    const decimals = Number(el.getAttribute('data-decimals') ?? 0);
    const obj      = { val: 0 };

    ScrollTrigger.create({
      trigger: el,
      start: 'top 90%',
      once: true,
      onEnter: () => {
        gsap.to(obj, {
          val: target, duration: 2, ease: 'expo.out',
          onUpdate: () => { el.textContent = obj.val.toFixed(decimals) + suffix; },
          onComplete: () => { el.textContent = target.toFixed(decimals) + suffix; }
        });
      }
    });
  });
}

/* ============================================================
   TEXT SCRAMBLE — efecto glitch en badges y eyebrows
   ============================================================ */
function initTextScramble() {
  const chars = '!<>-_\\/[]{}—=+*^?#ABCDEF01';

  function scramble(el, finalText) {
    let frame = 0;
    const totalFrames = 14;
    const interval = setInterval(() => {
      el.textContent = finalText.split('').map((ch, i) => {
        if (i < Math.floor((frame / totalFrames) * finalText.length)) return ch;
        return ch === ' ' ? ' ' : chars[Math.floor(Math.random() * chars.length)];
      }).join('');
      frame++;
      if (frame > totalFrames) { el.textContent = finalText; clearInterval(interval); }
    }, 40);
  }

  document.querySelectorAll('.section__eyebrow').forEach(el => {
    const original = el.textContent.trim();
    ScrollTrigger.create({
      trigger: el, start: 'top 88%', once: true,
      onEnter: () => setTimeout(() => scramble(el, original), 200)
    });
  });
}

/* ============================================================
   MAGNETIC BUTTONS — efecto imán en hover
   ============================================================ */
function initMagneticButtons() {
  if (window.matchMedia('(pointer: coarse)').matches) return;

  document.querySelectorAll('.btn--primary, .btn--outline, .btn--cyan').forEach(btn => {
    const setX = gsap.quickSetter(btn, 'x', 'px');
    const setY = gsap.quickSetter(btn, 'y', 'px');
    let bounds;

    btn.addEventListener('mouseenter', () => {
      bounds = btn.getBoundingClientRect();
      gsap.to(btn, { scale: 1.06, duration: 0.3, ease: 'power2.out' });
    });

    btn.addEventListener('mousemove', e => {
      if (!bounds) return;
      const cx = bounds.left + bounds.width  / 2;
      const cy = bounds.top  + bounds.height / 2;
      const dx = (e.clientX - cx) * 0.38;
      const dy = (e.clientY - cy) * 0.38;
      setX(dx); setY(dy);
    });

    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, { x: 0, y: 0, scale: 1, duration: 0.5, ease: 'elastic.out(1, 0.5)' });
    });
  });
}

/* ============================================================
   CARD TILT — efecto parallax 3D en hover de cards
   ============================================================ */
function initCardTilt() {
  if (window.matchMedia('(pointer: coarse)').matches) return;

  document.querySelectorAll('.card--glow, .version-card, .cert-card').forEach(card => {
    let bounds;
    const glow = document.createElement('div');
    glow.style.cssText = `
      position:absolute; inset:0; border-radius:inherit;
      pointer-events:none; opacity:0; transition:opacity 0.3s;
      background: radial-gradient(circle at 50% 50%,
        rgba(167,139,250,0.12) 0%, transparent 65%);
    `;
    if (getComputedStyle(card).position === 'static') card.style.position = 'relative';
    card.appendChild(glow);

    card.addEventListener('mouseenter', () => {
      bounds = card.getBoundingClientRect();
      glow.style.opacity = '1';
      gsap.to(card, { scale: 1.015, duration: 0.4, ease: 'power2.out' });
    });

    card.addEventListener('mousemove', e => {
      if (!bounds) return;
      const x = (e.clientX - bounds.left) / bounds.width  - 0.5;
      const y = (e.clientY - bounds.top)  / bounds.height - 0.5;
      gsap.to(card, {
        rotateY: x * 10, rotateX: -y * 10,
        duration: 0.4, ease: 'power1.out',
        transformPerspective: 800
      });
      glow.style.background = `radial-gradient(circle at ${
        (e.clientX - bounds.left) / bounds.width * 100}% ${
        (e.clientY - bounds.top)  / bounds.height * 100}%,
        rgba(167,139,250,0.15) 0%, transparent 65%)`;
    });

    card.addEventListener('mouseleave', () => {
      bounds = null;
      glow.style.opacity = '0';
      gsap.to(card, {
        rotateY: 0, rotateX: 0, scale: 1,
        duration: 0.7, ease: 'elastic.out(1, 0.5)',
        transformPerspective: 800
      });
    });
  });
}

/* ============================================================
   NAVBAR SCROLL
   ============================================================ */
function initNavbarScroll() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;
  ScrollTrigger.create({
    start: 'top -20',
    onEnter:     () => navbar.classList.add('scrolled'),
    onLeaveBack: () => navbar.classList.remove('scrolled')
  });
}

/* ============================================================
   PARALLAX ORBS — quickSetter para rendimiento máximo
   ============================================================ */
function initParallaxOrbs() {
  const orbs = document.querySelectorAll('.hero__orb');
  if (!orbs.length) return;

  const setters = Array.from(orbs).map((orb, i) => ({
    x: gsap.quickSetter(orb, 'x', 'px'),
    y: gsap.quickSetter(orb, 'y', 'px'),
    factor: (i + 1) * 1.8
  }));

  let mx = 0, my = 0, cx = 0, cy = 0;

  document.addEventListener('mousemove', e => {
    mx = (e.clientX / window.innerWidth  - 0.5) * 2;
    my = (e.clientY / window.innerHeight - 0.5) * 2;
  }, { passive: true });

  gsap.ticker.add(() => {
    cx += (mx - cx) * 0.055;
    cy += (my - cy) * 0.055;
    setters.forEach(({ x, y, factor }) => {
      x(cx * factor * 40);
      y(cy * factor * 40);
    });
  });
}

/* ============================================================
   CURSOR GLOW — doble capa para profundidad
   ============================================================ */
function initCursorGlow() {
  if (window.matchMedia('(pointer: coarse)').matches) return;

  /* Capa exterior grande */
  const outer = document.createElement('div');
  outer.style.cssText = `
    position:fixed; pointer-events:none; z-index:9998;
    width:500px; height:500px; border-radius:50%;
    background: radial-gradient(circle,
      rgba(139,92,246,0.05) 0%, rgba(139,92,246,0.015) 45%, transparent 70%);
    transform:translate(-50%,-50%); opacity:0; transition:opacity 0.4s;
    will-change:left,top;
  `;
  /* Punto interior pequeño */
  const inner = document.createElement('div');
  inner.style.cssText = `
    position:fixed; pointer-events:none; z-index:9999;
    width:8px; height:8px; border-radius:50%;
    background: rgba(167,139,250,0.9);
    transform:translate(-50%,-50%); opacity:0; transition:opacity 0.2s;
    will-change:left,top; mix-blend-mode:screen;
  `;
  document.body.append(outer, inner);

  let tx = 0, ty = 0, ox = 0, oy = 0;

  document.addEventListener('mousemove', e => {
    tx = e.clientX; ty = e.clientY;
    outer.style.opacity = inner.style.opacity = '1';
    /* Punto interior: responde instantáneo */
    inner.style.left = tx + 'px';
    inner.style.top  = ty + 'px';
  }, { passive: true });

  document.addEventListener('mouseleave', () => {
    outer.style.opacity = inner.style.opacity = '0';
  });

  /* Outer sigue con lag */
  gsap.ticker.add(() => {
    ox += (tx - ox) * 0.08;
    oy += (ty - oy) * 0.08;
    outer.style.left = ox + 'px';
    outer.style.top  = oy + 'px';
  });

  /* Cursor crece al hover de elementos interactivos */
  document.querySelectorAll('a, button, .card, .cert-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
      gsap.to(inner, { scale: 3, duration: 0.3, ease: 'power2.out' });
    });
    el.addEventListener('mouseleave', () => {
      gsap.to(inner, { scale: 1, duration: 0.3, ease: 'power2.out' });
    });
  });
}

/* ============================================================
   AUDIO BARS — equalizer animado con GSAP
   ============================================================ */
function initAudioBars() {
  document.querySelectorAll('.audio-bars').forEach(container => {
    container.querySelectorAll('.audio-bar').forEach((bar, i) => {
      gsap.to(bar, {
        scaleY:   gsap.utils.random(0.3, 1.8),
        duration: gsap.utils.random(0.45, 0.95),
        repeat:   -1, yoyo: true,
        ease:     'sine.inOut',
        delay:    i * 0.1
      });
    });
  });
}

/* ============================================================
   PARTÍCULAS — canvas integrado al gsap.ticker
   ============================================================ */
function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let W, H, particles = [];

  const C = {
    count: 70, color: '139,92,246', colorAlt: '6,182,212',
    maxR: 2, minR: 0.5, speed: 0.28, connectDist: 125
  };

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function createParticles() {
    particles = [];
    for (let i = 0; i < C.count; i++) {
      const cyan = Math.random() < 0.25;
      particles.push({
        x: Math.random() * W, y: Math.random() * H,
        r: C.minR + Math.random() * (C.maxR - C.minR),
        vx: (Math.random() - 0.5) * C.speed,
        vy: (Math.random() - 0.5) * C.speed,
        color: cyan ? C.colorAlt : C.color,
        opacity: 0.3 + Math.random() * 0.5
      });
    }
  }

  gsap.ticker.add(() => {
    ctx.clearRect(0, 0, W, H);

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx   = particles[i].x - particles[j].x;
        const dy   = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < C.connectDist) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(${particles[i].color},${(1 - dist / C.connectDist) * 0.28})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.color},${p.opacity})`;
      ctx.fill();
      const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4);
      g.addColorStop(0, `rgba(${p.color},0.14)`);
      g.addColorStop(1, `rgba(${p.color},0)`);
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * 4, 0, Math.PI * 2);
      ctx.fillStyle = g; ctx.fill();
    });
  });

  resize(); createParticles();
  window.addEventListener('resize', () => { resize(); createParticles(); }, { passive: true });
}