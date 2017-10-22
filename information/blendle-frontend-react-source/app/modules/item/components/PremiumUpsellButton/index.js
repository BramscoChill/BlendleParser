import React, { PureComponent } from 'react';
import { history } from 'byebye';
import PropTypes from 'prop-types';
import UpsellStateContainer from 'containers/UpsellStateContainer';
import { PREMIUM_PROVIDER_ID } from 'app-constants';
import { Button } from '@blendle/lego';
import CSS from './style.scss';

class PremiumUpsellButton extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
  };

  static defaultProps = {
    size: 'small',
    color: 'midnight',
  };

  _onClickBeforeTrial = () => {
    // TODO: events?
    history.navigate('/premium-intro', { trigger: true });
  };

  _onClickDuringTrial = () => {
    // TODO: events?
    history.navigate(`/subscription/${PREMIUM_PROVIDER_ID}`, { trigger: true });
  };

  _renderBeforeTrial = () => (
    <Button
      className={CSS.button}
      onClick={this._onClickBeforeTrial}
      size="normal"
      color="hot-coral"
      data-test-identifier="reader-upsell-button"
    >
      Probeer Blendle Premium
    </Button>
  );

  _renderDuringTrial = () => (
    <Button
      className={CSS.button}
      onClick={this._onClickDuringTrial}
      size="normal"
      color="hot-coral"
      data-test-identifier="reader-upsell-button"
    >
      Blendle Premium houden
    </Button>
  );

  render() {
    return (
      <div className={`${CSS.container} ${this.props.className}`}>
        <UpsellStateContainer
          renderBeforeTrial={this._renderBeforeTrial}
          renderDuringTrial={this._renderDuringTrial}
        />
      </div>
    );
  }
}

export default PremiumUpsellButton;



// WEBPACK FOOTER //
// ./src/js/app/modules/item/components/PremiumUpsellButton/index.js