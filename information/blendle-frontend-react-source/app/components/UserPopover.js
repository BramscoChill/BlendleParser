const React = require('react');
const PropTypes = require('prop-types');
const PortalPopover = require('components/PortalPopover');
const BrowserEnvironment = require('instances/browser_environment');
const UserTooltipView = require('components/UserTooltip');

class UserPopover extends React.Component {
  static propTypes = {
    user: PropTypes.object.isRequired,
    analytics: PropTypes.object.isRequired,
  };

  render() {
    return (
      <PortalPopover
        x={this.props.x}
        y={this.props.y}
        offset={10}
        viewportOffsetBottom={10}
        mobile={BrowserEnvironment.isMobile()}
        onClose={this.props.onClose}
        onMouseEnter={this.props.onMouseEnter}
        onMouseLeave={this.props.onMouseLeave}
        onScroll={this.props.onClose}
      >
        <UserTooltipView user={this.props.user} analytics={this.props.analytics} />
      </PortalPopover>
    );
  }
}

module.exports = UserPopover;



// WEBPACK FOOTER //
// ./src/js/app/components/UserPopover.js