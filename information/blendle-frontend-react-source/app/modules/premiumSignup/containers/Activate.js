import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { STATUS_ERROR, STATUS_OK, HOME_ROUTE } from 'app-constants';
import SubscriptionOrderActions from 'actions/SubscriptionOrderActions';
import SubscriptionOrderStore from 'stores/SubscriptionOrderStore';
import AuthStore from 'stores/AuthStore';
import AffiliatesStore from 'stores/AffiliatesStore';
import { getVodafoneAffiliateMetaData, getAffiliatesSubscriptionProduct } from 'helpers/affiliates';
import ActivatePremium from '../components/ActivatePremium';
import withRouter from 'react-router/lib/withRouter';

class ActivateContainer extends Component {
  static propTypes = {
    router: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
    SubscriptionOrderStore.listen(this._onStoreChange);

    return this._startPremiumTrial();
  }

  componentWillUnmount() {
    SubscriptionOrderStore.unlisten(this._onStoreChange);
    clearTimeout(this._navigateTimeout);
  }

  _startPremiumTrial() {
    const { affiliate } = AffiliatesStore.getState();
    const { user } = AuthStore.getState();
    const successUrl = `${HOME_ROUTE}/success`;
    const subscriptionOptions = {
      success_url: successUrl,
      user_uuid: user.attributes.uuid,
      ...getAffiliatesSubscriptionProduct(AffiliatesStore.getState()),
      ...getVodafoneAffiliateMetaData(AffiliatesStore.getState()),
    };

    if (affiliate && affiliate.subscriptionProduct) {
      return SubscriptionOrderActions.startAffiliateSubscription(
        subscriptionOptions,
        AuthStore.getState().user.id,
      );
    }

    if (affiliate && !affiliate.subscriptionProduct) {
      return this.props.router.push(successUrl);
    }

    return SubscriptionOrderActions.startTrial(
      {
        ...subscriptionOptions,
        paymentType: 'confirmed_email_address',
      },
      AuthStore.getState().user.id,
    );
  }

  _onStoreChange = (storeState) => {
    const { trialStatus, affiliateStatus, redirect_url: redirectUrl, error } = storeState;
    const { affiliate } = AffiliatesStore.getState();
    const nextUrl = affiliate ? '/getpremium/redeem' : `${HOME_ROUTE}/success`;

    if (trialStatus === STATUS_OK || affiliateStatus === STATUS_OK) {
      if (affiliate && affiliate.name === 'vodafone') {
        window.location = redirectUrl;
        return;
      }
      // Fixes dispatch in dispatch error
      this._navigateTimeout = setTimeout(() => {
        this.props.router.push(nextUrl);
      });
    }

    if (trialStatus === STATUS_ERROR || affiliateStatus === STATUS_ERROR) {
      this._getErrorMessage(error);
    }
  };

  _getErrorMessage = (error) => {
    const { status, message } = error;

    if (status === 422) {
      return this.setState({ errorMessage: message || 'Je hebt al een premium abo' });
    }

    return this.setState({ errorMessage: 'Er is iets mis gegaan' });
  };

  render() {
    return <ActivatePremium router={this.props.router} error={this.state.errorMessage} />;
  }
}

export default withRouter(ActivateContainer);



// WEBPACK FOOTER //
// ./src/js/app/modules/premiumSignup/containers/Activate.js