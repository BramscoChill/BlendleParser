import React from 'react';
import PropTypes from 'prop-types';
import ModuleNavigationPortal from 'components/moduleNavigation/ModuleNavigationPortal';
import BrowserEnvironment from 'instances/browser_environment';
import { translate } from 'instances/i18n';
import { history } from 'byebye';
import NewsStandStore from 'stores/NewsStandStore';
import IssuesStore from 'stores/IssuesStore';
import { providerById, prefillSelector } from 'selectors/providers';
import IssueNavigationCalendarContainer from 'modules/issue/containers/IssueNavigationCalendarContainer';
import Analytics from 'instances/analytics';
import { getComponents as getNavComponents } from 'helpers/moduleNavigationHelpers';
import ModuleNavigation from 'components/moduleNavigation/ModuleNavigation';
import { sprintf } from 'sprintf-js';

class IssueNavigationContainer extends React.Component {
  static propTypes = {
    issue: PropTypes.object, // is null when loading
    loading: PropTypes.bool.isRequired,
    currentSection: PropTypes.object, // is null when loading
    sections: PropTypes.array,
    hasPremiumAccess: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    sections: [],
  };

  constructor(props) {
    super(props);

    this.state = {
      backButton: null,
      issueNavigation: null,
      datePicker: null,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.loading && this.props.loading) {
      this.setState({
        backButton: this._navigationItemBackButton(),
        issueNavigation: this._navigationItemIssueDropdown(nextProps),
        datePicker: this._navigationItemDatepicker(nextProps),
      });
    }

    if (nextProps.currentSection !== this.props.currentSection) {
      this.setState({
        issueNavigation: this._navigationItemIssueDropdown(nextProps),
      });
    }
  }

  _navigationItemBackButton() {
    const previous = history.getPrevious();
    let category = null;

    if (previous) {
      const curCategoryId = IssuesStore.getState().categoryId;
      const newsStand = NewsStandStore.getState().newsStand;

      if (curCategoryId && newsStand) {
        category = newsStand.categories.find(x => x.id === curCategoryId);
      }
    }

    const isMobile = BrowserEnvironment.isMobile();
    if (category) {
      return {
        label: isMobile ? ' ' : category.title,
        url: `kiosk/${category.id}`,
        className: 'btn btn-back',
      };
    }

    if (previous === '/kiosk/my-issues') {
      return {
        label: isMobile ? ' ' : translate('kiosk.navigation.my_issues'),
        url: 'kiosk/my-issues',
        className: 'btn btn-back',
      };
    }

    const defaultLabel = this.props.hasPremiumAccess
      ? 'Kiosk'
      : translate('kiosk.navigation.popular');

    return {
      label: isMobile ? ' ' : defaultLabel,
      url: 'kiosk',
      className: 'btn btn-back',
    };
  }

  _createSectionChildren(sections, provider, props) {
    return sections.map((section) => {
      const url = `/issue/${provider.id}/${props.issue.id}/${section.name}`;

      return {
        label: section.name,
        url,
        onClick: (e) => {
          e.preventDefault();

          history.navigate(url, { trigger: true });

          Analytics.track('Go To Issue Section', {
            provider: provider.name,
            issue_id: props.issue.id,
            section: sprintf('%s(%s)', section.name, section.pages_index),
          });
        },
      };
    });
  }

  _createSectionsDropdown(props) {
    const provider = prefillSelector(providerById)(props.issue.get('provider').id);
    const { sections } = props;

    if (sections && sections.length > 1) {
      return {
        label: `${provider.name}: ${props.currentSection.name}`,
        className: 'dropdown-sections',
        children: this._createSectionChildren(sections, provider, props),
      };
    }

    return null;
  }

  _navigationItemIssueDropdown(props) {
    if (BrowserEnvironment.isDesktop()) {
      return this._createSectionsDropdown(props);
    }

    return null;
  }

  _navigationItemDatepicker(props) {
    return {
      label: this._getDateLabel(props),
      className: 'menu-datepicker',
      popoutItem: true,
      trustLabelAsHtml: true,
      children: [<IssueNavigationCalendarContainer issue={props.issue} />],
    };
  }

  _getDateLabel(props) {
    if (BrowserEnvironment.isMobile()) {
      return ' ';
    }

    const providerId = props.issue.get('provider').id;
    const provider = prefillSelector(providerById)(providerId);

    return translate('app.issue.more_from_provider', {
      provider: provider.name,
    });
  }

  _renderMobileNavigation(items) {
    return (
      <div className="secondary-navigation">
        <ModuleNavigation noCollapse>{getNavComponents(items)}</ModuleNavigation>
      </div>
    );
  }

  render() {
    const items = [this.state.backButton, this.state.datePicker, this.state.issueNavigation].filter(
      item => item,
    );

    if (BrowserEnvironment.isMobile()) {
      return this._renderMobileNavigation(items);
    }

    if (this.props.loading) {
      return null;
    }

    return <ModuleNavigationPortal items={items} />;
  }
}

export default IssueNavigationContainer;



// WEBPACK FOOTER //
// ./src/js/app/modules/issue/containers/IssueNavigationContainer.js