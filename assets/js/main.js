/* ============================================================
   MAIN.JS — Interacciones y animaciones del portafolio
   Reveal basado en clases CSS (sin estilos inline que pisen el hover)
   ============================================================ */
'use strict';

(function () {

  const isMobile    = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || window.innerWidth <= 768;
  const isTouch     = window.matchMedia('(pointer: coarse)').matches;
  const prefersLess = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const NAV_BREAKPOINT = 1280; // debe coincidir con el media query del menú en layout.css

  /* ──────────────────────────────────────────────────────────
     1. MENÚ HAMBURGUESA
  ────────────────────────────────────────────────────────── */
  function initMobileMenu() {
    const hamburger = document.querySelector('.navbar__hamburger');
    const sidebar   = document.querySelector('.sidebar');
    const overlay   = document.querySelector('.sidebar__overlay');
    if (!hamburger || !sidebar) return;

    hamburger.setAttribute('aria-expanded', 'false');

    function openMenu() {
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

    // Si se agranda la ventana con el menú abierto, no dejar el scroll bloqueado
    window.addEventListener('resize', () => {
      if (window.innerWidth > NAV_BREAKPOINT && sidebar.classList.contains('open')) closeMenu();
    }, { passive: true });
  }

  /* ──────────────────────────────────────────────────────────
     2. NAVBAR SCROLL
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

    update(); // por si la página carga ya con scroll (recarga o enlace con #)
  }

  /* ──────────────────────────────────────────────────────────
     3. REVEAL AL HACER SCROLL
     Todo es visible por defecto (CSS). Solo si hay animación se agrega
     .animate-out (oculto) y luego .visible. Sin estilos inline: así el hover
     de las cards y el filtro de certificados siguen funcionando.
  ────────────────────────────────────────────────────────── */
  function showEl(el) {
    el.classList.remove('animate-out');
    el.classList.add('visible');
  }

  function initReveal() {
    // El hero lo anima GSAP en desktop; en móvil se muestra directo
    const elements = Array.from(
      document.querySelectorAll('.reveal, .reveal--left, .reveal--right, .reveal--scale')
    ).filter(el => !el.closest('.hero'));

    // Sin animación: móvil, movimiento reducido o navegador sin IntersectionObserver
    if (isMobile || prefersLess || !('IntersectionObserver' in window)) {
      elements.forEach(showEl);
      return;
    }

    elements.forEach(el => el.classList.add('animate-out'));

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        observer.unobserve(el);

        // Escalonado: las clases delay-100, delay-200... se aplican aquí
        const m = el.className.match(/\bdelay-(\d+)\b/);
        const delay = m ? parseInt(m[1], 10) : 0;
        delay ? setTimeout(() => showEl(el), delay) : showEl(el);
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -20px 0px' });

    elements.forEach(el => observer.observe(el));
  }

  /* ──────────────────────────────────────────────────────────
     4. CONTADORES ANIMADOS
  ────────────────────────────────────────────────────────── */
  function initCounters() {
    const counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;

    const fmt = el => {
      const target   = parseFloat(el.getAttribute('data-count'));
      const suffix   = el.getAttribute('data-suffix') || '';
      const decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
      return { target, suffix, decimals };
    };

    if (prefersLess || !('IntersectionObserver' in window)) {
      counters.forEach(el => {
        const { target, suffix, decimals } = fmt(el);
        el.textContent = target.toFixed(decimals) + suffix;
      });
      return;
    }

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const { target, suffix, decimals } = fmt(el);
        const duration = 1600;
        let startTime = null;

        function step(timestamp) {
          if (!startTime) startTime = timestamp;
          const progress = Math.min((timestamp - startTime) / duration, 1);
          const ease = 1 - Math.pow(1 - progress, 3);
          el.textContent = (target * ease).toFixed(decimals) + suffix;
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
     5. EFECTO MÁQUINA DE ESCRIBIR
  ────────────────────────────────────────────────────────── */
  function initTyping() {
    const el = document.querySelector('.typing-cursor');
    if (!el) return;

    let texts;
    try { texts = JSON.parse(el.getAttribute('data-typing') || '[]'); }
    catch { texts = ['Full Stack Developer']; }
    if (!texts.length) return;

    // Movimiento reducido: texto fijo, sin escribir/borrar
    if (prefersLess) { el.textContent = texts[0]; return; }

    let tIdx = 0, cIdx = 0, deleting = false;

    function tick() {
      const current = texts[tIdx];

      cIdx += deleting ? -1 : 1;
      el.textContent = current.slice(0, cIdx);

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
     6. MODALES
  ────────────────────────────────────────────────────────── */
  function initModals() {
    let lastFocused = null;
    const focusableSel = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

    function openModal(trigger) {
      const modal = document.getElementById(trigger.getAttribute('data-modal'));
      if (!modal) return;
      lastFocused = trigger;
      modal.classList.add('active');
      modal.style.display = 'flex';
      document.body.style.overflow = 'hidden';
      const dialog   = modal.querySelector('.modal');
      const closeBtn = modal.querySelector('.modal__close');
      (closeBtn || dialog)?.focus();
    }

    function closeModal(overlay) {
      overlay.classList.remove('active');
      overlay.style.display = '';
      document.body.style.overflow = '';
      lastFocused?.focus();
    }

    document.querySelectorAll('[data-modal]').forEach(trigger => {
      trigger.addEventListener('click', () => openModal(trigger));

      // Las cards son <div>: hacerlas accesibles con teclado (Enter / Espacio)
      if (!/^(A|BUTTON)$/.test(trigger.tagName)) {
        trigger.setAttribute('tabindex', '0');
        trigger.setAttribute('role', 'button');
        trigger.addEventListener('keydown', e => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openModal(trigger);
          }
        });
      }
    });

    document.querySelectorAll('.modal-overlay').forEach(overlay => {
      overlay.addEventListener('click', e => {
        if (e.target === overlay) closeModal(overlay);
      });
      overlay.querySelector('.modal__close')?.addEventListener('click', () => closeModal(overlay));

      // Atrapar el Tab dentro del modal mientras está abierto
      overlay.addEventListener('keydown', e => {
        if (e.key !== 'Tab' || !overlay.classList.contains('active')) return;
        const focusable = Array.from(overlay.querySelectorAll(focusableSel));
        if (!focusable.length) return;
        const first = focusable[0];
        const last  = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      });
    });

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        document.querySelectorAll('.modal-overlay.active').forEach(closeModal);
      }
    });
  }

  /* ──────────────────────────────────────────────────────────
     7. COPIAR AL PORTAPAPELES
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
        } catch {
          btn.textContent = 'Copia manual';
          setTimeout(() => { btn.textContent = 'Copiar'; }, 2000);
        }
      });
    });
  }

  /* ──────────────────────────────────────────────────────────
     8. FILTROS DE CERTIFICADOS
  ────────────────────────────────────────────────────────── */
  function initFilters() {
    const btns      = document.querySelectorAll('#certificados [data-filter]');
    const container = document.querySelector('#certificados .grid-auto');
    if (!btns.length || !container) return;

    const items = container.querySelectorAll('[data-category]');

    btns.forEach(btn => {
      btn.setAttribute('aria-pressed', btn.classList.contains('active') ? 'true' : 'false');

      btn.addEventListener('click', () => {
        btns.forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-pressed', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');

        const filter = btn.getAttribute('data-filter');

        items.forEach(item => {
          const match = filter === 'all' || item.getAttribute('data-category') === filter;
          item.style.display = match ? '' : 'none';
          if (match) showEl(item); // que no quede oculto si aún no había entrado en pantalla
        });
      });
    });
  }

  /* ──────────────────────────────────────────────────────────
     9. SMOOTH SCROLL
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
        window.scrollTo({ top, behavior: prefersLess ? 'auto' : 'smooth' });
        history.pushState(null, '', href);
      });
    });
  }

  /* ──────────────────────────────────────────────────────────
     10. PARTÍCULAS
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
     11. ORBS PARALLAX
     Usa la propiedad CSS "translate" (no "transform") para no pelear con
     la animación de entrada de GSAP, que sí usa transform.
     El loop solo corre mientras el mouse se mueve.
  ────────────────────────────────────────────────────────── */
  function initParallaxOrbs() {
    if (isMobile || isTouch || prefersLess) return;
    const orbs = document.querySelectorAll('.hero__orb');
    if (!orbs.length) return;

    let mx = 0, my = 0, cx = 0, cy = 0, running = false;

    function loop() {
      cx += (mx - cx) * 0.05;
      cy += (my - cy) * 0.05;
      orbs.forEach((orb, i) => {
        const f = (i + 1) * 18;
        orb.style.translate = `${cx * f}px ${cy * f}px`;
      });

      if (Math.abs(mx - cx) > 0.001 || Math.abs(my - cy) > 0.001) {
        requestAnimationFrame(loop);
      } else {
        running = false;
      }
    }

    document.addEventListener('mousemove', e => {
      mx = e.clientX / window.innerWidth  - 0.5;
      my = e.clientY / window.innerHeight - 0.5;
      if (!running) { running = true; requestAnimationFrame(loop); }
    }, { passive: true });
  }

  /* ──────────────────────────────────────────────────────────
     12. CURSOR GLOW (solo mientras el mouse se mueve)
  ────────────────────────────────────────────────────────── */
  function initCursorGlow() {
    if (isMobile || isTouch || prefersLess) return;

    const glow = document.createElement('div');
    glow.setAttribute('aria-hidden', 'true');
    Object.assign(glow.style, {
      position:      'fixed',
      pointerEvents: 'none',
      zIndex:        '9999',
      width:         '360px',
      height:        '360px',
      borderRadius:  '50%',
      background:    'radial-gradient(circle, rgba(139,92,246,0.07) 0%, rgba(139,92,246,0.02) 40%, transparent 70%)',
      transform:     'translate(-50%,-50%)',
      opacity:       '0',
      transition:    'opacity 0.4s ease',
    });
    document.body.appendChild(glow);

    let gx = 0, gy = 0, cgx = 0, cgy = 0, running = false;

    function loop() {
      cgx += (gx - cgx) * 0.1;
      cgy += (gy - cgy) * 0.1;
      glow.style.left = cgx + 'px';
      glow.style.top  = cgy + 'px';

      if (Math.abs(gx - cgx) > 0.3 || Math.abs(gy - cgy) > 0.3) {
        requestAnimationFrame(loop);
      } else {
        running = false;
      }
    }

    document.addEventListener('mousemove', e => {
      gx = e.clientX;
      gy = e.clientY;
      glow.style.opacity = '1';
      if (!running) { running = true; requestAnimationFrame(loop); }
    }, { passive: true });

    document.documentElement.addEventListener('mouseleave', () => {
      glow.style.opacity = '0';
    });
  }

  /* ──────────────────────────────────────────────────────────
     13. LINK ACTIVO EN EL MENÚ (scrollspy)
     Banda delgada en el centro de la pantalla: funciona también con
     secciones muy altas (como Certificados), que con threshold nunca
     llegaban a activarse.
  ────────────────────────────────────────────────────────── */
  function initActiveNav() {
    const sections  = document.querySelectorAll('section[id]');
    const navLinks  = document.querySelectorAll('.navbar__link');
    const sideLinks = document.querySelectorAll('.sidebar a[href^="#"]');
    if (!sections.length || !('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const id = entry.target.id;
        [...navLinks, ...sideLinks].forEach(a => {
          const active = a.getAttribute('href') === `#${id}`;
          a.classList.toggle('active', active);
          if (active) a.setAttribute('aria-current', 'true');
          else a.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

    sections.forEach(s => observer.observe(s));
  }

  /* ──────────────────────────────────────────────────────────
     INIT
  ────────────────────────────────────────────────────────── */
  function init() {
    initMobileMenu();
    initNavbarScroll();
    initReveal();
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

})();
