class SoundManager {
    constructor() {
        this.audioContext = null;
        this.masterGain = null;
        this.initialized = false;
        this.musicPlaying = false;
        this.backgroundMusic = null;
        this.musicToggleBtn = null;
        this.melodyTimeout = null;
        this.hoverSound = null;
        this.clickSound = null;
        this.selectionSound = null;
    }

    async init() {
        if (this.initialized) return;
        
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.masterGain = this.audioContext.createGain();
            this.masterGain.connect(this.audioContext.destination);
            this.masterGain.gain.setValueAtTime(0.3, this.audioContext.currentTime);
            this.initialized = true;
        } catch (e) {
            this.initialized = false;
        }
    }

    setupElements() {
        this.backgroundMusic = document.getElementById('background-music');
        this.musicToggleBtn = document.getElementById('music-toggle');
        this.hoverSound = document.getElementById('hover-sound');
        this.clickSound = document.getElementById('click-sound');
        this.selectionSound = document.getElementById('selection-sound');
        
        if (this.musicToggleBtn) {
            this.musicToggleBtn.addEventListener('click', () => this.toggleMusic());
        }

        return {
            backgroundMusic: !!this.backgroundMusic,
            musicToggleBtn: !!this.musicToggleBtn,
            hoverSound: !!this.hoverSound,
            clickSound: !!this.clickSound,
            selectionSound: !!this.selectionSound
        };
    }

    async createHoverSound() {
        await this.init();
        if (!this.audioContext) return;

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.masterGain);
        
        oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(1200, this.audioContext.currentTime + 0.1);
        
        gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.15, this.audioContext.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.1);
    }

    async createClickSound() {
        await this.init();
        if (!this.audioContext) return;

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.masterGain);
        
        oscillator.frequency.setValueAtTime(600, this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(300, this.audioContext.currentTime + 0.15);
        
        gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.2, this.audioContext.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.15);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.15);
    }

    async createSelectionSound() {
        await this.init();
        if (!this.audioContext) return;

        const oscillator1 = this.audioContext.createOscillator();
        const oscillator2 = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator1.connect(gainNode);
        oscillator2.connect(gainNode);
        gainNode.connect(this.masterGain);
        
        oscillator1.frequency.setValueAtTime(440, this.audioContext.currentTime);
        oscillator1.frequency.exponentialRampToValueAtTime(880, this.audioContext.currentTime + 0.2);
        
        oscillator2.frequency.setValueAtTime(660, this.audioContext.currentTime);
        oscillator2.frequency.exponentialRampToValueAtTime(1320, this.audioContext.currentTime + 0.2);
        
        gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.1, this.audioContext.currentTime + 0.02);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.2);
        
        oscillator1.start(this.audioContext.currentTime);
        oscillator1.stop(this.audioContext.currentTime + 0.2);
        oscillator2.start(this.audioContext.currentTime);
        oscillator2.stop(this.audioContext.currentTime + 0.2);
    }

    playHoverSound() {
        if (this.hoverSound) {
            this.hoverSound.currentTime = 0;
            this.hoverSound.play().catch(() => {
                this.createHoverSound();
            });
        } else {
            this.createHoverSound();
        }
    }

    playClickSound() {
        if (this.clickSound) {
            this.clickSound.currentTime = 0;
            this.clickSound.play().catch(() => {
                this.createClickSound();
            });
        } else {
            this.createClickSound();
        }
    }

    playSelectionSound() {
        if (this.selectionSound) {
            this.selectionSound.currentTime = 0;
            this.selectionSound.play().catch(() => {
                this.createSelectionSound();
            });
        } else {
            this.createSelectionSound();
        }
    }

    toggleMusic() {
        if (this.musicPlaying) {
            this.stopMusic();
        } else {
            this.startMusic();
        }
    }

    startMusic() {
        if (this.backgroundMusic) {
            this.backgroundMusic.play().catch(() => {
                this.createBackgroundMusic();
            });
        } else {
            this.createBackgroundMusic();
        }
        
        if (this.musicToggleBtn) {
            this.musicToggleBtn.textContent = '🔊';
            this.musicToggleBtn.classList.add('audio-controller__button--playing');
            this.musicToggleBtn.classList.remove('audio-controller__button--stopped');
            
            const controller = this.musicToggleBtn.closest('.audio-controller');
            if (controller) {
                controller.classList.add('audio-controller--playing');
                controller.classList.remove('audio-controller--stopped');
            }
        }
        
        this.musicPlaying = true;
    }

    stopMusic() {
        if (this.backgroundMusic) {
            this.backgroundMusic.pause();
        }
        
        if (this.melodyTimeout) {
            clearTimeout(this.melodyTimeout);
            this.melodyTimeout = null;
        }
        
        if (this.musicToggleBtn) {
            this.musicToggleBtn.textContent = '🔇';
            this.musicToggleBtn.classList.add('audio-controller__button--stopped');
            this.musicToggleBtn.classList.remove('audio-controller__button--playing');
            
            const controller = this.musicToggleBtn.closest('.audio-controller');
            if (controller) {
                controller.classList.add('audio-controller--stopped');
                controller.classList.remove('audio-controller--playing');
            }
        }
        
        this.musicPlaying = false;
    }

    async createBackgroundMusic() {
        await this.init();
        if (!this.audioContext || !this.musicPlaying) return;

        const playNote = (frequency, duration, delay = 0) => {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.masterGain);
            
            oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime + delay);
            gainNode.gain.setValueAtTime(0, this.audioContext.currentTime + delay);
            gainNode.gain.linearRampToValueAtTime(0.05, this.audioContext.currentTime + delay + 0.1);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + delay + duration);
            
            oscillator.start(this.audioContext.currentTime + delay);
            oscillator.stop(this.audioContext.currentTime + delay + duration);
        };

        const melody = [
            {freq: 261.63, duration: 0.5},
            {freq: 293.66, duration: 0.5},
            {freq: 329.63, duration: 0.5},
            {freq: 261.63, duration: 1.0},
            {freq: 220.00, duration: 0.5},
            {freq: 246.94, duration: 0.5},
            {freq: 261.63, duration: 1.0},
        ];

        let currentTime = 0;
        melody.forEach(note => {
            playNote(note.freq, note.duration, currentTime);
            currentTime += note.duration + 0.1;
        });

        if (this.musicPlaying) {
            this.melodyTimeout = setTimeout(() => {
                if (this.musicPlaying) {
                    this.createBackgroundMusic();
                }
            }, (currentTime + 2) * 1000);
        }
    }

    enableAutoStart() {
        const enableAudioOnFirstInteraction = () => {
            this.startMusic();
            document.removeEventListener('click', enableAudioOnFirstInteraction);
            document.removeEventListener('keydown', enableAudioOnFirstInteraction);
        };
        
        document.addEventListener('click', enableAudioOnFirstInteraction);
        document.addEventListener('keydown', enableAudioOnFirstInteraction);
    }

    applyToElements() {
        const portraitImages = document.querySelectorAll('.character-selector__item img');
        portraitImages.forEach(img => {
            img.addEventListener('mouseenter', () => this.playHoverSound());
            img.addEventListener('click', () => this.playSelectionSound());
        });

        const continueBtn = document.getElementById('continue-btn');
        if (continueBtn) {
            continueBtn.addEventListener('mouseenter', () => this.playHoverSound());
            continueBtn.addEventListener('click', () => this.playClickSound());
        }

        if (this.musicToggleBtn) {
            this.musicToggleBtn.addEventListener('mouseenter', () => this.playHoverSound());
        }
    }

    destroy() {
        this.stopMusic();
        
        if (this.melodyTimeout) {
            clearTimeout(this.melodyTimeout);
        }
        
        if (this.audioContext && this.audioContext.state !== 'closed') {
            this.audioContext.close();
        }
        
        this.initialized = false;
    }
}

const soundManager = new SoundManager();

export function initSound() {
    soundManager.setupElements();
    soundManager.enableAutoStart();
    soundManager.applyToElements();
    return true;
}

export function playHoverSound() {
    soundManager.playHoverSound();
}

export function playClickSound() {
    soundManager.playClickSound();
}

export function playSelectionSound() {
    soundManager.playSelectionSound();
}

export function toggleMusic() {
    soundManager.toggleMusic();
}

export { soundManager };

export default {
    init: initSound,
    playHover: playHoverSound,
    playClick: playClickSound,
    playSelection: playSelectionSound,
    toggleMusic,
    soundManager
};