const _ = require('lodash');
const React = require('react');
const createReactClass = require('create-react-class');
const PropTypes = require('prop-types');
const ReactDOM = require('react-dom');
const BrowserEnv = require('instances/browser_environment');
const SubmitPaneButton = require('./SubmitPaneButton');
const findParent = require('helpers/getselforparent');
const classNames = require('classnames');

module.exports = createReactClass({
  propTypes: {
    disabled: PropTypes.bool,
    onClick: PropTypes.func.isRequired,
  },

  _stickySubmitNode: null,
  _debouncedUpdate: null,

  getDefaultProps() {
    return {
      disabled: BrowserEnv.isDesktop(),
    };
  },

  getInitialState() {
    return {
      visible: BrowserEnv.isMobile(),
    };
  },

  componentWillMount() {
    this._debouncedUpdate = _.debounce(this.updateVisiblity, 16);
  },

  componentDidMount() {
    this._scrollParentNode = findParent(ReactDOM.findDOMNode(this), '.pane');
    this._scrollParentNode.addEventListener('scroll', this._debouncedUpdate);

    this._debouncedUpdate();
  },

  componentWillUnmount() {
    this._scrollParentNode.removeEventListener('scroll', this._debouncedUpdate);
  },

  componentWillReceiveProps(nextProps) {
    if (nextProps.disabled) {
      this._scrollParentNode.removeEventListener('scroll', this._debouncedUpdate);
    } else if (!nextProps.disabled && this.props.disabled) {
      this._scrollParentNode.addEventListener('scroll', this._debouncedUpdate);

      this._debouncedUpdate();
    }
  },

  /**
   * a debounced method to update the visibilty of the sticky submit button
   */
  updateVisiblity() {
    if (!this.isMounted()) {
      return;
    }

    // find out if we have scrolled to the bottom of the scrollArea
    const offset = 250;
    const scrollPosition =
      this._scrollParentNode.clientHeight + this._scrollParentNode.scrollTop + offset;
    const nearBottom = scrollPosition > this._scrollParentNode.scrollHeight;

    this.setState({ visible: !nearBottom });
  },

  render() {
    const stickyClassNames = classNames([
      'sticky-submit',
      { visible: this.state.visible && !this.props.disabled },
    ]);

    return (
      <div className={stickyClassNames} aria-hidden>
        <SubmitPaneButton onClick={this.props.onClick} loading={this.props.loading} />
      </div>
    );
  },
});



// WEBPACK FOOTER //
// ./src/js/app/modules/signup/views/StickySubmitPaneButton.js