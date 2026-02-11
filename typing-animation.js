/**
 * ============================================
 * CodeAI Pro - Typing Animation
 * Typewriter effect for AI responses
 * ============================================
 */

class TypingAnimation {
    constructor(options = {}) {
        this.speed = options.speed || 20; // ms per character
        this.variation = options.variation || 5; // random variation
        this.pauseChars = options.pauseChars || ['.', '!', '?', '\n'];
        this.pauseDuration = options.pauseDuration || 300;
        this.onType = options.onType || null;
        this.onComplete = options.onComplete || null;
        this.onCodeBlock = options.onCodeBlock || null;
        
        this.isTyping = false;
        this.isPaused = false;
        this.currentText = '';
        this.fullText = '';
        this.currentIndex = 0;
        this.rafId = null;
        this.lastTime = 0;
        this.accumulatedTime = 0;
    }

    /**
     * Start typing animation
     * @param {string} text - Full text to type
     * @param {HTMLElement} element - Target element
     */
    async type(text, element) {
        if (this.isTyping) {
            this.stop();
        }

        this.isTyping = true;
        this.isPaused = false;
        this.fullText = text;
        this.currentText = '';
        this.currentIndex = 0;
        this.accumulatedTime = 0;

        // Parse text for special handling (code blocks, markdown)
        const segments = this.parseText(text);

        for (const segment of segments) {
            if (!this.isTyping) break;

            if (segment.type === 'code') {
                // Handle code block - show instantly or with minimal animation
                if (this.onCodeBlock) {
                    this.onCodeBlock(segment);
                }
                this.currentText += segment.content;
                if (element) {
                    element.innerHTML = this.formatOutput(this.currentText);
                }
            } else {
                // Type regular text
                await this.typeSegment(segment.content, element);
            }
        }

        this.isTyping = false;
        
        if (this.onComplete) {
            this.onComplete(this.currentText);
        }

        return this.currentText;
    }

    /**
     * Type a single segment
     */
    async typeSegment(text, element) {
        return new Promise((resolve) => {
            const typeChar = (timestamp) => {
                if (!this.isTyping || this.isPaused) {
                    this.rafId = requestAnimationFrame(typeChar);
                    return;
                }

                if (!this.lastTime) this.lastTime = timestamp;
                const deltaTime = timestamp - this.lastTime;
                this.lastTime = timestamp;
                this.accumulatedTime += deltaTime;

                const currentSpeed = this.getCurrentSpeed();

                while (this.accumulatedTime >= currentSpeed && this.isTyping) {
                    this.accumulatedTime -= currentSpeed;

                    if (this.currentIndex < text.length) {
                        const char = text[this.currentIndex];
                        this.currentText += char;
                        this.currentIndex++;

                        // Check for pause characters
                        if (this.pauseChars.includes(char)) {
                            this.accumulatedTime -= this.pauseDuration;
                        }

                        // Update display
                        if (element) {
                            element.innerHTML = this.formatOutput(this.currentText);
                        }

                        // Call onType callback
                        if (this.onType) {
                            this.onType(char, this.currentText);
                        }
                    } else {
                        resolve();
                        return;
                    }
                }

                if (this.isTyping && this.currentIndex < text.length) {
                    this.rafId = requestAnimationFrame(typeChar);
                } else {
                    resolve();
                }
            };

            this.rafId = requestAnimationFrame(typeChar);
        });
    }

    /**
     * Parse text into segments (text and code blocks)
     */
    parseText(text) {
        const segments = [];
        const codeBlockRegex = /(```[\s\S]*?```)/g;
        let lastIndex = 0;
        let match;

        while ((match = codeBlockRegex.exec(text)) !== null) {
            // Add text before code block
            if (match.index > lastIndex) {
                segments.push({
                    type: 'text',
                    content: text.substring(lastIndex, match.index)
                });
            }

            // Add code block
            segments.push({
                type: 'code',
                content: match[0],
                language: this.extractLanguage(match[0]),
                code: this.extractCode(match[0])
            });

            lastIndex = match.index + match[0].length;
        }

        // Add remaining text
        if (lastIndex < text.length) {
            segments.push({
                type: 'text',
                content: text.substring(lastIndex)
            });
        }

        return segments;
    }

    /**
     * Extract language from code block
     */
    extractLanguage(codeBlock) {
        const match = codeBlock.match(/```(\w+)?/);
        return match?.[1] || 'javascript';
    }

    /**
     * Extract code from code block
     */
    extractCode(codeBlock) {
        return codeBlock.replace(/```\w*\n?/, '').replace(/```$/, '').trim();
    }

    /**
     * Format output with HTML
     */
    formatOutput(text) {
        // Escape HTML
        let formatted = Utils.escapeHtml(text);

        // Format inline code
        formatted = formatted.replace(/`([^`]+)`/g, '<code>$1</code>');

        // Format bold
        formatted = formatted.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

        // Format italic
        formatted = formatted.replace(/\*([^*]+)\*/g, '<em>$1</em>');

        // Format headers
        formatted = formatted.replace(/^### (.+)$/gm, '<h3>$1</h3>');
        formatted = formatted.replace(/^## (.+)$/gm, '<h2>$1</h2>');
        formatted = formatted.replace(/^# (.+)$/gm, '<h1>$1</h1>');

        // Format lists
        formatted = formatted.replace(/^- \[(.+)\] (.+)$/gm, '<div class="checkbox-item"><input type="checkbox" $1> $2</div>');
        formatted = formatted.replace(/^- (.+)$/gm, '<li>$1</li>');
        formatted = formatted.replace(/(<li>.+<\/li>\n?)+/g, '<ul>$&</ul>');

        // Convert newlines to <br> (but not inside code blocks)
        const parts = formatted.split(/(```[\s\S]*?```)/);
        formatted = parts.map((part, index) => {
            if (index % 2 === 1) {
                // Code block - keep as is
                return part;
            }
            return part.replace(/\n/g, '<br>');
        }).join('');

        return formatted;
    }

    /**
     * Get current typing speed with variation
     */
    getCurrentSpeed() {
        const variation = (Math.random() - 0.5) * 2 * this.variation;
        return Math.max(5, this.speed + variation);
    }

    /**
     * Pause typing
     */
    pause() {
        this.isPaused = true;
    }

    /**
     * Resume typing
     */
    resume() {
        this.isPaused = false;
    }

    /**
     * Stop typing
     */
    stop() {
        this.isTyping = false;
        this.isPaused = false;
        if (this.rafId) {
            cancelAnimationFrame(this.rafId);
            this.rafId = null;
        }
    }

    /**
     * Skip to end
     */
    skip() {
        this.stop();
        this.currentText = this.fullText;
        this.currentIndex = this.fullText.length;
        
        if (this.onComplete) {
            this.onComplete(this.currentText);
        }
        
        return this.currentText;
    }

    /**
     * Check if currently typing
     */
    isActive() {
        return this.isTyping;
    }

    /**
     * Check if paused
     */
    isPausedState() {
        return this.isPaused;
    }

    /**
     * Get current progress
     */
    getProgress() {
        if (!this.fullText) return 0;
        return (this.currentIndex / this.fullText.length) * 100;
    }

    /**
     * Set typing speed
     */
    setSpeed(speed) {
        this.speed = speed;
    }

    /**
     * Get current text
     */
    getCurrentText() {
        return this.currentText;
    }

    /**
     * Get remaining text
     */
    getRemainingText() {
        return this.fullText.substring(this.currentIndex);
    }
}

// Simpler typewriter for basic use
class Typewriter {
    constructor(element, options = {}) {
        this.element = element;
        this.speed = options.speed || 30;
        this.cursor = options.cursor !== false;
        this.cursorChar = options.cursorChar || '|';
        this.onComplete = options.onComplete || null;
        
        this.text = '';
        this.index = 0;
        this.isTyping = false;
        this.interval = null;
    }

    type(text) {
        return new Promise((resolve) => {
            this.text = text;
            this.index = 0;
            this.isTyping = true;
            
            this.interval = setInterval(() => {
                if (this.index < this.text.length) {
                    const char = this.text[this.index];
                    this.element.textContent += char;
                    this.index++;
                } else {
                    this.stop();
                    if (this.onComplete) this.onComplete();
                    resolve();
                }
            }, this.speed);
        });
    }

    stop() {
        this.isTyping = false;
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
    }

    clear() {
        this.stop();
        this.element.textContent = '';
        this.index = 0;
    }

    setSpeed(speed) {
        this.speed = speed;
        if (this.isTyping) {
            this.stop();
            this.type(this.text.substring(this.index));
        }
    }
}

// Create global instances
const typingAnimation = new TypingAnimation();
