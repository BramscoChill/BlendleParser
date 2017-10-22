import { STATUS_OK } from 'app-constants';

function isProviderReady(providerStatus) {
  return providerStatus === STATUS_OK;
}

export function isContentReady(content) {
  return content.status === STATUS_OK && !!content.data;
}

export function isReaderLoading({ selectedItemId, providerStatus, manifest, content }) {
  return (
    !selectedItemId || !isProviderReady(providerStatus) || (!isContentReady(content) && !manifest)
  );
}



// WEBPACK FOOTER //
// ./src/js/app/modules/item/helpers/readerStatus.js