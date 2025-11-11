/**
 * Main Application Entry Point
 */

import { throttle, isInViewport, lazyLoadImages } from './utils.js';
import { ParticleSystem, triggerParticles } from './particles.js';
import { AudioSystem } from './audio.js';
import { LayerSystem } from './layer-system.js';

class DRo1DApp {
    constructor() {
        this.particleSystem = null;
        this.audioSystem = null;
        this.layerSystem = null;

        this.init();
    }

    init() {
        // Initialize systems
        this.particleSystem = new ParticleSystem('particleCanvas');
        this.audioSystem = new AudioSystem();
        this.layerSystem = new LayerSystem(this.audioSystem, this.particleSystem);

        // Setup audio prompt for mobile
        this.setupAudioPrompt();

        // Setup scroll-based features
        this.setupScrollReveal();
        this.setupParallax();
        this.setupNavigation();
        this.setupBackToTop();

        // Setup interactive elements
        this.setupInteractiveElements();

        // Lazy load images
        lazyLoadImages();

        // Initial reveal check
        this.revealOnScroll();
    }

    setupAudioPrompt() {
        // Detect if mobile device
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

        // Create audio prompt (especially important for mobile)
        const audioPromptHTML = `
            <div class="audio-prompt" id="audioPrompt">
                <h3>🔊 ENABLE AUDIO</h3>
                <p>Experience DRo1D with immersive sound effects</p>
                <button id="enableAudioBtn">ACTIVATE SOUND</button>
            </div>
        `;

        // Add to DOM
        document.body.insertAdjacentHTML('beforeend', audioPromptHTML);
        const audioPrompt = document.getElementById('audioPrompt');
        const enableAudioBtn = document.getElementById('enableAudioBtn');

        // Show prompt after a short delay
        setTimeout(() => {
            audioPrompt.classList.add('active');
        }, 1000);

        // Enable audio on button click
        enableAudioBtn.addEventListener('click', () => {
            this.audioSystem.init();

            // Play startup sound
            setTimeout(() => {
                this.audioSystem.startup();
            }, 100);

            // Hide prompt
            audioPrompt.classList.remove('active');
            setTimeout(() => {
                audioPrompt.remove();
            }, 300);

            // Trigger startup particles
            const rect = enableAudioBtn.getBoundingClientRect();
            const x = rect.left + rect.width / 2;
            const y = rect.top + rect.height / 2;
            this.particleSystem.createBurst(x, y, 50, '#00F0FF');
        });

        // Also init audio on any click (fallback)
        document.addEventListener('click', (e) => {
            if (e.target !== enableAudioBtn && !this.audioSystem.initialized) {
                this.audioSystem.init();
            }
        }, { once: true });
    }

    setupScrollReveal() {
        const reveals = document.querySelectorAll('.reveal');

        const revealOnScroll = () => {
            reveals.forEach(element => {
                if (isInViewport(element)) {
                    element.classList.add('active');
                }
            });
        };

        // Throttle scroll event for better performance
        window.addEventListener('scroll', throttle(revealOnScroll, 100));
        this.revealOnScroll = revealOnScroll;
    }

    setupParallax() {
        const hero = document.getElementById('hero');
        if (!hero) return;

        const parallaxEffect = throttle(() => {
            const scrolled = window.pageYOffset;
            hero.style.transform = `translateY(${scrolled * 0.5}px)`;
            hero.style.opacity = 1 - scrolled / 700;
        }, 16); // ~60fps

        window.addEventListener('scroll', parallaxEffect);
    }

    setupNavigation() {
        // Smooth scroll for navigation
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Active navigation highlighting
        const navLinks = document.querySelectorAll('.nav-links a');
        const sections = document.querySelectorAll('section[id]');

        const updateActiveNav = throttle(() => {
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                if (pageYOffset >= sectionTop - 200) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('data-section') === current) {
                    link.classList.add('active');
                }
            });
        }, 100);

        window.addEventListener('scroll', updateActiveNav);
    }

    setupBackToTop() {
        const backToTop = document.getElementById('backToTop');
        if (!backToTop) return;

        // Show/hide button based on scroll position
        const toggleButton = throttle(() => {
            if (window.pageYOffset > 500) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        }, 100);

        window.addEventListener('scroll', toggleButton);

        // Scroll to top functionality
        backToTop.addEventListener('click', () => {
            this.audioSystem.open();
            triggerParticles(this.particleSystem, backToTop, '#00F0FF', 30);

            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });

        // Keyboard accessibility
        backToTop.setAttribute('tabindex', '0');
        backToTop.setAttribute('role', 'button');
        backToTop.setAttribute('aria-label', 'Scroll back to top');

        backToTop.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                backToTop.click();
            }
        });
    }

    setupInteractiveElements() {
        // System cards
        const systemCards = document.querySelectorAll('.system-card');
        systemCards.forEach(card => {
            card.addEventListener('mouseenter', () => this.audioSystem.hover());
            card.addEventListener('click', function() {
                triggerParticles(this.particleSystem, this, '#00F0FF', 20);
            }.bind(this));
        });

        // Hardware items
        const hardwareItems = document.querySelectorAll('.hardware-item');
        hardwareItems.forEach(item => {
            item.addEventListener('mouseenter', () => this.audioSystem.hover());
            item.addEventListener('click', function() {
                triggerParticles(this.particleSystem, this, '#FF0033', 20);
            }.bind(this));
        });

        // Lab images
        const labImages = document.querySelectorAll('.lab-image');
        labImages.forEach(image => {
            image.addEventListener('mouseenter', () => this.audioSystem.hover());
            image.addEventListener('click', function() {
                triggerParticles(this.particleSystem, this, '#00F0FF', 25);
            }.bind(this));
        });

        // AI Core title
        const aiCoreTitle = document.getElementById('aiCoreTitle');
        if (aiCoreTitle) {
            aiCoreTitle.addEventListener('mouseenter', () => this.audioSystem.hover());
            aiCoreTitle.addEventListener('click', function() {
                triggerParticles(this.particleSystem, this, '#00F0FF', 20);
            }.bind(this));
        }

        // Close room buttons
        document.querySelectorAll('.close-room').forEach(button => {
            button.addEventListener('click', function() {
                triggerParticles(this.particleSystem, this, '#FFFFFF', 15);
            }.bind(this));
        });

        // Detail links
        document.querySelectorAll('.detail-link').forEach(link => {
            link.addEventListener('click', function(e) {
                triggerParticles(this.particleSystem, e.target, '#00F0FF', 30);
            }.bind(this));
        });

        // Modal close
        const modalClose = document.getElementById('modalClose');
        if (modalClose) {
            modalClose.addEventListener('click', function() {
                triggerParticles(this.particleSystem, this, '#FFFFFF', 20);
            }.bind(this));
        }

        // Hero CTA
        const heroCta = document.querySelector('.hero-cta');
        if (heroCta) {
            heroCta.addEventListener('mouseenter', () => this.audioSystem.hover());
            heroCta.addEventListener('click', function() {
                this.audioSystem.click();
                triggerParticles(this.particleSystem, this, '#FFFFFF', 25);
            }.bind(this));
        }

        // Nav links
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('mouseenter', () => this.audioSystem.hover());
            link.addEventListener('click', function() {
                this.audioSystem.click();
                triggerParticles(this.particleSystem, this, '#00F0FF', 12);
            }.bind(this));
        });
    }
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new DRo1DApp());
} else {
    new DRo1DApp();
}
