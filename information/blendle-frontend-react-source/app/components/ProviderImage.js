import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Image from 'components/Image';
import classNames from 'classnames';
import { getProviderLogoUrl } from 'helpers/providerHelpers';

class ProviderImage extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    provider: PropTypes.object.isRequired,
  };

  render() {
    const imageClasses = classNames('provider', {
      [this.props.className]: this.props.className,
    });
    const src = getProviderLogoUrl(this.props.provider.id, 'logo.png');
    const providerName = this.props.provider.name;

    return <Image className={imageClasses} src={src} alt={providerName} />;
  }
}

export default ProviderImage;



// WEBPACK FOOTER //
// ./src/js/app/components/ProviderImage.js