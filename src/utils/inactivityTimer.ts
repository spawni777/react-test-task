import cfg from '@/cfg';

export class InactivityTimer {
  inactivityTimer: ReturnType<typeof setTimeout>;
  thresholdTime: number;
  cb: () => void;

  constructor(cb, thresholdTime: number = cfg.userInactiveThresholdTime) {
    this.thresholdTime = thresholdTime;
    this.cb = cb;

    // Bind the event handlers to the class instance
    this.stop = this.stop.bind(this);
    this.start = this.start.bind(this);
    this.reset = this.reset.bind(this);
  }

  stop() {
    clearTimeout(this.inactivityTimer);

    window.removeEventListener('mousemove', this.reset);
    window.removeEventListener('keydown', this.reset);
  }

  start() {
    this.stop();

    this.inactivityTimer = setTimeout(() => {
      this.stop();
      this.cb();
    }, this.thresholdTime);

    window.addEventListener('mousemove', this.reset);
    window.addEventListener('keydown', this.reset);
  }

  reset() {
    this.start();
  }
}
