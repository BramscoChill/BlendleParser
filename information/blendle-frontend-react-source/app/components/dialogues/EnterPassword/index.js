import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Dialogue from 'components/dialogues/Dialogue';
import EnterpasswordView from 'views/dialogues/enterpassword';
import BackboneView from 'components/shared/BackboneView';

class EnterPassword extends Component {
  static propTypes = {
    cancelCallback: PropTypes.func.isRequired,
    callback: PropTypes.func.isRequired,
  };

  componentWillMount() {
    this._view = new EnterpasswordView({
      cancelCallback: this.props.cancelCallback,
      callback: this.props.callback,
    });
  }

  render() {
    return (
      <Dialogue onClose={this.props.cancelCallback} className="dialogue-enter-password">
        <BackboneView view={this._view} />
      </Dialogue>
    );
  }
}

export default EnterPassword;



// WEBPACK FOOTER //
// ./src/js/app/components/dialogues/EnterPassword/index.js