/**
 * DRo1D Plugin System
 * Extensible plugin architecture for adding custom functionality
 */

import { config } from './config.js';
import logger from './logger.js';

/**
 * Base Plugin Class
 * All plugins should extend this class
 */
export class DRo1DPlugin {
  constructor(name, version) {
    this.name = name;
    this.version = version;
    this.app = null;
    this.enabled = true;
  }

  /**
   * Called when plugin is registered
   * @param {Object} app - Main application instance
   */
  onRegister(app) {
    this.app = app;
    logger.info(`Plugin registered: ${this.name} v${this.version}`);
  }

  /**
   * Called when application initializes
   */
  onInit() {
    // Override in subclass
  }

  /**
   * Called when layer changes
   * @param {number} layer - New layer number
   * @param {string} section - Section ID (if applicable)
   */
  onLayerChange(layer, section) {
    // Override in subclass
  }

  /**
   * Called when modal opens
   * @param {string} componentId - Component ID
   */
  onModalOpen(componentId) {
    // Override in subclass
  }

  /**
   * Called when modal closes
   */
  onModalClose() {
    // Override in subclass
  }

  /**
   * Called when particles spawn
   * @param {number} x - X position
   * @param {number} y - Y position
   * @param {number} count - Particle count
   */
  onParticleSpawn(x, y, count) {
    // Override in subclass
  }

  /**
   * Called when sound plays
   * @param {string} soundType - Type of sound
   */
  onSoundPlay(soundType) {
    // Override in subclass
  }

  /**
   * Called before plugin is destroyed
   */
  onDestroy() {
    // Override in subclass
  }

  /**
   * Enable plugin
   */
  enable() {
    this.enabled = true;
    logger.info(`Plugin enabled: ${this.name}`);
  }

  /**
   * Disable plugin
   */
  disable() {
    this.enabled = false;
    logger.info(`Plugin disabled: ${this.name}`);
  }
}

/**
 * Plugin Manager
 * Manages plugin lifecycle and events
 */
export class PluginManager {
  constructor() {
    this.plugins = new Map();
    this.enabled = config.plugins.enabled;
    logger.info('Plugin system initialized');
  }

  /**
   * Register a plugin
   * @param {DRo1DPlugin} plugin - Plugin instance
   */
  register(plugin) {
    if (!this.enabled) {
      logger.warn('Plugin system is disabled');
      return false;
    }

    if (!(plugin instanceof DRo1DPlugin)) {
      logger.error('Plugin must extend DRo1DPlugin class');
      return false;
    }

    if (this.plugins.has(plugin.name)) {
      logger.warn(`Plugin already registered: ${plugin.name}`);
      return false;
    }

    this.plugins.set(plugin.name, plugin);
    logger.info(`Plugin registered: ${plugin.name} v${plugin.version}`);
    return true;
  }

  /**
   * Unregister a plugin
   * @param {string} name - Plugin name
   */
  unregister(name) {
    const plugin = this.plugins.get(name);
    if (plugin) {
      plugin.onDestroy();
      this.plugins.delete(name);
      logger.info(`Plugin unregistered: ${name}`);
      return true;
    }
    return false;
  }

  /**
   * Get plugin by name
   * @param {string} name - Plugin name
   * @returns {DRo1DPlugin|null}
   */
  get(name) {
    return this.plugins.get(name) || null;
  }

  /**
   * Get all plugins
   * @returns {Array<DRo1DPlugin>}
   */
  getAll() {
    return Array.from(this.plugins.values());
  }

  /**
   * Trigger plugin hook
   * @param {string} hookName - Hook name (e.g., 'onInit')
   * @param {...any} args - Hook arguments
   */
  trigger(hookName, ...args) {
    this.plugins.forEach(plugin => {
      if (plugin.enabled && typeof plugin[hookName] === 'function') {
        try {
          plugin[hookName](...args);
        } catch (error) {
          logger.error(`Plugin error in ${plugin.name}.${hookName}:`, error);
        }
      }
    });
  }

  /**
   * Enable all plugins
   */
  enableAll() {
    this.plugins.forEach(plugin => plugin.enable());
  }

  /**
   * Disable all plugins
   */
  disableAll() {
    this.plugins.forEach(plugin => plugin.disable());
  }

  /**
   * Destroy all plugins
   */
  destroyAll() {
    this.plugins.forEach(plugin => {
      plugin.onDestroy();
    });
    this.plugins.clear();
    logger.info('All plugins destroyed');
  }
}

/**
 * Example Plugin: Analytics
 */
export class AnalyticsPlugin extends DRo1DPlugin {
  constructor() {
    super('Analytics', '1.0.0');
    this.events = [];
  }

  onInit() {
    logger.debug('Analytics plugin initialized');
  }

  onLayerChange(layer, section) {
    this.trackEvent('layer_change', { layer, section });
  }

  onModalOpen(componentId) {
    this.trackEvent('modal_open', { componentId });
  }

  onModalClose() {
    this.trackEvent('modal_close');
  }

  trackEvent(eventName, data = {}) {
    const event = {
      name: eventName,
      timestamp: Date.now(),
      data
    };

    this.events.push(event);
    logger.debug(`Analytics event: ${eventName}`, data);

    // In production, send to analytics service
    // analytics.track(eventName, data);
  }

  getEvents() {
    return this.events;
  }
}

/**
 * Example Plugin: Performance Monitor
 */
export class PerformancePlugin extends DRo1DPlugin {
  constructor() {
    super('Performance', '1.0.0');
    this.marks = new Map();
  }

  onInit() {
    this.mark('app_init');
  }

  onLayerChange(layer) {
    this.mark(`layer_${layer}_open`);
  }

  mark(name) {
    performance.mark(name);
    this.marks.set(name, performance.now());
    logger.debug(`Performance mark: ${name}`);
  }

  measure(name, startMark, endMark) {
    try {
      performance.measure(name, startMark, endMark);
      const entries = performance.getEntriesByName(name);
      const duration = entries[entries.length - 1].duration;
      logger.info(`${name}: ${duration.toFixed(2)}ms`);
      return duration;
    } catch (error) {
      logger.error(`Performance measure failed: ${name}`, error);
      return null;
    }
  }

  getMarks() {
    return Array.from(this.marks.entries());
  }
}

// Export singleton instance
export const pluginManager = new PluginManager();

export default pluginManager;
