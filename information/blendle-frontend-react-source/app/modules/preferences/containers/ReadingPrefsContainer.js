import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import withRouter from 'react-router/lib/withRouter';
import AltContainer from 'alt-container';
import { Dialog, DialogBody } from '@blendle/lego';
import { history } from 'byebye';
import { getReturnUrl } from 'helpers/routerHelpers';
import AuthStore from 'stores/AuthStore';
import { NOT_FOUND } from 'app-constants';
import Error from 'components/Application/Error';
import { get } from 'lodash';

/**
 * Check if the reading prefs dialog is closeable by the user
 * Do not allow a user to close the reading prefs if he has premium and does not have did_premium_onboarding user pref
 * As it is required to have this user pref in order to generate the first bundle
 * @param user
 * @param location
 * @returns {*|Boolean|boolean}
 */
function shouldHideClose(user, location) {
  const preventClose = get(location, 'state.isOnboarding', false);

  return (
    preventClose ||
    (user.hasActivePremiumSubscription() && !user.getPreference('did_premium_onboarding'))
  );
}

class ReadingPrefsContainer extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    header: PropTypes.element,
    body: PropTypes.element,
    footer: PropTypes.element,
  };

  constructor(props) {
    super(props);

    this.state = {
      isOnboarding: get(this.props.location, 'state.isOnboarding', false),
    };
  }

  componentDidMount() {
    const { location } = this.props;

    const returnState = {
      returnUrl: get(location, 'state.returnUrl') || history.getPrevious(),
    };

    this._returnUrl = getReturnUrl(location.pathname, returnState);
  }

  _onClose = () => {
    if (!shouldHideClose(AuthStore.getState().user, this.props.location)) {
      this.props.router.push(this._returnUrl);
    }
  };

  _renderReadingPrefs = (authState) => {
    const { header, body, footer } = this.props;
    const { user } = authState;

    if (!body || !user) {
      return <Error type={NOT_FOUND} />;
    }

    return (
      <Dialog
        fullScreen
        closeOnOverlayClick={false}
        hideClose={shouldHideClose(user, this.props.location)}
        onClose={this._onClose}
      >
        {header}
        <DialogBody>
          {React.cloneElement(body, {
            isOnboarding: this.state.isOnboarding,
          })}
        </DialogBody>
        {React.cloneElement(footer, {
          returnUrl: this._returnUrl,
        })}
      </Dialog>
    );
  };

  render() {
    return <AltContainer store={AuthStore} render={this._renderReadingPrefs} />;
  }
}

export default withRouter(ReadingPrefsContainer);



// WEBPACK FOOTER //
// ./src/js/app/modules/preferences/containers/ReadingPrefsContainer.js