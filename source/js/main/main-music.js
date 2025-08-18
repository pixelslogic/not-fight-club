function checkMusicElements() {
    const audio = document.getElementById("main-music");
    const btn = document.getElementById("soundBtn");
    const soundIcon = document.querySelector(".main__sound-icon");
    const soundPrompt = document.querySelector(".sound-prompt");
    return {
        audio,
        btn,
        soundIcon,
        soundPrompt,
        exists: !!(audio && btn && soundIcon)
    };
}

function initMusic() {
    const elements = checkMusicElements();
    if (!elements.exists) {
        return;
    }
    try {
        const { audio, btn, soundIcon, soundPrompt } = elements;
        let isPlaying = false;

        audio.volume = 1;

        audio.play().then(() => {
            isPlaying = true;
            soundIcon.src = "./assets/icon/sound-pause.svg";
        }).catch(() => {
            isPlaying = false;
            soundIcon.src = "./assets/icon/sound.svg";
            if (soundPrompt) soundPrompt.classList.add("show");
        });

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
                }).catch(() => {});
            }
        });

        document.addEventListener("click", () => {
            if (!isPlaying) {
                audio.play().then(() => {
                    isPlaying = true;
                    soundIcon.src = "./assets/icon/sound.svg";
                    if (soundPrompt) soundPrompt.classList.remove("show");
                }).catch(() => {});
            }
        }, { once: true });
    } catch {}
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMusic);
} else {
    initMusic();
}

export default { initMusic };