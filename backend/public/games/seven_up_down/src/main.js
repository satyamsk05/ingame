import { Game } from './core/Game.js';
import { gameEngine } from './game/GameEngine.js';
import { gameSocket } from './network/GameSocket.js';
import { Header } from './ui/Header.js';
import { Balance } from './ui/Balance.js';
import { BettingPanel } from './ui/BettingPanel.js';
import { DiceView } from './ui/DiceView.js';
import { Timer } from './ui/Timer.js';
import { HistoryPanel } from './ui/HistoryPanel.js';
import { PlayersPanel } from './ui/PlayersPanel.js';
import { Popup } from './ui/Popup.js';
import { gameState } from './game/GameState.js';

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Core Game Engine
  const game = new Game();
  game.init();

  // Initialize UI Components
  const headerEl = document.getElementById('headerContainer');
  if (headerEl) new Header(headerEl);

  const balanceEl = document.getElementById('userBalanceText');
  if (balanceEl) new Balance(balanceEl);

  const mainBetsGridEl = document.getElementById('mainBetsGrid');
  const numBetsWrapEl = document.getElementById('numBetsWrap');
  if (mainBetsGridEl && numBetsWrapEl) new BettingPanel(mainBetsGridEl, numBetsWrapEl);

  const dice1El = document.getElementById('dice1');
  const dice2El = document.getElementById('dice2');
  if (dice1El && dice2El) new DiceView(dice1El, dice2El);

  const timerTextEl = document.getElementById('timerText');
  const timerProgressEl = document.getElementById('timerProgress');
  if (timerTextEl && timerProgressEl) new Timer(timerTextEl, timerProgressEl);

  const historyRibbonEl = document.getElementById('historyRibbon');
  if (historyRibbonEl) {
    const historyPanel = new HistoryPanel(historyRibbonEl);
    historyPanel.render(gameState.history);
  }

  const playersColEl = document.getElementById('playersCol');
  if (playersColEl) new PlayersPanel(playersColEl);

  const winToastEl = document.getElementById('winToast');
  const chipPopupEl = document.getElementById('chipRadialPopup');
  const mainChipFaceEl = document.getElementById('mainChipFace');
  const mainChipBtnEl = document.getElementById('mainChipBtn');
  new Popup(winToastEl, chipPopupEl, mainChipFaceEl, mainChipBtnEl);

  // Initialize Realtime Socket
  gameSocket.init();

  // Start Main Game Engine Loop
  gameEngine.init();
});
