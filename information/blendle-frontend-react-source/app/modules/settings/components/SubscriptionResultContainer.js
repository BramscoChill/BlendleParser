import React from 'react';
import PropTypes from 'prop-types';
import Analytics from 'instances/analytics';
import { providerById, prefillSelector } from 'selectors/providers';
import SubscriptionResult from 'components/dialogues/SubscriptionResult';

export default class extends React.Component {
  static propTypes = {
    status: PropTypes.string.isRequired,
    providerId: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired,
  };

  componentDidMount() {
    const status = this.props.status;
    const provider = prefillSelector(providerById)(this.props.providerId);
    const eventName = `Subscription Add${status === 'success' ? '' : ' Failed'}`;

    Analytics.track(eventName, {
      providerId: provider.id,
      provider: provider.name,
    });
  }

  render() {
    return (
      <SubscriptionResult
        provider={prefillSelector(providerById)(this.props.providerId)}
        status={this.props.status}
        onClickButton={this.props.onClose}
      />
    );
  }
}



// WEBPACK FOOTER //
// ./src/js/app/modules/settings/components/SubscriptionResultContainer.js