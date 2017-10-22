module.exports = (function () {
  // Libraries
  const _ = require('lodash');
  const ByeBye = require('byebye');

  const DropdownItemView = ByeBye.View.extend({
    className: 'v-dropdown-item dropdown-item',
    events: {
      click: '_eClick',
      mousewheel: '_eMousewheel',
    },

    render() {
      this.el.innerHTML = this.options.title;

      this.el.setAttribute('data-value', this.options.value);

      return this;
    },

    /**
     * Set the current value
     * @param {String} value
     */
    setValue(value) {
      this.options.value = value;
      this.render();
    },

    /**
     * Set the current title and render
     * @param {String} title
     */
    setTitle(title) {
      this.options.title = title;
      this.render();
    },

    /**
     * Add a seperator border on the bottom of the item
     */
    addSeperator() {
      this.setLayout('seperator');
    },

    /**
     * Remove the seperator border from the bottom of the item
     */
    removeSeperator() {
      this.removeLayout('seperator');
    },

    _eClick() {
      this.options.onClick(this.options.value);
    },

    _eMousewheel(e) {
      e.stopPropagation();
    },
  });

  const DropdownView = ByeBye.View.extend({
    className: 'v-input v-dropdown frm-field-wrapper',

    constructor(items, options) {
      ByeBye.View.call(this, options);

      this._items = items;

      if (!this.options.selected) {
        if (this.options.key && this.options.value) {
          this._selected = this._items[0][this.options.key];
        } else {
          this._selected = Object.keys(this._items)[0];
        }
      } else {
        this._selected = this.options.selected;
      }
    },

    render() {
      this.delegateEvents();

      this._renderItems();

      return this;
    },

    setItems(items) {
      this._items = items;
      this._renderItems();
    },

    /**
     * Reset to value set through options
     * @return {String}
     */
    reset() {
      this.setSelected(this.options.selected);
    },

    /**
     * Set current selected value
     * @param {String} id
     */
    setSelected(id) {
      this._selected = id;

      this._selectedItemView.setValue(id);
      this._selectedItemView.setTitle(this.getSelectedLabel());

      if (this.inputElement) {
        this.inputElement.value = id;
      }
    },

    /**
     * Convenience method to provide forward capabilities for input interface
     * @param {String} id
     */
    setValue(id) {
      this.setSelected(id);
    },

    /**
     * Set the title of the selected item
     * @param {String} title
     * @param {String} id
     */
    setSelectedTitle(title, id) {
      this._selectedItemView.setTitle(title);

      if (id) {
        this._selected = id;

        this._selectedItemView.setValue(id);

        if (this.inputElement) {
          this.inputElement.value = id;
        }
      }
    },

    /**
     * Get the current selected item
     * @return {[type]} [description]
     */
    getSelected() {
      return this._selected;
    },

    /**
     * Get the current value, alias for getSelected for forward capabilities input interface
     * @return {[type]} [description]
     */
    getValue() {
      return this._selected;
    },

    /**
     * Get the currently selected label
     * @return {String}
     */
    getSelectedLabel() {
      if (this.options.key && this.options.value) {
        const property = {};
        property[this.options.key] = this._selected;
        return _.find(this._items, property)[this.options.value];
      }

      return this._items[this._selected];
    },

    /**
     * Toggle whether the dropdown is open or closed
     */
    toggle() {
      if (this._open) {
        this.close();
      } else {
        this.open();
      }
    },

    /**
     * Open the dropdown
     */
    open() {
      this.addEventListener(window, 'click', this._eCloseDropdown.bind(this));

      this._open = true;

      const field = this.el.querySelector('.selected-item');
      const dropdown = this.el.querySelector('.v-dropdown-items');

      dropdown.classList.add('s-open');
      this._setBestPosition(field, dropdown);

      field.classList.add('s-open');
    },

    _setBestPosition(field, dropdown) {
      // reset the maxHeight
      dropdown.style.maxHeight = '';

      const fieldBounds = field.getBoundingClientRect();
      const dropdownHeight = dropdown.offsetHeight;

      // find out where to place the dropdown and the maximum height so it will remain in screen
      let placeBelow = true;
      let maxHeight = window.innerHeight - fieldBounds.bottom;

      // find out if to place above the input, and the height above must larger then the one below
      // so we find the optimal position
      if (fieldBounds.bottom + dropdownHeight > window.innerHeight && fieldBounds.top > maxHeight) {
        placeBelow = false;
        maxHeight = fieldBounds.top;
      }

      dropdown.style.maxHeight = `${Math.min(maxHeight - 20, 300)}px`;
      dropdown.style.top = placeBelow ? `${fieldBounds.height}px` : 'auto';
      dropdown.style.bottom = !placeBelow ? `${fieldBounds.height}px` : 'auto';

      dropdown.classList.add(placeBelow ? 'below' : 'above');
      dropdown.classList.remove(!placeBelow ? 'below' : 'above');
    },

    /**
     * Close the dropdown
     */
    close() {
      const self = this;

      if (!this.el) return;

      this.removeEventListener(window, 'click');

      self._open = false;

      _.each(this.el.querySelectorAll('.v-dropdown-item'), (element) => {
        element.style.top = '0px';
      });

      self.el.querySelector('.v-dropdown-items').classList.remove('s-open');

      setTimeout(() => {
        if (self.el && !self._open) {
          self.el.querySelector('.selected-item').classList.remove('s-open');
          self.el.querySelector('.v-dropdown-items').style.height = '';
        }
      }, 200);
    },

    /**
     * Adds a seperator to the dropdown item
     * @param {[type]} key [description]
     */
    addSeperator(key) {
      this.getView(`item-${key}`).addSeperator();
    },

    _renderItems() {
      // Remove all child views
      this.removeAllChildren();
      this.el.innerHTML = '';

      // Render an item to display the selected item
      this._selectedItemView = new DropdownItemView({
        value: this._selected,
        title: this.getSelectedLabel(),
        onClick: this.toggle.bind(this),
      });

      this.addView(this._selectedItemView, 'selected-item');
      this.el.appendChild(this._selectedItemView.render().el);
      this._selectedItemView.el.className = 'selected-item';

      // Create a div to hold our options
      const optionsContainer = document.createElement('div');
      optionsContainer.className = 'v-dropdown-items';

      const addItem = (title, id) => {
        if (this.options.key && this.options.value) {
          const object = title;
          id = object[this.options.key]; // eslint-disable no-param-reassign
          title = object[this.options.value]; // eslint-disable no-param-reassign
        }

        const itemView = new DropdownItemView({
          value: id,
          title,
          onClick: this._changeSelected.bind(this),
        });

        this.addView(itemView, `item-${id}`);
        optionsContainer.appendChild(itemView.render().el);
      };

      // Render all options
      if (Array.isArray(this._items)) {
        this._items.forEach(addItem);
      } else {
        _.forIn(this._items, addItem);
      }

      this.el.appendChild(optionsContainer);

      // If a name is given in options, render an input element
      if (this.options.name) {
        this.inputElement = document.createElement('input');
        this.inputElement.type = 'hidden';
        this.inputElement.value = this._selected;
        this.inputElement.className = 'inp';
        this.inputElement.name = this.options.name;
        this.el.appendChild(this.inputElement);

        this.el.classList.add(`dropdown-${this.options.name}`);
      }
    },

    /**
     * Delegate methods
     */
    _changeSelected(id) {
      let changed = false;

      if (this.getSelected() !== id) {
        changed = true;
      }

      this.setSelected(id);

      if (changed) {
        this._changed();
      }

      this.close();
    },

    _changed() {
      if (this.options.onChange) {
        this.options.onChange(this.getSelected());
      }
    },

    _eCloseDropdown(evt) {
      if (!this.el.contains(evt.target) && evt.target !== this.el) {
        this.close();
      }
    },
  });

  return DropdownView;
}());



// WEBPACK FOOTER //
// ./src/js/app/views/helpers/dropdown.js