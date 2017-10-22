import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { translate } from 'instances/i18n';
import { getReadingTime } from 'helpers/manifest';
import CSS from './style.scss';

const ItemStats = ({ itemLength, date }) => (
  <div className={CSS.itemStats}>
    <table>
      <tbody>
        <tr>
          <td className={CSS.label}>{translate('app.manifest.time.to.read')}</td>
          <td className={CSS.value}>
            {moment.duration(getReadingTime(itemLength), 'minutes').humanize()}
          </td>
        </tr>
        <tr>
          <td className={CSS.label}>{translate('app.manifest.date')}</td>
          <td className={CSS.value}>{moment(date).format('LL')}</td>
        </tr>
      </tbody>
    </table>
  </div>
);
ItemStats.propTypes = {
  itemLength: PropTypes.shape({
    words: PropTypes.number,
  }).isRequired,
  date: PropTypes.string.isRequired,
};

export default ItemStats;



// WEBPACK FOOTER //
// ./src/js/app/modules/item/components/TopBar/OptionsDropdown/ItemStats/index.js