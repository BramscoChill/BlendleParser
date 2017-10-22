import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';

export default ComposedComponent =>
  class EnhanceClickOutside extends PureComponent {
    static propTypes = {
      onClickOutside: PropTypes.func.isRequired,
    };

    componentDidMount() {
      document.addEventListener('click', this._onDocumentClick, true);
      document.addEventListener('touchstart', this._onDocumentClick, true);
    }

    componentWillUnmount() {
      document.removeEventListener('click', this._onDocumentClick, true);
      document.removeEventListener('touchstart', this._onDocumentClick, true);
    }

    _onDocumentClick = (e) => {
      const component = ReactDOM.findDOMNode(this);

      if (component && e.target !== component && !component.contains(e.target)) {
        this.props.onClickOutside(e);
      }
    };

    render() {
      const {
        onClickOutside, // eslint-disable-line no-unused-vars
        ...props
      } = this.props;

      return <ComposedComponent {...props} />;
    }
  };



// WEBPACK FOOTER //
// ./src/js/app/components/higher-order-components/enhanceClickOutside.js