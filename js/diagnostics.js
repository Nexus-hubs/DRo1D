/**
 * DRo1D Diagnostics Panel
 * Real-time system monitoring and debugging
 */

import { config } from './config.js';
import logger from './logger.js';

export class DiagnosticsPanel {
  constructor(app) {
    this.app = app;
    this.enabled = config.diagnostics.enabled;
    this.updateInterval = config.diagnostics.updateInterval;
    this.metrics = config.diagnostics.metrics;
    this.position = config.diagnostics.position;

    this.panel = null;
    this.intervalId = null;
    this.lastFrameTime = performance.now();
    this.fps = 60;
    this.frameCount = 0;

    if (this.enabled) {
      this.init();
    }
  }

  /**
   * Initialize diagnostics panel
   */
  init() {
    this.createPanel();
    this.attachEventListeners();
    this.startMonitoring();
    logger.info('Diagnostics panel initialized');
  }

  /**
   * Create panel DOM element
   */
  createPanel() {
    this.panel = document.createElement('div');
    this.panel.id = 'diagnostics-panel';
    this.panel.className = `diagnostics-panel diagnostics-panel--${this.position}`;
    this.panel.setAttribute('role', 'complementary');
    this.panel.setAttribute('aria-label', 'Diagnostics Panel');

    this.panel.innerHTML = `
      <div class="diagnostics-header">
        <h3>DRo1D Diagnostics</h3>
        <button class="diagnostics-toggle" aria-label="Toggle diagnostics panel">
          <span class="diagnostics-toggle-icon">−</span>
        </button>
      </div>
      <div class="diagnostics-content">
        <div class="diagnostics-metrics" id="diagnostics-metrics"></div>
        <div class="diagnostics-logs" id="diagnostics-logs">
          <h4>Recent Logs</h4>
          <ul id="diagnostics-log-list"></ul>
        </div>
        <div class="diagnostics-actions">
          <button id="diagnostics-clear-logs">Clear Logs</button>
          <button id="diagnostics-download-logs">Download Logs</button>
          <button id="diagnostics-close">Close Panel</button>
        </div>
      </div>
    `;

    document.body.appendChild(this.panel);
    this.addStyles();
  }

  /**
   * Add CSS styles for diagnostics panel
   */
  addStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .diagnostics-panel {
        position: fixed;
        background: rgba(0, 0, 0, 0.95);
        border: 2px solid var(--accent-cyan, #00F0FF);
        border-radius: 8px;
        padding: 1rem;
        font-family: 'Courier New', monospace;
        font-size: 0.75rem;
        color: var(--text-white, #FFFFFF);
        z-index: 10000;
        max-width: 400px;
        max-height: 600px;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        box-shadow: 0 4px 20px rgba(0, 240, 255, 0.3);
      }

      .diagnostics-panel--bottom-right {
        bottom: 1rem;
        right: 1rem;
      }

      .diagnostics-panel--bottom-left {
        bottom: 1rem;
        left: 1rem;
      }

      .diagnostics-panel--top-right {
        top: 1rem;
        right: 1rem;
      }

      .diagnostics-panel--top-left {
        top: 1rem;
        left: 1rem;
      }

      .diagnostics-panel.collapsed .diagnostics-content {
        display: none;
      }

      .diagnostics-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0.5rem;
        padding-bottom: 0.5rem;
        border-bottom: 1px solid var(--accent-cyan, #00F0FF);
      }

      .diagnostics-header h3 {
        margin: 0;
        font-size: 1rem;
        color: var(--accent-cyan, #00F0FF);
      }

      .diagnostics-toggle {
        background: transparent;
        border: 1px solid var(--accent-cyan, #00F0FF);
        color: var(--accent-cyan, #00F0FF);
        cursor: pointer;
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
        font-size: 1rem;
        line-height: 1;
      }

      .diagnostics-toggle:hover {
        background: var(--accent-cyan, #00F0FF);
        color: var(--bg-black, #000000);
      }

      .diagnostics-content {
        overflow-y: auto;
        flex: 1;
      }

      .diagnostics-metrics {
        margin-bottom: 1rem;
      }

      .diagnostics-metric {
        display: flex;
        justify-content: space-between;
        padding: 0.25rem 0;
        border-bottom: 1px solid rgba(0, 240, 255, 0.2);
      }

      .diagnostics-metric-label {
        color: var(--accent-gray, #808080);
      }

      .diagnostics-metric-value {
        color: var(--accent-cyan, #00F0FF);
        font-weight: bold;
      }

      .diagnostics-logs {
        margin-bottom: 1rem;
      }

      .diagnostics-logs h4 {
        margin: 0 0 0.5rem 0;
        font-size: 0.875rem;
        color: var(--accent-cyan, #00F0FF);
      }

      #diagnostics-log-list {
        list-style: none;
        padding: 0;
        margin: 0;
        max-height: 200px;
        overflow-y: auto;
      }

      #diagnostics-log-list li {
        padding: 0.25rem;
        margin-bottom: 0.25rem;
        border-left: 3px solid;
        padding-left: 0.5rem;
        font-size: 0.7rem;
      }

      #diagnostics-log-list li.log-debug {
        border-color: #808080;
        color: #808080;
      }

      #diagnostics-log-list li.log-info {
        border-color: #00F0FF;
        color: #00F0FF;
      }

      #diagnostics-log-list li.log-warn {
        border-color: #FFA500;
        color: #FFA500;
      }

      #diagnostics-log-list li.log-error {
        border-color: #FF0033;
        color: #FF0033;
      }

      .diagnostics-actions {
        display: flex;
        gap: 0.5rem;
        flex-wrap: wrap;
      }

      .diagnostics-actions button {
        flex: 1;
        min-width: 100px;
        padding: 0.5rem;
        background: transparent;
        border: 1px solid var(--accent-cyan, #00F0FF);
        color: var(--accent-cyan, #00F0FF);
        cursor: pointer;
        border-radius: 4px;
        font-size: 0.75rem;
      }

      .diagnostics-actions button:hover {
        background: var(--accent-cyan, #00F0FF);
        color: var(--bg-black, #000000);
      }

      @media (max-width: 768px) {
        .diagnostics-panel {
          max-width: calc(100vw - 2rem);
          font-size: 0.7rem;
        }
      }
    `;
    document.head.appendChild(style);
  }

  /**
   * Attach event listeners
   */
  attachEventListeners() {
    // Toggle panel
    const toggleBtn = this.panel.querySelector('.diagnostics-toggle');
    toggleBtn.addEventListener('click', () => this.togglePanel());

    // Clear logs
    const clearBtn = this.panel.querySelector('#diagnostics-clear-logs');
    clearBtn.addEventListener('click', () => this.clearLogs());

    // Download logs
    const downloadBtn = this.panel.querySelector('#diagnostics-download-logs');
    downloadBtn.addEventListener('click', () => this.downloadLogs());

    // Close panel
    const closeBtn = this.panel.querySelector('#diagnostics-close');
    closeBtn.addEventListener('click', () => this.close());

    // Listen to logger events
    logger.addListener(entry => this.addLogEntry(entry));

    // Keyboard shortcut: Ctrl+Shift+D to toggle
    document.addEventListener('keydown', e => {
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        e.preventDefault();
        this.toggle();
      }
    });
  }

  /**
   * Start monitoring metrics
   */
  startMonitoring() {
    // Update metrics periodically
    this.intervalId = setInterval(() => {
      this.updateMetrics();
    }, this.updateInterval);

    // Calculate FPS
    this.calculateFPS();
  }

  /**
   * Calculate FPS
   */
  calculateFPS() {
    const now = performance.now();
    this.frameCount++;

    if (now >= this.lastFrameTime + 1000) {
      this.fps = Math.round((this.frameCount * 1000) / (now - this.lastFrameTime));
      this.frameCount = 0;
      this.lastFrameTime = now;
    }

    requestAnimationFrame(() => this.calculateFPS());
  }

  /**
   * Update metrics display
   */
  updateMetrics() {
    const metricsContainer = this.panel.querySelector('#diagnostics-metrics');
    const metrics = this.collectMetrics();

    metricsContainer.innerHTML = Object.entries(metrics)
      .map(([label, value]) => `
        <div class="diagnostics-metric">
          <span class="diagnostics-metric-label">${label}:</span>
          <span class="diagnostics-metric-value">${value}</span>
        </div>
      `)
      .join('');
  }

  /**
   * Collect current metrics
   * @returns {Object} Metrics data
   */
  collectMetrics() {
    const metrics = {};

    if (this.metrics.includes('fps')) {
      metrics.FPS = this.fps;
    }

    if (this.metrics.includes('memory') && performance.memory) {
      const used = (performance.memory.usedJSHeapSize / 1048576).toFixed(2);
      const total = (performance.memory.totalJSHeapSize / 1048576).toFixed(2);
      metrics.Memory = `${used} / ${total} MB`;
    }

    if (this.metrics.includes('particleCount') && this.app.particleSystem) {
      metrics['Particles'] = this.app.particleSystem.particles?.length || 0;
    }

    if (this.metrics.includes('currentLayer') && this.app.layerSystem) {
      metrics.Layer = this.app.layerSystem.currentLayer || 1;
    }

    if (this.metrics.includes('audioContext') && this.app.audioSystem) {
      const state = this.app.audioSystem.audioContext?.state || 'none';
      metrics['Audio'] = state;
    }

    return metrics;
  }

  /**
   * Add log entry to panel
   * @param {Object} entry - Log entry
   */
  addLogEntry(entry) {
    const logList = this.panel.querySelector('#diagnostics-log-list');
    const li = document.createElement('li');
    li.className = `log-${entry.level}`;
    li.textContent = `[${new Date(entry.timestamp).toLocaleTimeString()}] ${entry.message}`;

    logList.insertBefore(li, logList.firstChild);

    // Limit to 20 entries
    while (logList.children.length > 20) {
      logList.removeChild(logList.lastChild);
    }
  }

  /**
   * Toggle panel collapsed state
   */
  togglePanel() {
    this.panel.classList.toggle('collapsed');
    const icon = this.panel.querySelector('.diagnostics-toggle-icon');
    icon.textContent = this.panel.classList.contains('collapsed') ? '+' : '−';
  }

  /**
   * Clear logs
   */
  clearLogs() {
    logger.clear();
    const logList = this.panel.querySelector('#diagnostics-log-list');
    logList.innerHTML = '';
  }

  /**
   * Download logs
   */
  downloadLogs() {
    logger.download();
  }

  /**
   * Toggle diagnostics panel visibility
   */
  toggle() {
    if (this.panel.style.display === 'none') {
      this.show();
    } else {
      this.hide();
    }
  }

  /**
   * Show diagnostics panel
   */
  show() {
    if (!this.panel) {
      this.init();
    }
    this.panel.style.display = 'flex';
    logger.info('Diagnostics panel shown');
  }

  /**
   * Hide diagnostics panel
   */
  hide() {
    this.panel.style.display = 'none';
    logger.info('Diagnostics panel hidden');
  }

  /**
   * Close and destroy panel
   */
  close() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    if (this.panel) {
      this.panel.remove();
    }
    logger.info('Diagnostics panel closed');
  }

  /**
   * Destroy diagnostics panel
   */
  destroy() {
    this.close();
  }
}

export default DiagnosticsPanel;
