import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { translate } from 'instances/i18n';
import CSS from './style.scss';

class SelectedChannel extends PureComponent {
  static propTypes = {
    userId: PropTypes.string.isRequired,
    channel: PropTypes.object,
  };

  render() {
    const { channel, userId } = this.props;
    if (!channel) {
      return null;
    }

    if (channel.id === userId) {
      return <span>{translate('item.share.to_timeline')}</span>;
    }

    const channelClassName = `${CSS.channel} channel-${channel.id}`;
    return (
      <span>
        In <span className={channelClassName}>{channel.get('username')}</span>
      </span>
    ); // TODO: update onesky string
  }
}

export default SelectedChannel;



// WEBPACK FOOTER //
// ./src/js/app/modules/item/components/CuratorShareForm/SelectedChannel/index.js