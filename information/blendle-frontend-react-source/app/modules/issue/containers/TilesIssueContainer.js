import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AltContainer from 'alt-container';
import IssuesStore from 'stores/IssuesStore';
import TilesStore from 'stores/TilesStore';
import AuthStore from 'stores/AuthStore';
import TilesIssue from 'modules/issue/components/TilesIssue';
import Analytics from 'instances/analytics';
import BrowserEnvironment from 'instances/browser_environment';
import Settings from 'controllers/settings';
import axios from 'axios';
import { get } from 'lodash';
import { getTimelineTiles } from 'selectors/tiles';
import TileActions from 'actions/TileActions';
import ModuleNavigationPortal from 'components/moduleNavigation/ModuleNavigationPortal';
import IssueNavigationContainer from 'modules/issue/containers/IssueNavigationContainer';
import { hasAccessToPremiumFeatures } from 'helpers/premiumEligibility';

class TilesIssueContainer extends Component {
  static propTypes = {
    issue: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      itemIds: props.issue.get('items'),
      popularItems: [],
      next: null,
      loadingTiles: false,
      initialLoading: true,
    };
  }

  componentDidMount() {
    const { issue } = this.props;

    this.state.itemIds.forEach(itemId =>
      TileActions.fetchTile(AuthStore.getState().user.id, itemId),
    );

    axios
      .get(issue.getLink('items'))
      .then(response => get(response, 'data._links.next.href', null))
      .then(next => this.setState({ next, initialLoading: false }));

    const popularLink = Settings.getLink('issue_items', {
      issue_id: issue.id,
      sort: 'popular',
      limit: 3,
    });

    axios
      .get(popularLink)
      .then(response => get(response, 'data._embedded.items', []))
      .then(popularItems => this.setState({ popularItems }));
  }

  _onFetchNext = () => {
    if (this.state.next && !this.state.loadingTiles) {
      this.setState({ loadingTiles: true }, () =>
        axios
          .get(this.state.next)
          .then(response => ({
            next: get(response, 'data._links.next.href', null),
            itemIds: get(response, 'data._embedded.items', []).map(item => item.id),
          }))
          .then(({ next, itemIds }) => {
            this.setState({
              next,
              itemIds: this.state.itemIds.concat(itemIds),
              loadingTiles: false,
            });

            itemIds.forEach(itemId => TileActions.fetchTile(AuthStore.getState().user.id, itemId));
          }),
      );
    }
  };

  _onEnd = () => {
    if (!this.state.loadingTiles && this.state.next === null) {
      Analytics.track('Scroll To End', {
        orientation: BrowserEnvironment.isMobile() ? 'vertical' : 'horizontal',
        type: 'issue',
      });
    }
  };

  _renderNavigation(authState) {
    return (
      <IssueNavigationContainer
        issue={this.props.issue}
        loading={this.state.initialLoading}
        hasPremiumAccess={hasAccessToPremiumFeatures(authState.user)}
      />
    );
  }

  _renderIssue = ({ issuesState, tilesState, authState }) => {
    const ready = this.state.itemIds.length > 0;

    return (
      <div className="v-issue-browser">
        {!BrowserEnvironment.isMobile() ? (
          this._renderNavigation(authState)
        ) : (
          <ModuleNavigationPortal items={[]} />
        )}
        <TilesIssue
          issue={this.props.issue}
          loading={!ready}
          disabled={!issuesState.visible}
          onNearEnd={this._onFetchNext}
          onEnd={this._onEnd}
          tiles={getTimelineTiles(tilesState.tiles, this.state.itemIds)}
          popularItems={this.state.popularItems}
          mobileNavigation={
            BrowserEnvironment.isMobile() ? (
              this._renderNavigation(authState)
            ) : (
              <ModuleNavigationPortal items={[]} />
            )
          }
        />
      </div>
    );
  };

  render() {
    return (
      <AltContainer
        stores={{ issuesState: IssuesStore, tilesState: TilesStore, authState: AuthStore }}
        render={this._renderIssue}
      />
    );
  }
}

export default TilesIssueContainer;



// WEBPACK FOOTER //
// ./src/js/app/modules/issue/containers/TilesIssueContainer.js