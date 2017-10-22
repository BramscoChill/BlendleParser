import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import signupModule from './signupModule';

function stripSlashes(str) {
  return str.replace(/^\/*/, '').replace(/\/*$/, '');
}

export default class SignupModuleContainer extends React.Component {
  static propTypes = {
    path: PropTypes.string,
    params: PropTypes.object,
  };

  componentDidMount() {
    signupModule.target = ReactDOM.findDOMNode(this);

    this._loadRoute(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this._loadRoute(nextProps);
  }

  componentWillUnmount() {
    signupModule.unload();
  }

  _loadRoute(props) {
    if (props.params && props.params.splat === 'deeplink') {
      signupModule.markAsDeeplinkSignUp();
      signupModule.show();
    }

    let path = props.path || 'signup';
    if (props.params && props.params.splat) {
      path = `signup/${props.params.splat}`;
    }
    signupModule.loadRoute(stripSlashes(path));
  }

  render() {
    return <div />;
  }
}



// WEBPACK FOOTER //
// ./src/js/app/modules/signup/SignupModuleContainer.js