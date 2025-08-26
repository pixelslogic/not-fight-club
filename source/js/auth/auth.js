import { savePlayerData, generatePlayerNumber, validatePlayerData } from '../player/player-data.js';

function clearGameData() {
    localStorage.removeItem('battleState');
    localStorage.removeItem('gameState'); 
    localStorage.removeItem('defeatedEnemies');
    localStorage.removeItem('gameHistory');
    
    if (window.StateManager) {
        try {
            window.StateManager.reset('game');
        } catch (error) {}
    }
    
    if (window.gameState) {
        window.gameState = null;
    }
}

clearGameData();

const authForm = document.getElementById('authForm');
const usernameInput = document.getElementById('usernameInput');
const usernameError = document.getElementById('usernameError');
const loginButton = document.getElementById('loginButton');

if (authForm && usernameInput && loginButton) {
    function validateUsername(username) {
        const validation = validatePlayerData({ username });
        return validation.isValid;
    }

    function showValidationError() {
        usernameInput.classList.add('input__field--error');
        if (usernameError) {
            usernameError.classList.add('input__error--visible');
        }
        const authBlock = document.querySelector('.auth');
        if (authBlock) {
            authBlock.classList.add('glitch');
        }
        if (window.playClickSound) {
            window.playClickSound();
        }
        setTimeout(() => {
            usernameInput.classList.remove('input__field--error');
            if (usernameError) {
                usernameError.classList.remove('input__error--visible');
            }
            if (authBlock) {
                authBlock.classList.remove('glitch');
            }
        }, 3000);
    }

    authForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const username = usernameInput.value.trim();
        if (!validateUsername(username)) {
            showValidationError();
            return;
        }

        clearGameData();
        
        sessionStorage.setItem('resetGameState', 'true');

        const playerNumber = generatePlayerNumber();
        try {
            const playerData = {
                username: username,
                playerNumber: playerNumber,
                loginTime: new Date().toISOString(),
                gameStatus: 'active'
            };
            const saved = savePlayerData(playerData);
            if (!saved) {
                showValidationError();
                return;
            }
            if (window.playClickSound) {
                window.playClickSound();
            }
            setTimeout(() => {
                window.location.href = 'selection_hero.html';
            }, 200);
        } catch {
            showValidationError();
        }
    });

    usernameInput.addEventListener('input', function() {
        const username = this.value.trim();
        loginButton.disabled = !validateUsername(username);
        if (this.classList.contains('input__field--error')) {
            this.classList.remove('input__field--error');
            if (usernameError) {
                usernameError.classList.remove('input__error--visible');
            }
        }
    });
}

window.addEventListener('beforeunload', function() {
    const currentPage = window.location.pathname;
    
    const isRefresh = performance.navigation && performance.navigation.type === 1;
    const perfEntries = performance.getEntriesByType('navigation');
    const isModernRefresh = perfEntries.length > 0 && perfEntries[0].type === 'reload';
    
    if (isRefresh || isModernRefresh) {
        return;
    }
    
    if (currentPage.includes('fight') || currentPage.includes('selection')) {
        clearGameData();
    }
});

if (window.location.pathname.includes('index') || window.location.pathname === '/') {
    const referrer = document.referrer;
    const isFromFight = referrer && referrer.includes('fight');
    
    if (isFromFight) {
        clearGameData();
    }
}