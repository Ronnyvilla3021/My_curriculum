// Detectar móvil por resolución o por navigator
const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

if (isMobileDevice) {
  // Reducir número de partículas
  const particleCount = 30; // menos partículas
  
  // O desactivar completamente el canvas
  const canvas = document.getElementById('particles-canvas');
  if (canvas) canvas.style.display = 'none';
}

/* ============================================================
   ANIMATIONS.JS — Efectos visuales avanzados
   Partículas canvas, parallax, orbs, efecto cursor
   ============================================================ */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
  initParticles();
  initParallaxOrbs();
  initCursorGlow();
  initStatCounters();
  initAudioBars();
});

/* ============================================================
   PARTÍCULAS — canvas de puntos flotantes
   ============================================================ */
function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let W, H, particles = [];

  const CONFIG = {
    count:       60,
    color:       '139, 92, 246',   // purple
    colorAlt:    '6, 182, 212',    // cyan
    maxRadius:   2,
    minRadius:   0.5,
    speed:       0.3,
    connectDist: 130,
    opacity:     0.5,
  };

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function createParticles() {
    particles = [];
    for (let i = 0; i < CONFIG.count; i++) {
      const isCyan = Math.random() < 0.25;
      particles.push({
        x:    Math.random() * W,
        y:    Math.random() * H,
        r:    CONFIG.minRadius + Math.random() * (CONFIG.maxRadius - CONFIG.minRadius),
        vx:   (Math.random() - 0.5) * CONFIG.speed,
        vy:   (Math.random() - 0.5) * CONFIG.speed,
        color: isCyan ? CONFIG.colorAlt : CONFIG.color,
        opacity: 0.3 + Math.random() * 0.5,
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Dibujar conexiones
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx   = particles[i].x - particles[j].x;
        const dy   = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < CONFIG.connectDist) {
          const alpha = (1 - dist / CONFIG.connectDist) * 0.3;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(${particles[i].color}, ${alpha})`;
          ctx.lineWidth   = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    // Dibujar partículas
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.color}, ${p.opacity})`;
      ctx.fill();

      // Halo suave
      const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4);
      grad.addColorStop(0, `rgba(${p.color}, 0.15)`);
      grad.addColorStop(1, `rgba(${p.color}, 0)`);
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * 4, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();
    });
  }

  function update() {
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;

      // Rebotar en los bordes
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
    });
  }

  function loop() {
    draw();
    update();
    requestAnimationFrame(loop);
  }

  resize();
  createParticles();
  loop();

  window.addEventListener('resize', () => {
    resize();
    createParticles();
  }, { passive: true });
}

/* ============================================================
   PARALLAX ORBS — los orbs del hero se mueven con el mouse
   ============================================================ */
function initParallaxOrbs() {
  const orbs = document.querySelectorAll('.hero__orb');
  if (!orbs.length) return;

  let mouseX = 0, mouseY = 0;
  let currentX = 0, currentY = 0;
  const strength = 0.025;

  document.addEventListener('mousemove', e => {
    mouseX = (e.clientX / window.innerWidth  - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  }, { passive: true });

  function animateOrbs() {
    currentX += (mouseX - currentX) * 0.06;
    currentY += (mouseY - currentY) * 0.06;

    orbs.forEach((orb, i) => {
      const factor = (i + 1) * strength * 60;
      const tx = currentX * factor;
      const ty = currentY * factor;
      orb.style.transform = `translate(${tx}px, ${ty}px)`;
    });

    requestAnimationFrame(animateOrbs);
  }

  animateOrbs();
}

/* ============================================================
   CURSOR GLOW — halo que sigue al cursor
   ============================================================ */
function initCursorGlow() {
  // Solo en desktop
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const glow = document.createElement('div');
  glow.id = 'cursor-glow';
  glow.style.cssText = `
    position: fixed;
    pointer-events: none;
    z-index: 9999;
    width: 400px;
    height: 400px;
    border-radius: 50%;
    background: radial-gradient(circle,
      rgba(139,92,246,0.06) 0%,
      rgba(139,92,246,0.02) 40%,
      transparent 70%
    );
    transform: translate(-50%, -50%);
    transition: opacity 0.3s ease;
    opacity: 0;
  `;
  document.body.appendChild(glow);

  let glowX = 0, glowY = 0;
  let currentX = 0, currentY = 0;

  document.addEventListener('mousemove', e => {
    glowX = e.clientX;
    glowY = e.clientY;
    glow.style.opacity = '1';
  }, { passive: true });

  document.addEventListener('mouseleave', () => {
    glow.style.opacity = '0';
  });

  function animateGlow() {
    currentX += (glowX - currentX) * 0.1;
    currentY += (glowY - currentY) * 0.1;
    glow.style.left = `${currentX}px`;
    glow.style.top  = `${currentY}px`;
    requestAnimationFrame(animateGlow);
  }

  animateGlow();
}

/* ============================================================
   STAT COUNTERS — animar números al entrar en viewport
   ============================================================ */
function initStatCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
}

function animateCounter(el) {
  const target   = parseFloat(el.getAttribute('data-count'));
  const duration = 1800;
  const suffix   = el.getAttribute('data-suffix') ?? '';
  const decimals = Number(el.getAttribute('data-decimals') ?? 0);
  let start      = null;

  function step(timestamp) {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const ease     = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    const value    = target * ease;

    el.textContent = value.toFixed(decimals) + suffix;

    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target.toFixed(decimals) + suffix;
  }

  requestAnimationFrame(step);
}

/* ============================================================
   AUDIO BARS — equalizer decorativo (hero o fondo)
   ============================================================ */
function initAudioBars() {
  const containers = document.querySelectorAll('.audio-bars');
  if (!containers.length) return;

  containers.forEach(container => {
    const bars = container.querySelectorAll('.audio-bar');
    bars.forEach((bar, i) => {
      const delay    = i * 120;
      const duration = 600 + Math.random() * 400;
      bar.style.animation = `wave ${duration}ms ease-in-out ${delay}ms infinite`;
    });
  });
}

/* ============================================================
   UTILIDAD — debounce
   ============================================================ */
function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}