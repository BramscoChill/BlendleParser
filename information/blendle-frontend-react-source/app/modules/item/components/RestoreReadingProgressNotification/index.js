import React from 'react';
import PropTypes from 'prop-types';
import { pure } from 'recompose';
import {
  Notification,
  NotificationBody,
  NotificationTitle,
  NotificationFooter,
  Button,
  ButtonGroup,
} from '@blendle/lego';
import { translate } from 'instances/i18n';
import CSS from './style.scss';

const RestoreReadingProgressNotification = ({ scrollToParagraph, dismissRestore }) => (
  <Notification className={CSS.notification} data-test-identifier="reading-progress-notification">
    <NotificationTitle>{translate('item.notifications.restore_progress.title')}</NotificationTitle>
    <NotificationBody>
      {translate('item.notifications.restore_progress.description')}
    </NotificationBody>
    <NotificationFooter>
      <ButtonGroup>
        <Button
          onClick={scrollToParagraph}
          size="small"
          data-test-identifier="confirm-reading-progress"
        >
          {translate('item.notifications.restore_progress.confirm')}
        </Button>
        <Button
          size="small"
          className={CSS.dismissButton}
          onClick={dismissRestore}
          color="transparent"
          data-test-identifier="dismiss-reading-progress"
        >
          {translate('item.notifications.restore_progress.dismiss')}
        </Button>
      </ButtonGroup>
    </NotificationFooter>
  </Notification>
);
RestoreReadingProgressNotification.propTypes = {
  dismissRestore: PropTypes.func.isRequired,
  scrollToParagraph: PropTypes.func.isRequired,
};

export default pure(RestoreReadingProgressNotification);



// WEBPACK FOOTER //
// ./src/js/app/modules/item/components/RestoreReadingProgressNotification/index.js