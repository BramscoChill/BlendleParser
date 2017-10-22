import React from 'react';
import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import getSelfOrParent from 'helpers/getselforparent';

// Should replace Select component
const Select2 = createReactClass({
  displayName: 'Select2',

  propTypes: {
    children: PropTypes.any,
    name: PropTypes.string, // eslint-disable-line react/no-unused-prop-types
    selected: PropTypes.string, // eslint-disable-line react/no-unused-prop-types
    onChange: PropTypes.func.isRequired,
    className: PropTypes.string,
  },

  _dropdownStyle: {},

  getInitialState() {
    return { open: false };
  },

  componentDidMount() {
    window.addEventListener('click', this._onCloseDropdown);
  },

  componentWillUpdate() {
    this._dropdownStyle = this._calculatePosition();
  },

  componentWillUnmount() {
    window.removeEventListener('click', this._onCloseDropdown);
  },

  _onToggle() {
    this.setState({ open: !this.state.open });
  },

  _onCloseDropdown(e) {
    if (
      !e ||
      (!ReactDOM.findDOMNode(this).contains(e.target) && e.target !== ReactDOM.findDOMNode(this))
    ) {
      this.setState({ open: false });
    }
  },

  _onChange(e) {
    // e.target can be a child element of .v-dropdown-item
    const dropdownItem = getSelfOrParent(e.target, '.v-dropdown-item');

    const value = dropdownItem.getAttribute('data-value');
    this.props.onChange(value);

    this._onCloseDropdown();
  },

  /**
   * Returns style for dropdown items
   */
  _calculatePosition() {
    if (!this.props.children) {
      return {};
    }

    const dropdown = ReactDOM.findDOMNode(this);

    const bounds = dropdown.getBoundingClientRect();
    const height = Math.min(300, this.props.children.length * 46);

    if (bounds.bottom + height < window.innerHeight) {
      return {}; // default is bottom
    }

    if (bounds.top - height > 0) {
      // should be above?
      return {
        top: -height,
      };
    }

    // Dropdown with current height does not fit
    const spaceAbove = bounds.top;
    const spaceBelow = window.innerHeight - bounds.bottom;
    const minHeight = 63;

    if (spaceAbove > spaceBelow) {
      // Above
      return {
        top: -Math.max(spaceAbove, minHeight),
        height: Math.max(spaceAbove, minHeight),
      };
    }

    // Below
    return {
      height: Math.max(spaceBelow, minHeight),
    };
  },

  _renderSelected() {
    if (this.props.children) {
      return this.props.children.filter(option => option.props.selected).map((option) => {
        const classes = classNames('v-dropdown-item dropdown-item selected-item', {
          's-open': this.state.open,
          [option.props.className]: option.props.className,
        });

        return (
          <div
            className={classes}
            data-value={option.props.value}
            key={option.props.value}
            onClick={this._onToggle}
          >
            {option.props.children}
          </div>
        );
      });
    }
  },

  _renderOptions() {
    if (this.props.children) {
      return this.props.children.map((option) => {
        const classes = classNames('v-dropdown-item dropdown-item', {
          [option.props.className]: option.props.className,
        });

        return (
          <div
            className={classes}
            data-value={option.props.value}
            key={option.props.value}
            onClick={this._onChange}
          >
            {option.props.children}
          </div>
        );
      });
    }
  },

  render() {
    const wrapperClasses = classNames('v-input v-dropdown frm-field-wrapper', {
      [this.props.className]: this.props.className,
    });

    const dropdownClasses = classNames('v-dropdown-items', {
      's-open': this.state.open,
      above: this._dropdownStyle.top < 0,
    });

    return (
      <div className={wrapperClasses}>
        {this._renderSelected()}
        <div className={dropdownClasses} style={this._dropdownStyle}>
          {this._renderOptions()}
        </div>
      </div>
    );
  },
});

export default Select2;



// WEBPACK FOOTER //
// ./src/js/app/components/Select2.js