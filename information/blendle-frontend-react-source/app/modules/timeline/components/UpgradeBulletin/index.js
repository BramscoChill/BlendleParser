import React from 'react';
import { bool, number, string, func } from 'prop-types';
import classNames from 'classnames';
import { CloseIcon } from '@blendle/lego';
import Message from './Message';
import CtaButton from './CtaButton';
import CSS from './style.scss';

function UpgradeBulletin({
  daysLeft,
  name,
  hadPremiumSubscription,
  followupSubscription,
  onUpsellClicked,
  onCloseClick,
  isVisible,
  onMouseEnter,
  onMouseLeave,
}) {
  const bulletinClasses = classNames(CSS.bulletin, {
    [CSS.isVisible]: isVisible,
  });

  return (
    <div className={CSS.upgradeContainer} data-test-identifier="upgrade-bulletin">
      <div className={bulletinClasses} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
        <Message name={name} daysLeft={daysLeft} />
        <CtaButton
          hadPremiumSubscription={hadPremiumSubscription}
          followupSubscription={followupSubscription}
          onUpsellClicked={onUpsellClicked}
        />
        <button type="button" onClick={onCloseClick} className={CSS.closeButton}>
          <CloseIcon className={CSS.closeIcon} fill="currentColor" />
        </button>
      </div>
    </div>
  );
}

UpgradeBulletin.propTypes = {
  isVisible: bool,
  daysLeft: number.isRequired,
  name: string,
  hadPremiumSubscription: bool,
  followupSubscription: string.isRequired,
  onUpsellClicked: func,
  onMouseEnter: func,
  onMouseLeave: func,
  onCloseClick: func,
};

UpgradeBulletin.defaultProps = {
  isVisible: true,
  onUpsellClicked: () => {},
  onMouseEnter: () => {},
  onMouseLeave: () => {},
  onCloseClick: () => {},
  hadPremiumSubscription: false,
  name: '',
};

export default UpgradeBulletin;



// WEBPACK FOOTER //
// ./src/js/app/modules/timeline/components/UpgradeBulletin/index.js