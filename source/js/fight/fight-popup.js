import { getPlayerData } from '../player/player-data.js';

class PopupManager {
  constructor() {
    this.activePopup = null;
    this.isMuted = false;
    this.wasPlaying = false;
    this.init();
  }

  init() {
    this.setupMusicPopup();
    this.setupProfilePopup();
    this.setupCloseEvents();
    this.setupVolumeControl();
    this.setupMusicControls();
  }

  setupMusicPopup() {
    const musicBtn = document.querySelector('.nav-fight__item:first-child');
    const musicPopup = document.getElementById('musicPopup');
    
    if (musicBtn && musicPopup) {
      musicBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.toggle(musicPopup);
      });
    }
  }

  setupProfilePopup() {
    const profileBtn = document.getElementById('settingsBtn');
    const profilePopup = document.getElementById('profilePopup');
    
    if (profileBtn && profilePopup) {
      profileBtn.replaceWith(profileBtn.cloneNode(true));
      const newProfileBtn = document.getElementById('settingsBtn');
      
      newProfileBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (window.profileManager) {
          window.profileManager.loadProfile();
          window.profileManager.updateAllDisplays();
        }
        this.toggle(profilePopup);
      });
    }
  }

  setupCloseEvents() {
    const closeButtons = document.querySelectorAll('.popup__close');
    closeButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.closeAll();
      });
    });

    document.addEventListener('click', (e) => {
      if (this.activePopup && !this.activePopup.contains(e.target)) {
        const isProfileBtn = e.target.closest('#settingsBtn');
        const isMusicBtn = e.target.closest('.nav-fight__item:first-child');
        
        if (!isProfileBtn && !isMusicBtn) {
          this.closeAll();
        }
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeAll();
      }
    });
  }

  setupVolumeControl() {
    const volumeSlider = document.getElementById('volumeSlider');
    const volumeDisplay = document.getElementById('volumeDisplay');
    
    if (volumeSlider && volumeDisplay) {
      volumeSlider.addEventListener('input', (e) => {
        const audio = document.getElementById('fight-music');
        if (audio) {
          const value = e.target.value;
          audio.volume = value / 100;
          volumeDisplay.textContent = `${value}%`;
          
          if (value > 0 && this.isMuted) {
            this.isMuted = false;
            audio.muted = false;
          }
          
          this.updateMusicControls();
        }
      });
    }
  }

  setupMusicControls() {
    const playBtn = document.getElementById('playBtn');
    const pauseBtn = document.getElementById('pauseBtn');
    const muteBtn = document.getElementById('muteBtn');
    const audio = document.getElementById('fight-music');

    if (playBtn) {
      playBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (audio) {
          this.isMuted = false;
          audio.muted = false;
          audio.play();
          this.setActiveButton('play');
          this.updateMusicControls();
        }
      });
    }

    if (pauseBtn) {
      pauseBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (audio) {
          audio.pause();
          this.setActiveButton('pause');
        }
      });
    }

    if (muteBtn) {
      muteBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (audio) {
          if (this.isMuted) {
            this.isMuted = false;
            audio.muted = false;
            if (this.wasPlaying) {
              audio.play();
              this.setActiveButton('play');
            } else {
              this.setActiveButton('pause');
            }
          } else {
            this.isMuted = true;
            audio.muted = true;
            this.wasPlaying = !audio.paused;
            audio.pause();
            this.setActiveButton('mute');
          }
          this.updateMusicControls();
        }
      });
    }
  }

  setActiveButton(type) {
    const buttons = document.querySelectorAll('.music-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    
    const activeBtn = document.getElementById(`${type}Btn`);
    if (activeBtn) {
      activeBtn.classList.add('active');
    }
  }

  updateMusicControls() {
    const muteBtn = document.getElementById('muteBtn');
    const audio = document.getElementById('fight-music');
    
    if (muteBtn) {
      if (this.isMuted) {
        this.setActiveButton('mute');
      } else {
        muteBtn.classList.remove('active');
        if (audio) {
          this.setActiveButton(audio.paused ? 'pause' : 'play');
        }
      }
    }
  }

  show(popup) {
    this.closeAll();
    popup.classList.add('show');
    this.activePopup = popup;
  }

  hide(popup) {
    popup.classList.remove('show');
    if (this.activePopup === popup) {
      this.activePopup = null;
    }
  }

  toggle(popup) {
    if (popup.classList.contains('show')) {
      this.hide(popup);
    } else {
      this.show(popup);
    }
  }

  closeAll() {
    const popups = document.querySelectorAll('.popup');
    popups.forEach(popup => this.hide(popup));
  }
}

class ProfileManager {
  constructor() {
    this.currentCharacter = '';
    this.playerName = '';
    this.playerNumber = '';
    this.gameHistory = [];
    this.wins = 0;
    this.losses = 0;
    this.init();
  }

  init() {
    this.setupButtons();
    this.loadProfile();
    this.loadGameHistory();
    this.updateAllDisplays();
    this.removeExistingNicknames();
  }

  setupButtons() {
    const changeCharacterBtn = document.querySelector('.profile__button:nth-child(1)');
    const changeNicknameBtn = document.querySelector('.profile__button:nth-child(2)');
    
    if (changeCharacterBtn) {
      changeCharacterBtn.addEventListener('click', () => this.goToSelection());
    }

    if (changeNicknameBtn) {
      changeNicknameBtn.addEventListener('click', () => this.toggleNicknameInput());
    }
  }

  saveGameResult(result, enemyKey, stats) {
    const entry = {
      result: result,
      enemy: enemyKey,
      stats: stats,
      timestamp: Date.now()
    };
    this.gameHistory.push(entry);
    if (result === 'victory') {
      this.wins += 1;
    } else {
      this.losses += 1;
    }
    this.saveGameHistory();
    this.updateGameHistoryDisplay();
  }

  loadGameHistory() {
    try {
      const savedHistory = localStorage.getItem('gameHistory');
      this.gameHistory = savedHistory ? JSON.parse(savedHistory) : [];
      this.wins = this.gameHistory.filter(entry => entry.result === 'victory').length;
      this.losses = this.gameHistory.filter(entry => entry.result === 'defeat').length;
    } catch {
      this.gameHistory = [];
      this.wins = 0;
      this.losses = 0;
    }
    this.updateGameHistoryDisplay();
  }

  saveGameHistory() {
    try {
      localStorage.setItem('gameHistory', JSON.stringify(this.gameHistory));
    } catch {}
  }

  updateGameHistoryDisplay() {
    let historyContainer = document.getElementById('gameHistory');
    const profilePopup = document.getElementById('profilePopup');

    if (!historyContainer && profilePopup) {
      historyContainer = document.createElement('div');
      historyContainer.id = 'gameHistory';
      historyContainer.className = 'profile__history';
      historyContainer.innerHTML = '<h3>Game History</h3><div id="historyStats"></div>';
      profilePopup.appendChild(historyContainer);
    }

    const historyStats = document.getElementById('historyStats');
    if (historyStats) {
      historyStats.innerHTML = `Win: ${this.wins} | Lose: ${this.losses}`;
    }
  }

  toggleNicknameInput() {
    const container = document.querySelector('.profile__setting');
    let input = container.querySelector('.nickname-input');
    
    if (input) {
      container.removeChild(input);
      return;
    }

    input = document.createElement('div');
    input.className = 'nickname-input';
    input.innerHTML = `
      <input type="text" class="nickname-field" placeholder="Enter new name" value="${this.playerName}">
      <button class="nickname-save">Save</button>
      <button class="nickname-cancel">Cancel</button>
    `;
    
    container.appendChild(input);

    const field = input.querySelector('.nickname-field');
    const saveBtn = input.querySelector('.nickname-save');
    const cancelBtn = input.querySelector('.nickname-cancel');

    field.focus();
    field.select();

    saveBtn.addEventListener('click', () => {
      this.saveNickname(field.value);
      container.removeChild(input);
    });

    cancelBtn.addEventListener('click', () => {
      container.removeChild(input);
    });

    field.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        this.saveNickname(field.value);
        container.removeChild(input);
      }
      if (e.key === 'Escape') {
        container.removeChild(input);
      }
    });
  }

  saveNickname(newName) {
    if (!newName.trim()) return;
    
    if (window.nicknameDisplay) {
      const success = window.nicknameDisplay.changeNickname(newName);
      if (success) {
        this.showNotification('Nickname updated!');
      }
    } else {
      this.playerName = newName.trim();
      localStorage.setItem('username', this.playerName);
      this.updateProfileDisplay();
      this.updateAvatarDisplay();
      this.removeExistingNicknames();
      this.updateGameHistoryDisplay();
      
      this.showNotification('Nickname updated!');
    }
  }

  updateAllDisplays() {
    this.updateProfileDisplay();
    this.removeExistingNicknames();
    this.updateAvatarDisplay();
    this.updateGameHistoryDisplay();
  }

  updateProfileDisplay() {
    const nameEl = document.getElementById('profileName');
    const numberEl = document.getElementById('playerNumber');
    
    if (nameEl) {
      nameEl.textContent = this.playerName || 'Player';
    }
    
    if (numberEl) {
      const selectedCharacter = localStorage.getItem('selectedCharacter') || '456';
      numberEl.textContent = `Player ${selectedCharacter}`;
    }
  }

  removeExistingNicknames() {
    const existingNicknames = document.querySelectorAll('.user-nickname, #user-nickname');
    existingNicknames.forEach(el => {
      el.remove();
    });
    
    const navItems = document.querySelectorAll('.nav-fight__item, .header-fight__actions');
    navItems.forEach(item => {
      const nicknames = item.querySelectorAll('.user-nickname, #user-nickname');
      nicknames.forEach(nick => nick.remove());
    });
  }

  updateAvatarDisplay() {
    const profileAvatar = document.getElementById('profileAvatar');
    const userAvatar = document.querySelector('.user-avatar');
    
    if (profileAvatar && userAvatar) {
      const computedStyle = window.getComputedStyle(userAvatar);
      profileAvatar.style.backgroundImage = computedStyle.backgroundImage;
      profileAvatar.style.backgroundSize = computedStyle.backgroundSize || 'cover';
      profileAvatar.style.backgroundPosition = computedStyle.backgroundPosition || 'center';
      
      if (!profileAvatar.style.backgroundImage || profileAvatar.style.backgroundImage === 'none') {
        profileAvatar.style.background = `
          linear-gradient(45deg, #333 25%, transparent 25%),
          linear-gradient(-45deg, #333 25%, transparent 25%),
          linear-gradient(45deg, transparent 75%, #333 75%),
          linear-gradient(-45deg, transparent 75%, #333 75%),
          #2a2a2a
        `;
        profileAvatar.style.backgroundSize = '4px 4px, 4px 4px, 4px 4px, 4px 4px, 8px 8px';
      }
    }
  }

  loadProfile() {
    try {
      this.playerName = localStorage.getItem('username') || 'Player';
      const selectedCharacter = localStorage.getItem('selectedCharacter') || '456';
      this.playerNumber = `Player ${selectedCharacter}`;
      this.currentCharacter = selectedCharacter;
    } catch {
      this.playerName = 'Player';
      this.playerNumber = 'Player 456';
    }
  }

  goToSelection() {
    this.saveBattleLogs();
    this.showProgress();
    setTimeout(() => {
      window.location.href = 'selection_hero.html';
    }, 1500);
  }

  saveBattleLogs() {
    const battleLogs = this.getBattleLogs();
    const gameState = {
      round: document.getElementById('roundInfo')?.textContent || 'Round 1',
      playerHealth: document.getElementById('playerHealthText')?.textContent || '200 / 200',
      enemyHealth: document.getElementById('enemyHealthText')?.textContent || '100 / 100',
      battleLogs: battleLogs,
      timestamp: Date.now()
    };
    
    try {
      localStorage.setItem('battleState', JSON.stringify(gameState));
    } catch {}
  }

  getBattleLogs() {
    const logs = [];
    const logElements = document.querySelectorAll('.logs');
    
    logElements.forEach(log => {
      const turn = log.querySelector('.logs__turn')?.textContent || '';
      const actions = [];
      log.querySelectorAll('.logs__action').forEach(action => {
        actions.push(action.textContent);
      });
      logs.push({ turn, actions });
    });
    
    return logs;
  }

  showProgress() {
    const progress = document.createElement('div');
    progress.className = 'progress-modal show';
    progress.innerHTML = `
      <div class="progress-content">
        <div class="progress-icon">💾</div>
        <div>Saving battle logs...</div>
        <div class="progress-sub">Redirecting to character selection</div>
      </div>
    `;
    
    document.body.appendChild(progress);
  }

  showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification show';
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 2000);
  }
}

function removeAllNicknames() {
  const existingNicknames = document.querySelectorAll('.user-nickname, #user-nickname');
  existingNicknames.forEach(el => {
    el.remove();
  });
}

function initPopupSystem() {
  if (window.nicknameDisplay) {
    window.nicknameDisplay.init();
  }
  
  removeAllNicknames();
  
  const popupManager = new PopupManager();
  const profileManager = new ProfileManager();

  window.popupManager = popupManager;
  window.profileManager = profileManager;
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPopupSystem);
} else {
  initPopupSystem();
}

export { PopupManager, ProfileManager };