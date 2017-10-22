import React, { PureComponent } from 'react';
import AltContainer from 'alt-container';
import ItemStore from 'stores/ItemStore';

function getCollapseTarget(currentTarget, currentY, threshold) {
  return Math.max(currentTarget || currentY, threshold);
}

function getShowTarget(currentTarget, currentY, threshold) {
  return currentTarget || Math.abs(currentY - threshold);
}

export default (ComposedComponent, { scrollDownThreshold = 50, scrollUpThreshold = 40 } = {}) =>
  class WithHideOnScroll extends PureComponent {
    isHidden = false;

    _determineHide = (currentY) => {
      const previousY = this._scrollY || 0;

      if (currentY < previousY) {
        // Scroll Up
        this._collapseTarget = null;
        this._showTarget = getShowTarget(this._showTarget, currentY, scrollUpThreshold);

        if (currentY <= this._showTarget) {
          this.isHidden = false;
        }
      } else if (currentY > previousY) {
        // Scroll Down
        this._showTarget = null;
        this._collapseTarget = getCollapseTarget(
          this._collapseTarget,
          currentY,
          scrollDownThreshold,
        );

        if (currentY > this._collapseTarget) {
          this.isHidden = true;
        }
      }

      this._scrollY = currentY;
      return this.isHidden;
    };

    _mapStateToProps = ({ itemState }) => {
      const { scrollPixelsFromTop, maxReadingPercentage } = itemState;
      return {
        isHiddenByScroll: this._determineHide(scrollPixelsFromTop),
        contentWasFullyVisible: maxReadingPercentage >= 100,
      };
    };

    render() {
      // eslint-disable-next-line no-unused-vars
      return (
        <AltContainer stores={{ itemState: ItemStore }} transform={this._mapStateToProps}>
          <ComposedComponent {...this.props} />
        </AltContainer>
      );
    }
  };



// WEBPACK FOOTER //
// ./src/js/app/modules/item/higher-order-components/withHideOnScroll.js