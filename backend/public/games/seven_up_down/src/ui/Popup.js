import { eventBus } from '../core/EventBus.js';
import { gameState } from '../game/GameState.js';
import { soundManager } from '../core/SoundManager.js';
import { CHIP_GRADIENTS } from '../config/constants.js';
import { formatCurrency } from '../utils/formatter.js';

export class Popup {
  constructor(winToastEl, chipPopupEl, mainChipFaceEl, mainChipBtnEl) {
    this.winToastEl = winToastEl;
    this.chipPopupEl = chipPopupEl;
    this.mainChipFaceEl = mainChipFaceEl;
    this.mainChipBtnEl = mainChipBtnEl;
    this.init();
  }

  init() {
    eventBus.on('WIN_OCCURRED', ({ winAmount }) => {
      this.showWinToast(winAmount);
    });

    if (this.mainChipBtnEl) {
      this.mainChipBtnEl.addEventListener('click', (e) => {
        e.stopPropagation();
        soundManager.playClick();
        if (this.chipPopupEl) {
          this.chipPopupEl.classList.toggle('active');
        }
      });
    }

    if (this.chipPopupEl) {
      const popChips = this.chipPopupEl.querySelectorAll('.pop-chip');
      popChips.forEach(chip => {
        chip.addEventListener('click', () => {
          const val = parseInt(chip.getAttribute('data-val'), 10);
          if (val) {
            soundManager.playClick();
            const color = CHIP_GRADIENTS[val] || '#00e676';
            gameState.setSelectedChip(val, color);
            this.chipPopupEl.classList.remove('active');
          }
        });
      });
    }

    // Close chip popup on outside click
    document.addEventListener('click', (e) => {
      if (this.chipPopupEl && !this.chipPopupEl.contains(e.target) && this.mainChipBtnEl && !this.mainChipBtnEl.contains(e.target)) {
        this.chipPopupEl.classList.remove('active');
      }
    });

    eventBus.on('CHIP_CHANGED', ({ value, color }) => {
      if (this.mainChipFaceEl) {
        this.mainChipFaceEl.innerText = value >= 1000 ? `${value / 1000}K` : value;
        this.mainChipFaceEl.style.background = `radial-gradient(circle at 35% 35%, ${color} 0%, #000 100%)`;
      }
    });
  }

  showWinToast(winAmount) {
    if (!this.winToastEl) return;
    this.winToastEl.innerText = `🎉 YOU WON ${formatCurrency(winAmount)}!`;
    this.winToastEl.classList.add('show');
    setTimeout(() => {
      this.winToastEl.classList.remove('show');
    }, 2500);
  }
}
