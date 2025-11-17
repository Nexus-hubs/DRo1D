/**
 * Tests for utility functions
 */

import { throttle, debounce } from '../js/utils.js';

describe('Utils', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('throttle', () => {
    it('should call function immediately on first call', () => {
      const mockFn = jest.fn();
      const throttled = throttle(mockFn, 100);

      throttled();

      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it('should throttle subsequent calls', () => {
      const mockFn = jest.fn();
      const throttled = throttle(mockFn, 100);

      throttled();
      throttled();
      throttled();

      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it('should allow call after delay', () => {
      const mockFn = jest.fn();
      const throttled = throttle(mockFn, 100);

      throttled();
      jest.advanceTimersByTime(100);
      throttled();

      expect(mockFn).toHaveBeenCalledTimes(2);
    });
  });

  describe('debounce', () => {
    it('should not call function immediately', () => {
      const mockFn = jest.fn();
      const debounced = debounce(mockFn, 100);

      debounced();

      expect(mockFn).not.toHaveBeenCalled();
    });

    it('should call function after delay', () => {
      const mockFn = jest.fn();
      const debounced = debounce(mockFn, 100);

      debounced();
      jest.advanceTimersByTime(100);

      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it('should reset timer on subsequent calls', () => {
      const mockFn = jest.fn();
      const debounced = debounce(mockFn, 100);

      debounced();
      jest.advanceTimersByTime(50);
      debounced();
      jest.advanceTimersByTime(50);

      expect(mockFn).not.toHaveBeenCalled();

      jest.advanceTimersByTime(50);
      expect(mockFn).toHaveBeenCalledTimes(1);
    });
  });
});
