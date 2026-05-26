// ANIMACIONES FIX - Funciona en PC y Móvil
document.addEventListener('DOMContentLoaded', function() {
    
    // Detectar si es móvil
    const isMobile = window.innerWidth <= 768;
    
    // Configuración según dispositivo
    const animationDuration = isMobile ? 0.3 : 0.6;
    const animationDelay = isMobile ? 0.05 : 0.1;
    
    // 1. ANIMAR ELEMENTOS AL HACER SCROLL (sin ScrollTrigger)
    const animatedElements = document.querySelectorAll('.reveal');
    
    if (animatedElements.length > 0) {
        // Función para verificar si un elemento está visible
        function isElementInViewport(el) {
            const rect = el.getBoundingClientRect();
            const windowHeight = window.innerHeight || document.documentElement.clientHeight;
            return rect.top <= windowHeight - 100 && rect.bottom >= 0;
        }
        
        // Función para animar elementos visibles
        function animateVisibleElements() {
            animatedElements.forEach((el, index) => {
                if (el.classList.contains('animated')) return;
                if (isElementInViewport(el)) {
                    el.classList.add('animated');
                    el.style.opacity = '0';
                    el.style.transform = 'translateY(30px)';
                    setTimeout(() => {
                        el.style.transition = `all ${animationDuration}s ease-out`;
                        el.style.opacity = '1';
                        el.style.transform = 'translateY(0)';
                    }, index * 50);
                }
            });
        }
        
        // Configurar estilos iniciales
        animatedElements.forEach(el => {
            if (!el.classList.contains('animated')) {
                el.style.opacity = '0';
                el.style.transform = 'translateY(30px)';
            }
        });
        
        // Escuchar scroll
        window.addEventListener('scroll', animateVisibleElements);
        window.addEventListener('resize', animateVisibleElements);
        animateVisibleElements();
    }
    
    // 2. ANIMAR BARRAS DE PROGRESO
    const progressBars = document.querySelectorAll('.progress-fill');
    
    function animateProgressBars() {
        progressBars.forEach(bar => {
            if (bar.classList.contains('animated')) return;
            if (isElementInViewport(bar)) {
                bar.classList.add('animated');
                const width = bar.getAttribute('data-width');
                if (width) {
                    setTimeout(() => {
                        bar.style.width = width;
                    }, 200);
                }
            }
        });
    }
    
    if (progressBars.length > 0) {
        progressBars.forEach(bar => {
            const width = bar.getAttribute('data-width');
            if (width) {
                bar.style.width = '0%';
                bar.style.transition = 'width 1s ease-out';
            }
        });
        window.addEventListener('scroll', animateProgressBars);
        animateProgressBars();
    }
    
    // 3. ANIMAR CONTADORES (años de experiencia, proyectos)
    const counters = document.querySelectorAll('.stat-card__value[data-count]');
    
    function animateCounter(counter) {
        const target = parseInt(counter.getAttribute('data-count'));
        const suffix = counter.getAttribute('data-suffix') || '';
        let current = 0;
        const increment = target / 50;
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
    }
    
    function checkCounters() {
        counters.forEach(counter => {
            if (counter.classList.contains('animated')) return;
            if (isElementInViewport(counter)) {
                counter.classList.add('animated');
                animateCounter(counter);
            }
        });
    }
    
    if (counters.length > 0) {
        window.addEventListener('scroll', checkCounters);
        checkCounters();
    }
    
    // 4. TEXTO CON EFECTO MÁQUINA DE ESCRIBIR
    const typingElements = document.querySelectorAll('.typing-cursor');
    
    typingElements.forEach(element => {
        const textsAttr = element.getAttribute('data-typing');
        if (textsAttr) {
            try {
                const texts = JSON.parse(textsAttr);
                let textIndex = 0;
                let charIndex = 0;
                let isDeleting = false;
                
                function typeEffect() {
                    const currentText = texts[textIndex];
                    if (isDeleting) {
                        element.textContent = currentText.substring(0, charIndex - 1);
                        charIndex--;
                    } else {
                        element.textContent = currentText.substring(0, charIndex + 1);
                        charIndex++;
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
            }
        }
    });
    
});