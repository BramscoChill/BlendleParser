import React from 'react';
import PropTypes from 'prop-types';
import CSS from './style.scss';

function PremiumAutoRenewSubscriptionDialogBody({ endDate }) {
  return (
    <div>
      <p>
        Je hebt bijna toegang tot <strong>de allerbeste verhalen</strong> uit 120 kranten en
        tijdschriften. Nog even je gegevens bevestigen.
      </p>
      <ul className={CSS.list}>
        <li>
          Je gaat pas betalen nadat je <strong>proefperiode</strong> is afgelopen op {endDate}.
        </li>
        <li>
          We sturen je drie dagen voordat je gratis periode afloopt een mailtje ter herinnering.
        </li>
        <li>
          Je hebt <strong>nul verplichtingen</strong> en kunt op <strong>elk moment</strong>{' '}
          opzeggen.
        </li>
      </ul>
    </div>
  );
}

PremiumAutoRenewSubscriptionDialogBody.propTypes = {
  endDate: PropTypes.string,
};

export default PremiumAutoRenewSubscriptionDialogBody;



// WEBPACK FOOTER //
// ./src/js/app/modules/payment/components/SubscriptionDialogBody/PremiumOneWeekAutoRenewal.js