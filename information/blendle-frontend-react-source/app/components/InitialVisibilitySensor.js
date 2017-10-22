import React, { Component } from 'react';
import PropTypes from 'prop-types';
import VisibilitySensor from 'react-visibility-sensor';

export default class InitialVisibilitySensor extends Component {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    children: PropTypes.any,
  };

  state = { visibilityState: null };

  _onChange = (newVisibilityState) => {
    const currentVisibilityState = this.state.visibilityState;
    const stateHasChanged = currentVisibilityState !== newVisibilityState;
    const isInitialAndInvisible = newVisibilityState === false && currentVisibilityState === null;

    // If the element is not in the viewport for the first event or if the next state is the same
    // as the current state, don't log it
    if (isInitialAndInvisible || !stateHasChanged) {
      return false;
    }

    // Save the new state
    this.setState({ visibilityState: newVisibilityState });

    return this.props.onChange(newVisibilityState);
  };

  render() {
    return (
      <VisibilitySensor {...this.props} onChange={this._onChange} delayedCall>
        {this.props.children}
      </VisibilitySensor>
    );
  }
}



// WEBPACK FOOTER //
// ./src/js/app/components/InitialVisibilitySensor.js