/* =========================================================
   BHARGAV GOHIL — Portfolio
   Three.js + GSAP Interactive Portfolio
   ========================================================= */

(function () {
    'use strict';

    // ========================
    // 1. LOADING SCREEN
    // ========================
    function initLoader() {
        const counter = document.getElementById('loader-num');
        const progress = document.getElementById('loader-progress');
        const loaderEl = document.getElementById('loader');

        const count = { val: 0 };

        gsap.to(count, {
            val: 100,
            duration: 2.5,
            ease: 'power2.inOut',
            onUpdate: function () {
                const v = Math.floor(count.val);
                counter.textContent = v;
                progress.style.width = v + '%';
            },
            onComplete: function () {
                gsap.to(loaderEl, {
                    yPercent: -100,
                    duration: 0.8,
                    ease: 'power4.inOut',
                    onComplete: function () {
                        loaderEl.style.display = 'none';
                        initHeroAnimations();
                        initScrollAnimations();
                    }
                });
            }
        });
    }

    // ========================
    // 2. HERO ANIMATIONS
    // ========================
    function initHeroAnimations() {
        // Split hero name into characters
        document.querySelectorAll('.hero-name-line').forEach(function (line) {
            var nodes = Array.from(line.childNodes);
            line.innerHTML = '';
            nodes.forEach(function (node) {
                if (node.nodeType === Node.TEXT_NODE) {
                    Array.from(node.textContent).forEach(function (char) {
                        var span = document.createElement('span');
                        span.className = 'char';
                        span.textContent = char === ' ' ? '\u00A0' : char;
                        line.appendChild(span);
                    });
                } else {
                    node.classList.add('char');
                    line.appendChild(node);
                }
            });
        });

        var tl = gsap.timeline();

        tl.to('#navbar', { opacity: 1, y: 0, duration: 0.5 })
            .to('.hero-greeting', { opacity: 1, y: 0, duration: 0.4 }, '-=0.2')
            .set('.hero-name', { opacity: 1 })
            .from('.hero-name-line .char', {
                y: 80,
                opacity: 0,
                duration: 0.5,
                stagger: 0.025,
                ease: 'power4.out'
            }, '-=0.2')
            .to('.hero-tagline', { opacity: 1, y: 0, duration: 0.4 }, '-=0.2')
            .to('.hero-desc', { opacity: 1, y: 0, duration: 0.4 }, '-=0.1')
            .to('.hero-cta', { opacity: 1, y: 0, duration: 0.4 }, '-=0.1')
            .to('.scroll-indicator', { opacity: 1, duration: 0.5 }, '-=0.1');

        // Set initial positions for elements that will animate in
        gsap.set('.hero-greeting', { y: 20 });
        gsap.set('.hero-tagline', { y: 20 });
        gsap.set('.hero-desc', { y: 20 });
        gsap.set('.hero-cta', { y: 20 });
        gsap.set('#navbar', { y: -20 });

        // Restart timeline to play with set positions
        tl.restart();
    }

    // ========================
    // 3. THREE.JS SCENE
    // ========================
    function initThreeScene() {
        var canvas = document.getElementById('bg-canvas');
        if (!canvas) return;

        var scene = new THREE.Scene();
        var camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        var renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            alpha: true,
            antialias: true
        });

        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // Mouse tracking
        var mouse = { x: 0, y: 0 };
        document.addEventListener('mousemove', function (e) {
            mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
        });

        // ---------- Particles ----------
        var particleCount = window.innerWidth < 768 ? 800 : 1500;
        var particleGeometry = new THREE.BufferGeometry();
        var positions = new Float32Array(particleCount * 3);
        var colors = new Float32Array(particleCount * 3);

        var colorCyan = new THREE.Color(0x00e5ff);
        var colorPurple = new THREE.Color(0x7c3aed);

        for (var i = 0; i < particleCount; i++) {
            // Distribute in a sphere
            var theta = Math.random() * Math.PI * 2;
            var phi = Math.acos(2 * Math.random() - 1);
            var r = 3 + Math.random() * 5;

            positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
            positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
            positions[i * 3 + 2] = r * Math.cos(phi);

            // Interpolate between cyan and purple
            var mix = Math.random();
            var c = colorCyan.clone().lerp(colorPurple, mix);
            colors[i * 3] = c.r;
            colors[i * 3 + 1] = c.g;
            colors[i * 3 + 2] = c.b;
        }

        particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        var particleMaterial = new THREE.PointsMaterial({
            size: 0.018,
            vertexColors: true,
            transparent: true,
            opacity: 0.7,
            blending: THREE.AdditiveBlending,
            sizeAttenuation: true
        });

        var particles = new THREE.Points(particleGeometry, particleMaterial);
        scene.add(particles);

        // ---------- Wireframe Shapes ----------
        var shapes = [];

        var shapeConfigs = [
            {
                geo: new THREE.IcosahedronGeometry(1.2, 0),
                pos: [4.5, 1.5, -3],
                color: 0x00e5ff,
                speed: { x: 0.002, y: 0.003 }
            },
            {
                geo: new THREE.TorusGeometry(0.8, 0.25, 8, 20),
                pos: [-4.5, -1.5, -2.5],
                color: 0x7c3aed,
                speed: { x: -0.003, y: 0.002 }
            },
            {
                geo: new THREE.OctahedronGeometry(0.6, 0),
                pos: [2.5, -3, -1.5],
                color: 0x00e5ff,
                speed: { x: 0.001, y: -0.004 }
            },
            {
                geo: new THREE.TetrahedronGeometry(0.5, 0),
                pos: [-3, 3, -4],
                color: 0x7c3aed,
                speed: { x: -0.002, y: 0.001 }
            }
        ];

        shapeConfigs.forEach(function (cfg) {
            var material = new THREE.MeshBasicMaterial({
                color: cfg.color,
                wireframe: true,
                transparent: true,
                opacity: 0.1
            });
            var mesh = new THREE.Mesh(cfg.geo, material);
            mesh.position.set(cfg.pos[0], cfg.pos[1], cfg.pos[2]);
            mesh.userData.speed = cfg.speed;
            scene.add(mesh);
            shapes.push(mesh);
        });

        // Camera
        camera.position.z = 5;

        // ---------- Animation Loop ----------
        function animate() {
            requestAnimationFrame(animate);

            // Rotate particles slowly
            particles.rotation.y += 0.0003;
            particles.rotation.x += 0.0001;

            // Rotate wireframe shapes
            shapes.forEach(function (shape) {
                shape.rotation.x += shape.userData.speed.x;
                shape.rotation.y += shape.userData.speed.y;
            });

            // Mouse parallax on camera
            camera.position.x += (mouse.x * 0.4 - camera.position.x) * 0.04;
            camera.position.y += (mouse.y * 0.3 - camera.position.y) * 0.04;
            camera.lookAt(scene.position);

            renderer.render(scene, camera);
        }
        animate();

        // ---------- Resize ----------
        window.addEventListener('resize', function () {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    // ========================
    // 4. GSAP SCROLL ANIMATIONS
    // ========================
    function revealOnScroll(selector, fromVars, triggerEl, stagger) {
        var elements = gsap.utils.toArray(selector);
        if (!elements.length) return;

        var trigger = triggerEl ? document.querySelector(triggerEl) : null;

        if (stagger && trigger) {
            // Batch reveal with stagger using a single trigger
            gsap.set(elements, fromVars);
            var toVars = { autoAlpha: 1, x: 0, y: 0, scale: 1, duration: fromVars.duration || 0.6, stagger: stagger, ease: 'power3.out', overwrite: true };
            ScrollTrigger.create({
                trigger: trigger,
                start: 'top 90%',
                once: true,
                onEnter: function () { gsap.to(elements, toVars); }
            });
        } else {
            // Individual triggers per element
            elements.forEach(function (el) {
                gsap.set(el, fromVars);
                ScrollTrigger.create({
                    trigger: el,
                    start: 'top 90%',
                    once: true,
                    onEnter: function () {
                        gsap.to(el, { autoAlpha: 1, x: 0, y: 0, scale: 1, duration: fromVars.duration || 0.6, ease: 'power3.out', overwrite: true });
                    }
                });
            });
        }
    }

    function initScrollAnimations() {
        gsap.registerPlugin(ScrollTrigger);

        // Section headings — individual triggers
        revealOnScroll('.section-heading', { autoAlpha: 0, x: -50, duration: 0.7 });

        // About text paragraphs — staggered
        revealOnScroll('.about-text p', { autoAlpha: 0, y: 30, duration: 0.5 }, '.about-text', 0.12);

        // About image
        revealOnScroll('.about-image-wrapper', { autoAlpha: 0, scale: 0.85, duration: 0.7 });

        // Experience cards — staggered
        revealOnScroll('.exp-card', { autoAlpha: 0, y: 40, duration: 0.5 }, '.exp-list', 0.15);

        // Featured project cards — individual triggers
        revealOnScroll('.featured-card', { autoAlpha: 0, y: 50, duration: 0.7 });

        // Other project cards — staggered
        revealOnScroll('.project-card', { autoAlpha: 0, y: 30, duration: 0.4 }, '.projects-grid', 0.1);

        // Contact section children — staggered
        revealOnScroll('.contact-container > *', { autoAlpha: 0, y: 30, duration: 0.5 }, '#contact', 0.1);

        // Marquee parallax
        gsap.to('.marquee-track', {
            scrollTrigger: {
                trigger: '.marquee-section',
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1
            },
            x: '-=80'
        });

        // Recalculate positions after setup
        ScrollTrigger.refresh();
    }

    // ========================
    // 5. CUSTOM CURSOR
    // ========================
    function initCursor() {
        if (window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 768) return;

        var dot = document.getElementById('cursor');
        var follower = document.getElementById('cursor-follower');
        if (!dot || !follower) return;

        document.addEventListener('mousemove', function (e) {
            gsap.to(dot, { x: e.clientX, y: e.clientY, duration: 0.08, ease: 'power2.out' });
            gsap.to(follower, { x: e.clientX, y: e.clientY, duration: 0.25, ease: 'power2.out' });
        });

        // Hover effect on interactive elements
        var targets = document.querySelectorAll('a, button, .magnetic, [data-tilt]');
        targets.forEach(function (el) {
            el.addEventListener('mouseenter', function () {
                dot.classList.add('cursor-hover');
                follower.classList.add('cursor-hover');
            });
            el.addEventListener('mouseleave', function () {
                dot.classList.remove('cursor-hover');
                follower.classList.remove('cursor-hover');
            });
        });

        // Hide cursor when it leaves the window
        document.addEventListener('mouseleave', function () {
            gsap.to([dot, follower], { opacity: 0, duration: 0.2 });
        });
        document.addEventListener('mouseenter', function () {
            gsap.to([dot, follower], { opacity: 1, duration: 0.2 });
        });
    }

    // ========================
    // 6. NAVIGATION
    // ========================
    function initNav() {
        var navbar = document.getElementById('navbar');
        var toggle = document.getElementById('nav-toggle');
        var mobileMenu = document.getElementById('mobile-menu');

        // Navbar background on scroll
        window.addEventListener('scroll', function () {
            if (window.scrollY > 50) {
                navbar.classList.add('nav-scrolled');
            } else {
                navbar.classList.remove('nav-scrolled');
            }
        });

        // Mobile menu toggle
        toggle.addEventListener('click', function () {
            toggle.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });

        // Close menu on link click
        document.querySelectorAll('.mobile-link').forEach(function (link) {
            link.addEventListener('click', function () {
                toggle.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.classList.remove('menu-open');
            });
        });

        // Smooth scroll for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
            anchor.addEventListener('click', function (e) {
                var href = anchor.getAttribute('href');
                if (href === '#') return;
                e.preventDefault();
                var target = document.querySelector(href);
                if (target) {
                    var top = target.getBoundingClientRect().top + window.scrollY - 80;
                    window.scrollTo({ top: top, behavior: 'smooth' });
                }
            });
        });
    }

    // ========================
    // 7. MAGNETIC BUTTONS
    // ========================
    function initMagnetic() {
        if (window.matchMedia('(pointer: coarse)').matches) return;

        document.querySelectorAll('.magnetic').forEach(function (el) {
            el.addEventListener('mousemove', function (e) {
                var rect = el.getBoundingClientRect();
                var x = e.clientX - rect.left - rect.width / 2;
                var y = e.clientY - rect.top - rect.height / 2;
                gsap.to(el, { x: x * 0.25, y: y * 0.25, duration: 0.3, ease: 'power2.out' });
            });

            el.addEventListener('mouseleave', function () {
                gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.4)' });
            });
        });
    }

    // ========================
    // 8. TILT EFFECT
    // ========================
    function initTilt() {
        if (window.matchMedia('(pointer: coarse)').matches) return;

        document.querySelectorAll('[data-tilt]').forEach(function (el) {
            el.addEventListener('mousemove', function (e) {
                var rect = el.getBoundingClientRect();
                var x = (e.clientX - rect.left) / rect.width - 0.5;
                var y = (e.clientY - rect.top) / rect.height - 0.5;
                gsap.to(el, {
                    rotateY: x * 8,
                    rotateX: -y * 8,
                    transformPerspective: 800,
                    duration: 0.4,
                    ease: 'power2.out'
                });
            });

            el.addEventListener('mouseleave', function () {
                gsap.to(el, {
                    rotateY: 0,
                    rotateX: 0,
                    duration: 0.6,
                    ease: 'power2.out'
                });
            });
        });
    }

    // ========================
    // 9. TEXT SCRAMBLE ON HERO NAME HOVER
    // ========================
    function initTextScramble() {
        var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*';

        document.querySelectorAll('.hero-name-line').forEach(function (line) {
            var originalChars = [];
            var charSpans = line.querySelectorAll('.char');
            charSpans.forEach(function (span) {
                originalChars.push(span.textContent);
            });

            line.addEventListener('mouseenter', function () {
                var iterations = 0;
                var interval = setInterval(function () {
                    charSpans.forEach(function (span, index) {
                        if (index < iterations) {
                            span.textContent = originalChars[index];
                        } else {
                            // Don't scramble the accent dot
                            if (span.classList.contains('accent')) return;
                            span.textContent = chars[Math.floor(Math.random() * chars.length)];
                        }
                    });
                    iterations += 1 / 2;
                    if (iterations >= charSpans.length) {
                        clearInterval(interval);
                        // Restore original
                        charSpans.forEach(function (span, index) {
                            span.textContent = originalChars[index];
                        });
                    }
                }, 30);
            });
        });
    }

    // ========================
    // INIT
    // ========================
    document.addEventListener('DOMContentLoaded', function () {
        initLoader();
        initThreeScene();
        initCursor();
        initNav();
        initMagnetic();
        initTilt();

        // Text scramble after hero animations complete
        setTimeout(function () {
            initTextScramble();
        }, 3500);
    });
})();
