import { kebabCase } from 'lodash';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { status as statusPropType } from 'libs/propTypes';
import { translate, translateElement } from 'instances/i18n';
import PremiumTrialDialogContainer from 'containers/dialogues/PremiumTrialDialogContainer';
import NotificationsHubContainer from 'containers/NotificationsHubContainer';
import { STATUS_INITIAL, STATUS_ERROR, STATUS_OK, STATUS_PENDING } from 'app-constants';
import HideOnScroll from 'components/navigation/HideOnScroll';
import NavigationBarContainer from 'containers/navigation/NavigationBarContainer';
import DeprecatedBrowserWarning from './DeprecatedBrowserWarning';

import CSS from './Application.scss';

const body = document.body;
const html = body.parentNode;
const bodyClassList = body.classList;

function updateClassNames(props) {
  const { user } = props;

  bodyClassList.toggle('s-loggedin', !!user);
  bodyClassList.toggle('s-not-loggedin', !user);
  bodyClassList.remove('s-loading');
  bodyClassList.add('s-success');
}

function updateMetaInformation(languageCode) {
  html.lang = languageCode;
  document.title = translate('app.text.page_title');
}

export default class Application extends Component {
  static propTypes = {
    languageCode: PropTypes.string.isRequired,
    userAgent: PropTypes.object.isRequired,
    status: statusPropType.isRequired,
    user: PropTypes.object,
    content: PropTypes.any,
    navigation: PropTypes.any,
    primaryNavigation: PropTypes.node,
    overlay: PropTypes.any,
    item: PropTypes.any,
    page: PropTypes.any,
    dialogue: PropTypes.any,
    legoDialog: PropTypes.node,
  };

  componentDidMount() {
    const { userAgent } = this.props;
    updateClassNames(this.props);
    updateMetaInformation(this.props.languageCode);

    html.classList.add(
      kebabCase(`device-${userAgent.device.toLowerCase()}`),
      kebabCase(`os-${userAgent.operatingSystem.toLowerCase()}`),
      kebabCase(`browser-${userAgent.browser.toLowerCase()}`),
    );
  }

  componentWillReceiveProps(nextProps) {
    updateClassNames(nextProps);

    if (nextProps.languageCode !== this.props.languageCode) {
      updateMetaInformation(nextProps.languageCode);
    }

    if (!nextProps.content && this.props.content) {
      this.previousContent = this.props.content;
    }

    if (nextProps.overlay) {
      this.previousOverlay = null;
    }

    if (nextProps.item) {
      this.previousItem = null;
    }

    if (nextProps.dialogue || nextProps.overlay) {
      if (!nextProps.overlay && !this.previousOverlay) {
        this.previousOverlay = this.props.overlay;
      }
      if (!nextProps.item && !this.previousItem) {
        this.previousItem = this.props.item;
      }
    }

    if (nextProps.content) {
      if (!nextProps.item && this.previousItem) {
        this.previousItem = null;
      }
      if (!nextProps.overlay && this.previousOverlay) {
        this.previousOverlay = null;
      }
    }
  }

  _getStatusClassName() {
    const map = {
      [STATUS_INITIAL]: 'statusInit',
      [STATUS_OK]: 'statusOk',
      [STATUS_PENDING]: 'statusPending',
      [STATUS_ERROR]: 'statusError',
    };
    return CSS[map[this.props.status]];
  }

  _renderDeprecatedBrowserWarning() {
    if (this.props.userAgent.isDeprecated) {
      return <DeprecatedBrowserWarning />;
    }
    return null;
  }

  _renderArea(className, childNode) {
    if (childNode) {
      return <div className={className}>{childNode}</div>;
    }
    return null;
  }

  _renderPrimaryNavigation() {
    if (this.props.primaryNavigation) {
      return this.props.primaryNavigation;
    }

    if (this.props.content || this.previousContent) {
      return (
        <HideOnScroll>
          <NavigationBarContainer />
          {this.props.navigation}
        </HideOnScroll>
      );
    }

    return null;
  }

  render() {
    return (
      <div id="app" className={this._getStatusClassName()}>
        {this._renderDeprecatedBrowserWarning()}
        <div className="a-main">
          {this._renderPrimaryNavigation()}
          {this._renderArea('a-content', this.props.content || this.previousContent)}
        </div>
        {this._renderArea('a-item l-overlay', this.props.item || this.previousItem)}
        {this._renderArea('a-overlay l-overlay', this.props.overlay || this.previousOverlay)}
        <div className="a-dialogue l-overlay">{this.props.dialogue}</div>
        {this.props.legoDialog}
        {this._renderArea('a-page', this.props.page)}
        {translateElement(<div className="a-footer" />, 'footer.html')}
        <div className="a-tooltips" />
        <NotificationsHubContainer />
        <PremiumTrialDialogContainer />
      </div>
    );
  }
}



// WEBPACK FOOTER //
// ./src/js/app/components/Application/Application.js