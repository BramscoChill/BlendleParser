import React from 'react';
import PropTypes from 'prop-types';
import Dialogue from 'components/dialogues/Dialogue';
import Button from 'components/Button';
import { translate } from 'instances/i18n';

class JustEnoughBalanceDialogue extends React.Component {
  static propTypes = {
    onClose: PropTypes.func.isRequired,
  };

  render() {
    return (
      <Dialogue hideClose className="dialogue-just-enough-balance">
        <h2>{translate('item.dialogs.justenough.title')}</h2>
        <p>{translate('item.dialogs.justenough.text')}</p>
        <Button onClick={this.props.onClose} className="btn-fullwidth btn-dismiss">
          {translate('item.dialogs.justenough.button')}
        </Button>
      </Dialogue>
    );
  }
}

export default JustEnoughBalanceDialogue;



// WEBPACK FOOTER //
// ./src/js/app/components/dialogues/JustEnoughBalance.js