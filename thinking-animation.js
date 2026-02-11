/**
 * ============================================
 * CodeAI Pro - Thinking Animation
 * AI thinking indicator with various styles
 * ============================================
 */

class ThinkingAnimation {
    constructor(container, options = {}) {
        this.container = container;
        this.style = options.style || 'dots'; // dots, pulse, wave, brain
        this.text = options.text || 'Sedang berpikir';
        this.showProgress = options.showProgress !== false;
        this.duration = options.duration || 0; // 0 = infinite
        
        this.element = null;
        this.progressInterval = null;
        this.startTime = null;
        this.isActive = false;
    }

    /**
     * Start thinking animation
     */
    start() {
        if (this.isActive) return;
        
        this.isActive = true;
        this.startTime = Date.now();
        
        this.element = this.createElement();
        this.container.appendChild(this.element);
        
        // Animate entry
        this.element.style.animation = 'thinking-appear 0.3s ease';
        
        // Start progress if duration is set
        if (this.duration > 0 && this.showProgress) {
            this.startProgress();
        }
        
        return this.element;
    }

    /**
     * Stop thinking animation
     */
    stop() {
        if (!this.isActive) return;
        
        this.isActive = false;
        
        if (this.progressInterval) {
            clearInterval(this.progressInterval);
            this.progressInterval = null;
        }
        
        if (this.element) {
            // Animate exit
            this.element.style.animation = 'fade-out 0.3s ease forwards';
            
            setTimeout(() => {
                if (this.element && this.element.parentNode) {
                    this.element.parentNode.removeChild(this.element);
                }
                this.element = null;
            }, 300);
        }
    }

    /**
     * Create thinking element based on style
     */
    createElement() {
        const wrapper = document.createElement('div');
        wrapper.className = 'thinking-indicator';
        wrapper.id = 'thinking-indicator';
        
        switch (this.style) {
            case 'dots':
                wrapper.innerHTML = this.getDotsTemplate();
                break;
            case 'pulse':
                wrapper.innerHTML = this.getPulseTemplate();
                break;
            case 'wave':
                wrapper.innerHTML = this.getWaveTemplate();
                break;
            case 'brain':
                wrapper.innerHTML = this.getBrainTemplate();
                break;
            default:
                wrapper.innerHTML = this.getDotsTemplate();
        }
        
        return wrapper;
    }

    /**
     * Get dots animation template
     */
    getDotsTemplate() {
        return `
            <div class="thinking-avatar">
                <i class="fas fa-brain"></i>
            </div>
            <div class="thinking-content">
                <div class="thinking-text">
                    ${this.text}
                    <div class="thinking-dots">
                        <span class="thinking-dot"></span>
                        <span class="thinking-dot"></span>
                        <span class="thinking-dot"></span>
                    </div>
                </div>
                ${this.showProgress ? `
                <div class="thinking-status">
                    <span id="thinking-status-text">Memproses...</span>
                    <div class="thinking-progress-bar">
                        <div class="thinking-progress"></div>
                    </div>
                </div>
                ` : ''}
            </div>
        `;
    }

    /**
     * Get pulse animation template
     */
    getPulseTemplate() {
        return `
            <div class="thinking-avatar pulse-ring">
                <i class="fas fa-microchip"></i>
            </div>
            <div class="thinking-content">
                <div class="thinking-text">
                    ${this.text}
                </div>
                <div class="thinking-pulse-bars">
                    <div class="pulse-bar" style="animation-delay: 0s"></div>
                    <div class="pulse-bar" style="animation-delay: 0.1s"></div>
                    <div class="pulse-bar" style="animation-delay: 0.2s"></div>
                    <div class="pulse-bar" style="animation-delay: 0.3s"></div>
                    <div class="pulse-bar" style="animation-delay: 0.4s"></div>
                </div>
            </div>
        `;
    }

    /**
     * Get wave animation template
     */
    getWaveTemplate() {
        return `
            <div class="thinking-brain">
                <div class="brain-wave"></div>
                <div class="brain-wave"></div>
                <div class="brain-wave"></div>
                <div class="brain-wave"></div>
                <div class="brain-wave"></div>
                <div class="brain-wave"></div>
                <div class="brain-wave"></div>
            </div>
            <div class="thinking-content">
                <div class="thinking-text">${this.text}</div>
            </div>
        `;
    }

    /**
     * Get brain animation template
     */
    getBrainTemplate() {
        return `
            <div class="thinking-avatar">
                <svg class="brain-svg" viewBox="0 0 100 100" width="40" height="40">
                    <circle class="brain-node" cx="50" cy="30" r="5" />
                    <circle class="brain-node" cx="30" cy="50" r="5" />
                    <circle class="brain-node" cx="70" cy="50" r="5" />
                    <circle class="brain-node" cx="40" cy="70" r="5" />
                    <circle class="brain-node" cx="60" cy="70" r="5" />
                    <line class="brain-connection" x1="50" y1="30" x2="30" y2="50" />
                    <line class="brain-connection" x1="50" y1="30" x2="70" y2="50" />
                    <line class="brain-connection" x1="30" y1="50" x2="40" y2="70" />
                    <line class="brain-connection" x1="70" y1="50" x2="60" y2="70" />
                    <line class="brain-connection" x1="40" y1="70" x2="60" y2="70" />
                </svg>
            </div>
            <div class="thinking-content">
                <div class="thinking-text">${this.text}</div>
                <div class="thinking-subtext">AI sedang menganalisis permintaan Anda</div>
            </div>
        `;
    }

    /**
     * Start progress animation
     */
    startProgress() {
        const progressBar = this.element.querySelector('.thinking-progress');
        const statusText = this.element.querySelector('#thinking-status-text');
        
        if (!progressBar) return;
        
        const messages = [
            'Memproses...',
            'Menganalisis...',
            'Menghasilkan respons...',
            'Hampir selesai...'
        ];
        
        let messageIndex = 0;
        
        this.progressInterval = setInterval(() => {
            const elapsed = Date.now() - this.startTime;
            const progress = Math.min((elapsed / this.duration) * 100, 100);
            
            progressBar.style.width = progress + '%';
            
            // Update message
            if (statusText && progress > (messageIndex + 1) * 25) {
                messageIndex = Math.min(messageIndex + 1, messages.length - 1);
                statusText.textContent = messages[messageIndex];
            }
            
            if (progress >= 100) {
                this.stop();
            }
        }, 100);
    }

    /**
     * Update thinking text
     */
    updateText(text) {
        this.text = text;
        if (this.element) {
            const textEl = this.element.querySelector('.thinking-text');
            if (textEl) {
                textEl.childNodes[0].textContent = text + ' ';
            }
        }
    }

    /**
     * Set style
     */
    setStyle(style) {
        this.style = style;
        if (this.isActive) {
            this.stop();
            this.start();
        }
    }

    /**
     * Check if animation is active
     */
    isRunning() {
        return this.isActive;
    }

    /**
     * Get elapsed time
     */
    getElapsedTime() {
        if (!this.startTime) return 0;
        return Date.now() - this.startTime;
    }
}

// Static method to quickly show/hide thinking
ThinkingAnimation.show = function(container, options = {}) {
    const animation = new ThinkingAnimation(container, options);
    animation.start();
    return animation;
};

// Simple thinking indicator for quick use
class SimpleThinking {
    constructor(container) {
        this.container = container;
        this.element = null;
    }

    show(text = 'Sedang berpikir') {
        this.hide();
        
        this.element = document.createElement('div');
        this.element.className = 'typing-indicator';
        this.element.innerHTML = `
            <span>${text}</span>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
        `;
        
        this.container.appendChild(this.element);
        return this.element;
    }

    hide() {
        if (this.element && this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
            this.element = null;
        }
    }

    update(text) {
        if (this.element) {
            const span = this.element.querySelector('span');
            if (span) span.textContent = text;
        }
    }
}

// Create global instance
const thinkingAnimation = {
    current: null,
    
    show(container, options = {}) {
        this.hide();
        this.current = new ThinkingAnimation(container, options);
        this.current.start();
        return this.current;
    },
    
    hide() {
        if (this.current) {
            this.current.stop();
            this.current = null;
        }
    },
    
    isActive() {
        return this.current && this.current.isRunning();
    }
};
