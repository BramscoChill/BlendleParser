import React from 'react';
import { DialogFooterTransparent } from '@blendle/lego';
import { replaceLastPath } from 'helpers/url';
import Link from 'components/Link';
import CSS from './SignupFooter.scss';

const SignupFooter = () => (
  <DialogFooterTransparent className={CSS.dialogFooter}>
    <p>
      Heb je al een account?{' '}
      <Link href={replaceLastPath(window.location.pathname, 'login')}>Log hier in</Link>
    </p>
  </DialogFooterTransparent>
);

export default SignupFooter;



// WEBPACK FOOTER //
// ./src/js/app/modules/premiumSignup/components/SignupFooter/index.js