import React from 'react';
import PropTypes from 'prop-types';
import User from 'models/user';
import Link from 'components/Link';
import Analytics from 'instances/analytics';
import AvatarImage from 'components/AvatarImage';
import { translateElement, translate, formatCurrency } from 'instances/i18n';

export default class UpgradeAccount extends React.Component {
  static propTypes = {
    user: PropTypes.instanceOf(User).isRequired,
    timeline: PropTypes.string.isRequired,
  };

  render() {
    const user = this.props.user;
    const avatarImage = this.props.user.getAvatarHref();
    const userName = user.get('username');
    const firstName = user.getFirstName();
    const messageKey = `timeline.tiles.upgrade_account.message${userName ? '' : '_no_name'}`;

    return (
      <div className="tile-upgrade-account">
        <div className="v-upgrade-account">
          <div className="profile-render">
            <AvatarImage src={avatarImage} />
            <h3>{userName}</h3>
            {this._renderBio()}
          </div>
          <div className="overlay" />
          <div className="container">
            {translateElement(<h2 />, messageKey, {
              name: firstName,
              gift: formatCurrency(2.5),
            })}
            <Link
              className="btn btn-blendle-icon-green btn-green btn-upgrade"
              onClick={this._trackUpgrade.bind(this)}
              href="/payment"
            >
              {translate('timeline.tiles.upgrade_account.button')}
            </Link>
            <div className="payment-icons" />
          </div>
        </div>
      </div>
    );
  }

  _renderBio() {
    const text = this.props.user.get('text');

    if (text) {
      return <p className="bio">{text}</p>;
    }

    return undefined;
  }

  _trackUpgrade(e) {
    Analytics.track('Deposit Trigger', {
      type: `timeline/${this.props.timeline}`,
    });
  }
}



// WEBPACK FOOTER //
// ./src/js/app/components/UpgradeAccount.js