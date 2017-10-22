import React from 'react';
import PropTypes from 'prop-types';
import AltContainer from 'alt-container';
import AlertsNavigation from 'modules/alerts/components/AlertsNavigation';
import AlertManageDialog from 'modules/alerts/components/AlertManageDialog';
import AlertsStore from 'stores/AlertsStore';

class AlertsNavigationContainer extends React.Component {
  static propTypes = {
    query: PropTypes.string,
    onClickDelete: PropTypes.func.isRequired,
  };

  state = {
    showManageDialog: false,
  };

  _onClickMobileSettings() {
    this.setState({ showManageDialog: true });
  }

  _renderManageDialog(store) {
    if (!this.state.showManageDialog) {
      return null;
    }

    return (
      <AlertManageDialog
        alert={store.alert}
        onClose={() => this.setState({ showManageDialog: false })}
        onClickDelete={() => {
          this.props.onClickDelete();
          this.setState({ showManageDialog: false });
        }}
      />
    );
  }

  render() {
    return (
      <AltContainer
        store={AlertsStore}
        render={store => (
          <AlertsNavigation
            query={this.props.query}
            alertsStore={store}
            onClickMobileSettings={this._onClickMobileSettings.bind(this)}
          >
            {this._renderManageDialog(store)}
          </AlertsNavigation>
        )}
      />
    );
  }
}

export default AlertsNavigationContainer;



// WEBPACK FOOTER //
// ./src/js/app/modules/alerts/AlertsNavigationContainer.js