import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Select, SelectOption } from '@blendle/lego';
import SelectedChannel from '../SelectedChannel';

class ChannelSelect extends PureComponent {
  static propTypes = {
    channels: PropTypes.array.isRequired,
    userId: PropTypes.string.isRequired,
    selectedChannel: PropTypes.object.isRequired,
    onChannelChange: PropTypes.func.isRequired,
  };

  _renderChannels() {
    return this.props.channels.map(channel => (
      <SelectOption key={channel.id} value={channel.id}>
        <SelectedChannel userId={this.props.userId} channel={channel} />
      </SelectOption>
    ));
  }

  render() {
    return (
      <Select
        data-test-identifier="curator-share-channel"
        selectedValue={this.props.selectedChannel.id}
        onSelectedValueChange={this.props.onChannelChange}
      >
        {this._renderChannels()}
      </Select>
    );
  }
}

export default ChannelSelect;



// WEBPACK FOOTER //
// ./src/js/app/modules/item/components/CuratorShareForm/ChannelSelect/index.js