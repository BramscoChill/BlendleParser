import React from 'react';
import PropTypes from 'prop-types';
import { itemHeadline } from 'selectors/itemMetadata';
import { getManifestBody, getTitle, getContentAsText } from 'helpers/manifest';
import { getTileBackground } from 'helpers/tiles';
import ProviderLogo from 'components/ProviderLogo';
import classNames from 'classnames';
import CSS from './style.scss';

const getTileSize = () => {
  const width = window.innerWidth;
  const height = window.innerHeight;

  // breakPointMedium
  if (width > 1150) {
    return {
      tileWidth: 600,
      tileHeight: Math.min(740, height),
    };
  }

  // breakPointSmall
  if (width > 900) {
    return {
      tileWidth: 370,
      tileHeight: Math.min(740, height),
    };
  }

  return {
    tileWidth: width,
    tileHeight: height,
  };
};

const paneStyle = image => (image ? { backgroundImage: `url(${image.href})` } : {});

const DeeplinkItemPane = ({ item }) => {
  const metaData = item.get('b:item-metadata');
  const manifest = item.get('manifest');
  const manifestBody = getManifestBody(manifest);
  const backgroundImage = getTileBackground({
    manifest,
    ...getTileSize(),
  });

  const coverText = metaData ? itemHeadline(metaData) : getContentAsText(getTitle(manifestBody));

  const paneClassNames = classNames(CSS.itemPane, {
    [CSS.patternBackground]: !backgroundImage,
  });

  return (
    <div className={paneClassNames} style={paneStyle(backgroundImage)}>
      <div className={CSS.overlay}>
        <div className={CSS.container}>
          <ProviderLogo
            logoType="white"
            className={CSS.providerLogo}
            provider={manifest.get('provider')}
          />
        </div>
        <div className={CSS.coverTextContainer}>
          <div className={CSS.container}>
            <h1 className={CSS.coverText}>{coverText}</h1>
          </div>
        </div>
      </div>
    </div>
  );
};

DeeplinkItemPane.propTypes = {
  item: PropTypes.object,
};

export default DeeplinkItemPane;



// WEBPACK FOOTER //
// ./src/js/app/modules/premiumSignup/components/DeeplinkItemPane/index.js