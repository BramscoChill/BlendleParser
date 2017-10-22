// DEPRECATED
// i18n.translateElement() is the successor of this component and should be used.

import React from 'react';
import PropTypes from 'prop-types';
import i18n from 'instances/i18n';

export default class Translate extends React.Component {
  static propTypes = {
    find: PropTypes.string.isRequired,
    args: PropTypes.array,
    sanitize: PropTypes.bool,
    nodeName: PropTypes.string,
  };

  static defaultProps = {
    sanitize: true,
    nodeName: 'span',
    args: [],
    find: '',
  };

  render() {
    return React.createElement(i18n.TranslateElement, {
      node: React.DOM[this.props.nodeName](this.props),
      sanitize: this.props.sanitize,
      args: this.props.args,
      path: this.props.find,
    });
  }
}



// WEBPACK FOOTER //
// ./src/js/app/components/shared/Translate.js