class NicknameDisplay {
    constructor() {
        this.currentNickname = '';
        this.displayElements = new Set();
    }

    updateNickname(nickname) {
        if (this.currentNickname === nickname) return;
        this.currentNickname = nickname;
        this.clearOldNicknames();
        this.displayInCorrectPlaces(nickname);
    }

    clearOldNicknames() {
        this.displayElements.forEach(el => {
            if (el && el.parentNode) el.textContent = '';
        });
        this.displayElements.clear();
    }

    displayInCorrectPlaces(nickname) {
        if (!nickname) return;

        const profileName = document.getElementById('profileName');
        if (profileName) {
            profileName.textContent = nickname;
            this.displayElements.add(profileName);
        }

        const popupProfileName = document.querySelector('.profile-popup #profileName');
        if (popupProfileName) {
            popupProfileName.textContent = nickname;
            this.displayElements.add(popupProfileName);
        }
    }

    getCurrentNickname() {
        if (window.stateManager) {
            const player = window.stateManager.getPlayer();
            return player?.username || '';
        }
        return localStorage.getItem('username') || '';
    }

    init() {
        const nickname = this.getCurrentNickname();
        if (nickname) this.updateNickname(nickname);

        if (window.stateManager?.on) {
            window.stateManager.on('player.username', (newNickname) => {
                this.updateNickname(newNickname);
            });
        }
    }

    changeNickname(newNickname) {
        if (!newNickname || newNickname.trim().length < 2) return false;

        const trimmed = newNickname.trim();

        if (window.stateManager) {
            const result = window.stateManager.setPlayer({ username: trimmed });
            if (result) {
                this.updateNickname(trimmed);
                return true;
            }
        } else {
            localStorage.setItem('username', trimmed);
            this.updateNickname(trimmed);
            return true;
        }

        return false;
    }
}

const nicknameDisplay = new NicknameDisplay();
window.nicknameDisplay = nicknameDisplay;