/* ============================================================
   MAIN.JS — Con animaciones funcionando correctamente
   ============================================================ */
'use strict';

(function () {

  const isMobile     = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || window.innerWidth <= 768;
  const isTouch      = window.matchMedia('(pointer: coarse)').matches;
  const prefersLess  = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ──────────────────────────────────────────────────────────
     1. FORZAR VISIBILIDAD INICIAL (pero mantener animaciones)
  ────────────────────────────────────────────────────────── */
  function forceInitialVisibility() {
    // Esto hace que TODO sea visible desde el inicio
    const elements = document.querySelectorAll('.cert-card, #documentos .card, #contacto .card, .timeline__item, .version-card');
    elements.forEach(el => {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
  }

  /* ──────────────────────────────────────────────────────────
     2. MENÚ HAMBURGUESA
  ────────────────────────────────────────────────────────── */
  function initMobileMenu() {
    const hamburger = document.querySelector('.navbar__hamburger');
    const sidebar   = document.querySelector('.sidebar');
    const overlay   = document.querySelector('.sidebar__overlay');
    if (!hamburger || !sidebar) return;

    function openMenu()  {
      sidebar.classList.add('open');
      overlay?.classList.add('active');
      hamburger.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    }
    function closeMenu() {
      sidebar.classList.remove('open');
      overlay?.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }

    hamburger.addEventListener('click', () =>
      sidebar.classList.contains('open') ? closeMenu() : openMenu()
    );
    overlay?.addEventListener('click', closeMenu);
    sidebar.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && sidebar.classList.contains('open')) closeMenu();
    });
  }

  /* ──────────────────────────────────────────────────────────
     3. NAVBAR SCROLL
  ────────────────────────────────────────────────────────── */
  function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    let ticking = false;

    function update() {
      navbar.classList.toggle('scrolled', window.scrollY > 40);
      ticking = false;
    }

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    }, { passive: true });
  }

  /* ──────────────────────────────────────────────────────────
     4. REVEAL CON ANIMACIÓN (funcionando correctamente)
  ────────────────────────────────────────────────────────── */
  function initReveal() {
    // Primero, aseguramos que los elementos tengan su estado inicial (ocultos para animar)
    const elements = document.querySelectorAll('.reveal, .reveal--left, .reveal--right, .reveal--scale');
    
    // Establecer estado inicial para animación
    elements.forEach(el => {
      if (el.classList.contains('reveal')) {
        el.style.opacity = '0';
        el.style.transform = 'translateY(24px)';
      } else if (el.classList.contains('reveal--left')) {
        el.style.opacity = '0';
        el.style.transform = 'translateX(-24px)';
      } else if (el.classList.contains('reveal--right')) {
        el.style.opacity = '0';
        el.style.transform = 'translateX(24px)';
      } else if (el.classList.contains('reveal--scale')) {
        el.style.opacity = '0';
        el.style.transform = 'scale(0.95)';
      }
    });

    if (isMobile || prefersLess) {
      // En móvil, hacerlos visibles inmediatamente
      elements.forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'none';
        el.classList.add('visible');
      });
      return;
    }

    // Observer con umbral más temprano
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translate(0) scale(1)';
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { 
      threshold: 0.08,
      rootMargin: '0px 0px -20px 0px'
    });

    elements.forEach(el => observer.observe(el));
  }

  /* ──────────────────────────────────────────────────────────
     5. BARRAS DE PROGRESO
  ────────────────────────────────────────────────────────── */
  function initProgressBars() {
    const bars = document.querySelectorAll('.progress-fill[data-width]');
    if (!bars.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const bar = entry.target;
          setTimeout(() => {
            bar.style.width = bar.getAttribute('data-width');
          }, 150);
          observer.unobserve(bar);
        }
      });
    }, { threshold: 0.3 });

    bars.forEach(bar => {
      bar.style.width = '0%';
      observer.observe(bar);
    });
  }

  /* ──────────────────────────────────────────────────────────
     6. CONTADORES ANIMADOS
  ────────────────────────────────────────────────────────── */
  function initCounters() {
    const counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el       = entry.target;
        const target   = parseFloat(el.getAttribute('data-count'));
        const suffix   = el.getAttribute('data-suffix') || '';
        const decimals = parseInt(el.getAttribute('data-decimals') || '0');
        const duration = 1600;
        let startTime  = null;

        function step(timestamp) {
          if (!startTime) startTime = timestamp;
          const progress = Math.min((timestamp - startTime) / duration, 1);
          const ease  = 1 - Math.pow(1 - progress, 3);
          const value = target * ease;
          el.textContent = value.toFixed(decimals) + suffix;
          if (progress < 1) requestAnimationFrame(step);
          else el.textContent = target.toFixed(decimals) + suffix;
        }

        requestAnimationFrame(step);
        observer.unobserve(el);
      });
    }, { threshold: 0.5 });

    counters.forEach(el => observer.observe(el));
  }

  /* ──────────────────────────────────────────────────────────
     7. EFECTO MÁQUINA DE ESCRIBIR
  ────────────────────────────────────────────────────────── */
  function initTyping() {
    const el = document.querySelector('.typing-cursor');
    if (!el) return;

    let texts;
    try { texts = JSON.parse(el.getAttribute('data-typing') || '[]'); }
    catch { texts = ['Full Stack Developer']; }
    if (!texts.length) return;

    let tIdx = 0, cIdx = 0, deleting = false;

    function tick() {
      const current = texts[tIdx];

      if (deleting) {
        cIdx--;
        el.textContent = current.slice(0, cIdx);
      } else {
        cIdx++;
        el.textContent = current.slice(0, cIdx);
      }

      let delay = deleting ? 35 : 65;

      if (!deleting && cIdx === current.length) {
        delay = 2200;
        deleting = true;
      } else if (deleting && cIdx === 0) {
        deleting = false;
        tIdx = (tIdx + 1) % texts.length;
        delay = 350;
      }

      setTimeout(tick, delay);
    }

    setTimeout(tick, 800);
  }

  /* ──────────────────────────────────────────────────────────
     8. MODALES
  ────────────────────────────────────────────────────────── */
  function initModals() {
    document.querySelectorAll('[data-modal]').forEach(trigger => {
      trigger.addEventListener('click', () => {
        const modal = document.getElementById(trigger.getAttribute('data-modal'));
        if (!modal) return;
        modal.classList.add('active');
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
      });
    });

    document.querySelectorAll('.modal-overlay').forEach(overlay => {
      overlay.addEventListener('click', e => {
        if (e.target === overlay) closeModal(overlay);
      });
      overlay.querySelector('.modal__close')?.addEventListener('click', () => closeModal(overlay));
    });

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        document.querySelectorAll('.modal-overlay.active').forEach(closeModal);
      }
    });

    function closeModal(overlay) {
      overlay.classList.remove('active');
      overlay.style.display = '';
      document.body.style.overflow = '';
    }
  }

  /* ──────────────────────────────────────────────────────────
     9. COPIAR AL PORTAPAPELES
  ────────────────────────────────────────────────────────── */
  function initCopyButtons() {
    document.querySelectorAll('[data-copy]').forEach(btn => {
      btn.addEventListener('click', async () => {
        const text = btn.getAttribute('data-copy');
        try {
          await navigator.clipboard.writeText(text);
          const orig = btn.textContent;
          btn.textContent = '✓ Copiado';
          btn.style.color = 'var(--neon-green)';
          setTimeout(() => { btn.textContent = orig; btn.style.color = ''; }, 2000);
        } catch {}
      });
    });
  }

  /* ──────────────────────────────────────────────────────────
     10. FILTROS DE CERTIFICADOS - CORREGIDO
  ────────────────────────────────────────────────────────── */
  function initFilters() {
    const btns = document.querySelectorAll('[data-filter]');
    const container = document.querySelector('#certificados .grid-auto');
    
    if (!btns.length || !container) {
      return;
    }

    const items = container.querySelectorAll('[data-category]');

    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        btns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.getAttribute('data-filter');

        items.forEach(item => {
          const match = filter === 'all' || item.getAttribute('data-category') === filter;
          if (match) {
            item.style.display = '';
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          } else {
            item.style.display = 'none';
          }
        });
      });
    });
  }

  /* ──────────────────────────────────────────────────────────
     11. SMOOTH SCROLL
  ────────────────────────────────────────────────────────── */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', e => {
        const href = link.getAttribute('href');
        if (!href || href === '#') return;
        const target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.scrollY - 68;
        window.scrollTo({ top, behavior: 'smooth' });
        history.pushState(null, '', href);
      });
    });
  }

  /* ──────────────────────────────────────────────────────────
     12. PARTÍCULAS
  ────────────────────────────────────────────────────────── */
  function initParticles() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;
    if (isMobile || prefersLess) { canvas.style.display = 'none'; return; }

    const ctx = canvas.getContext('2d');
    let W, H, particles = [], raf;

    const CFG = {
      count:       45,
      colors:      ['139,92,246', '6,182,212'],
      maxR:        1.6,
      minR:        0.4,
      speed:       0.22,
      connectDist: 110,
    };

    function resize() {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }

    function create() {
      particles = Array.from({ length: CFG.count }, () => ({
        x:  Math.random() * W,
        y:  Math.random() * H,
        r:  CFG.minR + Math.random() * (CFG.maxR - CFG.minR),
        vx: (Math.random() - 0.5) * CFG.speed,
        vy: (Math.random() - 0.5) * CFG.speed,
        c:  CFG.colors[Math.random() < 0.25 ? 1 : 0],
        o:  0.15 + Math.random() * 0.25,
      }));
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);

      for (let i = 0; i < particles.length; i++) {
        const pi = particles[i];
        pi.x += pi.vx; pi.y += pi.vy;
        if (pi.x < 0 || pi.x > W) pi.vx *= -1;
        if (pi.y < 0 || pi.y > H) pi.vy *= -1;

        for (let j = i + 1; j < particles.length; j++) {
          const pj = particles[j];
          const dx = pi.x - pj.x, dy = pi.y - pj.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < CFG.connectDist * CFG.connectDist) {
            const alpha = (1 - Math.sqrt(d2) / CFG.connectDist) * 0.12;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(${pi.c},${alpha})`;
            ctx.lineWidth   = 0.4;
            ctx.moveTo(pi.x, pi.y);
            ctx.lineTo(pj.x, pj.y);
            ctx.stroke();
          }
        }

        ctx.beginPath();
        ctx.arc(pi.x, pi.y, pi.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${pi.c},${pi.o})`;
        ctx.fill();
      }

      raf = requestAnimationFrame(draw);
    }

    resize(); create(); draw();

    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => { resize(); create(); }, 200);
    }, { passive: true });

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) { cancelAnimationFrame(raf); }
      else { raf = requestAnimationFrame(draw); }
    });
  }

  /* ──────────────────────────────────────────────────────────
     13. ORBS PARALLAX
  ────────────────────────────────────────────────────────── */
  function initParallaxOrbs() {
    if (isMobile || isTouch || prefersLess) return;
    const orbs = document.querySelectorAll('.hero__orb');
    if (!orbs.length) return;

    let mx = 0, my = 0, cx = 0, cy = 0;

    document.addEventListener('mousemove', e => {
      mx = (e.clientX / window.innerWidth  - 0.5);
      my = (e.clientY / window.innerHeight - 0.5);
    }, { passive: true });

    function loop() {
      cx += (mx - cx) * 0.05;
      cy += (my - cy) * 0.05;
      orbs.forEach((orb, i) => {
        const f = (i + 1) * 18;
        orb.style.transform = `translate(${cx * f}px, ${cy * f}px)`;
      });
      requestAnimationFrame(loop);
    }
    loop();
  }

  /* ──────────────────────────────────────────────────────────
     14. CURSOR GLOW
  ────────────────────────────────────────────────────────── */
  function initCursorGlow() {
    if (isMobile || isTouch || prefersLess) return;

    const glow = document.createElement('div');
    Object.assign(glow.style, {
      position:     'fixed',
      pointerEvents:'none',
      zIndex:       '9999',
      width:        '360px',
      height:       '360px',
      borderRadius: '50%',
      background:   'radial-gradient(circle, rgba(139,92,246,0.07) 0%, rgba(139,92,246,0.02) 40%, transparent 70%)',
      transform:    'translate(-50%,-50%)',
      opacity:      '0',
      transition:   'opacity 0.4s ease',
    });
    document.body.appendChild(glow);

    let gx = 0, gy = 0, cgx = 0, cgy = 0;

    document.addEventListener('mousemove', e => { gx = e.clientX; gy = e.clientY; glow.style.opacity = '1'; }, { passive: true });
    document.addEventListener('mouseleave', () => { glow.style.opacity = '0'; });

    function loop() {
      cgx += (gx - cgx) * 0.1;
      cgy += (gy - cgy) * 0.1;
      glow.style.left = cgx + 'px';
      glow.style.top  = cgy + 'px';
      requestAnimationFrame(loop);
    }
    loop();
  }

  /* ──────────────────────────────────────────────────────────
     15. ACTIVE NAV LINK
  ────────────────────────────────────────────────────────── */
  function initActiveNav() {
    const sections  = document.querySelectorAll('section[id]');
    const navLinks  = document.querySelectorAll('.navbar__link');
    const sideLinks = document.querySelectorAll('.sidebar a[href^="#"]');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach(a => {
            a.classList.toggle('active', a.getAttribute('href') === `#${id}`);
          });
          sideLinks.forEach(a => {
            a.classList.toggle('active', a.getAttribute('href') === `#${id}`);
          });
        }
      });
    }, { threshold: 0.35 });

    sections.forEach(s => observer.observe(s));
  }

  /* ──────────────────────────────────────────────────────────
     INIT
  ────────────────────────────────────────────────────────── */
  function init() {
    forceInitialVisibility();
    initMobileMenu();
    initNavbarScroll();
    initReveal();
    initProgressBars();
    initCounters();
    initTyping();
    initModals();
    initCopyButtons();
    initFilters();
    initSmoothScroll();
    initParticles();
    initParallaxOrbs();
    initCursorGlow();
    initActiveNav();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.addEventListener('load', () => {
    forceInitialVisibility();
  });

})();