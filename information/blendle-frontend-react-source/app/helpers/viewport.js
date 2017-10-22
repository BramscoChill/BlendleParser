// CSS breakpoints form vars.scss
export const breakSmall = 600;
export const breakTablet = 768;
export const breakLarge = 1025;

export function getViewportDimensions() {
  return {
    width: window.innerWidth,
    height: window.innerHeight,
  };
}

export const isMobileBreakpoint = () => window.innerWidth <= breakSmall;
export const isTabletBreakpoint = () => window.innerWidth <= breakTablet;

export function elementTopScrollPosition(element) {
  return Math.floor(element.getBoundingClientRect().top);
}

export function isElementInViewport(element, viewportHeight) {
  const elementTop = elementTopScrollPosition(element);

  return elementTop <= viewportHeight && elementTop >= viewportHeight * -1;
}



// WEBPACK FOOTER //
// ./src/js/app/helpers/viewport.js