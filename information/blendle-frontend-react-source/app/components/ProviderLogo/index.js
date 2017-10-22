import React from 'react';
import PropTypes from 'prop-types';
import { getProviderLogoUrl } from 'helpers/providerHelpers';
import classNames from 'classnames';
import CSS from './style.scss';

const logoTypeMap = {
  normal: 'logo.png',
  normalCrop: 'provider-crop.png',
  white: 'provider-w-crop.png',
};

export default function ProviderLogo({ provider, className, logoType }) {
  if (!provider) {
    return null;
  }

  const logoUrl = getProviderLogoUrl(provider.id, logoTypeMap[logoType]);

  const classes = classNames(CSS.providerLogo, className);
  return (
    <div className={classes}>
      <img src={logoUrl} alt={provider.name} />
    </div>
  );
}
ProviderLogo.propTypes = {
  provider: PropTypes.object,
  className: PropTypes.string,
  logoType: PropTypes.oneOf(['normal', 'normalCrop', 'white']),
};

ProviderLogo.defaultProps = {
  logoType: 'normal',
};



// WEBPACK FOOTER //
// ./src/js/app/components/ProviderLogo/index.js