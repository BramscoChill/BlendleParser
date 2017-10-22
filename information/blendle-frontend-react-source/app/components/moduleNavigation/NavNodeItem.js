import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';

class NavNodeItem extends React.Component {
  static propTypes = {
    getNode: PropTypes.func.isRequired,
  };

  componentDidMount() {
    ReactDOM.findDOMNode(this).appendChild(this.props.getNode());
  }

  render() {
    return <li {...this.props} />;
  }
}

export default NavNodeItem;



// WEBPACK FOOTER //
// ./src/js/app/components/moduleNavigation/NavNodeItem.js