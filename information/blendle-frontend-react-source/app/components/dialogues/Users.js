import React from 'react';
import PropTypes from 'prop-types';
import Dialogue from 'components/dialogues/Dialogue';
import UserRow from 'components/UserRow';
import { translate } from 'instances/i18n';

class UsersDialogue extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired,
    users: PropTypes.object.isRequired,
    analytics: PropTypes.object.isRequired,
  };

  state = {
    users: this.props.users,
    fetching: true,
  };

  componentDidMount() {
    this.state.users.on('sync', this._onSync);
    this.state.users.fetch();
  }

  componentWillUnmount() {
    this.state.users.off('sync', this._onSync);
  }

  _fetchMore = () => {
    if (this.state.users.hasNext() && !this.state.users.isFetching()) {
      this.state.users.fetchNext();
      this.setState({ fetchingMore: true });
    }
  };

  _onSync = (users) => {
    this.setState({
      users,
      fetchingMore: false,
      fetching: false,
    });
  };

  _onScroll = (e) => {
    const list = e.target;

    if (list.scrollTop + list.offsetHeight + 100 >= list.scrollHeight) {
      this._fetchMore();
    }
  };

  _renderUsers = () => {
    if (this.state.users.length === 0 && !this.state.fetching) {
      return <div className="empty">{translate('user.errors.users_not_found')}</div>;
    }

    return this.state.users.map(user => (
      <UserRow
        key={user.id}
        user={user}
        analytics={this.props.analytics}
        onNavigate={this.props.onClose}
      />
    ));
  };

  _renderInitialLoading = () => {
    if (this.state.users.length === 0 && this.state.fetching) {
      return <div className="loading" />;
    }
  };

  _renderLoadingMore = () => {
    if (this.state.fetchingMore) {
      return <div className="loading-more" />;
    }
  };

  render() {
    return (
      <Dialogue className="users-dialogue prevent-scroll" onClose={this.props.onClose}>
        <div className="users-header s-success">
          <div className="title" dangerouslySetInnerHTML={{ __html: this.props.title }} />
        </div>
        <ul className="users-list" onScroll={this._onScroll}>
          {this._renderUsers()}
          {this._renderInitialLoading()}
          {this._renderLoadingMore()}
        </ul>
      </Dialogue>
    );
  }
}

export default UsersDialogue;



// WEBPACK FOOTER //
// ./src/js/app/components/dialogues/Users.js