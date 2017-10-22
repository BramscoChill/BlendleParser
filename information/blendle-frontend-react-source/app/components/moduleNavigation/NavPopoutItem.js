import React from 'react';
import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import dropdownMixin from 'components/mixins/DropdownMixin';

export default createReactClass({
  displayName: 'NavPopoutItem',

  propTypes: {
    className: PropTypes.string,
    item: PropTypes.object.isRequired,
    renderChildren: PropTypes.func.isRequired,
  },

  mixins: [dropdownMixin()],

  _renderLabel(item) {
    const labelClassName = classNames({
      'dropdown-handle': true,
      [item.className]: item.className,
    });

    if (item.trustLabelAsHtml) {
      return (
        <a
          href="#"
          className={labelClassName}
          onClick={this.toggleDropdown}
          dangerouslySetInnerHTML={{ __html: item.label }}
        />
      );
    }

    return (
      <a href="#" className={labelClassName} onClick={this.toggleDropdown}>
        {item.label}
      </a>
    );
  },

  render() {
    const item = this.props.item;

    const { className, ...otherProps } = this.props;
    const listItemClassName = classNames({
      dropdown: true,
      's-open': this.state.open,
      [className]: className,
    });

    return (
      <li className={listItemClassName} {...otherProps}>
        {this._renderLabel(item)}
        <ul className="dropdown-popout">{item.children.map(this.props.renderChildren)}</ul>
      </li>
    );
  },
});



// WEBPACK FOOTER //
// ./src/js/app/components/moduleNavigation/NavPopoutItem.js