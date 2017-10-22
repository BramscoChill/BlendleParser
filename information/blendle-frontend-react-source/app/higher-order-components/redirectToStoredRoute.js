import withRouter from 'react-router/lib/withRouter';
import { REDIRECT_TO_URL } from 'app-constants';
import ApplicationStore from 'stores/ApplicationStore';
import ApplicationActions from 'actions/ApplicationActions';
import { compose, lifecycle } from 'recompose';

export default compose(
  withRouter,
  lifecycle({
    componentDidMount() {
      if (ApplicationStore.getState()[REDIRECT_TO_URL]) {
        setTimeout(() => this.props.router.push(ApplicationStore.getState()[REDIRECT_TO_URL]));
        ApplicationActions.set.defer(REDIRECT_TO_URL, null);
      }
    },
  }),
);



// WEBPACK FOOTER //
// ./src/js/app/higher-order-components/redirectToStoredRoute.js