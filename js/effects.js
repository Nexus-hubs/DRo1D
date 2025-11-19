/**
 * DRo1D Enhanced Visual Effects
 * Matrix rain, loading screen, and advanced animations
 */

import logger from './logger.js';

// ═══════════════════════════════════════════════════════════
// LOADING SCREEN
// ═══════════════════════════════════════════════════════════

export class LoadingScreen {
  constructor() {
    this.element = document.getElementById('loadingScreen');
    this.bar = document.getElementById('loadingBar');
    this.text = document.getElementById('loadingText');
    this.progress = 0;
    this.messages = [
      'INITIALIZING SYSTEMS...',
      'LOADING NEURAL PATHWAYS...',
      'CALIBRATING SENSORS...',
      'ESTABLISHING CONNECTIONS...',
      'ACTIVATING AI CORE...',
      'SYSTEM READY'
    ];
  }

  updateProgress(progress) {
    this.progress = Math.min(100, progress);
    if (this.bar) {
      this.bar.style.width = `${this.progress}%`;
    }

    const messageIndex = Math.floor((this.progress / 100) * (this.messages.length - 1));
    if (this.text) {
      this.text.textContent = this.messages[messageIndex];
    }
  }

  async hide() {
    this.updateProgress(100);
    await new Promise(resolve => setTimeout(resolve, 500));

    if (this.element) {
      this.element.classList.add('hidden');
      setTimeout(() => {
        this.element.remove();
      }, 800);
    }

    logger.info('Loading screen hidden');
  }
}

// ═══════════════════════════════════════════════════════════
// MATRIX RAIN EFFECT
// ═══════════════════════════════════════════════════════════

export class MatrixRain {
  constructor(canvasId = 'matrixCanvas') {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) {
      this.createCanvas(canvasId);
    }

    this.ctx = this.canvas.getContext('2d');
    this.columns = [];
    this.fontSize = 14;
    this.chars = 'ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ0123456789';
    this.animationId = null;
    this.isRunning = false;

    this.init();
  }

  createCanvas(id) {
    this.canvas = document.createElement('canvas');
    this.canvas.id = id;
    document.body.insertBefore(this.canvas, document.body.firstChild);
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());
    logger.info('Matrix rain initialized');
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;

    const columnCount = Math.floor(this.canvas.width / this.fontSize);
    this.columns = Array(columnCount).fill(0);
  }

  draw() {
    // Fade effect
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw characters
    this.ctx.fillStyle = '#00F0FF';
    this.ctx.font = `${this.fontSize}px monospace`;

    for (let i = 0; i < this.columns.length; i++) {
      const char = this.chars[Math.floor(Math.random() * this.chars.length)];
      const x = i * this.fontSize;
      const y = this.columns[i] * this.fontSize;

      this.ctx.fillText(char, x, y);

      // Reset column or move down
      if (y > this.canvas.height && Math.random() > 0.975) {
        this.columns[i] = 0;
      } else {
        this.columns[i]++;
      }
    }
  }

  start() {
    if (this.isRunning) return;

    this.isRunning = true;
    const animate = () => {
      if (!this.isRunning) return;
      this.draw();
      this.animationId = requestAnimationFrame(animate);
    };
    animate();
    logger.info('Matrix rain started');
  }

  stop() {
    this.isRunning = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
    logger.info('Matrix rain stopped');
  }
}

// ═══════════════════════════════════════════════════════════
// FLOATING PARTICLES
// ═══════════════════════════════════════════════════════════

export class FloatingParticles {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.particleCount = 30;
    this.init();
  }

  init() {
    for (let i = 0; i < this.particleCount; i++) {
      this.createParticle();
    }
  }

  createParticle() {
    const particle = document.createElement('div');
    particle.className = 'hero-particle';
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.animationDelay = `${Math.random() * 15}s`;
    particle.style.animationDuration = `${10 + Math.random() * 10}s`;

    if (Math.random() > 0.7) {
      particle.style.background = 'var(--accent-red)';
    }

    this.container.appendChild(particle);
  }
}

// ═══════════════════════════════════════════════════════════
// STATS COUNTER ANIMATION
// ═══════════════════════════════════════════════════════════

export class StatsCounter {
  constructor() {
    this.counters = document.querySelectorAll('.stat-value[data-target]');
    this.observed = false;

    if (this.counters.length > 0) {
      this.init();
    }
  }

  init() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !this.observed) {
          this.observed = true;
          this.animateAll();
        }
      });
    }, { threshold: 0.5 });

    this.counters.forEach(counter => observer.observe(counter));
  }

  animateAll() {
    this.counters.forEach(counter => {
      const target = parseInt(counter.dataset.target, 10);
      const duration = 2000;
      const increment = target / (duration / 16);
      let current = 0;

      const update = () => {
        current += increment;
        if (current < target) {
          counter.textContent = Math.floor(current);
          requestAnimationFrame(update);
        } else {
          counter.textContent = target;
        }
      };

      update();
    });

    logger.info('Stats counter animated');
  }
}

// ═══════════════════════════════════════════════════════════
// GLITCH TEXT EFFECT
// ═══════════════════════════════════════════════════════════

export function setupGlitchText() {
  const glitchElements = document.querySelectorAll('.glitch');
  glitchElements.forEach(el => {
    el.dataset.text = el.textContent;
  });
}

// ═══════════════════════════════════════════════════════════
// MOUSE TRAIL EFFECT
// ═══════════════════════════════════════════════════════════

export class MouseTrail {
  constructor() {
    this.particles = [];
    this.maxParticles = 20;
    this.isEnabled = window.innerWidth > 768;

    if (this.isEnabled) {
      this.init();
    }
  }

  init() {
    document.addEventListener('mousemove', (e) => this.addParticle(e));
    this.animate();
  }

  addParticle(e) {
    if (this.particles.length >= this.maxParticles) {
      const oldest = this.particles.shift();
      oldest.element.remove();
    }

    const particle = document.createElement('div');
    particle.style.cssText = `
      position: fixed;
      width: 6px;
      height: 6px;
      background: var(--accent-cyan);
      border-radius: 50%;
      pointer-events: none;
      z-index: 9998;
      left: ${e.clientX - 3}px;
      top: ${e.clientY - 3}px;
      opacity: 0.8;
      box-shadow: 0 0 10px var(--accent-cyan);
    `;

    document.body.appendChild(particle);
    this.particles.push({
      element: particle,
      life: 1
    });
  }

  animate() {
    this.particles.forEach((particle, index) => {
      particle.life -= 0.05;
      particle.element.style.opacity = particle.life;
      particle.element.style.transform = `scale(${particle.life})`;

      if (particle.life <= 0) {
        particle.element.remove();
        this.particles.splice(index, 1);
      }
    });

    requestAnimationFrame(() => this.animate());
  }
}

// ═══════════════════════════════════════════════════════════
// TILT EFFECT FOR CARDS
// ═══════════════════════════════════════════════════════════

export function setupTiltEffect() {
  const cards = document.querySelectorAll('.system-card, .game-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = (y - centerY) / 10;
      const rotateY = (centerX - x) / 10;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

export default {
  LoadingScreen,
  MatrixRain,
  FloatingParticles,
  StatsCounter,
  setupGlitchText,
  MouseTrail,
  setupTiltEffect
};
