import alt from 'instances/altInstance';
import affiliateCampaigns from 'config/affiliates';
import AffiliatesActions from 'actions/AffiliatesActions';

class AffiliatesStore {
  constructor() {
    this.bindActions(AffiliatesActions);

    this.state = {};
  }

  onSelectAffiliate(payload) {
    const affiliate = affiliateCampaigns.find(campaign => campaign.name === payload);

    if (affiliate) {
      this.setState({ affiliate });
    }
  }

  onSaveVodafoneMetaData(payload) {
    const meta = {
      ...this.state.meta,
      vodafone_full_url: payload,
    };

    this.setState({ meta });
  }
}

export default alt.createStore(AffiliatesStore, 'AffiliatesStore');



// WEBPACK FOOTER //
// ./src/js/app/stores/AffiliatesStore.js