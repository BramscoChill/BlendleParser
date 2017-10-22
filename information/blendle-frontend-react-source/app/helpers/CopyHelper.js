import axios from 'axios';
import getRevisionedFile from 'helpers/getRevisionedFile';
import { get } from 'lodash';

/**
 * The CopyHelper is a class which helps our copywriters improve the copy. It records all used
 * translation ID's and can export these along with their translations.
 */
export default class CopyHelper {
  constructor(isEnabled) {
    this._isEnabled = isEnabled;
    this._ids = [];
  }

  addId(id) {
    if (!this._isEnabled) {
      return;
    }

    if (!this._ids.includes(id)) {
      this._ids.push(id);
    }
  }

  getLocales() {
    if (this._locales) {
      return Promise.resolve(this._locales);
    }

    return Promise.all([
      axios.get(`/${getRevisionedFile('locales/nl_NL.json')}`),
      axios.get(`/${getRevisionedFile('locales/en_US.json')}`),
      axios.get(`/${getRevisionedFile('locales/de_DE.json')}`),
    ]).then(([nlNL, enUS, deDE]) => {
      this._locales = {
        nl_NL: nlNL.data,
        en_US: enUS.data,
        de_DE: deDE.data,
      };

      return this._locales;
    });
  }

  printReport() {
    this.getLocales().then((locales) => {
      const report = this._ids
        .map(
          id => `
            <tr>
              <td>${id}</td>
              <td>${get(locales.nl_NL, id)}</td>
              <td>${get(locales.en_US, id)}</td>
              <td>${get(locales.de_DE, id)}</td>
            </tr>`,
        )
        .join('');

      window.open().document.write(`<table>${report}</table>`);
    });
  }
}



// WEBPACK FOOTER //
// ./src/js/app/helpers/CopyHelper.js