// ============================================================
// GSAP-ANIMATIONS.JS — Versión suave
// Animaciones más lentas, naturales y respetuosas
// ============================================================

'use strict';

// Detectar preferencia de movimiento reducido
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isMobile = window.innerWidth <= 768;

// Configurar ScrollTrigger
ScrollTrigger.config({
  ignoreMobileResize: true
});

// Si es móvil o prefiere movimiento reducido, minimizar animaciones
const shouldAnimate = !prefersReducedMotion && !isMobile;

document.addEventListener('DOMContentLoaded', () => {
  // Siempre mostrar contenido inmediatamente
  document.querySelectorAll('.reveal, .reveal--left, .reveal--right').forEach(el => {
    if (!shouldAnimate) {
      el.style.opacity = '1';
      el.style.transform = 'none';
    }
  });

  if (!shouldAnimate) {
    initNavbarScroll();
    initProgressBars();
    initStatCounters();
    initParticles();
    return;
  }

  // Animaciones completas solo en desktop sin preferencias reducidas
  initHeroAnimation();
  initScrollReveal();
  initTimelineAnimation();
  initProgressBars();
  initStatCounters();
  initNavbarScroll();
  initParallaxOrbs();
  initCardTilt();
  initSectionTitles();
  initParticles();
});

/* ============================================================
   HERO — Entrada suave y elegante
   ============================================================ */
function initHeroAnimation() {
  // Configurar estados iniciales
  gsap.set('.hero .badge',         { autoAlpha: 0, y: -8 });
  gsap.set('.hero h1',             { autoAlpha: 0 });
  gsap.set('.hero h1 > *',         { autoAlpha: 0, y: 20 });
  gsap.set('.hero p',              { autoAlpha: 0, y: 15 });
  gsap.set('.hero .btn',           { autoAlpha: 0, y: 12 });
  gsap.set('.hero .social-link',   { autoAlpha: 0, x: -8 });
  gsap.set('.avatar',              { autoAlpha: 0, scale: 0.85 });
  gsap.set('.stat-card',           { autoAlpha: 0, y: 16 });
  gsap.set('.hero__orb',           { autoAlpha: 0, scale: 0.8 });
  gsap.set('.dots-grid',           { autoAlpha: 0 });

  const tl = gsap.timeline({ defaults: { ease: 'power2.out', duration: 0.8 } });

  tl.to('.hero__orb', {
      autoAlpha: 0.12, scale: 1,
      duration: 1.2, stagger: 0.15
    }, 0)
    .to('.dots-grid', { autoAlpha: 0.4, duration: 1 }, 0.2)
    .to('.hero .badge', {
      autoAlpha: 1, y: 0,
      duration: 0.6, stagger: 0.1
    }, 0.3)
    .to('.hero h1', { autoAlpha: 1, duration: 0.1 }, 0.5)
    .to('.hero h1 > *', {
      autoAlpha: 1, y: 0,
      duration: 0.8, stagger: 0.1
    }, 0.6)
    .to('.hero p', {
      autoAlpha: 1, y: 0,
      duration: 0.7
    }, 0.9)
    .to('.hero .btn', {
      autoAlpha: 1, y: 0,
      duration: 0.6, stagger: 0.08
    }, 1.1)
    .to('.hero .social-link', {
      autoAlpha: 1, x: 0,
      duration: 0.5, stagger: 0.06
    }, 1.3)
    .to('.avatar', {
      autoAlpha: 1, scale: 1,
      duration: 0.9, ease: 'power2.out'
    }, 0.7)
    .to('.stat-card', {
      autoAlpha: 1, y: 0,
      duration: 0.6, stagger: 0.1
    }, 1.0);
}

/* ============================================================
   SECCIÓN TÍTULOS — reveal suave
   ============================================================ */
function initSectionTitles() {
  gsap.utils.toArray('.section__eyebrow').forEach(el => {
    gsap.from(el, {
      autoAlpha: 0, x: -15, duration: 0.6, ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 90%', once: true }
    });
  });

  gsap.utils.toArray('.section__title').forEach(el => {
    gsap.from(el, {
      autoAlpha: 0, y: 20, duration: 0.7, ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 90%', once: true }
    });
  });

  gsap.utils.toArray('.section__subtitle').forEach(el => {
    gsap.from(el, {
      autoAlpha: 0, y: 12, duration: 0.6, delay: 0.1, ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 90%', once: true }
    });
  });
}

/* ============================================================
   SCROLL REVEAL — suave y progresivo
   ============================================================ */
function initScrollReveal() {
  gsap.set('.reveal',        { autoAlpha: 0, y: 20 });
  gsap.set('.reveal--left',  { autoAlpha: 0, x: -20 });
  gsap.set('.reveal--right', { autoAlpha: 0, x: 20 });

  function revealGroup(selector, vars) {
    gsap.utils.toArray(selector).forEach((el, idx) => {
      ScrollTrigger.create({
        trigger: el,
        start: 'top 88%',
        once: true,
        onEnter: () => gsap.to(el, {
          ...vars,
          delay: Math.min(idx * 0.08, 0.5),
          duration: 0.8,
          ease: 'power2.out'
        })
      });
    });
  }

  revealGroup('.reveal',        { autoAlpha: 1, y: 0 });
  revealGroup('.reveal--left',  { autoAlpha: 1, x: 0 });
  revealGroup('.reveal--right', { autoAlpha: 1, x: 0 });
}

/* ============================================================
   TIMELINE EXPERIENCIA — entrada suave
   ============================================================ */
function initTimelineAnimation() {
  gsap.utils.toArray('.timeline__item').forEach((item, i) => {
    const card  = item.querySelector('.version-card');
    const tags  = item.querySelectorAll('.skill-tag');
    const tag   = item.querySelector('.version-card__tag');
    const title = item.querySelector('.version-card__title');
    const desc  = item.querySelector('.version-card__desc');

    if (!card) return;

    gsap.set(card, { autoAlpha: 0, x: -15 });
    if (tag)   gsap.set(tag,   { autoAlpha: 0, x: -8 });
    if (title) gsap.set(title, { autoAlpha: 0, y: 8 });
    if (desc)  gsap.set(desc,  { autoAlpha: 0, y: 8 });
    if (tags.length) gsap.set(tags, { autoAlpha: 0, y: 6 });

    ScrollTrigger.create({
      trigger: item,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        const tl = gsap.timeline({ delay: Math.min(i * 0.05, 0.3) });
        tl.to(card, { autoAlpha: 1, x: 0, duration: 0.7, ease: 'power2.out' });
        if (tag)   tl.to(tag,   { autoAlpha: 1, x: 0, duration: 0.4 }, '-=0.5');
        if (title) tl.to(title, { autoAlpha: 1, y: 0, duration: 0.45 }, '-=0.4');
        if (desc)  tl.to(desc,  { autoAlpha: 1, y: 0, duration: 0.4 }, '-=0.35');
        if (tags.length) {
          tl.to(tags, {
            autoAlpha: 1, y: 0,
            duration: 0.3, stagger: 0.03
          }, '-=0.3');
        }
      }
    });
  });
}

/* ============================================================
   SKILL BARS — animación suave
   ============================================================ */
function initProgressBars() {
  const bars = document.querySelectorAll('.progress-fill[data-width]');
  if (!bars.length) return;

  bars.forEach(bar => {
    const targetWidth = bar.getAttribute('data-width');
    gsap.set(bar, { width: '0%' });

    ScrollTrigger.create({
      trigger: bar,
      start: 'top 90%',
      once: true,
      onEnter: () => {
        gsap.to(bar, {
          width: targetWidth,
          duration: 1.2,
          ease: 'power2.out'
        });
      }
    });
  });
}

/* ============================================================
   STAT COUNTERS — conteo suave
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
      start: 'top 92%',
      once: true,
      onEnter: () => {
        gsap.to(obj, {
          val: target,
          duration: 1.8,
          ease: 'power2.out',
          onUpdate: () => {
            el.textContent = obj.val.toFixed(decimals) + suffix;
          },
          onComplete: () => {
            el.textContent = target.toFixed(decimals) + suffix;
          }
        });
      }
    });
  });
}

/* ============================================================
   PARALLAX ORBS — movimiento suave y sutil
   ============================================================ */
function initParallaxOrbs() {
  const orbs = document.querySelectorAll('.hero__orb');
  if (!orbs.length) return;

  const setters = Array.from(orbs).map((orb, i) => ({
    x: gsap.quickSetter(orb, 'x', 'px'),
    y: gsap.quickSetter(orb, 'y', 'px'),
    factor: (i + 1) * 1.2  // factor reducido
  }));

  let mx = 0, my = 0, cx = 0, cy = 0;

  document.addEventListener('mousemove', e => {
    mx = (e.clientX / window.innerWidth  - 0.5) * 1.2;  // Rango reducido
    my = (e.clientY / window.innerHeight - 0.5) * 1.2;
  }, { passive: true });

  gsap.ticker.add(() => {
    cx += (mx - cx) * 0.08;
    cy += (my - cy) * 0.08;
    setters.forEach(({ x, y, factor }) => {
      x(cx * factor * 20);  // movimiento más sutil
      y(cy * factor * 20);
    });
  });
}

/* ============================================================
   CARD TILT — efecto 3D muy sutil
   ============================================================ */
function initCardTilt() {
  if (window.matchMedia('(pointer: coarse)').matches) return;

  document.querySelectorAll('.card--glow, .version-card, .cert-card').forEach(card => {
    let bounds;
    const glow = document.createElement('div');
    glow.style.cssText = `
      position:absolute; inset:0; border-radius:inherit;
      pointer-events:none; opacity:0; transition:opacity 0.4s ease;
      background: radial-gradient(circle at 50% 50%,
        rgba(167,139,250,0.06) 0%, transparent 70%);
    `;
    if (getComputedStyle(card).position === 'static') card.style.position = 'relative';
    card.appendChild(glow);

    card.addEventListener('mouseenter', () => {
      bounds = card.getBoundingClientRect();
      glow.style.opacity = '1';
      gsap.to(card, { scale: 1.008, duration: 0.4, ease: 'power2.out' });
    });

    card.addEventListener('mousemove', e => {
      if (!bounds) return;
      const x = (e.clientX - bounds.left) / bounds.width  - 0.5;
      const y = (e.clientY - bounds.top)  / bounds.height - 0.5;
      gsap.to(card, {
        rotateY: x * 3,
        rotateX: -y * 3,
        duration: 0.5,
        ease: 'power1.out',
        transformPerspective: 1000
      });
      glow.style.background = `radial-gradient(circle at ${
        (e.clientX - bounds.left) / bounds.width * 100}% ${
        (e.clientY - bounds.top)  / bounds.height * 100}%,
        rgba(167,139,250,0.08) 0%, transparent 70%)`;
    });

    card.addEventListener('mouseleave', () => {
      bounds = null;
      glow.style.opacity = '0';
      gsap.to(card, {
        rotateY: 0, rotateX: 0, scale: 1,
        duration: 0.6,
        ease: 'power2.out',
        transformPerspective: 1000
      });
    });
  });
}

/* ============================================================
   NAVBAR SCROLL — transición suave
   ============================================================ */
function initNavbarScroll() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;
  ScrollTrigger.create({
    start: 'top -30',
    onEnter:     () => navbar.classList.add('scrolled'),
    onLeaveBack: () => navbar.classList.remove('scrolled')
  });
}

/* ============================================================
   PARTÍCULAS — canvas con opacidad reducida
   ============================================================ */
function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  
  // En móvil, desactivar partículas
  if (window.innerWidth <= 768) {
    canvas.style.display = 'none';
    return;
  }

  const ctx = canvas.getContext('2d');
  let W, H, particles = [];

  const C = {
    count: 45,  // menos partículas
    color: '139,92,246',
    colorAlt: '6,182,212',
    maxR: 1.5,
    minR: 0.4,
    speed: 0.2,
    connectDist: 100
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
        opacity: 0.2 + Math.random() * 0.3
      });
    }
  }

  gsap.ticker.add(() => {
    ctx.clearRect(0, 0, W, H);

    // Conexiones más sutiles
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx   = particles[i].x - particles[j].x;
        const dy   = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < C.connectDist) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(${particles[i].color},${(1 - dist / C.connectDist) * 0.12})`;
          ctx.lineWidth = 0.3;
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
    });
  });

  resize(); createParticles();
  window.addEventListener('resize', () => { 
    resize(); 
    createParticles(); 
  }, { passive: true });
}