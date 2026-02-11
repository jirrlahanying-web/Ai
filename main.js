/**
 * ============================================
 * CodeAI Pro - Main Application
 * Entry point and app initialization
 * ============================================
 */

// Application State
const AppState = {
    isReady: false,
    isLoading: true,
    currentView: 'welcome',
    sidebarOpen: true
};

/**
 * Initialize Application
 */
function initApp() {
    console.log('🚀 CodeAI Pro v2.0 - Initializing...');
    
    // Show loading screen
    showLoadingScreen();
    
    // Simulate loading
    setTimeout(() => {
        initializeComponents();
        setupEventListeners();
        hideLoadingScreen();
        AppState.isReady = true;
        console.log('✅ CodeAI Pro ready!');
    }, 2000);
}

/**
 * Show loading screen
 */
function showLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    const app = document.getElementById('app');
    
    if (loadingScreen) loadingScreen.classList.remove('hidden');
    if (app) app.classList.add('hidden');
}

/**
 * Hide loading screen
 */
function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    const app = document.getElementById('app');
    
    if (loadingScreen) {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
        }, 500);
    }
    
    if (app) {
        app.classList.remove('hidden');
        // Trigger fade in
        setTimeout(() => {
            app.style.opacity = '1';
        }, 100);
    }
}

/**
 * Initialize all components
 */
function initializeComponents() {
    // Initialize managers
    chatManager = new ChatManager();
    settingsManager = new SettingsManager();
    
    // Initialize UI components
    initSidebar();
    initHeader();
    initInputArea();
    initModals();
    
    // Apply saved settings
    applySettings();
    
    console.log('📦 Components initialized');
}

/**
 * Initialize sidebar
 */
function initSidebar() {
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const themeToggle = document.getElementById('theme-toggle');
    const settingsBtn = document.getElementById('settings-btn');
    
    // Sidebar toggle
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', () => {
            toggleSidebar();
        });
    }
    
    // Theme toggle
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            themeManager.toggle();
            updateThemeIcon();
        });
    }
    
    // Settings button
    if (settingsBtn) {
        settingsBtn.addEventListener('click', () => {
            settingsManager.open();
        });
    }
    
    // Check for mobile
    if (Utils.isMobile()) {
        AppState.sidebarOpen = false;
        updateSidebarState();
    }
}

/**
 * Initialize header
 */
function initHeader() {
    const shareBtn = document.getElementById('share-btn');
    
    if (shareBtn) {
        shareBtn.addEventListener('click', () => {
            shareCurrentChat();
        });
    }
}

/**
 * Initialize input area
 */
function initInputArea() {
    const attachBtn = document.getElementById('attach-btn');
    const voiceBtn = document.getElementById('voice-btn');
    
    // File attachment
    if (attachBtn) {
        attachBtn.addEventListener('click', () => {
            fileManager.openFilePicker();
        });
    }
    
    // Voice input
    if (voiceBtn) {
        if (voiceInput.isSupported()) {
            voiceBtn.addEventListener('click', () => {
                toggleVoiceInput(voiceBtn);
            });
        } else {
            voiceBtn.style.display = 'none';
        }
    }
    
    // Listen for file uploads
    Utils.on(document, 'fileUploaded', (e) => {
        const attachment = e.detail;
        const input = document.getElementById('message-input');
        
        // Add file info to input
        const fileInfo = `[File: ${attachment.name}]\n`;
        input.value = fileInfo + input.value;
        input.focus();
        
        Toast.success(`File "${attachment.name}" siap dikirim!`);
    });
}

/**
 * Initialize modals
 */
function initModals() {
    // Settings modal
    const settingsModal = new Modal('settings-modal');
    
    // Code preview modal
    const codePreviewModal = new Modal('code-preview-modal');
    
    // Setup modal close buttons
    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', () => {
            const modal = btn.closest('.modal');
            if (modal) {
                modal.classList.add('hidden');
            }
        });
    });
}

/**
 * Setup global event listeners
 */
function setupEventListeners() {
    // Keyboard shortcuts
    document.addEventListener('keydown', handleKeyboardShortcuts);
    
    // Window resize
    window.addEventListener('resize', Utils.debounce(() => {
        handleWindowResize();
    }, 250));
    
    // Before unload
    window.addEventListener('beforeunload', (e) => {
        if (chatManager && chatManager.isProcessingMessage()) {
            e.preventDefault();
            e.returnValue = '';
        }
    });
    
    // Visibility change
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
            // App is visible again
            console.log('👁️ App visible');
        }
    });
    
    console.log('🎧 Event listeners attached');
}

/**
 * Handle keyboard shortcuts
 */
function handleKeyboardShortcuts(e) {
    // Ctrl/Cmd + K: Focus input
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        document.getElementById('message-input')?.focus();
    }
    
    // Ctrl/Cmd + N: New chat
    if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        chatManager?.createNewChat();
    }
    
    // Ctrl/Cmd + B: Toggle sidebar
    if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
        e.preventDefault();
        toggleSidebar();
    }
    
    // Escape: Close modals
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal:not(.hidden)').forEach(modal => {
            modal.classList.add('hidden');
        });
    }
    
    // Ctrl/Cmd + /: Show shortcuts
    if ((e.ctrlKey || e.metaKey) && e.key === '/') {
        e.preventDefault();
        showKeyboardShortcuts();
    }
}

/**
 * Handle window resize
 */
function handleWindowResize() {
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile && AppState.sidebarOpen) {
        AppState.sidebarOpen = false;
        updateSidebarState();
    }
}

/**
 * Toggle sidebar
 */
function toggleSidebar() {
    AppState.sidebarOpen = !AppState.sidebarOpen;
    updateSidebarState();
}

/**
 * Update sidebar state
 */
function updateSidebarState() {
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.querySelector('.main-content');
    
    if (AppState.sidebarOpen) {
        sidebar?.classList.remove('collapsed');
        mainContent?.classList.remove('expanded');
    } else {
        sidebar?.classList.add('collapsed');
        mainContent?.classList.add('expanded');
    }
    
    storageManager.setSetting('sidebarCollapsed', !AppState.sidebarOpen);
}

/**
 * Toggle voice input
 */
function toggleVoiceInput(button) {
    if (voiceInput.isActive()) {
        voiceInput.stop();
        button.innerHTML = '<i class="fas fa-microphone"></i>';
        button.classList.remove('recording');
    } else {
        voiceInput.start();
        button.innerHTML = '<i class="fas fa-stop"></i>';
        button.classList.add('recording');
        
        // Listen for results
        const handleResult = (e) => {
            const input = document.getElementById('message-input');
            if (input && e.detail.final) {
                input.value = e.detail.final;
                voiceInput.stop();
                button.innerHTML = '<i class="fas fa-microphone"></i>';
                button.classList.remove('recording');
            }
        };
        
        document.addEventListener('voiceResult', handleResult, { once: true });
    }
}

/**
 * Update theme icon
 */
function updateThemeIcon() {
    const themeToggle = document.getElementById('theme-toggle');
    const currentTheme = themeManager.getTheme();
    
    if (themeToggle) {
        const icon = themeToggle.querySelector('i');
        if (icon) {
            icon.className = currentTheme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
        }
    }
}

/**
 * Apply saved settings
 */
function applySettings() {
    const settings = storageManager.getSettings();
    
    // Theme
    themeManager.setTheme(settings.theme || 'dark', false);
    updateThemeIcon();
    
    // Font size
    if (settings.fontSize) {
        document.documentElement.style.setProperty('--code-font-size', settings.fontSize + 'px');
    }
    
    // Sidebar state
    if (settings.sidebarCollapsed) {
        AppState.sidebarOpen = false;
        updateSidebarState();
    }
    
    console.log('⚙️ Settings applied');
}

/**
 * Share current chat
 */
async function shareCurrentChat() {
    const chatId = chatManager?.getCurrentChatId();
    if (!chatId) {
        Toast.warning('Tidak ada chat untuk dibagikan');
        return;
    }
    
    const chat = storageManager.getChat(chatId);
    if (!chat) return;
    
    const shareData = {
        title: chat.title,
        text: `Chat dengan CodeAI Pro: ${chat.title}`,
        url: window.location.href
    };
    
    try {
        if (navigator.share) {
            await navigator.share(shareData);
            Toast.success('Chat dibagikan!');
        } else {
            // Fallback: copy to clipboard
            await Utils.copyToClipboard(window.location.href);
            Toast.success('Link chat disalin ke clipboard!');
        }
    } catch (error) {
        console.error('Share error:', error);
    }
}

/**
 * Show keyboard shortcuts
 */
function showKeyboardShortcuts() {
    const shortcuts = [
        { key: 'Ctrl + K', description: 'Fokus ke input pesan' },
        { key: 'Ctrl + N', description: 'Chat baru' },
        { key: 'Ctrl + B', description: 'Toggle sidebar' },
        { key: 'Enter', description: 'Kirim pesan' },
        { key: 'Shift + Enter', description: 'Baris baru' },
        { key: 'Escape', description: 'Tutup modal' },
        { key: 'Ctrl + /', description: 'Tampilkan shortcut' }
    ];
    
    let html = '<div class="shortcuts-list">';
    shortcuts.forEach(s => {
        html += `
            <div class="shortcut-item">
                <kbd>${s.key}</kbd>
                <span>${s.description}</span>
            </div>
        `;
    });
    html += '</div>';
    
    // Create modal
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-overlay"></div>
        <div class="modal-content" style="max-width: 400px;">
            <div class="modal-header">
                <h2><i class="fas fa-keyboard"></i> Keyboard Shortcuts</h2>
                <button class="modal-close"><i class="fas fa-times"></i></button>
            </div>
            <div class="modal-body">
                ${html}
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close handlers
    modal.querySelector('.modal-overlay').addEventListener('click', () => modal.remove());
    modal.querySelector('.modal-close').addEventListener('click', () => modal.remove());
}

/**
 * Show about dialog
 */
function showAbout() {
    const stats = storageManager.getStats();
    
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-overlay"></div>
        <div class="modal-content" style="max-width: 450px;">
            <div class="modal-header">
                <h2><i class="fas fa-info-circle"></i> Tentang CodeAI Pro</h2>
                <button class="modal-close"><i class="fas fa-times"></i></button>
            </div>
            <div class="modal-body" style="text-align: center;">
                <img src="assets/logo.png" alt="CodeAI Pro" style="width: 80px; margin-bottom: 20px;">
                <h3>CodeAI Pro v2.0</h3>
                <p>Asisten AI Cerdas untuk Coding</p>
                
                <div style="margin: 20px 0; text-align: left; background: var(--bg-tertiary); padding: 15px; border-radius: 8px;">
                    <p><strong>Total Chat:</strong> ${stats.totalChats}</p>
                    <p><strong>Total Pesan:</strong> ${stats.totalMessages}</p>
                    <p><strong>Pertama Digunakan:</strong> ${new Date(stats.firstUsed).toLocaleDateString('id-ID')}</p>
                </div>
                
                <p style="color: var(--text-muted); font-size: 0.9em;">
                    Dibuat dengan ❤️ untuk developer Indonesia
                </p>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    modal.querySelector('.modal-overlay').addEventListener('click', () => modal.remove());
    modal.querySelector('.modal-close').addEventListener('click', () => modal.remove());
}

// ==================== INITIALIZATION ====================

// Start app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}

// Expose globals for debugging
window.CodeAIPro = {
    version: '2.0',
    state: AppState,
    utils: Utils,
    storage: storageManager,
    theme: themeManager,
    api: apiServer,
    chat: () => chatManager,
    settings: () => settingsManager,
    showAbout
};

console.log('📜 CodeAI Pro v2.0 - Script loaded');
