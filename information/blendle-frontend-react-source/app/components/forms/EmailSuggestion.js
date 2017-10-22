import React from 'react';
import PropTypes from 'prop-types';
import i18n from 'instances/i18n';
import EmailAddress from 'managers/emailaddress';

export default class extends React.Component {
  static propTypes = {
    email: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    delay: PropTypes.number,
  };

  componentWillReceiveProps(newProps) {
    if (this.props.delay) {
      clearTimeout(this._suggestionTimeout);

      this._suggestionTimeout = setTimeout(() => {
        this.setState({
          suggestion: this.getSuggestion(newProps.email),
        });
      }, this.props.delay);

      return;
    }

    this.setState({
      suggestion: this.getSuggestion(newProps.email),
    });
  }

  componentWillUnmount() {
    clearTimeout(this._suggestionTimeout);
  }

  getSuggestion = email => EmailAddress.checkForCommonMistakes(email);

  onClick = () => {
    this.props.onClick(this.state.suggestion);
  };

  state = {
    suggestion: this.getSuggestion(this.props.email),
  };

  render() {
    if (this.state.suggestion) {
      return (
        <div className="v-email-suggestion">
          {i18n.locale.app.did_you_mean}{' '}
          <strong onClick={this.onClick}>{this.state.suggestion}</strong>?
        </div>
      );
    }

    return null;
  }
}



// WEBPACK FOOTER //
// ./src/js/app/components/forms/EmailSuggestion.js