import { STATUS_INITIAL, STATUS_PENDING, STATUS_OK, STATUS_ERROR } from 'app-constants';
import alt from 'instances/altInstance';
import Channels from 'collections/channels';
import ChannelActions from '../actions/ChannelActions';

class ChannelsStore {
  constructor() {
    this.bindActions(ChannelActions);

    this.state = {
      selectedChannels: [],
      channels: {
        status: STATUS_INITIAL,
        data: new Channels(null),
      },
      details: {},
    };
  }

  onFetchChannels() {
    this.setState({
      channels: {
        status: STATUS_PENDING,
        ...this.state.channels,
      },
    });
  }

  onFetchChannelsSuccess({ data }) {
    const selectedChannels = data.models.reduce(
      (prev, curr) => (curr.attributes.following ? [...prev, curr.id] : prev),
      [],
    );

    this.setState({
      selectedChannels,
      channels: {
        status: STATUS_OK,
        data,
      },
    });
  }

  onFetchChannelsError({ error }) {
    this.setState({
      channels: {
        status: STATUS_ERROR,
        error,
      },
    });
  }

  onFetchChannelDetails({ channelId }) {
    this.setState({
      details: {
        ...this.state.details,
        [channelId]: {
          data: {},
          ...this.state.details[channelId],
          status: STATUS_PENDING,
        },
      },
    });
  }

  onFetchChannelDetailsSuccess({ channelId, data }) {
    this.setState({
      details: {
        ...this.state.details,
        [channelId]: {
          status: STATUS_OK,
          data,
        },
      },
    });
  }

  onFetchChannelDetailsError({ channelId, error }) {
    this.setState({
      details: {
        ...this.state.details,
        [channelId]: {
          status: STATUS_ERROR,
          error,
        },
      },
    });
  }

  onFollowChannel({ channelId, isFollowing }) {
    // update the following state in the details
    const channelDetails = this.state.details[channelId];
    const selectedChannels = isFollowing
      ? [...this.state.selectedChannels, channelId]
      : this.state.selectedChannels.filter(channel => channel !== channelId);

    if (channelDetails) {
      channelDetails.data.set('following', isFollowing);
      this.setState({
        selectedChannels,
        details: {
          ...this.state.details,
          [channelId]: {
            ...channelDetails,
            data: channelDetails.data,
          },
        },
      });
    }

    // update the following state in the channels list
    const channels = this.state.channels.data.map((channel) => {
      if (channel.id === channelId) {
        channel.set('following', isFollowing);
      }
      return channel;
    });

    this.setState({
      selectedChannels,
      channels: {
        ...this.state.channels,
        data: new Channels(channels),
      },
    });
  }
}

export default alt.createStore(ChannelsStore, 'ChannelsStore');



// WEBPACK FOOTER //
// ./src/js/app/stores/ChannelsStore.js