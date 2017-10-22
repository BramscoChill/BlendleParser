import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { get } from 'lodash';
import ShareActions from 'actions/ShareActions';
import ShareToChannelActions from 'actions/ShareToChannelActions';
import AuthStore from 'stores/AuthStore';
import TilesStore from 'stores/TilesStore';
import ShareStore from 'stores/ShareStore';
import AltContainer from 'alt-container';
import formatCurrency from 'helpers/formatcurrency';
import SharingButtonsContainer from '../SharingButtonsContainer';
import RecommendButton from '../../components/RecommendButton';
import CuratorShare from '../../components/CuratorShareForm/index';
import CSS from './Style.scss';

const shareDates = ['now', 'today', 'tomorrow'];

function isPostActive(posts = [], activeChannel) {
  return posts.some(post => post._embedded['b:user'].id === activeChannel.id);
}

function getPublicationTime(selectedDate, selectedTime) {
  if (selectedDate === 'now') {
    return null;
  }

  const publicationMomentMap = {
    today: () => moment().startOf('day'),
    tomorrow: () =>
      moment()
        .startOf('day')
        .add(1, 'days'),
  };

  const publicationDay = publicationMomentMap[selectedDate]();
  const publicationTime = moment(selectedTime, 'HH:mm:A');

  return publicationDay
    .hour(publicationTime.hours())
    .minute(publicationTime.minutes())
    .utc()
    .format('Y-MM-DDTHH:mm:ssZ');
}

class CuratorShareContainer extends PureComponent {
  static propTypes = {
    itemId: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);

    const { user } = AuthStore.getState();

    this.state = {
      selectedChannel: user, // Post to own timeline by default
      selectedDate: shareDates[0],
      selectedTime: '',
      message: '',
    };
  }

  componentDidMount() {
    const { user } = AuthStore.getState();
    const { itemId } = this.props;
    ShareActions.fetchItemPosts.defer(user.id, itemId);
  }

  _onMessageChange = e => this.setState({ message: e.target.value });
  _onTimeChange = e => this.setState({ selectedTime: e.target.value });
  _onDateChange = selectedDate =>
    this.setState({
      selectedDate,
      selectedTime: selectedDate === 'now' ? '' : moment().format('HH:mm'),
    });

  _onChannelChange = (selectedChannelId) => {
    const { user } = AuthStore.getState();
    const selectedChannel = [user, ...user.getEmbedded('shared_users').models].find(
      channel => channel.id === selectedChannelId,
    );

    this.setState({ selectedChannel });
  };

  _onShare = () => {
    const { itemId } = this.props;
    const { user } = AuthStore.getState();
    const { posts } = ShareStore.getState();

    const { selectedChannel, message, selectedTime, selectedDate } = this.state;

    if (selectedChannel.id === user.id) {
      // Post to user timeline
      if (isPostActive(posts, selectedChannel)) {
        ShareActions.removeShareToFollowing(itemId, user.id, message);
      } else {
        ShareActions.shareToFollowing(itemId, user.id, message);
      }
    } else if (!isPostActive(posts, selectedChannel)) {
      ShareToChannelActions.shareToChannel({
        channel: selectedChannel,
        itemId,
        userId: user.id,
        message,
        publicationTime: getPublicationTime(selectedDate, selectedTime),
      });
    } else if (isPostActive(posts, selectedChannel)) {
      ShareActions.removeShareToFollowing(itemId, selectedChannel.id);
    }
  };

  // eslint-disable-next-line react/prop-types
  _renderCuratorShare = ({ tilesState, authState, shareState }) => {
    if (!authState.user.isModerator()) {
      return null;
    }

    const { posts } = shareState;
    const { itemId } = this.props;

    const { selectedChannel, selectedTime, selectedDate, message } = this.state;

    const isActive = isPostActive(posts, selectedChannel);
    const { tiles } = tilesState;
    const tile = tiles.get(itemId);

    const price = get(tile, 'price', '');

    return (
      <div>
        <CuratorShare
          channels={[authState.user, ...authState.user.getEmbedded('shared_users').models]}
          shareDates={shareDates}
          userId={authState.user.id}
          message={message}
          selectedChannel={selectedChannel}
          selectedTime={selectedTime}
          selectedDate={selectedDate}
          onMessageChange={this._onMessageChange}
          onDateChange={this._onDateChange}
          onTimeChange={this._onTimeChange}
          onChannelChange={this._onChannelChange}
        />
        <div>Orignal price: {formatCurrency(price / 100)}</div>
        <RecommendButton
          onToggle={this._onShare}
          postsCount={0}
          active={isActive}
          className={CSS.recommendButton}
        />
        <SharingButtonsContainer />
      </div>
    );
  };

  render() {
    return (
      <AltContainer
        stores={{
          tilesState: TilesStore,
          authState: AuthStore,
          shareState: ShareStore,
        }}
        render={this._renderCuratorShare}
      />
    );
  }
}

export default CuratorShareContainer;



// WEBPACK FOOTER //
// ./src/js/app/modules/item/containers/CuratorShareContainer/index.js