import React from 'react';
import PropTypes from 'prop-types';
import { Notification, NotificationTitle, NotificationBody } from '@blendle/lego';

const PremiumCanceledNotification = ({ endDate, ...rest }) => (
  <Notification {...rest}>
    <NotificationTitle>Je abonnement is beëindigd</NotificationTitle>
    <NotificationBody>
      Blendle Premium stopt per {endDate}. Tot die tijd kan je nog blijven lezen.
    </NotificationBody>
  </Notification>
);

PremiumCanceledNotification.propTypes = {
  endDate: PropTypes.string.isRequired,
};

export default PremiumCanceledNotification;



// WEBPACK FOOTER //
// ./src/js/app/components/notifications/PremiumCanceledNotification.js