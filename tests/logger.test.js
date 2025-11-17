/**
 * Tests for Logger
 */

import Logger from '../js/logger.js';

describe('Logger', () => {
  let logger;

  beforeEach(() => {
    logger = new Logger();
    logger.enableConsole = false; // Disable console output for tests
  });

  afterEach(() => {
    logger.clear();
  });

  describe('log levels', () => {
    it('should log debug messages', () => {
      logger.debug('Test debug message');
      const entries = logger.getEntriesByLevel('debug');
      expect(entries).toHaveLength(1);
      expect(entries[0].message).toBe('Test debug message');
    });

    it('should log info messages', () => {
      logger.info('Test info message');
      const entries = logger.getEntriesByLevel('info');
      expect(entries).toHaveLength(1);
      expect(entries[0].message).toBe('Test info message');
    });

    it('should log warning messages', () => {
      logger.warn('Test warning message');
      const entries = logger.getEntriesByLevel('warn');
      expect(entries).toHaveLength(1);
      expect(entries[0].message).toBe('Test warning message');
    });

    it('should log error messages', () => {
      logger.error('Test error message');
      const entries = logger.getEntriesByLevel('error');
      expect(entries).toHaveLength(1);
      expect(entries[0].message).toBe('Test error message');
    });
  });

  describe('entry management', () => {
    it('should store log entries', () => {
      logger.info('Entry 1');
      logger.info('Entry 2');
      logger.info('Entry 3');

      expect(logger.getEntries()).toHaveLength(3);
    });

    it('should limit number of entries', () => {
      logger.maxEntries = 5;

      for (let i = 0; i < 10; i++) {
        logger.info(`Entry ${i}`);
      }

      expect(logger.getEntries()).toHaveLength(5);
    });

    it('should clear all entries', () => {
      logger.info('Entry 1');
      logger.info('Entry 2');
      logger.clear();

      expect(logger.getEntries()).toHaveLength(1); // Only "Log cleared" message
    });
  });

  describe('listeners', () => {
    it('should notify listeners on new log', () => {
      const mockListener = jest.fn();
      logger.addListener(mockListener);

      logger.info('Test message');

      expect(mockListener).toHaveBeenCalledWith(
        expect.objectContaining({
          level: 'info',
          message: 'Test message'
        })
      );
    });

    it('should remove listeners', () => {
      const mockListener = jest.fn();
      logger.addListener(mockListener);
      logger.removeListener(mockListener);

      logger.info('Test message');

      expect(mockListener).not.toHaveBeenCalled();
    });
  });

  describe('timing', () => {
    it('should measure execution time', () => {
      const end = logger.time('test-operation');
      const duration = end();

      expect(duration).toBeGreaterThanOrEqual(0);
    });
  });

  describe('export', () => {
    it('should export logs as JSON', () => {
      logger.info('Test entry');
      const json = logger.exportJSON();
      const parsed = JSON.parse(json);

      expect(Array.isArray(parsed)).toBe(true);
      expect(parsed.some(entry => entry.message === 'Test entry')).toBe(true);
    });
  });
});
