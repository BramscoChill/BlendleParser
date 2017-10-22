import React from 'react';
import PropTypes from 'prop-types';
import Analytics from 'instances/analytics';
import { STATUS_OK, STATUS_PENDING, STATUS_ERROR } from 'app-constants';
import { translate } from 'instances/i18n';
import withRouter from 'react-router/lib/withRouter';
import BrowserEnv from 'instances/browser_environment';
import TilePane from 'components/TilePane';
import Select from 'components/Select';
import CoverTile from 'components/tiles/CoverTile';
import { sortedIssues } from 'selectors/issues';

class KioskContainer extends React.Component {
  static propTypes = {
    IssuesStore: PropTypes.object,
    KioskActions: PropTypes.object,
    NewsStandStore: PropTypes.object,
    router: PropTypes.object.isRequired,
  };

  componentWillMount() {
    this._scrollPosition = this.props.IssuesStore.scrollPosition;
    this._endReachedOnMobile = false;
  }

  componentDidUpdate() {
    if (this._isLoading()) {
      this._endReachedOnMobile = false;
    }
  }

  componentWillUnmount() {
    this.props.KioskActions.rememberScrollPosition(this._scrollPosition);
  }

  _isLoading() {
    return this.props.IssuesStore.status === STATUS_PENDING;
  }

  _onClickCover(index) {
    this._scrollPosition = index;
  }

  _onScroll(visibleRange) {
    this._scrollPosition = visibleRange[0];

    this._onEndForMobile(visibleRange);
  }

  _onEndForMobile(visibleRange) {
    if (!BrowserEnv.isMobile()) {
      return;
    }

    // react list send the incorrect visibleRange for the mobile kiosk view. It calculates the
    // visible index based on the heights of all the precending tiles. the mobile kiosk shows two
    // covers next to each other, which causes this to be incorrect.
    // Will be fixed when the SmartGrid is being used, which renders rows as tiles.
    const lastIndex = Math.ceil(visibleRange[1] * 2);
    const issues = this.props.IssuesStore.issues;

    if (!this._endReachedOnMobile && lastIndex >= issues.length - 1 && !this._isLoading()) {
      this._endReachedOnMobile = true;
      this._onScrollEndReached();
    }
  }

  _onScrollEndReached() {
    if (!this._isLoading()) {
      Analytics.track('Scroll To End', {
        orientation: BrowserEnv.isMobile() ? 'vertical' : 'horizontal',
        type: 'kiosk',
      });
    }
  }

  _onNearEnd() {
    if (!this._isLoading() && this.props.IssuesStore.categoryId === 'my-issues') {
      const myIssues = this.props.IssuesStore.issues;
      this.props.KioskActions.fetchNextAcquiredIssues(myIssues);
    }
  }

  _renderEmptyMyIssues() {
    return (
      <div key="empty-my-issues" className="tile-pane-message tile-pane-empty">
        <h1 dangerouslySetInnerHTML={{ __html: translate('kiosk.no_acquired_issues.title') }} />
        <p>{translate('kiosk.no_acquired_issues.message')}</p>
      </div>
    );
  }

  _renderKioskSelect(newsStand) {
    if (!newsStand || !newsStand.categories) {
      return null;
    }

    return (
      <Select onChange={value => this.props.router.push(value)}>
        <option key="popular" value="kiosk">
          {translate('kiosk.navigation.popular')}
        </option>
        <option key="my-issues" value="kiosk/my-issues">
          {translate('kiosk.navigation.my_issues')}
        </option>
        {newsStand.categories.map(category => (
          <option key={category.id} value={`kiosk/${category.id}`}>
            {category.title}
          </option>
        ))}
      </Select>
    );
  }

  _renderKioskContent() {
    const issuesStore = this.props.IssuesStore;
    let content;

    if (issuesStore.issues && issuesStore.issues.length > 0) {
      let issues = issuesStore.issues;

      if (issues.url.indexOf('most_recent.json') === -1 && issues.url.indexOf('issues') === -1) {
        // Do not sort issues in most_recent or in acquired issues
        issues = sortedIssues(issues);
      }
      content = issues
        .filter(issue => issue.getCoverKey())
        .map((issue, index) => (
          <CoverTile key={issue.id} issue={issue} onClick={this._onClickCover.bind(this, index)} />
        ));
    } else if (!this._isLoading() && issuesStore.status === STATUS_ERROR) {
      content = [
        <p key="message" className="tile-pane-message">
          {translate('kiosk.errors.id_not_found')}
        </p>,
      ];
    } else if (
      !this._isLoading() &&
      issuesStore.status === STATUS_OK &&
      issuesStore.categoryId === 'my-issues'
    ) {
      return this._renderEmptyMyIssues();
    }

    return (
      <TilePane
        className="kiosk-list"
        showButtons={!!BrowserEnv.isDesktop()}
        active={this.props.NewsStandStore.active}
        loading={this._isLoading()}
        initialIndex={issuesStore.scrollPosition}
        orientation={BrowserEnv.isMobile() ? 'vertical' : 'horizontal'}
        onScroll={this._onScroll.bind(this)}
        onEnd={this._onScrollEndReached.bind(this)}
        onNearEnd={this._onNearEnd.bind(this)}
      >
        {content}
      </TilePane>
    );
  }

  render() {
    const { NewsStandStore } = this.props;

    return (
      <div>
        {BrowserEnv.isMobile() && this._renderKioskSelect(NewsStandStore.newsStand)}
        {this._renderKioskContent()}
      </div>
    );
  }
}

export default withRouter(KioskContainer);



// WEBPACK FOOTER //
// ./src/js/app/modules/kiosk/KioskContainer.js