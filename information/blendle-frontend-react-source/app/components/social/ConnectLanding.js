import React from 'react';
import PropTypes from 'prop-types';
import Link from 'components/Link';
import classNames from 'classnames';
import { translate } from 'instances/i18n';
import { STATUS_PENDING } from 'app-constants';

class ConnectLanding extends React.Component {
  static propTypes = {
    facebookConnected: PropTypes.bool.isRequired,
    facebookStatus: PropTypes.number.isRequired,
    twitterConnected: PropTypes.bool.isRequired,
    twitterStatus: PropTypes.number.isRequired,
  };

  _renderFacebook = () => {
    if (this.props.facebookConnected) {
      return (
        <div className="social-connected">
          {translate('social.facebook.already_following_friends')}
        </div>
      );
    }

    const facebookClasses = classNames('btn btn-facebook btn-fullwidth', {
      's-loading': this.props.facebookStatus === STATUS_PENDING,
    });

    return (
      <Link href="/social/facebook" className={facebookClasses}>
        {translate('social.facebook.button')}
      </Link>
    );
  };

  _renderTwitter = () => {
    if (this.props.twitterConnected) {
      return (
        <div className="social-connected">
          {translate('social.twitter.already_following_friends')}
        </div>
      );
    }

    const twitterClasses = classNames('btn btn-twitter btn-fullwidth', {
      's-loading': this.props.twitterStatus === STATUS_PENDING,
    });

    return (
      <Link href="/social/twitter" className={twitterClasses}>
        {translate('social.twitter.button')}
      </Link>
    );
  };

  render() {
    return (
      <div>
        <div className="social-header">
          <h2 className="social-header-title">{translate('social.header')}</h2>
          <img className="social-heart" src="/img/illustrations/heart.svg" alt="" height="100" />
        </div>
        <div className="social-body">
          <p
            className="social-body-text"
            dangerouslySetInnerHTML={{ __html: translate('social.text') }}
          />
          {this._renderFacebook()}
          {this._renderTwitter()}
        </div>
      </div>
    );
  }
}

export default ConnectLanding;



// WEBPACK FOOTER //
// ./src/js/app/components/social/ConnectLanding.js