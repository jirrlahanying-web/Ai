/**
 * ============================================
 * CodeAI Pro - Voice Input
 * Speech-to-text functionality
 * ============================================
 */

class VoiceInput {
    constructor() {
        this.recognition = null;
        this.isListening = false;
        this.supported = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
        
        this.init();
    }

    /**
     * Initialize voice input
     */
    init() {
        if (!this.supported) {
            console.log('Speech recognition not supported');
            return;
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        this.recognition = new SpeechRecognition();
        
        this.recognition.continuous = false;
        this.recognition.interimResults = true;
        this.recognition.lang = 'id-ID'; // Indonesian

        this.setupEventListeners();
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        this.recognition.onstart = () => {
            this.isListening = true;
            Utils.emit('voiceStart');
            Toast.info('Mendengarkan...');
        };

        this.recognition.onresult = (event) => {
            let finalTranscript = '';
            let interimTranscript = '';

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    finalTranscript += transcript;
                } else {
                    interimTranscript += transcript;
                }
            }

            Utils.emit('voiceResult', {
                final: finalTranscript,
                interim: interimTranscript
            });
        };

        this.recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            this.isListening = false;
            Utils.emit('voiceError', event.error);
            
            let errorMessage = 'Terjadi kesalahan saat mendengarkan';
            switch (event.error) {
                case 'no-speech':
                    errorMessage = 'Tidak ada suara terdeteksi';
                    break;
                case 'audio-capture':
                    errorMessage = 'Tidak dapat mengakses mikrofon';
                    break;
                case 'not-allowed':
                    errorMessage = 'Akses mikrofon ditolak';
                    break;
                case 'network':
                    errorMessage = 'Masalah koneksi jaringan';
                    break;
            }
            
            Toast.error(errorMessage);
        };

        this.recognition.onend = () => {
            this.isListening = false;
            Utils.emit('voiceEnd');
        };
    }

    /**
     * Start listening
     */
    start() {
        if (!this.supported) {
            Toast.error('Browser Anda tidak mendukung speech recognition');
            return false;
        }

        if (this.isListening) {
            this.stop();
            return false;
        }

        try {
            this.recognition.start();
            return true;
        } catch (error) {
            console.error('Start recognition error:', error);
            return false;
        }
    }

    /**
     * Stop listening
     */
    stop() {
        if (this.recognition && this.isListening) {
            this.recognition.stop();
        }
    }

    /**
     * Toggle listening
     */
    toggle() {
        if (this.isListening) {
            this.stop();
        } else {
            this.start();
        }
    }

    /**
     * Check if listening
     */
    isActive() {
        return this.isListening;
    }

    /**
     * Check if supported
     */
    isSupported() {
        return this.supported;
    }

    /**
     * Set language
     */
    setLanguage(lang) {
        if (this.recognition) {
            this.recognition.lang = lang;
        }
    }

    /**
     * Get supported languages
     */
    getSupportedLanguages() {
        return [
            { code: 'id-ID', name: 'Bahasa Indonesia' },
            { code: 'en-US', name: 'English (US)' },
            { code: 'en-GB', name: 'English (UK)' },
            { code: 'ja-JP', name: 'Japanese' },
            { code: 'ko-KR', name: 'Korean' },
            { code: 'zh-CN', name: 'Chinese (Simplified)' },
            { code: 'es-ES', name: 'Spanish' },
            { code: 'fr-FR', name: 'French' },
            { code: 'de-DE', name: 'German' }
        ];
    }
}

// Create global instance
const voiceInput = new VoiceInput();
