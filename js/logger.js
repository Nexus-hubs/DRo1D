/**
 * DRo1D Logger
 * Centralized logging system with level-based filtering
 */

import { config } from './config.js';

const LOG_LEVELS = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
  off: 4
};

class Logger {
  constructor() {
    this.level = LOG_LEVELS[config.logging.level] || LOG_LEVELS.info;
    this.enableConsole = config.logging.enableConsole;
    this.enableDiagnostics = config.logging.enableDiagnostics;
    this.maxEntries = config.logging.maxLogEntries;
    this.entries = [];
    this.listeners = [];
  }

  /**
   * Add a listener for log events
   * @param {Function} callback - Called when log entry is added
   */
  addListener(callback) {
    this.listeners.push(callback);
  }

  /**
   * Remove a listener
   * @param {Function} callback - Listener to remove
   */
  removeListener(callback) {
    this.listeners = this.listeners.filter(cb => cb !== callback);
  }

  /**
   * Notify all listeners of new log entry
   * @param {Object} entry - Log entry
   */
  notify(entry) {
    this.listeners.forEach(callback => {
      try {
        callback(entry);
      } catch (error) {
        console.error('Logger listener error:', error);
      }
    });
  }

  /**
   * Add log entry
   * @param {string} level - Log level
   * @param {string} message - Log message
   * @param {*} data - Additional data
   */
  log(level, message, data = null) {
    const levelValue = LOG_LEVELS[level];

    // Check if we should log this level
    if (levelValue < this.level) {
      return;
    }

    const entry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      data
    };

    // Store in memory (limit size)
    this.entries.push(entry);
    if (this.entries.length > this.maxEntries) {
      this.entries.shift();
    }

    // Console output
    if (this.enableConsole) {
      const consoleMethod = level === 'debug' ? 'log' : level;
      const style = this.getConsoleStyle(level);

      if (data) {
        console[consoleMethod](`%c[${level.toUpperCase()}]`, style, message, data);
      } else {
        console[consoleMethod](`%c[${level.toUpperCase()}]`, style, message);
      }
    }

    // Notify listeners (for diagnostics panel)
    if (this.enableDiagnostics) {
      this.notify(entry);
    }
  }

  /**
   * Get console style for log level
   * @param {string} level - Log level
   * @returns {string} CSS style string
   */
  getConsoleStyle(level) {
    const styles = {
      debug: 'color: #808080; font-weight: normal',
      info: 'color: #00F0FF; font-weight: bold',
      warn: 'color: #FFA500; font-weight: bold',
      error: 'color: #FF0033; font-weight: bold'
    };
    return styles[level] || '';
  }

  /**
   * Debug level logging
   * @param {string} message - Log message
   * @param {*} data - Additional data
   */
  debug(message, data) {
    this.log('debug', message, data);
  }

  /**
   * Info level logging
   * @param {string} message - Log message
   * @param {*} data - Additional data
   */
  info(message, data) {
    this.log('info', message, data);
  }

  /**
   * Warning level logging
   * @param {string} message - Log message
   * @param {*} data - Additional data
   */
  warn(message, data) {
    this.log('warn', message, data);
  }

  /**
   * Error level logging
   * @param {string} message - Log message
   * @param {*} data - Additional data
   */
  error(message, data) {
    this.log('error', message, data);
  }

  /**
   * Performance timing
   * @param {string} label - Timer label
   * @returns {Function} End timer function
   */
  time(label) {
    const start = performance.now();
    return () => {
      const duration = performance.now() - start;
      this.debug(`${label} took ${duration.toFixed(2)}ms`);
      return duration;
    };
  }

  /**
   * Group related logs
   * @param {string} label - Group label
   */
  group(label) {
    if (this.enableConsole) {
      console.group(label);
    }
  }

  /**
   * End log group
   */
  groupEnd() {
    if (this.enableConsole) {
      console.groupEnd();
    }
  }

  /**
   * Get all log entries
   * @returns {Array} Log entries
   */
  getEntries() {
    return [...this.entries];
  }

  /**
   * Get entries by level
   * @param {string} level - Log level to filter
   * @returns {Array} Filtered entries
   */
  getEntriesByLevel(level) {
    return this.entries.filter(entry => entry.level === level);
  }

  /**
   * Clear all log entries
   */
  clear() {
    this.entries = [];
    if (this.enableConsole) {
      console.clear();
    }
    this.info('Log cleared');
  }

  /**
   * Export logs as JSON
   * @returns {string} JSON string of logs
   */
  exportJSON() {
    return JSON.stringify(this.entries, null, 2);
  }

  /**
   * Download logs as file
   */
  download() {
    const json = this.exportJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dro1d-logs-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    this.info('Logs downloaded');
  }
}

// Create singleton instance
const logger = new Logger();

// Log initialization
logger.info(`Logger initialized (level: ${config.logging.level})`);

export { Logger };
export default logger;
