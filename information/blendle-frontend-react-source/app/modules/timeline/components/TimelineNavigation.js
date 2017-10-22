import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import BrowserEnv from 'instances/browser_environment';
import ModuleNavigationActions from 'actions/ModuleNavigationActions';
import FollowChannels from './FollowChannels';
import { translate } from 'instances/i18n';
import TimelineManager from 'managers/timeline';
import { history } from 'byebye';
import ModuleNavigation from 'components/moduleNavigation/ModuleNavigation';
import { getComponents } from 'helpers/moduleNavigationHelpers';
import { get } from 'lodash';

function unmountChannelsOverlay() {
  ReactDOM.unmountComponentAtNode(document.querySelector('.a-tooltips'));
}

export default class TimelineNavigation extends PureComponent {
  static propTypes = {
    timeline: PropTypes.object,
    channels: PropTypes.any.isRequired,
    onChannelsChange: PropTypes.func.isRequired,
    kioskCategories: PropTypes.array.isRequired,
  };

  constructor() {
    super();

    this.state = {
      channelsOverlayVisible: false,
    };
  }

  componentDidMount() {
    window.addEventListener('click', this._onWindowClick);
  }

  componentWillUnmount() {
    window.removeEventListener('click', this._onWindowClick);
    if (this.state.channelsOverlayVisible) {
      unmountChannelsOverlay();
    }
  }

  _onWindowClick = () => {
    if (this.state.channelsOverlayVisible) {
      ModuleNavigationActions.setActiveUrl(window.location.pathname);
      this.setState({ channelsOverlayVisible: false });
      unmountChannelsOverlay();
    }
  };

  _getNavigationItems() {
    return [
      this._getTrending(),
      this._getKiosk(),
      this._getFollowing(),
      ...this._getFollowingChannels(),
      this._getFollowChannels(),
    ].filter(item => !!item);
  }

  _getKiosk() {
    const { kioskCategories, timeline } = this.props;

    if (BrowserEnv.isMobile() || get(this, 'props.timeline.name') !== 'kiosk') {
      return {
        key: 'kiosk',
        label: translate('navigation.links.collapsed.kiosk.label'),
        className: 'menu-kiosk',
        url: 'kiosk',
        aliases: ['kiosk'],
      };
    }

    const kiosk = {
      key: 'popular',
      label: translate('navigation.links.collapsed.kiosk.label'),
      url: 'kiosk',
      aliases: ['kiosk'],
    };

    const myIssues = {
      key: 'my-issues',
      label: translate('kiosk.navigation.my_issues'),
      url: 'kiosk/my-issues',
    };

    const categories = kioskCategories.map(category => ({
      key: category.id,
      url: `kiosk/${category.id}`,
      label: category.title,
    }));

    const children = [kiosk, myIssues, ...categories];
    const active = children.find(child => child.key === timeline.categoryId);

    return {
      ...active,
      children,
      className: 'menu-kiosk s-active',
    };
  }

  _getTrending() {
    if (BrowserEnv.isMobile()) {
      return {
        key: 'trending',
        label: translate('timeline.trending.now', ['']),
        className: 'menu-trending',
        url: 'trending/now',
        aliases: ['trending'],
      };
    }

    const options = TimelineManager.getTrendingFilters();
    if (get(this, 'props.timeline.name') !== 'trending') {
      return {
        key: 'trending',
        label: options[0].label,
        className: 'menu-trending',
        url: 'trending/now',
      };
    }

    const children = options.map(option => ({
      ...option,
      key: option.trending,
      url: `trending/${option.trending}`,
    }));

    const active = options.find(option => option.trending === this.props.timeline.options.details);

    return {
      ...active,
      url: `trending/${active.trending}`,
      key: 'trending',
      className: 'menu-trending s-active',
      children,
    };
  }

  _getFollowing() {
    return {
      key: 'following',
      label: translate('app.my_blendle'),
      url: 'following',
      aliases: [''],
      className: '',
    };
  }

  _getFollowingChannels() {
    return this.props.channels.filter(channel => channel.get('following')).map(channel => ({
      key: channel.id,
      label: channel.get('username'),
      url: `channel/${channel.id}`,
      className: `channel channel-${channel.id}`,
    }));
  }

  _getFollowChannels() {
    const onClose = (ev) => {
      if (ev) {
        ev.preventDefault();
        ev.stopPropagation();
      }

      ModuleNavigationActions.setActiveUrl(window.location.pathname);
      this.setState({ channelsOverlayVisible: false });
      unmountChannelsOverlay();
    };

    return {
      key: 'add-channel',
      className: 'v-add-channel-button',
      label: BrowserEnv.isMobile() ? '' : translate('timeline.channel.button'),
      url: 'channels',
      onClick: (ev) => {
        ev.preventDefault();
        ev.stopPropagation();

        if (this.state.channelsOverlayVisible) {
          onClose();
          return;
        }

        // manually set the active url since the route /channels isn't working well
        ModuleNavigationActions.setActiveUrl('channels');
        this.setState({ channelsOverlayVisible: true });
        ReactDOM.render(
          <FollowChannels onClose={onClose} onChange={this.props.onChannelsChange} />,
          document.querySelector('.a-tooltips'),
        );
      },
    };
  }

  render() {
    return (
      <ModuleNavigation>
        {getComponents(this._getNavigationItems(), history.fragment)}
      </ModuleNavigation>
    );
  }
}



// WEBPACK FOOTER //
// ./src/js/app/modules/timeline/components/TimelineNavigation.js