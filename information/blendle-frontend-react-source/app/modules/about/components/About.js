import React from 'react';
import { translate, translateElement } from 'instances/i18n';

export default () => (
  <div className="pane contact l-text">
    <h1 className="title">{translate('about.about.navigation')}</h1>
    <p>
      {translateElement('app.text.about_blendle')}
      <br />
      <br />
      {translateElement('about.impressum', false)}
      <br />
      {translate('about.managing_directors')}
    </p>
  </div>
);



// WEBPACK FOOTER //
// ./src/js/app/modules/about/components/About.js