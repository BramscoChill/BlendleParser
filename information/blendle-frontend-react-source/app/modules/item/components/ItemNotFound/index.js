import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Button, Dialog, DialogBody } from '@blendle/lego';
import { translate } from 'instances/i18n';

class ItemNotFound extends PureComponent {
  static propTypes = {
    onDismiss: PropTypes.func.isRequired,
  };

  render() {
    return (
      <Dialog onClose={this.props.onDismiss} data-test-identifier="item-not-found">
        <DialogBody>
          <p>{translate('item.errors.not_found')}</p>
          <Button onClick={this.props.onDismiss}>{translate('item.buttons.close')}</Button>
        </DialogBody>
      </Dialog>
    );
  }
}

export default ItemNotFound;



// WEBPACK FOOTER //
// ./src/js/app/modules/item/components/ItemNotFound/index.js