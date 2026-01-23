class PageManager {
  constructor() {
    this.pageType = null;
    this.initialized = false;
    this.keyboardHandlersSetup = false;
  }

  init() {
    if (this.initialized) return;
    
    this.pageType = this.getPageType();
    
    switch (this.pageType) {
      case 'selection':
        this.setupSelectionPage();
        break;
      case 'fight':
        this.setupFightPage();
        break;
      case 'main':
        this.setupMainPage();
        break;
      case 'auth':
        this.setupAuthPage();
        break;
      default:
        this.setupDefaultPage();
    }
    
    this.setupGlobalKeyboardShortcuts();
    this.setupCleanup();
    this.initialized = true;
  }

  getPageType() {
    const url = window.location.pathname;
    const fileName = url.split('/').pop() || 'index.html';
    
    if (fileName.includes('auth') || document.getElementById('authForm')) {
      return 'auth';
    } else if (fileName.includes('fight') || document.getElementById('battleArena')) {
      return 'fight';
    } else if (fileName.includes('selection') || document.querySelector('.character-selector')) {
      return 'selection';
    } else if (fileName.includes('index') || document.querySelector('.main__sound-icon')) {
      return 'main';
    }
    
    return 'unknown';
  }

  setupSelectionPage() {
    this.waitForModules(['audioManager'], () => {
      this.setupSelectionKeyboard();
    });
  }

  setupSelectionKeyboard() {
    if (this.keyboardHandlersSetup) return;
    
    const keyboardHandler = (event) => {
      if (event.key === ' ' || event.key === 'Spacebar') {
        event.preventDefault();
        if (window.audioManager) {
          window.audioManager.toggleBackgroundMusic();
        }
      }
      
      if (event.key === 'Enter') {
        event.preventDefault();
        window.playClickSound?.();
        const continueBtn = document.getElementById('continue-btn');
        if (continueBtn) continueBtn.click();
      }
    };

    document.addEventListener('keydown', keyboardHandler);
    this.keyboardHandlersSetup = true;
  }

  setupFightPage() {
    this.waitForModules(['audioManager', 'popupManager'], () => {
      this.setupFightKeyboard();
    });
  }

  setupFightKeyboard() {
    if (this.keyboardHandlersSetup) return;
    
    const keyboardHandler = (event) => {
      if (event.key === ' ' || event.key === 'Spacebar') {
        event.preventDefault();
        if (window.audioManager) window.audioManager.toggleBackgroundMusic();
      }
      
      if (event.key === 'Enter') {
        event.preventDefault();
        const attackBtn = document.getElementById('attackButton');
        if (attackBtn && !attackBtn.disabled) {
          window.playClickSound?.();
          attackBtn.click();
        }
      }
      
      if (event.key === 'Escape') {
        if (window.popupManager) window.popupManager.closeAll();
      }
    };

    document.addEventListener('keydown', keyboardHandler);
    this.keyboardHandlersSetup = true;
  }

  setupMainPage() {
    this.waitForModules(['audioManager'], () => {
      this.setupMainKeyboard();
    });
  }

  setupMainKeyboard() {
    if (this.keyboardHandlersSetup) return;
    
    const keyboardHandler = (event) => {
      if (event.key === ' ' || event.key === 'Spacebar') {
        event.preventDefault();
        const soundBtn = document.getElementById('soundBtn');
        if (soundBtn) soundBtn.click();
        else if (window.audioManager) window.audioManager.toggleBackgroundMusic();
      }
    };

    document.addEventListener('keydown', keyboardHandler);
    this.keyboardHandlersSetup = true;
  }

  setupAuthPage() {}
  setupDefaultPage() {}

  setupGlobalKeyboardShortcuts() {
    document.addEventListener('keydown', (event) => {
      if (event.ctrlKey && event.key === 'm') {
        event.preventDefault();
        if (window.audioManager) window.audioManager.toggleBackgroundMusic();
      }
    });
  }

  setupCleanup() {
    window.addEventListener('beforeunload', () => {
      if (this.pageType === 'fight' && window.profileManager) {
        try { window.profileManager.saveBattleLogs(); } catch {}
      }
      if (window.audioManager?.destroy) window.audioManager.destroy();
    });
  }

  waitForModules(moduleNames, callback) {
    const checkInterval = 100;
    const maxWait = 5000;
    let waited = 0;
    
    const check = () => {
      const allLoaded = moduleNames.every(name => window[name]);
      if (allLoaded) callback();
      else {
        waited += checkInterval;
        if (waited >= maxWait) callback();
        else setTimeout(check, checkInterval);
      }
    };
    
    check();
  }
}

const pageManager = new PageManager();

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => pageManager.init());
} else {
  setTimeout(() => pageManager.init(), 50);
}

window.pageManager = pageManager;

export { pageManager, PageManager };

export function getPageType() { return pageManager.getPageType(); }
export function setupSelectionPage() { pageManager.setupSelectionPage(); }
export function setupFightPage() { pageManager.setupFightPage(); }
export function setupMainPage() { pageManager.setupMainPage(); }