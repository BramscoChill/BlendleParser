import React, { PureComponent } from 'react';
import AltContainer from 'alt-container';
import { STATUS_INITIAL } from 'app-constants';
import AuthStore from 'stores/AuthStore';
import ChannelsStore from 'stores/ChannelsStore';
import TimelineActions from 'actions/TimelineActions';
import ChannelActions from 'actions/ChannelActions';
import TimelineNavigation from './components/TimelineNavigation';
import TimelineStore from 'stores/TimelineStore';
import NewsStandStore from 'stores/NewsStandStore';
import { get } from 'lodash';

function fetchChannels() {
  if (ChannelsStore.getState().channels.status === STATUS_INITIAL) {
    ChannelActions.fetchChannels(AuthStore.getState().user.id);
  }
}

export default class TimelineNavigationContainer extends PureComponent {
  componentDidMount() {
    fetchChannels();
  }

  componentDidUpdate() {
    fetchChannels();
  }

  _onChannelsChange = () => {
    const { activeTimelineKey, timelines } = TimelineStore.getState();
    const timeline = timelines.get(activeTimelineKey);

    if (timeline && timeline.name === 'following') {
      TimelineActions.fetchTimeline('following', AuthStore.getState().user.id);
    }
  };

  _renderNavigation = ({ timelineState, authState, channelsSate, newsStandState }) => {
    const { activeTimelineKey, timelines } = timelineState;
    const timeline = timelines.get(activeTimelineKey);
    const { user } = authState;

    if (!timeline) {
      return null;
    }

    return (
      <TimelineNavigation
        timeline={timeline}
        channels={channelsSate.channels.data}
        onChannelsChange={this._onChannelsChange}
        kioskCategories={get(newsStandState, 'newsStand.categories', [])}
      />
    );
  };

  render() {
    return (
      <AltContainer
        stores={{
          channelsSate: ChannelsStore,
          timelineState: TimelineStore,
          authState: AuthStore,
          newsStandState: NewsStandStore,
        }}
        render={this._renderNavigation}
      />
    );
  }
}



// WEBPACK FOOTER //
// ./src/js/app/modules/timeline/TimelineNavigationContainer.js