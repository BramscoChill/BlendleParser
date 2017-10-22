import React from 'react';
import Emails from 'modules/settings/components/Emails';
import Auth from 'controllers/auth.js';
import ErrorDialogue from 'components/dialogues/ErrorDialogue';
import DialoguesController from 'controllers/dialogues';
import Analytics from 'instances/analytics';

function trackAnalytics(property, didOptOut) {
  const optInOut = didOptOut ? 'Opt Out' : 'Opt In';
  const label = property.replace(/_opt_out$/i, '');

  Analytics.track(`${optInOut}: ${label}`);

  return Promise.resolve();
}

function onError(error) {
  const onClose = DialoguesController.openComponent(<ErrorDialogue onClose={() => onClose()} />);

  throw error;
}

export default class EmailsContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      user: Auth.getUser(),
      loadingProperties: [],
      killSwitchLoading: false,
    };
  }

  componentWillMount() {
    this._updateUser = () => {
      this.setState({ user: Auth.getUser() });
    };
    Auth.getUser().on('change', this._updateUser);
  }

  componentWillUnmount() {
    Auth.getUser().off('change', this._updateUser);
  }

  _onToggleOption(propertyName) {
    if (this.state.loadingProperties.includes(propertyName)) {
      return;
    }

    this.setState({
      loadingProperties: this.state.loadingProperties.concat([propertyName]),
    });

    const propertyValue = !this.state.user.get(propertyName);

    this.state.user
      .saveProperty(propertyName, propertyValue)
      .then(() => trackAnalytics(propertyName, propertyValue))
      .then(() =>
        this.setState({
          user: this.state.user,
          loadingProperties: this.state.loadingProperties.filter(name => name !== propertyName),
        }),
      )
      .catch(onError);
  }

  _onToggleKillSwitch() {
    if (this.state.killSwitchLoading) {
      return;
    }

    this.setState({ killSwitchLoading: true });

    const masterOptOut = 'master_opt_out';
    const newValue = !this.state.user.get(masterOptOut);

    this.state.user
      .saveProperty(masterOptOut, newValue)
      .then(() => trackAnalytics(masterOptOut, newValue))
      .then(() => Auth.renewJWT()) // Refresh user to get all opt_outs
      .then(() => Auth.fetchUser())
      .then(user =>
        this.setState({
          user,
          killSwitchLoading: false,
        }),
      )
      .catch(onError);
  }

  render() {
    return (
      <Emails
        user={this.state.user}
        onToggleOption={e => this._onToggleOption(e)}
        loadingProperties={this.state.loadingProperties}
        onToggleKillSwitch={() => this._onToggleKillSwitch()}
        killSwitchLoading={this.state.killSwitchLoading}
      />
    );
  }
}



// WEBPACK FOOTER //
// ./src/js/app/modules/settings/containers/EmailsContainer.js