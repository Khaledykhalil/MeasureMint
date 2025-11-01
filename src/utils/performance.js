/**
 * Performance Monitoring Utilities
 * Track and measure component performance
 */

class PerformanceMonitor {
  constructor() {
    this.metrics = new Map();
    this.enabled = process.env.NODE_ENV === 'development';
  }

  /**
   * Start timing an operation
   * @param {string} label - Operation label
   */
  start(label) {
    if (!this.enabled) return;
    
    this.metrics.set(label, {
      startTime: performance.now(),
      endTime: null,
      duration: null
    });
  }

  /**
   * End timing an operation
   * @param {string} label - Operation label
   */
  end(label) {
    if (!this.enabled) return;
    
    const metric = this.metrics.get(label);
    if (!metric) {
      console.warn(`Performance metric "${label}" was not started`);
      return;
    }

    metric.endTime = performance.now();
    metric.duration = metric.endTime - metric.startTime;

    // Log slow operations (> 100ms)
    if (metric.duration > 100) {
      console.warn(`⚠️ Slow operation: ${label} took ${metric.duration.toFixed(2)}ms`);
    } else if (metric.duration > 16) {
      // Operations taking more than one frame (16ms at 60fps)
      console.log(`⏱️ ${label}: ${metric.duration.toFixed(2)}ms`);
    }

    return metric.duration;
  }

  /**
   * Get metrics for an operation
   * @param {string} label - Operation label
   */
  getMetric(label) {
    return this.metrics.get(label);
  }

  /**
   * Get all metrics
   */
  getAllMetrics() {
    return Array.from(this.metrics.entries()).map(([label, metric]) => ({
      label,
      ...metric
    }));
  }

  /**
   * Clear all metrics
   */
  clear() {
    this.metrics.clear();
  }

  /**
   * Generate performance report
   */
  generateReport() {
    const metrics = this.getAllMetrics();
    
    if (metrics.length === 0) {
      return 'No performance metrics recorded';
    }

    const sorted = metrics
      .filter(m => m.duration !== null)
      .sort((a, b) => b.duration - a.duration);

    console.group('📊 Performance Report');
    sorted.forEach(({ label, duration }) => {
      const emoji = duration > 100 ? '🔴' : duration > 50 ? '🟡' : '🟢';
      console.log(`${emoji} ${label}: ${duration.toFixed(2)}ms`);
    });
    console.groupEnd();

    return sorted;
  }
}

// Singleton instance
const perfMonitor = new PerformanceMonitor();

/**
 * Measure function execution time
 * @param {Function} fn - Function to measure
 * @param {string} label - Label for measurement
 */
export async function measureAsync(fn, label) {
  perfMonitor.start(label);
  try {
    const result = await fn();
    return result;
  } finally {
    perfMonitor.end(label);
  }
}

/**
 * Measure synchronous function execution time
 * @param {Function} fn - Function to measure
 * @param {string} label - Label for measurement
 */
export function measureSync(fn, label) {
  perfMonitor.start(label);
  try {
    const result = fn();
    return result;
  } finally {
    perfMonitor.end(label);
  }
}

/**
 * Debounce function to limit execution rate
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 */
export function debounce(func, wait = 300) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function to limit execution frequency
 * @param {Function} func - Function to throttle
 * @param {number} limit - Minimum time between executions in milliseconds
 */
export function throttle(func, limit = 100) {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/**
 * Memoize function results
 * @param {Function} func - Function to memoize
 * @param {Function} keyGenerator - Custom key generator function
 */
export function memoize(func, keyGenerator = (...args) => JSON.stringify(args)) {
  const cache = new Map();
  
  return function memoized(...args) {
    const key = keyGenerator(...args);
    
    if (cache.has(key)) {
      return cache.get(key);
    }
    
    const result = func(...args);
    cache.set(key, result);
    
    // Limit cache size
    if (cache.size > 100) {
      const firstKey = cache.keys().next().value;
      cache.delete(firstKey);
    }
    
    return result;
  };
}

/**
 * Check if code is running on client side
 */
export const isClient = typeof window !== 'undefined';

/**
 * Check if browser supports performance API
 */
export const supportsPerformance = isClient && 'performance' in window;

/**
 * Get memory usage (Chrome only)
 */
export function getMemoryUsage() {
  if (!isClient || !performance.memory) {
    return null;
  }

  return {
    usedJSHeapSize: (performance.memory.usedJSHeapSize / 1048576).toFixed(2) + ' MB',
    totalJSHeapSize: (performance.memory.totalJSHeapSize / 1048576).toFixed(2) + ' MB',
    limit: (performance.memory.jsHeapSizeLimit / 1048576).toFixed(2) + ' MB'
  };
}

/**
 * Log render performance
 */
export function logRenderPerformance(componentName, renderTime) {
  if (process.env.NODE_ENV === 'development') {
    const threshold = 16; // 60fps = 16ms per frame
    
    if (renderTime > threshold) {
      console.warn(
        `⚠️ ${componentName} render took ${renderTime.toFixed(2)}ms (> ${threshold}ms threshold)`
      );
    }
  }
}

/**
 * Create a performance marker
 */
export function mark(name) {
  if (supportsPerformance && performance.mark) {
    performance.mark(name);
  }
}

/**
 * Measure between two markers
 */
export function measure(name, startMark, endMark) {
  if (supportsPerformance && performance.measure) {
    try {
      performance.measure(name, startMark, endMark);
      const measure = performance.getEntriesByName(name)[0];
      return measure ? measure.duration : null;
    } catch (e) {
      console.warn(`Could not measure ${name}:`, e);
      return null;
    }
  }
  return null;
}

export default perfMonitor;
