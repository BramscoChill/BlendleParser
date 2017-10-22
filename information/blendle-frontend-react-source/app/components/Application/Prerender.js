import React from 'react';
import Loading from 'components/Loading';

export default () => (
  <div id="app">
    <div className="a-main">
      <div className="a-header">
        <div className="v-primary-navigation" />
      </div>
      <div className="a-navigation" />
      <div className="a-content">
        <Loading className="v-app-initial-load" center square />
      </div>
    </div>
    <div className="a-sidebar" />
    <div className="a-item l-overlay">
      <Loading className="v-app-initial-load" center square />
    </div>
  </div>
);



// WEBPACK FOOTER //
// ./src/js/app/components/Application/Prerender.js