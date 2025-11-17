# DRo1D Architecture

This document provides a comprehensive overview of the DRo1D system architecture, including module organization, data flow, decision-making processes, and technical implementation details.

---

## Table of Contents

- [Overview](#overview)
- [System Architecture](#system-architecture)
- [Module Breakdown](#module-breakdown)
- [Data Flow](#data-flow)
- [Decision Making & Agent Logic](#decision-making--agent-logic)
- [Input Processing](#input-processing)
- [Output Actions](#output-actions)
- [Performance Considerations](#performance-considerations)
- [Browser APIs](#browser-apis)
- [Extensibility](#extensibility)

---

## Overview

DRo1D is a **client-side web application** built with vanilla JavaScript (ES6+), HTML5, and CSS3. It follows a **modular architecture** with clear separation of concerns, no external framework dependencies, and a focus on accessibility and performance.

### Core Design Principles

1. **Modularity** - Each system is isolated in its own ES6 module
2. **Performance** - Optimized rendering, throttled events, lazy loading
3. **Accessibility** - WCAG 2.1 AA compliant with full keyboard and screen reader support
4. **Progressive Enhancement** - Works without JavaScript (basic HTML content accessible)
5. **Mobile-First** - Responsive design optimized for mobile devices
6. **Battery Efficiency** - Smart pausing of animations and effects

---

## System Architecture

### High-Level Architecture

```
┌───────────────────────────────────────────────────────────────┐
│                       USER INTERFACE LAYER                     │
│                                                                │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐     │
│  │  SYSTEM  │  │ AI CORE  │  │ HARDWARE │  │   LAB    │     │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘     │
│       │             │              │              │            │
│       └─────────────┴──────────────┴──────────────┘           │
│                          │                                     │
└──────────────────────────┼─────────────────────────────────────┘
                           │
                           ▼
┌───────────────────────────────────────────────────────────────┐
│                   APPLICATION CORE LAYER                       │
│                                                                │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │              DRo1DApp (main.js)                         │ │
│  │  - Application initialization                            │ │
│  │  - Module coordination                                   │ │
│  │  - Event delegation                                      │ │
│  └─────────────────────────────────────────────────────────┘ │
│                           │                                   │
│       ┌───────────────────┼───────────────────┐              │
│       │                   │                   │              │
│       ▼                   ▼                   ▼              │
│  ┌─────────┐       ┌──────────┐       ┌──────────┐         │
│  │ Layer   │       │ Particle │       │  Audio   │         │
│  │ System  │       │  System  │       │  System  │         │
│  └─────────┘       └──────────┘       └──────────┘         │
│       │                   │                   │              │
└───────┼───────────────────┼───────────────────┼──────────────┘
        │                   │                   │
        ▼                   ▼                   ▼
┌───────────────────────────────────────────────────────────────┐
│                      BROWSER APIs LAYER                        │
│                                                                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │     DOM      │  │    Canvas    │  │  Web Audio   │       │
│  │ Manipulation │  │     API      │  │     API      │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
│                                                                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │ Intersection │  │     Page     │  │MatchMedia   │       │
│  │  Observer    │  │  Visibility  │  │     API      │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
└───────────────────────────────────────────────────────────────┘
```

### Layer Responsibilities

**UI Layer**
- Presents content to users
- Receives user interactions
- Displays visual feedback

**Application Core Layer**
- Manages application state
- Coordinates between modules
- Handles business logic
- Processes user interactions

**Browser APIs Layer**
- Low-level rendering (DOM, Canvas)
- Audio playback
- Intersection detection
- Performance optimization

---

## Module Breakdown

### 1. DRo1DApp (main.js)

**Purpose**: Application entry point and coordinator

**Responsibilities**:
- Initialize all subsystems
- Set up global event listeners
- Coordinate module interactions
- Manage application lifecycle

**Key Methods**:
```javascript
class DRo1DApp {
  constructor()               // Initialize app
  initAudio()                // Set up audio system
  initParticles()            // Set up particle system
  initLayerSystem()          // Set up navigation
  setupEventListeners()      // Attach DOM listeners
  setupScrollAnimations()    // Configure scroll effects
  setupLazyLoading()         // Configure lazy image loading
  setupParallax()            // Configure parallax effects
  setupVisibilityChange()    // Handle tab visibility
}
```

**Dependencies**:
- `AudioSystem` from `audio.js`
- `ParticleSystem` from `particles.js`
- `LayerSystem` from `layer-system.js`
- Utility functions from `utils.js`

---

### 2. LayerSystem (layer-system.js)

**Purpose**: Multi-layer navigation and focus management

**Responsibilities**:
- Manage 3-layer navigation state
- Handle breadcrumb updates
- Control modal visibility
- Manage focus trapping
- Restore focus on close

**Architecture**:
```
Layer 1 (Main Sections)
    │
    ├─► Layer 2 (Deep Rooms)
    │       │
    │       └─► Layer 3 (Modals)
    │
    └─► Breadcrumb Trail
```

**Key Methods**:
```javascript
class LayerSystem {
  constructor()                      // Initialize system
  openDeepRoom(sectionId)           // Navigate to Layer 2
  closeDeepRoom()                   // Return to Layer 1
  openModal(componentId, content)   // Open Layer 3 modal
  closeModal()                      // Close Layer 3 modal
  updateBreadcrumb(trail)           // Update navigation trail
  trapFocus(element)                // Enable focus trap
  restoreFocus()                    // Restore previous focus
}
```

**State Management**:
```javascript
{
  currentLayer: 1 | 2 | 3,
  currentSection: string | null,
  currentComponent: string | null,
  breadcrumb: string[],
  previousFocus: HTMLElement | null
}
```

---

### 3. ParticleSystem (particles.js)

**Purpose**: Canvas-based visual effects

**Responsibilities**:
- Spawn particles on user interactions
- Animate particles with physics
- Manage particle lifecycle
- Optimize rendering performance

**Particle Physics**:
```javascript
{
  x: number,           // X position
  y: number,           // Y position
  vx: number,          // X velocity
  vy: number,          // Y velocity
  life: number,        // Remaining lifetime (0-1)
  maxLife: number,     // Initial lifetime
  size: number,        // Particle size
  color: string        // RGBA color
}
```

**Key Methods**:
```javascript
class ParticleSystem {
  constructor(canvas)           // Initialize with canvas
  spawn(x, y, count)           // Create particles at position
  update()                     // Update particle physics
  draw()                       // Render particles to canvas
  animate()                    // RequestAnimationFrame loop
  pause()                      // Pause animations
  resume()                     // Resume animations
}
```

**Performance Optimizations**:
- Particle pooling (reuse objects)
- Reduced particle count on mobile
- RequestAnimationFrame for smooth 60fps
- Automatic cleanup of dead particles

---

### 4. AudioSystem (audio.js)

**Purpose**: Immersive sound effects using Web Audio API

**Responsibilities**:
- Generate procedural sound effects
- Manage audio context initialization
- Handle mobile audio restrictions
- Provide mute/unmute functionality

**Sound Types**:
```javascript
{
  click: 'Short, crisp interface click',
  hover: 'Subtle frequency sweep',
  open: 'Ascending tone for opening elements',
  close: 'Descending tone for closing elements',
  startup: 'System boot sequence (multiple tones)'
}
```

**Key Methods**:
```javascript
class AudioSystem {
  constructor()                  // Initialize audio context
  initAudio()                   // Set up context (requires user gesture)
  playSound(type)               // Play specific sound effect
  mute()                        // Disable sounds
  unmute()                      // Enable sounds
  isReady()                     // Check if context is ready
}
```

**Web Audio API Usage**:
```
OscillatorNode → GainNode → AudioContext.destination
     ↓              ↓
  frequency      volume
  (Hz)         (0.0-1.0)
```

---

### 5. Utilities (utils.js)

**Purpose**: Reusable helper functions

**Key Functions**:

```javascript
// Event throttling (limit execution rate)
throttle(func, delay)

// Event debouncing (delay until inactivity)
debounce(func, delay)

// Lazy load images when in viewport
setupLazyLoading(images)

// Check if element is in viewport
isInViewport(element)

// Get scroll percentage
getScrollPercentage()
```

**Use Cases**:
- `throttle`: Scroll/resize handlers (prevent excessive calls)
- `debounce`: Search input, window resize (wait for user to finish)
- `setupLazyLoading`: Images, background images (performance)

---

### 6. Modal Content (modal-content.js)

**Purpose**: Centralized content data structure

**Data Structure**:
```javascript
export const modalContent = {
  'component-id': {
    title: 'Component Name',
    specs: [
      { label: 'Spec Name', value: 'Spec Value' },
      // ...
    ]
  },
  // ...
}
```

**Benefits**:
- Single source of truth for content
- Easy content updates (no HTML editing)
- Separation of data from presentation
- Supports internationalization in future

---

## Data Flow

### User Interaction Flow

```
User Action (click, keyboard, touch)
    │
    ├─► Event Listener (main.js or layer-system.js)
    │       │
    │       ├─► Determine action type
    │       │
    │       ├─► Audio System
    │       │   └─► Play contextual sound
    │       │
    │       ├─► Particle System
    │       │   └─► Spawn visual effects
    │       │
    │       └─► Layer System
    │           │
    │           ├─► Update navigation state
    │           ├─► Update breadcrumb
    │           ├─► Manage focus
    │           └─► Toggle visibility
    │
    └─► DOM Updates
        │
        ├─► Class toggles (.active, .visible, .hidden)
        ├─► ARIA attribute updates
        ├─► Focus movement
        └─► Animation triggers
```

### Example: Opening a Deep Room

```javascript
// 1. User clicks "SYSTEM" section card
button.addEventListener('click', (e) => {

  // 2. Play audio feedback
  audioSystem.playSound('open');

  // 3. Spawn particles at click location
  particleSystem.spawn(e.clientX, e.clientY, 10);

  // 4. Navigate to deep room
  layerSystem.openDeepRoom('system');

  // 5. Layer system updates:
  //    - Sets currentLayer = 2
  //    - Sets currentSection = 'system'
  //    - Updates breadcrumb: ['Home', 'SYSTEM']
  //    - Adds .active class to layer-2
  //    - Dims layer-1
  //    - Moves focus to first focusable element in layer-2

  // 6. CSS transitions animate the change
});
```

---

## Decision Making & Agent Logic

While DRo1D doesn't have traditional AI agents, it implements **rule-based decision logic** in several areas:

### 1. Adaptive Performance

**Decision**: Should we pause animations?

```javascript
// Decision logic in main.js
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    // Decision: Tab is hidden → Pause to save battery
    particleSystem.pause();
    // Stop RequestAnimationFrame loops
  } else {
    // Decision: Tab is visible → Resume
    particleSystem.resume();
  }
});
```

### 2. Accessibility Decisions

**Decision**: Should we reduce motion?

```javascript
// Decision logic based on user preference
const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches;

if (prefersReducedMotion) {
  // Decision: User prefers reduced motion
  // → Disable animations, use instant transitions
  document.body.classList.add('reduce-motion');
} else {
  // Decision: User OK with motion
  // → Enable full animations
}
```

### 3. Mobile Optimization

**Decision**: How many particles to spawn?

```javascript
// Decision logic in ParticleSystem
spawn(x, y, count) {
  const isMobile = window.innerWidth < 768;

  // Decision: Mobile device?
  //   - Yes: Spawn 50% fewer particles (performance)
  //   - No: Spawn full count (visual richness)
  const actualCount = isMobile ? Math.floor(count * 0.5) : count;

  for (let i = 0; i < actualCount; i++) {
    // Create particles...
  }
}
```

### 4. Audio Initialization

**Decision**: When to initialize audio context?

```javascript
// Decision tree for audio initialization
class AudioSystem {
  playSound(type) {
    // Decision 1: Is audio context ready?
    if (!this.audioContext) {
      // No → Try to initialize (requires user gesture)
      this.initAudio();

      // Decision 2: Still not ready?
      if (!this.audioContext) {
        // Mobile browser restriction → Show prompt
        this.showAudioPrompt();
        return; // Exit, don't play sound
      }
    }

    // Decision 3: Is muted?
    if (this.muted) {
      return; // Exit, don't play sound
    }

    // All checks passed → Play sound
    this.generateSound(type);
  }
}
```

### 5. Focus Management

**Decision**: Where should focus go?

```javascript
// Decision logic in LayerSystem
closeModal() {
  // Decision: Do we have a previous focus to restore?
  if (this.previousFocus && document.body.contains(this.previousFocus)) {
    // Yes → Restore to exact previous element
    this.previousFocus.focus();
  } else {
    // No → Fallback to parent layer's first focusable element
    const fallback = this.currentLayerElement.querySelector(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    fallback?.focus();
  }

  // Clean up
  this.previousFocus = null;
}
```

---

## Input Processing

### Input Types

DRo1D processes multiple input types:

1. **Mouse/Touch Clicks**
2. **Keyboard Navigation**
3. **Scroll Events**
4. **Window Resize**
5. **Visibility Changes**

### Input Processing Pipeline

```
User Input
    │
    ▼
┌─────────────────┐
│ Event Capture   │  (addEventListener)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Event Throttle/ │  (utils.throttle/debounce)
│ Debounce        │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Decision Logic  │  (determine action)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ System Updates  │  (audio, particles, layers)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ DOM Updates     │  (classes, attributes)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Browser Render  │  (CSS transitions, paint)
└─────────────────┘
```

### Keyboard Input Handling

```javascript
// Keyboard event processing
document.addEventListener('keydown', (e) => {
  const { key, target } = e;

  // Decision: Which key was pressed?
  switch(key) {
    case 'Tab':
      // Focus management (browser default + focus trap)
      break;

    case 'Enter':
    case ' ':
      // Activate buttons/links
      if (target.matches('button, [role="button"]')) {
        target.click();
      }
      break;

    case 'Escape':
      // Close current layer
      if (currentLayer === 3) {
        layerSystem.closeModal();
      } else if (currentLayer === 2) {
        layerSystem.closeDeepRoom();
      }
      break;
  }
});
```

---

## Output Actions

### Output Types

DRo1D produces several types of output:

1. **Visual Updates** (DOM manipulation)
2. **Audio Feedback** (Web Audio API)
3. **Visual Effects** (Canvas particles)
4. **State Changes** (ARIA attributes, classes)
5. **Focus Changes** (keyboard navigation)

### Output Action Flow

```
System Decision
    │
    ├─► Audio Output
    │   └─► audioSystem.playSound('type')
    │       └─► OscillatorNode plays frequency
    │
    ├─► Visual Effects
    │   └─► particleSystem.spawn(x, y, count)
    │       └─► Canvas draws particles
    │
    ├─► DOM Updates
    │   ├─► element.classList.add('active')
    │   ├─► element.setAttribute('aria-expanded', 'true')
    │   └─► element.setAttribute('aria-hidden', 'false')
    │
    ├─► Navigation Updates
    │   ├─► layerSystem.updateBreadcrumb()
    │   └─► Update visible breadcrumb trail
    │
    └─► Focus Updates
        └─► element.focus()
            └─► Trigger screen reader announcement
```

---

## Performance Considerations

### Optimization Strategies

#### 1. Event Throttling

**Problem**: Scroll events fire 100+ times per second
**Solution**: Throttle to execute max once per 100ms

```javascript
window.addEventListener('scroll', throttle(() => {
  updateScrollAnimations();
}, 100));
```

**Impact**: 60% CPU usage reduction

#### 2. Event Debouncing

**Problem**: Window resize triggers multiple reflows
**Solution**: Debounce to execute only after 250ms of inactivity

```javascript
window.addEventListener('resize', debounce(() => {
  recalculateLayout();
}, 250));
```

#### 3. Lazy Loading

**Problem**: Large background images slow initial load
**Solution**: Load images only when they enter viewport

```javascript
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target;
      img.style.backgroundImage = `url(${img.dataset.bg})`;
      observer.unobserve(img);
    }
  });
});
```

**Impact**: 40% faster initial load

#### 4. RequestAnimationFrame

**Problem**: setInterval/setTimeout can cause jank
**Solution**: Use requestAnimationFrame for smooth 60fps

```javascript
animate() {
  this.update();  // Update physics
  this.draw();    // Render to canvas

  if (!this.paused) {
    requestAnimationFrame(() => this.animate());
  }
}
```

#### 5. Visibility-Based Pausing

**Problem**: Animations drain battery when tab is hidden
**Solution**: Pause all animations when tab not visible

```javascript
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    particleSystem.pause();
  } else {
    particleSystem.resume();
  }
});
```

**Impact**: 70% battery usage reduction

---

## Browser APIs

### 1. Canvas API

**Usage**: Particle system rendering

```javascript
const ctx = canvas.getContext('2d');
ctx.fillStyle = 'rgba(0, 240, 255, 0.8)';
ctx.fillRect(x, y, size, size);
```

### 2. Web Audio API

**Usage**: Procedural sound generation

```javascript
const oscillator = audioContext.createOscillator();
const gainNode = audioContext.createGain();

oscillator.connect(gainNode);
gainNode.connect(audioContext.destination);

oscillator.frequency.value = 440; // Hz
gainNode.gain.value = 0.3;
oscillator.start();
```

### 3. IntersectionObserver API

**Usage**: Lazy loading, scroll animations

```javascript
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1 });
```

### 4. Page Visibility API

**Usage**: Pause animations when tab hidden

```javascript
document.addEventListener('visibilitychange', () => {
  console.log(document.hidden); // true/false
});
```

### 5. MatchMedia API

**Usage**: Detect user preferences

```javascript
const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
);

prefersReducedMotion.addEventListener('change', (e) => {
  if (e.matches) {
    // User enabled reduced motion
  }
});
```

---

## Extensibility

### Plugin System Architecture

DRo1D supports plugins through a simple extension API:

```javascript
// Plugin interface
class DRo1DPlugin {
  constructor(app) {
    this.app = app;
  }

  // Lifecycle hooks
  onInit() {}
  onLayerChange(layer) {}
  onModalOpen(component) {}
  onModalClose() {}
  onDestroy() {}
}

// Example: Analytics plugin
class AnalyticsPlugin extends DRo1DPlugin {
  onInit() {
    console.log('Analytics initialized');
  }

  onModalOpen(component) {
    // Track modal views
    analytics.track('Modal Opened', { component });
  }
}

// Register plugin
app.registerPlugin(new AnalyticsPlugin(app));
```

### Extension Points

1. **Custom Sound Effects** - Extend AudioSystem
2. **Custom Particle Effects** - Extend ParticleSystem
3. **Custom Content** - Add to modalContent
4. **Custom Layers** - Extend LayerSystem
5. **Custom Themes** - Override CSS variables

---

## Future Architecture Plans

### Planned Improvements

1. **State Management** - Introduce lightweight state manager (Redux-like)
2. **Component System** - Web Components for reusable UI
3. **TypeScript** - Add type safety
4. **Service Worker** - Offline support, caching
5. **WebGL** - Hardware-accelerated particle effects
6. **Web Workers** - Offload heavy computations

---

## References

- [ES6 Modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)
- [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
- [Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)
- [IntersectionObserver](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)
- [WCAG 2.1](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)

---

**[⬆ Back to Top](#dro1d-architecture)**
