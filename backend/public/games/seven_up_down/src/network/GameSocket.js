import { socketClient } from './SocketClient.js';
import { eventBus } from '../core/EventBus.js';

class GameSocket {
  init() {
    socketClient.connect();
    socketClient.on('ROUND_SYNC', (data) => {
      eventBus.emit('ROUND_SYNC', data);
    });
    socketClient.on('BET_BROADCAST', (data) => {
      eventBus.emit('BET_BROADCAST', data);
    });
  }
}

export const gameSocket = new GameSocket();
