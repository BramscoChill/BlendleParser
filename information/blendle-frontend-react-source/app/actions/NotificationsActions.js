import alt from 'instances/altInstance';

class NotificationsActions {
  showNotification(notificationClass, props, id, { duration = 5000, delay = 0 } = {}) {
    const payload = { notificationClass, props, id };

    if (delay) {
      return (dispatch) => {
        setTimeout(() => {
          this.startNotificationTimer(id, duration);

          dispatch(payload);
        }, delay);
      };
    }

    this.startNotificationTimer(id, duration);
    return payload;
  }

  hideNotification(id) {
    return { id };
  }

  startNotificationTimer(id, duration) {
    this.stopNotificationTimer(id);

    const timer = setTimeout(() => {
      this.hideNotification(id);
    }, duration);

    return { id, timer };
  }

  stopNotificationTimer(id) {
    return { id };
  }
}

export default alt.createActions(NotificationsActions);



// WEBPACK FOOTER //
// ./src/js/app/actions/NotificationsActions.js