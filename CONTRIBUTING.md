# Contributing to DRo1D

Thank you for your interest in contributing to DRo1D! This document provides guidelines and instructions for contributing to the project.

---

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Coding Standards](#coding-standards)
- [Project Structure](#project-structure)
- [Making Changes](#making-changes)
- [Testing](#testing)
- [Pull Request Process](#pull-request-process)
- [Issue Guidelines](#issue-guidelines)
- [Community](#community)

---

## Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inclusive environment for all contributors, regardless of experience level, gender, gender identity and expression, sexual orientation, disability, personal appearance, body size, race, ethnicity, age, religion, or nationality.

### Our Standards

**Positive behavior includes:**
- Using welcoming and inclusive language
- Being respectful of differing viewpoints and experiences
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

**Unacceptable behavior includes:**
- Trolling, insulting/derogatory comments, and personal or political attacks
- Public or private harassment
- Publishing others' private information without explicit permission
- Other conduct which could reasonably be considered inappropriate in a professional setting

### Enforcement

Instances of abusive, harassing, or otherwise unacceptable behavior may be reported by opening an issue or contacting the project team. All complaints will be reviewed and investigated promptly and fairly.

---

## Getting Started

### Prerequisites

- **Git** - Version control
- **Modern web browser** - Chrome 61+, Firefox 60+, Safari 11+, or Edge 16+
- **Text editor** - VS Code, Sublime Text, or your preferred editor
- **Node.js** (optional) - For development tools and testing (v14+)
- **Python** (optional) - For local server (v3.6+)

### First Contribution?

Never contributed to open source before? Here are some resources:
- [How to Contribute to Open Source](https://opensource.guide/how-to-contribute/)
- [First Timers Only](https://www.firsttimersonly.com/)
- [GitHub's Guide to Contributing](https://guides.github.com/activities/contributing-to-open-source/)

---

## Development Setup

### 1. Fork and Clone

```bash
# Fork the repository on GitHub, then clone your fork
git clone https://github.com/YOUR_USERNAME/DRo1D.git
cd DRo1D

# Add upstream remote
git remote add upstream https://github.com/Nexus-hubs/DRo1D.git
```

### 2. Install Development Tools (Optional)

```bash
# Install Node.js dependencies for linting and testing
npm install

# Or use yarn
yarn install
```

### 3. Start Development Server

```bash
# Option 1: Python
python -m http.server 8000

# Option 2: Node.js
npx serve

# Option 3: npm script
npm run dev
```

### 4. Open in Browser

Visit `http://localhost:8000` and verify the application loads correctly.

---

## Coding Standards

### JavaScript

**Style Guide**: We follow modern ES6+ best practices

```javascript
// ✅ Good
class MyComponent {
  constructor(options = {}) {
    this.name = options.name || 'default';
  }

  initialize() {
    // Clear, descriptive names
    const userPreferences = this.loadPreferences();
    return userPreferences;
  }
}

// ❌ Avoid
var x = function(o) {
  this.n = o.n || 'd';
}
```

**Key Principles:**
- Use `const` and `let`, never `var`
- Prefer arrow functions for callbacks
- Use template literals for string interpolation
- Write self-documenting code with descriptive names
- Add comments only for complex logic, not obvious code
- Use ES6 modules (`import`/`export`)
- Handle errors gracefully with try-catch
- Validate input parameters

### CSS

**Style Guide**: BEM-inspired naming with modern CSS

```css
/* ✅ Good: Clear, scoped naming */
.nav-breadcrumb {
  display: flex;
  gap: 0.5rem;
}

.nav-breadcrumb__item {
  padding: 0.25rem 0.5rem;
}

.nav-breadcrumb__item--active {
  color: var(--accent-cyan);
}

/* ❌ Avoid: Generic, unclear names */
.item {
  padding: 5px;
}
```

**Key Principles:**
- Use CSS custom properties for theming
- Mobile-first responsive design
- Avoid `!important` (use specificity)
- Group related properties
- Use meaningful class names
- Leverage CSS Grid and Flexbox
- Support reduced motion with `prefers-reduced-motion`

### HTML

**Key Principles:**
- Semantic HTML5 elements (`<nav>`, `<section>`, `<article>`)
- Include ARIA labels for accessibility
- Proper heading hierarchy (h1 → h2 → h3)
- Alt text for all images
- Form labels associated with inputs
- Keyboard navigation support

### Accessibility

**All contributions must maintain WCAG 2.1 AA compliance:**
- ✅ Keyboard navigation (Tab, Enter, Escape, Space)
- ✅ Screen reader support (ARIA labels, roles, live regions)
- ✅ Focus management (visible focus indicators, logical tab order)
- ✅ Color contrast (4.5:1 for text, 3:1 for UI components)
- ✅ Reduced motion support
- ✅ Alternative text for images
- ✅ Descriptive link text

---

## Project Structure

```
DRo1D/
├── index.html              # Main entry point
├── css/
│   ├── variables.css       # Design tokens (modify colors/spacing here)
│   ├── base.css           # Global styles
│   ├── components.css     # Component-specific styles
│   ├── animations.css     # Keyframe animations
│   └── responsive.css     # Media queries
├── js/
│   ├── main.js            # App initialization (DRo1DApp class)
│   ├── layer-system.js    # Navigation system
│   ├── particles.js       # Visual effects
│   ├── audio.js           # Sound system
│   ├── modal-content.js   # Content data
│   ├── config.js          # Configuration (NEW)
│   ├── logger.js          # Logging system (NEW)
│   └── utils.js           # Helper functions
├── docs/                  # Documentation
├── tests/                 # Test files
├── scripts/               # Build/deploy scripts
└── assets/                # Images, fonts, etc.
```

### Where to Make Changes

- **Adding a feature**: Create new module in `js/`, import in `main.js`
- **Styling changes**: Modify appropriate CSS file based on scope
- **Content updates**: Edit `modal-content.js` or HTML
- **Configuration**: Update `js/config.js`
- **Documentation**: Update relevant `.md` files in `docs/`

---

## Making Changes

### Branch Naming

Create descriptive branch names:

```bash
# Feature branches
git checkout -b feature/add-diagnostics-panel
git checkout -b feature/plugin-system

# Bug fixes
git checkout -b fix/audio-initialization-mobile
git checkout -b fix/focus-trap-modal

# Documentation
git checkout -b docs/update-architecture-guide

# Performance
git checkout -b perf/optimize-particle-rendering
```

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```bash
# Format: type(scope): description

# Examples
feat(audio): add volume control slider
fix(layers): correct focus restoration on modal close
docs(readme): update installation instructions
style(css): improve mobile responsiveness for nav
perf(particles): reduce canvas draw calls by 40%
test(layers): add unit tests for LayerSystem
refactor(utils): simplify debounce implementation
chore(deps): update development dependencies
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `style`: Code style (formatting, not CSS)
- `refactor`: Code change that neither fixes a bug nor adds a feature
- `perf`: Performance improvement
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Keep Changes Focused

- One logical change per commit
- One feature/fix per pull request
- Keep pull requests small and reviewable (< 400 lines preferred)
- If you're making multiple unrelated changes, submit separate PRs

---

## Testing

### Manual Testing Checklist

Before submitting a PR, test:

- [ ] **Desktop browsers**: Chrome, Firefox, Safari, Edge
- [ ] **Mobile browsers**: Mobile Safari, Chrome Mobile
- [ ] **Keyboard navigation**: Tab through all interactive elements
- [ ] **Screen reader**: Test with NVDA (Windows) or VoiceOver (macOS)
- [ ] **Responsive design**: Test at 360px, 768px, 1024px, 1920px widths
- [ ] **Reduced motion**: Enable in OS settings, verify animations respect preference
- [ ] **Performance**: Check FPS in dev tools (should be 60fps)
- [ ] **Console errors**: No errors or warnings in browser console

### Automated Testing

```bash
# Run linter
npm run lint

# Run tests
npm test

# Run benchmarks
npm run benchmark

# Lighthouse audit
npm run lighthouse
```

### Writing Tests

```javascript
// tests/layer-system.test.js
import { LayerSystem } from '../js/layer-system.js';

describe('LayerSystem', () => {
  describe('navigation', () => {
    it('should open layer 2 when clicking a section', () => {
      const layerSystem = new LayerSystem();
      const section = document.querySelector('.section');

      layerSystem.openDeepRoom('system');

      expect(document.querySelector('.layer-2')).toHaveClass('active');
    });
  });
});
```

---

## Pull Request Process

### 1. Update Your Branch

```bash
# Sync with upstream
git fetch upstream
git rebase upstream/main

# Or merge if preferred
git merge upstream/main
```

### 2. Run Pre-submission Checks

```bash
# Lint code
npm run lint

# Run tests
npm test

# Verify no console errors
# (manual browser check)
```

### 3. Create Pull Request

**PR Title**: Use conventional commit format
```
feat(diagnostics): add system status panel
```

**PR Description Template**:

```markdown
## Description
Brief summary of changes

## Motivation
Why is this change needed?

## Changes Made
- Added diagnostics panel component
- Integrated with layer system
- Added CSS animations for panel

## Testing
- [x] Tested on Chrome, Firefox, Safari
- [x] Keyboard navigation works
- [x] Screen reader tested
- [x] Mobile responsive
- [x] No console errors

## Screenshots
(if applicable)

## Breaking Changes
None / List any breaking changes

## Checklist
- [x] Code follows project style guidelines
- [x] Self-review completed
- [x] Comments added for complex logic
- [x] Documentation updated
- [x] Tests added/updated
- [x] All tests passing
- [x] No new warnings
```

### 4. Code Review Process

- Maintainers will review within 48 hours
- Address feedback by pushing new commits
- Once approved, maintainers will merge
- Delete your branch after merge

### 5. After Merge

```bash
# Update your local main
git checkout main
git pull upstream main

# Delete feature branch
git branch -d feature/your-branch-name
```

---

## Issue Guidelines

### Before Creating an Issue

1. **Search existing issues** - Your issue may already exist
2. **Check documentation** - Answer might be in docs
3. **Verify it's reproducible** - Can you consistently reproduce it?

### Bug Reports

Use the bug report template:

```markdown
**Describe the bug**
Clear and concise description

**To Reproduce**
Steps to reproduce:
1. Go to '...'
2. Click on '...'
3. Scroll down to '...'
4. See error

**Expected behavior**
What you expected to happen

**Screenshots**
If applicable

**Environment:**
- OS: [e.g. macOS 13.2]
- Browser: [e.g. Chrome 110]
- Version: [e.g. 2.0.1]

**Additional context**
Any other relevant information
```

### Feature Requests

Use the feature request template:

```markdown
**Is your feature request related to a problem?**
Clear description of the problem

**Describe the solution you'd like**
Clear description of what you want to happen

**Describe alternatives you've considered**
Other solutions you've thought about

**Additional context**
Mockups, examples, or other context
```

### Good Issue Examples

✅ **Good**: "Audio does not initialize on iPhone 14 Safari 16 when user taps 'Enable Audio' button. Console shows 'AudioContext was not allowed to start.'"

❌ **Poor**: "Audio doesn't work"

---

## Community

### Getting Help

- **Documentation**: Check [docs/](docs/) first
- **Issues**: Search or create a GitHub issue
- **Discussions**: Use GitHub Discussions for questions
- **Email**: Contact maintainers for private matters

### Recognition

Contributors will be recognized in:
- GitHub contributors list
- CHANGELOG.md for significant contributions
- README.md acknowledgments section

---

## Development Tips

### Recommended VS Code Extensions

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "yzhang.markdown-all-in-one"
  ]
}
```

### Useful Commands

```bash
# Watch for file changes and reload
npm run dev:watch

# Format all files
npm run format

# Check for accessibility issues
npm run a11y

# Analyze bundle size
npm run analyze
```

### Performance Profiling

1. Open Chrome DevTools
2. Go to Performance tab
3. Click Record
4. Interact with the application
5. Stop recording
6. Analyze for jank or slow operations

---

## Questions?

If you have questions not covered here:
1. Check existing [documentation](docs/)
2. Search [closed issues](https://github.com/Nexus-hubs/DRo1D/issues?q=is%3Aissue+is%3Aclosed)
3. Open a [GitHub Discussion](https://github.com/Nexus-hubs/DRo1D/discussions)
4. Create a [new issue](https://github.com/Nexus-hubs/DRo1D/issues/new)

---

**Thank you for contributing to DRo1D!** 🚀

Every contribution, no matter how small, makes a difference. We appreciate your time and effort.
