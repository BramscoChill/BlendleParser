import React from 'react';
import PropTypes from 'prop-types';
import { translateElement } from 'instances/i18n';
import browserEnv from 'instances/browser_environment';
import DeeplinkManifest from 'modules/deeplink/components/DeeplinkManifest';
import DeeplinkHeader from './DeeplinkHeader';
import DeeplinkForm from './DeeplinkForm';
import DeeplinkJSONLD from './DeeplinkJSONLD';
import DeeplinkSignupBlock from './DeeplinkSignupBlock';
import LoginActions from 'actions/LoginActions';
import Analytics from 'instances/analytics';
import logPerformance from 'helpers/logPerformance';
import { getException } from 'helpers/countryExceptions';

export default class Deeplink extends React.Component {
  static propTypes = {
    item: PropTypes.object.isRequired,
    variant: PropTypes.oneOf(['login', 'signUp']),
    onToSignUp: PropTypes.func.isRequired,
    onLogin: PropTypes.func.isRequired,
    onFacebookSignUp: PropTypes.func.isRequired,
  };

  constructor() {
    super();
    this.state = {};
  }

  componentDidMount() {
    Analytics.trackItemEvent(
      this.props.item,
      {
        type: 'deeplink',
        referrer: document.referrer,
      },
      'Deeplink Readmore',
    );

    logPerformance.applicationReady('Deeplink');
  }

  _onToLogin(email) {
    LoginActions.setEmail(email);
    setTimeout(() => {
      this.refs.header.openLoginDropdown();
    });
  }

  _onToReset(e) {
    e.preventDefault();

    setTimeout(() => {
      this.refs.header.openReset();
    });
  }

  _onEmailSignUp() {
    this.setState({ didEmailSignUp: true });
  }

  _renderManifest() {
    if (this.state.didEmailSignUp) {
      return null;
    }

    return <DeeplinkManifest manifest={this.props.item.getEmbedded('manifest')} />;
  }

  _renderForm() {
    if (getException('showAccessCodeDeeplink', false)) {
      return (
        <DeeplinkSignupBlock
          variant={this.props.variant}
          item={this.props.item}
          onToLogin={this._onToLogin.bind(this)}
          onLogin={this.props.onLogin}
          onFacebookSignUp={this.props.onFacebookSignUp}
          onEmailSignUp={this._onEmailSignUp.bind(this)}
        />
      );
    }

    return (
      <DeeplinkForm
        variant={this.props.variant}
        item={this.props.item}
        onToLogin={this._onToLogin.bind(this)}
        onToReset={this._onToReset.bind(this)}
        onLogin={this.props.onLogin}
        onFacebookSignUp={this.props.onFacebookSignUp}
        onEmailSignUp={this._onEmailSignUp.bind(this)}
      />
    );
  }

  render() {
    return (
      <div className="v-module v-overlay v-deeplink v-module-item s-success">
        <DeeplinkJSONLD item={this.props.item} />
        <DeeplinkHeader
          ref="header"
          variant={this.props.variant}
          item={this.props.item}
          onToSignUp={this.props.onToSignUp}
        />
        <div className="v-deeplink-container">
          {this._renderManifest()}
          {this._renderForm()}
        </div>
        <div className="v-deeplink-footer">
          <div className="footer-content">
            <p className="tiny">
              {translateElement('deeplink.footer.terms_conditions', false)}{' '}
              {translateElement('deeplink.footer.cookies', false)}
            </p>
          </div>
        </div>
      </div>
    );
  }
}



// WEBPACK FOOTER //
// ./src/js/app/modules/deeplink/components/Deeplink.js