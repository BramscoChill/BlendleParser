import React from 'react';
import PropTypes from 'prop-types';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { DialogBody, Dialog } from '@blendle/lego';
import classNames from 'classnames';
import googleAnalytics from 'instances/google_analytics';
import { preloadImage, getHdImage } from 'helpers/images';
import { shouldTrackGAClickEvent } from 'helpers/premiumOnboardingEvents';
import CSS from './SignupDialog.scss';

export default class SignupDialog extends React.Component {
  static propTypes = {
    header: PropTypes.element,
    body: PropTypes.element,
    footer: PropTypes.element,
    overlay: PropTypes.element,
    onClose: PropTypes.func,
    route: PropTypes.object.isRequired,
  };

  componentDidMount() {
    const confirmEmailGif = getHdImage(
      '/img/illustrations/check_email.gif',
      '/img/illustrations/check_email@2x.gif',
    );
    const preloadCover = '/img/signup/preload.cover.svg';

    preloadImage(confirmEmailGif);
    preloadImage(preloadCover);
  }

  _onClose = (...args) => {
    const { pathname } = window.location;
    if (shouldTrackGAClickEvent(pathname)) {
      googleAnalytics.trackEvent(pathname, 'button', 'close');
    }

    this.props.onClose(...args);
  };

  _renderOverlayContent = () => this.props.overlay;

  render() {
    const { header, body, footer, route } = this.props;

    const childRoute = window.location.pathname
      .replace(/\/$/, '')
      .split('/')
      .pop();
    const activeChildroute = route.childRoutes.find(r => r.path === childRoute);
    const { animationKey, path: routePath } = activeChildroute || {};

    if (!body) {
      return null;
    }

    const isFullScreen = activeChildroute && activeChildroute.fullScreen;
    const dialogClasses = classNames(CSS.dialog, {
      [CSS.fullscreen]: isFullScreen,
    });
    const transitionGroupClasses = classNames(CSS.transitionGroup, {
      [CSS.auth]: animationKey === 'auth',
      [CSS.channels]: routePath === 'channels',
      [CSS.publications]: routePath === 'publications',
      [CSS.confirm]: routePath === 'confirm',
      [CSS.changeEmail]: routePath === 'change-email',
      [CSS.vodafoneConnect]: routePath === 'vodafone-connect',
    });

    return (
      <div className={CSS.wrapper}>
        <Dialog
          fullScreen={isFullScreen}
          hideClose={isFullScreen}
          className={dialogClasses}
          closeOnOverlayClick={false}
          overlayRender={this._renderOverlayContent}
          onClose={this._onClose}
        >
          <ReactCSSTransitionGroup
            transitionName="premium-signup-header"
            transitionAppearTimeout={1250}
            transitionEnterTimeout={1250}
            transitionLeaveTimeout={250}
          >
            {header}
          </ReactCSSTransitionGroup>
          <ReactCSSTransitionGroup
            component={DialogBody}
            className={transitionGroupClasses}
            transitionName="premium-signup"
            transitionAppearTimeout={1300}
            transitionEnterTimeout={1300}
            transitionLeaveTimeout={500}
          >
            {React.cloneElement(body, {
              isOnboarding: activeChildroute && activeChildroute.isOnboarding,
              /*
               * The key needs to be the same for login/signup/reset routes:
               * The ReactCSSTransitionGroup will trigger complex animations when the components key changes
               * and those will override the stepsContainer animations.
               */
              key: animationKey || window.location.pathname,
            })}
          </ReactCSSTransitionGroup>
          {footer}
        </Dialog>
      </div>
    );
  }
}



// WEBPACK FOOTER //
// ./src/js/app/modules/premiumSignup/components/SignupDialog/index.js