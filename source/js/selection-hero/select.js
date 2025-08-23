import "../global/music";
import { getImagePath, preloadAllCharacterImages, discoverAllCharacters } from '../global/image.js';

const LOCKED_CHARACTERS = Object.freeze(['222', '333', '149', '007', '230']);

const isCharacterUnlocked = (characterId) => {
    return !LOCKED_CHARACTERS.includes(characterId);
};

let ALL_CHARACTER_IDS = [];

function updateCharacterList() {
    const discovered = discoverAllCharacters();
    if (discovered.length > 0) {
        ALL_CHARACTER_IDS = discovered;
    } else {
        ALL_CHARACTER_IDS = ['456', '390', '120', '388', '246', '222', '333', '149', '007', '230'];
    }
}

const characterData = {
    456: {
        playerName: "Seong Gi-hun",
        description: "The main protagonist of the series, a bankrupt driver and gambling addict who participates in the games to pay off his debts and provide for his daughter. After winning the first games, he returns driven by a desire to stop the cruel system and protect other participants.",
        get fullBody() { return getImagePath('456', 'fullBody'); },
        get portrait() { return getImagePath('456', 'portrait'); },
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
        get fullBody() { return getImagePath('390', 'fullBody'); },
        get portrait() { return getImagePath('390', 'portrait'); },
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
        get fullBody() { return getImagePath('120', 'fullBody'); },
        get portrait() { return getImagePath('120', 'portrait'); },
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
        get fullBody() { return getImagePath('388', 'fullBody'); },
        get portrait() { return getImagePath('388', 'portrait'); },
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
        get fullBody() { return getImagePath('246', 'fullBody'); },
        get portrait() { return getImagePath('246', 'portrait'); },
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
        get fullBody() { return getImagePath('222', 'fullBody'); },
        get portrait() { return getImagePath('222', 'portrait'); },
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
        get fullBody() { return getImagePath('333', 'fullBody'); },
        get portrait() { return getImagePath('333', 'portrait'); },
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
        get fullBody() { return getImagePath('149', 'fullBody'); },
        get portrait() { return getImagePath('149', 'portrait'); },
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
        get fullBody() { return getImagePath('007', 'fullBody'); },
        get portrait() { return getImagePath('007', 'portrait'); },
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
        get fullBody() { return getImagePath('230', 'fullBody'); },
        get portrait() { return getImagePath('230', 'portrait'); },
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
        this.imagesPreloaded = false;
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

    async preloadAllImages() {
        if (this.imagesPreloaded) return;

        try {
            updateCharacterList();
            await preloadAllCharacterImages(ALL_CHARACTER_IDS);
            this.imagesPreloaded = true;
        } catch (error) {
        }
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

        const fullBodySrc = character.fullBody;
        this.elements.mainCharacterImage.src = fullBodySrc;
        if (this.elements.shadowImage) this.elements.shadowImage.src = fullBodySrc;
        if (this.elements.blurImage) this.elements.blurImage.src = fullBodySrc;

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

        if (this.elements.background) {
            this.elements.background.style.transition = "background 0.4s ease";
            this.elements.background.style.background = `linear-gradient(${character.gradientDirection}, ${character.gradientColors[0]}, ${character.gradientColors[1]})`;
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
        const preloadPromise = this.preloadAllImages();
        const elementsPromise = this.waitForElements();

        const [characterImages] = await Promise.all([elementsPromise, preloadPromise]);
        
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

class CharacterSelectorManager {
    constructor() {
        this.initialized = false;
    }

    async init() {
        if (this.initialized) return;
        
        if (document.readyState === 'loading') {
            await new Promise(resolve => {
                document.addEventListener('DOMContentLoaded', resolve, { once: true });
            });
        }
        
        await characterSelector.init();
        characterSelector.setupKeyboardNavigation();
        
        this.initialized = true;
    }
}

const manager = new CharacterSelectorManager();
manager.init();

export { characterData, isCharacterUnlocked, LOCKED_CHARACTERS, characterSelector };