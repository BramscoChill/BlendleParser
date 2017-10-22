const _ = require('lodash');
const React = require('react');
const createReactClass = require('create-react-class');
const PropTypes = require('prop-types');
const Translate = require('components/shared/Translate');
const Analytics = require('instances/analytics');
const SelectableChannel = require('./SelectableChannel');
const SubmitPaneButton = require('../SubmitPaneButton');
const PrevPaneButton = require('../PrevPaneButton');
const formMixin = require('../mixins/formMixin');
const constants = require('app-constants');
import StickySubmitPaneButton from '../StickySubmitPaneButton';

const ChannelsView = createReactClass({
  displayName: 'ChannelsView',
  mixins: [formMixin],

  propTypes: {
    onSubmit: PropTypes.func.isRequired,
    onPrev: PropTypes.func.isRequired,

    // channel data and the user selected channels
    channels: PropTypes.array,
    selection: PropTypes.array,

    /**
     * when the user selects/deselects an channel in the channel view
     * @param {Boolean} selectState
     * @param {Object} channel
     */
    onSelect: PropTypes.func.isRequired,
  },

  getDefaultProps() {
    return {
      channels: [],
      selection: [],
    };
  },

  onSelect(channel, ev) {
    if (ev.target.checked) {
      Analytics.track('Channel Subscribe', {
        channel: channel.get('id'),
        type: 'signup',
      });
    } else {
      Analytics.track('Channel Unsubscribe', {
        channel: channel.get('id'),
        type: 'signup',
      });
    }

    // wait for a small moment to show the submit button for a better UX
    setTimeout(() => {
      if (this.refs.stickySubmit) {
        this.refs.stickySubmit.updateVisiblity();
      }
    }, 500);

    this.props.onSelect(ev.target.checked, channel);
  },

  _renderStickySubmit() {
    return (
      <StickySubmitPaneButton
        ref="stickySubmit"
        disabled={this.props.disabled}
        onClick={this.onSubmit}
      />
    );
  },

  render() {
    const channelsList = this.props.channels
      .filter(channel => !_.includes(constants.STAFFPICKS, channel.id))
      .map(channel => (
        <li key={channel.id}>
          <SelectableChannel
            channel={channel}
            selected={this.props.selection.indexOf(channel.get('id')) > -1}
            disabled={this.props.disabled}
            onChange={this.onSelect.bind(this, channel)}
          />
        </li>
      ));

    return (
      <form className="v-signup-channels slide-animation" onSubmit={this.onSubmit}>
        <h2>
          <Translate find="signup.channels.title" sanitize={false} />
        </h2>
        <h3>
          <Translate find="signup.channels.subtitle" sanitize={false} />
        </h3>
        <ul className="signup-channels-list">
          {channelsList.length ? channelsList : <li>Loading</li>}
        </ul>
        {this._renderStickySubmit()}
        <SubmitPaneButton disabled={this.props.disabled} />
        <PrevPaneButton onClick={this.props.onPrev} />
      </form>
    );
  },
});

module.exports = ChannelsView;



// WEBPACK FOOTER //
// ./src/js/app/modules/signup/views/channels/Channels.js