import React, { Component } from 'react';
import { Overlay, OverlayTitle, OverlayBody } from '@blendle/lego';
import authController from 'controllers/auth';
import { translate, translateElement } from 'instances/i18n';
import CSS from './styles.scss';

export default class GoodbyeOverlay extends Component {
  componentDidMount() {
    authController.logout();
    document.body.classList.add('s-enable-overlay');
  }

  componentWillUnmount() {
    document.body.classList.remove('s-enable-overlay');
  }

  render() {
    return (
      <Overlay>
        <div className={CSS.goodbyeOverlay}>
          <OverlayTitle className={CSS.header}>{translate('goodbye.header')}</OverlayTitle>
          <OverlayBody>
            <video autoPlay loop muted playsInline className={CSS.video}>
              <source src="/img/illustrations/so-long-partner.mp4" type="video/mp4" />
            </video>
            <div>{translateElement('goodbye.body')}</div>
          </OverlayBody>
        </div>
      </Overlay>
    );
  }
}



// WEBPACK FOOTER //
// ./src/js/app/modules/goodbye/components/GoodbyeOverlay/index.js