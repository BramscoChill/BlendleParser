import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AltContainer from 'alt-container';
import { get } from 'lodash';
import { STAFFPICKS } from 'app-constants';
import Analytics from 'instances/analytics';
import { track, internalLocation } from 'helpers/premiumOnboardingEvents';
import ChannelsStore from 'stores/ChannelsStore';
import ChannelActions from 'actions/ChannelActions';
import Channels from 'modules/premiumSignup/components/Channels';
import AuthStore from 'stores/AuthStore';

class ChannelsContainer extends Component {
  static propTypes = {
    params: PropTypes.object,
    route: PropTypes.object.isRequired,
    isOnboarding: PropTypes.bool,
    location: PropTypes.object,
  };

  constructor(props) {
    super(props);

    this.state = {
      clickPositions: {},
    };
  }

  componentDidMount() {
    ChannelActions.fetchChannels();
  }

  componentWillUnmount() {
    const channelState = ChannelsStore.getState();

    track(Analytics, 'Signup/Channels Selected', { channel_uids: channelState.selectedChannels });
  }

  _onChangeChannel = (e, channel) => {
    const channelState = ChannelsStore.getState();
    const channelId = channel.id;
    const { user } = AuthStore.getState();
    const isFollowing = !channelState.selectedChannels.includes(channelId);

    ChannelActions.followChannel(user.id, channelId, isFollowing, {
      internal_location: internalLocation(window.location.pathname),
    });

    const li = e.currentTarget.parentElement;
    const inkDiameter = Math.max(li.offsetWidth, li.offsetHeight);
    const rect = li.getBoundingClientRect();

    const pageX = e.pageX || rect.left + 20;
    const pageY = e.pageY || rect.top + 20;

    this.setState({
      clickPositions: {
        ...this.state.clickPositions,
        [channelId]: {
          x: pageX - rect.left - inkDiameter / 2,
          y: pageY - rect.top - inkDiameter / 2,
          inkDiameter,
        },
      },
    });
  };

  _renderChannels = ({ channelState }) => {
    const channelsWithoutStaffpicks = channelState.channels.data.filter(
      channel => !Object.values(STAFFPICKS).includes(channel.id),
    );

    const isDeeplinkSignup = !!get(this.props, 'params.itemId', null);

    return (
      <Channels
        channels={channelsWithoutStaffpicks}
        onSelectChannel={this._onChangeChannel}
        selectedChannels={channelState.selectedChannels}
        clickPositions={this.state.clickPositions}
        isOnboarding={this.props.isOnboarding}
        isDeeplinkSignUp={isDeeplinkSignup}
      />
    );
  };

  render() {
    return <AltContainer stores={{ channelState: ChannelsStore }} render={this._renderChannels} />;
  }
}

export default ChannelsContainer;



// WEBPACK FOOTER //
// ./src/js/app/modules/premiumSignup/containers/Channels.js