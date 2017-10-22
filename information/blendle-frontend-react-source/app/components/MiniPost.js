import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import UserName from './UserName';
import { translate } from 'instances/i18n';
import moment from 'moment';
import classNames from 'classnames';

export default class MiniPost extends PureComponent {
  static propTypes = {
    post: PropTypes.object.isRequired,
    className: PropTypes.string,
  };

  _getTitle(user) {
    return translate('post.posted_at', [
      user.full_name,
      moment(this.props.post.created_at).format('LLLL'),
    ]);
  }

  _renderUserName() {
    const user = this.props.post.user;

    return (
      <span>
        <UserName title={this._getTitle(user)} fullName={user.full_name} userId={user.uid} />
      </span>
    );
  }

  _renderText() {
    const text = this.props.post.text;

    if (!text) {
      return null;
    }

    return <div className="text">{text}</div>;
  }

  render() {
    const minipostClasses = classNames({
      [this.props.className]: this.props.className,
      'v-mini-post': true,
    });

    return (
      <div className={minipostClasses}>
        {this._renderText()}
        <div className="user">{this._renderUserName()}</div>
      </div>
    );
  }
}



// WEBPACK FOOTER //
// ./src/js/app/components/MiniPost.js