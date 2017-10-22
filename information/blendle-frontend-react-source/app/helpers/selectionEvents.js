import Analytics from 'instances/analytics';

export function getSelection() {
  if (window.getSelection) {
    return window.getSelection().toString();
  } else if (document.getSelection) {
    return document.getSelection().toString();
  } else if (document.selection) {
    return document.selection.createRange().text;
  }

  return '';
}

export function hasSelectedAll(itemWordLength) {
  const selection = getSelection();
  const selectedWords = selection.split(/\W+/).length;

  if (!selection.length) {
    return false;
  }

  Analytics.track('Select Words', {
    selected: selectedWords,
    all: itemWordLength,
  });

  if (selectedWords >= itemWordLength) {
    Analytics.track('Select All');

    return true;
  }

  return false;
}



// WEBPACK FOOTER //
// ./src/js/app/helpers/selectionEvents.js