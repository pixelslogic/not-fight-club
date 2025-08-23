import "../global/state.js";

function isFightPage() {
    return document.querySelector('.fighter-section') !== null || 
           document.querySelector('#battleArena') !== null ||
           document.querySelector('.battle-arena') !== null;
}

if (isFightPage()) {
    window.gameState = null;

    function getGameState() {
        if (window.stateManager) {
            const state = window.stateManager.getGameState();
            const adaptedState = {
                player: state.playerStats || {
                    hp: 200,
                    maxHp: 200,
                    damage: 25,
                    critChance: 0.15,
                    critMultiplier: 1.5,
                    attackZones: [],
                    defenseZones: []
                },
                enemy: state.enemyStats,
                currentEnemy: state.currentEnemy,
                turnNumber: state.turnNumber || 1,
                gameActive: state.gameActive || false,
                battleLogs: state.battleLogs || []
            };
            window.gameState = adaptedState;
            return adaptedState;
        } else {
            if (!window.gameState) {
                window.gameState = {
                    player: { 
                        hp: 200, 
                        maxHp: 200, 
                        damage: 25, 
                        critChance: 0.15, 
                        critMultiplier: 1.5, 
                        attackZones: [], 
                        defenseZones: [] 
                    },
                    enemy: null,
                    currentEnemy: null,
                    turnNumber: 1,
                    gameActive: false
                };
            }
            return window.gameState;
        }
    }

    window.enemies = {
        worker: {
            name: "Worker",
            hp: 100,
            maxHp: 100,
            damage: 15,
            critChance: 0.05,
            critMultiplier: 1.0,
            attackCount: 2,
            defenseCount: 1
        },
        soldier: {
            name: "Soldier", 
            hp: 150,
            maxHp: 150,
            damage: 20,
            critChance: 0.10,
            critMultiplier: 1.5,
            attackCount: 1,
            defenseCount: 3
        },
        manager: {
            name: "Manager",
            hp: 200,
            maxHp: 200,
            damage: 25,
            critChance: 0.20,
            critMultiplier: 1.8,
            attackCount: 1,
            defenseCount: 2
        }
    };

    function selectEnemy(enemyKey) {
        if (window.stateManager) {
            const success = window.stateManager.startGame(enemyKey);
            if (!success) {
                return;
            }
        } else {
            const gameState = getGameState();
            gameState.currentEnemy = enemyKey;
            gameState.enemy = {...window.enemies[enemyKey]};
            gameState.gameActive = true;
            gameState.turnNumber = 1;
            gameState.player.hp = gameState.player.maxHp;
            gameState.player.attackZones = [];
            gameState.player.defenseZones = [];
        }
        
        const opponentSelector = document.getElementById('opponentSelector');
        const battleArena = document.getElementById('battleArena');
        const battleLogs = document.getElementById('battleLogs');
        
        if (opponentSelector) opponentSelector.style.display = 'none';
        if (battleArena) battleArena.classList.add('battle-arena--active');
        if (battleLogs) battleLogs.classList.add('battle-logs--active');
        
        updateUI();
        addLogEntry('Battle started against ' + window.enemies[enemyKey].name + '!');
        
        const roundInfo = document.getElementById('roundInfo');
        if (roundInfo) {
            const gameState = getGameState();
            roundInfo.textContent = 'Round 1 | Fighting ' + (gameState.enemy?.name || window.enemies[enemyKey].name);
        }
        
        if (window.CharacterDisplay && window.CharacterDisplay.updateEnemy) {
            window.CharacterDisplay.updateEnemy(enemyKey);
        }
    }

    function selectZone(fighter, zone) {
        const gameState = getGameState();
        if (!gameState.gameActive) return;
        
        if (fighter === 'player') {
            const zoneElement = document.querySelector('[data-zone="' + zone + '"][data-fighter="player"]');
            if (!zoneElement) return;
            
            const isDefense = zoneElement.classList.contains('zone--defense-selected');
            
            if (isDefense) {
                gameState.player.defenseZones = gameState.player.defenseZones.filter(function(z) {
                    return z !== zone;
                });
                zoneElement.classList.remove('zone--defense-selected');
            } else {
                if (gameState.player.defenseZones.length < 2) {
                    gameState.player.defenseZones.push(zone);
                    zoneElement.classList.add('zone--defense-selected');
                }
            }
        } else if (fighter === 'enemy') {
            const zoneElement = document.querySelector('[data-zone="' + zone + '"][data-fighter="enemy"]');
            if (!zoneElement) return;
            
            const isAttack = zoneElement.classList.contains('zone--attack-selected');
            
            if (isAttack) {
                gameState.player.attackZones = [];
                zoneElement.classList.remove('zone--attack-selected');
            } else {
                gameState.player.attackZones = [zone];
                document.querySelectorAll('[data-fighter="enemy"] .zone').forEach(function(z) {
                    z.classList.remove('zone--attack-selected');
                });
                zoneElement.classList.add('zone--attack-selected');
            }
        }
        
        if (window.stateManager) {
            window.stateManager.updateGameState({
                playerStats: gameState.player
            });
        }
        
        updateSelectionStatus();
    }

    function executeAttack() {
        const gameState = getGameState();
        if (!gameState.gameActive) return;
        
        const playerAttackZone = gameState.player.attackZones[0];
        const playerDefenseZones = gameState.player.defenseZones;
        
        const enemyAttackZones = getRandomZones(gameState.enemy.attackCount);
        const enemyDefenseZones = getRandomZones(gameState.enemy.defenseCount);
        
        addLogEntry('--- TURN ' + gameState.turnNumber + ' ---');
        addLogEntry('Enemy attacks: ' + enemyAttackZones.map(function(z) { return z.toUpperCase(); }).join(', '));
        addLogEntry('Enemy defends: ' + enemyDefenseZones.map(function(z) { return z.toUpperCase(); }).join(', '));
        
        let playerDamage = 0;
        let enemyDamage = 0;
        
        if (playerAttackZone) {
            const playerCrit = Math.random() < gameState.player.critChance;
            let damage = gameState.player.damage;
            let blocked = enemyDefenseZones.includes(playerAttackZone);
            
            if (playerCrit) {
                damage = Math.floor(damage * gameState.player.critMultiplier);
                if (blocked) {
                    addLogEntry('PLAYER attacks ' + playerAttackZone.toUpperCase() + ' - CRITICAL HIT BREAKS DEFENSE for ' + damage + ' damage!');
                    blocked = false;
                } else {
                    addLogEntry('PLAYER attacks ' + playerAttackZone.toUpperCase() + ' - CRITICAL HIT for ' + damage + ' damage!');
                }
            } else {
                if (blocked) {
                    addLogEntry('PLAYER attacks ' + playerAttackZone.toUpperCase() + ' - BLOCKED!');
                    damage = 0;
                } else {
                    addLogEntry('PLAYER attacks ' + playerAttackZone.toUpperCase() + ' for ' + damage + ' damage!');
                }
            }
            
            if (!blocked || playerCrit) {
                gameState.enemy.hp -= damage;
                playerDamage = damage;
            }
        }
        
        enemyAttackZones.forEach(function(zone) {
            const enemyCrit = Math.random() < gameState.enemy.critChance;
            let damage = gameState.enemy.damage;
            let blocked = playerDefenseZones.includes(zone);
            
            if (enemyCrit) {
                damage = Math.floor(damage * gameState.enemy.critMultiplier);
                if (blocked) {
                    addLogEntry(gameState.enemy.name + ' attacks your ' + zone.toUpperCase() + ' - CRITICAL HIT BREAKS DEFENSE for ' + damage + ' damage!');
                    blocked = false;
                } else {
                    addLogEntry(gameState.enemy.name + ' attacks your ' + zone.toUpperCase() + ' - CRITICAL HIT for ' + damage + ' damage!');
                }
            } else {
                if (blocked) {
                    addLogEntry(gameState.enemy.name + ' attacks your ' + zone.toUpperCase() + ' - BLOCKED!');
                    damage = 0;
                } else {
                    addLogEntry(gameState.enemy.name + ' attacks your ' + zone.toUpperCase() + ' for ' + damage + ' damage!');
                }
            }
            
            if (!blocked || enemyCrit) {
                gameState.player.hp -= damage;
                enemyDamage += damage;
            }
        });
        
        if (gameState.enemy.hp <= 0) {
            gameState.gameActive = false;
            addLogEntry('VICTORY! You defeated ' + gameState.enemy.name + '!');
            
            if (window.stateManager) {
                window.stateManager.endGame(true, {
                    turnsPlayed: gameState.turnNumber,
                    damageDealt: playerDamage,
                    damageTaken: enemyDamage
                });
            }
            
            showGameOverModal(true);
        } else if (gameState.player.hp <= 0) {
            gameState.gameActive = false;
            addLogEntry('DEFEAT! You have been eliminated...');
            
            if (window.stateManager) {
                window.stateManager.endGame(false, {
                    turnsPlayed: gameState.turnNumber,
                    damageDealt: playerDamage,
                    damageTaken: enemyDamage
                });
            }
            
            showGameOverModal(false);
        } else {
            gameState.turnNumber++;
            clearZoneSelection();
            
            if (window.stateManager) {
                window.stateManager.updateGameState({
                    ...gameState,
                    playerStats: gameState.player,
                    enemyStats: gameState.enemy
                });
            }
        }
        
        updateUI();
    }

    function getRandomZones(count) {
        const zones = ['head', 'neck', 'body', 'belly', 'legs'];
        const selected = [];
        
        for (let i = 0; i < count; i++) {
            const available = zones.filter(function(zone) {
                return !selected.includes(zone);
            });
            if (available.length > 0) {
                const randomIndex = Math.floor(Math.random() * available.length);
                selected.push(available[randomIndex]);
            }
        }
        
        return selected;
    }

    function clearZoneSelection() {
        const gameState = getGameState();
        gameState.player.attackZones = [];
        gameState.player.defenseZones = [];
        
        document.querySelectorAll('.zone').forEach(function(zone) {
            zone.classList.remove('zone--attack-selected', 'zone--defense-selected');
        });
        
        if (window.stateManager) {
            window.stateManager.updateGameState({
                playerStats: gameState.player
            });
        }
    }

    function updateSelectionStatus() {
        const gameState = getGameState();
        const attackCount = gameState.player.attackZones.length;
        const defenseCount = gameState.player.defenseZones.length;
        const button = document.getElementById('attackButton');
        const status = document.getElementById('selectionStatus');
        
        if (status) {
            status.innerHTML = 'Attack: ' + attackCount + '/1<br>Defense: ' + defenseCount + '/2';
        }
        
        if (button) {
            if (attackCount === 1 && defenseCount === 2) {
                button.disabled = false;
            } else {
                button.disabled = true;
            }
        }
    }

    function updateUI() {
        const gameState = getGameState();
        const playerHealthBar = document.getElementById('playerHealthBar');
        const playerHealthText = document.getElementById('playerHealthText');
        
        if (!playerHealthBar || !playerHealthText) {
            return;
        }
        
        const playerHealthPercent = (gameState.player.hp / gameState.player.maxHp) * 100;
        playerHealthBar.style.width = playerHealthPercent + '%';
        playerHealthText.textContent = gameState.player.hp + ' / ' + gameState.player.maxHp;
        
        if (gameState.enemy) {
            const enemyHealthBar = document.getElementById('enemyHealthBar');
            const enemyHealthText = document.getElementById('enemyHealthText');
            const enemyName = document.getElementById('enemyName');
            
            if (enemyHealthBar && enemyHealthText && enemyName) {
                const enemyHealthPercent = (gameState.enemy.hp / gameState.enemy.maxHp) * 100;
                enemyHealthBar.style.width = enemyHealthPercent + '%';
                enemyHealthText.textContent = gameState.enemy.hp + ' / ' + gameState.enemy.maxHp;
                enemyName.textContent = gameState.enemy.name;
            }
        }
        
        const turnPhase = document.getElementById('turnPhase');
        if (turnPhase) {
            turnPhase.textContent = 'TURN ' + gameState.turnNumber;
        }
        
        updateSelectionStatus();
    }

    function addLogEntry(message) {
        if (window.stateManager) {
            window.stateManager.addBattleLog(message);
        }
        
        const logContent = document.getElementById('battleLogContent');
        if (!logContent) return;
        
        const gameState = getGameState();
        const newLogBlock = document.createElement('div');
        newLogBlock.className = 'logs';
        newLogBlock.innerHTML = '<div class="logs__turn">TURN ' + gameState.turnNumber + '</div><div class="logs__action">' + message + '</div>';
        logContent.appendChild(newLogBlock);
        
        logContent.scrollTop = logContent.scrollHeight;
    }

    function showGameOverModal(playerWon) {
        const modal = document.getElementById('gameOverModal');
        const title = document.getElementById('gameOverTitle');
        const icon = document.getElementById('gameOverIcon');
        const message = document.getElementById('gameOverMessage');
        
        if (!modal || !title || !icon || !message) return;
        
        modal.style.display = 'flex';
        modal.classList.add('game-over-modal--active');
        
        const gameState = getGameState();
        
        if (playerWon) {
            title.textContent = 'Victory!';
            icon.textContent = '🏆';
            message.textContent = 'You defeated ' + gameState.enemy.name + '!';
        } else {
            title.textContent = 'Game Over';
            icon.textContent = '💀';
            message.textContent = 'You have been eliminated from the game...';
        }
    }

    function closeGameOverModal() {
        const modal = document.getElementById('gameOverModal');
        if (modal) {
            modal.style.display = 'none';
            modal.classList.remove('game-over-modal--active');
        }
    }

    function resetGame() {
        if (window.stateManager) {
            window.stateManager.reset('game');
        }
        
        window.gameState = {
            player: {
                hp: 200,
                maxHp: 200,
                damage: 25,
                critChance: 0.15,
                critMultiplier: 1.5,
                attackZones: [],
                defenseZones: []
            },
            enemy: null,
            currentEnemy: null,
            turnNumber: 1,
            gameActive: false
        };
        
        const opponentSelector = document.getElementById('opponentSelector');
        const battleArena = document.getElementById('battleArena');
        const battleLogs = document.getElementById('battleLogs');
        const gameOverModal = document.getElementById('gameOverModal');
        const battleLogContent = document.getElementById('battleLogContent');
        const roundInfo = document.getElementById('roundInfo');
        
        if (opponentSelector) opponentSelector.style.display = 'grid';
        if (battleArena) battleArena.classList.remove('battle-arena--active');
        if (battleLogs) battleLogs.classList.remove('battle-logs--active');
        if (gameOverModal) {
            gameOverModal.style.display = 'none';
            gameOverModal.classList.remove('game-over-modal--active');
        }
        
        document.querySelectorAll('.opponent-card').forEach(function(card) {
            card.classList.remove('opponent-card--selected');
        });
        
        clearZoneSelection();
        
        if (battleLogContent) {
            battleLogContent.innerHTML = '<div class="logs__turn">GAME START</div><div class="logs__action logs__action--waiting">Choose your opponent to begin the battle...</div>';
        }
        
        if (roundInfo) {
            roundInfo.textContent = 'Round 1 | Choose your opponent';
        }
        
        updateUI();
        
        setTimeout(() => {
            if (window.fightSystemManager) {
                window.fightSystemManager.removeAllNicknames();
            }
        }, 100);
    }

    function restoreGameState() {
        if (!window.stateManager) {
            return;
        }
        
        try {
            const savedGameState = window.stateManager.getGameState();
            if (savedGameState.gameActive && savedGameState.currentEnemy) {
                const opponentSelector = document.getElementById('opponentSelector');
                const battleArena = document.getElementById('battleArena');
                const battleLogs = document.getElementById('battleLogs');
                
                if (opponentSelector) opponentSelector.style.display = 'none';
                if (battleArena) battleArena.classList.add('battle-arena--active');
                if (battleLogs) battleLogs.classList.add('battle-logs--active');
                
                window.gameState = savedGameState;
                
                updateUI();
                
                if (savedGameState.battleLogs && savedGameState.battleLogs.length > 0) {
                    const logContent = document.getElementById('battleLogContent');
                    if (logContent) {
                        logContent.innerHTML = '';
                        savedGameState.battleLogs.forEach(log => {
                            const logBlock = document.createElement('div');
                            logBlock.className = 'logs';
                            const message = typeof log === 'string' ? log : (log.message || 'Unknown action');
                            logBlock.innerHTML = '<div class="logs__action">' + message + '</div>';
                            logContent.appendChild(logBlock);
                        });
                        logContent.scrollTop = logContent.scrollHeight;
                    }
                }
                
                const roundInfo = document.getElementById('roundInfo');
                if (roundInfo && savedGameState.enemy) {
                    roundInfo.textContent = `Round ${savedGameState.turnNumber} | Fighting ${savedGameState.enemy.name}`;
                }
            }
        } catch (error) {}
    }

    function initFightSystem() {
        updateUI();
        
        document.querySelectorAll('[data-enemy]').forEach(function(card) {
            card.addEventListener('click', function() {
                const enemyKey = this.getAttribute('data-enemy');
                selectEnemy(enemyKey);
            });
        });
        
        document.querySelectorAll('[data-zone][data-fighter="player"]').forEach(function(zone) {
            zone.addEventListener('click', function() {
                const zoneKey = this.getAttribute('data-zone');
                selectZone('player', zoneKey);
            });
        });
        
        document.querySelectorAll('[data-zone][data-fighter="enemy"]').forEach(function(zone) {
            zone.addEventListener('click', function() {
                const zoneKey = this.getAttribute('data-zone');
                selectZone('enemy', zoneKey);
            });
        });
        
        const attackButton = document.getElementById('attackButton');
        if (attackButton) {
            attackButton.addEventListener('click', executeAttack);
        }
        
        const closeModalBtn = document.getElementById('closeModalBtn');
        if (closeModalBtn) {
            closeModalBtn.addEventListener('click', closeGameOverModal);
        }
        
        const modalBackdrop = document.getElementById('modalBackdrop');
        if (modalBackdrop) {
            modalBackdrop.addEventListener('click', closeGameOverModal);
        }
        
        const newBattleBtn = document.getElementById('newBattleBtn');
        if (newBattleBtn) {
            newBattleBtn.addEventListener('click', resetGame);
        }
        
        const viewLogBtn = document.getElementById('viewLogBtn');
        if (viewLogBtn) {
            viewLogBtn.addEventListener('click', closeGameOverModal);
        }
        
        setTimeout(() => {
            restoreGameState();
        }, 1500);
        
        window.gameSystemInitialized = true;
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initFightSystem);
    } else {
        setTimeout(initFightSystem, 100);
    }

    window.FightGame = {
        selectEnemy: selectEnemy,
        selectZone: selectZone,
        executeAttack: executeAttack,
        resetGame: resetGame,
        updateUI: updateUI,
        getGameState: getGameState,
        init: initFightSystem,
        restoreGameState: restoreGameState
    };
}