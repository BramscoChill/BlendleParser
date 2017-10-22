import React, { Component } from 'react';
import { lowerFirst } from 'lodash';
import { wrapDisplayName } from 'recompose';

function getStateKey(storeName) {
  return lowerFirst(storeName.replace('Store', 'State'));
}

function hasDataFromAllStores(state, keys) {
  return keys.every(key => key in state);
}

const altConnect = (
  mapStateToProps = (states, props) => ({ ...states, ...props }),
  actions = {},
) => {
  if (typeof mapStateToProps !== 'function') {
    throw new TypeError('altConnect() expects a mapStateToProps function as first parameter');
  }
  if (typeof mapStateToProps.stores !== 'object') {
    throw new TypeError(
      'altConnect() expects a mapStateToProps function as first parameter with a stores property',
    );
  }
  if (typeof actions !== 'object') {
    throw new TypeError(
      'altConnect() expects an actions object as a second parameter or undefined',
    );
  }

  // This HOC may not be Pure since we don't know to less about ComposedComponent
  return ComposedComponent =>
    class AltConnect extends Component {
      static displayName = wrapDisplayName(ComposedComponent, 'altConnect');

      storeListeners = new Set();
      stores = [];

      componentDidMount() {
        const storeWithKeys = Object.entries(mapStateToProps.stores).map(([key, Store]) => [
          getStateKey(key),
          Store,
        ]);

        this.stores = storeWithKeys.map(([key]) => key);

        storeWithKeys
          .map(([storeName, Store]) => {
            this._onStoreChange(storeName)(Store.getState());
            return Store.listen(this._onStoreChange(storeName));
          })
          .forEach(unlisten => this.storeListeners.add(unlisten));
      }

      componentWillUnmount() {
        this.storeListeners.forEach(unlisten => unlisten());
      }

      _onStoreChange = storeName => (data) => {
        if (!data) {
          return;
        }

        this.storeValues = {
          ...this.storeValues,
          [storeName]: data,
        };

        this._mapStateToProps(this.storeValues, this.stores, this.props);
      };

      _mapStateToProps = (storeValues, stores, props) => {
        if (!hasDataFromAllStores(storeValues, stores)) {
          return;
        }

        const mappedProps = mapStateToProps(storeValues, props);
        if (mappedProps) {
          this.setState({ mappedProps });
        }
      };

      componentWillReceiveProps(nextProps) {
        this._mapStateToProps(this.storeValues, this.stores, nextProps);
      }

      render() {
        const hasMappedState = this.state && this.state.mappedProps;
        if (hasMappedState) {
          return <ComposedComponent {...this.props} {...this.state.mappedProps} {...actions} />;
        }

        return null;
      }
    };
};

export default altConnect;



// WEBPACK FOOTER //
// ./src/js/app/higher-order-components/altConnect.js