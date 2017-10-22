import React from 'react';
import AltContainer from 'alt-container';
import NotificationsActions from 'actions/NotificationsActions';
import NotificationsStore from 'stores/NotificationsStore';
import { AnimatedList } from '@blendle/lego';
import CSS from './style.scss';

function onEnterNotification(id) {
  NotificationsActions.stopNotificationTimer(id);
}

function onLeaveNotification(id) {
  NotificationsActions.startNotificationTimer(id, 1000);
}

function renderNotifications(notificationsState) {
  return (
    <div className={CSS.hub}>
      <AnimatedList
        transitionName="slideIn"
        transitionEnterTimeout={200}
        transitionLeaveTimeout={200}
      >
        {notificationsState.hubNotifications
          .filter(({ visible }) => visible)
          .map(({ notificationClass, props, id }) =>
            React.createElement(notificationClass, {
              ...props,
              onMouseEnter: () => onEnterNotification(id),
              onMouseLeave: () => onLeaveNotification(id),
              key: id,
            }),
          )}
      </AnimatedList>
    </div>
  );
}

const NotificationsHubContainer = () => (
  <AltContainer store={NotificationsStore} render={renderNotifications} />
);

export default NotificationsHubContainer;



// WEBPACK FOOTER //
// ./src/js/app/containers/NotificationsHubContainer/index.js