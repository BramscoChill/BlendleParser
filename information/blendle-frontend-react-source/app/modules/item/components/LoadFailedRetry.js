import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Button, Dialog, DialogBody } from '@blendle/lego';
import { translate } from 'instances/i18n';

class LoadFailedRetry extends PureComponent {
  static propTypes = {
    onDismiss: PropTypes.func.isRequired,
    onRetry: PropTypes.func.isRequired,
  };

  render() {
    return (
      <Dialog onClose={this.props.onDismiss}>
        <DialogBody>
          <p>{translate('item.errors.load_failed')}</p>
          <Button onClick={this.props.onRetry}>{translate('item.buttons.retry')}</Button>
        </DialogBody>
      </Dialog>
    );
  }
}

export default LoadFailedRetry;



// WEBPACK FOOTER //
// ./src/js/app/modules/item/components/LoadFailedRetry.js