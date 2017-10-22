import React, { Component } from 'react';
import { translate, translateElement } from 'instances/i18n';

export default class NoPins extends Component {
  render() {
    return (
      <div className="v-no-pins">
        <div className="no-pins">
          <div className="bookmark-large" />
          <div className="explaination">
            <h1>{translateElement('timeline.errors.no_pins.title', false)}</h1>
            <div
              dangerouslySetInnerHTML={{
                __html: translate('timeline.errors.no_pins.message'),
              }}
            />
          </div>
        </div>
      </div>
    );
  }
}



// WEBPACK FOOTER //
// ./src/js/app/modules/timeline/components/NoPins.js