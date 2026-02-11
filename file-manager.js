/**
 * ============================================
 * CodeAI Pro - File Manager
 * Handles file uploads and attachments
 * ============================================
 */

class FileManager {
    constructor() {
        this.maxFileSize = 5 * 1024 * 1024; // 5MB
        this.allowedTypes = [
            'text/plain',
            'text/javascript',
            'text/html',
            'text/css',
            'application/json',
            'text/markdown',
            'text/x-python',
            'application/x-httpd-php',
            'text/x-java-source',
            'text/x-c++src'
        ];
        this.extensions = ['.js', '.py', '.html', '.css', '.json', '.md', '.txt', '.java', '.cpp', '.c', '.h', '.php', '.ts', '.jsx', '.tsx', '.sql'];
        
        this.currentFile = null;
        this.init();
    }

    /**
     * Initialize file manager
     */
    init() {
        this.setupFileInput();
    }

    /**
     * Setup file input
     */
    setupFileInput() {
        // Create hidden file input
        this.fileInput = document.createElement('input');
        this.fileInput.type = 'file';
        this.fileInput.accept = this.extensions.join(',');
        this.fileInput.style.display = 'none';
        this.fileInput.addEventListener('change', (e) => this.handleFileSelect(e));
        document.body.appendChild(this.fileInput);

        // Setup drag and drop
        this.setupDragAndDrop();
    }

    /**
     * Setup drag and drop
     */
    setupDragAndDrop() {
        const dropZone = document.querySelector('.input-area');
        if (!dropZone) return;

        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            dropZone.addEventListener(eventName, (e) => {
                e.preventDefault();
                e.stopPropagation();
            }, false);
        });

        ['dragenter', 'dragover'].forEach(eventName => {
            dropZone.addEventListener(eventName, () => {
                dropZone.classList.add('drag-over');
            }, false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            dropZone.addEventListener(eventName, () => {
                dropZone.classList.remove('drag-over');
            }, false);
        });

        dropZone.addEventListener('drop', (e) => {
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                this.processFile(files[0]);
            }
        }, false);
    }

    /**
     * Handle file selection
     */
    handleFileSelect(e) {
        const file = e.target.files[0];
        if (file) {
            this.processFile(file);
        }
    }

    /**
     * Process uploaded file
     */
    async processFile(file) {
        // Validate file
        if (!this.validateFile(file)) {
            return;
        }

        this.currentFile = file;

        try {
            const content = await Utils.readFileAsText(file);
            
            // Detect language
            const language = this.detectLanguageFromFile(file);
            
            // Create file attachment message
            const attachment = {
                name: file.name,
                size: file.size,
                type: file.type,
                language: language,
                content: content
            };

            // Emit file uploaded event
            Utils.emit('fileUploaded', attachment);

            Toast.success(`File "${file.name}" berhasil diupload!`);
            
            return attachment;

        } catch (error) {
            console.error('File read error:', error);
            Toast.error('Gagal membaca file!');
            return null;
        }
    }

    /**
     * Validate file
     */
    validateFile(file) {
        // Check size
        if (file.size > this.maxFileSize) {
            Toast.error(`File terlalu besar! Maksimal ${Utils.formatBytes(this.maxFileSize)}`);
            return false;
        }

        // Check type
        const extension = '.' + file.name.split('.').pop().toLowerCase();
        if (!this.extensions.includes(extension)) {
            Toast.error('Tipe file tidak didukung!');
            return false;
        }

        return true;
    }

    /**
     * Detect language from file
     */
    detectLanguageFromFile(file) {
        const extension = '.' + file.name.split('.').pop().toLowerCase();
        
        const languageMap = {
            '.js': 'javascript',
            '.py': 'python',
            '.html': 'html',
            '.htm': 'html',
            '.css': 'css',
            '.json': 'json',
            '.md': 'markdown',
            '.java': 'java',
            '.cpp': 'cpp',
            '.c': 'c',
            '.h': 'cpp',
            '.php': 'php',
            '.ts': 'typescript',
            '.jsx': 'jsx',
            '.tsx': 'tsx',
            '.sql': 'sql',
            '.txt': 'text'
        };

        return languageMap[extension] || 'text';
    }

    /**
     * Open file picker
     */
    openFilePicker() {
        this.fileInput.click();
    }

    /**
     * Get file icon
     */
    getFileIcon(filename) {
        const extension = '.' + filename.split('.').pop().toLowerCase();
        
        const iconMap = {
            '.js': 'fa-js',
            '.py': 'fa-python',
            '.html': 'fa-html5',
            '.htm': 'fa-html5',
            '.css': 'fa-css3',
            '.json': 'fa-file-code',
            '.md': 'fa-file-alt',
            '.java': 'fa-java',
            '.cpp': 'fa-file-code',
            '.c': 'fa-file-code',
            '.php': 'fa-php',
            '.ts': 'fa-file-code',
            '.jsx': 'fa-react',
            '.tsx': 'fa-react',
            '.sql': 'fa-database',
            '.txt': 'fa-file-alt'
        };

        return iconMap[extension] || 'fa-file';
    }

    /**
     * Create file preview element
     */
    createFilePreview(attachment) {
        const div = document.createElement('div');
        div.className = 'file-attachment';
        
        const icon = this.getFileIcon(attachment.name);
        const size = Utils.formatBytes(attachment.size);
        
        div.innerHTML = `
            <div class="file-icon">
                <i class="fab ${icon}"></i>
            </div>
            <div class="file-info">
                <span class="file-name">${Utils.escapeHtml(attachment.name)}</span>
                <span class="file-size">${size} • ${attachment.language}</span>
            </div>
            <button class="file-remove" title="Hapus file">
                <i class="fas fa-times"></i>
            </button>
        `;

        // Remove button
        div.querySelector('.file-remove').addEventListener('click', () => {
            this.currentFile = null;
            div.remove();
            Utils.emit('fileRemoved', attachment);
        });

        return div;
    }

    /**
     * Read file content
     */
    async readFile(file) {
        return await Utils.readFileAsText(file);
    }

    /**
     * Get current file
     */
    getCurrentFile() {
        return this.currentFile;
    }

    /**
     * Clear current file
     */
    clearFile() {
        this.currentFile = null;
        this.fileInput.value = '';
    }

    /**
     * Check if file is attached
     */
    hasFile() {
        return this.currentFile !== null;
    }

    /**
     * Get file content as message
     */
    async getFileContentMessage() {
        if (!this.currentFile) return null;

        const content = await this.readFile(this.currentFile);
        const language = this.detectLanguageFromFile(this.currentFile);

        return `File: ${this.currentFile.name}\n\`\`\`${language}\n${content}\n\`\`\``;
    }
}

// Create global instance
const fileManager = new FileManager();
