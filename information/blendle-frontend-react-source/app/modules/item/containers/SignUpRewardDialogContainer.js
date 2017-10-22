import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import altConnect from 'higher-order-components/altConnect';
import AuthStore from 'stores/AuthStore';
import TilesStore from 'stores/TilesStore';
import ItemStore from 'stores/ItemStore';
import withItemNotifications from '../higher-order-components/withItemNotifications';
import SignUpRewardDialog from '../components/SignUpRewardDialog';

const MaybeSignUpRewardDialog = ({ hidden = false, ...props }) =>
  !hidden && <SignUpRewardDialog {...props} />;
MaybeSignUpRewardDialog.propTypes = {
  hidden: PropTypes.bool,
};

const mapStateToProps = ({ itemState, authState, tilesState }) => {
  const { justAcquired, selectedItemId } = itemState;
  const { tiles } = tilesState;
  const tile = tiles.get(selectedItemId);

  if (!tile) {
    return { hidden: true };
  }

  const { price } = tile;
  const { user } = authState;

  const balance = parseFloat(user.attributes.balance, 10);

  const gift = 2.5;
  const realArticlePrice = price / 100;
  const userHasntBoughtAnythingSoFar = balance === gift - realArticlePrice;

  if (justAcquired && realArticlePrice > 0 && userHasntBoughtAnythingSoFar) {
    //  Only show article cost anything (non-premium aricle)
    return {
      gift,
      price: realArticlePrice,
      userHasPremium: user.hasActivePremiumSubscription(),
    };
  }

  return { hidden: true };
};
mapStateToProps.stores = { ItemStore, TilesStore, AuthStore };

export default compose(withItemNotifications, altConnect(mapStateToProps))(MaybeSignUpRewardDialog);



// WEBPACK FOOTER //
// ./src/js/app/modules/item/containers/SignUpRewardDialogContainer.js