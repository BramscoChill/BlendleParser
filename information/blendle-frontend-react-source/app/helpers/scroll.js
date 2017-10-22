import Tweenable from 'shifty';

const OFFSET_KEYS = {
  y: 'scrollTop',
  x: 'scrollLeft',
};

function getScrollTarget(el) {
  if (el === window) {
    return document.querySelector('html');
  }
  return el;
}

export default {
  horizontal(el, to, options) {
    this.scroll('x', el, to, options);
  },
  vertical(el, to, options) {
    this.scroll('y', el, to, options);
  },
  scroll(axis, el, to, options = {}) {
    const target = getScrollTarget(el);
    const scrollTween = new Tweenable();
    const offsetKey = OFFSET_KEYS[axis];
    const from = target[offsetKey];

    scrollTween.tween({
      from: { [axis]: from },
      to: { [axis]: to },
      duration: options.duration || 250,
      easing: options.easing || 'easeOutQuad',
      step: (state) => {
        target[offsetKey] = state[axis];
      },
      start: options.start,
      finish: options.finish,
    });
  },
  verticalToId(id) {
    const element = document.getElementById(id);

    if (element) {
      const { top } = element.getBoundingClientRect();
      const scrollDistance = top - window.scrollY;
      const duration = Math.max(scrollDistance / 6, 500);

      this.vertical(document.body, top, { duration });
    }
  },
};



// WEBPACK FOOTER //
// ./src/js/app/helpers/scroll.js