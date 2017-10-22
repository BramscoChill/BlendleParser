import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { DialogFooter } from '@blendle/lego';
import { REDIRECT_TO_URL } from 'app-constants';
import AuthStore from 'stores/AuthStore';
import { translate } from 'instances/i18n';
import UserPrefsUpdatedNotification from 'components/notifications/UserPrefsUpdatedNotification';
import NotificationsActions from 'actions/NotificationsActions';
import ApplicationActions from 'actions/ApplicationActions';
import Link from 'components/Link';
import CSS from './PreferencesFooters.scss';

class PreferencesFooter extends PureComponent {
  static propTypes = {
    returnUrl: PropTypes.string,
  };

  _onClick = () => {
    ApplicationActions.set(REDIRECT_TO_URL, this.props.returnUrl);

    const user = AuthStore.getState().user;

    const notificationId = `user-prefs-updated-${Date.now()}`;
    const props = {
      onClick: () => NotificationsActions.hideNotification(notificationId),
    };

    NotificationsActions.showNotification(UserPrefsUpdatedNotification, props, notificationId, {
      delay: 750,
    });

    user.savePreferences({
      did_onboarding: true,
      did_premium_onboarding: true,
    });
  };

  render() {
    return (
      <DialogFooter>
        <Link
          className={`btn ${CSS.nextButton}`}
          onClick={this._onClick}
          href={'/'}
          data-test-identifier="nextButton"
        >
          {translate('app.buttons.save')}
        </Link>
      </DialogFooter>
    );
  }
}

export default PreferencesFooter;



// WEBPACK FOOTER //
// ./src/js/app/modules/preferences/components/PreferencesFooter/index.js