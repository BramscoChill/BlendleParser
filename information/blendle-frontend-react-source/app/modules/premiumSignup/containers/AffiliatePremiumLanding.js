import React, { Component } from 'react';
import PropTypes from 'prop-types';
import withRouter from 'react-router/lib/withRouter';
import AltContainer from 'alt-container';
import AffiliatesActions from 'actions/AffiliatesActions';
import AffiliatesStore from 'stores/AffiliatesStore';
import PremiumLanding from './PremiumLanding';
import AffiliateBanner from './AffiliateBanner';

class AffiliatePremiumLanding extends Component {
  static propTypes = {
    location: PropTypes.object,
    params: PropTypes.object,
    router: PropTypes.object,
  };

  componentDidMount() {
    this._parseAffiliateData();
  }

  _parseAffiliateData = () => {
    const { params } = this.props;
    const affiliateId = params.affiliateId;

    if (affiliateId) {
      AffiliatesActions.selectAffiliate(affiliateId);
    }

    if (affiliateId === 'vodafone' && window.location.search !== '') {
      AffiliatesActions.saveVodafoneMetaData(window.location.href);
    }
  };

  _renderAffiliatePremiumLanding = (AffiliatesState) => {
    const { affiliate } = AffiliatesState;
    const topBanner =
      affiliate && !affiliate.useDefaultHeader ? <AffiliateBanner {...this.props} /> : null;

    return <PremiumLanding topBanner={topBanner} {...this.props} />;
  };

  render() {
    return <AltContainer store={AffiliatesStore} render={this._renderAffiliatePremiumLanding} />;
  }
}

export default withRouter(AffiliatePremiumLanding);



// WEBPACK FOOTER //
// ./src/js/app/modules/premiumSignup/containers/AffiliatePremiumLanding.js