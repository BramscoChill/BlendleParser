import React from 'react';
import PropTypes from 'prop-types';
import { DialogBody } from '@blendle/lego';
import DialogHeader from 'modules/premiumSignup/components/DialogHeader';
import DialogSubheader from 'modules/premiumSignup/components/DialogSubheader';

const ActivatePremium = ({ error }) => {
  const bodyCopy = error || 'Bezig met activeren...';

  return (
    <DialogBody>
      <DialogHeader>Blendle Premium</DialogHeader>
      <DialogSubheader>{bodyCopy}</DialogSubheader>
    </DialogBody>
  );
};

ActivatePremium.propTypes = {
  router: PropTypes.object.isRequired,
  error: PropTypes.string,
};

export default ActivatePremium;



// WEBPACK FOOTER //
// ./src/js/app/modules/premiumSignup/components/ActivatePremium/index.js