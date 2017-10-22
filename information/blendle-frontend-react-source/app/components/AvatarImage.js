import React, { PureComponent } from 'react';
import Image from 'components/Image';
import { DEFAULT_AVATAR } from 'app-constants';

export default class AvatarImage extends PureComponent {
  static propTypes = Image.propTypes;

  static defaultProps = {
    fallback: DEFAULT_AVATAR,
  };

  render() {
    return <Image {...this.props} />;
  }
}



// WEBPACK FOOTER //
// ./src/js/app/components/AvatarImage.js