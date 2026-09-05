import { gameState } from './GameState.js';
import { eventBus } from '../core/EventBus.js';
import { ROUND_DURATION } from '../config/constants.js';

class TimerManager {
  constructor() {
    this.intervalId = null;
  }

  startTimer(onTimerExpire) {
    this.stopTimer();
    gameState.roundTimeLeft = ROUND_DURATION;
    eventBus.emit('TIMER_TICK', { timeLeft: gameState.roundTimeLeft, max: ROUND_DURATION });

    this.intervalId = setInterval(() => {
      if (!gameState.isRolling) {
        gameState.roundTimeLeft--;
        eventBus.emit('TIMER_TICK', { timeLeft: gameState.roundTimeLeft, max: ROUND_DURATION });

        if (gameState.roundTimeLeft <= 0) {
          if (onTimerExpire) onTimerExpire();
        }
      }
    }, 1000);
  }

  stopTimer() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}

export const timerManager = new TimerManager();
