import '../scss/styles.scss';
import './main/main-music.js';
import './main/main-carousel.js';
import './main/main-swiper.js';
import './auth/auth.js';
import './player/player-data.js';
import './selection-hero/select.js';
import './selection-hero/select-nickname.js';
import './fight/fight.js';
import './fight/fight-data.js';
import { initSound, playHoverSound, playClickSound, playSelectionSound } from './selection-hero/select-music.js';

export { playHoverSound, playClickSound, playSelectionSound, initSound };

document.addEventListener('DOMContentLoaded', function() {
    const soundInitialized = initSound();
    
    if (soundInitialized) {
        
        setTimeout(() => {
            const portraits = document.querySelectorAll('.portrait img');
            const continueBtn = document.getElementById('continue-btn');
            const musicBtn = document.getElementById('music-toggle');
            
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