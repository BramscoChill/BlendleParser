import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AltContainer from 'alt-container';
import { get } from 'lodash';
import Analytics from 'instances/analytics';
import { track } from 'helpers/premiumOnboardingEvents';
import SignUpActions from 'actions/SignUpActions';
import FavoriteProvidersActions from 'actions/FavoriteProvidersActions';
import SignUpStore from 'stores/SignUpStore';
import FavoriteProvidersStore from 'stores/FavoriteProvidersStore';
import AuthStore from 'stores/AuthStore';
import AuthActions from 'actions/AuthActions';
import Publications from 'modules/premiumSignup/components/Publications';
import ChannelsStore from 'stores/ChannelsStore';

function formatPublications(publications) {
  return publications
    .filter(issue => issue._links.page_preview || issue._links.cover_image)
    .map((issue) => {
      const image = issue._links.page_preview || issue._links.cover_image;
      return {
        issue,
        image,
        key: issue.provider.id,
        width: image.width,
        height: image.height,
      };
    });
}

class PublicationsContainer extends Component {
  static propTypes = {
    params: PropTypes.object,
    route: PropTypes.object,
    isOnboarding: PropTypes.bool,
    location: PropTypes.object,
  };

  componentDidMount() {
    SignUpActions.fetchPublicationsByChannelPreferences(ChannelsStore.getState().selectedChannels);
    FavoriteProvidersActions.fetchFavoriteProviders(AuthStore.getState().user.id);

    // Update user again to make sure we have the active subscriptions, which we use to determine
    // the href prop of the footer button
    AuthActions.update(AuthStore.getState().user);
  }

  componentWillUnmount() {
    const favoriteProviders = FavoriteProvidersStore.getState().favorites;

    track(Analytics, 'Signup/Publications Selected', { provider_uids: favoriteProviders });
  }

  _renderPublications(signUpState) {
    const isDeeplinkSignup = !!get(this.props, 'params.itemId', null);

    return (
      <Publications
        imageList={formatPublications(signUpState.publications)}
        selected={signUpState.favorites}
        isDeeplinkSignUp={isDeeplinkSignup}
        isOnboarding={this.props.isOnboarding}
      />
    );
  }

  render() {
    return <AltContainer store={SignUpStore} render={this._renderPublications.bind(this)} />;
  }
}

export default PublicationsContainer;



// WEBPACK FOOTER //
// ./src/js/app/modules/premiumSignup/containers/Publications.js