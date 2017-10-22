import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Tile from 'components/Tile';
import PopularInIssue from 'modules/issue/components/PopularItemsInIssue';
import { providerById, prefillSelector } from 'selectors/providers';

class PopularInIssueTile extends PureComponent {
  static propTypes = {
    providerId: PropTypes.string.isRequired,
    items: PropTypes.array.isRequired,
    issue: PropTypes.object.isRequired,
  };

  render() {
    return (
      <Tile layout="popular-in-issue" {...this.props}>
        <PopularInIssue
          issue={this.props.issue}
          provider={prefillSelector(providerById)(this.props.providerId)}
          popularItems={this.props.items}
        />
      </Tile>
    );
  }
}

export default PopularInIssueTile;



// WEBPACK FOOTER //
// ./src/js/app/components/tiles/PopularInIssueTile.js