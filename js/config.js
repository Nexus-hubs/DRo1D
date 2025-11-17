/**
 * DRo1D Configuration
 * Centralized configuration for the application
 */

export const config = {
  // Application Info
  app: {
    name: 'DRo1D',
    version: '2.0.1',
    environment: 'production' // 'development' | 'production'
  },

  // Performance Settings
  performance: {
    throttleDelay: 100, // ms for scroll events
    debounceDelay: 250, // ms for resize events
    particleLimit: {
      desktop: 20,
      mobile: 10
    },
    animationFPS: 60
  },

  // Audio Settings
  audio: {
    enabled: true,
    defaultVolume: 0.3,
    sounds: {
      click: { frequency: 800, duration: 100 },
      hover: { frequency: 600, duration: 80 },
      open: { frequency: 1000, duration: 150 },
      close: { frequency: 400, duration: 150 },
      startup: {
        frequencies: [400, 600, 800],
        duration: 200
      }
    }
  },

  // Particle System Settings
  particles: {
    maxLifetime: 1000, // ms
    sizeRange: { min: 2, max: 6 },
    velocityRange: { min: -2, max: 2 },
    colors: [
      'rgba(0, 240, 255, 0.8)',  // Cyan
      'rgba(255, 0, 51, 0.6)',   // Red
      'rgba(255, 255, 255, 0.4)' // White
    ]
  },

  // Accessibility Settings
  accessibility: {
    respectReducedMotion: true,
    focusTrapEnabled: true,
    minimumTouchTarget: 44, // px
    announceNavigation: true
  },

  // Responsive Breakpoints (px)
  breakpoints: {
    mobile: 480,
    tablet: 768,
    desktop: 1024,
    wide: 1920
  },

  // Layer System
  layers: {
    transitionDuration: 600, // ms
    dimOpacity: 0.3,
    sections: ['system', 'ai-core', 'hardware', 'lab']
  },

  // Lazy Loading
  lazyLoading: {
    enabled: true,
    threshold: 0.1, // IntersectionObserver threshold
    rootMargin: '50px'
  },

  // Logging
  logging: {
    level: 'info', // 'debug' | 'info' | 'warn' | 'error' | 'off'
    enableConsole: true,
    enableDiagnostics: true,
    maxLogEntries: 100
  },

  // Diagnostics Panel
  diagnostics: {
    enabled: true,
    updateInterval: 1000, // ms
    position: 'bottom-right', // 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
    metrics: [
      'fps',
      'memory',
      'particleCount',
      'currentLayer',
      'audioContext'
    ]
  },

  // Plugin System
  plugins: {
    enabled: true,
    autoload: true,
    directory: './plugins'
  },

  // External Resources
  external: {
    fonts: {
      orbitron: 'https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap',
      rajdhani: 'https://fonts.googleapis.com/css2?family=Rajdhani:wght@300;400;500;600;700&display=swap'
    },
    images: {
      unsplashBase: 'https://images.unsplash.com'
    }
  },

  // Feature Flags
  features: {
    particles: true,
    audio: true,
    parallax: true,
    lazyLoading: true,
    diagnostics: false, // Set to true to enable diagnostics panel by default
    benchmarking: false
  }
};

// Freeze config to prevent modifications
Object.freeze(config);

// Environment-specific overrides
export function getConfig(overrides = {}) {
  return {
    ...config,
    ...overrides
  };
}

// Helper to check if feature is enabled
export function isFeatureEnabled(featureName) {
  return config.features[featureName] === true;
}

// Helper to get breakpoint
export function getBreakpoint() {
  const width = window.innerWidth;
  if (width < config.breakpoints.mobile) {
    return 'mobile';
  }
  if (width < config.breakpoints.tablet) {
    return 'tablet';
  }
  if (width < config.breakpoints.desktop) {
    return 'desktop';
  }
  return 'wide';
}

// Helper to check if mobile
export function isMobile() {
  return window.innerWidth < config.breakpoints.tablet;
}

// Helper to check if reduced motion is preferred
export function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export default config;
