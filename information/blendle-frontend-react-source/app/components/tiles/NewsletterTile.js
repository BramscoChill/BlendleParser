import React, { PureComponent } from 'react';
import Tile from 'components/Tile';
import { translate } from 'instances/i18n';

class NewsletterTile extends PureComponent {
  render() {
    return (
      <Tile type="explain-following">
        <div className="tile-explain">
          <div className="explanation">
            <h2>{translate('campaigns.newsletter.staffpick_explain')}</h2>
          </div>
        </div>
      </Tile>
    );
  }
}

export default NewsletterTile;



// WEBPACK FOOTER //
// ./src/js/app/components/tiles/NewsletterTile.js