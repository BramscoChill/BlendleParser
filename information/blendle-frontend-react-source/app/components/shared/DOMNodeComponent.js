import React from 'react';
import PropTypes from 'prop-types';
import elementToString from 'helpers/elementToString';

export default class DOMNodeComponent extends React.Component {
  static propTypes = {
    node: PropTypes.object.isRequired,
  };

  render() {
    const { node, ...rest } = this.props;
    return <div {...rest} dangerouslySetInnerHTML={{ __html: elementToString(node) }} />;
  }
}



// WEBPACK FOOTER //
// ./src/js/app/components/shared/DOMNodeComponent.js