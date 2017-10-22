import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Link from './Link';

export default class ChannelName extends React.Component {
  static propTypes = {
    channel: PropTypes.object.isRequired,
    className: PropTypes.any,
  };

  render() {
    const url = `/channel/${this.props.channel.id}`;
    const className = classNames(
      'v-channel-name',
      'channel',
      `channel-${this.props.channel.id}`,
      this.props.className,
    );

    return (
      <Link
        {...this.props}
        className={className}
        href={url}
        title={this.props.channel.get('full_name')}
      >
        {this.props.channel.get('full_name')}
      </Link>
    );
  }
}



// WEBPACK FOOTER //
// ./src/js/app/components/ChannelName.js