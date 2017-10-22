import React, { PureComponent } from 'react';
import { bool } from 'prop-types';
import { history } from 'byebye';
import URI from 'urijs';
import ItemStore from 'stores/ItemStore';
import TilesStore from 'stores/TilesStore';
import ProvidersStore from 'stores/ProviderStore';
import AuthStore from 'stores/AuthStore';
import { createItemUri } from 'helpers/prettyurl';
import { providerById } from 'selectors/providers';
import { getTileManifest } from 'selectors/tiles';
import { getManifestBody, getTitle, getContentAsText } from 'helpers/manifest';
import TitleHelper from 'helpers/title';
import { getHash } from 'helpers/sharerHash';

export default ComposedComponent =>
  class WithPrettyUri extends PureComponent {
    static propTypes = {
      isContentReady: bool,
    };

    constructor(props) {
      super(props);

      this._setTitleId = null;
    }

    componentDidMount() {
      ItemStore.listen(this._shouldRedirect);
      TilesStore.listen(this._shouldRedirect);
    }

    componentWillUnmount() {
      ItemStore.unlisten(this._shouldRedirect);
      TilesStore.unlisten(this._shouldRedirect);

      TitleHelper.reset();
    }

    _shouldRedirect = () =>
      setTimeout(() => {
        const { tiles } = TilesStore.getState();
        const { isContentReady } = this.props;
        const { selectedItemId, error } = ItemStore.getState();
        const tile = tiles.get(selectedItemId);

        if (isContentReady && !error && tile && this._prettifyedItemId !== selectedItemId) {
          this._redirect(tile);
          this._prettifyedItemId = selectedItemId;
        }

        if (!error && tile) {
          this._setPageTitle(tile);
        }
      });

    _setPageTitle(tile) {
      const manifest = getTileManifest(tile);
      if (this._setTitleId === manifest.id) {
        return;
      }

      const manifestBody = getManifestBody(manifest);
      const provider = providerById(ProvidersStore.getState(), manifest.provider.id);

      TitleHelper.set([getContentAsText(getTitle(manifestBody)), provider.name]);
      this._setTitleId = manifest.id;
    }

    _redirect = (tile) => {
      const { user } = AuthStore.getState();
      const manifest = tile._embedded['b:manifest'];
      const prettyUri = new URI(createItemUri(manifest) + window.location.search)
        // remove the P argument, since it allows you to send a login link
        .removeSearch('p')
        .removeSearch('sharer')
        .addSearch('sharer', getHash(user.id, manifest.id)) // URIjs handles encoding
        .normalizeSearch()
        .toString();

      history.navigate(prettyUri, { trigger: false, replace: true });
    };

    render() {
      return <ComposedComponent {...this.props} />;
    }
  };



// WEBPACK FOOTER //
// ./src/js/app/modules/item/higher-order-components/withPrettyUri.js