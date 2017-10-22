import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { DialogFooter } from '@blendle/lego';
import { translate } from 'instances/i18n';
import Link from 'components/Link';
import googleAnalytics from 'instances/google_analytics';
import { shouldTrackGAClickEvent } from 'helpers/premiumOnboardingEvents';
import CSS from './ChannelsFooter.scss';

class ChannelsFooter extends PureComponent {
  static propTypes = {
    nextRoute: PropTypes.string.isRequired,
    handleClickNext: PropTypes.func,
  };

  _onClickNext = () => {
    const { pathname } = window.location;
    const { handleClickNext } = this.props;

    if (shouldTrackGAClickEvent(pathname)) {
      googleAnalytics.trackEvent(pathname, 'button', 'ga door');
    }

    if (typeof handleClickNext === 'function') {
      handleClickNext();
    }
  };

  render() {
    const buttonStyles = classNames('btn', [CSS.nextButton]);
    const { nextRoute } = this.props;

    return (
      <DialogFooter className={CSS.footer}>
        <Link
          href={nextRoute}
          className={buttonStyles}
          onClick={this._onClickNext}
          data-test-identifier="nextButton"
        >
          {translate('preferences.next')}
        </Link>
      </DialogFooter>
    );
  }
}

export default ChannelsFooter;



// WEBPACK FOOTER //
// ./src/js/app/modules/premiumSignup/components/ChannelsFooter/index.js