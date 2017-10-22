import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Dialog, DialogBody, Backdrop, Button, ButtonGroup } from '@blendle/lego';
import { PREMIUM_PROVIDER_ID } from 'app-constants';
import Analytics from 'instances/analytics';
import Link from 'components/Link';
import CalendarIcon from 'components/CalendarIcon';
import CSS from './PremiumAlmostExpired.scss';

const getTags = ({ subscriptionUid, daysLeft }) => [
  `${subscriptionUid}-active`,
  `${subscriptionUid}-${daysLeft}-days-left`,
];

class PremiumAlmostExpired extends PureComponent {
  static propTypes = {
    onClose: PropTypes.func.isRequired,
    onUpsell: PropTypes.func,
    daysLeft: PropTypes.number,
  };

  componentDidMount() {
    Analytics.track('Upsell Dialog Shown', {
      tags: getTags(this.props),
    });
  }

  _onClose = () => {
    this.props.onClose({ location_in_layout: 'button', tags: getTags(this.props) });
  };

  _onUpsell = () => {
    this.props.onUpsell({
      tags: getTags(this.props),
    });
  };

  _renderAlmostExpired() {
    const { daysLeft } = this.props;
    const title =
      daysLeft === 1
        ? `Nog ${daysLeft} dag gratis Blendle Premium`
        : `Je laatste ${daysLeft} dagen gratis`;

    return (
      <div className={CSS.dialogBodyInner} data-test-identifier="premium-almost-expired-dialog">
        <h2>{title}</h2>
        <p>
          Ook daarna onbeperkt toegang houden tot de artikelen die we voor jou selecteren? Regel het
          nu alvast.
        </p>
        <ButtonGroup vertical>
          <Link
            data-test-identifier="link-upsell-premium"
            className="btn"
            onClick={this._onUpsell}
            href={`/subscription/${PREMIUM_PROVIDER_ID}`}
          >
            <strong>Oké, meer info graag</strong>
          </Link>
          <Button
            data-test-identifier="maybe-later-button"
            color="transparent"
            onClick={this._onClose}
          >
            Misschien later
          </Button>
        </ButtonGroup>
      </div>
    );
  }

  _renderLastDay() {
    return (
      <div className={CSS.dialogBodyInner} data-test-identifier="premium-almost-expired-dialog">
        <h2>Je laatste dag gratis Blendle Premium</h2>
        <p>
          Ook na vandaag onbeperkt toegang houden tot de artikelen die we voor jou selecteren? Regel
          het nu alvast.
        </p>
        <ButtonGroup vertical>
          <Link
            className="btn"
            onClick={this._onUpsell}
            href={`/subscription/${PREMIUM_PROVIDER_ID}`}
          >
            <strong>Oké, meer info graag</strong>
          </Link>
          <Button color="transparent" onClick={this._onClose}>
            Misschien later
          </Button>
        </ButtonGroup>
      </div>
    );
  }

  render() {
    const { daysLeft } = this.props;
    const calendarDayCount = daysLeft === 0 ? 1 : daysLeft;

    return (
      <Dialog className={CSS.dialog} onClose={this._onClose}>
        <DialogBody className={CSS.dialogBody}>
          <Backdrop
            className={CSS.header}
            color={Backdrop.purple()}
            innerColor={Backdrop.yellow()}
            innerStyle={{
              width: '70%',
              height: '250%',
              top: '-80%',
              right: '-5%',
            }}
            rotate={45}
          />
          <CalendarIcon className={CSS.illustration} daysLeft={calendarDayCount} />
          {daysLeft === 0 ? this._renderLastDay() : this._renderAlmostExpired()}
        </DialogBody>
      </Dialog>
    );
  }
}

export default PremiumAlmostExpired;



// WEBPACK FOOTER //
// ./src/js/app/modules/item/components/PremiumAlmostExpired/index.js