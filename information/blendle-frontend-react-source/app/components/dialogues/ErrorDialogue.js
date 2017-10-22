import React from 'react';
import PropTypes from 'prop-types';
import Dialogue from 'components/dialogues/Dialogue';
import { translate } from 'instances/i18n';

export default function ErrorDialogue({ onClose }) {
  return (
    <Dialogue>
      <h2>{translate('app.error.title')}</h2>
      <p>{translate('app.error.server')}</p>
      <button className="btn btn-fullwidth" onClick={onClose}>
        {translate('app.buttons.ok')}
      </button>
    </Dialogue>
  );
}

ErrorDialogue.propTypes = {
  onClose: PropTypes.func.isRequired,
};



// WEBPACK FOOTER //
// ./src/js/app/components/dialogues/ErrorDialogue.js