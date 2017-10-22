import React, { Component } from 'react';
import BackboneView from 'components/shared/BackboneView';
import UpgradeBrowserBarView from 'views/upgradebrowserbar';

export default class DeprecatedBrowserWarning extends Component {
  componentWillMount() {
    this.view = new UpgradeBrowserBarView();
  }

  render() {
    return <BackboneView view={this.view} />;
  }
}



// WEBPACK FOOTER //
// ./src/js/app/components/Application/DeprecatedBrowserWarning.js