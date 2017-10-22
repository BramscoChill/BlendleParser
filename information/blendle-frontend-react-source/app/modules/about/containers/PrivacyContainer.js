import React from 'react';
import Privacy from 'modules/about/components/Privacy';
import Auth from 'controllers/auth';

export default class PrivacyContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      user: Auth.getUser(),
      trackingLoading: false,
      shareLoading: false,
    };
  }

  _onToggleTracking() {
    this.setState({ trackingLoading: true });

    const value = !this.state.user.get('mixpanel_opt_out');

    this.state.user.saveProperty('mixpanel_opt_out', value).then(() =>
      this.setState({
        user: this.state.user,
        trackingLoading: false,
      }),
    );
  }

  _onToggleSharePrivacy() {
    this.setState({ shareLoading: true });

    const value = !this.state.user.get('publisher_hashed_email_share_opt_out');

    this.state.user.saveProperty('publisher_hashed_email_share_opt_out', value).then(() =>
      this.setState({
        user: this.state.user,
        shareLoading: false,
      }),
    );
  }

  _onToggleRetargeting() {
    this.setState({ retargetingLoading: true });

    const value = !this.state.user.get('ad_retargeting_opt_out');

    this.state.user.saveProperty('ad_retargeting_opt_out', value).then(() =>
      this.setState({
        user: this.state.user,
        retargetingLoading: false,
      }),
    );
  }

  render() {
    return (
      <Privacy
        user={this.state.user}
        onToggleTracking={() => this._onToggleTracking()}
        onToggleSharePrivacy={() => this._onToggleSharePrivacy()}
        onToggleRetargeting={() => this._onToggleRetargeting()}
        trackingLoading={this.state.trackingLoading}
        shareLoading={this.state.shareLoading}
        retargetingLoading={this.state.retargetingLoading}
      />
    );
  }
}



// WEBPACK FOOTER //
// ./src/js/app/modules/about/containers/PrivacyContainer.js