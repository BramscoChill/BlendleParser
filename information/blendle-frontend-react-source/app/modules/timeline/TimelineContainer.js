import React from 'react';
import PropTypes from 'prop-types';
import AltContainer from 'alt-container';
import AuthStore from 'stores/AuthStore';
import TimelineStore from 'stores/TimelineStore';
import ChannelsStore from 'stores/ChannelsStore';
import UsersStore from 'stores/UsersStore';
import TilesStore from 'stores/TilesStore';
import ModuleNavigationStore from 'stores/ModuleNavigationStore';
import TimelineActions from 'actions/TimelineActions';
import ChannelActions from 'actions/ChannelActions';
import UserActions from 'actions/UserActions';
import { getTimelineTiles } from 'selectors/tiles';
import { STATUS_OK } from 'app-constants';
import URIjs from 'urijs';
import Timeline from './components/Timeline';

function simpleCompare(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

export default class TimelineContainer extends React.Component {
  static propTypes = {
    timeline: PropTypes.object, // { name, options }
    moduleName: PropTypes.string,
  };

  static defaultProps = {
    moduleName: 'timeline',
  };

  constructor(props) {
    super(props);

    this.state = {
      showExampleTile: false,
    };
  }

  componentWillMount() {
    this._setShowExampleTileState(this.props);
  }

  componentDidMount() {
    const timeline = this.props.timeline;
    this._fetchTimeline(timeline);

    if (timeline.name === 'channel') {
      ChannelActions.fetchChannelDetails(timeline.options.details);
    } else if (timeline.name.startsWith('user')) {
      UserActions.fetchUserDetails(timeline.options.details);
    }
  }

  componentWillReceiveProps(nextProps) {
    const curTimeline = this.props.timeline;
    const nextTimeline = nextProps.timeline;

    if (!simpleCompare(curTimeline, nextTimeline)) {
      this._fetchTimeline(nextTimeline);
    }

    if (
      nextTimeline.name === 'channel' &&
      curTimeline.options.details !== nextTimeline.options.details
    ) {
      ChannelActions.fetchChannelDetails(nextTimeline.options.details);
    }

    if (
      nextTimeline.name.startsWith('user') &&
      curTimeline.options.details !== nextTimeline.options.details
    ) {
      UserActions.fetchUserDetails(nextTimeline.options.details);
    }

    this._setShowExampleTileState(nextProps);
  }

  _setShowExampleTileState(props) {
    this.setState({
      showExampleTile:
        !AuthStore.getState().user.get('preferences').hide_tile_explain_following &&
        props.timeline.name === 'following',
    });
  }

  _hideExplain = () => {
    AuthStore.getState().user.savePreferences({ hide_tile_explain_following: '1' });

    this.setState({
      showExampleTile: false,
    });
  };

  _fetchTimeline(timeline) {
    const userId = AuthStore.getState().user.id;

    // The _feed timeline is used to test v3 timelines by passing the url as search parameter
    if (timeline.name === '_feed') {
      const search = window.location.search;
      const parsedSearch = URIjs.parseQuery(search);
      TimelineActions.fetchTimeline(timeline.name, userId, { url: parsedSearch.url });
    } else {
      TimelineActions.fetchTimeline(timeline.name, userId, timeline.options);
    }
  }

  _getProfile({ channelsState, authState }, name, profileId) {
    if (!profileId) {
      return;
    }

    if (name === 'channel') {
      return channelsState.details[profileId];
    } else if (name.startsWith('user')) {
      return authState.details[profileId];
    }
  }

  _onFetchNext() {
    const { activeTimelineKey, timelines } = TimelineStore.getState();
    const timeline = timelines.get(activeTimelineKey);

    if (timeline.status === STATUS_OK && timeline.next) {
      TimelineActions.fetchNextItems(timeline);
    }
  }

  _renderTimeline = ({
    timelineState,
    channelsState,
    authState,
    tilesState,
    moduleNavigationState,
  }) => {
    const { activeModule } = moduleNavigationState;
    const { activeTimelineKey, timelines } = timelineState;
    const timeline = timelines.get(activeTimelineKey);

    if (!timeline || timeline.name === 'kiosk') {
      return null;
    }

    const tiles = getTimelineTiles(tilesState.tiles, timeline.itemIds);
    const profile = this._getProfile(
      { authState, channelsState },
      timeline.name,
      timeline.options.details,
    );

    return (
      <Timeline
        active={activeModule === this.props.moduleName}
        timeline={timeline}
        timelineStatus={timeline.status}
        items={tiles}
        profile={profile}
        showExplainTile={this.state.showExampleTile}
        onFetchNextItems={this._onFetchNext}
        onHideExplainTile={this._hideExplain}
      />
    );
  };

  render() {
    return (
      <AltContainer
        stores={{
          timelineState: TimelineStore,
          channelsState: ChannelsStore,
          authState: UsersStore,
          tilesState: TilesStore,
          moduleNavigationState: ModuleNavigationStore,
        }}
        render={this._renderTimeline}
      />
    );
  }
}



// WEBPACK FOOTER //
// ./src/js/app/modules/timeline/TimelineContainer.js