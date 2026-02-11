/**
 * ============================================
 * CodeAI Pro - Export Manager
 * Handles exporting chats in various formats
 * ============================================
 */

class ExportManager {
    constructor() {
        this.formats = ['json', 'markdown', 'html', 'txt'];
    }

    /**
     * Export chat
     * @param {string} chatId - Chat ID
     * @param {string} format - Export format
     */
    exportChat(chatId, format = 'json') {
        const chat = storageManager.getChat(chatId);
        if (!chat) {
            Toast.error('Chat tidak ditemukan!');
            return;
        }

        switch (format.toLowerCase()) {
            case 'json':
                this.exportAsJSON(chat);
                break;
            case 'markdown':
            case 'md':
                this.exportAsMarkdown(chat);
                break;
            case 'html':
                this.exportAsHTML(chat);
                break;
            case 'txt':
            case 'text':
                this.exportAsText(chat);
                break;
            default:
                Toast.error('Format tidak didukung!');
        }
    }

    /**
     * Export as JSON
     */
    exportAsJSON(chat) {
        const data = {
            ...chat,
            exportedAt: new Date().toISOString(),
            app: 'CodeAI Pro',
            version: '2.0'
        };

        const content = JSON.stringify(data, null, 2);
        const filename = `codeai-chat-${chat.id}-${Date.now()}.json`;
        
        Utils.downloadFile(content, filename, 'application/json');
        Toast.success('Chat berhasil diekspor sebagai JSON!');
    }

    /**
     * Export as Markdown
     */
    exportAsMarkdown(chat) {
        let md = `# ${chat.title}\n\n`;
        md += `> Exported from CodeAI Pro on ${new Date().toLocaleString('id-ID')}\n\n`;
        md += `---\n\n`;

        chat.messages.forEach(msg => {
            const role = msg.role === 'user' ? '**User**' : '**CodeAI Pro**';
            const time = new Date(msg.timestamp).toLocaleString('id-ID');
            
            md += `## ${role} *(${time})*\n\n`;
            
            // Process content
            let content = msg.content;
            
            // Escape code blocks for markdown
            content = content.replace(/```([\s\S]*?)```/g, (match, code) => {
                return match; // Keep code blocks as is
            });
            
            md += content + '\n\n';
            md += `---\n\n`;
        });

        md += `\n*Exported by CodeAI Pro v2.0*\n`;

        const filename = `codeai-chat-${chat.id}-${Date.now()}.md`;
        Utils.downloadFile(md, filename, 'text/markdown');
        Toast.success('Chat berhasil diekspor sebagai Markdown!');
    }

    /**
     * Export as HTML
     */
    exportAsHTML(chat) {
        const theme = themeManager.getTheme();
        const colors = themeManager.getThemeColors(theme);

        let html = `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${chat.title} - CodeAI Pro Export</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: ${colors.background};
            color: ${colors.text};
            line-height: 1.6;
            padding: 20px;
        }
        
        .container {
            max-width: 900px;
            margin: 0 auto;
        }
        
        header {
            text-align: center;
            padding: 30px 0;
            border-bottom: 2px solid ${colors.primary};
            margin-bottom: 30px;
        }
        
        h1 {
            color: ${colors.primary};
            margin-bottom: 10px;
        }
        
        .meta {
            color: #666;
            font-size: 0.9em;
        }
        
        .message {
            margin-bottom: 30px;
            padding: 20px;
            border-radius: 10px;
        }
        
        .message.user {
            background: rgba(6, 182, 212, 0.1);
            border-left: 4px solid #06b6d4;
        }
        
        .message.ai {
            background: rgba(124, 58, 237, 0.1);
            border-left: 4px solid #7c3aed;
        }
        
        .message-header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 15px;
            font-weight: 600;
        }
        
        .message.user .message-header {
            color: #06b6d4;
        }
        
        .message.ai .message-header {
            color: #7c3aed;
        }
        
        .message-time {
            font-weight: normal;
            font-size: 0.85em;
            color: #666;
        }
        
        .message-content {
            line-height: 1.7;
        }
        
        .message-content p {
            margin-bottom: 10px;
        }
        
        pre {
            background: #1a1a2e;
            color: #fff;
            padding: 15px;
            border-radius: 8px;
            overflow-x: auto;
            margin: 15px 0;
        }
        
        code {
            font-family: 'Fira Code', monospace;
            font-size: 0.9em;
        }
        
        pre code {
            display: block;
        }
        
        :not(pre) > code {
            background: rgba(124, 58, 237, 0.2);
            padding: 2px 6px;
            border-radius: 4px;
            color: #a855f7;
        }
        
        footer {
            text-align: center;
            padding: 30px;
            margin-top: 30px;
            border-top: 1px solid #333;
            color: #666;
        }
        
        @media print {
            body {
                background: white;
                color: black;
            }
            
            .message {
                break-inside: avoid;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>${chat.title}</h1>
            <p class="meta">
                Exported on ${new Date().toLocaleString('id-ID')} • 
                ${chat.messages.length} messages
            </p>
        </header>
        
        <main>`;

        chat.messages.forEach(msg => {
            const roleName = msg.role === 'user' ? 'User' : 'CodeAI Pro';
            const time = new Date(msg.timestamp).toLocaleString('id-ID');
            
            html += `
            <div class="message ${msg.role}">
                <div class="message-header">
                    <span>${roleName}</span>
                    <span class="message-time">${time}</span>
                </div>
                <div class="message-content">
                    ${this.formatContentForHTML(msg.content)}
                </div>
            </div>`;
        });

        html += `
        </main>
        
        <footer>
            <p>Exported by CodeAI Pro v2.0</p>
        </footer>
    </div>
</body>
</html>`;

        const filename = `codeai-chat-${chat.id}-${Date.now()}.html`;
        Utils.downloadFile(html, filename, 'text/html');
        Toast.success('Chat berhasil diekspor sebagai HTML!');
    }

    /**
     * Export as plain text
     */
    exportAsText(chat) {
        let text = `${chat.title}\n`;
        text += `Exported on ${new Date().toLocaleString('id-ID')}\n`;
        text += `${'='.repeat(50)}\n\n`;

        chat.messages.forEach(msg => {
            const roleName = msg.role === 'user' ? 'USER' : 'CODEAI PRO';
            const time = new Date(msg.timestamp).toLocaleString('id-ID');
            
            text += `[${roleName}] ${time}\n`;
            text += `${'-'.repeat(30)}\n`;
            text += msg.content + '\n\n';
        });

        text += `${'='.repeat(50)}\n`;
        text += 'Exported by CodeAI Pro v2.0\n';

        const filename = `codeai-chat-${chat.id}-${Date.now()}.txt`;
        Utils.downloadFile(text, filename, 'text/plain');
        Toast.success('Chat berhasil diekspor sebagai teks!');
    }

    /**
     * Format content for HTML export
     */
    formatContentForHTML(content) {
        // Convert markdown-like to HTML
        let html = content;

        // Code blocks
        html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>');

        // Inline code
        html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

        // Bold
        html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

        // Italic
        html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');

        // Headers
        html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
        html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
        html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');

        // Lists
        html = html.replace(/^- (.+)$/gm, '<li>$1</li>');
        html = html.replace(/(<li>.+<\/li>\n?)+/g, '<ul>$&</ul>');

        // Paragraphs
        html = html.replace(/\n\n/g, '</p><p>');
        html = '<p>' + html + '</p>';

        return html;
    }

    /**
     * Export all chats
     */
    exportAllChats(format = 'json') {
        const chats = storageManager.getChats();
        
        if (chats.length === 0) {
            Toast.warning('Tidak ada chat untuk diekspor!');
            return;
        }

        const data = {
            exportedAt: new Date().toISOString(),
            app: 'CodeAI Pro',
            version: '2.0',
            totalChats: chats.length,
            chats: chats
        };

        const content = JSON.stringify(data, null, 2);
        const filename = `codeai-all-chats-${Date.now()}.json`;
        
        Utils.downloadFile(content, filename, 'application/json');
        Toast.success(`${chats.length} chat berhasil diekspor!`);
    }

    /**
     * Import chats
     */
    importChats(file) {
        Utils.readFileAsText(file).then(content => {
            try {
                const data = JSON.parse(content);
                
                if (!data.chats || !Array.isArray(data.chats)) {
                    throw new Error('Invalid format');
                }

                const imported = storageManager.importData(data);
                
                if (imported) {
                    Toast.success(`${data.chats.length} chat berhasil diimpor!`);
                    
                    // Refresh UI
                    if (chatManager) {
                        chatManager.renderChatHistory();
                    }
                } else {
                    throw new Error('Import failed');
                }

            } catch (error) {
                console.error('Import error:', error);
                Toast.error('File tidak valid atau corrupt!');
            }
        }).catch(error => {
            console.error('Read error:', error);
            Toast.error('Gagal membaca file!');
        });
    }

    /**
     * Get export formats
     */
    getFormats() {
        return [
            { id: 'json', name: 'JSON', icon: 'fa-file-code', description: 'Format data lengkap' },
            { id: 'markdown', name: 'Markdown', icon: 'fa-file-alt', description: 'Format yang mudah dibaca' },
            { id: 'html', name: 'HTML', icon: 'fa-html5', description: 'Format web yang cantik' },
            { id: 'txt', name: 'Plain Text', icon: 'fa-file', description: 'Format teks sederhana' }
        ];
    }
}

// Create global instance
const exportManager = new ExportManager();
