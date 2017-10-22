import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Dialogue from 'components/dialogues/Dialogue';
import Input from 'components/Input';
import Button from 'components/Button';
import { translate, translateElement } from 'instances/i18n';
import { get } from 'lodash';

export default class extends React.Component {
  static propTypes = {
    data: PropTypes.object.isRequired,
    providerName: PropTypes.string.isRequired,
    onChangeInput: PropTypes.func.isRequired,
    onClickSubmit: PropTypes.func.isRequired,
    loading: PropTypes.bool,
    error: PropTypes.bool,
    statusCode: PropTypes.number,
    errorMessage: PropTypes.string,
  };

  _onSubmit = (e) => {
    e.preventDefault();

    this.props.onClickSubmit();
  };

  _getErrorTranslationKey = (statusCode, errorMessage) => {
    if (statusCode === 422) {
      switch (errorMessage) {
        case 'Invalid credentials':
          return 'settings.subscriptions.errors.invalid_credentials';
        case 'No valid subscription found':
          return 'settings.subscriptions.errors.no_valid_subscription';
        case 'Invalid credentials or no subscriptions found':
          return 'settings.subscriptions.errors.invalid_credentials_or_subscription';
        default:
          break;
      }
    }
    if (statusCode === 409) {
      return 'settings.subscriptions.errors.already_linked';
    }
    return 'settings.subscriptions.errors.unknown_error';
  };

  _renderFirstField = () => {
    const placeholder = get(this.props.data, 'firstField.label');
    const inputClasses = classNames({
      inp: true,
      'inp-text': true,
      'inp-username': true,
      's-error': this.props.error && this.props.statusCode === 403,
    });

    return (
      <Input
        type="text"
        name="username"
        placeholder={placeholder || translate('app.user.id')}
        onChange={this.props.onChangeInput}
        className={inputClasses}
      />
    );
  };

  _renderSecondField = () => {
    const placeholder = get(this.props.data, 'secondField.label');
    const secret = get(this.props.data, 'secondField.secret');
    const inputClasses = classNames({
      inp: true,
      'inp-text': true,
      'inp-password': true,
      's-error': this.props.error && this.props.statusCode === 403,
    });

    return (
      <Input
        type={secret ? 'password' : 'text'}
        name="password"
        placeholder={placeholder || translate('app.user.password')}
        onChange={this.props.onChangeInput}
        className={inputClasses}
      />
    );
  };

  _renderError = () => {
    if (!this.props.error) {
      return null;
    }

    const translationKey = this._getErrorTranslationKey(
      this.props.statusCode,
      this.props.errorMessage,
    );
    return translateElement(<p className="error" />, translationKey, [this.props.providerName]);
  };

  render() {
    return (
      <Dialogue className="dialog-subscription-form">
        <form name="subscription-form" onSubmit={this._onSubmit}>
          <h2>{translate('settings.subscriptions.title')}</h2>
          {translateElement(
            <p />,
            'settings.subscriptions.add_subscription',
            [this.props.providerName],
            false,
          )}
          {this._renderError()}
          <div className="frm-add-subscription">
            {this._renderFirstField()}
            {this._renderSecondField()}
            <Button
              type="submit"
              className="btn-text btn-blendle-icon-green btn-submit"
              loading={this.props.loading}
            >
              {translate('settings.subscriptions.link_subscription')}
            </Button>
          </div>
        </form>
      </Dialogue>
    );
  }
}



// WEBPACK FOOTER //
// ./src/js/app/components/dialogues/SubscriptionForm.js