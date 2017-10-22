import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { renderItemContent } from 'helpers/renderItemContent';
import CardHeader from '../CardHeader';
import AcquiredBackdrop from '../../AcquiredBackdrop';
import CardSocial from '../CardSocial';
import CardFrame from '../CardFrame';
import CSS from './PortraitCard.scss';

export default class PortraitCard extends PureComponent {
  static propTypes = {
    template: PropTypes.string.isRequired,
    body: PropTypes.arrayOf(PropTypes.object).isRequired,
    providerName: PropTypes.string.isRequired,
    providerId: PropTypes.string.isRequired,
    readerUrl: PropTypes.string.isRequired,
    itemId: PropTypes.string.isRequired,
    photo: PropTypes.shape({
      href: PropTypes.string.isRequired,
    }).isRequired,
    heartText: PropTypes.string,
    showReadCheckBox: PropTypes.bool,
  };

  render() {
    const {
      template,
      body,
      providerId,
      providerName,
      heartText,
      showReadCheckBox,
      itemId,
      readerUrl,
      photo,
    } = this.props;

    return (
      <CardFrame
        providerId={providerId}
        readerUrl={readerUrl}
        itemId={itemId}
        className={CSS.frame}
        lightColors
      >
        <header className={CSS.header}>
          <CardHeader
            providerId={providerId}
            providerName={providerName}
            itemId={itemId}
            purchased={showReadCheckBox}
            lightColors
          />
          <CardSocial className={CSS.social} heartText={heartText} />
        </header>
        {showReadCheckBox && (
          <AcquiredBackdrop innerColor="linear-gradient(47deg, #FF6255 0%, #FF4259 56%, #FF0E61 100%)" />
        )}
        <div
          className={CSS.image}
          style={{
            backgroundImage: `url(${photo.href})`,
          }}
        />
        <section className={CSS.bottom}>{renderItemContent(body, template)}</section>
      </CardFrame>
    );
  }
}



// WEBPACK FOOTER //
// ./src/js/app/components/tiles/NormalTile/PortraitCard/index.js