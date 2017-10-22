import ByeBye from 'byebye';
import Social from 'modules/settings/components/Social';
import React from 'react';
import ReactDOM from 'react-dom';
import FacebookActions from 'actions/FacebookActions';
import TwitterActions from 'actions/TwitterActions';
import FacebookStore from 'stores/FacebookStore';
import TwitterStore from 'stores/TwitterStore';
import { STATUS_PENDING } from 'app-constants';

const SocialView = ByeBye.View.extend({
  className: 'v-social pane',

  initialize() {
    this.socialStoreListener = this.render.bind(this);
    FacebookStore.listen(this.socialStoreListener);
    TwitterStore.listen(this.socialStoreListener);
  },

  beforeUnload() {
    FacebookStore.unlisten(this.socialStoreListener);
    TwitterStore.unlisten(this.socialStoreListener);
    ReactDOM.unmountComponentAtNode(this.el);

    ByeBye.View.prototype.beforeUnload.apply(this, arguments);
  },

  render() {
    ReactDOM.render(
      <Social
        user={this.options.user}
        facebookConnected={FacebookStore.getState().connected}
        twitterConnected={TwitterStore.getState().connected}
        onToggleFacebook={FacebookActions.toggleFacebook}
        onToggleTwitter={TwitterActions.toggleTwitter}
        facebookLoading={FacebookStore.getState().status === STATUS_PENDING}
        twitterLoading={TwitterStore.getState().status === STATUS_PENDING}
        facebookError={FacebookStore.getState().errorMessage}
      />,
      this.el,
    );

    this.display();

    return this;
  },
});

export default SocialView;



// WEBPACK FOOTER //
// ./src/js/app/modules/settings/views/social.js