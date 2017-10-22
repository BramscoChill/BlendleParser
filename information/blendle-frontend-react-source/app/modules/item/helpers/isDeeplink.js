import * as sessionStorage from 'helpers/sessionStorage';

const STORAGE_KEY = 'deeplink-item-id';
const DIRECT_VISIT_CLASSNAME = 'direct-visit';

export function setDeeplink(itemId) {
  sessionStorage.setItem(STORAGE_KEY, itemId);
  document.body.classList.add(DIRECT_VISIT_CLASSNAME);
}

export function hasDirectVisitClass() {
  return document.body.classList.contains(DIRECT_VISIT_CLASSNAME);
}

export default function isDeeplink(itemId) {
  return hasDirectVisitClass() || sessionStorage.getItem(STORAGE_KEY) === itemId;
}

export function hasBeenOnDeeplink() {
  return !!sessionStorage.getItem(STORAGE_KEY);
}

export function getSessionItemId() {
  return sessionStorage.getItem(STORAGE_KEY);
}

export function removeDeeplink(itemId) {
  if (sessionStorage.getItem(STORAGE_KEY) === itemId) return;
  sessionStorage.removeItem(STORAGE_KEY);
  document.body.classList.remove(DIRECT_VISIT_CLASSNAME);
}



// WEBPACK FOOTER //
// ./src/js/app/modules/item/helpers/isDeeplink.js