import React from 'react';
import PropTypes from 'prop-types';
import CSS from './style.scss';
import ManagedInput from 'components/ManagedInput';

const MASK = 'XXXX - XXXX - XXXX - XXXX';

function chunkString(str, n, joinChar) {
  const ret = [];

  for (let i = 0; i < str.length; i += n) {
    ret.push(str.substr(i, n));
  }

  return ret.join(joinChar);
}

export default class CreditcardInput extends React.Component {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    value: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    name: PropTypes.string,
    error: PropTypes.bool,
    onBlur: PropTypes.func,
    cardType: PropTypes.string,
    className: PropTypes.string,
  };

  _renderCreditcardIcon() {
    if (!this.props.cardType) {
      return null;
    }

    return (
      <div className={CSS.cardType}>
        <img alt={this.props.cardType} src={`img/logos/${this.props.cardType}.svg`} />
      </div>
    );
  }

  render() {
    const { cardType } = this.props;
    const value = chunkString(this.props.value, 4, ' - ');

    const mask = cardType && cardType === 'amex' ? MASK.slice(0, -1) : MASK;
    return (
      <div className={CSS.container}>
        <ManagedInput
          pattern="\d*"
          onBlur={this.props.onBlur}
          className={this.props.className}
          error={this.props.error}
          format={mask}
          autoComplete="cc-number"
          name={this.props.name}
          placeholder={this.props.value.length ? '' : this.props.placeholder}
          type="text"
          value={value}
          onChange={this.props.onChange}
          noState
        />
        {this._renderCreditcardIcon()}
      </div>
    );
  }
}



// WEBPACK FOOTER //
// ./src/js/app/modules/payment/components/CreditcardForm/CreditcardInput/index.js