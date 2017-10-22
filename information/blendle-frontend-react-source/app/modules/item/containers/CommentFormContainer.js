import React, { PureComponent } from 'react';
import AltContainer from 'alt-container';
import AuthStore from 'stores/AuthStore';
import ItemStore from 'stores/ItemStore';
import ShareStore from 'stores/ShareStore';
import ShareActions from 'actions/ShareActions';
import NewCommentForm from '../components/NewCommentForm';

class CommentFormContainer extends PureComponent {
  state = {
    message: '',
  };

  _onMessageChanged = (e) => {
    this.setState({
      message: e.target.value,
    });
  };

  _onMessageSubmit = () => {
    const { user } = AuthStore.getState();
    const { selectedItemId } = ItemStore.getState();

    ShareActions.shareToFollowing(selectedItemId, user.id, this.state.message);
  };

  _onClickOutside = () => ShareActions.toggleCommentForm(false);

  // eslint-disable-next-line react/prop-types
  _renderCommentForm = ({ shareState, authState }) => {
    if (!shareState.showCommentForm || authState.user.isModerator()) {
      return null;
    }

    return (
      <NewCommentForm
        onSubmit={this._onMessageSubmit}
        onMessageChanged={this._onMessageChanged}
        onClickOutside={this._onClickOutside}
        message={this.state.message}
      />
    );
  };

  render() {
    return (
      <AltContainer
        stores={{
          shareState: ShareStore,
          authState: AuthStore,
        }}
        render={this._renderCommentForm}
      />
    );
  }
}

export default CommentFormContainer;



// WEBPACK FOOTER //
// ./src/js/app/modules/item/containers/CommentFormContainer.js