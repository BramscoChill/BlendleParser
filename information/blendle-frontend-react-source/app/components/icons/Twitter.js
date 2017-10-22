import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

class Twitter extends PureComponent {
  static propTypes = {
    fill: PropTypes.string,
  };

  static defaultProps = {
    fill: 'currentColor',
  };

  render() {
    const { fill, ...props } = this.props;

    return (
      <svg viewBox="0 0 18 15" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path
          fill={fill}
          d="M15.907 2.36c.764-.467 1.35-1.205 1.626-2.085-.715.431-1.506.745-2.349.915C14.51.458 13.548 0 12.484 0c-2.043 0-3.7 1.686-3.7 3.767 0 .296.033.583.096.86C5.806 4.468 3.08 2.968 1.255.69c-.318.556-.5 1.203-.5 1.894 0 1.307.653 2.46 1.645 3.136-.606-.02-1.177-.189-1.675-.47v.046C.724 7.121 2 8.645 3.69 8.99c-.31.087-.637.133-.974.133-.238 0-.47-.024-.696-.068.471 1.497 1.837 2.587 3.456 2.617-1.266 1.01-2.86 1.613-4.594 1.613-.3 0-.594-.018-.883-.053 1.637 1.069 3.58 1.693 5.67 1.693 6.805 0 10.525-5.741 10.525-10.72 0-.163-.003-.325-.01-.487.724-.532 1.35-1.196 1.847-1.952-.664.3-1.376.503-2.125.594z"
        />
      </svg>
    );
  }
}

export default Twitter;



// WEBPACK FOOTER //
// ./src/js/app/components/icons/Twitter.js