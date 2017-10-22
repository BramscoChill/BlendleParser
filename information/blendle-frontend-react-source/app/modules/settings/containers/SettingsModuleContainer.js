import React from 'react';
import PropTypes from 'prop-types';
import { getReturnUrl } from 'helpers/routerHelpers';
import { keyCode } from 'app-constants';
import withRouter from 'react-router/lib/withRouter';
import SettingsController from '../controllers/settings';

class SettingsModuleContainer extends React.Component {
  static propTypes = {
    router: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    page: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
  };

  componentDidMount() {
    document.body.classList.add('m-settings');

    const { location, router } = this.props;
    this._returnUrl = getReturnUrl(location.pathname);

    this.controller = new SettingsController({
      target: this.node,
      onClose: () => router.push(this._returnUrl),
    });

    this._loadPage(this.props);

    this._onKeyDown = this._onKeyDown.bind(this);
    window.addEventListener('keydown', this._onKeyDown);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.page.type !== this.props.page.type) {
      this._loadPage(nextProps);
    }
  }

  componentWillUnmount() {
    document.body.classList.remove('m-settings');
    window.removeEventListener('keydown', this._onKeyDown);
  }

  _loadPage(props) {
    let args = [];
    const page = props.page.type;
    const params = props.params;
    const query = props.location.query;

    switch (page) {
      case 'Profile':
        args = [params.action];
        break;
      case 'Emails':
        args = [query];
        break;
      case 'Coupons':
        args = [params.paymentState];
        break;
      case 'Subscriptions':
        args = [params.provider];
        break;
      case 'SubscriptionsResult':
        args = [params.provider, params.status];
        break;
      case 'SubscriptionCallback':
        // Some subscription providers use GET parameters instead of /:code
        args = [params.provider, params.code || query.code || query.token || query.st];
        break;
      default:
        args = [params.action];
        break;
    }
    this.controller[`open${page}`](...args);
  }

  _onKeyDown(e) {
    // Close dialog on esc
    if (e.keyCode === keyCode.ESC) {
      this.props.router.push(this._returnUrl);
    }
  }

  render() {
    return (
      <div
        ref={(node) => {
          this.node = node;
        }}
        className="v-module v-overlay v-settings s-success white-close v-module-overlay"
      />
    );
  }
}

export default withRouter(SettingsModuleContainer);



// WEBPACK FOOTER //
// ./src/js/app/modules/settings/containers/SettingsModuleContainer.js