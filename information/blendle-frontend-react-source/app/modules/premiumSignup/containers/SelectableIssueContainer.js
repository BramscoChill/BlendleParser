import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AltContainer from 'alt-container';
import FavoriteProvidersStore from 'stores/FavoriteProvidersStore';
import FavoriteProvidersActions from 'actions/FavoriteProvidersActions';
import SelectableIssue from 'modules/premiumSignup/components/SelectableIssue';
import AuthStore from 'stores/AuthStore';

class SelectableIssueContainer extends Component {
  static propTypes = {
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    image: PropTypes.string.isRequired,
    providerId: PropTypes.string.isRequired,
    analyticsPayload: PropTypes.object,
  };

  _onChange = () => {
    const { providerId, analyticsPayload } = this.props;
    const userId = AuthStore.getState().user.id;
    const favoriteProvidersState = FavoriteProvidersStore.getState();

    FavoriteProvidersActions.favoriteProvider(
      userId,
      providerId,
      !favoriteProvidersState.favorites.some(favoriteProvider => favoriteProvider === providerId),
      analyticsPayload,
    );
  };

  _renderSelectableIssue(favoriteProvidersState) {
    const { providerId } = this.props;

    return (
      <SelectableIssue
        onChange={this._onChange}
        selected={favoriteProvidersState.favorites.some(
          favoriteProvider => favoriteProvider === providerId,
        )}
        {...this.props}
      />
    );
  }

  render() {
    return (
      <AltContainer
        store={FavoriteProvidersStore}
        render={this._renderSelectableIssue.bind(this)}
      />
    );
  }
}

export default SelectableIssueContainer;



// WEBPACK FOOTER //
// ./src/js/app/modules/premiumSignup/containers/SelectableIssueContainer.js