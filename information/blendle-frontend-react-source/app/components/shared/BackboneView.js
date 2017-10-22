const React = require('react');
const PropTypes = require('prop-types');
const ReactDOM = require('react-dom');
const classNames = require('classnames');
const removeChildNodes = require('helpers/removeChildNodes');

class BackboneView extends React.Component {
  static propTypes = {
    view: PropTypes.object.isRequired,
    className: PropTypes.string,
  };

  componentDidMount() {
    const view = this.props.view;
    ReactDOM.findDOMNode(this).appendChild(view.render().el);

    view.load();
    view.afterRender();
  }

  compontentDidUpdate() {
    if (!this.options.preventReplace) {
      removeChildNodes(ReactDOM.findDOMNode(this));
      ReactDOM.findDOMNode(this).appendChild(this.props.view.render().el);
    }
  }

  componentWillUnmount() {
    // small timeout prevents cleanup before promises are answered in the nextTick
    setTimeout(() => this.props.view.unload());
  }

  render() {
    const className = classNames('v-backbone-view', this.props.className);
    return <div className={className} />;
  }
}

export default BackboneView;



// WEBPACK FOOTER //
// ./src/js/app/components/shared/BackboneView.js