import React from 'react';
import PropTypes from 'prop-types';

function PremiumYearlySubscriptionDialogBody({ price }) {
  return (
    <div>
      <p>
        Met een jaarabonnement op Blendle Premium bespaar je 17%. Geen maandelijks betaalgedoe, je
        rekent in één keer
        {` ${price} `} af.
      </p>
      <strong>Kies hieronder hoe je wilt betalen.</strong>
    </div>
  );
}

PremiumYearlySubscriptionDialogBody.propTypes = {
  price: PropTypes.string,
};

export default PremiumYearlySubscriptionDialogBody;



// WEBPACK FOOTER //
// ./src/js/app/modules/payment/components/SubscriptionDialogBody/PremiumYearly.js