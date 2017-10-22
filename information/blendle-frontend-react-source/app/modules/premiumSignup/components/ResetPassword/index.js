import React from 'react';
import PropTypes from 'prop-types';
import ResetPasswordView from 'components/login/ResetPassword';
import CSS from './styles.scss';

const ResetPassword = (props) => {
  const { route, onClickLogin } = props;

  return (
    <div className={CSS.resetPassword}>
      <ResetPasswordView showBack active={route.activeStepIndex === 2} onLoginLink={onClickLogin} />
    </div>
  );
};

ResetPassword.propTypes = {
  route: PropTypes.object.isRequired,
  onClickLogin: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

export default ResetPassword;



// WEBPACK FOOTER //
// ./src/js/app/modules/premiumSignup/components/ResetPassword/index.js