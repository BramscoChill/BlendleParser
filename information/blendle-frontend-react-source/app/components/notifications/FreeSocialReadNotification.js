import React from 'react';
import { Notification, NotificationTitle, NotificationBody } from '@blendle/lego';

export default props => (
  <Notification data-test-identifier="notification-free-social-reads" {...props}>
    <NotificationTitle>Voor jou is dit artikel gratis!</NotificationTitle>
    <NotificationBody>
      Omdat je Blendle Premium hebt, lees je verhalen die anderen met je delen gratis.
    </NotificationBody>
  </Notification>
);



// WEBPACK FOOTER //
// ./src/js/app/components/notifications/FreeSocialReadNotification.js