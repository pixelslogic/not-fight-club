import { playHoverSound, playClickSound, playSelectionSound } from './select-music.js';

const LOCKED_CHARACTERS = Object.freeze(['222', '333', '149', '007', '230']);

const isCharacterUnlocked = (characterId) => {
    return !LOCKED_CHARACTERS.includes(characterId);
};

const characterData = {
    456: {
        playerName: "Seong Gi-hun",
        description: "The main protagonist of the series, a bankrupt driver and gambling addict who participates in the games to pay off his debts and provide for his daughter. After winning the first games, he returns driven by a desire to stop the cruel system and protect other participants.",
        fullBody: "../assets/img/players/456/456.png",
        portrait: "../assets/img/players/456/456-icon.png",
        gradientColors: ["#0a8f91", "#f44786"],
        gradientDirection: "to bottom right",
        shadowConfig: {
            hueShiftS: 180, hueShiftB: 200, brightnessS: 0.7, brightnessB: 0.4
        },
        unlocked: true
    },
    390: {
        playerName: "Park Jung-bae",
        description: "Gi-hun's best friend who also ended up in the games due to financial problems. Their friendship is severely tested under the conditions of deadly competition.",
        fullBody: "../assets/img/players/390/390.png",
        portrait: "../assets/img/players/390/390-icon.png",
        gradientColors: ["#142852", "#0a8f91"],
        gradientDirection: "to bottom right",
        shadowConfig: {
            hueShiftS: 220, hueShiftB: 240, brightnessS: 0.6, brightnessB: 0.3
        },
        unlocked: true
    },
    120: {
        playerName: "Cho Hyun-ju",
        description: "A transgender woman who participates in the games to pay for gender transition surgery. She faces discrimination and misunderstanding from other players but shows strength of spirit and determination.",
        fullBody: "../assets/img/players/120/120.png",
        portrait: "../assets/img/players/120/120-icon.png",
        gradientColors: ["#e6d591", "#641b6b"],
        gradientDirection: "to left top",
        shadowConfig: {
            hueShiftS: 300, hueShiftB: 320, brightnessS: 0.75, brightnessB: 0.45
        },
        unlocked: true
    },
    388: {
        playerName: "Kang Dae-ho",
        description: "Initially presented as a friendly and sympathetic character who forms an alliance with Gi-hun and Jung-bae, bonding with them through their supposedly shared military background.",
        fullBody: "../assets/img/players/388/388.png",
        portrait: "../assets/img/players/388/388-icon.png",
        gradientColors: ["#7a943e", "#5e3839"],
        gradientDirection: "to bottom right",
        shadowConfig: {
            hueShiftS: 90, hueShiftB: 110, brightnessS: 0.65, brightnessB: 0.35
        },
        unlocked: true
    },
    246: {
        playerName: "Park Gyeong-seok",
        description: "A participant in the 37th Squid Game who joined the games to get money for his daughter's medical treatment, as she suffers from recurring blood cancer. His desperate desire to save his child drives him throughout all the trials.",
        fullBody: "../assets/img/players/246/246.png",
        portrait: "../assets/img/players/246/246-icon.png",
        gradientColors: ["#ff6b6b", "#4ecdc4"],
        gradientDirection: "to bottom right",
        shadowConfig: {
            hueShiftS: 45, hueShiftB: 65, brightnessS: 0.8, brightnessB: 0.5
        },
        unlocked: true
    },
    222: {
        playerName: "Kim Jun-hee",
        description: "🔒 This character is locked. Complete more challenges to unlock.",
        fullBody: "../assets/img/players/222/222.png",
        portrait: "../assets/img/players/222/222-icon.png",
        gradientColors: ["#8B5CF6", "#EC4899"],
        gradientDirection: "to bottom right",
        shadowConfig: {
            hueShiftS: 270, hueShiftB: 290, brightnessS: 0.7, brightnessB: 0.4
        },
        unlocked: false
    },
    333: {
        playerName: "Lee Myung-gi",
        description: "🔒 This character is locked. Complete more challenges to unlock.",
        fullBody: "../assets/img/players/333/333.png",
        portrait: "../assets/img/players/333/333-icon.png",
        gradientColors: ["#059669", "#DC2626"],
        gradientDirection: "to bottom right",
        shadowConfig: {
            hueShiftS: 120, hueShiftB: 140, brightnessS: 0.7, brightnessB: 0.4
        },
        unlocked: false
    },
    149: {
        playerName: "Jang Geum-ja",
        description: "🔒 This character is locked. Complete more challenges to unlock.",
        fullBody: "../assets/img/players/149/149.png",
        portrait: "../assets/img/players/149/149-icon.png",
        gradientColors: ["#F59E0B", "#EF4444"],
        gradientDirection: "to bottom right",
        shadowConfig: {
            hueShiftS: 30, hueShiftB: 50, brightnessS: 0.7, brightnessB: 0.4
        },
        unlocked: false
    },
    "007": {
        playerName: "Park Yong-sik",
        description: "🔒 This character is locked. Complete more challenges to unlock.",
        fullBody: "../assets/img/players/007/007.png",
        portrait: "../assets/img/players/007/007-icon.png",
        gradientColors: ["#065F46", "#BE185D"],
        gradientDirection: "to bottom right",
        shadowConfig: {
            hueShiftS: 240, hueShiftB: 260, brightnessS: 0.7, brightnessB: 0.4
        },
        unlocked: false
    },
    230: {
        playerName: "Thanos",
        description: "🔒 This character is locked. Complete more challenges to unlock.",
        fullBody: "../assets/img/players/230/230.png",
        portrait: "../assets/img/players/230/230-icon.png",
        gradientColors: ["#7C3AED", "#1E40AF"],
        gradientDirection: "to bottom right",
        shadowConfig: {
            hueShiftS: 150, hueShiftB: 170, brightnessS: 0.7, brightnessB: 0.4
        },
        unlocked: false
    }
};

class CharacterSelector {
    constructor() {
        this.elements = {};
        this.currentCharacterNumber = 1;
        this.characterOrder = {};
        this.initializeElements();
    }

    initializeElements() {
        this.elements.mainCharacterImage = document.getElementById("main-agent");
        this.elements.shadowImage = document.getElementById("main-agent-s");
        this.elements.blurImage = document.getElementById("main-agent-b");
        this.elements.heroRole = document.getElementById("hero-role");
        this.elements.heroName = document.getElementById("hero-name");
        this.elements.heroDescription = document.getElementById("hero-desc");
        this.elements.background = document.getElementById("gradient");
        this.elements.characterContainer = document.querySelector('.character');
        this.elements.selectionSound = document.getElementById('selection-sound');
    }

    getKeyByValue(object, value) {
        return Object.keys(object).find(key => object[key] === value);
    }

    playSelectionSoundEffect() {
        if (this.elements.selectionSound) {
            this.elements.selectionSound.currentTime = 0;
            this.elements.selectionSound.play().catch(() => {
                playSelectionSound();
            });
        } else {
            playSelectionSound();
        }
    }

    playLockedSound() {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(100, audioContext.currentTime + 0.3);
            
            gainNode.gain.setValueAtTime(0, audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.3);
        } catch (e) {
        }
    }

    generateCharacterDisplay(characterKey) {
        const character = characterData[characterKey];
        if (!character || !this.elements.mainCharacterImage) return;

        [this.elements.mainCharacterImage, this.elements.shadowImage, this.elements.blurImage].forEach(img => {
            if (img) {
                img.style.display = 'block';
                img.style.opacity = '1';
                img.style.visibility = 'visible';
            }
        });

        this.elements.mainCharacterImage.src = character.fullBody;
        if (this.elements.shadowImage) this.elements.shadowImage.src = character.fullBody;
        if (this.elements.blurImage) this.elements.blurImage.src = character.fullBody;

        if (this.elements.characterContainer) {
            this.elements.characterContainer.style.setProperty('--shadow-hue-s', `${character.shadowConfig.hueShiftS}deg`);
            this.elements.characterContainer.style.setProperty('--shadow-hue-b', `${character.shadowConfig.hueShiftB}deg`);
            this.elements.characterContainer.style.setProperty('--brightness-s', character.shadowConfig.brightnessS);
            this.elements.characterContainer.style.setProperty('--brightness-b', character.shadowConfig.brightnessB);
        }
    }

    updateHeroInfo() {
        const characterKey = this.characterOrder[this.currentCharacterNumber];
        const character = characterData[characterKey];
        if (!character || !this.elements.mainCharacterImage) return;
        this.generateCharacterDisplay(characterKey);
        
        if (window.CharacterDisplay) {
            window.CharacterDisplay.saveSelected(characterKey);
        }

        if (this.elements.characterContainer) {
            this.elements.characterContainer.setAttribute('data-character', characterKey);
        }

        if (this.elements.heroName) {
            this.elements.heroName.textContent = character.playerName;
        }

        document.querySelectorAll(".background-text__item").forEach(element => {
            element.textContent = characterKey;
        });

        if (this.elements.heroDescription) {
            this.elements.heroDescription.textContent = character.description;
        }
        if (this.elements.heroRole) {
            this.elements.heroRole.textContent = `Player ${characterKey}`;
        }

        document.querySelectorAll("[data-character]").forEach(el => {
            const img = el.querySelector('img');
            if (img) img.classList.remove('active');
        });
        
        const activeCharacter = document.querySelector(`[data-character="${characterKey}"] img`);
        if (activeCharacter) {
            activeCharacter.classList.add('active');
        }
    }

    applyLockedStyles(characterElement, characterKey) {
        const characterItem = characterElement.closest('.character-selector__item');
        if (!characterItem) return;

        characterItem.classList.add('character-selector__item--locked');
        characterElement.src = characterData[characterKey].portrait;
        characterElement.alt = `Player ${characterKey} (Locked)`;
        
        if (!characterItem.querySelector('.lock-icon')) {
            const lockIcon = document.createElement('div');
            lockIcon.className = 'lock-icon';
            lockIcon.innerHTML = '🔒';
            characterItem.appendChild(lockIcon);
        }
        
        if (!characterItem.querySelector('.lock-indicator')) {
            const lockIndicator = document.createElement('div');
            lockIndicator.className = 'lock-indicator';
            characterItem.appendChild(lockIndicator);
        }
        
        const blockSelectEvent = (e) => {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            
            characterItem.style.animation = 'shake 0.5s ease-in-out';
            setTimeout(() => {
                characterItem.style.animation = '';
            }, 500);
            
            this.playLockedSound();
            this.showLockMessage(characterKey);
            return false;
        };
        
        ['click', 'mousedown', 'mouseup', 'dblclick', 'touchstart', 'touchend'].forEach(eventType => {
            characterItem.addEventListener(eventType, blockSelectEvent, true);
            characterElement.addEventListener(eventType, blockSelectEvent, true);
        });
        
        characterItem.addEventListener('mouseenter', () => {
            this.playLockedSound();
        });
    }

    showLockMessage(characterKey) {
        const existingMessage = document.querySelector('.lock-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        const message = document.createElement('div');
        message.className = 'lock-message';
        message.textContent = `Character ${characterKey} is locked! Complete more challenges to unlock.`;
        message.style.animation = 'slideIn 0.3s ease';
        
        document.body.appendChild(message);
        
        setTimeout(() => {
            if (message.parentNode) {
                message.style.animation = 'slideOut 0.3s ease';
                setTimeout(() => message.remove(), 300);
            }
        }, 3000);
    }

    async waitForElements() {
        return new Promise((resolve) => {
            const checkElements = () => {
                const characterImages = document.querySelectorAll('.character-selector__item img[data-character]');
                
                if (characterImages.length > 0) {
                    resolve(characterImages);
                } else {
                    setTimeout(checkElements, 100);
                }
            };
            checkElements();
        });
    }

    async init() {
        const characterImages = await this.waitForElements();
        
        const availableCharacters = [];
        
        characterImages.forEach(characterElement => {
            const key = characterElement.getAttribute('data-character');
            if (key && characterData[key]) {
                if (isCharacterUnlocked(key)) {
                    availableCharacters.push(key);
                    
                    characterElement.src = characterData[key].portrait;
                    characterElement.alt = `Player ${key}`;
                    
                    characterElement.addEventListener("mouseenter", () => {
                        playHoverSound();
                    });
                    
                    characterElement.addEventListener("click", (e) => {
                        if (!isCharacterUnlocked(key)) {
                            e.preventDefault();
                            e.stopPropagation();
                            this.playLockedSound();
                            this.showLockMessage(key);
                            return false;
                        }
                        
                        this.playSelectionSoundEffect();
                        
                        const clickedHeroNumber = parseInt(this.getKeyByValue(this.characterOrder, key));
                        if (isNaN(clickedHeroNumber)) return;
                        
                        if (clickedHeroNumber < this.currentCharacterNumber) {
                            this.currentCharacterNumber = clickedHeroNumber;
                            this.updateHeroInfo();
                            this.animateLeft();
                        } else if (clickedHeroNumber > this.currentCharacterNumber) {
                            this.currentCharacterNumber = clickedHeroNumber;
                            this.updateHeroInfo();
                            this.animateRight();
                        }
                    });
                } else {
                    this.applyLockedStyles(characterElement, key);
                }
            }
        });

        this.characterOrder = {};
        availableCharacters.forEach((key, index) => {
            this.characterOrder[index + 1] = key;
        });

        if (availableCharacters.length === 0) return;

        this.currentCharacterNumber = 1;
        this.updateHeroInfo();
    }

    changeCharacterImage(direction) {
        const maxCharacters = Object.keys(this.characterOrder).length;
        if (maxCharacters === 0) return;
        
        if (direction === "ArrowRight") {
            this.currentCharacterNumber = (this.currentCharacterNumber % maxCharacters) + 1;
        } else if (direction === "ArrowLeft") {
            this.currentCharacterNumber = this.currentCharacterNumber === 1 ? maxCharacters : this.currentCharacterNumber - 1;
        }
        
        this.playSelectionSoundEffect();
        this.updateHeroInfo();
    }

    animateLeft() {
        if (this.elements.characterContainer) {
            this.elements.characterContainer.classList.remove('character--animate-right');
            this.elements.characterContainer.classList.add('character--animate-left');
            setTimeout(() => {
                this.elements.characterContainer.classList.remove('character--animate-left');
            }, 250);
        }
    }

    animateRight() {
        if (this.elements.characterContainer) {
            this.elements.characterContainer.classList.remove('character--animate-left');
            this.elements.characterContainer.classList.add('character--animate-right');
            setTimeout(() => {
                this.elements.characterContainer.classList.remove('character--animate-right');
            }, 250);
        }
    }

    setupKeyboardNavigation() {
        document.addEventListener("keydown", event => {
            if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
                this.changeCharacterImage(event.key);
                if (event.key === "ArrowRight") {
                    this.animateRight();
                } else if (event.key === "ArrowLeft") {
                    this.animateLeft();
                }
            }
        });
    }
}

const characterSelector = new CharacterSelector();

if (document.readyState === 'loading') {
    document.addEventListener("DOMContentLoaded", () => {
        characterSelector.init();
        characterSelector.setupKeyboardNavigation();
    });
} else {
    setTimeout(() => {
        characterSelector.init();
        characterSelector.setupKeyboardNavigation();
    }, 100);
}

setTimeout(() => {
    characterSelector.init();
    characterSelector.setupKeyboardNavigation();
}, 500);

export { characterData, isCharacterUnlocked, LOCKED_CHARACTERS, characterSelector };