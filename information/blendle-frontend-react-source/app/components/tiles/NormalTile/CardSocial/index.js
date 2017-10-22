import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Columns, HeartIcon } from '@blendle/lego';
import CSS from './CardSocial.scss';

export default class CardSocial extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    heartText: PropTypes.string,
  };

  render() {
    const { className, heartText } = this.props;

    return (
      <div className={className}>
        {heartText && (
          <Columns className={CSS.socialRow}>
            <div className={`${CSS.heartOuter} ${CSS.iconOuter}`}>
              <HeartIcon className={CSS.heartIcon} />
            </div>
            {heartText}
          </Columns>
        )}
      </div>
    );
  }
}



// WEBPACK FOOTER //
// ./src/js/app/components/tiles/NormalTile/CardSocial/index.js