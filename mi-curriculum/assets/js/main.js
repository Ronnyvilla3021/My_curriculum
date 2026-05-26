/* ============================================================
   MAIN.JS — Lógica general del portfolio
   Navbar, scroll reveal, modales, filtros, tabs
   ============================================================ */

'use strict';

/* ── Esperar a que el DOM esté listo ── */
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initScrollReveal();
  initMobileMenu();
  initModals();
  initProgressBars();
  initActiveNav();
  initFilterTabs();
  initSmoothScroll();
  initTypingEffect();
  initCopyContact();
});

/* ============================================================
   NAVBAR — scroll effect
   ============================================================ */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  const onScroll = () => {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // ejecutar al cargar
}

/* ============================================================
   ACTIVE NAV LINK — resaltar sección actual
   ============================================================ */
function initActiveNav() {
  const sections  = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.navbar__link[href^="#"]');
  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(section => observer.observe(section));
}

/* ============================================================
   SCROLL REVEAL — animar elementos al entrar en viewport
   ============================================================ */
function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal, .reveal--left, .reveal--right');
  if (!elements.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Delay escalonado por índice dentro del parent
        const siblings = Array.from(entry.target.parentElement.children)
          .filter(el => el.classList.contains('reveal') ||
                        el.classList.contains('reveal--left') ||
                        el.classList.contains('reveal--right'));
        const idx = siblings.indexOf(entry.target);
        const delay = idx * 80;

        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);

        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  elements.forEach(el => observer.observe(el));
}

/* ============================================================
   MOBILE MENU — hamburger + sidebar
   ============================================================ */
function initMobileMenu() {
  const hamburger = document.querySelector('.navbar__hamburger');
  const sidebar   = document.querySelector('.sidebar');
  const overlay   = document.querySelector('.sidebar__overlay');
  if (!hamburger) return;

  const toggle = (open) => {
    const isOpen = open ?? !sidebar?.classList.contains('open');
    sidebar?.classList.toggle('open', isOpen);
    overlay?.classList.toggle('active', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';

    // Animar barras del hamburger
    const spans = hamburger.querySelectorAll('span');
    if (spans.length === 3) {
      spans[0].style.transform = isOpen ? 'translateY(7px) rotate(45deg)'  : '';
      spans[1].style.opacity   = isOpen ? '0' : '';
      spans[2].style.transform = isOpen ? 'translateY(-7px) rotate(-45deg)' : '';
    }
  };

  hamburger.addEventListener('click', () => toggle());
  overlay?.addEventListener('click', () => toggle(false));

  // Cerrar al hacer click en un link del sidebar
  document.querySelectorAll('.sidebar a').forEach(link => {
    link.addEventListener('click', () => toggle(false));
  });
}

/* ============================================================
   MODALES — abrir/cerrar lightbox de certificados/documentos
   ============================================================ */
function initModals() {
  // Abrir modal al click en trigger
  document.querySelectorAll('[data-modal]').forEach(trigger => {
    trigger.addEventListener('click', () => {
      const id    = trigger.getAttribute('data-modal');
      const modal = document.querySelector(`#${id}`);
      if (modal) openModal(modal);
    });
  });

  // Cerrar con botón X
  document.querySelectorAll('.modal__close').forEach(btn => {
    btn.addEventListener('click', () => {
      const modal = btn.closest('.modal-overlay');
      if (modal) closeModal(modal);
    });
  });

  // Cerrar al click en overlay
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', e => {
      if (e.target === overlay) closeModal(overlay);
    });
  });

  // Cerrar con Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay.active').forEach(closeModal);
    }
  });
}

function openModal(overlay) {
  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal(overlay) {
  overlay.classList.remove('active');
  document.body.style.overflow = '';
}

/* ============================================================
   PROGRESS BARS — animar al entrar en viewport
   ============================================================ */
function initProgressBars() {
  const bars = document.querySelectorAll('.progress-fill[data-width]');
  if (!bars.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        const width = bar.getAttribute('data-width');
        // Aplicar el ancho directamente al style
        bar.style.width = width;
        observer.unobserve(bar);
      }
    });
  }, { threshold: 0.3 });

  bars.forEach(bar => observer.observe(bar));
}

/* ============================================================
   FILTER TABS — filtrar certificados/proyectos por categoría
   ============================================================ */
function initFilterTabs() {
  document.querySelectorAll('[data-filter-group]').forEach(group => {
    const pills = group.querySelectorAll('.nav-pill');
    const containerId = group.getAttribute('data-filter-group');
    const container   = document.querySelector(`[data-filter-container="${containerId}"]`);
    if (!container) return;

    pills.forEach(pill => {
      pill.addEventListener('click', () => {
        // Activar pill
        pills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');

        const filter = pill.getAttribute('data-filter');
        const items  = container.querySelectorAll('[data-category]');

        items.forEach(item => {
          const match = filter === 'all' || item.getAttribute('data-category') === filter;
          item.style.display    = match ? '' : 'none';
          item.style.opacity    = match ? '1' : '0';
          item.style.transform  = match ? 'scale(1)' : 'scale(0.95)';
          item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        });
      });
    });
  });
}

/* ============================================================
   SMOOTH SCROLL — para links internos
   ============================================================ */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();

      const navbarHeight = document.querySelector('.navbar')?.offsetHeight ?? 64;
      const top = target.getBoundingClientRect().top + window.scrollY - navbarHeight - 16;

      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}

/* ============================================================
   TYPING EFFECT — para el título del hero (CORREGIDO)
   ============================================================ */
function initTypingEffect() {
  const el = document.querySelector('.typing-cursor');
  if (!el) {
    console.warn('No se encontró .typing-cursor');
    return;
  }

  // Limpiar el contenido inicial del span
  el.textContent = '';
  
  // Obtener palabras del atributo data-typing
  let words = [];
  try {
    const typingAttr = el.getAttribute('data-typing');
    if (typingAttr) {
      words = JSON.parse(typingAttr);
      console.log('Palabras cargadas:', words);
    } else {
      words = ['Full Stack Developer', 'Software Engineer', 'Problem Solver'];
    }
  } catch(e) {
    console.error('Error parsing data-typing:', e);
    words = ['Full Stack Developer', 'Software Engineer', 'Problem Solver'];
  }
  
  if (words.length === 0) return;
  
  let wordIdx = 0;
  let charIdx = 0;
  let deleting = false;
  const speed = { type: 100, delete: 50, pause: 2000 };
  
  function type() {
    const currentWord = words[wordIdx];
    
    if (!deleting) {
      // Escribiendo
      el.textContent = currentWord.slice(0, charIdx + 1);
      charIdx++;
      
      if (charIdx === currentWord.length) {
        deleting = true;
        setTimeout(type, speed.pause);
        return;
      }
    } else {
      // Borrando
      el.textContent = currentWord.slice(0, charIdx - 1);
      charIdx--;
      
      if (charIdx === 0) {
        deleting = false;
        wordIdx = (wordIdx + 1) % words.length;
      }
    }
    
    setTimeout(type, deleting ? speed.delete : speed.type);
  }
  
  // Iniciar el efecto
  type();
}

/* ============================================================
   COPY CONTACT — copiar email/teléfono al portapapeles
   ============================================================ */
function initCopyContact() {
  document.querySelectorAll('[data-copy]').forEach(btn => {
    btn.addEventListener('click', () => {
      const text = btn.getAttribute('data-copy');
      navigator.clipboard.writeText(text).then(() => {
        const original = btn.textContent;
        btn.textContent = '✓ Copiado';
        btn.style.color = 'var(--neon-green)';
        setTimeout(() => {
          btn.textContent = original;
          btn.style.color = '';
        }, 2000);
      });
    });
  });
}

/* ============================================================
   UTILIDAD — throttle para eventos de scroll
   ============================================================ */
function throttle(fn, ms) {
  let last = 0;
  return (...args) => {
    const now = Date.now();
    if (now - last >= ms) {
      last = now;
      fn(...args);
    }
  };
}