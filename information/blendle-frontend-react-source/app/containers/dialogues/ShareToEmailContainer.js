import React from 'react';
import PropTypes from 'prop-types';
import AltContainer from 'alt-container';
import ShareToEmail from 'components/dialogues/ShareToEmail';
import Auth from 'controllers/auth';
import Analytics from 'instances/analytics';
import ShareStore from 'stores/ShareStore';
import TileStore from 'stores/TilesStore';
import ShareActions from 'actions/ShareActions';
import { getManifest } from 'selectors/tiles';

function getAnalytics(analytics, providerId) {
  return {
    ...analytics,
    provider_id: providerId,
  };
}

class ShareToEmailContainer extends React.Component {
  static propTypes = {
    onClose: PropTypes.func,
    manifest: PropTypes.object,
    itemId: PropTypes.string,
    defaultMessage: PropTypes.string,
    analytics: PropTypes.object,
    isVisible: PropTypes.bool,
  };

  componentDidMount() {
    if (this.props.isVisible) {
      this.trackEvent();
    }
  }

  shouldComponentUpdate(nextProps) {
    const isVisibilityChanged = nextProps.isVisible !== this.props.isVisible;

    if (isVisibilityChanged && nextProps.isVisible) {
      ShareActions.resetStatus();
      this.trackEvent();
    }

    return isVisibilityChanged;
  }

  getManifest = () => {
    if (this.props.manifest) {
      return this.props.manifest;
    }
    const { tiles } = TileStore.getState();
    return getManifest(tiles, this.props.itemId);
  };

  trackEvent() {
    Analytics.track(
      'Share Email: Open dialogue',
      getAnalytics(this.props.analytics, this.getManifest().provider.id),
    );
  }

  _transform = shareState => ({
    onSubmit: this._onSubmit,
    status: shareState.status,
    onClose: this._onDialogClosed,
    defaultMessage: this.props.defaultMessage,
  });

  _onSubmit = (to, message) => {
    ShareActions.shareItemToEmail(
      Auth.getId(),
      this.getManifest(),
      to,
      message,
      getAnalytics(this.props.analytics, this.getManifest().provider.id),
    );
  };

  _onDialogClosed = () => {
    ShareActions.resetStatus();
    this.props.onClose();
  };

  render() {
    if (!this.props.isVisible) {
      return null;
    }

    return <AltContainer store={ShareStore} transform={this._transform} component={ShareToEmail} />;
  }
}

export default ShareToEmailContainer;



// WEBPACK FOOTER //
// ./src/js/app/containers/dialogues/ShareToEmailContainer.js