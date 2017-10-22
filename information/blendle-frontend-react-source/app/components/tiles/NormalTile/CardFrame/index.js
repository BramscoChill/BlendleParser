import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ManifestDropdownContainer from 'containers/ManifestDropdownContainer';
import Link from 'components/Link';

import CSS from './CardFrame.scss';

export default class CardFrame extends PureComponent {
  static propTypes = {
    providerId: PropTypes.string.isRequired,
    readerUrl: PropTypes.string.isRequired,
    itemId: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    style: PropTypes.object,
    lightColors: PropTypes.bool,
  };

  static defaultProps = {
    className: '',
  };

  render() {
    const { providerId, readerUrl, itemId, children, className, style, lightColors } = this.props;

    return (
      <div
        className={`${CSS.cardFrame} item item-manifest provider-${providerId} ${className}`}
        style={style}
      >
        <div className={CSS.dropdown}>
          <ManifestDropdownContainer itemId={itemId} cappuccinoButton={!lightColors} />
        </div>
        <Link className={CSS.resetLinkStyles} href={`/${readerUrl}`}>
          <article className={`${CSS.article}`}>{children}</article>
        </Link>
      </div>
    );
  }
}



// WEBPACK FOOTER //
// ./src/js/app/components/tiles/NormalTile/CardFrame/index.js