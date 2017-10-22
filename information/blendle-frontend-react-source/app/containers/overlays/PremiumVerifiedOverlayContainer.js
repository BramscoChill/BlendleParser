import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AltContainer from 'alt-container';
import PremiumSubscriptionActions from 'actions/PremiumSubscriptionActions';
import AuthStore from 'stores/AuthStore';
import Twitter from 'instances/twitter';
import VerifiedOverlay from 'components/PremiumVerifiedOverlay';
import DeeplinkVerifiedOverlay from 'components/PremiumDeeplinkVerifiedOverlay';
import AffiliatesStore from 'stores/AffiliatesStore';
import { getCustomCopy } from 'helpers/affiliates';
import Analytics from 'instances/analytics';

class PremiumVerifiedContainer extends Component {
  static propTypes = {
    dismissRoute: PropTypes.string,
    isDeeplink: PropTypes.bool,
    itemId: PropTypes.string,
  };

  constructor(props) {
    super(props);

    this.state = {
      isVisible: true,
    };
  }

  componentDidMount() {
    const user = AuthStore.getState().user;
    const url = user.getLatestPremiumSubscriptionUrl();
    PremiumSubscriptionActions.pollFetchLatestPremiumSubscription.defer(url);

    // Add this class to enable the overlay. The div is hidden by the old CSS
    document.body.classList.add('s-enable-overlay');
  }

  componentWillUnmount() {
    this._setInvisible();
  }

  _onDismiss = () => {
    this._setInvisible();

    Analytics.track('Confirmation Overlay Dismissed', {
      internal_location: this.props.isDeeplink ? 'item' : 'timeline/premium',
      item_id: this.props.itemId,
    });
  };

  _onClickTweet = () => {
    Twitter.openTweet(
      'Ik zag net confetti en nu lees ik de beste verhalen een week lang gratis. Jij mag ook, probeer Blendle Premium! »',
      'https://blendle.link/blendle-premium-twitter',
    );
  };

  _setInvisible() {
    this.setState({ isVisible: false });
    document.body.classList.remove('s-enable-overlay');
  }

  _renderOverlay = ({ authState, affiliateState }) => {
    if (this.props.isDeeplink) {
      return (
        <DeeplinkVerifiedOverlay
          onDismiss={this._onDismiss}
          onClickTweet={this._onClickTweet}
          user={authState.user}
        />
      );
    }

    return (
      <VerifiedOverlay
        dismissRoute={this.props.dismissRoute}
        bodyText={getCustomCopy('successOverlay', affiliateState.affiliate).bodyText}
        hideTwitterButton={!!affiliateState.affiliate}
        onClickTweet={this._onClickTweet}
      />
    );
  };

  render() {
    if (!this.state.isVisible) {
      return null;
    }

    return (
      <AltContainer
        stores={{ authState: AuthStore, affiliateState: AffiliatesStore }}
        render={this._renderOverlay}
      />
    );
  }
}

export default PremiumVerifiedContainer;



// WEBPACK FOOTER //
// ./src/js/app/containers/overlays/PremiumVerifiedOverlayContainer.js