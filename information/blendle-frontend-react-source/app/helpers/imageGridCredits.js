import { find } from 'lodash';

function createCreditsNode(credits) {
  const creditsEl = document.createElement('p');
  creditsEl.classList.add('item-credits');
  creditsEl.innerHTML = credits.join(' <strong>&middot;</strong> ');

  return creditsEl;
}

function getCreditsForGrid(grid, images, field) {
  return images.reduce((credits, image) => {
    const string = image[field] && image[field].trim();

    if (
      credits.indexOf(string) === -1 &&
      find(grid.patterns, { href: image.href }) &&
      string &&
      string.length
    ) {
      credits.push(string);
    }
    return credits;
  }, []);
}

export function appendCreditsToGridNode(grid, gridNode, images) {
  // Get the credits
  let credits = getCreditsForGrid(grid, images, 'credit');

  // If not a single credit is specified, check if we have captions
  if (!credits.length) {
    credits = getCreditsForGrid(grid, images, 'caption');
  }

  if (credits.length) {
    gridNode.appendChild(createCreditsNode(credits));
  }
}



// WEBPACK FOOTER //
// ./src/js/app/helpers/imageGridCredits.js