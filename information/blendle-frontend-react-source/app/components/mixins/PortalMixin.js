const _ = require('lodash');
const React = require('react');
const ReactDOM = require('react-dom');

class Portal extends React.Component {
  componentWillUnmount() {
    this.props.onWillUnmount && this.props.onWillUnmount();
  }

  componentDidMount() {
    this.props.onDidMount && this.props.onDidMount(ReactDOM.findDOMNode(this));
  }

  componentWillMount() {
    this.props.onWillMount && this.props.onWillMount();
  }

  render() {
    return React.Children.only(this.props.children);
  }
}

const PortalMixin = function (id) {
  return {
    getInitialState() {
      return {
        portalKey: _.uniqueId('portal'),
      };
    },
    componentWillMount() {
      if (this.props.portal) {
        this._target = this.props.portal;
      } else {
        this._target = this._createPortal();
      }
      this._target._portalKey = this.state.portalKey;
    },
    componentDidMount() {
      this._renderLayer();
    },

    componentDidUpdate() {
      this._renderLayer();
    },

    componentWillUnmount() {
      if (this.getLayerDOMNode() && this.getLayerDOMNode().parentNode === this._target) {
        this.unrenderLayer();
      }
    },

    getLayerDOMNode() {
      return this._layerDOMNode;
    },

    _renderLayer() {
      ReactDOM.render(
        <Portal
          key={this.state.portalKey}
          onWillMount={this.layerWillMount}
          onDidMount={this._layerDidMount}
          onDidUnmount={this.layerDidUnmount}
        >
          {this.renderLayer()}
        </Portal>,
        this._target,
      );
    },

    unrenderLayer() {
      // Make sure we don't unmount during a React event. This is a known bug in React
      // https://github.com/facebook/react/issues/3298
      setTimeout(() => {
        // Dirty work-around to make sure we don't accidentally unmount a new component
        // https://github.com/facebook/react/issues/3298#issuecomment-135758319
        if (this.state.portalKey === this._target._portalKey) {
          ReactDOM.unmountComponentAtNode(this._target);
        }
      });
    },

    _layerDidMount(domNode) {
      this._layerDOMNode = domNode;
      this.layerDidMount && this.layerDidMount();
    },

    _createPortal() {
      let portal;

      if (id) {
        portal = document.getElementById(id);
      }

      if (!portal) {
        portal = document.createElement('div');

        if (id) {
          portal.id = id;
        }
      }

      if (!portal.parentNode) {
        document.body.appendChild(portal);
      }

      return portal;
    },
  };
};

module.exports = PortalMixin;



// WEBPACK FOOTER //
// ./src/js/app/components/mixins/PortalMixin.js