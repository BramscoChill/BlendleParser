import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { ToolTip } from '@blendle/lego';
import FacebookIcon from 'components/icons/Facebook';
import TwitterIcon from 'components/icons/Twitter';
import LinkedInIcon from 'components/icons/LinkedIn';
import EmailIcon from 'components/icons/Envelope';
import ShareButton from './ShareButton';
import CSS from './style.scss';

class SelectedShareTooltip extends PureComponent {
  static propTypes = {
    open: PropTypes.bool.isRequired,
    onShareFacebook: PropTypes.func.isRequired,
    onShareTwitter: PropTypes.func.isRequired,
    onShareEmail: PropTypes.func.isRequired,
    onShareLinkedIn: PropTypes.func.isRequired,
    position: PropTypes.shape({
      top: PropTypes.number.isRequired,
      left: PropTypes.number.isRequired,
      width: PropTypes.oneOf([PropTypes.number, PropTypes.string]).isRequired,
    }),
  };

  render() {
    const { open, position } = this.props;

    return (
      <ToolTip open={open} position={position}>
        <div className={CSS.buttonsContainer} data-test-identifier="selected-share-tooltip">
          <ShareButton onClick={this.props.onShareFacebook}>
            <FacebookIcon />
          </ShareButton>
          <ShareButton onClick={this.props.onShareTwitter}>
            <TwitterIcon />
          </ShareButton>
          <ShareButton onClick={this.props.onShareEmail} data-test-identifier="share-tooltip-email">
            <EmailIcon />
          </ShareButton>
          <ShareButton onClick={this.props.onShareLinkedIn}>
            <LinkedInIcon />
          </ShareButton>
        </div>
      </ToolTip>
    );
  }
}

export default SelectedShareTooltip;



// WEBPACK FOOTER //
// ./src/js/app/modules/item/components/SelectedShareTooltip/index.js