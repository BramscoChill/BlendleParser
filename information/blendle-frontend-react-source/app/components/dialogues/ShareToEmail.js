import React from 'react';
import PropTypes from 'prop-types';
import { STATUS_INITIAL, STATUS_OK, STATUS_ERROR, STATUS_PENDING, keyCode } from 'app-constants';
import { translate } from 'instances/i18n';
import Dialogue from 'components/dialogues/Dialogue';
import classNames from 'classnames';
import { isMultipleEmails } from 'helpers/validate';
import { isMobile } from 'instances/browser_environment';
import { Form } from '@blendle/lego';

class ShareToEmailDialogue extends React.Component {
  static propTypes = {
    onSubmit: PropTypes.func,
    onClose: PropTypes.func,
    defaultMessage: PropTypes.string,
    status: PropTypes.number,
  };

  static defaultProps = {
    defaultMessage: '',
  };

  constructor(props) {
    super(props);
    this.state = {
      to: '',
      message: this.props.defaultMessage,
      error: null,
      result: STATUS_INITIAL,
    };
  }

  _validateInput() {
    let error = null;
    if (!this.state.to.trim().length) {
      error = translate('dialogues.share_email.error.at_least_one');
    } else if (!isMultipleEmails(this.state.to)) {
      error = translate('dialogues.share_email.error.incorrect');
    }

    return error;
  }

  _onToBlur() {
    if (this.state.to.length || this.state.error) {
      this.setState({
        error: this._validateInput(),
      });
    }
  }

  _onChangeTo(ev) {
    this.setState({
      to: ev.target.value,
      error: null,
    });
  }

  _onKeyPress(ev) {
    if (ev.charCode === keyCode.RETURN) {
      this._onSubmit();
    }
  }

  _onChangeMessage(ev) {
    this.setState({
      message: ev.target.value,
    });
  }

  _onSubmit() {
    const validationError = this._validateInput();
    if (validationError) {
      this.setState({
        error: validationError,
      });
      return;
    }

    const emails = this.state.to
      .trim()
      .split(/\s?[;,\s]\s?/)
      .filter(Boolean);
    this.props.onSubmit(emails, this.state.message);
  }

  _renderError(error) {
    if (!error) {
      return null;
    }

    return <div className="error-message visible">{error}</div>;
  }

  _renderBody() {
    let submitErrorText = '';
    if (this.props.status === STATUS_ERROR) {
      submitErrorText = translate('app.error.server');
    }

    const submitButtonClassNames = classNames('btn', 'btn-text', 'btn-submit', 'btn-fullwidth', {
      's-inactive': this.state.error,
      's-loading': this.props.status === STATUS_PENDING,
    });

    return (
      <Form name="share-to-email" onSubmit={() => this._onSubmit()}>
        <h2 className="title">{translate('dialogues.share_email.title')}</h2>
        <div className="frm frm-share-to-email">
          <label className="frm-field-wrapper">
            {translate('dialogues.share_email.recipient.title')}
            <input
              className={classNames('inp', 'inp-text', { 's-error': this.state.error })}
              type="text"
              name="recipient"
              onKeyPress={ev => this._onKeyPress(ev)}
              onChange={ev => this._onChangeTo(ev)}
              onBlur={() => this._onToBlur()}
              value={this.state.to}
              autoCapitalize="off"
              autoFocus={!isMobile()}
              autoCorrect="off"
              placeholder={translate('dialogues.share_email.recipient.placeholder')}
            />
            {this._renderError(this.state.error)}
          </label>
          <label className="frm-field-wrapper">
            {translate('dialogues.share_email.message.title')}
            <textarea
              className="inp inp-textarea inp-message"
              value={this.state.message}
              onChange={ev => this._onChangeMessage(ev)}
              name="message"
              placeholder={translate('dialogues.share_email.message.placeholder')}
            />
          </label>
          <div className="frm-field-wrapper">
            <button type="submit" className={submitButtonClassNames}>
              {translate('dialogues.share_email.submit')}
            </button>
            {this._renderError(submitErrorText)}
          </div>
        </div>
      </Form>
    );
  }

  _renderResult() {
    const classes = classNames('result', { success: this.props.status === STATUS_OK });

    return (
      <div className={classes}>
        <div className="container">
          <div className="check" />
          <span className="message">{translate('dialogues.share_email.success')}</span>
        </div>
      </div>
    );
  }

  render() {
    return (
      <Dialogue {...this.props} className="shareToEmail">
        {this._renderBody()}
        {this._renderResult()}
      </Dialogue>
    );
  }
}

export default ShareToEmailDialogue;



// WEBPACK FOOTER //
// ./src/js/app/components/dialogues/ShareToEmail.js