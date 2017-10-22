/* eslint-disable react/prop-types */
// disable prop type validation since hocs consume different props then component
import React from 'react';
import PropTypes from 'prop-types';
import { compose, onlyUpdateForKeys, withHandlers, setPropTypes } from 'recompose';
import { translate } from 'instances/i18n';
import { getAppItemUrl } from 'helpers/openApp';
import Analytics from 'instances/analytics';

const isAndroid = window.BrowserDetect.device === 'android';

const enhance = compose(
  onlyUpdateForKeys(['itemId']),
  setPropTypes({
    itemId: PropTypes.string.isRequired,
    openItemInAndroid: PropTypes.func.isRequired,
    analytics: PropTypes.object.isRequired,
  }),
  withHandlers({
    trackOpen: ({ analytics }) => () => Analytics.track('Open Native Client', analytics),
  }),
);

function OpenInAppButton({ itemId, openItemInAndroid, trackOpen }) {
  const buttonText = translate('open_in_app');
  if (isAndroid) {
    return (
      <button
        onClick={() => {
          trackOpen();
          openItemInAndroid(itemId);
        }}
        className={CSS.appStoreLink}
      >
        {buttonText}
      </button>
    );
  }

  return (
    <a
      href={getAppItemUrl(itemId)}
      target="_blank"
      className={CSS.appStoreLink}
      onClick={trackOpen}
      data-ignoreclickhandler
    >
      {buttonText}
    </a>
  );
}

export default enhance(OpenInAppButton);



// WEBPACK FOOTER //
// ./src/js/app/modules/item/components/MobileStickySharing/OpenInAppButton.js