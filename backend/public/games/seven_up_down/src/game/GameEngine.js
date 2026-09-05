import { gameState } from './GameState.js';
import { diceManager } from './DiceManager.js';
import { timerManager } from './TimerManager.js';
import { resultManager } from './ResultManager.js';
import { apiClient } from '../network/ApiClient.js';
import { gameConfig } from '../config/gameConfig.js';

class GameEngine {
  init() {
    this.fetchUserProfile();
    this.startRound();
  }

  fetchUserProfile() {
    apiClient.getUserProfile()
      .then(res => {
        if (res && res.data) {
          if (res.data.totalBalance !== undefined) {
            gameState.setBalance(res.data.totalBalance);
          }
          const name = res.data.username || res.data.phoneNumber || 'Player';
          const userNameEl = document.getElementById('userNameText');
          if (userNameEl) {
            userNameEl.innerText = name;
          }
        }
      })
      .catch(() => {});
  }

  startRound() {
    timerManager.startTimer(() => {
      this.executeRoll();
    });
  }

  executeRoll() {
    gameState.isRolling = true;
    gameState.lastRoundBet = gameState.totalBet;

    // Send single consolidated bet transaction for the entire round's total bet
    if (gameState.totalBet > 0) {
      const summaryParts = [];
      if (gameState.bets.down > 0) summaryParts.push(`2-6 DOWN (₹${gameState.bets.down})`);
      if (gameState.bets.seven > 0) summaryParts.push(`7 LUCKY (₹${gameState.bets.seven})`);
      if (gameState.bets.up > 0) summaryParts.push(`8-12 UP (₹${gameState.bets.up})`);
      for (const num in gameState.bets.specific) {
        if (gameState.bets.specific[num] > 0) {
          summaryParts.push(`NUM ${num} (₹${gameState.bets.specific[num]})`);
        }
      }

      const betSummary = summaryParts.length > 0 ? summaryParts.join(', ') : `Total Bet (₹${gameState.totalBet})`;

      apiClient.joinGame('7 Up Down', betSummary, gameState.totalBet)
        .then(res => {
          if (res && res.data && res.data.totalBalance !== undefined) {
            gameState.setBalance(res.data.totalBalance);
            apiClient.notifyParentWallet(res.data.totalBalance);
          }
        })
        .catch(() => {});
    }

    diceManager.rollDiceAnimation((result) => {
      resultManager.processResult(result);

      // Reset for next round after 3 seconds
      setTimeout(() => {
        gameState.resetRoundBets();
        gameState.isRolling = false;
        this.startRound();
      }, gameConfig.resetDelayMs);
    });
  }
}

export const gameEngine = new GameEngine();
