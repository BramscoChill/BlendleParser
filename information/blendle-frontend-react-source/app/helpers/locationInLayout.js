import { setItem, getItem, removeItem } from 'helpers/sessionStorage';

const LOCATION_IN_LAYOUT_KEY = 'LOCATION_IN_LAYOUT_KEY';
export function setLocationInLayout(locationInLayout) {
  return setItem(LOCATION_IN_LAYOUT_KEY, locationInLayout);
}

export function getLocationInLayout() {
  return getItem(LOCATION_IN_LAYOUT_KEY);
}

export function resetLocationInLayout() {
  return removeItem(LOCATION_IN_LAYOUT_KEY);
}



// WEBPACK FOOTER //
// ./src/js/app/helpers/locationInLayout.js