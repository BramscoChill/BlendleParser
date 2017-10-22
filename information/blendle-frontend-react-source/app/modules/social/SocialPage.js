import React from 'react';
import PropTypes from 'prop-types';
import withRouter from 'react-router/lib/withRouter';
import SocialDialogue from 'components/dialogues/Social';
import FacebookStore from 'stores/FacebookStore';
import TwitterStore from 'stores/TwitterStore';
import AltContainer from 'alt-container';
import Auth from 'controllers/auth';
import TwitterActions from 'actions/TwitterActions';
import FacebookActions from 'actions/FacebookActions';

function onPageChange(page) {
  const user = Auth.getUser();
  if (page === 'facebook') {
    FacebookActions.connectFacebook(user);
  }
  if (page === 'twitter') {
    TwitterActions.connectTwitter(user, true);
  }
}

class SocialPage extends React.Component {
  static propTypes = {
    params: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
  };

  componentDidMount() {
    onPageChange(this.props.params.page);
  }

  componentWillReceiveProps(nextProps) {
    onPageChange(nextProps.params.page);
  }

  render() {
    return (
      <AltContainer
        stores={{ FacebookStore, TwitterStore }}
        render={stores => (
          <SocialDialogue
            onClose={() => this.props.router.push('/')}
            page={this.props.params.page || 'landing'}
            twitterConnected={stores.TwitterStore.connected}
            twitterFriends={stores.TwitterStore.friends}
            twitterStatus={stores.TwitterStore.status}
            facebookConnected={stores.FacebookStore.connected}
            facebookFriends={stores.FacebookStore.friends}
            facebookStatus={stores.FacebookStore.status}
          />
        )}
      />
    );
  }
}

export default withRouter(SocialPage);



// WEBPACK FOOTER //
// ./src/js/app/modules/social/SocialPage.js