// NOTE: to use this plugin, you have to use the PopoverElementMixin as well

export default {
  debouncedEnterElement(e) {
    clearTimeout(this._hideManifestTimeout);
    clearTimeout(this._showManifestTimeout);

    const clientX = Number(e.clientX);
    const clientY = Number(e.clientY);

    this._showManifestTimeout = setTimeout(() => {
      this.enterElement({ clientX, clientY });
    }, 150);
  },

  debouncedMoveElement(e) {
    clearTimeout(this._hideManifestTimeout);
    clearTimeout(this._showManifestTimeout);

    // Android and possibly WP trigger an extra mouse move event
    if (e && window.BrowserDetect.device === 'Android') return;
    if (e && window.BrowserDetect.device === 'Windows Phone') return;

    // Store coordinates because the event is cleared by the time the timeout is done
    const clientX = Number(e.clientX);
    const clientY = Number(e.clientY);

    this._showManifestTimeout = setTimeout(() => {
      this.enterElement({ clientX, clientY });
    }, 150);
  },

  debouncedLeaveElement(e) {
    clearTimeout(this._hideManifestTimeout);
    clearTimeout(this._showManifestTimeout);

    this.setState({ inElement: false });
    this._hideManifestTimeout = setTimeout(() => this.leaveElement(e), 300);
  },
};



// WEBPACK FOOTER //
// ./src/js/app/components/mixins/DebouncedPopoverElementMixin.js