import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import withHideOnScroll from '../../higher-order-components/withHideOnScroll';
import classNames from 'classnames';
import ShareToEmailContainer from 'containers/dialogues/ShareToEmailContainer';
import PremiumUpsellButton from '../PremiumUpsellButton';
import CSS from './StickySharing.scss';

const shareAnalytics = { location_in_layout: 'sticky-sharing-bottom-bar' };

class StickySharing extends PureComponent {
  static propTypes = {
    onSocialShare: PropTypes.func.isRequired,
    onToggleBlendleShare: PropTypes.func.isRequired,
    analytics: PropTypes.object.isRequired,
    itemId: PropTypes.string.isRequired,
    className: PropTypes.string,
    blendleButtonActive: PropTypes.bool,
    blendleButtonLoading: PropTypes.bool,
    showUpsellButton: PropTypes.bool,
    isHiddenByScroll: PropTypes.bool,
  };

  state = {
    isEmailDialogueOpen: false,
  };

  _createSocialShare = (platform) => {
    if (platform === 'email') {
      return this._onClickEmailButton;
    } else if (platform === 'blendle') {
      return this.props.onToggleBlendleShare;
    }
    return () => this.props.onSocialShare(platform);
  };

  _onClickEmailButton = (e) => {
    e.preventDefault();
    this.setState({ isEmailDialogueOpen: true });
  };

  _onEmailShare = () => {
    this.setState({ isEmailDialogueOpen: false });
  };

  _renderButtons() {
    return ['Blendle', 'Facebook', 'Twitter', 'Whatsapp', 'Email', 'Linkedin'].map(platform => (
      <div
        className={classNames(CSS.icon, CSS[`icon${platform}`], {
          [CSS.iconBlendleLiked]: platform === 'Blendle' && this.props.blendleButtonActive,
          [CSS.iconLoading]: platform === 'Blendle' && this.props.blendleButtonLoading,
        })}
        key={platform}
        onClick={this._createSocialShare(platform.toLowerCase())}
      />
    ));
  }

  /**
   * @param {boolean} isHidden
   * @returns {React.Element}
   *
   * @memberOf StickySharing
   */
  render() {
    const { isHiddenByScroll } = this.props;
    const containerClassNames = classNames(CSS.container, {
      [CSS.isHidden]: isHiddenByScroll,
    });

    const { itemId, showUpsellButton } = this.props;

    const { isEmailDialogueOpen } = this.state;

    return (
      <div className={containerClassNames}>
        {showUpsellButton && <PremiumUpsellButton />}
        <div className={CSS.stickySharing}>
          <div className={CSS.buttons}>
            {this._renderButtons()}
            <ShareToEmailContainer
              itemId={itemId}
              analytics={shareAnalytics}
              isVisible={isEmailDialogueOpen}
              onClose={this._onEmailShare}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default withHideOnScroll(StickySharing);



// WEBPACK FOOTER //
// ./src/js/app/modules/item/components/DesktopStickySharing/index.js