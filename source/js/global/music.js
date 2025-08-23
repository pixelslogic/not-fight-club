class AudioManager {
    constructor() {
        this.audioContext = null;
        this.masterGain = null;
        this.initialized = false;
        this.userInteracted = false;
        this.globalMuted = false;
        this.masterVolume = 0.5;
        this.backgroundMusic = null;
        this.currentMusicType = null;
        this.musicSettings = {
            main: { selector: '#main-music', volume: 0.3, autoplay: true },
            background: { selector: '#background-music', volume: 0.3, autoplay: true },
            fight: { selector: '#fight-music', volume: 0.4, autoplay: true }
        };
        this.soundEffects = new Map();
        this.effectSettings = {
            hover: { frequency: 800, duration: 0.1, volume: 0.05 },
            click: { frequency: 600, duration: 0.15, volume: 0.1 },
            selection: { frequency: 440, duration: 0.2, volume: 0.08 },
            locked: { frequency: 200, duration: 0.3, volume: 0.1 }
        };
        this.handleUserInteraction = this.handleUserInteraction.bind(this);
        this.init();
    }

    async init() {
        if (this.initialized) return;
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) {
            this.audioContext = new AudioContext();
            this.masterGain = this.audioContext.createGain();
            this.masterGain.connect(this.audioContext.destination);
            this.masterGain.gain.setValueAtTime(this.masterVolume, this.audioContext.currentTime);
        }
        this.setupAudioElements();
        this.setupUserInteractionHandlers();
        this.setupControls();
        this.attemptAutoplay();
        this.initialized = true;
    }

    setupAudioElements() {
        for (const [type, settings] of Object.entries(this.musicSettings)) {
            const element = document.querySelector(settings.selector);
            if (element) {
                this.backgroundMusic = element;
                this.currentMusicType = type;
                element.volume = settings.volume;
                element.loop = true;
                element.muted = this.globalMuted;
                break;
            }
        }
    }

    setupUserInteractionHandlers() {
        ['click', 'touchstart', 'keydown'].forEach(event => {
            document.addEventListener(event, this.handleUserInteraction, { once: false, passive: true });
        });
    }

    async handleUserInteraction() {
        if (this.userInteracted) return;
        this.userInteracted = true;
        if (this.audioContext && this.audioContext.state === 'suspended') {
            await this.audioContext.resume();
        }
        if (this.backgroundMusic && this.shouldAutoplay()) {
            await this.playBackgroundMusic();
        }
    }

    shouldAutoplay() {
        if (!this.currentMusicType) return false;
        return this.musicSettings[this.currentMusicType].autoplay;
    }

    async attemptAutoplay() {
        if (!this.backgroundMusic || !this.shouldAutoplay()) return;
        try { await this.backgroundMusic.play(); } catch {}
    }

    async playBackgroundMusic() {
        if (!this.backgroundMusic) return false;
        this.backgroundMusic.muted = this.globalMuted;
        try { await this.backgroundMusic.play(); this.updateUI(); return true; } catch { return false; }
    }

    pauseBackgroundMusic() {
        if (!this.backgroundMusic) return;
        this.backgroundMusic.pause();
        this.updateUI();
    }

    async toggleBackgroundMusic() {
        if (!this.backgroundMusic) return false;
        if (this.backgroundMusic.paused) return await this.playBackgroundMusic();
        this.pauseBackgroundMusic();
        return true;
    }

    setVolume(volume) {
        this.masterVolume = Math.max(0, Math.min(1, volume));
        if (this.backgroundMusic) {
            const musicVolume = this.musicSettings[this.currentMusicType]?.volume || 0.3;
            this.backgroundMusic.volume = musicVolume * this.masterVolume;
        }
        if (this.masterGain) this.masterGain.gain.setValueAtTime(this.masterVolume, this.audioContext.currentTime);
        this.updateUI();
    }

    toggleMute() {
        this.globalMuted = !this.globalMuted;
        if (this.backgroundMusic) this.backgroundMusic.muted = this.globalMuted;
        this.updateUI();
        return this.globalMuted;
    }

    async createSoundEffect(type, customSettings = {}) {
        if (!this.audioContext) return;
        const settings = { ...this.effectSettings[type], ...customSettings };
        if (!settings.frequency) return;
        try {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            oscillator.connect(gainNode);
            gainNode.connect(this.masterGain);
            oscillator.frequency.setValueAtTime(settings.frequency, this.audioContext.currentTime);

            if (type === 'selection') {
                const oscillator2 = this.audioContext.createOscillator();
                oscillator2.connect(gainNode);
                oscillator2.frequency.setValueAtTime(settings.frequency * 2, this.audioContext.currentTime);
                oscillator2.start(this.audioContext.currentTime);
                oscillator2.stop(this.audioContext.currentTime + settings.duration);
            }

            if (type === 'locked') {
                oscillator.frequency.exponentialRampToValueAtTime(settings.frequency * 0.5, this.audioContext.currentTime + settings.duration);
            }

            gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(settings.volume, this.audioContext.currentTime + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + settings.duration);

            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + settings.duration);
        } catch {}
    }

    playHover() { if (!this.globalMuted) this.createSoundEffect('hover'); }
    playClick() { if (!this.globalMuted) this.createSoundEffect('click'); }
    playSelection() { if (!this.globalMuted) this.createSoundEffect('selection'); }
    playLocked() { if (!this.globalMuted) this.createSoundEffect('locked'); }

    setupControls() {
        const volumeSlider = document.getElementById('volumeSlider');
        if (volumeSlider) volumeSlider.value = this.masterVolume * 100;
        volumeSlider?.addEventListener('input', e => this.setVolume(e.target.value / 100));
        ['playBtn','pauseBtn','muteBtn','soundBtn','music-toggle'].forEach(id => {
            const el = document.getElementById(id);
            if (!el) return;
            if (id === 'playBtn') el.addEventListener('click', () => this.playBackgroundMusic());
            if (id === 'pauseBtn') el.addEventListener('click', () => this.pauseBackgroundMusic());
            if (id === 'muteBtn') el.addEventListener('click', () => this.toggleMute());
            if (id === 'soundBtn' || id === 'music-toggle') el.addEventListener('click', () => this.toggleBackgroundMusic());
        });
        this.setupButtonSounds();
    }

    setupButtonSounds() {
        document.querySelectorAll('button,.btn,.character-selector__item img,.zone,.opponent-card,a[href]').forEach(el => {
            el.addEventListener('mouseenter', () => this.playHover(), { passive: true });
            el.addEventListener('click', () => el.matches('.character-selector__item img') ? this.playSelection() : this.playClick(), { passive: true });
        });
    }

    updateUI() {
        const volumeDisplay = document.getElementById('volumeDisplay');
        if (volumeDisplay) volumeDisplay.textContent = `${Math.round(this.masterVolume * 100)}%`;
        const volumeSlider = document.getElementById('volumeSlider');
        if (volumeSlider) volumeSlider.value = this.masterVolume * 100;
        this.updatePlayPauseButtons();
        this.updateMuteButtons();
        this.updateSoundIcons();
    }

    updatePlayPauseButtons() {
        const playBtn = document.getElementById('playBtn');
        const pauseBtn = document.getElementById('pauseBtn');
        if (!playBtn || !pauseBtn || !this.backgroundMusic) return;
        playBtn.classList.toggle('active', this.backgroundMusic.paused);
        pauseBtn.classList.toggle('active', !this.backgroundMusic.paused);
    }

    updateMuteButtons() {
        const muteBtn = document.getElementById('muteBtn');
        const musicToggle = document.getElementById('music-toggle');
        if (muteBtn) muteBtn.classList.toggle('active', this.globalMuted);
        if (musicToggle) {
            musicToggle.textContent = this.globalMuted ? '🔇' : '🔊';
            musicToggle.classList.toggle('audio-controller__button--stopped', this.globalMuted);
            musicToggle.classList.toggle('audio-controller__button--playing', !this.globalMuted);
        }
    }

    updateSoundIcons() {
        const soundIcon = document.querySelector('.main__sound-icon');
        if (!soundIcon) return;
        const isPlaying = this.backgroundMusic && !this.backgroundMusic.paused && !this.globalMuted;
        soundIcon.src = isPlaying ? "./assets/icon/sound.svg" : "./assets/icon/sound-pause.svg";
    }

    getState() {
        return {
            initialized: this.initialized,
            userInteracted: this.userInteracted,
            globalMuted: this.globalMuted,
            masterVolume: this.masterVolume,
            currentMusicType: this.currentMusicType,
            isPlaying: this.backgroundMusic ? !this.backgroundMusic.paused : false
        };
    }

    destroy() {
        if (this.backgroundMusic) { this.backgroundMusic.pause(); this.backgroundMusic = null; }
        if (this.audioContext && this.audioContext.state !== 'closed') this.audioContext.close();
        ['click','touchstart','keydown'].forEach(event => document.removeEventListener(event, this.handleUserInteraction));
        this.initialized = false;
    }
}

const audioManager = new AudioManager();
window.audioManager = audioManager;
window.musicManager = audioManager;
window.playHoverSound = () => audioManager.playHover();
window.playClickSound = () => audioManager.playClick();
window.playSelectionSound = () => audioManager.playSelection();
window.toggleMusic = () => audioManager.toggleBackgroundMusic();

export default audioManager;
export { audioManager, AudioManager };

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => audioManager.init());
} else {
    audioManager.init();
}