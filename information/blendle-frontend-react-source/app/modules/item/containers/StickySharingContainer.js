import React from 'react';
import { platformHasApp } from 'helpers/openApp';
import { isMobile } from 'instances/browser_environment';
import DesktopStickySharing from './DesktopStickySharingContainer';
import MobileStickySharingContainer from './MobileStickySharingContainer';

const StickySharingContainer = () =>
  isMobile() ? (
    <MobileStickySharingContainer hideOpenInApp={!platformHasApp()} />
  ) : (
    <DesktopStickySharing />
  );

export default StickySharingContainer;



// WEBPACK FOOTER //
// ./src/js/app/modules/item/containers/StickySharingContainer.js