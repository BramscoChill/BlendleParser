const _ = require('lodash');
const ApplicationState = require('instances/application_state');

const PopoverElementMixin = {
  getInitialState() {
    return {
      inElement: false,
      inPopover: false,
    };
  },
  enterElement(e) {
    // Chrome on old Android devices trigger mouse enter, prevent it!
    if (e && window.BrowserDetect.device === 'Android') return;
    if (e && window.BrowserDetect.device === 'Windows Phone') return;

    this.setPositionInElement(e);
  },

  leaveElement(e) {
    // Chrome on old Android devices trigger mouse enter, prevent it!
    if (e && window.BrowserDetect.device === 'Android') return;
    if (e && window.BrowserDetect.device === 'Windows Phone') return;

    this.determinePopover({ inElement: false });
  },

  enterPopover(e) {
    // Chrome on old Android devices trigger mouse enter, prevent it!
    if (e && window.BrowserDetect.device === 'Android') return;
    if (e && window.BrowserDetect.device === 'Windows Phone') return;

    this.determinePopover({ inPopover: true, inElement: false });
  },

  leavePopover(e) {
    // Chrome on old Android devices trigger mouse enter, prevent it!
    if (e && window.BrowserDetect.device === 'Android') return;
    if (e && window.BrowserDetect.device === 'Windows Phone') return;

    // On next tick because leave of the element is triggered before enter of the popover
    setTimeout(() => this.determinePopover({ inPopover: false }));
  },

  closePopover() {
    this.determinePopover({ inElement: false, inPopover: false });
  },

  onElementClick(e, shouldPreventDefault = true) {
    if (this.props.disabled) {
      e.preventDefault();

      return;
    }

    if (!this.state.popover) {
      if (shouldPreventDefault) {
        e.preventDefault();
      }

      this.setPositionInElement(e);

      return;
    }

    setTimeout(() => this.determinePopover({ inElement: false }));
  },

  setPositionInElement(e) {
    this.determinePopover({ inElement: true, x: e.clientX, y: e.clientY });
  },

  determinePopover(newState) {
    if (this.props.disabled) return;

    const state = _.defaults(newState, this.state);

    if (state.inElement || state.inPopover) {
      state.popover = true;
      this.onPopoverOpen && this.onPopoverOpen();
    }

    if (!state.inPopover && !state.inElement) {
      state.popover = false;
      this.onPopoverClose && this.onPopoverClose();
    }

    this.setState(state);
  },
};

module.exports = PopoverElementMixin;



// WEBPACK FOOTER //
// ./src/js/app/components/mixins/PopoverElementMixin.js