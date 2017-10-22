//
// DEPRECATED. Use the <Dropdown> component instead of this mixin.
//

import { keyCode } from 'app-constants';
import ReactDOM from 'react-dom';

export default function DropdownMixin(adoptionElementSelector) {
  return {
    getInitialState() {
      return {
        open: this.props.open,
      };
    },

    componentWillReceiveProps(nextProps) {
      if (nextProps.open !== this.props.open && nextProps.open !== this.state.open) {
        this.setState({ open: nextProps.open });
      }
    },

    componentDidMount() {
      // clicks are captured before any other clicks, to prevent closing immediately after an open
      window.addEventListener('click', this._closeDropdownThroughWindowClick, true);
      window.addEventListener('keyup', this._closeDropdownThroughEscape);
    },

    componentWillUnmount() {
      window.removeEventListener('click', this._closeDropdownThroughWindowClick, true);
      window.removeEventListener('keyup', this._closeDropdownThroughEscape);
    },

    _closeDropdownThroughWindowClick(e) {
      // if the clicked target element is marked as the toggle, we don't want to close the dropdown.
      // it will be handled by the toggleTarget's event handler.
      if (e.target === this._toggleNode) {
        return;
      }

      if (!this.state.open || !this.isMounted()) {
        return;
      }

      let isAdoptedElement;
      if (adoptionElementSelector) {
        const adoptionElement = document.querySelector(adoptionElementSelector);
        if (adoptionElement) {
          isAdoptedElement = e.target === adoptionElement || adoptionElement.contains(e.target);
        }
      }

      // Try catch because component does not get unmounted
      try {
        const domNode = ReactDOM.findDOMNode(this);
        if (
          e.target !== domNode &&
          !domNode.contains(e.target) &&
          !isAdoptedElement &&
          this.state.open
        ) {
          this.closeDropdown();
        }
      } catch (err) {
        this.componentWillUnmount();
      }
    },

    _closeDropdownThroughEscape(e) {
      if (!this.isMounted() || e.ctrlKey) {
        return;
      }

      if (e.keyCode === keyCode.ESC && this.state.open) {
        this.closeDropdown();
      }
    },

    setToggleNodeElement(node) {
      this._toggleNode = node;
    },

    toggleDropdown(e) {
      if (e) e.preventDefault();

      if (this.state.open) {
        this.closeDropdown(e);
      } else {
        this.openDropdown(e);
      }
    },

    openDropdown(e) {
      if (e) e.preventDefault();

      if (!this.state.open) {
        this.setState({ open: true });

        if (this.props.onOpen) this.props.onOpen();
      }
    },

    closeDropdown() {
      if (this.state.open) {
        this.setState({ open: false });

        if (this.props.onClose) this.props.onClose();
      }
    },
  };
}



// WEBPACK FOOTER //
// ./src/js/app/components/mixins/DropdownMixin.js