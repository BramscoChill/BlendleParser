import React, { PureComponent } from 'react';
import { compose } from 'recompose';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import { last, debounce } from 'lodash';
import { smartCropImages } from 'config/features';
import { placeContent } from 'helpers/itemContent';
import { getSubItems } from 'selectors/content';
import { providerHasImageGrid, prefillSelector } from 'selectors/providers';
import logPerformance from 'helpers/logPerformance';
import ItemStore from 'stores/ItemStore';
import contentRenderer from '../../helpers/contentRenderer';
import withElementShownPercentage from '../../higher-order-components/withElementShownPercentage';
import withSelectedTextShare from '../../higher-order-components/withSelectedTextShare';
import CSS from './style.scss';

const itemParagraphClass = 'item-paragraph';

const sortAndPlaceContent = providerId => content =>
  placeContent({
    providerId,
    content,
    streamers: content.streamers || [],
    containerWidth: 640, // TODO fix this!
    useSmartCrop: smartCropImages,
    imageGridEnabled: prefillSelector(providerHasImageGrid)(providerId),
  });

/**
 * @param {React.Element} element
 * @returns {boolean}
 */
const isParagraph = ({ props }) => props.className && props.className.includes(itemParagraphClass);
const findGoodPlace = (list, workingplace) => {
  if (workingplace <= 0) {
    return 0;
  }

  if (isParagraph(list[workingplace]) && isParagraph(list[workingplace - 1])) {
    return workingplace;
  }
  return findGoodPlace(list, workingplace - 1);
};

const insertItemNextToLast = (list, itemToAdd) => {
  const paragraphs = list.filter(isParagraph).length;
  const workingplace = paragraphs <= 3 ? list.length : findGoodPlace(list, list.length - 1);

  list.splice(
    workingplace,
    0, // delete nothing
    React.cloneElement(itemToAdd, { key: 'inserted-item' }), // add this
  );
};

class ContentBody extends PureComponent {
  static propTypes = {
    content: PropTypes.object.isRequired,
    paragraphsMeasured: PropTypes.func.isRequired,
    isContentReady: PropTypes.bool.isRequired,
    beforeLastParagraphContent: PropTypes.node,
  };

  componentDidMount() {
    this._enhanceLinks();

    if (this.props.isContentReady) {
      this._measureParagraphs();
    }

    window.addEventListener('resize', this._measureParagraphs);
    setTimeout(() => {
      // Execute events after the first rendering
      logPerformance.applicationReady('Item');
      logPerformance.readerReady(ItemStore.getState().perfStartTime);
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isContentReady && !this.props.isContentReady) {
      this._measureParagraphs();
    }
  }

  componentWillUnmount() {
    this._measureParagraphs.cancel();
    window.removeEventListener('resize', this._measureParagraphs);
  }

  _measureParagraphs = debounce(() => {
    const paragraphs = this._articleRef.querySelectorAll(`.${itemParagraphClass}`);
    const tops = [];
    for (const p of paragraphs) {
      tops.push(p.getBoundingClientRect().top);
    }

    this.props.paragraphsMeasured(tops);
  }, 100);

  _enhanceLinks() {
    const element = ReactDOM.findDOMNode(this);
    Array.from(element.querySelectorAll('a')).forEach((anchor) => {
      anchor.target = '_blank';
      anchor.rel = 'noopener';
    });
  }

  render() {
    const { content, beforeLastParagraphContent } = this.props;
    const sortAndPlaceProviderContent = sortAndPlaceContent(content.provider.id);
    const sortedItemContent = sortAndPlaceProviderContent(content);
    const renderedItem = contentRenderer(sortedItemContent);
    const renderedSubItems = getSubItems(content)
      .map(sortAndPlaceProviderContent)
      .map(contentRenderer)
      .map((subItem, i) => (
        <div className="subitem" key={`${subItem}-${i}`}>
          {subItem}
        </div>
      ));

    if (beforeLastParagraphContent && renderedSubItems.length > 0) {
      // Put banner before the last subitem
      insertItemNextToLast(last(renderedSubItems).props.children, beforeLastParagraphContent);
    } else if (beforeLastParagraphContent) {
      insertItemNextToLast(renderedItem, beforeLastParagraphContent);
    }

    return (
      <article
        ref={(c) => {
          this._articleRef = c;
        }}
        className={`item item-content provider-${content.provider.id} ${CSS.contentBody}`}
      >
        {renderedItem}
        {renderedSubItems}
      </article>
    );
  }
}

const enhance = compose(withElementShownPercentage, withSelectedTextShare);

export default enhance(ContentBody);



// WEBPACK FOOTER //
// ./src/js/app/modules/item/components/ContentBody/index.js