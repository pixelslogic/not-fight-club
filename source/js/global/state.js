class StateManager {
    constructor() {
        this.defaultState = {
            player: {
                username: null,
                playerNumber: null,
                selectedCharacter: '456',
                loginTime: null,
                gameStatus: 'inactive'
            },
            game: {
                currentEnemy: null,
                turnNumber: 1,
                playerStats: {
                    hp: 200,
                    maxHp: 200,
                    damage: 25,
                    critChance: 0.15,
                    critMultiplier: 1.5,
                    attackZones: [],
                    defenseZones: []
                },
                enemyStats: null,
                battleLogs: [],
                gameActive: false,
                gameStartTime: null
            },
            settings: {
                masterVolume: 0.5,
                musicMuted: false,
                effectsEnabled: true,
                autoplayEnabled: true
            },
            meta: {
                version: '1.0.0',
                lastSaved: null,
                sessionId: this.generateSessionId()
            }
        };
        this.state = { ...this.defaultState };
        this.cache = new Map();
        this.initialized = false;
        this.autoSaveEnabled = true;
        this.syncEnabled = true;
        this.listeners = new Map();
        this.init();
    }

    async init() {
        if (this.initialized) return;
        try {
            await this.load();
            this.setupAutoSave();
            this.setupCrossTabSync();
            this.setupEventHandlers();
            this.initialized = true;
        } catch {
            this.state = { ...this.defaultState };
        }
    }

    getState(path = null) {
        if (!path) return { ...this.state };
        return this.getValueByPath(this.state, path);
    }

    setState(path, value, autoSave = true) {
        try {
            this.setValueByPath(this.state, path, value);
            this.state.meta.lastSaved = new Date().toISOString();
            this.notifyListeners(path, value);
            if (autoSave && this.autoSaveEnabled) this.debouncedSave();
            return true;
        } catch {
            return false;
        }
    }

    async load() {
        try {
            const savedState = this.loadFromStorage('appState');
            if (savedState && this.validateState(savedState)) {
                this.state = this.mergeStates(this.defaultState, savedState);
            } else {
                this.migrateOldData();
            }
            this.cache.clear();
            return true;
        } catch {
            this.state = { ...this.defaultState };
            return false;
        }
    }

    async save(force = false) {
        try {
            if (!force && !this.hasChanges()) return true;
            this.state.meta.lastSaved = new Date().toISOString();
            this.saveToStorage('appState', this.state);
            this.saveToStorage('playerData', this.state.player);
            this.saveToStorage('gameState', this.state.game);
            return true;
        } catch {
            return false;
        }
    }

    reset(section = null) {
        try {
            if (section && this.defaultState[section]) {
                this.state[section] = { ...this.defaultState[section] };
            } else {
                this.state = { ...this.defaultState };
                this.state.meta.sessionId = this.generateSessionId();
            }
            this.save(true);
            this.notifyListeners('reset', section);
            return true;
        } catch {
            return false;
        }
    }

    setPlayer(playerData) {
        const validatedData = this.validatePlayerData(playerData);
        if (!validatedData) return false;
        if (!validatedData.playerNumber) validatedData.playerNumber = this.generatePlayerNumber();
        if (!validatedData.loginTime) validatedData.loginTime = new Date().toISOString();
        Object.assign(this.state.player, validatedData);
        return this.save();
    }

    getPlayer() {
        return { ...this.state.player };
    }

    setSelectedCharacter(characterId) {
        if (!this.validateCharacterId(characterId)) return false;
        this.setState('player.selectedCharacter', characterId);
        return true;
    }

    getSelectedCharacter() {
        return this.state.player.selectedCharacter || '456';
    }

    startGame(enemyType) {
        const enemyStats = this.getEnemyStats(enemyType);
        if (!enemyStats) return false;
        this.state.game = {
            ...this.defaultState.game,
            currentEnemy: enemyType,
            enemyStats: { ...enemyStats },
            gameActive: true,
            gameStartTime: new Date().toISOString(),
            battleLogs: [`Game started against ${enemyStats.name}`]
        };
        return this.save();
    }

    updateGameState(updates) {
        Object.assign(this.state.game, updates);
        return this.save();
    }

    addBattleLog(message) {
        this.state.game.battleLogs.push({
            message,
            timestamp: new Date().toISOString(),
            turn: this.state.game.turnNumber
        });
        if (this.state.game.battleLogs.length > 100) {
            this.state.game.battleLogs = this.state.game.battleLogs.slice(-50);
        }
        return this.save();
    }

    endGame(playerWon, stats = {}) {
        this.state.game.gameActive = false;
        this.state.game.gameResult = playerWon ? 'victory' : 'defeat';
        this.state.game.gameEndTime = new Date().toISOString();
        this.state.game.finalStats = stats;
        this.addBattleLog(`Game ended: ${playerWon ? 'Victory!' : 'Defeat!'}`);
        return this.save();
    }

    getGameState() {
        return { ...this.state.game };
    }

    updateSettings(settings) {
        Object.assign(this.state.settings, settings);
        return this.save();
    }

    getSettings() {
        return { ...this.state.settings };
    }

    validatePlayerData(data) {
        const { username, playerNumber } = data;
        if (!username || typeof username !== 'string') return null;
        if (username.trim().length < 2 || username.trim().length > 20) return null;
        if (!/^[a-zA-Zа-яёА-ЯЁ0-9\s]+$/.test(username.trim())) return null;
        if (playerNumber && (isNaN(playerNumber) || playerNumber < 1 || playerNumber > 456)) return null;
        return { ...data, username: username.trim() };
    }

    validateCharacterId(characterId) {
        const validCharacters = ['456', '390', '120', '388', '246', '222', '333', '149', '007', '230'];
        return validCharacters.includes(String(characterId));
    }

    generatePlayerNumber() {
        return Math.floor(Math.random() * 456) + 1;
    }

    generateSessionId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    getEnemyStats(enemyType) {
        const enemies = {
            worker: { name: "Worker", hp: 100, maxHp: 100, damage: 15, critChance: 0.05, critMultiplier: 1.0, attackCount: 2, defenseCount: 1 },
            soldier: { name: "Soldier", hp: 150, maxHp: 150, damage: 20, critChance: 0.10, critMultiplier: 1.5, attackCount: 1, defenseCount: 3 },
            manager: { name: "Manager", hp: 200, maxHp: 200, damage: 25, critChance: 0.20, critMultiplier: 1.8, attackCount: 1, defenseCount: 2 }
        };
        return enemies[enemyType] || null;
    }

    getValueByPath(obj, path) {
        return path.split('.').reduce((current, key) => current?.[key], obj);
    }

    setValueByPath(obj, path, value) {
        const keys = path.split('.');
        const lastKey = keys.pop();
        const target = keys.reduce((current, key) => {
            if (!current[key]) current[key] = {};
            return current[key];
        }, obj);
        target[lastKey] = value;
    }

    validateState(state) {
        return state && typeof state === 'object' && state.player && state.game && state.settings && state.meta;
    }

    mergeStates(defaultState, savedState) {
        const merged = { ...defaultState };
        Object.keys(savedState).forEach(key => {
            if (typeof savedState[key] === 'object' && !Array.isArray(savedState[key])) {
                merged[key] = { ...defaultState[key], ...savedState[key] };
            } else {
                merged[key] = savedState[key];
            }
        });
        return merged;
    }

    migrateOldData() {
        try {
            const oldUsername = localStorage.getItem('username');
            const oldPlayerNumber = localStorage.getItem('playerNumber');
            const oldSelectedCharacter = localStorage.getItem('selectedCharacter');
            const oldLoginTime = localStorage.getItem('loginTime');
            if (oldUsername) {
                this.state.player = {
                    ...this.state.player,
                    username: oldUsername,
                    playerNumber: oldPlayerNumber || this.generatePlayerNumber(),
                    selectedCharacter: oldSelectedCharacter || '456',
                    loginTime: oldLoginTime || new Date().toISOString()
                };
            }
        } catch {}
    }

    hasChanges() {
        const lastSaved = this.cache.get('lastSaveTime');
        const lastState = this.cache.get('lastState');
        const stateStr = JSON.stringify(this.state);
        if (!lastSaved || !lastState || lastState !== stateStr) {
            this.cache.set('lastState', stateStr);
            this.cache.set('lastSaveTime', Date.now());
            return true;
        }
        return false;
    }

    loadFromStorage(key) {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : null;
    }

    saveToStorage(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    }

    debouncedSave(delay = 3000) {
        clearTimeout(this.saveTimeout);
        this.saveTimeout = setTimeout(() => this.save(), delay);
    }

    setupAutoSave() {
        if (!this.autoSaveEnabled) return;
        window.addEventListener('beforeunload', () => this.save(true));
    }

    setupCrossTabSync() {
        if (!this.syncEnabled) return;
        window.addEventListener('storage', e => {
            if (e.key === 'appState') this.load();
        });
    }

    setupEventHandlers() {
        this.listeners = new Map();
    }

    subscribe(event, callback) {
        if (!this.listeners.has(event)) this.listeners.set(event, []);
        this.listeners.get(event).push(callback);
    }

    unsubscribe(event, callback) {
        if (!this.listeners.has(event)) return;
        this.listeners.set(event, this.listeners.get(event).filter(fn => fn !== callback));
    }

    notifyListeners(event, data) {
        if (!this.listeners.has(event)) return;
        this.listeners.get(event).forEach(fn => fn(data));
    }
}

window.StateManager = new StateManager();
