/* ==========================================================================
   NAVEENKUMAR. D - PORTFOLIO SCRIPT ENGINE
   Deep Emerald Cinematic Canvas, Night Mountain Engine, Easter Egg & UI Controllers
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. CINEMATIC MOON, FOG, LIGHTNING & MOUNTAIN CANVAS ENGINE
       ========================================================================== */
    const canvas = document.getElementById('mountain-canvas');
    const ctx = canvas.getContext('2d');
    const flashOverlay = document.getElementById('lightning-flash');
    const fxToggleBtn = document.getElementById('fx-toggle');

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let scrollY = window.scrollY;
    let fxEnabled = true;

    // Mouse Parallax Offset
    let mouseOffset = { x: 0, y: 0 };
    window.addEventListener('mousemove', (e) => {
        mouseOffset.x = (e.clientX / width - 0.5) * 30;
        mouseOffset.y = (e.clientY / height - 0.5) * 15;
    });

    // Handle Window Resize
    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        generateMountainPeaks();
    });

    window.addEventListener('scroll', () => {
        scrollY = window.scrollY;
    });

    /* --- Photorealistic Mountain Layer Generators --- */
    let layerDistant = [];
    let layerMid = [];
    let layerForeground = [];

    function generateRealisticPeaks(segments, roughness, minYPercent, maxYPercent) {
        const peaks = [];
        const minY = height * minYPercent;
        const maxY = height * maxYPercent;
        
        for (let i = 0; i <= segments; i++) {
            const x = (width / segments) * i;
            // Harmonic noise simulation for natural jagged rock ridges
            const harmonic1 = Math.sin(i * 0.8) * Math.cos(i * 0.35);
            const harmonic2 = Math.sin(i * 1.7) * 0.3;
            const seed = (harmonic1 + harmonic2) * 0.5 + 0.5;
            const y = minY + seed * (maxY - minY) + (Math.random() - 0.5) * roughness;
            
            // Add secondary peak jaggedness points for natural rock crags
            const isRidgePeak = i % 2 === 1;
            peaks.push({ x, y, isRidgePeak });
        }
        return peaks;
    }

    function generateMountainPeaks() {
        layerDistant = generateRealisticPeaks(18, 20, 0.32, 0.52);
        layerMid = generateRealisticPeaks(12, 30, 0.45, 0.65);
        layerForeground = generateRealisticPeaks(8, 40, 0.60, 0.80);
    }

    generateMountainPeaks();

    /* --- Floating Cloud Banks & Volumetric Mist --- */
    const cloudBanks = [];
    const cloudCount = 8;

    for (let i = 0; i < cloudCount; i++) {
        cloudBanks.push({
            x: Math.random() * width,
            y: height * 0.1 + Math.random() * (height * 0.45),
            width: 250 + Math.random() * 350,
            height: 60 + Math.random() * 90,
            speed: 0.08 + Math.random() * 0.15,
            opacity: 0.05 + Math.random() * 0.08
        });
    }

    function updateAndDrawClouds() {
        ctx.save();
        cloudBanks.forEach(c => {
            c.x += c.speed;
            if (c.x - c.width > width) {
                c.x = -c.width;
                c.y = height * 0.1 + Math.random() * (height * 0.45);
            }

            const cloudGrad = ctx.createRadialGradient(
                c.x + c.width * 0.5, c.y + c.height * 0.5, 10,
                c.x + c.width * 0.5, c.y + c.height * 0.5, c.width * 0.5
            );
            cloudGrad.addColorStop(0, `rgba(209, 250, 229, ${c.opacity * 1.8})`);
            cloudGrad.addColorStop(0.5, `rgba(167, 243, 208, ${c.opacity * 0.8})`);
            cloudGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

            ctx.fillStyle = cloudGrad;
            ctx.beginPath();
            ctx.ellipse(c.x + c.width * 0.5, c.y + c.height * 0.5, c.width * 0.5, c.height * 0.5, 0, 0, Math.PI * 2);
            ctx.fill();
        });
        ctx.restore();
    }

    /* --- Subtle Rain Drops Simulation --- */
    const rainDrops = [];
    const rainCount = 45;

    for (let i = 0; i < rainCount; i++) {
        rainDrops.push({
            x: Math.random() * width,
            y: Math.random() * height,
            length: 12 + Math.random() * 18,
            speedY: 6 + Math.random() * 4,
            speedX: -0.8 - Math.random() * 0.4,
            opacity: 0.08 + Math.random() * 0.12
        });
    }

    function updateAndDrawRain() {
        ctx.save();
        ctx.lineWidth = 1;
        rainDrops.forEach(r => {
            r.x += r.speedX;
            r.y += r.speedY;

            if (r.y > height) {
                r.y = -r.length;
                r.x = Math.random() * (width + 200);
            }

            ctx.strokeStyle = `rgba(167, 243, 208, ${r.opacity})`;
            ctx.beginPath();
            ctx.moveTo(r.x, r.y);
            ctx.lineTo(r.x + r.speedX * 2, r.y + r.length);
            ctx.stroke();
        });
        ctx.restore();
    }

    /* --- Faint Moon Partially Hidden Behind Clouds --- */
    function drawCinematicMoon() {
        ctx.save();
        const moonX = width * 0.82 + mouseOffset.x * 0.15;
        const moonY = height * 0.2 + mouseOffset.y * 0.15;
        const moonRadius = 50;

        // Soft Moon Outer Glow
        const glowGrad = ctx.createRadialGradient(moonX, moonY, moonRadius * 0.3, moonX, moonY, moonRadius * 3.5);
        glowGrad.addColorStop(0, 'rgba(209, 250, 229, 0.22)');
        glowGrad.addColorStop(0.4, 'rgba(0, 200, 150, 0.08)');
        glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = glowGrad;
        ctx.beginPath();
        ctx.arc(moonX, moonY, moonRadius * 3.5, 0, Math.PI * 2);
        ctx.fill();

        // Moon Body
        const moonGrad = ctx.createRadialGradient(moonX - 12, moonY - 12, 5, moonX, moonY, moonRadius);
        moonGrad.addColorStop(0, 'rgba(242, 245, 243, 0.95)');
        moonGrad.addColorStop(0.7, 'rgba(209, 250, 229, 0.7)');
        moonGrad.addColorStop(1, 'rgba(167, 243, 208, 0.35)');
        ctx.fillStyle = moonGrad;
        ctx.beginPath();
        ctx.arc(moonX, moonY, moonRadius, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }

    /* --- Dynamic Distant Lightning Simulation --- */
    let lightningState = {
        active: false,
        intensity: 0,
        flashType: 0,
        glowDecay: 0,
        boltPath: []
    };

    function generateLightningBolt(startX, startY, endY) {
        const path = [{ x: startX, y: startY }];
        let currX = startX;
        let currY = startY;

        while (currY < endY) {
            currY += 15 + Math.random() * 25;
            currX += (Math.random() - 0.5) * 40;
            path.push({ x: currX, y: currY });
        }
        return path;
    }

    function triggerLightning() {
        if (!fxEnabled) return;

        const startX = width * (0.15 + Math.random() * 0.7);
        const startY = height * 0.05;
        const endY = height * (0.35 + Math.random() * 0.25);

        lightningState.active = true;
        lightningState.intensity = 0.9 + Math.random() * 0.1;
        lightningState.flashType = Math.random() > 0.5 ? 1 : 0;
        lightningState.glowDecay = 1.0;
        lightningState.boltPath = generateLightningBolt(startX, startY, endY);

        flashOverlay.classList.add('active-flash');
        setTimeout(() => {
            flashOverlay.classList.remove('active-flash');
        }, 110);

        if (lightningState.flashType === 1) {
            setTimeout(() => {
                flashOverlay.classList.add('active-flash');
                lightningState.intensity = 0.75;
                setTimeout(() => flashOverlay.classList.remove('active-flash'), 70);
            }, 160);
        }

        const nextDelay = 6000 + Math.random() * 8000;
        setTimeout(triggerLightning, nextDelay);
    }

    setTimeout(triggerLightning, 3500);

    fxToggleBtn.addEventListener('click', () => {
        fxEnabled = !fxEnabled;
        if (fxEnabled) {
            fxToggleBtn.classList.remove('muted');
            fxToggleBtn.title = "Atmospheric Lighting FX: ON";
            triggerLightning();
        } else {
            fxToggleBtn.classList.add('muted');
            fxToggleBtn.title = "Atmospheric Lighting FX: OFF";
            lightningState.active = false;
        }
    });

    /* --- Drawing Realistic Shaded Mountain Layers --- */
    function drawRealisticMountainLayer(peaks, baseColor, ridgeHighlightColor, scrollSpeed, mouseMultiplier, shadowBlur) {
        ctx.save();

        const offsetY = scrollY * scrollSpeed + mouseOffset.y * mouseMultiplier;
        const offsetX = mouseOffset.x * mouseMultiplier;

        ctx.beginPath();
        ctx.moveTo(0, height);

        for (let i = 0; i < peaks.length; i++) {
            const pt = peaks[i];
            const renderX = pt.x + offsetX;
            const renderY = pt.y + offsetY;

            if (i === 0) {
                ctx.lineTo(0, renderY);
            } else {
                const prev = peaks[i - 1];
                const prevX = prev.x + offsetX;
                const prevY = prev.y + offsetY;
                
                // Realistic angular mountain peak geometry
                const cx = (prevX + renderX) / 2;
                const cy = (prevY + renderY) / 2;
                ctx.quadraticCurveTo(prevX, prevY, cx, cy);
            }
        }

        const lastPt = peaks[peaks.length - 1];
        ctx.lineTo(width, lastPt.y + offsetY);
        ctx.lineTo(width, height);
        ctx.closePath();

        // Photorealistic Shaded Mountain Body Fill
        ctx.fillStyle = baseColor;
        ctx.fill();

        // Moonlight & Lightning Backlight Silhouette Shading
        if (lightningState.glowDecay > 0.01 && ridgeHighlightColor) {
            ctx.strokeStyle = ridgeHighlightColor;
            ctx.lineWidth = 2.2;
            ctx.shadowColor = 'rgba(0, 200, 150, 0.85)';
            ctx.shadowBlur = shadowBlur * lightningState.glowDecay;
            ctx.stroke();
        }

        ctx.restore();
    }

    /* --- Main Canvas Render Loop --- */
    function renderCanvas() {
        // Deep Cinematic Obsidian & Charcoal Night Sky Gradient
        const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
        skyGrad.addColorStop(0, '#030504');
        skyGrad.addColorStop(0.45, '#060c09');
        skyGrad.addColorStop(1, '#09140f');
        ctx.fillStyle = skyGrad;
        ctx.fillRect(0, 0, width, height);

        // Draw Sky Stars
        ctx.fillStyle = 'rgba(242, 245, 243, 0.35)';
        for (let i = 0; i < 45; i++) {
            const sx = (Math.sin(i * 99) * 0.5 + 0.5) * width;
            const sy = (Math.cos(i * 33) * 0.5 + 0.5) * (height * 0.45);
            ctx.fillRect(sx, sy, 1.5, 1.5);
        }

        // Draw Moon & Upper Clouds
        drawCinematicMoon();
        updateAndDrawClouds();

        if (lightningState.glowDecay > 0) {
            lightningState.glowDecay *= 0.92;
        }

        // Lightning Bolt
        if (lightningState.glowDecay > 0.1 && lightningState.boltPath.length > 0) {
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(lightningState.boltPath[0].x, lightningState.boltPath[0].y);
            for (let i = 1; i < lightningState.boltPath.length; i++) {
                ctx.lineTo(lightningState.boltPath[i].x, lightningState.boltPath[i].y);
            }
            ctx.strokeStyle = `rgba(209, 250, 229, ${lightningState.glowDecay})`;
            ctx.lineWidth = 2;
            ctx.shadowColor = '#00C896';
            ctx.shadowBlur = 22;
            ctx.stroke();
            ctx.restore();
        }

        // Layer 0: Distant Peaks (Slowest parallax: 0.04)
        const distHighlight = `rgba(0, 200, 150, ${0.45 * lightningState.glowDecay})`;
        drawRealisticMountainLayer(layerDistant, '#070e0b', distHighlight, 0.04, 0.25, 16);

        // Subtle Rain Particles
        updateAndDrawRain();

        // Layer 1: Midground Ridge (Parallax: 0.11)
        const midHighlight = `rgba(0, 200, 150, ${0.65 * lightningState.glowDecay})`;
        drawRealisticMountainLayer(layerMid, '#050a08', midHighlight, 0.11, 0.5, 22);

        // Layer 2: Foreground Crags (Parallax: 0.20)
        const foreHighlight = `rgba(0, 230, 172, ${0.85 * lightningState.glowDecay})`;
        drawRealisticMountainLayer(layerForeground, '#030605', foreHighlight, 0.20, 0.9, 28);

        requestAnimationFrame(renderCanvas);
    }

    renderCanvas();


    /* ==========================================================================
       2. UI & SCROLL CONTROLLERS
       ========================================================================== */
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navLinks = document.getElementById('nav-links');

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('mobile-active');
            const icon = mobileMenuBtn.querySelector('i');
            if (navLinks.classList.contains('mobile-active')) {
                icon.className = 'fa-solid fa-xmark';
            } else {
                icon.className = 'fa-solid fa-bars';
            }
        });
    }

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('mobile-active');
            if (mobileMenuBtn) {
                mobileMenuBtn.querySelector('i').className = 'fa-solid fa-bars';
            }
        });
    });

    const revealElements = document.querySelectorAll('.scroll-reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    const sections = document.querySelectorAll('section');
    const navLinkItems = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let currentSection = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinkItems.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    });


    /* ==========================================================================
       3. 3D TILT EFFECT ON CARDS
       ========================================================================== */
    const tiltCards = document.querySelectorAll('.tilt-card');
    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (centerY - y) / 18;
            const rotateY = (x - centerX) / 18;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
        });
    });


    /* ==========================================================================
       4. INTERACTIVE PROJECT DETAILS MODAL
       ========================================================================== */
    const modal = document.getElementById('project-modal');
    const modalBody = document.getElementById('modal-body');
    const modalClose = document.getElementById('modal-close');

    const projectData = {
        turbigen: {
            title: "Turbigen Highway Power System",
            subtitle: "Dual Solar & Vehicle-Induced Wind Energy Harvester",
            description: "The Turbigen Highway Power System is a sustainable energy solution designed to harvest kinetic energy created by moving vehicular traffic alongside solar radiation. By installing specialized vertical-axis wind turbines (VAWT) and solar panels along highway dividers, unused ambient energy is captured and converted into electricity to power local storage grid systems and highway infrastructure.",
            highlights: [
                "Designed a specialized vertical-axis wind turbine layout to capture vehicle airflow turbulence.",
                "Integrated photovoltaic solar panels for continuous daytime energy generation.",
                "Formulated power conditioning circuits for stable DC-DC conversion and battery charging.",
                "Targeted applications: Highway street lights, automated traffic signals, emergency call boxes, and battery storage stations."
            ],
            tech: ["Renewable Energy", "Wind Turbine", "Solar PV", "Power Electronics", "Highway Infrastructure"]
        },
        highway_irrigation: {
            title: "Highway Wind and Solar Hybrid Power System for Agricultural Irrigation",
            subtitle: "Dual Solar & Vehicle-Induced Wind Energy Harvesting for Agricultural Irrigation",
            description: "A specialized hybrid renewable energy system designed to harvest solar energy and vehicular wind turbulence along highway corridors to power automated pumps and energy storage systems for agricultural irrigation. It bridges sustainable highway energy harvesting with rural agricultural water supply needs.",
            highlights: [
                "Engineered highway-side hybrid harvesting to support rural agricultural water supply grid systems.",
                "Formulated power conditioning circuits for direct water pump drive and battery bank charging.",
                "Promotes sustainable agricultural practices by utilizing unexploited highway energy resources.",
                "Integrates microgrid distribution logic for continuous automated irrigation scheduling."
            ],
            tech: ["Solar Energy", "Wind Harvesting", "Agricultural Irrigation", "Microgrid", "Power Electronics"]
        },
        solarlight: {
            title: "Smart Solar Street Light",
            subtitle: "Energy-Efficient Intelligent Lighting Controller",
            description: "A solar-powered smart street lighting project designed for energy-efficient operation. It eliminates grid dependency while ensuring safety on municipal roads through automated light level adjustments based on motion detection and ambient solar charge levels.",
            highlights: [
                "Photovoltaic solar charging system with smart battery management.",
                "Automated dusk-to-dawn switching using light dependent resistors (LDR).",
                "Infrared / PIR motion sensing to switch between low-power standby (30% brightness) and full illumination (100%) when traffic is detected.",
                "Significantly reduces municipal energy expenditure and carbon footprint."
            ],
            tech: ["Solar Power", "IoT Sensors", "Smart Automation", "Embedded Microcontroller", "Energy Efficiency"]
        }
    };

    document.querySelectorAll('.btn-project-detail').forEach(btn => {
        btn.addEventListener('click', () => {
            const projectKey = btn.getAttribute('data-project');
            const p = projectData[projectKey];

            if (p) {
                modalBody.innerHTML = `
                    <h3>${p.title}</h3>
                    <div class="subtitle">${p.subtitle}</div>
                    <p>${p.description}</p>
                    <h4 style="color: var(--text-white); margin-top: 1.5rem; margin-bottom: 0.75rem; font-family: var(--font-heading);">Key Technical Features:</h4>
                    <ul>
                        ${p.highlights.map(item => `<li><i class="fa-solid fa-check accent-icon"></i> ${item}</li>`).join('')}
                    </ul>
                    <div class="project-tech-stack" style="margin-top: 1.5rem;">
                        ${p.tech.map(t => `<span class="tech-chip">${t}</span>`).join('')}
                    </div>
                `;
                modal.classList.remove('hidden');
                modal.setAttribute('aria-hidden', 'false');
            }
        });
    });

    if (modalClose) {
        modalClose.addEventListener('click', () => {
            modal.classList.add('hidden');
            modal.setAttribute('aria-hidden', 'true');
        });
    }

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.add('hidden');
            modal.setAttribute('aria-hidden', 'true');
        }
    });


    /* ==========================================================================
       5. EASTER EGG: 'E' KEY ENGINEERING MODE TOGGLE
       ========================================================================== */
    const engOverlay = document.getElementById('engineering-grid-overlay');
    const engToast = document.getElementById('engineering-toast');
    let engModeActive = false;

    window.addEventListener('keydown', (e) => {
        if (e.key === 'e' || e.key === 'E') {
            // Ignore if user is typing inside an input or textarea
            if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;

            engModeActive = !engModeActive;
            if (engModeActive) {
                engOverlay.classList.add('active-mode');
                engToast.classList.remove('hidden');
            } else {
                engOverlay.classList.remove('active-mode');
                engToast.classList.add('hidden');
            }
        }
    });


    /* ==========================================================================
       6. CONTACT FORM HANDLER
       ========================================================================== */
    const contactForm = document.getElementById('contact-form');
    const formToast = document.getElementById('form-toast');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('form-name').value;
            const email = document.getElementById('form-email').value;

            const btn = contactForm.querySelector('.btn-submit');
            btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
            btn.disabled = true;

            setTimeout(() => {
                btn.innerHTML = '<i class="fa-solid fa-check"></i> Message Sent!';
                formToast.className = 'form-toast success';
                formToast.innerHTML = `<i class="fa-solid fa-circle-check"></i> Thank you, ${name}! Your message has been received. I will respond to ${email} shortly.`;
                
                contactForm.reset();

                setTimeout(() => {
                    btn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Send Message';
                    btn.disabled = false;
                }, 3000);
            }, 1200);
        });
    }


    /* ==========================================================================
       7. FUTURISTIC CUSTOM EMERALD CURSOR ENGINE
       ========================================================================== */
    const cursorDot = document.getElementById('cursor-dot');
    const cursorRing = document.getElementById('cursor-ring');
    const particleCanvas = document.getElementById('cursor-particles');
    
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches || ('ontouchstart' in window);

    if (cursorDot && cursorRing && particleCanvas && !isTouchDevice) {
        const pCtx = particleCanvas.getContext('2d');
        let pWidth = (particleCanvas.width = window.innerWidth);
        let pHeight = (particleCanvas.height = window.innerHeight);

        window.addEventListener('resize', () => {
            pWidth = particleCanvas.width = window.innerWidth;
            pHeight = particleCanvas.height = window.innerHeight;
        });

        let mouseX = -100;
        let mouseY = -100;
        let ringX = -100;
        let ringY = -100;
        let isVisible = false;

        const cursorParticles = [];
        const maxParticles = 24;

        class CursorParticle {
            constructor(x, y, isClick = false) {
                this.x = x;
                this.y = y;
                const angle = Math.random() * Math.PI * 2;
                const speed = isClick ? (1.5 + Math.random() * 3) : (0.2 + Math.random() * 0.8);
                this.vx = Math.cos(angle) * speed;
                this.vy = Math.sin(angle) * speed;
                this.size = isClick ? (2 + Math.random() * 2.5) : (1 + Math.random() * 1.5);
                this.alpha = 1.0;
                this.decay = isClick ? (0.03 + Math.random() * 0.03) : (0.04 + Math.random() * 0.04);
                this.color = Math.random() > 0.3 ? '#00C896' : '#00e6ac';
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;
                this.alpha -= this.decay;
            }

            draw(ctx) {
                if (this.alpha <= 0) return;
                ctx.save();
                ctx.globalAlpha = this.alpha;
                ctx.fillStyle = this.color;
                ctx.shadowColor = '#00C896';
                ctx.shadowBlur = 6;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }
        }

        let lastSpawn = 0;

        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;

            if (!isVisible) {
                isVisible = true;
                cursorDot.style.opacity = '1';
                cursorRing.style.opacity = '1';
                ringX = mouseX;
                ringY = mouseY;
            }

            const now = performance.now();
            if (now - lastSpawn > 40 && cursorParticles.length < maxParticles) {
                cursorParticles.push(new CursorParticle(mouseX, mouseY, false));
                lastSpawn = now;
            }
        });

        document.addEventListener('mouseleave', () => {
            isVisible = false;
            cursorDot.style.opacity = '0';
            cursorRing.style.opacity = '0';
        });

        document.addEventListener('mouseenter', () => {
            isVisible = true;
            cursorDot.style.opacity = '1';
            cursorRing.style.opacity = '1';
        });

        window.addEventListener('mousedown', (e) => {
            if (!isVisible) return;
            cursorRing.classList.remove('click-pulse');
            void cursorRing.offsetWidth;
            cursorRing.classList.add('click-pulse');

            for (let i = 0; i < 8; i++) {
                cursorParticles.push(new CursorParticle(e.clientX, e.clientY, true));
            }
        });

        const interactiveSelector = 'a, button, input, textarea, select, .btn, .glass-card, .social-link, .skill-pill, .skill-card, .project-card, .cert-card, .activity-card, .fx-toggle-btn, .nav-logo, .tech-chip';

        document.addEventListener('mouseover', (e) => {
            const target = e.target.closest(interactiveSelector);
            if (target) {
                if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
                    cursorRing.classList.add('hover-text');
                    cursorRing.classList.remove('hover-active');
                } else {
                    cursorRing.classList.add('hover-active');
                    cursorRing.classList.remove('hover-text');
                }
            }
        });

        document.addEventListener('mouseout', (e) => {
            const target = e.target.closest(interactiveSelector);
            if (target) {
                cursorRing.classList.remove('hover-active', 'hover-text');
            }
        });

        function animateCursor() {
            if (isVisible) {
                cursorDot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
                ringX += (mouseX - ringX) * 0.16;
                ringY += (mouseY - ringY) * 0.16;
                cursorRing.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
            }

            pCtx.clearRect(0, 0, pWidth, pHeight);

            for (let i = cursorParticles.length - 1; i >= 0; i--) {
                const p = cursorParticles[i];
                p.update();
                p.draw(pCtx);
                if (p.alpha <= 0) {
                    cursorParticles.splice(i, 1);
                }
            }

            requestAnimationFrame(animateCursor);
        }

        animateCursor();
    }

});
