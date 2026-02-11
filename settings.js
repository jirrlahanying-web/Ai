/**
 * ============================================
 * CodeAI Pro - Settings Manager
 * Handles application settings and configuration
 * ============================================
 */

class SettingsManager {
    constructor() {
        this.modal = new Modal('settings-modal');
        this.elements = {};
        this.init();
    }

    /**
     * Initialize settings manager
     */
    init() {
        this.cacheElements();
        this.setupEventListeners();
        this.loadSettings();
    }

    /**
     * Cache DOM elements
     */
    cacheElements() {
        this.elements = {
            themeSelect: document.getElementById('theme-select'),
            fontSizeSlider: document.getElementById('font-size-slider'),
            fontSizeValue: document.getElementById('font-size-value'),
            typingAnimation: document.getElementById('typing-animation'),
            temperatureSlider: document.getElementById('temperature-slider'),
            temperatureValue: document.getElementById('temperature-value'),
            maxTokens: document.getElementById('max-tokens'),
            saveHistory: document.getElementById('save-history'),
            clearAllData: document.getElementById('clear-all-data')
        };
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Theme
        this.elements.themeSelect.addEventListener('change', (e) => {
            themeManager.setTheme(e.target.value);
            storageManager.setSetting('theme', e.target.value);
        });

        // Font size
        this.elements.fontSizeSlider.addEventListener('input', (e) => {
            const size = e.target.value;
            this.elements.fontSizeValue.textContent = size + 'px';
            this.setFontSize(size);
        });

        // Typing animation
        this.elements.typingAnimation.addEventListener('change', (e) => {
            storageManager.setSetting('typingAnimation', e.target.checked);
        });

        // Temperature
        this.elements.temperatureSlider.addEventListener('input', (e) => {
            const temp = (e.target.value / 100).toFixed(2);
            this.elements.temperatureValue.textContent = temp;
            storageManager.setSetting('temperature', parseFloat(temp));
        });

        // Max tokens
        this.elements.maxTokens.addEventListener('change', (e) => {
            storageManager.setSetting('maxTokens', parseInt(e.target.value));
        });

        // Save history
        this.elements.saveHistory.addEventListener('change', (e) => {
            storageManager.setSetting('saveHistory', e.target.checked);
        });

        // Clear all data
        this.elements.clearAllData.addEventListener('click', () => {
            this.clearAllData();
        });
    }

    /**
     * Load settings from storage
     */
    loadSettings() {
        const settings = storageManager.getSettings();

        // Theme
        this.elements.themeSelect.value = settings.theme || 'dark';
        themeManager.setTheme(settings.theme || 'dark', false);

        // Font size
        const fontSize = settings.fontSize || 14;
        this.elements.fontSizeSlider.value = fontSize;
        this.elements.fontSizeValue.textContent = fontSize + 'px';
        this.setFontSize(fontSize, false);

        // Typing animation
        this.elements.typingAnimation.checked = settings.typingAnimation !== false;

        // Temperature
        const temp = settings.temperature || 0.7;
        this.elements.temperatureSlider.value = Math.round(temp * 100);
        this.elements.temperatureValue.textContent = temp;

        // Max tokens
        this.elements.maxTokens.value = settings.maxTokens || 2048;

        // Save history
        this.elements.saveHistory.checked = settings.saveHistory !== false;
    }

    /**
     * Set font size
     */
    setFontSize(size, save = true) {
        document.documentElement.style.setProperty('--code-font-size', size + 'px');
        
        const codeBlocks = document.querySelectorAll('pre code');
        codeBlocks.forEach(block => {
            block.style.fontSize = size + 'px';
        });

        if (save) {
            storageManager.setSetting('fontSize', parseInt(size));
        }
    }

    /**
     * Clear all data
     */
    clearAllData() {
        ConfirmDialog.confirm(
            'PERINGATAN: Semua data akan dihapus permanen! Chat history, pengaturan, dan statistik akan hilang. Apakah Anda yakin?',
            () => {
                storageManager.clearAll();
                this.loadSettings();
                
                // Reset chat manager
                if (chatManager) {
                    chatManager.createNewChat();
                }
                
                this.modal.hide();
                Toast.success('Semua data berhasil dihapus!');
            },
            () => {
                Toast.info('Penghapusan dibatalkan');
            }
        );
    }

    /**
     * Open settings modal
     */
    open() {
        this.loadSettings();
        this.modal.show();
    }

    /**
     * Close settings modal
     */
    close() {
        this.modal.hide();
    }

    /**
     * Toggle settings modal
     */
    toggle() {
        this.modal.toggle();
    }

    /**
     * Reset to defaults
     */
    resetToDefaults() {
        storageManager.resetSettings();
        this.loadSettings();
        Toast.success('Pengaturan direset ke default!');
    }

    /**
     * Export settings
     */
    exportSettings() {
        const settings = storageManager.getSettings();
        const data = JSON.stringify(settings, null, 2);
        Utils.downloadFile(data, 'codeai-settings.json', 'application/json');
        Toast.success('Pengaturan berhasil diekspor!');
    }

    /**
     * Import settings
     */
    importSettings(file) {
        Utils.readFileAsText(file).then(content => {
            try {
                const settings = JSON.parse(content);
                storageManager.setSettings(settings);
                this.loadSettings();
                Toast.success('Pengaturan berhasil diimpor!');
            } catch (e) {
                Toast.error('File pengaturan tidak valid!');
            }
        }).catch(() => {
            Toast.error('Gagal membaca file!');
        });
    }
}

// Create global instance
let settingsManager;
