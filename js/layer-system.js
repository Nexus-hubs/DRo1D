/**
 * Layer System - Manages multilayer navigation and focus
 */

import { modalContent } from './modal-content.js';

export class LayerSystem {
    constructor(audioSystem, particleSystem) {
        this.currentLayer = 1;
        this.activeRoom = null;
        this.currentSection = null;
        this.audioSystem = audioSystem;
        this.particleSystem = particleSystem;

        // DOM Elements
        this.pageDimmer = document.getElementById('pageDimmer');
        this.breadcrumb = document.getElementById('breadcrumb');
        this.breadcrumbPath = document.getElementById('breadcrumbPath');
        this.mainNav = document.getElementById('mainNav');
        this.hero = document.getElementById('hero');
        this.modalOverlay = document.getElementById('modalOverlay');
        this.modalTitle = document.getElementById('modalTitle');
        this.modalBody = document.getElementById('modalBody');
        this.modalClose = document.getElementById('modalClose');

        // Store last focused element for restoration
        this.lastFocusedElement = null;

        this.init();
    }

    init() {
        this.setupRoomTriggers();
        this.setupModalTriggers();
        this.setupCloseTriggers();
        this.setupKeyboardNavigation();
    }

    setupRoomTriggers() {
        // System cards
        const systemCards = document.querySelectorAll('.system-card[data-room]');
        systemCards.forEach(card => {
            // Make keyboard accessible
            card.setAttribute('tabindex', '0');
            card.setAttribute('role', 'button');

            const cardTitle = card.querySelector('.card-title')?.textContent || 'component';
            card.setAttribute('aria-label', `Open ${cardTitle} details`);

            card.addEventListener('click', () => this.handleCardClick(card, 'SYSTEM'));
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.handleCardClick(card, 'SYSTEM');
                }
            });
        });

        // Hardware items
        const hardwareItems = document.querySelectorAll('.hardware-item[data-room]');
        hardwareItems.forEach(item => {
            item.setAttribute('tabindex', '0');
            item.setAttribute('role', 'button');

            const itemName = item.querySelector('.hardware-name')?.textContent || 'hardware';
            item.setAttribute('aria-label', `View ${itemName} specifications`);

            item.addEventListener('click', () => this.handleCardClick(item, 'HARDWARE'));
            item.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.handleCardClick(item, 'HARDWARE');
                }
            });
        });

        // Lab images
        const labImages = document.querySelectorAll('.lab-image[data-room]');
        labImages.forEach(image => {
            image.setAttribute('tabindex', '0');
            image.setAttribute('role', 'button');

            const caption = image.querySelector('.lab-caption')?.textContent || 'phase';
            image.setAttribute('aria-label', `Explore ${caption} phase`);

            image.addEventListener('click', () => this.handleCardClick(image, 'LAB'));
            image.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.handleCardClick(image, 'LAB');
                }
            });
        });

        // AI Core title
        const aiCoreTitle = document.getElementById('aiCoreTitle');
        if (aiCoreTitle) {
            aiCoreTitle.setAttribute('tabindex', '0');
            aiCoreTitle.setAttribute('role', 'button');
            aiCoreTitle.setAttribute('aria-label', 'Enter AI Core view');

            aiCoreTitle.addEventListener('click', () => {
                this.openRoom('ai-core-room', 'AI CORE', 'INTERNAL LOGIC');
                this.audioSystem.open();
            });
            aiCoreTitle.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.openRoom('ai-core-room', 'AI CORE', 'INTERNAL LOGIC');
                    this.audioSystem.open();
                }
            });
        }
    }

    handleCardClick(element, sectionName) {
        const roomId = element.getAttribute('data-room');
        const finalRoomId = roomId.endsWith('-room') ? roomId : roomId + '-room';

        let componentName = '';
        if (sectionName === 'SYSTEM') {
            componentName = element.querySelector('.card-title')?.textContent || '';
        } else if (sectionName === 'HARDWARE') {
            componentName = element.querySelector('.hardware-name')?.textContent || '';
        } else if (sectionName === 'LAB') {
            componentName = element.querySelector('.lab-caption')?.textContent || '';
        }

        this.openRoom(finalRoomId, sectionName, componentName);
        this.audioSystem.open();
    }

    closeAllRooms() {
        document.querySelectorAll('.deep-room').forEach(room => {
            room.classList.remove('active');
        });
        document.querySelectorAll('.deep-indicator').forEach(indicator => {
            indicator.classList.remove('active');
        });
        this.activeRoom = null;
        this.currentLayer = 1;
        this.breadcrumb.classList.remove('active');

        // Remove dimming
        document.querySelectorAll('section').forEach(section => {
            section.classList.remove('dimmed');
        });
        if (this.hero) this.hero.classList.remove('dimmed');
        if (this.mainNav) this.mainNav.classList.remove('dimmed');

        // Restore focus
        if (this.lastFocusedElement) {
            this.lastFocusedElement.focus();
            this.lastFocusedElement = null;
        }
    }

    openRoom(roomId, sectionName, componentName) {
        // Store current focused element
        this.lastFocusedElement = document.activeElement;

        this.closeAllRooms();

        const room = document.getElementById(roomId);
        if (room) {
            room.classList.add('active');
            this.activeRoom = roomId;
            this.currentLayer = 2;

            // Update breadcrumb
            this.breadcrumbPath.textContent = `${sectionName.toUpperCase()} ⟡ ${componentName.toUpperCase()}`;
            this.breadcrumb.classList.add('active');

            // Show deep indicator
            const sectionId = sectionName.toLowerCase().replace(' ', '-');
            const indicator = document.getElementById(`${sectionId}DeepIndicator`);
            if (indicator) {
                indicator.classList.add('active');
            }

            // Dim other sections
            document.querySelectorAll('section').forEach(section => {
                if (section.id !== sectionId) {
                    section.classList.add('dimmed');
                }
            });
            if (this.hero) this.hero.classList.add('dimmed');

            // Scroll to room
            setTimeout(() => {
                room.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                // Focus on close button for keyboard navigation
                const closeBtn = room.querySelector('.close-room');
                if (closeBtn) closeBtn.focus();
            }, 100);
        }
    }

    setupModalTriggers() {
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('detail-link')) {
                const modalId = e.target.getAttribute('data-modal');
                if (modalContent[modalId]) {
                    this.openModal(modalId);
                    this.audioSystem.modal();
                }
            }
        });

        // Make detail links keyboard accessible
        document.querySelectorAll('.detail-link').forEach(link => {
            link.setAttribute('tabindex', '0');
            link.setAttribute('role', 'button');

            link.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    const modalId = link.getAttribute('data-modal');
                    if (modalContent[modalId]) {
                        this.openModal(modalId);
                        this.audioSystem.modal();
                    }
                }
            });
        });
    }

    openModal(contentId) {
        // Store current focused element
        this.lastFocusedElement = document.activeElement;

        const content = modalContent[contentId];
        if (content) {
            this.modalTitle.textContent = content.title;
            this.modalBody.innerHTML = content.content;
            this.modalOverlay.classList.add('active');
            this.pageDimmer.classList.add('active');
            this.currentLayer = 3;

            // Update breadcrumb for Layer 3
            const currentPath = this.breadcrumbPath.textContent;
            this.breadcrumbPath.textContent = currentPath + ' ⟡ ' + content.title.split('⟡')[1].trim();

            // Trap focus in modal
            setTimeout(() => {
                this.trapFocus(this.modalOverlay);
                this.modalClose.focus();
            }, 100);
        }
    }

    closeModal() {
        this.modalOverlay.classList.remove('active');
        this.pageDimmer.classList.remove('active');
        this.currentLayer = 2;

        // Restore Layer 2 breadcrumb
        if (this.activeRoom) {
            const room = document.getElementById(this.activeRoom);
            const roomHeader = room?.querySelector('.room-header span');
            if (roomHeader) {
                const parts = roomHeader.textContent.split('⟡');
                this.breadcrumbPath.textContent = `${parts[0].trim()} ⟡ ${parts[1].trim()}`;
            }
        }

        // Restore focus
        if (this.lastFocusedElement) {
            this.lastFocusedElement.focus();
            this.lastFocusedElement = null;
        }
    }

    setupCloseTriggers() {
        // Close room buttons
        document.querySelectorAll('.close-room').forEach(button => {
            button.setAttribute('tabindex', '0');
            button.setAttribute('role', 'button');
            button.setAttribute('aria-label', 'Close deep view');

            button.addEventListener('click', (e) => {
                e.stopPropagation();
                this.closeAllRooms();
                this.audioSystem.close();
            });
            button.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    e.stopPropagation();
                    this.closeAllRooms();
                    this.audioSystem.close();
                }
            });
        });

        // Modal close
        this.modalClose.addEventListener('click', () => {
            this.closeModal();
            this.audioSystem.close();
        });
        this.modalClose.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.closeModal();
                this.audioSystem.close();
            }
        });

        // Page dimmer
        this.pageDimmer.addEventListener('click', () => {
            if (this.currentLayer === 3) {
                this.closeModal();
            } else if (this.currentLayer === 2) {
                this.closeAllRooms();
            }
        });
    }

    setupKeyboardNavigation() {
        // Escape key handling
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                if (this.currentLayer === 3) {
                    this.closeModal();
                    this.audioSystem.close();
                } else if (this.currentLayer === 2) {
                    this.closeAllRooms();
                    this.audioSystem.close();
                }
            }
        });
    }

    trapFocus(element) {
        const focusableElements = element.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        const handleTabKey = (e) => {
            if (e.key === 'Tab') {
                if (e.shiftKey && document.activeElement === firstElement) {
                    lastElement.focus();
                    e.preventDefault();
                } else if (!e.shiftKey && document.activeElement === lastElement) {
                    firstElement.focus();
                    e.preventDefault();
                }
            }
        };

        // Remove previous listener if exists
        if (element._tabHandler) {
            element.removeEventListener('keydown', element._tabHandler);
        }

        element._tabHandler = handleTabKey;
        element.addEventListener('keydown', handleTabKey);
    }
}
