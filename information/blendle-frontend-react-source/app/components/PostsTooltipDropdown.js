import React from 'react';
import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import { translate } from 'instances/i18n';
import classNames from 'classnames';
import PortalTooltip from 'components/PortalTooltip';
import dropdownMixin from 'components/mixins/DropdownMixin';
import MiniPost from 'components/MiniPost';

const PostsTooltipDropdown = createReactClass({
  displayName: 'PostsTooltipDropdown',

  propTypes: {
    posts: PropTypes.array.isRequired,
    className: PropTypes.string,
    disabled: PropTypes.bool,
    children: PropTypes.array,
  },

  mixins: [dropdownMixin('#tooltip-portal')],
  _timer: null,

  _delayDropdown() {
    this._clearDelay();
    this._timer = setTimeout(() => {
      this.openDropdown();
      this._timer = null;
    }, 200);
  },

  _clearDelay() {
    clearTimeout(this._timer);
  },

  _closeDropdown() {
    this._clearDelay();
    this.closeDropdown();
  },

  _toggleDropdown() {
    this._clearDelay();
    this.toggleDropdown();
  },

  _truncateMessage(count) {
    if (count === 1) {
      return <p>{translate('tooltip.one_more')}</p>;
    }
    return <p>{translate('tooltip.multiple_more', [count])}</p>;
  },

  _setMouseMoveHandler() {
    window.addEventListener('mousemove', this._doubtClose);

    setTimeout(() => {
      if (!this.isMounted() || !this.refs.tooltip || !this.refs.tooltip.getLayerDOMNode()) return;

      this._elementBoundingRect = ReactDOM.findDOMNode(this).getBoundingClientRect();
      this._tooltipBoundingRect = this.refs.tooltip.getLayerDOMNode().getBoundingClientRect();
    });
  },

  _removeMouseMoveHandler() {
    this._elementBoundingRect = null;
    this._tooltipBoundingRect = null;

    window.removeEventListener('mousemove', this._doubtClose);
  },

  _doubtClose(e) {
    if (!this._elementBoundingRect || !this._tooltipBoundingRect) {
      this._closeDropdown();

      return;
    }

    const insideElement =
      e.clientX >= this._elementBoundingRect.left &&
      e.clientX <= this._elementBoundingRect.right &&
      (e.clientY >= this._elementBoundingRect.top && e.clientY <= this._elementBoundingRect.bottom);

    const insideTooltip =
      e.clientX >= this._tooltipBoundingRect.left &&
      e.clientX <= this._tooltipBoundingRect.right &&
      (e.clientY >= this._tooltipBoundingRect.top && e.clientY <= this._tooltipBoundingRect.bottom);

    if (!insideElement && !insideTooltip) {
      this._closeDropdown();
    }
  },

  componentWillUnmount() {
    this._removeMouseMoveHandler();
  },

  _renderPosts() {
    const { posts } = this.props;

    return posts.map(post => <MiniPost key={`${post.created_at}-${post.user.uid}`} post={post} />);
  },

  _renderTooltip() {
    const { disabled } = this.props;
    const { open } = this.state;

    if (open && !disabled) {
      this._setMouseMoveHandler();
      return (
        <PortalTooltip
          truncate={this._truncateMessage}
          onScroll={this._closeDropdown}
          ref="tooltip"
          onClose={this._closeDropdown}
        >
          {this._renderPosts()}
        </PortalTooltip>
      );
    }
    this._removeMouseMoveHandler();

    return null;
  },

  render() {
    const { children } = this.props;

    const className = classNames([this.props.className, { 's-open': this.state.open }]);

    return (
      <div
        className={className}
        onClick={this.openDropdown}
        onMouseEnter={this._delayDropdown}
        onMouseLeave={this._doubtClose}
      >
        {children}
        {this._renderTooltip()}
      </div>
    );
  },
});

export default PostsTooltipDropdown;



// WEBPACK FOOTER //
// ./src/js/app/components/PostsTooltipDropdown.js