import React from 'react';
import { Columns } from '@blendle/lego';
import { shape, number, string } from 'prop-types';
import moment from 'moment';
import { getReadingTime } from 'helpers/manifest';
import { translate } from 'instances/i18n';
import CSS from './style.scss';

function ItemDetails({ itemLength, date }) {
  return (
    <dl className={CSS.itemDetails}>
      <Columns>
        <dt className={CSS.label}>{translate('app.manifest.time.to.read')}</dt>
        <dd title={translate('app.text.nr_words', [itemLength.words])}>
          {moment.duration(getReadingTime(itemLength), 'minutes').humanize()}
        </dd>
      </Columns>
      <Columns>
        <dt className={CSS.label}>{translate('app.manifest.date')}</dt>
        <dd>{moment(date).format('LL')}</dd>
      </Columns>
    </dl>
  );
}

ItemDetails.propTypes = {
  itemLength: shape({
    words: number.isRequired,
  }).isRequired,
  date: string.isRequired,
};

export default ItemDetails;



// WEBPACK FOOTER //
// ./src/js/app/components/ManifestDropdown/ItemDetails/index.js