import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { PREMIUM_EXTENDED_TRIAL_PRODUCT } from 'app-constants';
import googleAnalytics from 'instances/google_analytics';
import { Dialog, Backdrop, Button } from '@blendle/lego';
import PremiumDialogBody from 'components/dialogues/PremiumDialogBody';
import Analytics from 'instances/analytics';
import CSS from './style.scss';

class ExtendedTrialErrorDialog extends PureComponent {
  static propTypes = {
    userEmail: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired,
  };

  componentDidMount() {
    Analytics.track('Provider Subscription/Subscription Error', {
      subscription_product_uid: PREMIUM_EXTENDED_TRIAL_PRODUCT,
      error: 'Not eligible',
    });
    googleAnalytics.trackEvent(window.location.pathname, 'extend trial', 'fail');
  }

  render() {
    const { onClose, userEmail } = this.props;

    return (
      <Dialog
        onClose={onClose}
        className={CSS.dialog}
        closeButtonClassName={CSS.closeButton}
        data-test-identifier="extended-trial-uneligible"
      >
        <PremiumDialogBody
          backdropColor={Backdrop.red()}
          backdropShapeColor={Backdrop.yellow()}
          illustrationSrcSet="/img/illustrations/premium/crab_jacuzzi.png 1x, /img/illustrations/premium/crab_jacuzzi@2x.png 2x"
          backdropShapeClassName={CSS.backdropShape}
        >
          <h2>Sorry, niet gelukt</h2>
          <p>
            Het lijkt erop dat je extra week gratis Blendle Premium al is gebruikt, of dat je al een
            andere aanbieding hebt geactiveerd op dit account ({userEmail}).
          </p>
          <Button onClick={onClose} className={CSS.cta}>
            Oké
          </Button>
        </PremiumDialogBody>
      </Dialog>
    );
  }
}

export default ExtendedTrialErrorDialog;



// WEBPACK FOOTER //
// ./src/js/app/components/ExtendedTrialErrorDialog/index.js