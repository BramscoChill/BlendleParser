const React = require('react');
const createReactClass = require('create-react-class');
const PropTypes = require('prop-types');
const Translate = require('components/shared/Translate');
const i18n = require('instances/i18n').locale;
const PrevPaneButton = require('../PrevPaneButton');
const FollowFacebook = require('./FollowFacebook');
const formMixin = require('../mixins/formMixin');
const FollowTwitter = require('./FollowTwitter');
const BrowserEnvironment = require('instances/browser_environment');

const Social = createReactClass({
  displayName: 'Social',
  mixins: [formMixin],

  propTypes: {
    onSubmit: PropTypes.func.isRequired,
    followTwitter: PropTypes.array,
    followFacebook: PropTypes.array,
  },

  render() {
    let enterText;

    if (!BrowserEnvironment.isMobile() && BrowserEnvironment.hasTouch()) {
      enterText = (
        <span>
          <br />
          <Translate find="signup.enter_tip" sanitize={false} />
        </span>
      );
    }

    return (
      <form className="v-signup-social slide-animation" onSubmit={this.onSubmit}>
        <h2>
          <Translate find="signup.social.title" sanitize={false} />
        </h2>
        <p className="assure">
          <small>{i18n.signup.social.assure}</small>
        </p>

        <FollowFacebook />
        <FollowTwitter />

        <div className="v-navigate-next">
          <button type="submit" className="btn">
            {i18n.app.buttons.done}
          </button>
          <small>
            {i18n.signup.social.notRequired}
            {enterText}
          </small>
        </div>
      </form>
    );
  },
});

module.exports = Social;



// WEBPACK FOOTER //
// ./src/js/app/modules/signup/views/social/Social.js