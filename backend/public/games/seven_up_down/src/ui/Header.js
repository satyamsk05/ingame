import { soundManager } from '../core/SoundManager.js';

export class Header {
  constructor(el) {
    this.el = el;
    this.render();
  }

  render() {
    if (!this.el) return;
    this.el.innerHTML = '';
  }

  bindEvents() {
    const btnBack = this.el.querySelector('#btnBack');
    if (btnBack) {
      btnBack.addEventListener('click', () => {
        soundManager.playClick();
        window.history.back();
      });
    }

    const btnSoundToggle = this.el.querySelector('#btnSoundToggle');
    if (btnSoundToggle) {
      btnSoundToggle.addEventListener('click', () => {
        const enabled = soundManager.toggle();
        if (enabled) {
          btnSoundToggle.classList.add('sound-toggle-active');
        } else {
          btnSoundToggle.classList.remove('sound-toggle-active');
        }
        soundManager.playClick();
      });
    }
  }
}
