import React, { Component } from 'react';
import { translate } from 'instances/i18n';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Analytics from 'instances/analytics';
import { track } from 'helpers/premiumOnboardingEvents';
import DialogHeader from 'modules/premiumSignup/components/DialogHeader';
import DialogSubheader from 'modules/premiumSignup/components/DialogSubheader';
import CSS from './Channels.scss';

const getChannelId = channel => channel.id;

class Channels extends Component {
  static propTypes = {
    channels: PropTypes.oneOfType([PropTypes.array, PropTypes.object]).isRequired,
    onSelectChannel: PropTypes.func.isRequired,
    selectedChannels: PropTypes.array.isRequired,
    clickPositions: PropTypes.object.isRequired,
    isOnboarding: PropTypes.bool,
    isDeeplinkSignUp: PropTypes.bool,
  };

  constructor(props) {
    super(props);

    this.state = {
      initialSelection: [],
      hasSentBrowseEvent: false,
    };
  }

  componentWillMount() {
    const { channels, selectedChannels } = this.props;

    if (channels.length) {
      this.setState({
        initialSelection: selectedChannels,
      });

      const channelIds = channels.map(getChannelId);
      this._trackBrowseOnce(channelIds);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.channels.length && nextProps.channels.length) {
      const channelIds = nextProps.channels.map(getChannelId);

      this.setState({
        initialSelection: nextProps.selectedChannels,
      });

      this._trackBrowseOnce(channelIds);
    }
  }

  _trackBrowseOnce = (channelIds) => {
    // Only track browse events once per mount
    if (this.state.hasSentBrowseEvent) {
      return;
    }

    track(Analytics, 'Browse Channels', { channel_uids: channelIds });
    this.setState({ hasSentBrowseEvent: true });
  };

  _renderRipple(clickPosition = {}, selected, channel) {
    const style = {
      top: clickPosition.y || 0,
      left: clickPosition.x || 0,
      width: clickPosition.inkDiameter || (selected ? '100%' : 0),
      height: clickPosition.inkDiameter || (selected ? '100%' : 0),
      background: channel.get('channel_color'),
    };

    const classes = classNames(CSS.ripple, {
      [CSS.rippleIn]: selected,
    });

    return <span className={classes} style={style} />;
  }

  _renderChannelList = () => {
    const { channels, onSelectChannel, selectedChannels, clickPositions } = this.props;

    return channels.map((channel) => {
      const labelStyle = { color: channel.get('channel_color') };
      const selected = selectedChannels.includes(channel.id);
      const liClasses = classNames(CSS.channel, {
        [CSS.selected]: selected,
      });
      const liStyle = {};

      if (selected) {
        labelStyle.borderColor = channel.get('channel_color');
        liStyle.background = channel.get('channel_color');
      }

      return (
        <li
          key={channel.id}
          className={liClasses}
          style={liStyle}
          data-test-identifier="channel-item"
        >
          <span className={CSS.checkIcon} />
          <label
            className={`${CSS.channelName} channel-${channel.id}-hover-text`}
            htmlFor={`checkbox-${channel.id}`}
          >
            <input
              id={`checkbox-${channel.id}`}
              type="checkbox"
              checked={selected}
              className={CSS.checkbox}
              onClick={e => onSelectChannel(e, channel)}
            />
            {channel.get('full_name')}
          </label>
          {this._renderRipple(clickPositions[channel.id], selected, channel)}
        </li>
      );
    });
  };

  _renderTitle() {
    if (this.props.isDeeplinkSignUp) {
      return translate('preferences.channels.deeplink_title');
    }

    if (this.props.isOnboarding) {
      return translate('preferences.channels.onboarding_title');
    }

    return translate('preferences.channels.title');
  }

  _renderSubtitle() {
    if (!this.props.isOnboarding) {
      return null;
    }

    if (this.props.isDeeplinkSignUp) {
      return translate('preferences.channels.deeplink_subtitle');
    }

    const following = Math.max(this.state.initialSelection.length, 0);

    if (following === 0) {
      return translate('preferences.channels.no_following_subtitle');
    }

    return translate('preferences.channels.subtitle');
  }

  render() {
    return (
      <div data-test-identifier="channelsContainer">
        <DialogHeader className={CSS.header}>{this._renderTitle()}</DialogHeader>
        <DialogSubheader className={CSS.subheader}>{this._renderSubtitle()}</DialogSubheader>
        <ul className={CSS.list}>{this._renderChannelList()}</ul>
      </div>
    );
  }
}

export default Channels;



// WEBPACK FOOTER //
// ./src/js/app/modules/premiumSignup/components/Channels/index.js