import { savePlayerData, generatePlayerNumber, validatePlayerData } from '../player/player-data.js';

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