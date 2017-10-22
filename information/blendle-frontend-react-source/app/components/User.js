const _ = require('lodash');
const React = require('react');
const createReactClass = require('create-react-class');
const PropTypes = require('prop-types');
const PureRenderMixin = require('react-addons-pure-render-mixin');
const Analytics = require('instances/analytics');
const Link = require('components/Link');
const UserPopover = require('components/UserPopover');
const PopoverElementMixin = require('components/mixins/PopoverElementMixin');
const constants = require('app-constants');

const User = createReactClass({
  displayName: 'User',
  mixins: [PureRenderMixin, PopoverElementMixin],

  propTypes: {
    user: PropTypes.object.isRequired,
    analytics: PropTypes.object.isRequired,
  },

  _getUsername() {
    return this.props.user.username || this.props.user.get('username');
  },

  render() {
    const user = this.props.user;
    const urlPrefix = _.includes(constants.STAFFPICKS, user.id) ? '/channel/' : '/user/';
    const userName = user.id === 'blendle' ? 'Trending' : user.get('username');

    let userPopover;
    if (this.state.popover) {
      userPopover = (
        <UserPopover
          user={user}
          analytics={this.props.analytics}
          x={this.state.x}
          y={this.state.y}
          onClose={this.closePopover}
          onMouseEnter={this.enterPopover}
          onMouseLeave={this.leavePopover}
        />
      );
    }

    return (
      <div className={`v-user user-id-${user.id}`}>
        <h4 data-id={user.id} className="user-name">
          <Link
            href={urlPrefix + user.id}
            onMouseEnter={this.debouncedEnterElement}
            onMouseMove={this.debouncedEnterElement}
            onMouseLeave={this.debouncedLeaveElement}
            onClick={this._trackUsernameClick}
          >
            {userName}
          </Link>
        </h4>
        {userPopover}
      </div>
    );
  },

  debouncedEnterElement(e) {
    clearTimeout(this._leaveTimeout);

    this.enterElement(e);
  },

  debouncedLeaveElement(e) {
    clearTimeout(this._leaveTimeout);

    this._leaveTimeout = setTimeout(() => this.leaveElement(e), 300);
  },

  /**
   * Track user name clicks
   * @api private
   */
  _trackUsernameClick(e) {
    Analytics.track('View User', {
      type: this.props.analytics.type,
      user_id: this.props.user.id,
      user_name: this._getUsername(),
    });
  },
});

module.exports = User;



// WEBPACK FOOTER //
// ./src/js/app/components/User.js