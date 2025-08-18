export function loadPlayerNickname() {
	const username = localStorage.getItem('username');
	const playerNumber = localStorage.getItem('playerNumber');
	const nicknameElement = document.getElementById('user-nickname');

	if (username && nicknameElement) {
		nicknameElement.textContent = username.toUpperCase();
		return true;
	} else if (!username) {
		window.location.href = 'authorization.html';
		return false;
	} else {
		return false;
	}
}

export function loadPlayerNumber() {
	const playerNumber = localStorage.getItem('playerNumber');
	const playerNumberElement = document.getElementById('player-number');
	if (playerNumberElement && playerNumber) {
		playerNumberElement.textContent = playerNumber;
		return true;
	}
	return false;
}

export function loadPlayerInfo() {
	const playerData = getPlayerData();
	const nicknameLoaded = loadPlayerNickname();
	loadPlayerNumber();

	const loginTimeElement = document.getElementById('login-time');
	if (loginTimeElement && playerData.loginTime) {
		const loginDate = new Date(playerData.loginTime);
		loginTimeElement.textContent = loginDate.toLocaleString();
	}

	const gameStatusElement = document.getElementById('game-status');
	if (gameStatusElement && playerData.gameStatus) {
		gameStatusElement.textContent = playerData.gameStatus.toUpperCase();
	}
	return nicknameLoaded;
}

export function getPlayerData() {
	return {
		username: localStorage.getItem('username'),
		playerNumber: localStorage.getItem('playerNumber'),
		loginTime: localStorage.getItem('loginTime'),
		gameStatus: localStorage.getItem('gameStatus'),
		selectedCharacter: localStorage.getItem('selectedCharacter'),
		characterNumber: localStorage.getItem('characterNumber'),
		gameStartTime: localStorage.getItem('gameStartTime')
	};
}

export function savePlayerData(playerData) {
	try {
		Object.entries(playerData).forEach(([key, value]) => {
			if (value !== null && value !== undefined) {
				localStorage.setItem(key, value);
			}
		});
		return true;
	} catch {
		return false;
	}
}

export function updatePlayerNickname(newUsername) {
	try {
		localStorage.setItem('username', newUsername);
		const nicknameElement = document.getElementById('user-nickname');
		if (nicknameElement) {
				nicknameElement.textContent = newUsername.toUpperCase();
		}
		return true;
	} catch {
		return false;
	}
}

export function checkPlayerAuthorization() {
	const username = localStorage.getItem('username');
	if (!username) {
		window.location.href = 'authorization.html';
		return false;
	}
	return true;
}

export function logoutPlayer() {
	try {
		const keysToRemove = [
			'username',
			'playerNumber',
			'loginTime',
			'gameStatus',
			'selectedCharacter',
			'characterNumber',
			'gameStartTime'
			];
		keysToRemove.forEach(key => {
			localStorage.removeItem(key);
		});
		window.location.href = 'index.html';
		return true;
	} catch {
		return false;
	}
}

export function validatePlayerData(playerData) {
	const { username, playerNumber } = playerData;
	const errors = [];

	if (!username || username.trim().length < 2 || username.trim().length > 20) {
		errors.push('Username must be between 2 and 20 characters');
	}
	if (username && !/^[a-zA-Zа-яёА-ЯЁ0-9\s]+$/.test(username.trim())) {
		errors.push('Username contains invalid characters');
	}
	if (playerNumber && (isNaN(playerNumber) || playerNumber < 1 || playerNumber > 456)) {
		errors.push('Player number must be between 1 and 456');
	}

	return {
		isValid: errors.length === 0,
		errors: errors
	};
}

export function generatePlayerNumber() {
    return Math.floor(Math.random() * 456) + 1;
}

export function formatLoginTime(loginTime) {
	if (!loginTime) return 'Unknown';
	const date = new Date(loginTime);
	return date.toLocaleString('en-US', {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit'
	});
}

window.PlayerData = {
	load: loadPlayerInfo,
	get: getPlayerData,
	save: savePlayerData,
	update: updatePlayerNickname,
	logout: logoutPlayer,
	validate: validatePlayerData,
	check: checkPlayerAuthorization
};
