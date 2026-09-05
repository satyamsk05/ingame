import { eventBus } from '../core/EventBus.js';

export class Timer {
  constructor(timerTextEl, timerProgressEl) {
    this.timerTextEl = timerTextEl;
    this.timerProgressEl = timerProgressEl;
    this.circleMaxOffset = 188;
    this.init();
  }

  init() {
    eventBus.on('TIMER_TICK', ({ timeLeft, max }) => {
      if (this.timerTextEl) {
        this.timerTextEl.innerText = timeLeft;
      }
      if (this.timerProgressEl) {
        const offset = this.circleMaxOffset - (timeLeft / max) * this.circleMaxOffset;
        this.timerProgressEl.style.strokeDashoffset = offset;
      }
    });

    eventBus.on('DICE_ROLL_START', () => {
      if (this.timerTextEl) {
        this.timerTextEl.innerText = '🎲';
      }
    });
  }
}
