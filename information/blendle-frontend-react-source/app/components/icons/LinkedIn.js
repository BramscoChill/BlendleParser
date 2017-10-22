import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

class LinkedIn extends PureComponent {
  static propTypes = {
    fill: PropTypes.string,
  };

  static defaultProps = {
    fill: 'currentColor',
  };

  render() {
    const { fill, ...props } = this.props;

    return (
      <svg viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path
          fill={fill}
          d="M6.221 9.443c0-1.562-.05-2.867-.1-3.994h3.305l.176 1.74h.075c.5-.819 1.728-2.022 3.781-2.022 2.504 0 4.382 1.715 4.382 5.402v7.4h-3.806V11.03c0-1.613-.551-2.714-1.929-2.714-1.051 0-1.677.743-1.952 1.46-.1.255-.126.614-.126.973v7.22H6.221V9.442zM4.07 1.967c0 1.075-.777 1.946-2.054 1.946-1.201 0-1.977-.871-1.977-1.946C.038.866.838.021 2.065.021S4.044.866 4.07 1.967zM.138 5.45h3.806v12.519H.138V5.448z"
        />
      </svg>
    );
  }
}

export default LinkedIn;



// WEBPACK FOOTER //
// ./src/js/app/components/icons/LinkedIn.js