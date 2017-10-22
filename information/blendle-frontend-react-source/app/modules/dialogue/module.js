import React from 'react';
import { get } from 'lodash';
import Auth from 'controllers/auth';
import IssueAcquiredContainer from 'containers/IssueAcquiredContainer';
import UnsubscribeDialogue from 'components/dialogues/UnsubscribeNewsletter';
import PremiumTrialDialogContainer from 'containers/dialogues/PremiumTrialDialogContainer';
import browserHistory from 'react-router/lib/browserHistory';

export function openIssueAcquired(issueId, nextState) {
  const onClose = () => {
    browserHistory.replace(nextState.returnUrl);
  };

  return <IssueAcquiredContainer issueId={issueId} onClose={() => onClose()} />;
}

export function openUnsubscribeNewsletter(optOutType, nextState) {
  const onClose = () => {
    browserHistory.replace(nextState.returnUrl);
  };

  return <UnsubscribeDialogue onClose={onClose} optOutType={optOutType} user={Auth.getUser()} />;
}

export function openPremiumTrialIntro(nextState) {
  const onClose = () => {
    browserHistory.replace(nextState.returnUrl);
  };

  return (
    <PremiumTrialDialogContainer
      forceShow
      onClose={onClose}
      successUrl={get(nextState, 'location.state.successUrl', null)}
    />
  );
}



// WEBPACK FOOTER //
// ./src/js/app/modules/dialogue/module.js