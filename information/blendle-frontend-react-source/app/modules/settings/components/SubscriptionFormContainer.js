import React from 'react';
import PropTypes from 'prop-types';
import { sprintf } from 'sprintf-js';
import SubscriptionsManager from 'managers/subscriptions';
import SubscriptionsFormDialogue from 'components/dialogues/SubscriptionForm';

export default class extends React.Component {
  static propTypes = {
    provider: PropTypes.object.isRequired,
    data: PropTypes.object.isRequired,
    onSuccess: PropTypes.func.isRequired,
  };

  state = {
    username: null,
    password: null,
    error: null,
    statusCode: null,
  };

  _addSubscription = (username, password) => {
    const provider = this.props.provider;

    let addSubscriptionDefer;
    if (this.props.data.authUri) {
      const authUri = sprintf(this.props.data.authUri, username, password);
      addSubscriptionDefer = () =>
        SubscriptionsManager.addSubscriptionWithAuthURI(provider.id, authUri);
    } else {
      addSubscriptionDefer = () =>
        SubscriptionsManager.addSubscriptionWithUsernameAndPassword(
          provider.id,
          username,
          password,
        );
    }

    this.setState({
      loading: true,
    });

    addSubscriptionDefer()
      .then(() => {
        if (this.props.onSuccess && this.props.onSuccess() === false) {
          this.setState({
            renderNull: true,
          });
        }

        this.setState({
          loading: false,
        });
      })
      .catch((err) => {
        this.setState({
          error: true,
          statusCode: err.status,
          loading: false,
          message: err.data.message,
        });
      });
  };

  _onChangeInput = (e) => {
    this.setState({
      error: false,
      [e.target.name]: e.target.value,
    });
  };

  _onClickAdd = () => {
    let username = this.state.username;
    let password = this.state.password;

    if (this.props.data.firstField && this.props.data.firstField.filter) {
      username = this.props.data.firstField.filter(this.state.username);
    }

    if (this.props.data.secondField && this.props.data.secondField.filter) {
      password = this.props.data.secondField.filter(password);
    }

    this._addSubscription(username, password);
  };

  render() {
    if (this.state.renderNull) {
      return null;
    }

    return (
      <SubscriptionsFormDialogue
        providerName={this.props.provider.name}
        data={this.props.data}
        loading={this.state.loading}
        error={this.state.error}
        statusCode={this.state.statusCode}
        errorMessage={this.state.message}
        onChangeInput={this._onChangeInput}
        onClickSubmit={this._onClickAdd}
      />
    );
  }
}



// WEBPACK FOOTER //
// ./src/js/app/modules/settings/components/SubscriptionFormContainer.js