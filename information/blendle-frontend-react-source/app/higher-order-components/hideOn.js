import { branch, renderNothing } from 'recompose';
import BrowserEnvironment from 'instances/browser_environment';

const supportedTypes = ['mobile', 'desktop'];

/**
 * HOC to hide a component on a certain device type.
 * @param {('mobile'|'desktop')} deviceType - The device type where the component should be hidden
 */
export default function hideOn(deviceType) {
  if (!supportedTypes.includes(deviceType)) {
    throw new Error(
      `You should call hideOn with one of the supported device types: ${supportedTypes.join(', ')}`,
    );
  }

  return branch(
    () =>
      (deviceType === 'desktop' && BrowserEnvironment.isDesktop()) ||
      (deviceType === 'mobile' && BrowserEnvironment.isMobile()),
    renderNothing,
  );
}



// WEBPACK FOOTER //
// ./src/js/app/higher-order-components/hideOn.js