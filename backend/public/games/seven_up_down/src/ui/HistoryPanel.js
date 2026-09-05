import { eventBus } from '../core/EventBus.js';

export class HistoryPanel {
  constructor(ribbonEl) {
    this.ribbonEl = ribbonEl;
    this.init();
  }

  init() {
    eventBus.on('HISTORY_UPDATED', (historyList) => {
      this.render(historyList);
    });
  }

  render(historyList) {
    if (!this.ribbonEl) return;
    this.ribbonEl.innerHTML = '';
    historyList.forEach(total => {
      const badge = document.createElement('div');
      badge.className = 'badge-num ';
      if (total >= 2 && total <= 6) badge.className += 'badge-green';
      else if (total === 7) badge.className += 'badge-blue';
      else badge.className += 'badge-red';
      badge.innerText = total;

      this.ribbonEl.appendChild(badge);
    });
  }
}
