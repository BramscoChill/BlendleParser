import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Overlay, OverlayTitle, OverlayBody, ButtonGroup, SocialButton } from '@blendle/lego';
import Link from 'components/Link';
import Confetti from 'components/SquareConfetti';
import { HOME_ROUTE } from 'app-constants';

export default class VerifiedOverlay extends PureComponent {
  static propTypes = {
    bodyText: PropTypes.string,
    onClickTweet: PropTypes.func.isRequired,
    hideTwitterButton: PropTypes.bool,
  };

  _renderDissmisButton() {
    const { dismissRoute } = this.props;

    if (!dismissRoute) {
      return null;
    }

    return (
      <Link href={dismissRoute} className="btn btn-secondary">
        Ik kijk straks wel
      </Link>
    );
  }

  _renderTwitterButton() {
    if (this.props.hideTwitterButton) {
      return null;
    }

    return (
      <SocialButton.TwitterButton onClick={this.props.onClickTweet}>
        Delen op Twitter
      </SocialButton.TwitterButton>
    );
  }

  _renderBody() {
    const { bodyText } = this.props;
    if (bodyText) {
      return (
        <OverlayBody
          dangerouslySetInnerHTML={{
            __html: bodyText,
          }}
        />
      );
    }

    return (
      <OverlayBody>
        Je gratis week Blendle Premium gaat *nu* van&nbsp;start.<br />
        De beste artikelen van vandaag staan alvast voor je&nbsp;klaar!
      </OverlayBody>
    );
  }

  render() {
    return (
      <Overlay data-test-identifier="premium-signup-confetti">
        <Confetti limit={200}>
          <div>
            <OverlayTitle>Hoppa, gelukt!</OverlayTitle>
            {this._renderBody()}
            <ButtonGroup>
              <Link href={HOME_ROUTE} className="btn">
                Bekijk je selectie
              </Link>
              {this._renderTwitterButton()}
              {this._renderDissmisButton()}
            </ButtonGroup>
          </div>
        </Confetti>
      </Overlay>
    );
  }
}



// WEBPACK FOOTER //
// ./src/js/app/components/PremiumVerifiedOverlay.js