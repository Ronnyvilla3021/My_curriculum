// ============================================================
// CV DEFINITIVO - Estable y funcional en todos los dispositivos
// Sin errores de visibilidad, sin dependencias complejas
// ============================================================

(function() {
    'use strict';
    
    // ------------------------------------------------------------------
    // 1. MOSTRAR TODO EL CONTENIDO INMEDIATAMENTE (sin opacidad 0)
    // ------------------------------------------------------------------
    function mostrarContenidoInmediato() {
        // Eliminar cualquier estilo que oculte elementos
        const elementosOcultos = document.querySelectorAll('[style*="opacity: 0"], [style*="visibility: hidden"], .reveal');
        
        elementosOcultos.forEach(el => {
            el.style.opacity = '1';
            el.style.transform = 'none';
            el.style.visibility = 'visible';
            el.style.transition = 'none';
        });
        
        // Asegurar que las secciones principales sean visibles
        const secciones = document.querySelectorAll('.hero, .section, .card, .timeline__item, .bento-grid, .cert-card');
        secciones.forEach(el => {
            el.style.opacity = '1';
            el.style.transform = 'none';
        });
    }
    
    // ------------------------------------------------------------------
    // 2. MENÚ HAMBURGUESA (responsive)
    // ------------------------------------------------------------------
    function initMobileMenu() {
        const hamburger = document.querySelector('.navbar__hamburger');
        const sidebar = document.querySelector('.sidebar');
        const overlay = document.querySelector('.sidebar__overlay');
        
        if (!hamburger || !sidebar) return;
        
        function toggleMenu() {
            sidebar.classList.toggle('open');
            if (overlay) overlay.classList.toggle('active');
            const expanded = sidebar.classList.contains('open');
            hamburger.setAttribute('aria-expanded', expanded);
        }
        
        hamburger.addEventListener('click', toggleMenu);
        
        if (overlay) {
            overlay.addEventListener('click', toggleMenu);
        }
        
        // Cerrar menú al hacer click en un enlace
        sidebar.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                sidebar.classList.remove('open');
                if (overlay) overlay.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
            });
        });
    }
    
    // ------------------------------------------------------------------
    // 3. NAVBAR SCROLL (cambia fondo al hacer scroll)
    // ------------------------------------------------------------------
    function initNavbarScroll() {
        const navbar = document.querySelector('.navbar');
        if (!navbar) return;
        
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }
    
    // ------------------------------------------------------------------
    // 4. ANIMACIÓN DE BARRAS DE PROGRESO (solo cuando son visibles)
    // ------------------------------------------------------------------
    function initProgressBars() {
        const progressBars = document.querySelectorAll('.progress-fill');
        if (progressBars.length === 0) return;
        
        // Guardar el ancho objetivo
        progressBars.forEach(bar => {
            const width = bar.getAttribute('data-width');
            if (width) {
                bar.style.width = '0%';
                bar.style.transition = 'width 0.8s ease-out';
                bar.setAttribute('data-target-width', width);
            }
        });
        
        // Detectar cuándo son visibles
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const bar = entry.target;
                    const targetWidth = bar.getAttribute('data-target-width');
                    if (targetWidth && bar.style.width !== targetWidth) {
                        setTimeout(() => {
                            bar.style.width = targetWidth;
                        }, 200);
                    }
                    observer.unobserve(bar);
                }
            });
        }, { threshold: 0.3 });
        
        progressBars.forEach(bar => observer.observe(bar));
    }
    
    // ------------------------------------------------------------------
    // 5. CONTADORES (años de experiencia, proyectos)
    // ------------------------------------------------------------------
    function initCounters() {
        const counters = document.querySelectorAll('.stat-card__value[data-count]');
        if (counters.length === 0) return;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    if (counter.classList.contains('counted')) return;
                    counter.classList.add('counted');
                    
                    const target = parseInt(counter.getAttribute('data-count'));
                    const suffix = counter.getAttribute('data-suffix') || '';
                    let current = 0;
                    const increment = Math.ceil(target / 50);
                    
                    const updateCounter = () => {
                        current += increment;
                        if (current < target) {
                            counter.textContent = Math.floor(current) + suffix;
                            requestAnimationFrame(updateCounter);
                        } else {
                            counter.textContent = target + suffix;
                        }
                    };
                    updateCounter();
                    observer.unobserve(counter);
                }
            });
        }, { threshold: 0.5 });
        
        counters.forEach(counter => observer.observe(counter));
    }
    
    // ------------------------------------------------------------------
    // 6. EFECTO MÁQUINA DE ESCRIBIR
    // ------------------------------------------------------------------
    function initTypingEffect() {
        const typingElement = document.querySelector('.typing-cursor');
        if (!typingElement) return;
        
        const textsAttr = typingElement.getAttribute('data-typing');
        if (!textsAttr) return;
        
        try {
            const texts = JSON.parse(textsAttr);
            let textIndex = 0;
            let charIndex = 0;
            let isDeleting = false;
            
            function typeEffect() {
                const currentText = texts[textIndex];
                
                if (isDeleting) {
                    charIndex--;
                    typingElement.textContent = currentText.substring(0, charIndex);
                } else {
                    charIndex++;
                    typingElement.textContent = currentText.substring(0, charIndex);
                }
                
                if (!isDeleting && charIndex === currentText.length) {
                    isDeleting = true;
                    setTimeout(typeEffect, 2000);
                    return;
                }
                
                if (isDeleting && charIndex === 0) {
                    isDeleting = false;
                    textIndex = (textIndex + 1) % texts.length;
                    setTimeout(typeEffect, 500);
                    return;
                }
                
                const speed = isDeleting ? 50 : 100;
                setTimeout(typeEffect, speed);
            }
            
            setTimeout(typeEffect, 500);
        } catch(e) {
            console.error('Error en typing effect:', e);
            typingElement.textContent = 'Full Stack Developer';
        }
    }
    
    // ------------------------------------------------------------------
    // 7. MODALES (certificados y documentos)
    // ------------------------------------------------------------------
    function initModals() {
        const modals = document.querySelectorAll('.modal-overlay');
        const triggers = document.querySelectorAll('[data-modal]');
        
        // Abrir modal
        triggers.forEach(trigger => {
            trigger.addEventListener('click', () => {
                const modalId = trigger.getAttribute('data-modal');
                const modal = document.getElementById(modalId);
                if (modal) {
                    modal.classList.add('active');
                    document.body.style.overflow = 'hidden';
                }
            });
        });
        
        // Cerrar modal
        modals.forEach(modal => {
            const closeBtn = modal.querySelector('.modal__close');
            if (closeBtn) {
                closeBtn.addEventListener('click', () => {
                    modal.classList.remove('active');
                    document.body.style.overflow = '';
                });
            }
            
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.remove('active');
                    document.body.style.overflow = '';
                }
            });
        });
    }
    
    // ------------------------------------------------------------------
    // 8. BOTONES DE COPIAR (email, teléfono)
    // ------------------------------------------------------------------
    function initCopyButtons() {
        const copyButtons = document.querySelectorAll('[data-copy]');
        
        copyButtons.forEach(btn => {
            btn.addEventListener('click', async () => {
                const textToCopy = btn.getAttribute('data-copy');
                if (!textToCopy) return;
                
                try {
                    await navigator.clipboard.writeText(textToCopy);
                    
                    // Feedback visual
                    const originalText = btn.textContent;
                    btn.textContent = '✓ Copiado!';
                    btn.style.color = '#10b981';
                    
                    setTimeout(() => {
                        btn.textContent = originalText;
                        btn.style.color = '';
                    }, 2000);
                } catch (err) {
                    console.error('Error al copiar:', err);
                }
            });
        });
    }
    
    // ------------------------------------------------------------------
    // 9. FILTROS DE CERTIFICADOS
    // ------------------------------------------------------------------
    function initFilters() {
        const filterButtons = document.querySelectorAll('[data-filter]');
        const filterContainer = document.querySelector('[data-filter-container]');
        
        if (!filterButtons.length || !filterContainer) return;
        
        const items = filterContainer.querySelectorAll('[data-category]');
        
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const filter = btn.getAttribute('data-filter');
                
                // Actualizar estado activo de los botones
                filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Filtrar elementos
                items.forEach(item => {
                    if (filter === 'all' || item.getAttribute('data-category') === filter) {
                        item.style.display = '';
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'scale(1)';
                        }, 10);
                    } else {
                        item.style.opacity = '0';
                        item.style.transform = 'scale(0.8)';
                        setTimeout(() => {
                            item.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });
    }
    
    // ------------------------------------------------------------------
    // 10. SMOOTH SCROLL PARA ENLACES INTERNOS
    // ------------------------------------------------------------------
    function initSmoothScroll() {
        const links = document.querySelectorAll('a[href^="#"]');
        
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href === '#' || href === '') return;
                
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    const navbarHeight = 64;
                    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Actualizar URL sin recargar
                    history.pushState(null, null, href);
                }
            });
        });
    }
    
    // ------------------------------------------------------------------
    // 11. CANVAS DE PARTÍCULAS (opcional, solo en PC)
    // ------------------------------------------------------------------
    function initParticles() {
        const canvas = document.getElementById('particles-canvas');
        if (!canvas) return;
        
        // Detectar móvil por ancho de pantalla o User Agent
        const isMobile = window.innerWidth <= 768 || /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
        
        if (isMobile) {
            canvas.style.display = 'none';
            return;
        }
        
        // Configuración básica del canvas (si quieres mantenerlo)
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
    }
    
    // ------------------------------------------------------------------
    // INICIALIZAR TODO CUANDO EL DOM ESTÉ LISTO
    // ------------------------------------------------------------------
    document.addEventListener('DOMContentLoaded', function() {
        // PRIMERO: Mostrar todo el contenido inmediatamente
        mostrarContenidoInmediato();
        
        // SEGUNDO: Inicializar todos los componentes
        initMobileMenu();
        initNavbarScroll();
        initProgressBars();
        initCounters();
        initTypingEffect();
        initModals();
        initCopyButtons();
        initFilters();
        initSmoothScroll();
        initParticles();
        
        // Eliminar cualquier clase que pueda estar ocultando elementos
        document.body.classList.add('loaded');
    });
    
    // Asegurar que todo sea visible incluso si el DOMContentLoaded ya pasó
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', mostrarContenidoInmediato);
    } else {
        mostrarContenidoInmediato();
    }
    
    // También al cargar completamente (para imágenes)
    window.addEventListener('load', function() {
        mostrarContenidoImmediato();
        // Revisar contadores y barras de progreso nuevamente
        initProgressBars();
        initCounters();
    });
    
})();