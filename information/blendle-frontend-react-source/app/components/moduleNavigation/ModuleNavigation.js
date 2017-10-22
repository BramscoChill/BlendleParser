import React from 'react';
import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import { debounce } from 'lodash';
import classNames from 'classnames';
import ModuleNavigationStore from 'stores/ModuleNavigationStore';
import NavOthersItem from './NavOthersItem';
import ActiveItemLine from 'components/ActiveItemLine';
import { isMobile } from 'instances/browser_environment';

/**
 * The others (more...) button has different sizes per browser env.
 * Also, the values are hardcoded since we can't easy find out the width without adding it.
 * @FIXME fetch the width from the painted element, hardcoding these values is a bad practice.
 * @returns {number}
 */
function getOtherButtonWidth() {
  return isMobile() ? 45 : 150;
}

function getCollapseTarget(currentTarget, currentY) {
  return Math.max(currentTarget || currentY, 50);
}

function getExpandTarget(currentTarget, currentY) {
  return currentTarget || Math.abs(currentY - 40);
}

const ModuleNavigation = createReactClass({
  displayName: 'ModuleNavigation',

  propTypes: {
    children: PropTypes.any,
    noCollapse: PropTypes.bool,
  },

  getInitialState() {
    return {
      store: ModuleNavigationStore.getState(),
      maxWidth: window.innerWidth,
      childrenWidth: {},
      collapsed: false,
    };
  },

  componentDidMount() {
    this._debouncedSetWidthState = debounce(this._setWidthState, 10);
    ModuleNavigationStore.listen(this._onStoreChange);

    window.addEventListener('resize', this._debouncedSetWidthState);
    this._setWidthState();
  },

  componentWillUnmount() {
    ModuleNavigationStore.unlisten(this._onStoreChange);
    window.removeEventListener('resize', this._debouncedSetWidthState);
    this._debouncedSetWidthState.cancel();
  },

  componentDidUpdate(prevProps) {
    if (!isMobile() && this.props !== prevProps) {
      this._debouncedSetWidthState();
    }
  },

  _onStoreChange(state) {
    this.setState({ store: state }, () => {
      this._debouncedSetWidthState();
    });
  },

  _setWidthState() {
    const childNodes = Object.keys(this.refs).map(ref => ReactDOM.findDOMNode(this.refs[ref]));

    const initialDisplayStateMap = new Map();

    childNodes.forEach((node) => {
      initialDisplayStateMap.set(node, node.style.display);
      node.style.display = '';
    });

    const childrenWidth = childNodes.map(node => node.getBoundingClientRect().width + 2);

    childNodes.forEach((node) => {
      node.style.display = initialDisplayStateMap.get(node);
    });

    initialDisplayStateMap.clear();

    this.setState({
      childrenWidth,
      maxWidth: ReactDOM.findDOMNode(this).offsetWidth,
    });
  },

  _isVisible(key) {
    const ends = this.state.childrenEnd;
    const end = ends[key] || ends[`/${key}`];

    return end && end < this.state.maxWidth - getOtherButtonWidth();
  },

  _renderVisible() {
    let loopWidth = 0;
    return React.Children.map(this.props.children, (child, key) => {
      loopWidth += this.state.childrenWidth[key] || 1;

      const isVisible = loopWidth < this.state.maxWidth - getOtherButtonWidth();
      const style = {
        display: isVisible ? '' : 'none',
      };

      return React.cloneElement(child, {
        style,
        key,
        ref: key,
      });
    });
  },

  _renderOthers() {
    let loopWidth = 0;
    const others = [];

    React.Children.forEach(this.props.children, (child, key) => {
      loopWidth += this.state.childrenWidth[key] || 1;

      const isVisible = loopWidth < this.state.maxWidth - getOtherButtonWidth();
      if (!isVisible) {
        others.push(child);
      }
    });

    if (!others.length) {
      return null;
    }
    return <NavOthersItem key="others">{others}</NavOthersItem>;
  },

  _renderChildren() {
    if (isMobile()) {
      return this.props.children;
    }
    return [this._renderVisible(), this._renderOthers()];
  },

  _renderActiveItemLine() {
    if (!this.props.children || this.props.children.length === 0) {
      return null;
    }
    return <ActiveItemLine target={this} wide />;
  },

  render() {
    const hasItems = this.props.children && this.props.children.length > 0;
    const className = classNames('v-navigation', {
      collapsed: !hasItems || this.state.collapsed,
    });

    return (
      <ul className={className}>
        {this._renderChildren()}
        {this._renderActiveItemLine()}
      </ul>
    );
  },
});

export default ModuleNavigation;



// WEBPACK FOOTER //
// ./src/js/app/components/moduleNavigation/ModuleNavigation.js