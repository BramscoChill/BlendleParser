import React from 'react';
import PropTypes from 'prop-types';
import { getManifest } from 'selectors/tiles';
import ShareActions from 'actions/ShareActions';
import TilesStore from 'stores/TilesStore';
import BrowserEnv from 'instances/browser_environment';
import DialogueController from 'controllers/dialogues';
import { translate } from 'instances/i18n';
import classNames from 'classnames';
import AuthStore from 'stores/AuthStore';
import CSS from './style.scss';

class DropdownSharingButtonsContainer extends React.Component {
  static propTypes = {
    itemId: PropTypes.string.isRequired,
    className: PropTypes.string,
    buttonClassName: PropTypes.string,
    analytics: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.state = {
      isEmailDialogVisible: false,
    };
  }

  _onEmailDialog = (ev) => {
    ev.preventDefault();
    const manifest = getManifest(TilesStore.getState().tiles, this.props.itemId);
    DialogueController.shareToEmail({
      manifest,
      analytics: this._getAnalytics(),
    });
  };

  _onShareToFacebook = (ev) => {
    ev.preventDefault();
    const manifest = getManifest(TilesStore.getState().tiles, this.props.itemId);
    ShareActions.shareItemToFacebook(manifest, AuthStore.getState().user, this._getAnalytics());
  };

  _onShareToTwitter = (ev) => {
    ev.preventDefault();
    const manifest = getManifest(TilesStore.getState().tiles, this.props.itemId);
    ShareActions.shareItemToTwitter(manifest, AuthStore.getState().user, this._getAnalytics());
  };

  _onShareToWhatsApp = (ev) => {
    ev.preventDefault();
    const manifest = getManifest(TilesStore.getState().tiles, this.props.itemId);
    ShareActions.shareItemToWhatsApp(manifest, AuthStore.getState().user, this._getAnalytics());
  };

  _getAnalytics() {
    return {
      ...this.props.analytics,
      location_in_layout: 'manifest-dropdown',
    };
  }

  render() {
    const whatsApp = (
      <button
        className={classNames(
          'share-whatsapp',
          CSS.whatsapp,
          CSS.button,
          this.props.buttonClassName,
        )}
        onClick={this._onShareToWhatsApp}
      >
        {translate('app.manifest.share.whatsapp')}
      </button>
    );

    return (
      <div className={this.props.className}>
        <button
          className={classNames('share-email', CSS.email, CSS.button, this.props.buttonClassName)}
          onClick={this._onEmailDialog}
        >
          {translate('app.manifest.share.email')}
        </button>
        <button
          className={classNames(
            'share-facebook',
            CSS.facebook,
            CSS.button,
            this.props.buttonClassName,
          )}
          onClick={this._onShareToFacebook}
        >
          {translate('app.manifest.share.facebook')}
        </button>
        <button
          className={classNames(
            'share-twitter',
            CSS.twitter,
            CSS.button,
            this.props.buttonClassName,
          )}
          onClick={this._onShareToTwitter}
        >
          {translate('app.manifest.share.twitter')}
        </button>
        {BrowserEnv.isMobile() && whatsApp}
      </div>
    );
  }
}

export default DropdownSharingButtonsContainer;



// WEBPACK FOOTER //
// ./src/js/app/containers/DropdownSharingButtonsContainer/index.js