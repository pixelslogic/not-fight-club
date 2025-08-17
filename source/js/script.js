import '../scss/styles.scss';
import './main/main-music.js';
import './main/main-carousel.js';
import './main/main-swiper.js';
import './selection-hero/select.js';
// ИСПРАВЛЕННЫЙ ИМПОРТ - правильный путь к файлу
import { initSound, playHoverSound, playClickSound, playSelectionSound } from './selection-hero/select-music.js';

console.log('Main script loaded');
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing sound system...');
    
    // Инициализируем звуковую систему
    const soundInitialized = initSound();
    
    if (soundInitialized) {
        console.log('✅ Sound system successfully initialized');
        
        // Дополнительная настройка звуков для элементов, которые могут быть добавлены динамически
        setTimeout(() => {
            // Применяем звуки к элементам, которые могли загрузиться позже
            const portraits = document.querySelectorAll('.portrait img');
            const continueBtn = document.getElementById('continue-btn');
            const musicBtn = document.getElementById('music-toggle');
            
            console.log(`Found ${portraits.length} portraits, continue button: ${!!continueBtn}, music button: ${!!musicBtn}`);
            
            // Дополнительные обработчики для клавиатуры
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
            
        }, 500); // Даем время на загрузку всех элементов
        
    } else {
        console.error('❌ Failed to initialize sound system');
    }
});

// Функции для использования в других модулях
export { playHoverSound, playClickSound, playSelectionSound, initSound };

// Глобальные функции для дебага (доступны в консоли)
window.playHover = playHoverSound;
window.playClick = playClickSound;
window.playSelection = playSelectionSound;