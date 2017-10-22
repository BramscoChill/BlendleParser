import React from 'react';
import PropTypes from 'prop-types';
import { STATUS_PENDING, STATUS_ERROR, STATUS_OK, STATUS_INITIAL } from 'app-constants';
import classNames from 'classnames';
import { Button } from '@blendle/lego';
import Dialogue from 'components/dialogues/Dialogue';
import CSS from './PremiumPaymentResult.scss';

const getBody = name =>
  name
    ? `Gefeliciteerd ${name}, je hebt nu Blendle\u00a0Premium.`
    : 'Gefeliciteerd, je hebt nu Blendle\u00a0Premium.';

function renderBody(status, onClose, name) {
  const loading = status !== STATUS_OK;

  return (
    <div className={CSS.body}>
      <div className={CSS.celebrate}>
        <video autoPlay loop muted playsInline>
          <source src="/img/illustrations/celebrate.webm" type="video/webm" />
          <source src="/img/illustrations/celebrate.mp4" type="video/mp4" />
        </video>
      </div>
      <h2 className={CSS.lead}>Hoppa, gelukt!</h2>
      <div className={CSS.copy}>
        <p>
          {getBody(name)}
          <br />
          Veel plezier met het beste uit 120 kranten en tijdschriften!
        </p>
        <Button isLoading={loading} className={CSS.button} onClick={onClose}>
          Oké, ik ga lezen
        </Button>
      </div>
    </div>
  );
}

const PremiumPaymentResultDialogue = ({ status, onClose, name }) => {
  const dialogueClasses = classNames(
    CSS.dialogue,
    'dialog-payment-result',
    'dialog-payment-success',
    { 'dialog-payment-loading': status === STATUS_PENDING },
  );

  return (
    <Dialogue className={dialogueClasses} onClose={onClose}>
      {renderBody(status, onClose, name)}
    </Dialogue>
  );
};

PremiumPaymentResultDialogue.propTypes = {
  onClose: PropTypes.func.isRequired,
  status: PropTypes.oneOf([STATUS_PENDING, STATUS_ERROR, STATUS_OK, STATUS_INITIAL]).isRequired,
  name: PropTypes.string,
};

export default PremiumPaymentResultDialogue;



// WEBPACK FOOTER //
// ./src/js/app/components/dialogues/PremiumPaymentResult/index.js