import React from 'react';
import PropTypes from 'prop-types';
import { translate } from 'instances/i18n';
import Dialogue from 'components/dialogues/Dialogue';

const ResendConfirmationEmail = ({ onClose, email }) => (
  <Dialogue onClose={onClose}>
    <h2>{translate('settings.emails.confirmation_sent')}</h2>
    <p>{translate('settings.emails.confirmation_sent_to', email)}</p>
    <button className="btn btn-fullwidth" onClick={onClose}>
      {translate('app.buttons.ok')}
    </button>
  </Dialogue>
);

ResendConfirmationEmail.propTypes = {
  onClose: PropTypes.func.isRequired,
  email: PropTypes.string.isRequired,
};

export default ResendConfirmationEmail;



// WEBPACK FOOTER //
// ./src/js/app/components/dialogues/ResendConfirmationEmail/index.js