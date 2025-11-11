/**
 * Audio System with Web Audio API
 */

import { prefersReducedMotion } from './utils.js';

export class AudioSystem {
    constructor() {
        this.audioCtx = null;
        this.enabled = false;
        this.initialized = false;
    }

    // Initialize audio on first user interaction (required by browsers)
    init() {
        if (this.initialized) return;

        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (!AudioContext) {
                console.warn('Web Audio API not supported');
                return;
            }

            this.audioCtx = new AudioContext();

            if (this.audioCtx.state === 'suspended') {
                this.audioCtx.resume();
            }

            this.enabled = true;
            this.initialized = true;
        } catch (error) {
            console.warn('Audio initialization failed:', error);
            this.enabled = false;
        }
    }

    // Play a sound with given parameters
    playSound(type, frequency = 440, duration = 0.1) {
        if (!this.enabled || !this.audioCtx || prefersReducedMotion()) return;

        try {
            const oscillator = this.audioCtx.createOscillator();
            const gainNode = this.audioCtx.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(this.audioCtx.destination);

            oscillator.type = type; // 'sine', 'square', 'sawtooth', 'triangle'
            oscillator.frequency.value = frequency;

            // Envelope for smooth sound
            const now = this.audioCtx.currentTime;
            gainNode.gain.setValueAtTime(0, now);
            gainNode.gain.linearRampToValueAtTime(0.15, now + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + duration);

            oscillator.start(now);
            oscillator.stop(now + duration);
        } catch (error) {
            console.warn('Sound playback failed:', error);
        }
    }

    // Predefined sound effects
    click() {
        this.playSound('sine', 800, 0.08);
    }

    open() {
        this.playSound('sine', 600, 0.15);
        setTimeout(() => this.playSound('sine', 900, 0.1), 50);
    }

    close() {
        this.playSound('sine', 900, 0.1);
        setTimeout(() => this.playSound('sine', 600, 0.15), 50);
    }

    hover() {
        this.playSound('sine', 1200, 0.05);
    }

    modal() {
        this.playSound('sine', 500, 0.12);
        setTimeout(() => this.playSound('sine', 800, 0.12), 60);
        setTimeout(() => this.playSound('sine', 1100, 0.12), 120);
    }

    // Suspend audio context to save resources
    suspend() {
        if (this.audioCtx && this.audioCtx.state === 'running') {
            this.audioCtx.suspend();
        }
    }

    // Resume audio context
    resume() {
        if (this.audioCtx && this.audioCtx.state === 'suspended') {
            this.audioCtx.resume();
        }
    }
}
