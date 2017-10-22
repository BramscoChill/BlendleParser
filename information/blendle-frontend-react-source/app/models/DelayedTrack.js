import Analytics from 'instances/analytics';

export default class DelayedTrack {
  constructor(eventName, eventPayload = {}, timeoutDuration = 0) {
    this.eventName = eventName;
    this.eventPayload = eventPayload;
    this.timeoutDuration = timeoutDuration;
  }

  startTimeout() {
    this.sendEventTimeout = setTimeout(() => {
      Analytics.track(this.eventName, this.eventPayload);
    }, this.timeoutDuration);
  }

  cancelTimeout() {
    clearTimeout(this.sendEventTimeout);
  }
}



// WEBPACK FOOTER //
// ./src/js/app/models/DelayedTrack.js