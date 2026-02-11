/**
 * ============================================
 * CodeAI Pro - Code Highlighter
 * Syntax highlighting and code block management
 * ============================================
 */

class CodeHighlighter {
    constructor() {
        this.languages = [
            'javascript', 'python', 'html', 'css', 'sql',
            'java', 'cpp', 'typescript', 'jsx', 'tsx',
            'json', 'bash', 'markdown', 'yaml', 'xml'
        ];
        this.theme = 'tomorrow';
        this.lineNumbers = true;
        this.wrapLines = false;
    }

    /**
     * Highlight code element
     * @param {HTMLElement} element - Code element
     * @param {string} language - Language
     */
    highlight(element, language = null) {
        if (!element) return;

        // Auto-detect language if not provided
        if (!language) {
            language = this.detectLanguage(element.textContent);
        }

        // Set language class
        element.className = `language-${language}`;

        // Apply Prism highlight
        if (window.Prism) {
            Prism.highlightElement(element);
        }

        return element;
    }

    /**
     * Highlight all code blocks in container
     * @param {HTMLElement} container - Container element
     */
    highlightAll(container = document) {
        if (!window.Prism) return;

        const codeBlocks = container.querySelectorAll('pre code');
        codeBlocks.forEach(block => {
            this.highlight(block);
        });
    }

    /**
     * Create code block element
     * @param {string} code - Code content
     * @param {string} language - Programming language
     * @param {object} options - Options
     * @returns {HTMLElement} Code block element
     */
    createCodeBlock(code, language = 'javascript', options = {}) {
        const {
            showLineNumbers = this.lineNumbers,
            showCopyButton = true,
            showRunButton = false,
            showDownloadButton = true,
            filename = null,
            collapsible = false
        } = options;

        // Create wrapper
        const wrapper = document.createElement('div');
        wrapper.className = 'code-block-wrapper';

        // Create header
        const header = document.createElement('div');
        header.className = 'code-block-header';

        // Language label
        const langLabel = document.createElement('span');
        langLabel.className = 'code-language';
        langLabel.textContent = language.toUpperCase();
        header.appendChild(langLabel);

        // Filename if provided
        if (filename) {
            const filenameLabel = document.createElement('span');
            filenameLabel.className = 'code-filename';
            filenameLabel.textContent = filename;
            header.appendChild(filenameLabel);
        }

        // Actions
        const actions = document.createElement('div');
        actions.className = 'code-actions';

        // Copy button
        if (showCopyButton) {
            const copyBtn = document.createElement('button');
            copyBtn.className = 'code-action-btn';
            copyBtn.innerHTML = '<i class="fas fa-copy"></i>';
            copyBtn.title = 'Salin kode';
            copyBtn.onclick = () => this.copyCode(code, copyBtn);
            actions.appendChild(copyBtn);
        }

        // Run button (for certain languages)
        if (showRunButton && ['javascript', 'html'].includes(language)) {
            const runBtn = document.createElement('button');
            runBtn.className = 'code-action-btn';
            runBtn.innerHTML = '<i class="fas fa-play"></i>';
            runBtn.title = 'Jalankan kode';
            runBtn.onclick = () => this.runCode(code, language);
            actions.appendChild(runBtn);
        }

        // Download button
        if (showDownloadButton) {
            const downloadBtn = document.createElement('button');
            downloadBtn.className = 'code-action-btn';
            downloadBtn.innerHTML = '<i class="fas fa-download"></i>';
            downloadBtn.title = 'Unduh kode';
            downloadBtn.onclick = () => this.downloadCode(code, language, filename);
            actions.appendChild(downloadBtn);
        }

        header.appendChild(actions);
        wrapper.appendChild(header);

        // Create pre/code element
        const pre = document.createElement('pre');
        if (showLineNumbers) {
            pre.classList.add('line-numbers');
        }

        const codeEl = document.createElement('code');
        codeEl.className = `language-${language}`;
        codeEl.textContent = code;

        pre.appendChild(codeEl);
        wrapper.appendChild(pre);

        // Highlight
        this.highlight(codeEl, language);

        return wrapper;
    }

    /**
     * Detect language from code
     */
    detectLanguage(code) {
        return Utils.detectLanguage(code);
    }

    /**
     * Copy code to clipboard
     */
    async copyCode(code, button = null) {
        const success = await Utils.copyToClipboard(code);
        
        if (button) {
            const originalHTML = button.innerHTML;
            button.innerHTML = success ? 
                '<i class="fas fa-check"></i>' : 
                '<i class="fas fa-times"></i>';
            button.classList.add(success ? 'success' : 'error');
            
            setTimeout(() => {
                button.innerHTML = originalHTML;
                button.classList.remove('success', 'error');
            }, 2000);
        }

        // Show toast
        Toast.show(
            success ? 'Kode berhasil disalin!' : 'Gagal menyalin kode',
            success ? 'success' : 'error'
        );

        return success;
    }

    /**
     * Run code (for JavaScript/HTML)
     */
    runCode(code, language) {
        if (language === 'html') {
            // Open in new window
            const newWindow = window.open('', '_blank');
            newWindow.document.write(code);
            newWindow.document.close();
        } else if (language === 'javascript') {
            try {
                // eslint-disable-next-line no-eval
                const result = eval(code);
                console.log('Code result:', result);
                Toast.show('Kode berhasil dijalankan! Cek console.', 'success');
            } catch (error) {
                console.error('Code error:', error);
                Toast.show(`Error: ${error.message}`, 'error');
            }
        }
    }

    /**
     * Download code as file
     */
    downloadCode(code, language, filename = null) {
        const ext = Utils.getFileExtension(language);
        const name = filename || `code-${Date.now()}.${ext}`;
        Utils.downloadFile(code, name, 'text/plain');
        Toast.show(`File ${name} berhasil diunduh!`, 'success');
    }

    /**
     * Process message and extract code blocks
     */
    processMessage(content) {
        const segments = [];
        const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
        let lastIndex = 0;
        let match;

        while ((match = codeBlockRegex.exec(content)) !== null) {
            // Add text before code block
            if (match.index > lastIndex) {
                segments.push({
                    type: 'text',
                    content: content.substring(lastIndex, match.index)
                });
            }

            // Add code block
            segments.push({
                type: 'code',
                language: match[1] || 'javascript',
                code: match[2].trim()
            });

            lastIndex = match.index + match[0].length;
        }

        // Add remaining text
        if (lastIndex < content.length) {
            segments.push({
                type: 'text',
                content: content.substring(lastIndex)
            });
        }

        return segments;
    }

    /**
     * Render processed segments to container
     */
    renderSegments(segments, container) {
        container.innerHTML = '';

        segments.forEach(segment => {
            if (segment.type === 'text') {
                const textDiv = document.createElement('div');
                textDiv.className = 'message-text';
                textDiv.innerHTML = this.formatText(segment.content);
                container.appendChild(textDiv);
            } else if (segment.type === 'code') {
                const codeBlock = this.createCodeBlock(
                    segment.code,
                    segment.language
                );
                container.appendChild(codeBlock);
            }
        });
    }

    /**
     * Format text with markdown-like syntax
     */
    formatText(text) {
        let formatted = Utils.escapeHtml(text);

        // Bold
        formatted = formatted.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
        
        // Italic
        formatted = formatted.replace(/\*(.+?)\*/g, '<em>$1</em>');
        
        // Inline code
        formatted = formatted.replace(/`([^`]+)`/g, '<code>$1</code>');
        
        // Headers
        formatted = formatted.replace(/^### (.+)$/gm, '<h3>$1</h3>');
        formatted = formatted.replace(/^## (.+)$/gm, '<h2>$1</h2>');
        formatted = formatted.replace(/^# (.+)$/gm, '<h1>$1</h1>');
        
        // Links
        formatted = formatted.replace(
            /\[(.+?)\]\((.+?)\)/g,
            '<a href="$2" target="_blank" rel="noopener">$1</a>'
        );
        
        // Lists
        formatted = formatted.replace(/^- (.+)$/gm, '<li>$1</li>');
        formatted = formatted.replace(/(<li>.+<\/li>\n?)+/g, '<ul>$&</ul>');
        
        // Line breaks
        formatted = formatted.replace(/\n/g, '<br>');

        return formatted;
    }

    /**
     * Set line numbers option
     */
    setLineNumbers(show) {
        this.lineNumbers = show;
    }

    /**
     * Set wrap lines option
     */
    setWrapLines(wrap) {
        this.wrapLines = wrap;
    }

    /**
     * Set theme
     */
    setTheme(theme) {
        this.theme = theme;
        // Would need to reload Prism CSS
    }
}

// Create global instance
const codeHighlighter = new CodeHighlighter();
