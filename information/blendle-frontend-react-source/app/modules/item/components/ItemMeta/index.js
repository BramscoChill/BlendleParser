import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import moment from 'moment';
import { HOME_ROUTE } from 'app-constants';
import { getReadingTime } from 'helpers/manifest';
import Link from 'components/Link';
import { translate } from 'instances/i18n';
import PremiumLabel from 'components/PremiumLabel';
import CSS from './style.scss';

class ItemMeta extends PureComponent {
  static propTypes = {
    date: PropTypes.string,
    length: PropTypes.shape({
      words: PropTypes.number.isRequired,
    }),
    showPremiumLabel: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    date: null,
    length: null,
  };

  _renderPremiumLabel() {
    // eslint-disable-line class-methods-use-this
    return (
      <Link href={HOME_ROUTE} className={CSS.premiumLink}>
        · <PremiumLabel className={CSS.premiumLabel} size="small" />
      </Link>
    );
  }

  render() {
    const { date, length, showPremiumLabel } = this.props;
    if (!date || !length) {
      return null;
    }

    const momentDate = moment(date);
    const readingTime = moment.duration(getReadingTime(length), 'minutes').humanize();
    const timeClasses = classNames(CSS.time, {
      [CSS.withPremiumLabel]: showPremiumLabel,
    });

    return (
      <div className={CSS.itemMeta}>
        <p className={CSS.printNotice}>
          {translate('print_notice')} <br />
          {momentDate.format('L')}
        </p>
        <time className={timeClasses} dateTime={momentDate.toISOString()}>
          {`${momentDate.calendar()} · ${readingTime} ${translate(
            'app.manifest.time.to.read_reader',
          )}`}
        </time>
        {showPremiumLabel && this._renderPremiumLabel()}
      </div>
    );
  }
}

export default ItemMeta;



// WEBPACK FOOTER //
// ./src/js/app/modules/item/components/ItemMeta/index.js