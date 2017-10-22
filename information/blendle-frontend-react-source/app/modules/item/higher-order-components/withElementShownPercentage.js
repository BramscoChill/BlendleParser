import React, { PureComponent } from 'react';
import { bool } from 'prop-types';
import ItemStore from 'stores/ItemStore';
import { throttle } from 'lodash';
import ItemActions from 'actions/ItemActions';

/**
 * @param {HTMLElement} target
 */
function elementShownPercentage(target) {
  const { top, height } = target.getBoundingClientRect();
  const viewport = window.innerHeight;
  const percent = 100 / height * (top * -1 + viewport);
  return [top * -1, Math.min(Math.round(percent), 100)];
}

function visibleParagraphQuotient(paragraphTopPositions, scrollY) {
  if (paragraphTopPositions.length === 0) {
    return 0;
  }

  let foundIndex = 0;
  for (let i = paragraphTopPositions.length - 1; i >= 0; i--) {
    const topPos = paragraphTopPositions[i];
    if (scrollY > topPos) {
      foundIndex = i;
      break;
    }
  }

  const quotient = foundIndex / paragraphTopPositions.length;
  return quotient;
}

export default ComposedComponent =>
  class WithElementShownPercentage extends PureComponent {
    static propTypes = {
      isContentReady: bool.isRequired,
    };

    componentWillUnmount() {
      this._throttledHandleScroll.cancel();
      this._removeEventListener();
    }

    _removeEventListener = () => {
      window.removeEventListener('scroll', this._throttledHandleScroll);
    };

    _handleScroll = () => {
      if (!this.props.isContentReady) {
        return;
      }

      const { paragraphPositions } = ItemStore.getState();

      const [scrollY, readingPercentage] = elementShownPercentage(this._percentageElement);
      ItemActions.scrollItem({
        readingPercentage,
        scrollPixelsFromTop: scrollY,
        currentParagraphQuotient: visibleParagraphQuotient(paragraphPositions, scrollY),
      });
    };

    _throttledHandleScroll = throttle(this._handleScroll, 1000 / 5);

    _setupScrollListeners = (element) => {
      this._removeEventListener();
      if (element) {
        this._percentageElement = element;
        window.addEventListener('scroll', this._throttledHandleScroll, { passive: true });
      }
    };

    render() {
      return (
        <div ref={this._setupScrollListeners}>
          <ComposedComponent {...this.props} />
        </div>
      );
    }
  };



// WEBPACK FOOTER //
// ./src/js/app/modules/item/higher-order-components/withElementShownPercentage.js