import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import AltContainer from 'alt-container';
import AuthStore from 'stores/AuthStore';
import AlertsStore from 'stores/AlertsStore';
import AlertsActions from 'actions/AlertsActions';
import AddAlert from './components/AddAlert';

export default class AddAlertContainer extends PureComponent {
  static propTypes = {
    layout: PropTypes.oneOf(['button', 'link']),
    alert: PropTypes.string,
  };

  _onAdd = () => {
    const userId = AuthStore.getState().user.id;
    const { alert } = this.props;

    AlertsActions.addAlert(userId, alert, false);
  };

  // eslint-disable-next-line react/prop-types
  _renderAddAlert = ({ alertsState }) => (
    <AddAlert layout={this.props.layout} status={alertsState.addAlertStatus} onAdd={this._onAdd} />
  );

  render() {
    return <AltContainer stores={{ alertsState: AlertsStore }} render={this._renderAddAlert} />;
  }
}



// WEBPACK FOOTER //
// ./src/js/app/modules/search/AddAlertContainer.js