import React from 'react';
import PropTypes from 'prop-types';
import { compose, pure, withHandlers } from 'recompose';
import classNames from 'classnames';
import { platformHasApp } from 'helpers/openApp';
import Heart from 'components/icons/Heart';
import ArrowTopRight from 'components/icons/ArrowTopRight';
import FacebookIcon from 'components/icons/Facebook';
import TwitterIcon from 'components/icons/Twitter';
import LinkedInIcon from 'components/icons/LinkedIn';
import WhatsAppIcon from 'components/icons/WhatsApp';
import EmailIcon from 'components/icons/Envelope';
import withHideOnScroll from '../../higher-order-components/withHideOnScroll';
import withShareToEmail from '../../higher-order-components/withShareToEmail';
import PremiumUpsellButton from '../PremiumUpsellButton';
import OpenInAppButton from './OpenInAppButton';
import CSS from './styles.scss';

const icons = new Map([
  ['facebook', FacebookIcon],
  ['twitter', TwitterIcon],
  ['whatsapp', WhatsAppIcon],
  ['email', EmailIcon],
  ['linkedin', LinkedInIcon],
]);

const socialPlatforms = ['facebook', 'twitter', 'whatsapp', 'email', 'linkedin'];

const MobileStickySharing = ({
  itemId,
  isHiddenByScroll,
  blendleButtonActive,
  blendleButtonLoading,
  onToggleBlendleShare,
  showSharer,
  onToggleSharer,
  onShare,
  hideOpenInApp,
  openItemInAndroid,
  analytics,
  showUpsellButton,
}) => (
  <div className={classNames(CSS.mobileStickySharing, isHiddenByScroll && CSS.isHidden)}>
    <div className={CSS.baseBar}>
      <div>
        <button onClick={onToggleBlendleShare} className={CSS.button}>
          <Heart
            className={classNames(
              CSS.icon,
              CSS.heart,
              blendleButtonActive && CSS.heartActive,
              blendleButtonLoading && CSS.heartActiveLoading,
            )}
          />
        </button>
        <button onClick={onToggleSharer} className={CSS.button}>
          <ArrowTopRight className={classNames(CSS.icon, CSS.arrowTopRight)} />
        </button>
      </div>
      {platformHasApp() &&
        !hideOpenInApp && (
          <OpenInAppButton
            itemId={itemId}
            openItemInAndroid={openItemInAndroid}
            analytics={analytics}
          />
        )}
      <div className={classNames(CSS.sharerArrow, showSharer && CSS.sharerArrowOpen)} />
    </div>

    <div className={classNames(CSS.sharer, showSharer && CSS.sharerOpen)}>
      {socialPlatforms.map((platform) => {
        const Icon = icons.get(platform);
        return (
          <button onClick={onShare(platform)} key={platform}>
            <Icon className={classNames(CSS.icon, CSS[platform])} />
          </button>
        );
      })}
    </div>
    {showUpsellButton && <PremiumUpsellButton className={CSS.upsellButton} />}
  </div>
);

MobileStickySharing.propTypes = {
  itemId: PropTypes.string.isRequired,
  isHiddenByScroll: PropTypes.bool.isRequired,
  blendleButtonActive: PropTypes.bool.isRequired,
  blendleButtonLoading: PropTypes.bool.isRequired,
  onToggleBlendleShare: PropTypes.func.isRequired,
  hideOpenInApp: PropTypes.bool,
  showSharer: PropTypes.bool.isRequired,
  onToggleSharer: PropTypes.func.isRequired,
  onShare: PropTypes.func.isRequired,
  showUpsellButton: PropTypes.bool,
  openItemInAndroid: PropTypes.func.isRequired,
  analytics: PropTypes.object.isRequired,
};

export default compose(
  withHideOnScroll,
  withShareToEmail,
  withHandlers({
    onShare: props => platform => (event) => {
      event.preventDefault();
      if (platform === 'email') {
        props.setEmailDialogueOpen(true);
        props.openEmailShareDialog(true);
      } else {
        props.onSocialShare(platform);
      }
      props.setSharerVisibility(false);
    },
  }),
  pure,
)(MobileStickySharing);



// WEBPACK FOOTER //
// ./src/js/app/modules/item/components/MobileStickySharing/index.js