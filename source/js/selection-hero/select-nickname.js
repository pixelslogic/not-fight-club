import { getPlayerData, checkPlayerAuthorization } from '../player/player-data.js';

function displayPlayerNickname() {
    const playerData = getPlayerData();
    const username = playerData.username;

    if (!username) {
        window.location.href = 'authorization.html';
        return false;
    }

    const nicknameElement = document.getElementById('user-nickname');
    if (nicknameElement) {
        nicknameElement.innerHTML = '';
        nicknameElement.textContent = username.toUpperCase();

        nicknameElement.style.opacity = '0';
        nicknameElement.style.transform = 'translateY(20px)';
        setTimeout(() => {
            nicknameElement.style.transition = 'all 0.5s ease';
            nicknameElement.style.opacity = '1';
            nicknameElement.style.transform = 'translateY(0)';
        }, 100);

        return true;
    } else {
        return false;
    }
}

function displayPlayerNumber() {
    const playerData = getPlayerData();
    const playerNumber = playerData.playerNumber;
    const playerNumberElement = document.getElementById('player-number');
    if (playerNumberElement && playerNumber) {
        playerNumberElement.textContent = `#${playerNumber}`;
    }
}

function initNicknameDisplay() {
    const nicknameElement = document.getElementById('user-nickname');
    if (!nicknameElement) {
        return;
    }

    if (!checkPlayerAuthorization()) {
        return;
    }

    displayPlayerNickname();
    displayPlayerNumber();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNicknameDisplay);
} else {
    setTimeout(initNicknameDisplay, 100);
}

window.NicknameDisplay = {
    displayNickname: displayPlayerNickname,
    displayNumber: displayPlayerNumber,
    reload: initNicknameDisplay,
    getPlayerData: getPlayerData,
    checkLocalStorage: () => {
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            const value = localStorage.getItem(key);
            console.log(`${key}: ${value}`);
        }
    }
};

export {
    displayPlayerNickname,
    displayPlayerNumber,
    initNicknameDisplay
};
