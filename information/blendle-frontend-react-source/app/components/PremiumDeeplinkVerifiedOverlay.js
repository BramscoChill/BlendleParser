import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  Overlay,
  OverlayTitle,
  OverlayBody,
  Button,
  ButtonGroup,
  SocialButton,
} from '@blendle/lego';
import Confetti from 'components/SquareConfetti';

export default class VerifiedOverlay extends PureComponent {
  static propTypes = {
    user: PropTypes.object.isRequired,
    onDismiss: PropTypes.func.isRequired,
    onClickTweet: PropTypes.func.isRequired,
  };

  _renderTitle() {
    const firstName = this.props.user.get('first_name');
    if (firstName) {
      return `Welkom ${firstName}, hier is je artikel!`;
    }

    return 'Welkom, hier is je artikel!';
  }

  render() {
    return (
      <Overlay data-test-identifier="premium-deeplink-signup-confetti">
        <Confetti limit={200}>
          <div>
            <OverlayTitle>{this._renderTitle()}</OverlayTitle>
            <OverlayBody>
              Verder verzamelen we elke dag uit 120 kranten en tijdschriften de artikelen die bij
              jou passen. Je leest ze een week lang <strong>gratis</strong>.
            </OverlayBody>
            <ButtonGroup>
              <Button onClick={this.props.onDismiss}>Oké, ik snap het!</Button>
              <SocialButton.TwitterButton onClick={this.props.onClickTweet}>
                Delen op Twitter
              </SocialButton.TwitterButton>
            </ButtonGroup>
          </div>
        </Confetti>
      </Overlay>
    );
  }
}



// WEBPACK FOOTER //
// ./src/js/app/components/PremiumDeeplinkVerifiedOverlay.js