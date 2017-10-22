import React from 'react';
import PropTypes from 'prop-types';
import Confetti from 'components/Confetti';
import Dialogue from 'components/dialogues/Dialogue';
import RewardsTable from 'components/RewardsTable';
import Button from 'components/Button';
import { translate } from 'instances/i18n';

export default class extends React.Component {
  static propTypes = {
    rewards: PropTypes.array.isRequired,
    onClose: PropTypes.func.isRequired,
  };

  render() {
    return (
      <Dialogue className="coupon-dialogue">
        <Confetti>
          <h2>{translate('app.success.it_worked')}</h2>
          <p>{translate('coupons.redeemed.dialog_message')}</p>
          <RewardsTable
            rewards={this.props.rewards}
            hideGivers={false}
            onClickProvider={this.props.onClose}
          />
          <Button className="btn-fullwidth btn-green" onClick={this.props.onClose}>
            {translate('supersympathiek')}
          </Button>
        </Confetti>
      </Dialogue>
    );
  }
}



// WEBPACK FOOTER //
// ./src/js/app/components/dialogues/Coupon.js