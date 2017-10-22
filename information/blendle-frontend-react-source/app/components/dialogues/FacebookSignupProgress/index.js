import React from 'react';
import PropTypes from 'prop-types';
import Dialogue from '../Dialogue';
import { translate } from '../../../instances/i18n';
import UserAvatar from 'components/UserAvatar';
import CSS from './style.scss';

const FacebookSignupProgress = ({ onClose, user }) => {
  const firstName = user.get('first_name');
  const titleMessage = firstName
    ? translate('onboarding.dialogue.title', firstName)
    : translate('onboarding.dialogue.title_no_name');

  return (
    <Dialogue onClose={onClose} className={CSS.container}>
      <div className="content">
        <p>
          <UserAvatar className={CSS.avatar} url={user.getAvatarHref()} />
        </p>
        <p className={CSS.title}>{titleMessage}</p>
        <p>{translate('onboarding.dialogue.message')}</p>
      </div>
      <button className="btn btn-text btn-confirm" onClick={onClose}>
        {translate('onboarding.dialogue.button')}
      </button>
    </Dialogue>
  );
};

FacebookSignupProgress.propTypes = {
  onClose: PropTypes.func,
  user: PropTypes.object.isRequired,
};

export default FacebookSignupProgress;



// WEBPACK FOOTER //
// ./src/js/app/components/dialogues/FacebookSignupProgress/index.js