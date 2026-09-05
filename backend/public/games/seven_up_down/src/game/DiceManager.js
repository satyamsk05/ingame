import { getRandomDiceRoll } from '../utils/math.js';
import { soundManager } from '../core/SoundManager.js';
import { eventBus } from '../core/EventBus.js';

class DiceManager {
  rollDiceAnimation(callback) {
    soundManager.playDiceRoll();
    eventBus.emit('DICE_ROLL_START');

    setTimeout(() => {
      const result = getRandomDiceRoll();
      eventBus.emit('DICE_ROLL_END', result);
      if (callback) callback(result);
    }, 1500);
  }
}

export const diceManager = new DiceManager();
