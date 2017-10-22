import React from 'react';
import PropTypes from 'prop-types';
import { formatCurrency } from 'instances/i18n';
import { Notification, NotificationTitle, NotificationBody } from '@blendle/lego';

const ItemNotInBundleNotification = ({ price, onClick, onMouseEnter, onMouseLeave }) => (
  <Notification
    className="item-not-in-bundle"
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
    onClick={onClick}
  >
    <NotificationTitle>Dit stuk lees je voor {formatCurrency(price)}</NotificationTitle>
    <NotificationBody>
      Want het valt buiten je Premium-selectie. Niet goed? Geld terug!
    </NotificationBody>
  </Notification>
);

ItemNotInBundleNotification.propTypes = {
  onClick: PropTypes.func.isRequired,
  onMouseEnter: PropTypes.func,
  onMouseLeave: PropTypes.func,
  price: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

export default ItemNotInBundleNotification;



// WEBPACK FOOTER //
// ./src/js/app/components/notifications/ItemNotInBundleNotification/index.js