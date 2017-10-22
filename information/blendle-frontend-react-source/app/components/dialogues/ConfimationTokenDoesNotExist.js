import React from 'react';
import PropTypes from 'prop-types';
import Dialogue from 'components/dialogues/Dialogue';
import { translate, translateElement } from 'instances/i18n';

const ConfirmationTokenDoesNotExist = ({ onClose }) => (
  <Dialogue hideClose onClose={onClose}>
    <h2>{translate('signup.verify.failed_title')}</h2>
    {translateElement(<p className="intro" />, 'signup.verify.failed_message')}
    <button className="btn btn-text btn-okay btn-fullwidth" onClick={onClose}>
      {translate('app.buttons.close_window')}
    </button>
  </Dialogue>
);

ConfirmationTokenDoesNotExist.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default ConfirmationTokenDoesNotExist;



// WEBPACK FOOTER //
// ./src/js/app/components/dialogues/ConfimationTokenDoesNotExist.js