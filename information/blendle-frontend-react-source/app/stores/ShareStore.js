import { STATUS_INITIAL, STATUS_OK, STATUS_ERROR, STATUS_PENDING } from 'app-constants';
import alt from 'instances/altInstance';
import ShareActions from 'actions/ShareActions';

class ShareStore {
  constructor() {
    this.bindActions(ShareActions);

    this.state = {
      status: STATUS_INITIAL,
      showCommentForm: false,
      error: null,
      sentTo: null,
      loadingPlatforms: {},
      posts: [],
      message: '',
    };
  }

  onLoadPlatform(platform) {
    const { loadingPlatforms } = this.state;
    loadingPlatforms[platform] = STATUS_PENDING;
    this.setState({ loadingPlatforms });
  }

  onLoadPlatformSuccess(platform) {
    const { loadingPlatforms } = this.state;
    delete loadingPlatforms[platform];
    this.setState({ loadingPlatforms });
  }

  onShareItemToEmailSuccess(sentTo) {
    this.setState({
      status: STATUS_OK,
      sentTo,
    });
  }

  onShareItemToEmail() {
    this.setState({
      status: STATUS_PENDING,
    });
  }

  onShareItemToEmailError({ error }) {
    this.setState({
      status: STATUS_ERROR,
      error: error.message,
    });
  }

  onResetStatus() {
    this.setState({
      status: STATUS_INITIAL,
    });
  }

  onShareToFollowing() {
    this.setState({
      status: STATUS_PENDING,
    });
  }

  onShareToFollowingSuccess({ text }) {
    this.setState({
      status: STATUS_OK,
      showCommentForm: !text,
      message: '',
    });
  }

  onRemoveShareToFollowingSuccess() {
    this.setState({
      status: STATUS_OK,
      showCommentForm: false,
    });
  }

  onToggleCommentForm(toggle) {
    const showCommentForm = toggle === undefined ? !this.state.showCommentForm : toggle;

    this.setState({ showCommentForm });
  }

  onFetchItemPosts() {
    this.setState({
      posts: [],
    });
  }

  onFetchItemPostsSuccess(posts) {
    this.setState({ posts });
  }

  onFetchItemPostsError(err) {
    this.setState({
      error: err,
    });
  }

  onSetMessage(message) {
    this.setState({ message });
  }
}

export default alt.createStore(ShareStore, 'ShareStore');



// WEBPACK FOOTER //
// ./src/js/app/stores/ShareStore.js