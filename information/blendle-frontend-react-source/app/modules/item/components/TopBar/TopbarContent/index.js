import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ProviderLogo from 'components/ProviderLogo';
import PinButton from 'components/buttons/PinButton';
import PurchaseNoticeContainer from '../../../containers/PurchaseNoticeContainer';
import CloseButton from '../../CloseButton';
import PremiumUpsellLink from '../../PremiumUpsellLink';
import ItemOptionsDropdownContainer from '../../../containers/ItemOptionsDropdownContainer';
import ItemToSpeechContainer from '../../../containers/ItemToSpeechContainer';
import CSS from './style.scss';

class TopbarContent extends PureComponent {
  static propTypes = {
    onClose: PropTypes.func.isRequired,
    pinItem: PropTypes.func.isRequired,
    isPinned: PropTypes.bool,
    provider: PropTypes.object,
  };

  static defaultProps = {
    isPinned: false,
    provider: null,
  };

  render() {
    const { onClose, pinItem, isPinned, provider } = this.props;

    return (
      <div className={CSS.topbarContent}>
        <CloseButton onClick={onClose} data-test-identifier="reader-close-button" />
        <PinButton
          className={CSS.pinButton}
          marked={isPinned}
          onChange={pinItem}
          showText={false}
        />
        <PurchaseNoticeContainer />
        <ProviderLogo provider={provider} className={CSS.providerLogo} />
        <div className={CSS.pullRight}>
          <PremiumUpsellLink />
          <ItemToSpeechContainer />
          <div className={CSS.optionsDropdown}>
            <ItemOptionsDropdownContainer />
          </div>
        </div>
      </div>
    );
  }
}

export default TopbarContent;



// WEBPACK FOOTER //
// ./src/js/app/modules/item/components/TopBar/TopbarContent/index.js