import React from 'react';
import PropTypes from 'prop-types';
import SignUpContainer from 'modules/premiumSignup/containers/SignUp';
import LoginContainer from 'modules/premiumSignup/containers/Login';
import ResetPasswordContainer from 'modules/premiumSignup/containers/ResetPasswordContainer';
import StepsPanel from 'components/StepsPanel';
import CSS from './Authentication.scss';

const Authentication = (props) => {
  const { activeStepIndex } = props.route;
  return (
    <div className={CSS.authDialog}>
      <StepsPanel
        className={CSS.stepsContainer}
        showStepIndicator={false}
        activeStepIndex={activeStepIndex}
      >
        <div className={CSS.step}>
          <SignUpContainer disabled={activeStepIndex !== 0} {...props} />
        </div>
        <div className={CSS.step}>
          <LoginContainer disabled={activeStepIndex !== 1} {...props} />
        </div>
        <div className={CSS.step}>
          <ResetPasswordContainer disabled={activeStepIndex !== 2} {...props} />
        </div>
      </StepsPanel>
    </div>
  );
};

Authentication.propTypes = {
  route: PropTypes.object,
};

export default Authentication;



// WEBPACK FOOTER //
// ./src/js/app/modules/premiumSignup/components/Authentication/index.js