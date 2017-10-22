import React, { PureComponent, PropTypes } from 'react';

export default class DeepDives extends PureComponent {
  static propTypes = {
    deepDives: PropTypes.array,
    isLoading: PropTypes.bool,
  };

  _renderDeepDives() {
    const { isLoading, deepDives } = this.props;

    if (isLoading) {
      return null;
    }

    return (
      <ul>
        {deepDives.map(deepDive => (
          <li key={deepDive.id}>
            <a href={`/deepdive/${deepDive.id}`}>{deepDive.title}</a>
          </li>
        ))}
      </ul>
    );
  }

  render() {
    return (
      <div>
        <h1>Deep Dives</h1>
        {this._renderDeepDives()}
      </div>
    );
  }
}



// WEBPACK FOOTER //
// ./src/js/app/modules/deepdive/components/DeepDives/index.js