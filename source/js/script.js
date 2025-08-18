import '../scss/styles.scss';
import './main/main-music.js';
import './main/main-carousel.js';
import './main/main-swiper.js';
import './auth/auth.js';
import './auth/auth.js';
import './player/player-data.js';
import './selection-hero/select.js';
import './selection-hero/select-nickname.js';
import { initSound, playHoverSound, playClickSound, playSelectionSound } from './selection-hero/select-music.js';

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing sound system...');
    
    const soundInitialized = initSound();
    
    if (soundInitialized) {
        console.log('Sound system successfully initialized');
        
        setTimeout(() => {
            const portraits = document.querySelectorAll('.portrait img');
            const continueBtn = document.getElementById('continue-btn');
            const musicBtn = document.getElementById('music-toggle');
            
            console.log(`Found ${portraits.length} portraits, continue button: ${!!continueBtn}, music button: ${!!musicBtn}`);
            
            document.addEventListener('keydown', (event) => {
                if (event.key === ' ' || event.key === 'Spacebar') {
                    event.preventDefault();
                    if (window.gameSoundManager) {
                        window.gameSoundManager.toggleMusic();
                    }
                }
                
                if (event.key === 'Enter') {
                    event.preventDefault();
                    playClickSound();
                    const continueBtn = document.getElementById('continue-btn');
                    if (continueBtn) {
                        continueBtn.click();
                    }
                }
            });
            
        }, 500);
        
    }
});

export { playHoverSound, playClickSound, playSelectionSound, initSound };