import React from 'react';
import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import ModuleNavigationStore from 'stores/ModuleNavigationStore';
import dropdownMixin from 'components/mixins/DropdownMixin';
import Link from 'components/Link';

const NavDropDownItem = createReactClass({
  displayName: 'NavDropDownItem',

  propTypes: {
    className: PropTypes.string,
    item: PropTypes.object.isRequired,
    renderChildren: PropTypes.func,
    children: PropTypes.any,
  },

  mixins: [dropdownMixin()],

  getInitialState() {
    return {
      activeUrl: ModuleNavigationStore.getState().activeUrl,
    };
  },

  componentDidMount() {
    ModuleNavigationStore.listen(this._onStoreStateChange);
  },

  componentWillUnmount() {
    ModuleNavigationStore.unlisten(this._onStoreStateChange);
  },

  _onStoreStateChange(state) {
    this.setState({
      activeUrl: state.activeUrl,
    });
  },

  _getLabelHref() {
    if (this.props.item.url) {
      return `/${this.props.item.url}`;
    }
    return '#';
  },

  _renderChildren() {
    if (this.props.children) {
      return this.props.children;
    }
    return this.props.item.children.map(this.props.renderChildren);
  },

  render() {
    const { className, item, renderChildren, ...otherProps } = this.props; // eslint-disable-line no-unused-vars
    const listItemClassName = classNames({
      dropdown: true,
      's-open': this.state.open,
      [className]: className,
    });

    const labelClassName = classNames({
      'dropdown-handle': true,
      [item.className]: item.className,
      's-active': this._getLabelHref() === this.state.activeUrl,
    });

    const columns = item.children ? Math.ceil(item.children.length / 8) : 1;
    const dropDownListClassNames = classNames({
      'dropdown-list': true,
      [`columns-${columns}`]: columns > 1,
    });

    return (
      <li className={listItemClassName} {...otherProps}>
        <Link href={this._getLabelHref()} className={labelClassName} onClick={this.toggleDropdown}>
          {item.label}
        </Link>
        <ul className={dropDownListClassNames} onClick={this.closeDropdown}>
          {this._renderChildren()}
        </ul>
      </li>
    );
  },
});

export default NavDropDownItem;



// WEBPACK FOOTER //
// ./src/js/app/components/moduleNavigation/NavDropDownItem.js