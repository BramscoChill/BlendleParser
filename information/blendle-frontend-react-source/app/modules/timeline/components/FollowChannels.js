import React from 'react';
import PropTypes from 'prop-types';
import { translate, translateElement, getIso639_1 as getLang } from 'instances/i18n';
import classNames from 'classnames';
import Link from 'components/Link';
import ChannelName from 'components/ChannelName';
import Auth from 'controllers/auth';
import ChannelsStore from 'stores/ChannelsStore';
import ChannelActions from 'actions/ChannelActions';
import { STATUS_OK } from 'app-constants';

export default class TimelineNavigation extends React.Component {
  static propTypes = {
    onClose: PropTypes.func.isRequired,
    onChange: PropTypes.func,
  };

  constructor() {
    super();
    this.state = {
      channels: ChannelsStore.getState().channels,
    };
  }

  componentWillMount() {
    ChannelsStore.listen(this._onStoreChange);
  }

  componentWillUnmount() {
    ChannelsStore.unlisten(this._onStoreChange);
  }

  _onStoreChange = (storeState) => {
    this.setState({ channels: storeState.channels });
  };

  _onChannelClick(channel, ev) {
    ChannelActions.followChannel(Auth.getId(), channel.id, !channel.get('following'));
    ev.stopPropagation();
    ev.preventDefault();

    if (this.props.onChange) {
      this.props.onChange();
    }
  }

  _onContainerClick(ev) {
    ev.stopPropagation();
  }

  _renderChannel(channel) {
    const className = classNames({
      'v-channel': true,
      'v-channel-name': true,
      channel: true,
      [`channel-${channel.id}`]: true,
      'l-following': channel.get('following'),
    });

    return (
      <li>
        <ChannelName
          onClick={this._onChannelClick.bind(this, channel)}
          className={className}
          channel={channel}
        />
      </li>
    );
  }

  _renderRequestChannel() {
    let url = 'https://blendle.typeform.com/to/duv5p9';
    if (getLang() === 'nl') {
      url = 'https://blendle.typeform.com/to/Ar9GBY';
    }
    return (
      <li>
        <Link href={url} className="v-channel channel suggest-channel" target="_blank">
          {translate('channels.suggest')}
        </Link>
      </li>
    );
  }

  render() {
    if (this.state.channels.status !== STATUS_OK) {
      return null;
    }

    return (
      <div className="channel-overlay" onClick={this.props.onClose}>
        <div className="v-channels" onClick={this._onContainerClick}>
          <a className="v-close-button" onClick={this.props.onClose} />
          <h1>{translateElement('timeline.channel.title', [Auth.getUser().getFirstName()])}</h1>
          <ul>
            {this.state.channels.data.map(this._renderChannel.bind(this))}
            {this._renderRequestChannel()}
          </ul>
        </div>
      </div>
    );
  }
}



// WEBPACK FOOTER //
// ./src/js/app/modules/timeline/components/FollowChannels.js