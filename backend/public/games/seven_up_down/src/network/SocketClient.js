class SocketClient {
  constructor() {
    this.socket = null;
    this.connected = false;
  }

  connect() {
    if (typeof window !== 'undefined' && window.io) {
      this.socket = window.io();
      this.socket.on('connect', () => {
        this.connected = true;
        console.log('[7 Up Down Real-time Socket Connected]');
      });
      this.socket.on('disconnect', () => {
        this.connected = false;
      });
    }
  }

  emit(event, data) {
    if (this.socket && this.connected) {
      this.socket.emit(event, data);
    }
  }

  on(event, callback) {
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }
}

export const socketClient = new SocketClient();
