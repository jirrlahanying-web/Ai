/**
 * ============================================
 * CodeAI Pro - Storage Manager
 * Handles localStorage operations for chat history
 * ============================================
 */

class StorageManager {
    constructor() {
        this.prefix = 'codeai_pro_';
        this.keys = {
            chats: this.prefix + 'chats',
            currentChat: this.prefix + 'currentChat',
            settings: this.prefix + 'settings',
            theme: this.prefix + 'theme',
            user: this.prefix + 'user',
            stats: this.prefix + 'stats'
        };
        
        // Initialize default data
        this.initDefaults();
    }

    /**
     * Initialize default data
     */
    initDefaults() {
        if (!this.getChats()) {
            this.setChats([]);
        }
        if (!this.getSettings()) {
            this.setSettings(this.getDefaultSettings());
        }
        if (!this.getTheme()) {
            this.setTheme('dark');
        }
        if (!this.getStats()) {
            this.setStats(this.getDefaultStats());
        }
    }

    /**
     * Get default settings
     * @returns {object} Default settings
     */
    getDefaultSettings() {
        return {
            theme: 'dark',
            fontSize: 14,
            typingAnimation: true,
            temperature: 0.7,
            maxTokens: 2048,
            saveHistory: true,
            codeLineNumbers: true,
            autoScroll: true,
            soundEnabled: false,
            language: 'id',
            sidebarCollapsed: false,
            enterToSend: true,
            codeWrap: false
        };
    }

    /**
     * Get default stats
     * @returns {object} Default stats
     */
    getDefaultStats() {
        return {
            totalChats: 0,
            totalMessages: 0,
            totalCodeBlocks: 0,
            totalTokens: 0,
            firstUsed: new Date().toISOString(),
            lastUsed: new Date().toISOString()
        };
    }

    // ==================== CHATS ====================

    /**
     * Get all chats
     * @returns {Array} Array of chat objects
     */
    getChats() {
        return Utils.storage.get(this.keys.chats, []);
    }

    /**
     * Save all chats
     * @param {Array} chats - Array of chat objects
     */
    setChats(chats) {
        Utils.storage.set(this.keys.chats, chats);
    }

    /**
     * Get a single chat by ID
     * @param {string} chatId - Chat ID
     * @returns {object|null} Chat object
     */
    getChat(chatId) {
        const chats = this.getChats();
        return chats.find(chat => chat.id === chatId) || null;
    }

    /**
     * Create a new chat
     * @param {string} title - Chat title
     * @returns {object} New chat object
     */
    createChat(title = 'Chat Baru') {
        const chat = {
            id: Utils.generateId(),
            title: title,
            messages: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            messageCount: 0,
            codeBlockCount: 0
        };
        
        const chats = this.getChats();
        chats.unshift(chat);
        this.setChats(chats);
        
        // Update stats
        this.updateStats({ totalChats: chats.length });
        
        return chat;
    }

    /**
     * Update a chat
     * @param {string} chatId - Chat ID
     * @param {object} updates - Updates to apply
     * @returns {object|null} Updated chat
     */
    updateChat(chatId, updates) {
        const chats = this.getChats();
        const index = chats.findIndex(chat => chat.id === chatId);
        
        if (index === -1) return null;
        
        chats[index] = {
            ...chats[index],
            ...updates,
            updatedAt: new Date().toISOString()
        };
        
        this.setChats(chats);
        return chats[index];
    }

    /**
     * Delete a chat
     * @param {string} chatId - Chat ID
     * @returns {boolean} Success status
     */
    deleteChat(chatId) {
        const chats = this.getChats();
        const filtered = chats.filter(chat => chat.id !== chatId);
        
        if (filtered.length === chats.length) return false;
        
        this.setChats(filtered);
        
        // If current chat was deleted, clear it
        if (this.getCurrentChatId() === chatId) {
            this.clearCurrentChat();
        }
        
        // Update stats
        this.updateStats({ totalChats: filtered.length });
        
        return true;
    }

    /**
     * Rename a chat
     * @param {string} chatId - Chat ID
     * @param {string} newTitle - New title
     * @returns {boolean} Success status
     */
    renameChat(chatId, newTitle) {
        const chat = this.updateChat(chatId, { title: newTitle });
        return !!chat;
    }

    /**
     * Add message to chat
     * @param {string} chatId - Chat ID
     * @param {object} message - Message object
     * @returns {object|null} Updated chat
     */
    addMessage(chatId, message) {
        const chat = this.getChat(chatId);
        if (!chat) return null;
        
        const newMessage = {
            id: Utils.generateId(),
            role: message.role,
            content: message.content,
            timestamp: new Date().toISOString(),
            codeBlocks: message.codeBlocks || [],
            tokens: message.tokens || 0
        };
        
        chat.messages.push(newMessage);
        chat.messageCount = chat.messages.length;
        chat.codeBlockCount = chat.messages.reduce((acc, m) => acc + (m.codeBlocks?.length || 0), 0);
        
        // Update title if first message
        if (chat.messages.length === 1 && message.role === 'user') {
            chat.title = Utils.truncate(message.content, 30);
        }
        
        const updated = this.updateChat(chatId, chat);
        
        // Update stats
        this.updateStats({ 
            totalMessages: this.getTotalMessages(),
            totalCodeBlocks: this.getTotalCodeBlocks()
        });
        
        return updated;
    }

    /**
     * Delete a message from chat
     * @param {string} chatId - Chat ID
     * @param {string} messageId - Message ID
     * @returns {boolean} Success status
     */
    deleteMessage(chatId, messageId) {
        const chat = this.getChat(chatId);
        if (!chat) return false;
        
        chat.messages = chat.messages.filter(m => m.id !== messageId);
        chat.messageCount = chat.messages.length;
        
        this.updateChat(chatId, chat);
        return true;
    }

    /**
     * Clear all messages from a chat
     * @param {string} chatId - Chat ID
     * @returns {boolean} Success status
     */
    clearChatMessages(chatId) {
        const chat = this.getChat(chatId);
        if (!chat) return false;
        
        chat.messages = [];
        chat.messageCount = 0;
        chat.codeBlockCount = 0;
        
        this.updateChat(chatId, chat);
        return true;
    }

    /**
     * Get total message count across all chats
     * @returns {number} Total messages
     */
    getTotalMessages() {
        const chats = this.getChats();
        return chats.reduce((acc, chat) => acc + (chat.messages?.length || 0), 0);
    }

    /**
     * Get total code block count across all chats
     * @returns {number} Total code blocks
     */
    getTotalCodeBlocks() {
        const chats = this.getChats();
        return chats.reduce((acc, chat) => acc + (chat.codeBlockCount || 0), 0);
    }

    // ==================== CURRENT CHAT ====================

    /**
     * Get current chat ID
     * @returns {string|null} Current chat ID
     */
    getCurrentChatId() {
        return Utils.storage.get(this.keys.currentChat, null);
    }

    /**
     * Set current chat ID
     * @param {string} chatId - Chat ID
     */
    setCurrentChatId(chatId) {
        Utils.storage.set(this.keys.currentChat, chatId);
    }

    /**
     * Clear current chat
     */
    clearCurrentChat() {
        Utils.storage.remove(this.keys.currentChat);
    }

    // ==================== SETTINGS ====================

    /**
     * Get all settings
     * @returns {object} Settings object
     */
    getSettings() {
        return Utils.storage.get(this.keys.settings, this.getDefaultSettings());
    }

    /**
     * Save all settings
     * @param {object} settings - Settings object
     */
    setSettings(settings) {
        Utils.storage.set(this.keys.settings, settings);
    }

    /**
     * Get a specific setting
     * @param {string} key - Setting key
     * @param {*} defaultValue - Default value
     * @returns {*} Setting value
     */
    getSetting(key, defaultValue = null) {
        const settings = this.getSettings();
        return settings[key] !== undefined ? settings[key] : defaultValue;
    }

    /**
     * Update a specific setting
     * @param {string} key - Setting key
     * @param {*} value - Setting value
     */
    setSetting(key, value) {
        const settings = this.getSettings();
        settings[key] = value;
        this.setSettings(settings);
    }

    /**
     * Reset settings to defaults
     */
    resetSettings() {
        this.setSettings(this.getDefaultSettings());
    }

    // ==================== THEME ====================

    /**
     * Get current theme
     * @returns {string} Theme name
     */
    getTheme() {
        return Utils.storage.get(this.keys.theme, 'dark');
    }

    /**
     * Set theme
     * @param {string} theme - Theme name
     */
    setTheme(theme) {
        Utils.storage.set(this.keys.theme, theme);
        document.documentElement.setAttribute('data-theme', theme);
    }

    // ==================== STATS ====================

    /**
     * Get stats
     * @returns {object} Stats object
     */
    getStats() {
        return Utils.storage.get(this.keys.stats, this.getDefaultStats());
    }

    /**
     * Save stats
     * @param {object} stats - Stats object
     */
    setStats(stats) {
        Utils.storage.set(this.keys.stats, stats);
    }

    /**
     * Update stats
     * @param {object} updates - Stats updates
     */
    updateStats(updates) {
        const stats = this.getStats();
        stats.lastUsed = new Date().toISOString();
        this.setStats({ ...stats, ...updates });
    }

    /**
     * Increment stat counter
     * @param {string} key - Stat key
     * @param {number} amount - Amount to increment
     */
    incrementStat(key, amount = 1) {
        const stats = this.getStats();
        stats[key] = (stats[key] || 0) + amount;
        stats.lastUsed = new Date().toISOString();
        this.setStats(stats);
    }

    // ==================== USER ====================

    /**
     * Get user data
     * @returns {object|null} User data
     */
    getUser() {
        return Utils.storage.get(this.keys.user, null);
    }

    /**
     * Set user data
     * @param {object} user - User data
     */
    setUser(user) {
        Utils.storage.set(this.keys.user, user);
    }

    // ==================== EXPORT/IMPORT ====================

    /**
     * Export all data
     * @returns {object} All data
     */
    exportData() {
        return {
            version: '2.0',
            exportedAt: new Date().toISOString(),
            chats: this.getChats(),
            settings: this.getSettings(),
            stats: this.getStats(),
            user: this.getUser()
        };
    }

    /**
     * Import data
     * @param {object} data - Data to import
     * @returns {boolean} Success status
     */
    importData(data) {
        try {
            if (data.chats) this.setChats(data.chats);
            if (data.settings) this.setSettings(data.settings);
            if (data.stats) this.setStats(data.stats);
            if (data.user) this.setUser(data.user);
            return true;
        } catch (e) {
            console.error('Import error:', e);
            return false;
        }
    }

    /**
     * Export chat as JSON
     * @param {string} chatId - Chat ID
     * @returns {string|null} JSON string
     */
    exportChatAsJSON(chatId) {
        const chat = this.getChat(chatId);
        if (!chat) return null;
        
        return JSON.stringify(chat, null, 2);
    }

    /**
     * Export chat as Markdown
     * @param {string} chatId - Chat ID
     * @returns {string|null} Markdown string
     */
    exportChatAsMarkdown(chatId) {
        const chat = this.getChat(chatId);
        if (!chat) return null;
        
        let md = `# ${chat.title}\n\n`;
        md += `> Exported on ${new Date().toLocaleString('id-ID')}\n\n`;
        md += `---\n\n`;
        
        chat.messages.forEach(msg => {
            const role = msg.role === 'user' ? '**User**' : '**CodeAI Pro**';
            const time = new Date(msg.timestamp).toLocaleString('id-ID');
            md += `${role} *(${time})*\n\n`;
            md += `${msg.content}\n\n`;
            md += `---\n\n`;
        });
        
        return md;
    }

    /**
     * Export chat as HTML
     * @param {string} chatId - Chat ID
     * @returns {string|null} HTML string
     */
    exportChatAsHTML(chatId) {
        const chat = this.getChat(chatId);
        if (!chat) return null;
        
        let html = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>${chat.title} - CodeAI Pro Export</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
        .message { margin-bottom: 20px; padding: 15px; border-radius: 8px; }
        .user { background: #e3f2fd; }
        .ai { background: #f3e5f5; }
        .header { font-weight: bold; margin-bottom: 10px; }
        .time { color: #666; font-size: 0.9em; }
        pre { background: #f5f5f5; padding: 10px; border-radius: 4px; overflow-x: auto; }
        code { background: #f5f5f5; padding: 2px 4px; border-radius: 3px; }
    </style>
</head>
<body>
    <h1>${chat.title}</h1>
    <p>Exported on ${new Date().toLocaleString('id-ID')}</p>
    <hr>`;
        
        chat.messages.forEach(msg => {
            const roleClass = msg.role;
            const roleName = msg.role === 'user' ? 'User' : 'CodeAI Pro';
            const time = new Date(msg.timestamp).toLocaleString('id-ID');
            
            html += `
    <div class="message ${roleClass}">
        <div class="header">${roleName} <span class="time">(${time})</span></div>
        <div class="content">${msg.content.replace(/\n/g, '<br>')}</div>
    </div>`;
        });
        
        html += `
</body>
</html>`;
        
        return html;
    }

    // ==================== CLEANUP ====================

    /**
     * Clear all data
     */
    clearAll() {
        Object.values(this.keys).forEach(key => {
            Utils.storage.remove(key);
        });
        this.initDefaults();
    }

    /**
     * Get storage size
     * @returns {string} Formatted size
     */
    getStorageSize() {
        let total = 0;
        for (let key in localStorage) {
            if (localStorage.hasOwnProperty(key) && key.startsWith(this.prefix)) {
                total += localStorage[key].length * 2; // UTF-16 = 2 bytes per char
            }
        }
        return Utils.formatBytes(total);
    }

    /**
     * Check if storage is available
     * @returns {boolean} Storage availability
     */
    isAvailable() {
        try {
            const test = '__storage_test__';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (e) {
            return false;
        }
    }
}

// Create global instance
const storageManager = new StorageManager();
