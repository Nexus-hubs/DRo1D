/**
 * Particle System
 */

import { prefersReducedMotion } from './utils.js';

class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.size = Math.random() * 3 + 1;
        this.speedX = (Math.random() - 0.5) * 3;
        this.speedY = (Math.random() - 0.5) * 3;
        this.life = 1;
        this.decay = Math.random() * 0.015 + 0.01;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.life -= this.decay;
        this.size *= 0.97;
    }

    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.life;
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

export class ParticleSystem {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) {
            console.warn('Particle canvas not found');
            return;
        }

        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.isRunning = false;
        this.animationId = null;

        this.resize();
        window.addEventListener('resize', () => this.resize());

        // Pause when tab is not visible to save resources
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pause();
            } else {
                this.resume();
            }
        });
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createBurst(x, y, count, color) {
        // Don't create particles if reduced motion is preferred
        if (prefersReducedMotion()) return;

        for (let i = 0; i < count; i++) {
            this.particles.push(new Particle(x, y, color));
        }

        // Start animation if not already running
        if (!this.isRunning) {
            this.start();
        }
    }

    animate() {
        // Skip rendering if tab is hidden
        if (document.hidden) {
            this.animationId = requestAnimationFrame(() => this.animate());
            return;
        }

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Filter out dead particles
        this.particles = this.particles.filter(particle => particle.life > 0);

        // Update and draw each particle
        this.particles.forEach(particle => {
            particle.update();
            particle.draw(this.ctx);
        });

        // Continue animation if there are particles
        if (this.particles.length > 0) {
            this.animationId = requestAnimationFrame(() => this.animate());
        } else {
            this.isRunning = false;
        }
    }

    start() {
        if (!this.isRunning) {
            this.isRunning = true;
            this.animate();
        }
    }

    pause() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
        this.isRunning = false;
    }

    resume() {
        if (this.particles.length > 0 && !this.isRunning) {
            this.start();
        }
    }

    clear() {
        this.particles = [];
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.pause();
    }
}

// Helper function to trigger particles on an element
export function triggerParticles(particleSystem, element, color, count = 15) {
    if (!particleSystem || !element) return;

    const rect = element.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    particleSystem.createBurst(x, y, count, color);
}
