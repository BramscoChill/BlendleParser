import ReactDOM from 'react-dom';
import React from 'react';
import { View } from 'byebye';
import { getException } from 'helpers/countryExceptions';
import hasPrivateLabAccess from 'helpers/hasPrivateLabAccess';
import Sidebar from '../components/Sidebar';
import SidebarContainer from '../containers/SidebarContainer';

const SettingsView = View.extend({
  className: 'v-settings l-no-animation white-close',

  initialize(options = {}) {
    this._sidebarContainer = document.createElement('div');
    this.el.appendChild(this._sidebarContainer);

    View.prototype.initialize.apply(this, arguments);
  },

  beforeUnload() {
    if (this._sidebarContainer) {
      ReactDOM.unmountComponentAtNode(this._sidebarContainer);
    }

    View.prototype.beforeUnload.apply(this, arguments);
  },

  render(...args) {
    ReactDOM.render(<SidebarContainer />, this._sidebarContainer);

    return View.prototype.renderViews.call(this, args);
  },
});

export default SettingsView;



// WEBPACK FOOTER //
// ./src/js/app/modules/settings/views/settings.js