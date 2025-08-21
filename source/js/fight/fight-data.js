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
    updateHeaderNickname();
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

function updateHeaderNickname() {
    const nickname = getPlayerNickname();
    
    let nicknameElement = document.querySelector('.user-nickname');
    if (!nicknameElement) {
        const userAvatar = document.querySelector('.user-avatar');
        if (userAvatar && userAvatar.parentNode) {
            nicknameElement = document.createElement('span');
            nicknameElement.className = 'user-nickname';
            userAvatar.parentNode.insertBefore(nicknameElement, userAvatar.nextSibling);
        }
    }
    
    if (nicknameElement && nickname) {
        nicknameElement.textContent = nickname.toUpperCase();
    }
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

function updateCharacterDisplay() {
    displaySelectedCharacter();
}

function initCharacterDisplay() {
    displaySelectedCharacter();
    handleEnemySelection();
    
    window.addEventListener('storage', (e) => {
        if (e.key === SELECTED_CHARACTER_KEY || e.key === 'playerData') {
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

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCharacterDisplay);
} else {
    setTimeout(initCharacterDisplay, 100);
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
    updateNickname: updateHeaderNickname,
    updateEnemy: updateEnemyImage
};