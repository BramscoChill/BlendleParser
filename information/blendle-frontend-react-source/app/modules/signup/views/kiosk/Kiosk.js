const _ = require('lodash');
const React = require('react');
const createReactClass = require('create-react-class');
const PropTypes = require('prop-types');
const features = require('config/features');
const Analytics = require('instances/analytics');
const BrowserEnv = require('instances/browser_environment');
const formMixin = require('../mixins/formMixin');
const classNames = require('classnames');
const FontsHelper = require('helpers/fonts');
const logPerformance = require('helpers/logPerformance');
const SelectableIssue = require('./SelectableIssue');
const IssuesGroup = require('./IssuesGroup');
const SubmitPaneButton = require('../SubmitPaneButton');
const StickySubmitPaneButton = require('../StickySubmitPaneButton');
const i18n = require('instances/i18n');
const getException = require('helpers/countryExceptions').getException;

const KioskView = createReactClass({
  displayName: 'KioskView',

  propTypes: {
    disabled: PropTypes.bool,
    selection: PropTypes.array,

    popularIssues: PropTypes.array,
    femaleIssues: PropTypes.array,
    maleIssues: PropTypes.array,
    internationalIssues: PropTypes.array,
    specialInterestIssues: PropTypes.array,

    onSelect: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
  },

  mixins: [formMixin],

  getDefaultProps() {
    return {
      popularIssues: [],
      selection: [],
      issues: {},
    };
  },

  getInitialState() {
    return {
      fontsLoaded: false,
      categories: {
        Premium: {
          title: i18n.translateElement('signup.kiosk.category.premium'),
          className: 'popular',
          full: true,
        },
        Woman: {
          title: i18n.translateElement('signup.kiosk.category.women'),
          className: 'woman',
        },
        Man: {
          title: i18n.translateElement('signup.kiosk.category.men'),
          className: 'man',
        },
        'Special Interest': {
          title: i18n.translateElement('signup.kiosk.category.special'),
          className: 'special-interest',
        },
        International: {
          title: i18n.translateElement('signup.kiosk.category.int'),
          className: 'international',
        },
        Regional: {
          title: i18n.translateElement('signup.kiosk.category.regional'),
          className: 'regional',
        },
        Newspaper: {
          title: i18n.translateElement('signup.kiosk.category.newspaper'),
          className: 'newspaper',
        },
        Magazine: {
          title: i18n.translateElement('signup.kiosk.category.magazine'),
          className: 'magazine',
        },
      },
    };
  },

  componentDidMount() {
    FontsHelper.load(
      [
        { family: 'Proxima Nova', weight: 300, style: 'normal' },
        { family: 'Proxima Nova', weight: 600, style: 'normal' },
      ],
      1000,
    )
      .then(() => this.isMounted() && this.setState({ fontsLoaded: true }))
      .catch(() => this.isMounted() && this.setState({ fontsLoaded: true }));
  },

  componentDidUpdate() {
    if (this.state.fontsLoaded && Object.keys(this.props.issues).length) {
      logPerformance.applicationReady('SignUp Kiosk');
    }
  },

  /**
   * when an issue is being selected
   * @param {String} providerId
   * @param {ClickEvent} ev
   * @private
   */
  _onSelect(providerId, ev) {
    let label = 'Add Favorite';
    if (!ev.target.checked) {
      label = 'Remove Favorite';
    }

    Analytics.track(label, {
      provider_id: providerId,
      type: 'signup',
    });

    this.props.onSelect(ev.target.checked, providerId);

    // wait for a small moment to show the submit button for a better UX
    setTimeout(() => {
      if (this.refs.stickySubmit) {
        this.refs.stickySubmit.updateVisiblity();
      }
    }, 500);
  },

  render() {
    const footer = document.querySelector('.kiosk-footer');

    let issueGroups;
    if (getException('mergeOnboardingPublications', false)) {
      const allIssues = _.flatten(_.map(this.props.issues, issues => issues.models));
      issueGroups = [this._renderIssueGroup('Premium', allIssues, this.state.categories.Premium)];
    } else {
      issueGroups = _.map(this.props.issues, (issues, key) => {
        if (!issues.length) {
          return;
        } else if (footer && !footer.classList.contains('loaded')) {
          footer.classList.add('loaded');
        }
        return this._renderIssueGroup(key + i18n.getLocale(), issues, this.state.categories[key]);
      });
    }

    let stickySubmit;
    let defaultSubmit;

    if (issueGroups.length) {
      defaultSubmit = <SubmitPaneButton loading={this.state.loading} ref="submit" />;
      stickySubmit = (
        <StickySubmitPaneButton
          ref="stickySubmit"
          disabled={this.props.disabled}
          onClick={this.onSubmit}
          loading={this.state.loading}
        />
      );
    }

    const className = classNames('v-signup-kiosk', 'slide-animation', {
      'l-fonts-loaded': this.state.fontsLoaded,
    });

    return (
      <form className={className} onSubmit={this.onSubmit}>
        <div className="kiosk-body">
          {i18n.translateElement(<h2 />, 'signup.kiosk.intro', false)}
          {i18n.translateElement(<h3 className="sub" />, 'signup.kiosk.sub_intro', false)}
          <div className="providers-list">{issueGroups}</div>
          {defaultSubmit}
          {i18n.translateElement(<ul className="kiosk-footer" />, 'signup.kiosk.footer', false)}
        </div>

        {stickySubmit}
      </form>
    );
  },

  _renderIssue(issue, providerId) {
    return (
      <li key={`issue-${issue.id}`}>
        <SelectableIssue
          issue={issue}
          height={BrowserEnv.isMobile() ? 115 : 180}
          selected={this.props.selection.indexOf(providerId) > -1}
          onChange={this._onSelect.bind(this, providerId)}
          disabled={this.props.disabled}
        />
      </li>
    );
  },

  _renderIssueGroup(key, issues, category) {
    const listIssues = issues.map(issue => this._renderIssue(issue, issue.get('provider').id));
    return (
      <IssuesGroup
        full={category.full && !BrowserEnv.isMobile()}
        className={category.className}
        title={category.title}
        key={key}
      >
        {listIssues}
      </IssuesGroup>
    );
  },
});

module.exports = KioskView;



// WEBPACK FOOTER //
// ./src/js/app/modules/signup/views/kiosk/Kiosk.js