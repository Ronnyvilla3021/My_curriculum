# Portafolio Web — Ronny Antonio Villa Villa

🔗 **Sitio en vivo:** https://ronnyvilla3021.github.io/My_curriculum/

## Sobre el proyecto

Portafolio y currículum interactivo de **Ronny Antonio Villa Villa**, Full Stack Developer. Es un sitio de una sola página (SPA estática, sin build step) que reúne experiencia laboral, prácticas profesionales, stack técnico, proyectos personales, certificados y documentos oficiales, con una estética cyberpunk/neón inspirada en interfaces de terminal.

## Tech stack

- **HTML5 + CSS3** — sin framework, con variables CSS (design tokens) para colores, tipografía y espaciado
- **JavaScript vanilla (ES6+)** — sin dependencias de runtime
- **GSAP + ScrollTrigger** (vía CDN) — animaciones de entrada y scroll en desktop
- **Sin bundler** — sitio 100% estático, desplegado directo en GitHub Pages

## Estructura

```
My_curriculum/
├── index.html
├── assets/
│   ├── css/        (theme, layout, components, animations)
│   └── js/         (main, animations, gsap-animations)
├── Doc/
│   ├── certificados/
│   ├── cartas_recomendacion/
│   ├── documentos_generales/
│   ├── Estudios/
│   └── Foto perfil/
├── robots.txt
├── sitemap.xml
└── site.webmanifest
```

## Características

- **Responsive real** para Android, iOS, tablets y desktop: `safe-area-inset` para el notch, objetivos táctiles de 44×44px mínimo, sin salto de layout en Safari móvil
- **Instalable como app (PWA ligera)** — `site.webmanifest` + ícono para "Agregar a pantalla de inicio" en Android/iOS
- **Accesibilidad**: navegación por teclado, modales con foco atrapado (`role="dialog"`, `aria-modal`, `aria-labelledby`), skip-link al contenido principal
- **SEO**: metadatos Open Graph y Twitter Card, datos estructurados JSON-LD (`schema.org/Person`), `sitemap.xml` y `robots.txt`
- **22 certificados** con miniatura real y modal de detalle
- **Sección de proyectos** con los repositorios personales, enlazados a GitHub y a sus demos en vivo
- **Documentos descargables**: CV en PDF y cartas de recomendación

## Cómo correrlo localmente

No requiere instalación ni build. Basta con un servidor estático:

```bash
npx serve .
```

o simplemente abrir `index.html` en el navegador.

## Autor

**Ronny Antonio Villa Villa** — Full Stack Developer
- GitHub: [@Ronnyvilla3021](https://github.com/Ronnyvilla3021)
- LinkedIn: [ronny-antonio-villa-villa](https://www.linkedin.com/in/ronny-antonio-villa-villa/)
- Email: ronnievillavilla@gmail.com
