import React from 'react';
import PropTypes from 'prop-types';
import { locale as i18n } from 'instances/i18n';
import classNames from 'classnames';
import formatCurrency from 'helpers/formatcurrency';
import AvatarImage from 'components/AvatarImage';

export default class PaymentHeader extends React.Component {
  static propTypes = {
    user: PropTypes.object.isRequired,
  };

  render() {
    const balance = this.props.user.get('balance');
    const avatar = this.props.user.getAvatarHref();

    const balanceClass = classNames(['balance', { 's-low': balance <= 1 }]);

    const formattedBalance = formatCurrency(balance);

    return (
      <div className="v-avatar-balance-header">
        <div className="title">
          <div className="avatar">
            <AvatarImage src={avatar} />
          </div>
          <div className="current-balance">
            {i18n.payment.text.current_balance}
            <span className={balanceClass}>{formattedBalance}</span>
          </div>
        </div>
      </div>
    );
  }
}



// WEBPACK FOOTER //
// ./src/js/app/components/dialogues/Header.js