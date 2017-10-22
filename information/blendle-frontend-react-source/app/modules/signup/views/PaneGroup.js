const React = require('react');
const PropTypes = require('prop-types');
const ReactDOM = require('react-dom');
const _ = require('lodash');

class PaneGroup extends React.Component {
  static propTypes = {
    // keeps all pane objects, in the order that they should be navigated
    panes: PropTypes.array.isRequired,
    current: PropTypes.object.isRequired,

    /**
     * when the next pane want to be shown
     * @param {Pane} current
     * @param {Pane} nextPane
     * @param {Number} direction. -1 for back, +1 for next
     */
    onPaneChange: PropTypes.func.isRequired,
  };

  componentDidMount() {
    if (this.props.current) {
      document.body.classList.add(`pane-${this.props.current.name.toLowerCase()}`);
    }
    // fixes blocked scrolling issue for chrome, see #1740
    window.addEventListener('mousewheel', this._dummy);
  }

  _dummy = () => {};

  /**
   * focus the first input field in the current pane
   * and make sure the panes are scrolled to the top
   */
  componentDidUpdate(prevProps) {
    // only continue this method if the current pane has changed
    if (prevProps.current === this.props.current) {
      return;
    }

    if (this.props.current) {
      document.body.classList.add(`pane-${this.props.current.name.toLowerCase()}`);
      document.body.classList.remove(`pane-${prevProps.current.name.toLowerCase()}`);
    }

    this.props.onPaneChange(prevProps.current, this.props.current, 0);

    const currentPaneEl = ReactDOM.findDOMNode(this).querySelector('.pane-cur');
    if (currentPaneEl) {
      currentPaneEl.scrollTop = 0;
      window.scrollTo(0, 0);
    }
  }

  componentWillUnmount() {
    window.removeEventListener('mousewheel', this._dummy);

    if (!this.props.current) {
      return;
    }

    document.body.classList.remove(`pane-${this.props.current.name.toLowerCase()}`);
  }

  /**
   * create a react element for the given pane
   * @param {Number} index
   * @param {string} position prev, cur or next
   * @returns {React}
   */
  renderPaneComponent = (index, position) => {
    const pane = this.props.panes[index];
    if (!pane) {
      return;
    }
    const active = position === 'cur' && !this.props.disabled;
    return (
      <div
        key={`pane-${pane.name}`}
        className={`pane pane-${position}`}
        aria-hidden={position !== 'cur'}
      >
        {pane.component(active)}
      </div>
    );
  };

  getRenderPanes = () => {
    const panes = this.props.panes;
    const activeIndex = this.props.current
      ? _.findIndex(panes, { name: this.props.current.name })
      : 0;

    return {
      prev: this.renderPaneComponent(activeIndex - 1, 'prev'),
      cur: this.renderPaneComponent(activeIndex, 'cur'),
      next: this.renderPaneComponent(activeIndex + 1, 'next'),
    };
  };

  render() {
    const panes = this.getRenderPanes();
    const progress = this.props.progress;
    const progressStyle = {
      transform: `translateX(${progress - 100}%)`,
      WebkitTransform: `translateX(${progress - 100}%)`,
      MozTransform: `translateX(${progress - 100}%)`,
    };

    return (
      <div className="v-signup v-pane-group">
        <div className="pane-group-progress">
          <div style={progressStyle} />
        </div>
        <div className="pane-group-panes">
          {panes.prev}
          {panes.cur}
          {panes.next}
        </div>
      </div>
    );
  }
}

module.exports = PaneGroup;



// WEBPACK FOOTER //
// ./src/js/app/modules/signup/views/PaneGroup.js