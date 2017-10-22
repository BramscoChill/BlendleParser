import React from 'react';
import { string, number, func } from 'prop-types';
import { Dialog, DialogBody, Label, Button, ButtonGroup } from '@blendle/lego';
import UserAvatar from 'components/UserAvatar';
import Link from 'components/Link';
import { formatCurrency } from 'instances/i18n';
import CSS from './styles.scss';

function BuyItemWarningDialog({
  userAvatar,
  firstName,
  balance,
  itemPrice,
  acquireItemPath,
  handleDialogClose,
  handleAcquireItem,
}) {
  return (
    <Dialog onClose={handleDialogClose}>
      <DialogBody>
        <p className={CSS.balance}>
          <span>Huidig tegoed: </span>
          <Label color="cappuccino">{formatCurrency(balance)}</Label>
        </p>
        <UserAvatar className={CSS.avatar} url={userAvatar} />
        <h2>Welkom terug {firstName}!</h2>
        <p>
          Dit artikel kun je lezen voor {formatCurrency(itemPrice)}. Niet goed? Geld terug, met één
          klik.
        </p>
        <div>
          <ButtonGroup vertical>
            <Button
              type="link"
              href={acquireItemPath}
              withComponent={Link}
              onClick={handleAcquireItem}
              data-test-identifier="acquire-item-button"
            >
              Lezen voor {formatCurrency(itemPrice)}
            </Button>
          </ButtonGroup>
        </div>
      </DialogBody>
    </Dialog>
  );
}
BuyItemWarningDialog.propTypes = {
  userAvatar: string.isRequired,
  firstName: string.isRequired,
  balance: number.isRequired,
  itemPrice: number.isRequired,
  acquireItemPath: string.isRequired,
  handleDialogClose: func.isRequired,
  handleAcquireItem: func.isRequired,
};

export default BuyItemWarningDialog;



// WEBPACK FOOTER //
// ./src/js/app/modules/item/components/BuyItemWarningDialog/index.js