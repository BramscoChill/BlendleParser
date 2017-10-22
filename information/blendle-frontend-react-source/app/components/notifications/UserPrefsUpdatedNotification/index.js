import React from 'react';
import { translate } from 'instances/i18n';
import {
  Notification,
  NotificationTitle,
  NotificationBody,
  NotificationIcon,
  Rows,
  Columns,
} from '@blendle/lego';
import CSS from './style.scss';

export default props => (
  <Notification data-test-identifier="notification-user-prefs-updated" {...props}>
    <Columns className={CSS.fixedSize}>
      <NotificationIcon>
        <img
          src="/img/illustrations/highfive.svg"
          alt="High five icon"
          width="100%"
          height="100%"
        />
      </NotificationIcon>
      <Rows className={CSS.grow}>
        <NotificationTitle>
          {translate('preferences.notifications.success.title')}
        </NotificationTitle>
        <NotificationBody>
          {translate('preferences.notifications.success.description')}
        </NotificationBody>
      </Rows>
    </Columns>
  </Notification>
);



// WEBPACK FOOTER //
// ./src/js/app/components/notifications/UserPrefsUpdatedNotification/index.js