// main-music.js - исправленная версия с проверками
console.log('Music module loaded');

function checkMusicElements() {
    const audio = document.getElementById("main-music");
    const btn = document.getElementById("soundBtn");
    const soundIcon = document.querySelector(".main__sound-icon");
    const soundPrompt = document.querySelector(".sound-prompt"); // если есть
    
    return {
        audio,
        btn,
        soundIcon,
        soundPrompt,
        exists: !!(audio && btn && soundIcon)
    };
}

function initMusic() {
    console.log('Trying to initialize music...');
    
    const elements = checkMusicElements();
    
    if (!elements.exists) {
        console.log('Music elements not found, skipping music initialization');
        return;
    }

    try {
        const { audio, btn, soundIcon, soundPrompt } = elements;
        let isPlaying = false;

        audio.volume = 1;
        
        // Попытка автозапуска
        audio.play().then(() => {
            isPlaying = true;
            soundIcon.src = "./assets/icon/sound-pause.svg";
            console.log('Music autoplay started');
        }).catch((error) => {
            console.log('Autoplay blocked:', error);
            isPlaying = false;
            soundIcon.src = "./assets/icon/sound.svg";
            if (soundPrompt) soundPrompt.classList.add("show");
        });

        // Обработчик кнопки
        btn.addEventListener("click", () => {
            if (isPlaying) {
                audio.pause();
                isPlaying = false;
                soundIcon.src = "./assets/icon/sound-pause.svg";
                if (soundPrompt) soundPrompt.classList.add("show");
            } else {
                audio.play().then(() => {
                    isPlaying = true;
                    soundIcon.src = "./assets/icon/sound.svg";
                    if (soundPrompt) soundPrompt.classList.remove("show");
                }).catch((error) => {
                    console.error('Error playing audio:', error);
                });
            }
        });

        // Обработчик клика по документу для запуска звука
        document.addEventListener("click", () => {
            if (!isPlaying) {
                audio.play().then(() => {
                    isPlaying = true;
                    soundIcon.src = "./assets/icon/sound.svg";
                    if (soundPrompt) soundPrompt.classList.remove("show");
                }).catch((error) => {
                    console.error('Error playing audio on click:', error);
                });
            }
        }, { once: true });

        console.log('Music initialized successfully');
        
    } catch (error) {
        console.error('Error initializing music:', error);
    }
}

// Инициализация
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMusic);
} else {
    initMusic();
}

export default { initMusic };