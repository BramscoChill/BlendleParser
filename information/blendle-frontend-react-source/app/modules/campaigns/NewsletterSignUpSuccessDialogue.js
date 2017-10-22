import React from 'react';
import PropTypes from 'prop-types';
import Dialogue from 'components/dialogues/Dialogue';
import Confetti from 'components/Confetti';
import Button from 'components/Button';
import { translate } from 'instances/i18n';

const NewsletterSignupSuccessDialogue = ({ onClose, loading }) => {
  if (loading) {
    return <div className="newsletter-signup-loading" />;
  }

  return (
    <Dialogue className="newsletter-signup-done-dialog" hideClose onClose={onClose}>
      <div className="head">
        <Confetti className="confetti">
          <h1>{translate('campaigns.newsletter.success_title')}</h1>
          <p>{translate('campaigns.newsletter.success_message')}</p>
          <p>{translate('campaigns.newsletter.success_message_browse')}</p>
        </Confetti>
        <div className="fade" />
      </div>
      <Button className="btn-continue" onClick={onClose}>
        {translate('campaigns.newsletter.view_selection')}
      </Button>
    </Dialogue>
  );
};

NewsletterSignupSuccessDialogue.propTypes = {
  onClose: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
};

export default NewsletterSignupSuccessDialogue;



// WEBPACK FOOTER //
// ./src/js/app/modules/campaigns/NewsletterSignUpSuccessDialogue.js