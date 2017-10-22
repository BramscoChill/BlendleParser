import React from 'react';
import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import DropdownMixin from 'components/mixins/DropdownMixin';

function getNumberOfColumns(numberOfItems) {
  const itemHeight = 42;
  const availableSpace = window.innerHeight - 125;
  const allItemsHeight = itemHeight * numberOfItems;

  return Math.ceil(allItemsHeight / availableSpace);
}

const NavOthersItem = createReactClass({
  displayName: 'NavOthersItem',

  propTypes: {
    children: PropTypes.any,
  },

  mixins: [DropdownMixin()],

  getInitialState() {
    return {
      labelActiveState: {},
    };
  },

  _getActiveChild() {
    const activeIndex = this._getChildLabels().findIndex(
      label => this.state.labelActiveState[label],
    );

    if (activeIndex > -1) {
      return this.props.children[activeIndex];
    }
  },

  _getLabel() {
    const activeChild = this._getActiveChild();
    if (activeChild) {
      return {
        active: true,
        label: activeChild.props.item.label,
      };
    }

    const count = React.Children.count(this.props.children);
    const translate = require('instances/i18n').translate;
    return {
      active: false,
      label: translate('timeline.dropdown.more', [count]),
    };
  },

  _getChildLabels() {
    const labels = [];
    React.Children.forEach(this.props.children, (child) => {
      labels.push(child.props.item ? child.props.item.label : null);
    });
    return labels;
  },

  _onActiveChange(child, active) {
    const item = child.props.item;
    if (!item) {
      return;
    }

    const labelActiveState = this.state.labelActiveState;
    labelActiveState[item.label] = active;

    this.setState({ labelActiveState });
  },

  _renderChildren() {
    return React.Children.map(this.props.children, child =>
      React.cloneElement(child, {
        onActiveChange: this._onActiveChange.bind(this, child),
      }),
    );
  },

  render() {
    const { className, ...otherProps } = this.props;
    const listItemClassName = classNames({
      dropdown: true,
      's-open': this.state.open,
      [className]: className,
    });

    const label = this._getLabel();
    const labelClassName = classNames({
      'dropdown-more': true,
      'dropdown-handle': true,
      's-active': label.active,
    });

    const count = React.Children.count(this.props.children);
    const columns = getNumberOfColumns(count);
    const dropDownListClassNames = classNames({
      'dropdown-list': true,
      'dropdown-list-more': true,
      [`columns-${columns}`]: columns > 1,
    });

    return (
      <li className={listItemClassName} {...otherProps}>
        <a href="#" className={labelClassName} onClick={this.toggleDropdown}>
          {label.label}
        </a>
        <ul className={dropDownListClassNames} onClick={this.closeDropdown}>
          {this._renderChildren()}
        </ul>
      </li>
    );
  },
});

export default NavOthersItem;



// WEBPACK FOOTER //
// ./src/js/app/components/moduleNavigation/NavOthersItem.js