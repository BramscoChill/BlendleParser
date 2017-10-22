import React from 'react';
import PropTypes from 'prop-types';
import { EmailInput, Button } from '@blendle/lego';
import CSS from './ChangeEmail.scss';

const ChangeEmail = ({ email, error, errorMessage, onSubmit, onChange, isLoading }) => (
  <div className={CSS.body}>
    <h1 className={CSS.title}>Geen mail gekregen?</h1>
    <p className={CSS.copy}>
      Check je even of het e-mailadres hieronder klopt? Dan proberen we het daarna nog eens.
    </p>
    <form onSubmit={onSubmit} className={CSS.form}>
      <EmailInput
        containerClassName={CSS.input}
        value={email}
        onChange={onChange}
        error={error}
        message={errorMessage}
      />
      <Button type="submit" isLoading={isLoading}>
        Ja, mail maar!
      </Button>
    </form>
  </div>
);

ChangeEmail.propTypes = {
  email: PropTypes.string,
  error: PropTypes.bool,
  isLoading: PropTypes.bool,
  errorMessage: PropTypes.string,
  onSubmit: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default ChangeEmail;



// WEBPACK FOOTER //
// ./src/js/app/modules/premiumSignup/components/ChangeEmail/index.js