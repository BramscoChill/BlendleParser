import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

class GiftCardImages extends React.Component {
  static propTypes = {
    code: PropTypes.string,
    className: PropTypes.string,
    isFocussed: PropTypes.bool,
  };

  render() {
    const { code, isFocussed } = this.props;

    const imagesClassNames = classNames('ui-gift-card-images', {
      [this.props.className]: this.props.className,
      'is-reverse': (code && code !== '') || isFocussed,
      'step-2': code && code.length >= 19,
    });

    return (
      <div className={imagesClassNames}>
        <img src="/img/illustrations/giftcard.png" className="ui-image-gift-card-image front" />
        <img
          src="/img/illustrations/giftcard_back_1.png"
          className="ui-image-gift-card-image back"
        />
        <img
          src="/img/illustrations/giftcard_back_2.png"
          className="ui-image-gift-card-image back step-2"
        />
      </div>
    );
  }
}

export default GiftCardImages;



// WEBPACK FOOTER //
// ./src/js/app/modules/coupon/components/GiftCardImages.js