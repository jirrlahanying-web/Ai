/**
 * ============================================
 * CodeAI Pro - Chat Manager
 * Manages chat functionality and messaging
 * ============================================
 */

class ChatManager {
    constructor() {
        this.currentChatId = null;
        this.isProcessing = false;
        this.typingAnimation = null;
        this.thinkingAnimation = null;
        
        // DOM Elements
        this.elements = {
            chatContainer: document.getElementById('chat-container'),
            chatMessages: document.getElementById('chat-messages'),
            welcomeScreen: document.getElementById('welcome-screen'),
            messageInput: document.getElementById('message-input'),
            sendBtn: document.getElementById('send-btn'),
            newChatBtn: document.getElementById('new-chat-btn'),
            chatHistory: document.getElementById('chat-history'),
            currentChatTitle: document.getElementById('current-chat-title'),
            clearBtn: document.getElementById('clear-btn'),
            exportBtn: document.getElementById('export-btn')
        };

        this.init();
    }

    /**
     * Initialize chat manager
     */
    init() {
        // Load current chat or create new
        this.loadCurrentChat();
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Render chat history
        this.renderChatHistory();
        
        // Setup textarea auto-resize
        this.setupTextarea();
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Send message
        this.elements.sendBtn.addEventListener('click', () => this.sendMessage());
        
        this.elements.messageInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        // New chat
        this.elements.newChatBtn.addEventListener('click', () => this.createNewChat());

        // Clear chat
        this.elements.clearBtn.addEventListener('click', () => this.clearCurrentChat());

        // Export chat
        this.elements.exportBtn.addEventListener('click', () => this.exportCurrentChat());

        // Suggestion chips
        document.querySelectorAll('.suggestion-chip, .action-btn').forEach(chip => {
            chip.addEventListener('click', () => {
                const prompt = chip.dataset.prompt;
                if (prompt) {
                    this.elements.messageInput.value = prompt;
                    this.sendMessage();
                }
            });
        });

        // Listen for storage changes
        Utils.on(window, 'storage', (e) => {
            if (e.key === storageManager.keys.chats) {
                this.renderChatHistory();
            }
        });
    }

    /**
     * Setup textarea auto-resize
     */
    setupTextarea() {
        const textarea = this.elements.messageInput;
        
        textarea.addEventListener('input', () => {
            textarea.style.height = 'auto';
            textarea.style.height = Math.min(textarea.scrollHeight, 200) + 'px';
        });

        textarea.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });
    }

    /**
     * Load current chat
     */
    loadCurrentChat() {
        const savedChatId = storageManager.getCurrentChatId();
        
        if (savedChatId) {
            const chat = storageManager.getChat(savedChatId);
            if (chat) {
                this.currentChatId = savedChatId;
                this.showChat();
                this.renderMessages(chat.messages);
                this.updateChatTitle(chat.title);
            } else {
                this.createNewChat();
            }
        } else {
            this.showWelcome();
        }
    }

    /**
     * Create new chat
     */
    createNewChat() {
        const chat = storageManager.createChat();
        this.currentChatId = chat.id;
        storageManager.setCurrentChatId(chat.id);
        
        this.showWelcome();
        this.updateChatTitle('Chat Baru');
        this.renderChatHistory();
        
        Toast.success('Chat baru dibuat!');
    }

    /**
     * Send message
     */
    async sendMessage() {
        const message = this.elements.messageInput.value.trim();
        
        if (!message || this.isProcessing) return;

        // Create chat if not exists
        if (!this.currentChatId) {
            this.createNewChat();
        }

        // Clear input
        this.elements.messageInput.value = '';
        this.elements.messageInput.style.height = 'auto';

        // Add user message
        this.addMessageToUI('user', message);
        
        // Save user message
        storageManager.addMessage(this.currentChatId, {
            role: 'user',
            content: message
        });

        // Show chat
        this.showChat();

        // Process AI response
        await this.processAIResponse(message);
    }

    /**
     * Process AI response
     */
    async processAIResponse(userMessage) {
        if (this.isProcessing) return;
        
        this.isProcessing = true;
        this.elements.sendBtn.disabled = true;

        try {
            // Show thinking animation
            this.showThinking();

            // Get chat history for context
            const chat = storageManager.getChat(this.currentChatId);
            const history = chat ? chat.messages.slice(-10) : [];

            // Call API
            const response = await apiServer.sendMessage(userMessage, history);

            // Hide thinking
            this.hideThinking();

            // Add AI message with typing animation
            await this.addAIMessage(response.content, response.codeBlocks);

            // Save AI message
            storageManager.addMessage(this.currentChatId, response);

            // Update chat history UI
            this.renderChatHistory();

        } catch (error) {
            console.error('AI Response Error:', error);
            this.hideThinking();
            
            const errorMessage = 'Maaf, terjadi kesalahan. Silakan coba lagi.';
            this.addMessageToUI('ai', errorMessage);
            
            Toast.error('Gagal mendapatkan respons dari AI');
        } finally {
            this.isProcessing = false;
            this.elements.sendBtn.disabled = false;
            this.elements.messageInput.focus();
        }
    }

    /**
     * Add AI message with typing animation
     */
    async addAIMessage(content, codeBlocks = []) {
        const messageId = Utils.generateId();
        
        // Create message element
        const messageEl = this.createMessageElement('ai', '', messageId);
        this.elements.chatMessages.appendChild(messageEl);

        const contentEl = messageEl.querySelector('.message-body');

        // Check if typing animation is enabled
        const typingEnabled = storageManager.getSetting('typingAnimation', true);

        if (typingEnabled) {
            // Use typing animation
            const typing = new TypingAnimation({
                speed: 15,
                onType: () => {
                    this.scrollToBottom();
                },
                onCodeBlock: (segment) => {
                    // Render code block immediately
                    const codeBlock = codeHighlighter.createCodeBlock(
                        segment.code,
                        segment.language
                    );
                    contentEl.appendChild(codeBlock);
                }
            });

            await typing.type(content, contentEl);
        } else {
            // Show instantly
            const segments = codeHighlighter.processMessage(content);
            codeHighlighter.renderSegments(segments, contentEl);
        }

        this.scrollToBottom();
    }

    /**
     * Add message to UI
     */
    addMessageToUI(role, content, messageId = null) {
        const id = messageId || Utils.generateId();
        const messageEl = this.createMessageElement(role, content, id);
        
        this.elements.chatMessages.appendChild(messageEl);
        this.scrollToBottom();
        
        return messageEl;
    }

    /**
     * Create message element
     */
    createMessageElement(role, content, id) {
        const div = document.createElement('div');
        div.className = `message ${role} message-fade-in`;
        div.dataset.messageId = id;

        const isUser = role === 'user';
        const avatar = isUser ? 'fa-user' : 'fa-robot';
        const author = isUser ? 'Anda' : 'CodeAI Pro';
        const time = Utils.formatTime(new Date());

        let contentHtml = '';
        if (content) {
            const segments = codeHighlighter.processMessage(content);
            const tempDiv = document.createElement('div');
            codeHighlighter.renderSegments(segments, tempDiv);
            contentHtml = tempDiv.innerHTML;
        }

        div.innerHTML = `
            <div class="message-avatar">
                <i class="fas ${avatar}"></i>
            </div>
            <div class="message-content">
                <div class="message-header">
                    <span class="message-author">${author}</span>
                    <span class="message-time">${time}</span>
                </div>
                <div class="message-body">${contentHtml}</div>
            </div>
        `;

        return div;
    }

    /**
     * Show thinking animation
     */
    showThinking() {
        const thinkingEl = document.createElement('div');
        thinkingEl.id = 'thinking-message';
        thinkingEl.className = 'message ai';
        thinkingEl.innerHTML = `
            <div class="message-avatar">
                <i class="fas fa-robot"></i>
            </div>
            <div class="message-content">
                <div class="message-header">
                    <span class="message-author">CodeAI Pro</span>
                </div>
                <div class="message-body">
                    <div class="thinking-indicator">
                        <div class="thinking-content">
                            <div class="thinking-text">
                                Sedang berpikir
                                <div class="thinking-dots">
                                    <span class="thinking-dot"></span>
                                    <span class="thinking-dot"></span>
                                    <span class="thinking-dot"></span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.elements.chatMessages.appendChild(thinkingEl);
        this.scrollToBottom();
    }

    /**
     * Hide thinking animation
     */
    hideThinking() {
        const thinkingEl = document.getElementById('thinking-message');
        if (thinkingEl) {
            thinkingEl.remove();
        }
    }

    /**
     * Render messages
     */
    renderMessages(messages) {
        this.elements.chatMessages.innerHTML = '';
        
        messages.forEach(msg => {
            this.addMessageToUI(msg.role, msg.content, msg.id);
        });

        this.scrollToBottom();
    }

    /**
     * Render chat history sidebar
     */
    renderChatHistory() {
        const chats = storageManager.getChats();
        const container = this.elements.chatHistory;
        
        container.innerHTML = '';

        chats.forEach(chat => {
            const item = document.createElement('div');
            item.className = `history-item ${chat.id === this.currentChatId ? 'active' : ''}`;
            item.dataset.chatId = chat.id;
            
            const time = Utils.formatDate(new Date(chat.updatedAt));
            
            item.innerHTML = `
                <i class="fas fa-comment"></i>
                <span>${Utils.escapeHtml(chat.title)}</span>
                <div class="history-actions">
                    <button class="rename-btn" title="Ganti nama">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="delete-btn" title="Hapus">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;

            // Click to load chat
            item.addEventListener('click', (e) => {
                if (!e.target.closest('.history-actions')) {
                    this.loadChat(chat.id);
                }
            });

            // Rename
            item.querySelector('.rename-btn').addEventListener('click', (e) => {
                e.stopPropagation();
                this.renameChat(chat.id);
            });

            // Delete
            item.querySelector('.delete-btn').addEventListener('click', (e) => {
                e.stopPropagation();
                this.deleteChat(chat.id);
            });

            container.appendChild(item);
        });
    }

    /**
     * Load specific chat
     */
    loadChat(chatId) {
        const chat = storageManager.getChat(chatId);
        if (!chat) return;

        this.currentChatId = chatId;
        storageManager.setCurrentChatId(chatId);

        this.showChat();
        this.renderMessages(chat.messages);
        this.updateChatTitle(chat.title);
        this.renderChatHistory();
    }

    /**
     * Rename chat
     */
    renameChat(chatId) {
        const chat = storageManager.getChat(chatId);
        if (!chat) return;

        const newTitle = prompt('Nama chat baru:', chat.title);
        if (newTitle && newTitle.trim()) {
            storageManager.renameChat(chatId, newTitle.trim());
            this.renderChatHistory();
            
            if (chatId === this.currentChatId) {
                this.updateChatTitle(newTitle.trim());
            }
            
            Toast.success('Chat berhasil diganti nama!');
        }
    }

    /**
     * Delete chat
     */
    deleteChat(chatId) {
        ConfirmDialog.confirm(
            'Apakah Anda yakin ingin menghapus chat ini?',
            () => {
                storageManager.deleteChat(chatId);
                
                if (chatId === this.currentChatId) {
                    this.currentChatId = null;
                    storageManager.clearCurrentChat();
                    this.showWelcome();
                    this.updateChatTitle('Chat Baru');
                }
                
                this.renderChatHistory();
                Toast.success('Chat berhasil dihapus!');
            }
        );
    }

    /**
     * Clear current chat messages
     */
    clearCurrentChat() {
        if (!this.currentChatId) return;

        ConfirmDialog.confirm(
            'Apakah Anda yakin ingin menghapus semua pesan di chat ini?',
            () => {
                storageManager.clearChatMessages(this.currentChatId);
                this.elements.chatMessages.innerHTML = '';
                Toast.success('Pesan berhasil dihapus!');
            }
        );
    }

    /**
     * Export current chat
     */
    exportCurrentChat() {
        if (!this.currentChatId) {
            Toast.warning('Tidak ada chat untuk diekspor');
            return;
        }

        const formats = ['JSON', 'Markdown', 'HTML'];
        const format = prompt('Pilih format (JSON/Markdown/HTML):', 'JSON');
        
        if (!format) return;

        let content, filename, type;
        const upperFormat = format.toUpperCase();

        switch (upperFormat) {
            case 'JSON':
                content = storageManager.exportChatAsJSON(this.currentChatId);
                filename = `chat-${Date.now()}.json`;
                type = 'application/json';
                break;
            case 'MARKDOWN':
            case 'MD':
                content = storageManager.exportChatAsMarkdown(this.currentChatId);
                filename = `chat-${Date.now()}.md`;
                type = 'text/markdown';
                break;
            case 'HTML':
                content = storageManager.exportChatAsHTML(this.currentChatId);
                filename = `chat-${Date.now()}.html`;
                type = 'text/html';
                break;
            default:
                Toast.error('Format tidak valid');
                return;
        }

        if (content) {
            Utils.downloadFile(content, filename, type);
            Toast.success(`Chat berhasil diekspor sebagai ${upperFormat}!`);
        }
    }

    /**
     * Show welcome screen
     */
    showWelcome() {
        this.elements.welcomeScreen.classList.remove('hidden');
        this.elements.chatMessages.classList.add('hidden');
    }

    /**
     * Show chat messages
     */
    showChat() {
        this.elements.welcomeScreen.classList.add('hidden');
        this.elements.chatMessages.classList.remove('hidden');
    }

    /**
     * Update chat title
     */
    updateChatTitle(title) {
        this.elements.currentChatTitle.textContent = title;
        document.title = `${title} - CodeAI Pro`;
    }

    /**
     * Scroll to bottom
     */
    scrollToBottom() {
        this.elements.chatContainer.scrollTop = this.elements.chatContainer.scrollHeight;
    }

    /**
     * Get current chat ID
     */
    getCurrentChatId() {
        return this.currentChatId;
    }

    /**
     * Check if processing
     */
    isProcessingMessage() {
        return this.isProcessing;
    }
}

// Create global instance
let chatManager;
