/**
 * ============================================
 * CodeAI Pro - UI Components
 * Reusable UI components and helpers
 * ============================================
 */

// Toast Notification System
class Toast {
    constructor(message, type = 'info', duration = 3000) {
        this.message = message;
        this.type = type;
        this.duration = duration;
        this.element = null;
    }

    show() {
        const container = document.getElementById('toast-container');
        if (!container) return;

        this.element = document.createElement('div');
        this.element.className = `toast ${this.type}`;
        
        const icons = {
            success: 'fa-check-circle',
            error: 'fa-times-circle',
            warning: 'fa-exclamation-triangle',
            info: 'fa-info-circle'
        };

        this.element.innerHTML = `
            <i class="fas ${icons[this.type] || icons.info}"></i>
            <span class="toast-message">${this.message}</span>
            <button class="toast-close" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;

        container.appendChild(this.element);

        // Auto remove
        setTimeout(() => {
            this.hide();
        }, this.duration);

        return this;
    }

    hide() {
        if (this.element) {
            this.element.style.animation = 'fade-out 0.3s ease forwards';
            setTimeout(() => {
                if (this.element && this.element.parentNode) {
                    this.element.parentNode.removeChild(this.element);
                }
            }, 300);
        }
    }

    // Static methods
    static show(message, type = 'info', duration = 3000) {
        return new Toast(message, type, duration).show();
    }

    static success(message, duration = 3000) {
        return Toast.show(message, 'success', duration);
    }

    static error(message, duration = 3000) {
        return Toast.show(message, 'error', duration);
    }

    static warning(message, duration = 3000) {
        return Toast.show(message, 'warning', duration);
    }

    static info(message, duration = 3000) {
        return Toast.show(message, 'info', duration);
    }
}

// Modal Component
class Modal {
    constructor(elementId) {
        this.element = document.getElementById(elementId);
        this.overlay = this.element?.querySelector('.modal-overlay');
        this.closeBtn = this.element?.querySelector('.modal-close');
        
        this.init();
    }

    init() {
        if (!this.element) return;

        // Close on overlay click
        if (this.overlay) {
            this.overlay.addEventListener('click', () => this.hide());
        }

        // Close on button click
        if (this.closeBtn) {
            this.closeBtn.addEventListener('click', () => this.hide());
        }

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isVisible()) {
                this.hide();
            }
        });
    }

    show() {
        if (this.element) {
            this.element.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
            Utils.emit('modalShow', null, this.element);
        }
    }

    hide() {
        if (this.element) {
            this.element.classList.add('hidden');
            document.body.style.overflow = '';
            Utils.emit('modalHide', null, this.element);
        }
    }

    toggle() {
        if (this.isVisible()) {
            this.hide();
        } else {
            this.show();
        }
    }

    isVisible() {
        return this.element && !this.element.classList.contains('hidden');
    }
}

// Tooltip Component
class Tooltip {
    constructor(element, text, options = {}) {
        this.element = element;
        this.text = text;
        this.position = options.position || 'top';
        this.tooltip = null;

        this.init();
    }

    init() {
        this.element.addEventListener('mouseenter', () => this.show());
        this.element.addEventListener('mouseleave', () => this.hide());
    }

    show() {
        this.tooltip = document.createElement('div');
        this.tooltip.className = `tooltip tooltip-${this.position}`;
        this.tooltip.textContent = this.text;
        document.body.appendChild(this.tooltip);

        const rect = this.element.getBoundingClientRect();
        const tooltipRect = this.tooltip.getBoundingClientRect();

        let top, left;

        switch (this.position) {
            case 'top':
                top = rect.top - tooltipRect.height - 8;
                left = rect.left + (rect.width - tooltipRect.width) / 2;
                break;
            case 'bottom':
                top = rect.bottom + 8;
                left = rect.left + (rect.width - tooltipRect.width) / 2;
                break;
            case 'left':
                top = rect.top + (rect.height - tooltipRect.height) / 2;
                left = rect.left - tooltipRect.width - 8;
                break;
            case 'right':
                top = rect.top + (rect.height - tooltipRect.height) / 2;
                left = rect.right + 8;
                break;
        }

        this.tooltip.style.top = `${top}px`;
        this.tooltip.style.left = `${left}px`;
    }

    hide() {
        if (this.tooltip && this.tooltip.parentNode) {
            this.tooltip.parentNode.removeChild(this.tooltip);
            this.tooltip = null;
        }
    }
}

// Dropdown Component
class Dropdown {
    constructor(trigger, menu, options = {}) {
        this.trigger = trigger;
        this.menu = menu;
        this.closeOnClick = options.closeOnClick !== false;
        this.closeOnOutside = options.closeOnOutside !== false;

        this.init();
    }

    init() {
        this.trigger.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggle();
        });

        if (this.closeOnClick) {
            this.menu.addEventListener('click', (e) => {
                if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON') {
                    this.hide();
                }
            });
        }

        if (this.closeOnOutside) {
            document.addEventListener('click', (e) => {
                if (!this.menu.contains(e.target) && !this.trigger.contains(e.target)) {
                    this.hide();
                }
            });
        }
    }

    show() {
        this.menu.classList.add('show');
        this.trigger.setAttribute('aria-expanded', 'true');
    }

    hide() {
        this.menu.classList.remove('show');
        this.trigger.setAttribute('aria-expanded', 'false');
    }

    toggle() {
        if (this.menu.classList.contains('show')) {
            this.hide();
        } else {
            this.show();
        }
    }
}

// Context Menu Component
class ContextMenu {
    constructor(container, items) {
        this.container = container;
        this.items = items;
        this.menu = document.getElementById('context-menu');

        this.init();
    }

    init() {
        this.container.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            this.show(e.clientX, e.clientY);
        });

        document.addEventListener('click', () => {
            this.hide();
        });
    }

    show(x, y) {
        if (!this.menu) return;

        this.menu.innerHTML = '<ul>' + this.items.map(item => `
            <li data-action="${item.action}">
                <i class="fas ${item.icon}"></i>
                ${item.label}
            </li>
        `).join('') + '</ul>';

        this.menu.style.left = `${x}px`;
        this.menu.style.top = `${y}px`;
        this.menu.classList.remove('hidden');

        // Handle item clicks
        this.menu.querySelectorAll('li').forEach(li => {
            li.addEventListener('click', () => {
                const action = li.dataset.action;
                const item = this.items.find(i => i.action === action);
                if (item && item.handler) {
                    item.handler();
                }
            });
        });
    }

    hide() {
        if (this.menu) {
            this.menu.classList.add('hidden');
        }
    }
}

// Loading Spinner Component
class Spinner {
    constructor(container, options = {}) {
        this.container = container;
        this.size = options.size || 'medium';
        this.text = options.text || '';
        this.element = null;
    }

    show() {
        this.element = document.createElement('div');
        this.element.className = `spinner-container spinner-${this.size}`;
        this.element.innerHTML = `
            <div class="spinner"></div>
            ${this.text ? `<span class="spinner-text">${this.text}</span>` : ''}
        `;
        this.container.appendChild(this.element);
    }

    hide() {
        if (this.element && this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
            this.element = null;
        }
    }

    updateText(text) {
        this.text = text;
        if (this.element) {
            const textEl = this.element.querySelector('.spinner-text');
            if (textEl) textEl.textContent = text;
        }
    }
}

// Confirmation Dialog
class ConfirmDialog {
    constructor(options = {}) {
        this.title = options.title || 'Konfirmasi';
        this.message = options.message || 'Apakah Anda yakin?';
        this.confirmText = options.confirmText || 'Ya';
        this.cancelText = options.cancelText || 'Batal';
        this.onConfirm = options.onConfirm || null;
        this.onCancel = options.onCancel || null;
    }

    show() {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-overlay"></div>
            <div class="modal-content" style="max-width: 400px;">
                <div class="modal-header">
                    <h2>${this.title}</h2>
                </div>
                <div class="modal-body">
                    <p>${this.message}</p>
                    <div style="display: flex; gap: 10px; margin-top: 20px; justify-content: flex-end;">
                        <button class="btn-secondary cancel-btn">${this.cancelText}</button>
                        <button class="btn-new-chat confirm-btn">${this.confirmText}</button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        const overlay = modal.querySelector('.modal-overlay');
        const cancelBtn = modal.querySelector('.cancel-btn');
        const confirmBtn = modal.querySelector('.confirm-btn');

        const close = () => {
            modal.remove();
        };

        overlay.addEventListener('click', () => {
            close();
            if (this.onCancel) this.onCancel();
        });

        cancelBtn.addEventListener('click', () => {
            close();
            if (this.onCancel) this.onCancel();
        });

        confirmBtn.addEventListener('click', () => {
            close();
            if (this.onConfirm) this.onConfirm();
        });
    }

    static confirm(message, onConfirm, onCancel) {
        return new ConfirmDialog({
            message,
            onConfirm,
            onCancel
        }).show();
    }
}

// Auto-resize Textarea
class AutoResizeTextarea {
    constructor(textarea, options = {}) {
        this.textarea = textarea;
        this.minRows = options.minRows || 1;
        this.maxRows = options.maxRows || 10;

        this.init();
    }

    init() {
        this.textarea.addEventListener('input', () => this.resize());
        this.textarea.addEventListener('keydown', (e) => this.handleKeydown(e));
        
        // Initial resize
        this.resize();
    }

    resize() {
        this.textarea.style.height = 'auto';
        
        const lineHeight = parseInt(getComputedStyle(this.textarea).lineHeight);
        const maxHeight = lineHeight * this.maxRows;
        
        let newHeight = this.textarea.scrollHeight;
        
        if (newHeight > maxHeight) {
            newHeight = maxHeight;
            this.textarea.style.overflowY = 'auto';
        } else {
            this.textarea.style.overflowY = 'hidden';
        }
        
        this.textarea.style.height = `${newHeight}px`;
    }

    handleKeydown(e) {
        // Enter to send (unless Shift is held)
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            const form = this.textarea.closest('form');
            if (form) {
                form.dispatchEvent(new Event('submit'));
            } else {
                // Trigger custom event
                this.textarea.dispatchEvent(new CustomEvent('enterKey'));
            }
        }
    }

    clear() {
        this.textarea.value = '';
        this.resize();
    }

    focus() {
        this.textarea.focus();
    }

    get value() {
        return this.textarea.value;
    }

    set value(val) {
        this.textarea.value = val;
        this.resize();
    }
}

// Scroll to Bottom Helper
class ScrollHelper {
    constructor(container) {
        this.container = container;
        this.isAutoScroll = true;
        this.scrollThreshold = 100;

        this.init();
    }

    init() {
        this.container.addEventListener('scroll', () => {
            const { scrollTop, scrollHeight, clientHeight } = this.container;
            const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
            this.isAutoScroll = distanceFromBottom < this.scrollThreshold;
        });
    }

    scrollToBottom(force = false) {
        if (force || this.isAutoScroll) {
            this.container.scrollTop = this.container.scrollHeight;
        }
    }

    scrollToElement(element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    isAtBottom() {
        const { scrollTop, scrollHeight, clientHeight } = this.container;
        return scrollHeight - scrollTop - clientHeight < this.scrollThreshold;
    }
}

// Skeleton Loading
class Skeleton {
    constructor(container, options = {}) {
        this.container = container;
        this.count = options.count || 3;
        this.type = options.type || 'text'; // text, card, list
        this.element = null;
    }

    show() {
        this.element = document.createElement('div');
        this.element.className = 'skeleton-container';

        for (let i = 0; i < this.count; i++) {
            const skeleton = document.createElement('div');
            skeleton.className = `skeleton skeleton-${this.type}`;
            skeleton.innerHTML = '<div class="skeleton-line"></div>'.repeat(3);
            this.element.appendChild(skeleton);
        }

        this.container.appendChild(this.element);
    }

    hide() {
        if (this.element && this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
            this.element = null;
        }
    }
}

// Create global instances
const uiComponents = {
    Toast,
    Modal,
    Tooltip,
    Dropdown,
    ContextMenu,
    Spinner,
    ConfirmDialog,
    AutoResizeTextarea,
    ScrollHelper,
    Skeleton
n};
