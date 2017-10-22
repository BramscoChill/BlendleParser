import stripTags from 'underscore.string/stripTags';
import { unescape } from 'lodash';

const titleElementTypes = ['hl1', 'hl2'];
const introElementTypes = ['intro', 'lead', 'paragraph', 'p'];
const averageWordsPerMinute = 275;

export function getTitle(manifestBody) {
  return manifestBody.find(bodySection => titleElementTypes.includes(bodySection.type)).content;
}

export function getByLine(manifestBody) {
  const byLine = manifestBody.find(bodySection => bodySection.type === 'byline');
  return byLine ? byLine.content : '';
}

export function getWordCount(manifestBody) {
  return manifestBody.length.words;
}

export function getReadingTime(manifestLength) {
  return Math.ceil(manifestLength.words / averageWordsPerMinute);
}

export function getContentAsText(contentSection) {
  return unescape(stripTags(contentSection)).trim();
}

export function getIntro(manifestBody) {
  const intro = manifestBody.find(bodySection => introElementTypes.includes(bodySection.type));
  return intro ? intro.content : '';
}

export function getManifestBody(manifest) {
  // For non backbone-model manifest types
  if (manifest.body) {
    return manifest.body;
  }

  if (manifest.get('format_version') >= 4) {
    return manifest.get('body');
  }

  return [
    { type: 'kicker', content: this.get('kicker') },
    { type: 'head', content: this.get('head') },
    { type: 'byline', content: this.get('byline') },
    { type: 'dateline', content: this.get('dateline') },
    { type: 'intro', content: this.get('intro') },
    { type: 'lead', content: this.get('lead') },
  ];
}



// WEBPACK FOOTER //
// ./src/js/app/helpers/manifest.js