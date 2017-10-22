import React, { Component } from 'react';
import altConnect from 'higher-order-components/altConnect';
import { isExpired } from 'selectors/subscriptions';
import DefaultNavigationBar from 'components/navigation/DefaultNavigationBar';
import AuthStore from 'stores/AuthStore';
import ModuleNavigationStore from 'stores/ModuleNavigationStore';
import PremiumSubscriptionStore from 'stores/PremiumSubscriptionStore';

class NavigationBarContainer extends Component {
  state = {
    searchOpen: false,
  };

  onToggleSearch = () => {
    this.setState({ searchOpen: !this.state.searchOpen });
  };

  render() {
    const searchOpen = this.state.searchOpen;

    return (
      <DefaultNavigationBar
        {...this.props}
        searchOpen={searchOpen}
        onToggleSearch={this.onToggleSearch}
      />
    );
  }
}

function mapStateToProps(
  {
    authState: { user },
    premiumSubscriptionState: { subscription },
    moduleNavigationState: { activeModule },
  },
  { searchOpen },
) {
  const isLoggedIn = Boolean(user);

  return {
    isLoggedIn,
    searchOpen,
    hasPremiumSubscription: subscription ? !isExpired(subscription) : false,
    isOnSearchRoute: activeModule === 'search',
  };
}

mapStateToProps.stores = { AuthStore, PremiumSubscriptionStore, ModuleNavigationStore };

export default altConnect(mapStateToProps)(NavigationBarContainer);



// WEBPACK FOOTER //
// ./src/js/app/containers/navigation/NavigationBarContainer.js