import _ from 'lodash';
import React from 'react';
import DOMNodeComponent from 'components/shared/DOMNodeComponent';
import classNames from 'classnames';

/* eslint-disable no-use-before-define */
const typeVisitors = {
  kicker: nodeVisitorFactory('p', 'item-kicker'),
  head: nodeVisitorFactory('h1', 'item-title'),
  hl1: nodeVisitorFactory('h1', 'item-title'),
  hl2: nodeVisitorFactory('h2', 'item-subtitle'),
  lead: nodeVisitorFactory('p', 'item-lead'),
  byline: nodeVisitorFactory('p', 'item-byline'),
  dateline: nodeVisitorFactory('p', 'item-dateline'),
  intro: nodeVisitorFactory('p', 'item-intro'),
  ph: nodeVisitorFactory('h3', 'item-header'),
  p: nodeVisitorFactory('p', 'item-paragraph'),
  streamer: nodeVisitorFactory('p', 'item-streamer'),
  image: imageVisitor,
  'image-grid': imageGridVisitor,
  'image-meta': nodeVisitorFactory('div', 'item-image-meta'),
  'inline-image': inlineImageVisitor,
  'featured-image': inlineImageVisitor,
  default: nodeVisitorFactory('p', 'item-default'),
};

function getTemplateElementCorrespondingValues(element, values) {
  const foundValues = [];
  for (const i in values) {
    const value = values[i];
    if (value.type === element) {
      foundValues.push(value);
    }
  }
  return foundValues;
}

function sortValuesBasedOnTemplateElements(values, templateElements) {
  let valuesLeft = values.slice(0);
  const sortedValues = [];
  let contentElementIndex;

  for (const i in templateElements) {
    const knownTemplateElement = templateElements[i];
    const elementValues = getTemplateElementCorrespondingValues(knownTemplateElement, values);

    if (knownTemplateElement === 'content') {
      contentElementIndex = sortedValues.push({ key: knownTemplateElement }) - 1;
    } else {
      sortedValues.push({ key: knownTemplateElement, values: elementValues });
    }

    valuesLeft = _.difference(valuesLeft, elementValues);
  }

  const contentValues = { key: 'content', values: valuesLeft };

  if (sortedValues[contentElementIndex]) {
    sortedValues[contentElementIndex] = contentValues;
  }

  return sortedValues;
}

function getTemplateElementsFromTemplate(template) {
  // Split the template into an array
  let elements = template.split(' ');

  // Remove curly braces from template to ensure the keys are left
  elements = _.map(elements, element => element.substring(1, element.length - 1));

  return elements;
}

function constructChildren(values, template, options) {
  // Order values according to the template
  values = _.flatten(
    values.filter(section => section.values.length).map(section => section.values),
    true,
  );

  // If an inline featured image is present, place it before the first ph or p
  const featuredImage = values.find(el => el.type === 'featured-image');
  values = values.filter(el => el.type !== 'featured-image');

  if (featuredImage) {
    const pEl = values.find(el => el.type === 'p');
    const phEl = values.find(el => el.type === 'ph');

    const pIndex = pEl ? values.indexOf(pEl) : values.length;
    const phIndex = phEl ? values.indexOf(phEl) : values.length;

    const insertBeforeIndex = Math.min(pIndex, phIndex);

    values.splice(insertBeforeIndex, 0, featuredImage);
  }

  // create a documentFragment containing the template
  return values.reduce((children, value, index) => {
    let visitor;

    if (typeVisitors[value.type]) {
      visitor = typeVisitors[value.type];
    } else {
      visitor = typeVisitors.default;
    }

    children.push(visitor(value, index, options));

    return children;
  }, []);
}

function getMetadataClassNames(metadata) {
  // New publications use an array of strings, instead of a single string
  if (Array.isArray(metadata)) {
    return metadata.join(' ');
  }

  return metadata;
}

function nodeVisitorFactory(nodeName, defaultClassName) {
  return function nodeVisitor(fragment, index, options = {}) {
    const className = classNames(defaultClassName, {
      [getMetadataClassNames(fragment.metadata)]: getMetadataClassNames(fragment.metadata),
    });

    const element = React.createElement(nodeName, {
      key: `${className}-${index}`,
      className,
      dangerouslySetInnerHTML: { __html: fragment.content },
    });

    if (options.inlineElements) {
      return (
        <div className="item-element-wrapper">
          <div className="item-element-container">{element}</div>
        </div>
      );
    }

    return element;
  };
}

function imageVisitor(fragment) {
  return React.createElement('img', {
    src: fragment.content,
    className: 'item-image item-content-image',
  });
}

function imageGridVisitor(fragment) {
  return <DOMNodeComponent className="item-image-grid" node={fragment.content} />;
}

function inlineImageVisitor(fragment) {
  const containerClassName = classNames('inline-image-container', {
    [fragment.content.className]: fragment.content.className,
  });

  return (
    <div className={containerClassName}>
      <div className="inline-image">
        <img
          src={fragment.content.imageUrl}
          data-src={fragment.content.imageUrl}
          className="item-image item-content-image inline"
        />
        <div
          className="item-image-meta inline"
          dangerouslySetInnerHTML={{ __html: fragment.content.meta }}
        />
      </div>
    </div>
  );
}

export const renderItemContent = (values, template, options = {}) => {
  // Maps the template to a parseable format for values to be inserted in
  const templateElements = getTemplateElementsFromTemplate(template);

  // Sorts the values based on the template elements, unknown values sort to {content}
  const sortedValues = sortValuesBasedOnTemplateElements(values, templateElements);

  return constructChildren(sortedValues, template, options);
};



// WEBPACK FOOTER //
// ./src/js/app/helpers/renderItemContent.js