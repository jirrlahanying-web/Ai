/**
 * ============================================
 * CodeAI Pro - Utility Functions
 * Helper functions and utilities
 * ============================================
 */

// Utility Object
const Utils = {
    /**
     * Generate unique ID
     * @returns {string} Unique identifier
     */
    generateId() {
        return 'id_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    },

    /**
     * Format date to readable string
     * @param {Date} date - Date object
     * @returns {string} Formatted date string
     */
    formatDate(date) {
        const now = new Date();
        const diff = now - date;
        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (seconds < 60) return 'Baru saja';
        if (minutes < 60) return `${minutes} menit yang lalu`;
        if (hours < 24) return `${hours} jam yang lalu`;
        if (days < 7) return `${days} hari yang lalu`;
        
        return date.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    },

    /**
     * Format time
     * @param {Date} date - Date object
     * @returns {string} Formatted time string
     */
    formatTime(date) {
        return date.toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit'
        });
    },

    /**
     * Escape HTML special characters
     * @param {string} text - Raw text
     * @returns {string} Escaped HTML
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    },

    /**
     * Debounce function
     * @param {Function} func - Function to debounce
     * @param {number} wait - Wait time in ms
     * @returns {Function} Debounced function
     */
    debounce(func, wait = 300) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    /**
     * Throttle function
     * @param {Function} func - Function to throttle
     * @param {number} limit - Limit time in ms
     * @returns {Function} Throttled function
     */
    throttle(func, limit = 300) {
        let inThrottle;
        return function executedFunction(...args) {
            if (!inThrottle) {
                func(...args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    /**
     * Copy text to clipboard
     * @param {string} text - Text to copy
     * @returns {Promise<boolean>} Success status
     */
    async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (err) {
            // Fallback for older browsers
            const textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.style.position = 'fixed';
            textarea.style.opacity = '0';
            document.body.appendChild(textarea);
            textarea.select();
            
            try {
                document.execCommand('copy');
                document.body.removeChild(textarea);
                return true;
            } catch (err) {
                document.body.removeChild(textarea);
                return false;
            }
        }
    },

    /**
     * Download text as file
     * @param {string} text - Content to download
     * @param {string} filename - Filename
     * @param {string} type - MIME type
     */
    downloadFile(text, filename, type = 'text/plain') {
        const blob = new Blob([text], { type });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    },

    /**
     * Read file as text
     * @param {File} file - File object
     * @returns {Promise<string>} File content
     */
    readFileAsText(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = (e) => reject(e);
            reader.readAsText(file);
        });
    },

    /**
     * Detect code language from content
     * @param {string} code - Code content
     * @returns {string} Detected language
     */
    detectLanguage(code) {
        const patterns = {
            javascript: /\b(const|let|var|function|=>|console\.log|document\.|window\.|import\s+.*\s+from|export\s+default)\b/,
            python: /\b(def|class|import|from|print\(|if\s+__name__|:\s*$|self\.)\b/m,
            html: /<(html|head|body|div|script|style)[\s>]/i,
            css: /[.#@][a-z-]+\s*\{|@media|@keyframes|:root\s*\{/i,
            sql: /\b(SELECT|INSERT|UPDATE|DELETE|FROM|WHERE|JOIN|GROUP BY|ORDER BY)\b/i,
            java: /\b(public\s+class|private|protected|void|static|System\.out)\b/,
            cpp: /\b(#include|using\s+namespace|std::|cout\s*<<|int\s+main)\b/,
            typescript: /\b(interface|type\s+\w+|:\s*(string|number|boolean)\b|\w+:\s*\w+\s*=>)/,
            jsx: /<[A-Z]\w+|React\.|useState|useEffect/,
            json: /^\s*[\{\[]/,
            bash: /^(#!\/bin\/|echo|cd|ls|mkdir|rm|git|npm|yarn)/m,
            markdown: /^(#{1,6}\s|```|\[.*?\]\(.*?\)|\*\*|__)/m
        };

        for (const [lang, pattern] of Object.entries(patterns)) {
            if (pattern.test(code)) return lang;
        }

        return 'javascript'; // Default
    },

    /**
     * Get file extension from language
     * @param {string} language - Programming language
     * @returns {string} File extension
     */
    getFileExtension(language) {
        const extensions = {
            javascript: 'js',
            python: 'py',
            html: 'html',
            css: 'css',
            sql: 'sql',
            java: 'java',
            cpp: 'cpp',
            typescript: 'ts',
            jsx: 'jsx',
            tsx: 'tsx',
            json: 'json',
            bash: 'sh',
            markdown: 'md'
        };
        return extensions[language] || 'txt';
    },

    /**
     * Truncate text with ellipsis
     * @param {string} text - Text to truncate
     * @param {number} maxLength - Maximum length
     * @returns {string} Truncated text
     */
    truncate(text, maxLength = 50) {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength - 3) + '...';
    },

    /**
     * Sanitize filename
     * @param {string} filename - Raw filename
     * @returns {string} Sanitized filename
     */
    sanitizeFilename(filename) {
        return filename.replace(/[^a-zA-Z0-9-_\.]/g, '_').substring(0, 100);
    },

    /**
     * Parse markdown-like content
     * @param {string} text - Raw text
     * @returns {string} Parsed HTML
     */
    parseMarkdown(text) {
        let html = this.escapeHtml(text);

        // Bold
        html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
        
        // Italic
        html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
        
        // Code inline
        html = html.replace(/`(.+?)`/g, '<code>$1</code>');
        
        // Links
        html = html.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
        
        // Line breaks
        html = html.replace(/\n/g, '<br>');

        return html;
    },

    /**
     * Extract code blocks from text
     * @param {string} text - Text containing code blocks
     * @returns {Array} Array of code blocks
     */
    extractCodeBlocks(text) {
        const regex = /```(\w+)?\n([\s\S]*?)```/g;
        const blocks = [];
        let match;
        
        while ((match = regex.exec(text)) !== null) {
            blocks.push({
                language: match[1] || 'javascript',
                code: match[2].trim()
            });
        }
        
        return blocks;
    },

    /**
     * Split text by code blocks
     * @param {string} text - Full text
     * @returns {Array} Array of text and code segments
     */
    splitByCodeBlocks(text) {
        const regex = /(```(?:\w+)?\n[\s\S]*?```)/g;
        return text.split(regex).filter(Boolean);
    },

    /**
     * Animate number counting
     * @param {HTMLElement} element - Element to animate
     * @param {number} target - Target number
     * @param {number} duration - Animation duration
     */
    animateNumber(element, target, duration = 1000) {
        const start = 0;
        const increment = target / (duration / 16);
        let current = start;

        const animate = () => {
            current += increment;
            if (current < target) {
                element.textContent = Math.floor(current);
                requestAnimationFrame(animate);
            } else {
                element.textContent = target;
            }
        };

        animate();
    },

    /**
     * Scroll element into view smoothly
     * @param {HTMLElement} element - Element to scroll to
     * @param {string} behavior - Scroll behavior
     */
    scrollToElement(element, behavior = 'smooth') {
        element.scrollIntoView({ behavior, block: 'center' });
    },

    /**
     * Check if element is in viewport
     * @param {HTMLElement} element - Element to check
     * @returns {boolean} Is in viewport
     */
    isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    },

    /**
     * Get random item from array
     * @param {Array} array - Source array
     * @returns {*} Random item
     */
    randomItem(array) {
        return array[Math.floor(Math.random() * array.length)];
    },

    /**
     * Shuffle array
     * @param {Array} array - Array to shuffle
     * @returns {Array} Shuffled array
     */
    shuffle(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    },

    /**
     * Deep clone object
     * @param {*} obj - Object to clone
     * @returns {*} Cloned object
     */
    deepClone(obj) {
        return JSON.parse(JSON.stringify(obj));
    },

    /**
     * Merge objects deeply
     * @param {...object} objects - Objects to merge
     * @returns {object} Merged object
     */
    deepMerge(...objects) {
        const isObject = obj => obj && typeof obj === 'object' && !Array.isArray(obj);
        
        return objects.reduce((prev, obj) => {
            Object.keys(obj).forEach(key => {
                const pVal = prev[key];
                const oVal = obj[key];
                
                if (isObject(pVal) && isObject(oVal)) {
                    prev[key] = this.deepMerge(pVal, oVal);
                } else {
                    prev[key] = oVal;
                }
            });
            return prev;
        }, {});
    },

    /**
     * Format bytes to human readable
     * @param {number} bytes - Bytes
     * @param {number} decimals - Decimal places
     * @returns {string} Formatted string
     */
    formatBytes(bytes, decimals = 2) {
        if (bytes === 0) return '0 Bytes';
        
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizes[i];
    },

    /**
     * Capitalize first letter
     * @param {string} str - String
     * @returns {string} Capitalized string
     */
    capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    },

    /**
     * Convert to title case
     * @param {string} str - String
     * @returns {string} Title case string
     */
    toTitleCase(str) {
        return str.replace(/\w\S*/g, txt => 
            txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
        );
    },

    /**
     * Generate random color
     * @returns {string} Hex color
     */
    randomColor() {
        return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
    },

    /**
     * Check if device is touch
     * @returns {boolean} Is touch device
     */
    isTouchDevice() {
        return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    },

    /**
     * Check if device is mobile
     * @returns {boolean} Is mobile
     */
    isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    },

    /**
     * Sleep/delay
     * @param {number} ms - Milliseconds
     * @returns {Promise<void>}
     */
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    },

    /**
     * Retry async function
     * @param {Function} fn - Function to retry
     * @param {number} retries - Number of retries
     * @param {number} delay - Delay between retries
     * @returns {Promise<*>}
     */
    async retry(fn, retries = 3, delay = 1000) {
        try {
            return await fn();
        } catch (error) {
            if (retries === 0) throw error;
            await this.sleep(delay);
            return this.retry(fn, retries - 1, delay);
        }
    },

    /**
     * Create element with attributes
     * @param {string} tag - Tag name
     * @param {object} attrs - Attributes
     * @param {string} text - Text content
     * @returns {HTMLElement} Created element
     */
    createElement(tag, attrs = {}, text = '') {
        const el = document.createElement(tag);
        Object.entries(attrs).forEach(([key, value]) => {
            if (key === 'className') {
                el.className = value;
            } else if (key === 'dataset') {
                Object.entries(value).forEach(([k, v]) => {
                    el.dataset[k] = v;
                });
            } else {
                el.setAttribute(key, value);
            }
        });
        if (text) el.textContent = text;
        return el;
    },

    /**
     * Add event listener with cleanup
     * @param {HTMLElement} element - Element
     * @param {string} event - Event name
     * @param {Function} handler - Event handler
     * @param {object} options - Event options
     * @returns {Function} Cleanup function
     */
    on(element, event, handler, options = {}) {
        element.addEventListener(event, handler, options);
        return () => element.removeEventListener(event, handler, options);
    },

    /**
     * Dispatch custom event
     * @param {string} name - Event name
     * @param {*} detail - Event detail
     * @param {HTMLElement} target - Target element
     */
    emit(name, detail = null, target = document) {
        const event = new CustomEvent(name, { detail, bubbles: true });
        target.dispatchEvent(event);
    },

    /**
     * LocalStorage wrapper with error handling
     */
    storage: {
        get(key, defaultValue = null) {
            try {
                const item = localStorage.getItem(key);
                return item ? JSON.parse(item) : defaultValue;
            } catch (e) {
                console.error('Storage get error:', e);
                return defaultValue;
            }
        },

        set(key, value) {
            try {
                localStorage.setItem(key, JSON.stringify(value));
                return true;
            } catch (e) {
                console.error('Storage set error:', e);
                return false;
            }
        },

        remove(key) {
            try {
                localStorage.removeItem(key);
                return true;
            } catch (e) {
                console.error('Storage remove error:', e);
                return false;
            }
        },

        clear() {
            try {
                localStorage.clear();
                return true;
            } catch (e) {
                console.error('Storage clear error:', e);
                return false;
            }
        }
    }
};

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Utils;
}
