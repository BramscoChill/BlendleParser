import React from 'react';
import PropTypes from 'prop-types';
import { translateElement, formatCurrency } from 'instances/i18n';
import moment from 'moment';
import classNames from 'classnames';
import { BLENDLE_COUPON } from 'app-constants';
import { providerById, prefillSelector } from 'selectors/providers';
import Link from 'components/Link';

function getGiverClassNames(giver) {
  return classNames('reward-giver', {
    'is-blendle': giver === BLENDLE_COUPON,
  });
}

export default class extends React.Component {
  static propTypes = {
    rewards: PropTypes.array.isRequired,
    hideGivers: PropTypes.bool.isRequired,
    onClickProvider: PropTypes.func.isRequired,
  };

  _renderGiver = (giver) => {
    if (!giver) {
      return null;
    }

    return (
      <div className={getGiverClassNames(giver)}>
        {translateElement(<span />, 'dialogues.verified_account.reward.giver', [giver], false)}
      </div>
    );
  };

  _renderSubscriptionRow = (reward) => {
    const duration = moment.duration(reward.subscription_duration * 1000).humanize();
    const provider = prefillSelector(providerById)(reward.provider_uid);

    return (
      <tr>
        <td>
          <div className="reward-content">
            <Link
              href={`/issue/${provider.id}`}
              className="reward-label subscription-provider"
              onClick={this.props.onClickProvider}
            >
              {provider.name}
            </Link>
            {this._renderGiver(reward.name)}
          </div>
        </td>
        <td>
          <div className="reward-content">
            {translateElement(
              <span />,
              'dialogues.verified_account.reward.subscription',
              [duration],
              false,
            )}
          </div>
        </td>
      </tr>
    );
  };

  _renderMoneyRow = reward => (
    <tr>
      <td>
        <div className="reward-content">
          <div className="reward-label">
            {translateElement(<span />, 'dialogues.verified_account.reward.money', false)}
          </div>
          {this._renderGiver(reward.name)}
        </div>
      </td>
      <td>
        <div className="reward-content">{formatCurrency(reward.amount)}</div>
      </td>
    </tr>
  );

  _renderRows = () =>
    this.props.rewards.map((reward) => {
      if (reward.reward_type === 'subscription') {
        return this._renderSubscriptionRow(reward);
      }

      return this._renderMoneyRow(reward);
    });

  render() {
    const tableClasses = classNames('v-rewards-table', {
      'hide-givers': this.props.hideGivers,
    });

    return (
      <table className={tableClasses}>
        <tbody>{this._renderRows()}</tbody>
      </table>
    );
  }
}



// WEBPACK FOOTER //
// ./src/js/app/components/RewardsTable.js