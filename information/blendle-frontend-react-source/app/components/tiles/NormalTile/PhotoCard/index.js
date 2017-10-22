import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { renderItemContent } from 'helpers/renderItemContent';
import { FadeOut } from '@blendle/lego';
import CardHeader from '../CardHeader';
import AcquiredBackdrop from '../../AcquiredBackdrop';
import CardSocial from '../CardSocial';
import CardFrame from '../CardFrame';
import CSS from './PhotoCard.scss';

export default class PhotoCard extends PureComponent {
  static propTypes = {
    template: PropTypes.string.isRequired,
    body: PropTypes.arrayOf(PropTypes.object).isRequired,
    providerName: PropTypes.string.isRequired,
    providerId: PropTypes.string.isRequired,
    readerUrl: PropTypes.string.isRequired,
    itemId: PropTypes.string.isRequired,
    photo: PropTypes.shape({
      href: PropTypes.string.isRequired,
      caption: PropTypes.string.isRequired,
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
      <CardFrame providerId={providerId} readerUrl={readerUrl} itemId={itemId}>
        {showReadCheckBox && <AcquiredBackdrop backdropClassName={CSS.backdrop} />}
        <header className={CSS.header}>
          <CardHeader
            providerId={providerId}
            providerName={providerName}
            itemId={itemId}
            purchased={showReadCheckBox}
          />
          <div className={CSS.image}>
            <CardSocial className={CSS.social} heartText={heartText} />
            <img src={photo.href} alt={photo.caption} />
          </div>
        </header>
        <section className={CSS.bottom}>
          <FadeOut bottom>{renderItemContent(body, template)}</FadeOut>
        </section>
      </CardFrame>
    );
  }
}



// WEBPACK FOOTER //
// ./src/js/app/components/tiles/NormalTile/PhotoCard/index.js