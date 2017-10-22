import React from 'react';
import { setStatic, wrapDisplayName, withState, compose, withHandlers } from 'recompose';
import ShareToEmailContainer from 'containers/dialogues/ShareToEmailContainer';

const withShareToEmail = (ComposedComponent) => {
  const enhance = compose(
    setStatic('displayName', wrapDisplayName(ComposedComponent, 'withShareToEmail')),
    withState('isEmailDialogueOpen', 'setEmailDialogueOpen', false),
    withHandlers({
      openEmailShareDialog: props => () => props.setEmailDialogueOpen(true),
      closeEmailShareDialog: props => () => props.setEmailDialogueOpen(false),
    }),
  );
  return enhance(
    ({ isEmailDialogueOpen, closeEmailShareDialog, openEmailShareDialog, ...props }) => (
      <div>
        <ComposedComponent {...props} openEmailShareDialog={openEmailShareDialog} />
        <ShareToEmailContainer
          itemId={props.itemId}
          isVisible={isEmailDialogueOpen}
          onClose={closeEmailShareDialog}
          analytics={props.analytics}
        />
      </div>
    ),
  );
};

export default withShareToEmail;



// WEBPACK FOOTER //
// ./src/js/app/modules/item/higher-order-components/withShareToEmail.js