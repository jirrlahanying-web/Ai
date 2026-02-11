/**
 * ============================================
 * CodeAI Pro - Theme Manager
 * Handles theme switching and customization
 * ============================================
 */

class ThemeManager {
    constructor() {
        this.currentTheme = 'dark';
        this.themes = ['dark', 'light', 'blue', 'green', 'pink', 'orange', 'cyan', 'red'];
        this.init();
    }

    /**
     * Initialize theme manager
     */
    init() {
        // Load saved theme
        const savedTheme = storageManager.getTheme();
        if (savedTheme && this.themes.includes(savedTheme)) {
            this.setTheme(savedTheme, false);
        } else {
            this.setTheme('dark', false);
        }

        // Listen for system theme changes
        if (window.matchMedia) {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: light)');
            mediaQuery.addEventListener('change', (e) => {
                if (storageManager.getSetting('autoTheme', false)) {
                    this.setTheme(e.matches ? 'light' : 'dark');
                }
            });
        }
    }

    /**
     * Set theme
     * @param {string} theme - Theme name
     * @param {boolean} save - Save to storage
     */
    setTheme(theme, save = true) {
        if (!this.themes.includes(theme)) {
            console.warn(`Theme "${theme}" not found, using default`);
            theme = 'dark';
        }

        this.currentTheme = theme;
        document.documentElement.setAttribute('data-theme', theme);
        
        if (save) {
            storageManager.setTheme(theme);
            storageManager.setSetting('theme', theme);
        }

        // Update meta theme-color
        this.updateMetaThemeColor(theme);

        // Dispatch event
        Utils.emit('themeChanged', { theme });
    }

    /**
     * Get current theme
     * @returns {string} Current theme
     */
    getTheme() {
        return this.currentTheme;
    }

    /**
     * Toggle between dark and light
     */
    toggle() {
        const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.setTheme(newTheme);
    }

    /**
     * Cycle through themes
     */
    cycle() {
        const currentIndex = this.themes.indexOf(this.currentTheme);
        const nextIndex = (currentIndex + 1) % this.themes.length;
        this.setTheme(this.themes[nextIndex]);
    }

    /**
     * Update meta theme color
     * @param {string} theme - Theme name
     */
    updateMetaThemeColor(theme) {
        const themeColors = {
            dark: '#7c3aed',
            light: '#a855f7',
            blue: '#3b82f6',
            green: '#22c55e',
            pink: '#d946ef',
            orange: '#f97316',
            cyan: '#06b6d4',
            red: '#ef4444'
        };

        let metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (!metaThemeColor) {
            metaThemeColor = document.createElement('meta');
            metaThemeColor.setAttribute('name', 'theme-color');
            document.head.appendChild(metaThemeColor);
        }
        metaThemeColor.setAttribute('content', themeColors[theme] || themeColors.dark);
    }

    /**
     * Get theme colors
     * @param {string} theme - Theme name
     * @returns {object} Theme colors
     */
    getThemeColors(theme = this.currentTheme) {
        const colors = {
            dark: {
                primary: '#7c3aed',
                secondary: '#a855f7',
                accent: '#ec4899',
                background: '#0f0a1a',
                surface: '#1a1025',
                text: '#ffffff'
            },
            light: {
                primary: '#7c3aed',
                secondary: '#a855f7',
                accent: '#ec4899',
                background: '#f8fafc',
                surface: '#ffffff',
                text: '#0f172a'
            },
            blue: {
                primary: '#1d4ed8',
                secondary: '#3b82f6',
                accent: '#06b6d4',
                background: '#0f172a',
                surface: '#1e293b',
                text: '#ffffff'
            },
            green: {
                primary: '#15803d',
                secondary: '#22c55e',
                accent: '#14b8a6',
                background: '#0a1f0a',
                surface: '#0f2a0f',
                text: '#ffffff'
            },
            pink: {
                primary: '#a21caf',
                secondary: '#d946ef',
                accent: '#f472b6',
                background: '#1a0a1a',
                surface: '#251025',
                text: '#ffffff'
            },
            orange: {
                primary: '#c2410c',
                secondary: '#f97316',
                accent: '#fbbf24',
                background: '#1a0f0a',
                surface: '#251a10',
                text: '#ffffff'
            },
            cyan: {
                primary: '#0e7490',
                secondary: '#06b6d4',
                accent: '#3b82f6',
                background: '#0a1a1f',
                surface: '#0f252a',
                text: '#ffffff'
            },
            red: {
                primary: '#b91c1c',
                secondary: '#ef4444',
                accent: '#f97316',
                background: '#1a0a0a',
                surface: '#251010',
                text: '#ffffff'
            }
        };

        return colors[theme] || colors.dark;
    }

    /**
     * Apply custom CSS variables
     * @param {object} vars - CSS variables
     */
    applyCustomVars(vars) {
        const root = document.documentElement;
        Object.entries(vars).forEach(([key, value]) => {
            root.style.setProperty(key, value);
        });
    }

    /**
     * Reset custom CSS variables
     */
    resetCustomVars() {
        const root = document.documentElement;
        const vars = [
            '--primary-500', '--primary-600', '--primary-700',
            '--bg-primary', '--bg-secondary', '--text-primary'
        ];
        vars.forEach(v => root.style.removeProperty(v));
    }

    /**
     * Get available themes
     * @returns {Array} Theme list
     */
    getAvailableThemes() {
        return this.themes.map(theme => ({
            id: theme,
            name: this.getThemeDisplayName(theme),
            colors: this.getThemeColors(theme)
        }));
    }

    /**
     * Get theme display name
     * @param {string} theme - Theme ID
     * @returns {string} Display name
     */
    getThemeDisplayName(theme) {
        const names = {
            dark: 'Dark (Ungu)',
            light: 'Light',
            blue: 'Blue Gradient',
            green: 'Green Gradient',
            pink: 'Pink Gradient',
            orange: 'Orange Gradient',
            cyan: 'Cyan Gradient',
            red: 'Red Gradient'
        };
        return names[theme] || theme;
    }

    /**
     * Check if theme is dark
     * @param {string} theme - Theme name
     * @returns {boolean} Is dark theme
     */
    isDarkTheme(theme = this.currentTheme) {
        return theme !== 'light';
    }

    /**
     * Get CSS for theme preview
     * @param {string} theme - Theme name
     * @returns {string} CSS string
     */
    getPreviewCSS(theme) {
        const colors = this.getThemeColors(theme);
        return `
            background: linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%);
        `;
    }
}

// Create global instance
const themeManager = new ThemeManager();
