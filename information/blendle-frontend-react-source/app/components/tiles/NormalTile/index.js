import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import PortraitCard from './PortraitCard';
import PhotoCard from './PhotoCard';
import TextTile from './TextCard';

export default class NormalTile extends PureComponent {
  static propTypes = {
    ...TextTile.propTypes,
    photo: PropTypes.object,
    isPortrait: PropTypes.bool,
  };

  render() {
    const { photo, isPortrait, ...props } = this.props;

    if (photo && isPortrait) {
      return <PortraitCard photo={photo} {...props} />;
    }

    if (photo) {
      return <PhotoCard photo={photo} {...props} />;
    }

    return <TextTile {...props} />;
  }
}



// WEBPACK FOOTER //
// ./src/js/app/components/tiles/NormalTile/index.js