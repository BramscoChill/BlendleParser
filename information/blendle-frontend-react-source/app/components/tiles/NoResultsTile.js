import React from 'react';
import PropTypes from 'prop-types';
import Tile from 'components/Tile';
import { translateElement } from 'instances/i18n';

export default class NoResultsTile extends React.Component {
  static propTypes = {
    query: PropTypes.string.isRequired,
  };

  render() {
    return (
      <Tile type="message">
        <div className="error-body">
          {translateElement('search.errors.no_results', [this.props.query])}
        </div>
      </Tile>
    );
  }
}



// WEBPACK FOOTER //
// ./src/js/app/components/tiles/NoResultsTile.js