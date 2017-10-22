import { compose, mapProps } from 'recompose';
import withViewportSize from 'higher-order-components/withViewportSize';
import withRouter from 'react-router/lib/withRouter';
import LoginDropdown from 'components/navigation/LoginDropdown';

function propsMapper({ isMobileViewport, router, ...props }) {
  return {
    mobile: isMobileViewport,
    open:
      router.isActive('/login') ||
      router.isActive('/signup/login') ||
      router.isActive('/login/reset'),
    activeLoginPane: router.isActive('/login/reset') ? 'resetPassword' : 'login',
    ...props,
  };
}

const enhance = compose(withRouter, withViewportSize(), mapProps(propsMapper));

export default enhance(LoginDropdown);



// WEBPACK FOOTER //
// ./src/js/app/containers/navigation/LoginDropdownContainer.js