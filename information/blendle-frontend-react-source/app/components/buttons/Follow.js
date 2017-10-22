import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Analytics from 'instances/analytics';
import { locale as i18n } from 'instances/i18n';
import Auth from 'controllers/auth';
import BrowserEnvironment from 'instances/browser_environment';
import ChannelActions from 'actions/ChannelActions';

export default class FollowButton extends React.Component {
  static propTypes = {
    user: PropTypes.object.isRequired,
    isProfile: PropTypes.bool,
    analytics: PropTypes.object,
    size: PropTypes.string,
  };

  state = {
    hover: false,
    buttonState: '', // loading || error || ''
  };

  componentWillMount() {
    this._render = this.render.bind(this);
    this.props.user.on('change:following', this._render);
  }

  componentWillUnmount() {
    this.props.user.off('change:following', this._render);
    clearTimeout(this._delayedLoadingState);
  }

  render() {
    if (this.props.user.id === Auth.getId()) {
      return null; // Hide button on self
    }

    let text = '';
    if (this.props.user.get('following') && this.state.hover && !this.props.isProfile) {
      text = i18n.user.buttons.unfollow;
    } else if (this.props.user.get('following')) {
      text = i18n.user.buttons.following;
    } else {
      text = i18n.user.buttons.follow;
    }

    const className = classNames('btn btn-text', 'btn-follow', {
      profile: this.props.isProfile,
      'btn-following': this.props.user.get('following'),
      'btn-follow': !this.props.user.get('following'),
      [`s-${this.state.buttonState}`]: this.state.buttonState,
      [`s-${this.props.size}`]: this.props.size && this.props.size !== 'large',
      [this.props.className]: this.props.className,
    });

    return (
      <button
        className={className}
        onClick={this._click.bind(this)}
        onMouseEnter={this._mouseEnter.bind(this)}
        onMouseLeave={this._mouseLeave.bind(this)}
      >
        {text}
      </button>
    );
  }

  _resetLoadingState() {
    clearTimeout(this._delayedLoadingState);

    this._delayedLoadingState = setTimeout(() => {
      this.setState({ buttonState: '' });
    }, 500);
  }

  _click(e) {
    e.preventDefault();

    const user = this.props.user;
    this.setState({ buttonState: 'loading' });

    if (user.get('following')) {
      user.unfollow(Auth.getUser(), (success) => {
        this._resetLoadingState();
        this._trackAnalytics(false);

        if (!success) {
          this.setState({ buttonState: 'error' });
        } else if (this.props.user.isChannel) {
          ChannelActions.fetchChannels(Auth.getUser().id);
        }
      });
    } else {
      user.follow(Auth.getUser(), (success) => {
        this._resetLoadingState();
        this._trackAnalytics(true);

        if (!success) {
          this.setState({ buttonState: 'error' });
        } else if (this.props.user.isChannel) {
          ChannelActions.fetchChannels(Auth.getUser().id);
        }
      });
    }
  }

  _mouseEnter() {
    if (!BrowserEnvironment.hasTouch()) {
      this.setState({ hover: true });
    }
  }

  _mouseLeave() {
    if (!BrowserEnvironment.hasTouch()) {
      this.setState({ hover: false });
    }
  }

  _trackAnalytics(follow) {
    const user = this.props.user;

    if (!this.props.analytics) {
      return;
    }

    if (this.props.analytics.type === 'channel') {
      const extra = { type: 'profile', channel: user.id };
      Analytics.track(follow ? 'Channel Subscribe' : 'Channel Unsubscribe', extra);
    } else {
      const extra = {
        type: this.props.analytics.type,
        user_id: user.id,
        user_name: user.get('username'),
      };

      if (this.props.analytics.item_id) {
        extra.item_id = this.props.analytics.item_id;
      }

      if (this.props.analytics.item_title) {
        extra.item_title = this.props.analytics.item_title;
      }

      Analytics.track(follow ? 'Follow User' : 'Unfollow User', extra);
    }
  }
}



// WEBPACK FOOTER //
// ./src/js/app/components/buttons/Follow.js