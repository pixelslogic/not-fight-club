const SELECTED_CHARACTER_KEY = 'selectedCharacter';

const characterData = {
    456: {
        playerName: "Seong Gi-hun",
        portrait: "../assets/img/players/456/pixel-icon-456.png",
        unlocked: true
    },
    390: {
        playerName: "Park Jung-bae", 
        portrait: "../assets/img/players/390/pixel-icon-390.png",
        unlocked: true
    },
    120: {
        playerName: "Cho Hyun-ju",
        portrait: "../assets/img/players/120/pixel-icon-120.png", 
        unlocked: true
    },
    388: {
        playerName: "Kang Dae-ho",
        portrait: "../assets/img/players/388/pixel-icon-388.png",
        unlocked: true
    },
    246: {
        playerName: "Park Gyeong-seok",
        portrait: "../assets/img/players/246/pixel-icon-246.png",
        unlocked: true
    }
};

const enemyData = {
    worker: {
        enemyName: "Worker",
        portrait: "../assets/img/guards/worker/pixel-icon-worker.png"
    },
    soldier: {
        enemyName: "Soldier",
        portrait: "../assets/img/guards/soldier/pixel-icon-soldier.png"
    },
    manager: {
        enemyName: "Manager",
        portrait: "../assets/img/guards/manager/pixel-icon-manager.png"
    }
};

function saveSelectedCharacter(characterId) {
    localStorage.setItem(SELECTED_CHARACTER_KEY, String(characterId));
    if (window.profileManager) {
        window.profileManager.loadProfile();
        window.profileManager.updateAllDisplays();
    }
}

function getSelectedCharacter() {
    return localStorage.getItem(SELECTED_CHARACTER_KEY);
}

function getPlayerDataFromStorage() {
    try {
        const playerData = localStorage.getItem('playerData');
        return playerData ? JSON.parse(playerData) : null;
    } catch {
        return null;
    }
}

function getPlayerNickname() {
    const username = localStorage.getItem('username');
    if (username) return username;
    
    const playerData = getPlayerDataFromStorage();
    return playerData ? playerData.username : null;
}

function getDefaultPortrait() {
    return "https://www.thebeekmantowerny.com/wp-content/uploads/2016/12/200x200.png";
}

function getCharacterPortrait(characterId) {
    const character = characterData[characterId];
    return character ? character.portrait : getDefaultPortrait();
}

function getEnemyPortrait(enemyKey) {
    const enemy = enemyData[enemyKey];
    return enemy ? enemy.portrait : getDefaultPortrait();
}

function displaySelectedCharacter() {
    const selectedCharacterId = getSelectedCharacter();
    const fighterNameElement = document.querySelector('.fighter-section__name--player');
    
    if (fighterNameElement) {
        const characterId = selectedCharacterId || '456';
        fighterNameElement.textContent = `PLAYER ${characterId}`;
    }
    
    updatePlayerImages();
    updateUserAvatar();
    removeUserNicknames();
    
    if (window.profileManager) {
        window.profileManager.loadProfile();
        window.profileManager.updateAllDisplays();
    }
}

function updatePlayerImages() {
    const selectedCharacterId = getSelectedCharacter();
    const characterId = selectedCharacterId || '456';
    const portraitUrl = getCharacterPortrait(characterId);
    
    const playerImages = document.querySelectorAll('.fighter-section__img');
    playerImages.forEach(img => {
        if (img.alt === 'player icon') {
            img.src = portraitUrl;
        }
    });
}

function updateUserAvatar() {
    const selectedCharacterId = getSelectedCharacter();
    const characterId = selectedCharacterId || '456';
    const portraitUrl = getCharacterPortrait(characterId);
    
    const userAvatars = document.querySelectorAll('.user-avatar');
    userAvatars.forEach(avatar => {
        avatar.style.backgroundImage = `url(${portraitUrl})`;
        avatar.style.backgroundSize = 'cover';
        avatar.style.backgroundPosition = 'center';
    });
    
    const profileAvatar = document.getElementById('profileAvatar');
    if (profileAvatar) {
        profileAvatar.style.backgroundImage = `url(${portraitUrl})`;
        profileAvatar.style.backgroundSize = 'cover';
        profileAvatar.style.backgroundPosition = 'center';
    }
}

function updateEnemyImage(enemyKey) {
    if (!enemyKey) return;
    
    const portraitUrl = getEnemyPortrait(enemyKey);
    const enemyImages = document.querySelectorAll('.fighter-section__img');
    
    enemyImages.forEach(img => {
        if (img.alt === 'enemy icon') {
            img.src = portraitUrl;
        }
    });
}

function handleEnemySelection() {
    const enemyCards = document.querySelectorAll('[data-enemy]');
    
    enemyCards.forEach(card => {
        card.addEventListener('click', function() {
            const enemyKey = this.getAttribute('data-enemy');
            updateEnemyImage(enemyKey);
        });
    });
}

function removeUserNicknames() {
    const existingNicknames = document.querySelectorAll('.user-nickname, #user-nickname');
    existingNicknames.forEach(el => {
        el.remove();
    });
    
    const navItems = document.querySelectorAll('.nav-fight__item, .header-fight__actions, .nav-fight');
    navItems.forEach(item => {
        const nicknames = item.querySelectorAll('.user-nickname, #user-nickname');
        nicknames.forEach(nick => nick.remove());
    });
    
    const allSpans = document.querySelectorAll('span');
    allSpans.forEach(span => {
        if (span.classList.contains('user-nickname') || 
            span.textContent.includes('КОТЛЕТКА') ||
            span.textContent.includes('огуречикчик')) {
            span.remove();
        }
    });
}

function updateCharacterDisplay() {
    displaySelectedCharacter();
    removeUserNicknames();
}

function initCharacterDisplay() {
    displaySelectedCharacter();
    handleEnemySelection();
    
    if (window.nicknameDisplay) {
        window.nicknameDisplay.init();
    } else {
        removeUserNicknames();
    }
    
    window.addEventListener('storage', (e) => {
        if (e.key === SELECTED_CHARACTER_KEY || e.key === 'playerData' || e.key === 'username') {
            updateCharacterDisplay();
        }
    });
}

function clearSelectedCharacter() {
    localStorage.removeItem(SELECTED_CHARACTER_KEY);
}

function getCurrentCharacterInfo() {
    const characterId = getSelectedCharacter() || '456';
    const nickname = getPlayerNickname() || 'Player';
    const character = characterData[characterId];
    
    return {
        characterId: characterId,
        nickname: nickname,
        playerName: character ? character.playerName : 'Unknown',
        portrait: getCharacterPortrait(characterId)
    };
}

function updateProfileInLocalStorage() {
    const characterId = getSelectedCharacter() || '456';
    const nickname = getPlayerNickname() || 'Player';
    
    if (!localStorage.getItem('playerNumber')) {
        localStorage.setItem('playerNumber', characterId);
    }
    
    if (!localStorage.getItem('username') && nickname !== 'Player') {
        localStorage.setItem('username', nickname);
    }
}

function syncWithPopupManager() {
    if (window.profileManager) {
        window.profileManager.loadProfile();
        window.profileManager.updateAllDisplays();
    }
}

function initCharacterDisplayWithPopups() {
    const waitForPopupManager = () => {
        if (window.profileManager) {
            syncWithPopupManager();
        } else {
            setTimeout(waitForPopupManager, 100);
        }
    };
    
    initCharacterDisplay();
    updateProfileInLocalStorage();
    waitForPopupManager();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCharacterDisplayWithPopups);
} else {
    setTimeout(initCharacterDisplayWithPopups, 100);
}

window.CharacterDisplay = {
    saveSelected: saveSelectedCharacter,
    getSelected: getSelectedCharacter,
    getNickname: getPlayerNickname,
    display: displaySelectedCharacter,
    update: updateCharacterDisplay,
    clear: clearSelectedCharacter,
    getCurrentInfo: getCurrentCharacterInfo,
    init: initCharacterDisplay,
    updateImages: updatePlayerImages,
    updateAvatar: updateUserAvatar,
    updateEnemy: updateEnemyImage,
    removeNicknames: removeUserNicknames,
    sync: syncWithPopupManager,
    characterData: characterData,
    enemyData: enemyData
};

export {
    saveSelectedCharacter,
    getSelectedCharacter,
    getPlayerNickname,
    displaySelectedCharacter,
    updateCharacterDisplay,
    getCurrentCharacterInfo,
    removeUserNicknames,
    characterData,
    enemyData
};