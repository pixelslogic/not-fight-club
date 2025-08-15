document.addEventListener("DOMContentLoaded", () => {
      const audio = document.getElementById("main-music");
      const btn = document.getElementById("soundBtn");
      const soundIcon = document.querySelector(".main__sound-icon");

      let isPlaying = false;

      audio.volume = 1;
      audio.play().then(() => {
        isPlaying = true;
        soundIcon.src = "./assets/icon/sound-pause.svg";
      }).catch(() => {
        isPlaying = false;
        soundIcon.src = "./assets/icon/sound.svg";
        soundPrompt.classList.add("show");
      });

      btn.addEventListener("click", () => {
        if (isPlaying) {
          audio.pause();
          isPlaying = false;
          soundIcon.src = "./assets/icon/sound-pause.svg";
          soundPrompt.classList.add("show");
        } else {
          audio.play().then(() => {
            isPlaying = true;
            soundIcon.src = "./assets/icon/sound.svg";
            soundPrompt.classList.remove("show");
          });
        }
      });

      document.addEventListener("click", () => {
        if (!isPlaying) {
          audio.play().then(() => {
            isPlaying = true;
            soundIcon.src = "./assets/icon/sound.svg";
            soundPrompt.classList.remove("show");
          });
        }
      }, { once: true });
    });