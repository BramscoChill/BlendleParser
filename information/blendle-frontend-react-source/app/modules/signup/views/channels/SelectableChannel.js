const React = require('react');
const PropTypes = require('prop-types');
const classNames = require('classnames');

class SelectableChannelView extends React.Component {
  static propTypes = {
    channel: PropTypes.object.isRequired,
  };

  render() {
    const className = classNames({
      channel: true,
      selected: this.props.selected,
      [`channel-${this.props.channel.get('id')}`]: !this.props.selected,
      [`channel-${this.props.channel.get('id')}-bg`]: this.props.selected,
    });

    return (
      <label className={className}>
        <input
          type="checkbox"
          onChange={this.props.onChange}
          disabled={this.props.disabled}
          checked={this.props.selected}
        />
        {this.props.channel.get('username')}
      </label>
    );
  }
}

module.exports = SelectableChannelView;



// WEBPACK FOOTER //
// ./src/js/app/modules/signup/views/channels/SelectableChannel.js