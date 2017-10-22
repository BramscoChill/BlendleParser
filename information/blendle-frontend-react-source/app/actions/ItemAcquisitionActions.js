import alt from 'instances/altInstance';

class ItemAcquisitionActions {
  acquireItemSuccess({ itemId }) {
    return { itemId };
  }
}

export default alt.createActions(ItemAcquisitionActions);



// WEBPACK FOOTER //
// ./src/js/app/actions/ItemAcquisitionActions.js