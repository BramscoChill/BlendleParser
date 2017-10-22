import React, { Component } from 'react';
import { compose } from 'recompose';
import altConnect from 'higher-order-components/altConnect';
import withViewportSize from 'higher-order-components/withViewportSize';
import { getException } from 'helpers/countryExceptions';
import hasPrivateLabAccess from 'helpers/hasPrivateLabAccess';
import AuthStore from 'stores/AuthStore';
import Analytics from 'instances/analytics';
import Sidebar from '../components/Sidebar';
import SidebarButton from '../components/SidebarButton';

class SidebarContainer extends Component {
  state = {
    isCollapsed: true,
  };

  toggleIsCollapsed = () => {
    const isCollapsed = !this.state.isCollapsed;
    this.setState({ isCollapsed });

    Analytics.track(`Sidebar ${isCollapsed ? 'Closed' : 'Opened'}`, {
      internal_location: 'settings',
    });
  };

  render() {
    // Only collaps on mobile screens
    const { isMobileViewport } = this.props;
    const isCollapsed = isMobileViewport && this.state.isCollapsed;

    return (
      <div>
        {isMobileViewport && (
          <SidebarButton onClick={this.toggleIsCollapsed} isCollapsed={isCollapsed} />
        )}
        <Sidebar
          balance={this.props.balance}
          labEnabled={this.props.labsEnabled}
          onClickSidebar={this.toggleIsCollapsed}
          isCollapsed={isCollapsed}
        />
      </div>
    );
  }
}

function mapStateToProps({ authState }) {
  const { user } = authState;

  const balance = user.get('balance');
  const labsEnabled = getException('showPublicLab', false) || hasPrivateLabAccess(user);

  return {
    balance,
    labsEnabled,
  };
}

mapStateToProps.stores = { AuthStore };

const enhance = compose(withViewportSize({ debounce: 100 }), altConnect(mapStateToProps));

export default enhance(SidebarContainer);



// WEBPACK FOOTER //
// ./src/js/app/modules/settings/containers/SidebarContainer.js