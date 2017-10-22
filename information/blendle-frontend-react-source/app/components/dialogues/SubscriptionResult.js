import React from 'react';
import PropTypes from 'prop-types';
import Auth from 'controllers/auth';
import { translate, translateElement } from 'instances/i18n';
import Dialogue from 'components/dialogues/Dialogue';
import Header from 'components/dialogues//Header';
import ProviderImage from 'components/ProviderImage';
import Button from 'components/Button';

export default class extends React.Component {
  static propTypes = {
    onClickButton: PropTypes.func.isRequired,
    status: PropTypes.string.isRequired,
    provider: PropTypes.object.isRequired,
  };

  _onClickButton = (e) => {
    this.props.onClickButton(e);
  };

  _getErrorTranslationKey = (status) => {
    if (status === 'already_linked') {
      return 'settings.subscriptions.errors.already_linked';
    }
    if (status === 'no_valid_subscription') {
      return 'settings.subscriptions.errors.no_valid_subscription';
    }
    return 'dialogues.subscription_result.failure_message';
  };

  _renderSuccess = () => (
    <div className="dialog-content s-success">
      <ProviderImage provider={this.props.provider} />
      <h2 className="title">{translate('dialogues.subscription_result.success_title')}</h2>
      <Button className="btn-submit btn-green" onClick={this._onClickButton}>
        {translate('dialogues.subscription_result.success_button')}
      </Button>
    </div>
  );

  _renderErrorMessage = () => {
    const translationKey = this._getErrorTranslationKey(this.props.status);
    return translateElement(<p className="message" />, translationKey, [this.props.provider.name]);
  };

  _renderError = () => (
    <div className="dialog-content s-error">
      <ProviderImage provider={this.props.provider} />
      <h2 className="title">{translate('dialogues.subscription_result.failure_title')}</h2>
      {this._renderErrorMessage()}
      <Button className="btn-submit" onClick={this._onClickButton}>
        {translate('dialogues.subscription_result.failure_button')}
      </Button>
    </div>
  );

  _renderContent = () => {
    if (this.props.status !== 'success') {
      return this._renderError();
    }
    return this._renderSuccess();
  };

  render() {
    return (
      <Dialogue className="dialog-subscription-result" ref="dialog">
        <Header user={Auth.getUser()} />
        {this._renderContent()}
      </Dialogue>
    );
  }
}



// WEBPACK FOOTER //
// ./src/js/app/components/dialogues/SubscriptionResult.js