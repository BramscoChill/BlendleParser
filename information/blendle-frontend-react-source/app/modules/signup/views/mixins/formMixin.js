const React = require('react');
const PropTypes = require('prop-types');
const ReactDOM = require('react-dom');
const classNames = require('classnames');

module.exports = {
  propTypes: {
    onSubmit: PropTypes.func.isRequired,
  },

  // implement these methods/props
  // - mainField: '',
  // - onSubmitValid: function (res) {},
  // - onSubmitError: function (err) {},

  getInitialState() {
    return {
      valid: true,
      loading: false,
      navigateNext: false,
    };
  },

  componentDidMount() {
    this.updateNavigationState();

    if (!this.props.disabled) {
      this.focusAndSelectMainField();
    }
  },

  componentDidUpdate(prevProps) {
    if (!this.props.disabled && (prevProps.disabled || !prevProps)) {
      this.focusAndSelectMainField();
    }

    if (this.props.disabled && !prevProps.disabled) {
      this.blurMainField();
    }
  },

  getField(name, form) {
    if (!form) {
      form = ReactDOM.findDOMNode(this);
    }
    return form.elements[name];
  },

  getMainField() {
    if (!this.refs.mainField) return;

    return ReactDOM.findDOMNode(this.refs.mainField);
  },

  getFieldClassNames() {
    return classNames({
      'main-input': true,
      'main-input-valid': this.state.valid,
      'main-input-invalid': !this.state.valid,
    });
  },

  getFieldValue(field) {
    if (!field) {
      return;
    }
    if (field.type === 'checkbox') {
      return field.checked;
    }
    return field.value;
  },

  onMainFieldChange() {
    this.resetValidation();
    this.updateNavigationState();
  },

  /**
   * update the navigation buttons
   */
  updateNavigationState() {
    const value = this.getFieldValue(this.getMainField());
    let allowNext = true;

    if (typeof value === 'string') {
      allowNext = value.length > 0;
    }

    this.setState({
      navigateNext: allowNext,
    });
  },

  /**
   * on change of the mainField
   */
  resetValidation() {
    this.setState({ valid: true });
  },

  /**
   * handle the submit of the main form
   * @param {Event} [ev]
   * @param {Array} [extraArgs]
   */
  onSubmit(ev, extraArgs) {
    const self = this;

    if (ev && ev.preventDefault) {
      ev.preventDefault();
    }

    if (this.state.loading) {
      return;
    }

    this.setState({ loading: true });

    let args = [];
    if (this.getMainField()) {
      args.push(this.getFieldValue(this.getMainField()));
    }
    if (extraArgs) {
      args = args.concat(extraArgs);
    }

    this.props.onSubmit.apply(this, args).then(
      (res) => {
        if (self.isMounted()) {
          self.setState({ valid: true, loading: false });
          self.blurMainField();
        }

        self.onSubmitValid && self.onSubmitValid(res);
      },
      (err) => {
        if (self.isMounted()) {
          self.setState({ valid: false, loading: false });
          self.focusAndSelectMainField();
        }

        self.onSubmitError && self.onSubmitError(err);

        // don't rethrow undefined or xhr errors
        if (!err || (err && err.xhr)) {
          return;
        }

        throw err;
      },
    );
  },

  focusAndSelectMainField() {
    if (!this.refs.mainField || ReactDOM.findDOMNode(this.refs.mainField).type === 'checkbox') {
      return;
    }
    if (window.BrowserDetect.device === 'iPhone') {
      return;
    }
    if (window.BrowserDetect.browser === 'Explorer' && window.BrowserDetect.version <= 11) {
      return;
    }

    this._focusAndSelect(this.refs.mainField);
  },

  _focusAndSelect(input) {
    ReactDOM.findDOMNode(input).focus();
    ReactDOM.findDOMNode(input).select();
  },

  blurMainField() {
    if (!this.refs.mainField) return;

    ReactDOM.findDOMNode(this.refs.mainField).blur();
  },
};



// WEBPACK FOOTER //
// ./src/js/app/modules/signup/views/mixins/formMixin.js