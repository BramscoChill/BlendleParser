import React from 'react';
import PropTypes from 'prop-types';

function PremiumMonthlySubscriptionDialogBody({ price }) {
  return (
    <div>
      <p>
        Altijd de beste artikelen op Blendle voor maar {price} per maand. Opzeggen kan wanneer je
        wilt, met één klik.
      </p>
      <strong>Kies hieronder hoe je wilt betalen.</strong>
    </div>
  );
}

PremiumMonthlySubscriptionDialogBody.propTypes = {
  price: PropTypes.string,
};

export default PremiumMonthlySubscriptionDialogBody;



// WEBPACK FOOTER //
// ./src/js/app/modules/payment/components/SubscriptionDialogBody/PremiumMonthly.js