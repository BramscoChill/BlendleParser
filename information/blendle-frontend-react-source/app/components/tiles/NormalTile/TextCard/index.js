import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { renderItemContent } from 'helpers/renderItemContent';
import { FadeOut } from '@blendle/lego';
import CardHeader from '../CardHeader';
import AcquiredBackdrop from '../../AcquiredBackdrop';
import CardSocial from '../CardSocial';
import CardFrame from '../CardFrame';
import CSS from './TextCard.scss';

export default class TextCard extends PureComponent {
  static propTypes = {
    template: PropTypes.string.isRequired,
    body: PropTypes.arrayOf(PropTypes.object).isRequired,
    providerName: PropTypes.string.isRequired,
    providerId: PropTypes.string.isRequired,
    readerUrl: PropTypes.string.isRequired,
    itemId: PropTypes.string.isRequired,
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
    } = this.props;

    return (
      <CardFrame providerId={providerId} readerUrl={readerUrl} itemId={itemId}>
        {showReadCheckBox && (
          <AcquiredBackdrop innerColor="linear-gradient(47deg, #FF6255 0%, #FF4259 56%, #FF0E61 100%)" />
        )}
        <header className={CSS.header}>
          <CardHeader
            providerId={providerId}
            providerName={providerName}
            itemId={itemId}
            purchased={showReadCheckBox}
          />
          <CardSocial className={CSS.social} heartText={heartText} />
        </header>
        <section className={CSS.bottom}>
          <FadeOut bottom>{renderItemContent(body, template)}</FadeOut>
        </section>
      </CardFrame>
    );
  }
}



// WEBPACK FOOTER //
// ./src/js/app/components/tiles/NormalTile/TextCard/index.js