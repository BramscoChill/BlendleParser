import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { RadioGroup, Radio, ButtonGroup, Button, Rows } from '@blendle/lego';
import CSS from './style.scss';

export default class CancelPremium extends Component {
  static propTypes = {
    selectableReasons: PropTypes.array.isRequired,
    selectedReason: PropTypes.string,
    showOtherField: PropTypes.bool,
    onDismiss: PropTypes.func.isRequired,
    onCancelSubscription: PropTypes.func.isRequired,
    onUpdateReason: PropTypes.func.isRequired,
  };

  _onChangeCustomReason = (e) => {
    this.props.onUpdateReason(e.target.value);
  };

  _renderReasons() {
    return (
      <RadioGroup
        className={CSS.reasons}
        checkedValue={this.props.selectedReason}
        onCheckedValueChange={this.props.onUpdateReason}
      >
        {this.props.selectableReasons.map(({ value, label }) => (
          <Radio className={CSS.reason} key={value} value={value} label={label}>
            <Rows className={CSS.reasonLabel}>
              <div>{label}</div>
              {this._renderOtherField(value)}
            </Rows>
          </Radio>
        ))}
      </RadioGroup>
    );
  }

  _renderOtherField(reason) {
    if (reason !== 'other' || !this.props.showOtherField) {
      return null;
    }

    return (
      <textarea
        className={classNames('inp inp-textarea', CSS.textarea)}
        placeholder="Vul hier jouw reden in..."
        onChange={this._onChangeCustomReason}
      />
    );
  }

  render() {
    return (
      <span>
        <h2>Waarom wil je stoppen met Blendle Premium?</h2>
        <p>
          We willen graag weten waarom je wilt stoppen, zodat we Blendle Premium beter kunnen maken.
        </p>
        {this._renderReasons()}
        {this._renderOtherField()}
        <ButtonGroup vertical>
          <Button color="hot-coral" onClick={this.props.onCancelSubscription}>
            Blendle Premium stoppen
          </Button>
          <Button color="cappuccino" onClick={this.props.onDismiss}>
            Toch blijven lezen
          </Button>
        </ButtonGroup>
      </span>
    );
  }
}



// WEBPACK FOOTER //
// ./src/js/app/modules/settings/components/CancelPremium/index.js