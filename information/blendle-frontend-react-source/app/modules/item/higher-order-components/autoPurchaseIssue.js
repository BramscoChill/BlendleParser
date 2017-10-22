import React, { PureComponent } from 'react';
import { get } from 'lodash';
import ItemStore from 'stores/ItemStore';
import TilesStore from 'stores/TilesStore';
import IssueAcquisitionStore from 'stores/IssueAcquisitionStore';
import IssueAcquisitionActions from 'actions/IssueAcquisitionActions';
import { getTileManifest } from 'selectors/tiles';

function payedForItem(acquisition) {
  return get(acquisition, 'purchase_origin') === 'money';
}

function handleAutoPurchase(itemState, tilesState, issueAcquisitionState) {
  const { autoRefundable, acquisition, selectedItemId, error } = itemState;

  if (error) {
    return;
  }

  const { tiles } = tilesState;
  const tile = tiles.get(selectedItemId);
  const manifest = getTileManifest(tile);
  const issueId = manifest.issue.id;
  const issueAcquisition = get(issueAcquisitionState, `issueAcquisitions.[${issueId}]`);

  if (
    !autoRefundable &&
    payedForItem(acquisition) &&
    get(issueAcquisition, 'acquirable') &&
    get(issueAcquisition, 'price') <= 0
  ) {
    IssueAcquisitionActions.acquireIssue(issueId, manifest.provider.id, 'issue');
  }
}

export default ComposedComponent =>
  class autoPurchaseIssue extends PureComponent {
    _fetched = undefined;

    componentDidMount() {
      TilesStore.listen(this._fetchIssueAcquistion);
      ItemStore.listen(this._fetchIssueAcquistion);
    }

    componentWillUnmount() {
      TilesStore.unlisten(this._fetchIssueAcquistion);
      ItemStore.unlisten(this._fetchIssueAcquistion);

      handleAutoPurchase(
        ItemStore.getState(),
        TilesStore.getState(),
        IssueAcquisitionStore.getState(),
      );
    }

    _fetchIssueAcquistion = () => {
      const { tiles } = TilesStore.getState();
      const { selectedItemId, acquisition } = ItemStore.getState();
      const tile = tiles.get(selectedItemId);

      if (!!tile && payedForItem(acquisition) && this._fetched !== selectedItemId) {
        this._fetched = selectedItemId;

        const manifest = getTileManifest(tile);
        const issueId = manifest.issue.id;
        IssueAcquisitionActions.fetchIssueAcquistion.defer(issueId);
      }
    };

    render() {
      return <ComposedComponent {...this.props} />;
    }
  };



// WEBPACK FOOTER //
// ./src/js/app/modules/item/higher-order-components/autoPurchaseIssue.js