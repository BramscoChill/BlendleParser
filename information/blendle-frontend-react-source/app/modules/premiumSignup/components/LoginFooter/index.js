import React from 'react';
import { DialogFooterTransparent } from '@blendle/lego';
import { replaceLastPath } from 'helpers/url';
import Link from 'components/Link';
import CSS from '../SignupFooter/SignupFooter.scss';

const LoginFooter = () => (
  <DialogFooterTransparent className={CSS.dialogFooter}>
    <p>
      Nog geen account?{' '}
      <Link href={replaceLastPath(window.location.pathname, 'signup')}>Maak nu eentje aan</Link>
    </p>
  </DialogFooterTransparent>
);

export default LoginFooter;



// WEBPACK FOOTER //
// ./src/js/app/modules/premiumSignup/components/LoginFooter/index.js