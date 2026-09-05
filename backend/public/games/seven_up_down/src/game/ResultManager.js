import { gameState } from './GameState.js';
import { soundManager } from '../core/SoundManager.js';
import { apiClient } from '../network/ApiClient.js';
import { eventBus } from '../core/EventBus.js';
import { GAME_ID } from '../config/constants.js';

class ResultManager {
  processResult(result) {
    const { total } = result;
    const bets = gameState.bets;
    let winAmt = 0;

    if (total >= 2 && total <= 6 && bets.down > 0) {
      winAmt += bets.down * 2;
    }
    if (total === 7 && bets.seven > 0) {
      winAmt += bets.seven * 5;
    }
    if (total >= 8 && total <= 12 && bets.up > 0) {
      winAmt += bets.up * 2;
    }
    if (bets.specific[total]) {
      winAmt += bets.specific[total] * 6;
    }

    gameState.addHistoryResult(total);

    if (winAmt > 0) {
      soundManager.playWin();
      gameState.setBalance(gameState.userBalance + winAmt);
      eventBus.emit('WIN_OCCURRED', { winAmount: winAmt });

      // Claim winnings to backend API
      apiClient.claimWinnings({
        score: total,
        prizeAmount: winAmt,
        diceResult: `Dice Roll: ${total}`,
        gameTitle: GAME_ID
      })
      .then(res => {
        if (res && res.data && res.data.totalBalance !== undefined) {
          gameState.setBalance(res.data.totalBalance);
          apiClient.notifyParentWallet(res.data.totalBalance);
        }
      })
      .catch(() => {});
    }
  }
}

export const resultManager = new ResultManager();
