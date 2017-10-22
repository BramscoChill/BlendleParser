import constants from 'app-constants';
import alt from 'instances/altInstance';
import NotificationsActions from '../actions/NotificationsActions';

class NotificationsStore {
  constructor() {
    this.bindActions(NotificationsActions);

    this.state = {
      status: constants.STATUS_INITIAL,
      hubNotifications: [],
      hubNotificationTimers: {},
    };
  }

  onShowNotification({ notificationClass, props, id }) {
    this.setState({
      hubNotifications: [
        ...this.state.hubNotifications,
        {
          notificationClass,
          props,
          visible: true,
          id,
        },
      ],
    });
  }

  onHideNotification({ id }) {
    this.setState({
      hubNotifications: this.state.hubNotifications.map((notification) => {
        if (notification.id === id) {
          return {
            ...notification,
            visible: false,
          };
        }

        return notification;
      }),
    });
  }

  onStartNotificationTimer({ id, timer }) {
    this.setState({
      hubNotificationTimers: {
        ...this.state.hubNotificationTimers,
        [id]: timer,
      },
    });
  }

  onStopNotificationTimer({ id }) {
    clearTimeout(this.state.hubNotificationTimers[id]);
  }
}

export default alt.createStore(NotificationsStore, 'NotificationsStore');



// WEBPACK FOOTER //
// ./src/js/app/stores/NotificationsStore.js