import React from 'react';
import PropTypes from 'prop-types';
import { translate } from 'instances/i18n';
import classNames from 'classnames';

class Social extends React.Component {
  static propTypes = {
    user: PropTypes.object.isRequired,
    twitterConnected: PropTypes.bool.isRequired,
    facebookConnected: PropTypes.bool.isRequired,
    twitterLoading: PropTypes.bool.isRequired,
    facebookLoading: PropTypes.bool.isRequired,
    facebookError: PropTypes.string,
    onToggleTwitter: PropTypes.func.isRequired,
    onToggleFacebook: PropTypes.func.isRequired,
  };

  _onToggleTwitter = () => {
    this.props.onToggleTwitter(this.props.user);
  };

  _onToggleFacebook = () => {
    this.props.onToggleFacebook(this.props.user);
  };

  _renderFacebookError = () => {
    if (this.props.facebookError) {
      return <p className="error-message">{this.props.facebookError}</p>;
    }
  };

  _renderPasswordReset = () => {
    if (!this.props.user.get('has_password')) {
      return (
        <p
          className="reset-password"
          dangerouslySetInnerHTML={{ __html: translate('app.settings.social.reset_password') }}
        />
      );
    }
  };

  render() {
    const twitterClasses = classNames([
      'btn-toggle',
      { off: !this.props.twitterConnected },
      { loading: this.props.twitterLoading },
    ]);

    const facebookClasses = classNames([
      'btn-toggle',
      { off: !this.props.facebookConnected },
      { 's-inactive': !this.props.user.get('has_password') },
      { loading: this.props.facebookLoading },
    ]);

    return (
      <div className="container">
        <h2 className="header">{translate('settings.social.title')}</h2>
        <h3 className="title">{translate('settings.social.authorized_following')}</h3>
        <ul>
          <li className="row twitter">
            <span className={twitterClasses} onClick={this._onToggleTwitter} />{' '}
            {translate('settings.social.options.twitter')}
          </li>
          <li className="row facebook">
            <span className={facebookClasses} onClick={this._onToggleFacebook} />{' '}
            {translate('settings.social.options.facebook')}
            {this._renderPasswordReset()}
            {this._renderFacebookError()}
          </li>
        </ul>
      </div>
    );
  }
}

export default Social;



// WEBPACK FOOTER //
// ./src/js/app/modules/settings/components/Social.js