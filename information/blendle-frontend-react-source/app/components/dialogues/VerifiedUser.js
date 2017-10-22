import React from 'react';
import PropTypes from 'prop-types';
import Dialogue from 'components/dialogues/Dialogue';
import Confetti from 'components/Confetti';
import RewardsTable from 'components/RewardsTable';
import PaymentHeader from 'components/dialogues//Header';
import { translate, translateElement, formatCurrency } from 'instances/i18n';
import { BLENDLE_COUPON } from 'app-constants';
import moment from 'moment';
import { uniq } from 'lodash';
import { providerById, prefillSelector } from 'selectors/providers';
import Link from 'components/Link';

function introSubscriptionBlendle(reward) {
  const duration = moment.duration(reward.subscription_duration * 1000).humanize();
  const provider = prefillSelector(providerById)(reward.provider_uid);

  return translate('dialogues.verified_account.reward.intro_blendle_subscription', [
    provider.name,
    duration,
  ]);
}

function introMoneyBlendle(reward) {
  return translate('dialogues.verified_account.reward.intro_blendle_money', [
    formatCurrency(reward.amount),
  ]);
}

function introSubscriptionThirdParty(thirdParty, reward) {
  const duration = moment.duration(reward.subscription_duration * 1000).humanize();
  const provider = prefillSelector(providerById)(reward.provider_uid);

  return translate('dialogues.verified_account.reward.intro_third_party_subscription', [
    thirdParty,
    provider.name,
    duration,
  ]);
}

function introMoneyThirdParty(thirdParty, reward) {
  return translate('dialogues.verified_account.reward.intro_third_party_money', [
    thirdParty,
    formatCurrency(reward.amount),
  ]);
}

class VerifiedUserDialogue extends React.Component {
  static propTypes = {
    onClose: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired,
    rewards: PropTypes.array,
  };

  _getSingleRewardIntro = (reward) => {
    let intro;
    if (reward.name === BLENDLE_COUPON) {
      if (reward.reward_type === 'subscription') {
        intro = introSubscriptionBlendle(reward);
      } else {
        intro = introMoneyBlendle(reward);
      }
    } else if (reward.reward_type === 'subscription') {
      intro = introSubscriptionThirdParty(reward.name, reward);
    } else {
      intro = introMoneyThirdParty(reward.name, reward);
    }

    return <span dangerouslySetInnerHTML={{ __html: intro }} />;
  };

  _getMultipleRewardsIntro = (rewards) => {
    const companies = uniq(rewards.map(reward => reward.name));

    if (companies.length === 1) {
      if (companies[0] === BLENDLE_COUPON) {
        return (
          <span>
            {translateElement(
              <span />,
              'dialogues.verified_account.reward.intro_multiple_us',
              false,
            )}
            <RewardsTable rewards={rewards} onClickProvider={this.props.onClose} hideGivers />
          </span>
        );
      }

      return (
        <span>
          {translateElement(
            <span />,
            'dialogues.verified_account.reward.intro_multiple_third_party',
            [companies[0]],
            false,
          )}
          <RewardsTable rewards={rewards} onClickProvider={this.props.onClose} hideGivers />
        </span>
      );
    }

    return (
      <span>
        {translateElement(
          <span />,
          'dialogues.verified_account.reward.intro_multiple_third_parties',
          false,
        )}
        <RewardsTable rewards={rewards} hideGivers={false} onClickProvider={this.props.onClose} />
      </span>
    );
  };

  _renderSingleReward = (reward) => {
    const intro = this._getSingleRewardIntro(reward);

    if (reward.provider_uid) {
      return (
        <Link href={`/issue/${reward.provider_uid}`} className="intro" onClick={this.props.onClose}>
          {intro}
        </Link>
      );
    }

    return (
      <div className="intro" onClick={this.props.onClose}>
        {intro}
      </div>
    );
  };

  _renderMultipleRewards = (rewards) => {
    const intro = this._getMultipleRewardsIntro(rewards);

    return <div className="intro">{intro}</div>;
  };

  _renderRewards = () => {
    const rewards = this.props.rewards;

    if (!rewards) {
      return null;
    }

    if (rewards.length === 1) {
      return this._renderSingleReward(rewards[0]);
    }

    return this._renderMultipleRewards(rewards);
  };

  render() {
    return (
      <Dialogue className="dialog-verified-user" onClose={this.props.onClose}>
        <PaymentHeader user={this.props.user} />
        <div className="body">
          <h2 className="welcome">{translate('dialogues.verified_account.title')}</h2>
          <Confetti className="confetti" />
          <div className="fade" />
          {this._renderRewards()}
          <a className="btn btn-go" onClick={this.props.onClose}>
            {translate('supersympathiek')}
          </a>
        </div>
      </Dialogue>
    );
  }
}

export default VerifiedUserDialogue;



// WEBPACK FOOTER //
// ./src/js/app/components/dialogues/VerifiedUser.js