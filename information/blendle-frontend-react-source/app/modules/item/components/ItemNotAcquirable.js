import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Button, Dialog, DialogBody, DialogTitle } from '@blendle/lego';
import { translate } from 'instances/i18n';
import Analytics from 'instances/analytics';

class ItemNotAcquirable extends PureComponent {
  static propTypes = {
    onDismiss: PropTypes.func.isRequired,
    providerName: PropTypes.string.isRequired,
    providerId: PropTypes.string.isRequired,
    itemId: PropTypes.string.isRequired,
  };

  componentDidMount() {
    Analytics.track('Item Not Acquirable', {
      providerId: this.props.providerId,
      itemId: this.props.itemId,
    });
  }

  render() {
    const { providerName } = this.props;
    const dayLimit = 30;
    const message = translate('item.errors.not_aquirable.message', [
      providerName,
      dayLimit,
      dayLimit,
    ]);

    return (
      <Dialog onClose={this.props.onDismiss} data-test-identifier="not-acquirable">
        <DialogTitle>{translate('item.errors.not_aquirable.title')}</DialogTitle>
        <DialogBody>
          <p>{message}</p>
          <Button className="btn-dismiss" onClick={this.props.onDismiss}>
            {translate('app.buttons.i_get_it')}
          </Button>
        </DialogBody>
      </Dialog>
    );
  }
}

export default ItemNotAcquirable;



// WEBPACK FOOTER //
// ./src/js/app/modules/item/components/ItemNotAcquirable.js