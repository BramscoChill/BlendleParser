import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AltContainer from 'alt-container';
import PagesIssue from 'modules/issue/components/PagesIssue';
import IssuesStore from 'stores/IssuesStore';
import AuthStore from 'stores/AuthStore';
import Settings from 'controllers/settings';
import Analytics from 'instances/analytics';
import axios from 'axios';
import ModuleNavigationPortal from 'components/moduleNavigation/ModuleNavigationPortal';
import IssueNavigationContainer from 'modules/issue/containers/IssueNavigationContainer';
import BrowserEnvironment from 'instances/browser_environment';
import { throttle, get, find, first } from 'lodash';
import { hasAccessToPremiumFeatures } from 'helpers/premiumEligibility';

class PagesIssueContainer extends Component {
  static propTypes = {
    issue: PropTypes.object.isRequired,
    section: PropTypes.string,
  };

  constructor(props) {
    super(props);

    this._onPageChange = throttle(this._onPageChange.bind(this), 500);

    this.state = {
      pages: [],
      sections: [],
      popularItems: [],
      loadingPages: true,
      next: null,
      navigateToSectionIndex: 0,
      currentSection: undefined,
      issueAcquisition: null,
    };
  }

  componentDidMount() {
    const { issue } = this.props;

    axios
      .get(issue._links.pages.href)
      .then(response => response.data)
      .then(({ pages, sections, _links }) =>
        this.setState({
          pages,
          sections,
          next: get(_links, 'next.href', null),
          currentSection: find(sections, { name: this.props.section }) || first(sections),
          loadingPages: false,
        }),
      )
      .then(() => {
        if (this.props.section && this.state.currentSection) {
          this._onNavigateToSection(this.state.currentSection);
        }
      });

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

  componentWillReceiveProps(nextProps) {
    if (nextProps.section !== this.props.section) {
      const section = find(this.state.sections, { name: nextProps.section });
      this._onNavigateToSection(section);
    }
  }

  componentWillUnmount() {
    this._onPageChange.cancel();
  }

  _onNavigateToSection(section) {
    if (!section) {
      return;
    }

    const { pages } = this.state;

    if (pages.length < pages.pages_index) {
      this._onFetchNext(this._onNavigateToSection.bind(this, section));
      return;
    }

    this.setState({
      navigateToSectionIndex: section.pages_index + 1,
      currentSection: section,
    });
  }

  _onFetchNext = (cb) => {
    if (!this.state.next || this.state.loadingPages) {
      return;
    }

    this.setState({ loadingPages: true }, () =>
      axios
        .get(this.state.next)
        .then(response => response.data)
        .then(({ pages, sections, _links }) =>
          this.setState(
            {
              pages: this.state.pages.concat(pages),
              sections,
              next: get(_links, 'next.href', null),
              loadingPages: false,
            },
            typeof cb === 'function' ? cb : undefined,
          ),
        ),
    );
  };

  _onEnd = () => {
    if (!this.state.loadingPages && this.state.next === null) {
      Analytics.track('Scroll To End', {
        orientation: 'horizontal',
        type: 'issue',
      });
    }
  };

  _onPageChange(visibleRange) {
    const { pages, sections } = this.state;
    if (pages.length === 0 || sections.length === 0) {
      return;
    }

    const pagesIndexes = sections.map(section => section.pages_index);
    const elementIndex = visibleRange[0];

    // Get index for page
    const pageIndex = pagesIndexes.filter(i => i <= elementIndex).pop();

    let currentSection = find(sections, { pages_index: pageIndex });
    if (currentSection === undefined) {
      currentSection = first(sections);
    }

    // Performance check, should be removed when moved to flux
    if (this.state.currentSection !== currentSection) {
      this.setState({ currentSection });
    }
  }

  _renderNavigation(authState) {
    return (
      <IssueNavigationContainer
        issue={this.props.issue}
        loading={this.state.pages.length === 0}
        currentSection={this.state.currentSection}
        sections={this.state.sections}
        hasPremiumAccess={hasAccessToPremiumFeatures(authState.user)}
      />
    );
  }

  _renderIssue = ({ issuesState, authState }) => {
    const ready = this.state.pages.length > 0;

    return (
      <div className="v-issue-browser">
        {!BrowserEnvironment.isMobile() ? (
          this._renderNavigation(authState)
        ) : (
          <ModuleNavigationPortal items={[]} />
        )}
        <PagesIssue
          issue={this.props.issue}
          loading={!ready}
          onPageChange={this._onPageChange}
          navigateToSectionIndex={this.state.navigateToSectionIndex}
          disabled={!issuesState.visible}
          onScroll={this._onPageChange}
          onNearEnd={this._onFetchNext}
          onEnd={this._onEnd}
          pages={this.state.pages}
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
        stores={{ issuesState: IssuesStore, authState: AuthStore }}
        render={this._renderIssue}
      />
    );
  }
}

export default PagesIssueContainer;



// WEBPACK FOOTER //
// ./src/js/app/modules/issue/containers/PagesIssueContainer.js