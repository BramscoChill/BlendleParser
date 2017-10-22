import React, { PureComponent } from 'react';

import PropTypes from 'prop-types';

class WhatsApp extends PureComponent {
  static propTypes = {
    fill: PropTypes.string,
  };

  static defaultProps = {
    fill: 'currentColor',
  };

  render() {
    const { fill, ...props } = this.props;

    return (
      <svg viewBox="0 0 19 18" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path
          fill={fill}
          d="M9.2 0C4.3 0 .3 3.9.3 8.7c0 1.6.5 3.2 1.3 4.5L0 17.9l4.9-1.5c1.3.7 2.7 1.1 4.3 1.1 4.9 0 8.9-3.9 8.9-8.7C18 3.9 14.1 0 9.2 0zm4.4 12c-.2.5-1.2 1-1.6 1-.4 0-.4.3-2.7-.7C7 11.3 5.7 9 5.6 8.8c-.1-.2-.9-1.2-.8-2.3 0-1.1.6-1.6.9-1.8.2-.2.5-.3.6-.3h.4c.1 0 .3-.1.5.4s.6 1.6.6 1.7c.1.1.1.2 0 .4-.1.1-.1.2-.2.4-.1.1-.2.3-.4.4-.1.1-.2.2-.1.5.1.2.5 1 1.2 1.6.8.8 1.6 1.1 1.8 1.2.2.1.4.1.5 0 .1-.1.6-.6.7-.8.2-.2.3-.2.5-.1s1.3.7 1.5.8c.2.1.4.2.4.3.1-.1.1.3-.1.8z"
        />
      </svg>
    );
  }
}

export default WhatsApp;



// WEBPACK FOOTER //
// ./src/js/app/components/icons/WhatsApp.js