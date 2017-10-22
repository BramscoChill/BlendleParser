import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Columns } from '@blendle/lego';
import ItemPriceContainer from 'containers/ItemPriceContainer';
import ProviderLogo from '../../../ProviderLogo';
import CSS from './CardHeader.scss';

export default class CardHeader extends PureComponent {
  static propTypes = {
    providerName: PropTypes.string.isRequired,
    providerId: PropTypes.string.isRequired,
    itemId: PropTypes.string.isRequired,
    purchased: PropTypes.bool.isRequired,
    lightColors: PropTypes.bool,
  };

  render() {
    const { providerId, providerName, itemId, purchased, lightColors } = this.props;

    return (
      <Columns className={CSS.cardHeader}>
        <ProviderLogo
          className={CSS.logo}
          logoType={lightColors ? 'white' : 'normalCrop'}
          provider={{ id: providerId, name: providerName }}
        />
        {!purchased && (
          <ItemPriceContainer
            itemId={itemId}
            className={CSS.itemPrice}
            color={lightColors ? 'white' : 'midnight'}
          />
        )}
      </Columns>
    );
  }
}



// WEBPACK FOOTER //
// ./src/js/app/components/tiles/NormalTile/CardHeader/index.js