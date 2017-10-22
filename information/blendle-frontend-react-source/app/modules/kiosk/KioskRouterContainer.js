import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Auth from 'controllers/auth';
import AltContainer from 'alt-container';
import NewsStandStore from 'stores/NewsStandStore';
import IssuesStore from 'stores/IssuesStore';
import KioskActions from 'actions/KioskActions';
import Analytics from 'instances/analytics';
import KioskContainer from './KioskContainer';

function loadCategory(categoryId) {
  if (categoryId === 'my-issues') {
    if (!NewsStandStore.getState().newsStand) {
      KioskActions.fetchNewsStand.defer(Auth.getId());
    }
    KioskActions.fetchAcquiredIssues.defer(Auth.getId());
  } else {
    KioskActions.fetchKiosk.defer(NewsStandStore.getState().newsStand, categoryId, Auth.getId());
  }
}

function getCategory(category) {
  return category || 'popular';
}

class KioskRouterContainer extends Component {
  static propTypes = {
    params: PropTypes.object.isRequired,
  };

  componentWillMount() {
    const category = getCategory(this.props.params.category);

    Analytics.track('View Kiosk', { category });
    loadCategory(category);
  }

  componentWillReceiveProps({ params }) {
    const nextCategory = getCategory(params.category);

    if (getCategory(this.props.params.category) !== nextCategory) {
      Analytics.track('View Kiosk', { category: nextCategory });
    }

    loadCategory(nextCategory);
  }

  render() {
    return (
      <AltContainer
        stores={{ NewsStandStore, IssuesStore }}
        actions={{ KioskActions }}
        component={KioskContainer}
      />
    );
  }
}

export default KioskRouterContainer;



// WEBPACK FOOTER //
// ./src/js/app/modules/kiosk/KioskRouterContainer.js