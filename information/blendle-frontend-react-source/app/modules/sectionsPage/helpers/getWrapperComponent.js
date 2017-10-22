import { isFeaturedSection } from '../selectors/sections';
import { DESKTOP_LAYOUT_HORIZONTAL, MOBILE_LAYOUT_SCROLLING } from '../constants';
import ScrollingSection from '../components/ScrollingSection';
import WrappingSection from '../components/WrappingSection';
import GridSection from '../components/GridSection';
import FallbackGridSection from '../components/FallbackGridSection';
import HorizontalSection from '../components/HorizontalSection';
import FeaturedSection from '../components/FeaturedSection';

export default function getWrapperComponent({
  sectionId,
  isMobileViewport,
  desktopLayout,
  mobileLayout,
  hasCSSGridSupport,
}) {
  if (isFeaturedSection(sectionId)) {
    return FeaturedSection;
  }

  if (isMobileViewport && mobileLayout === MOBILE_LAYOUT_SCROLLING) {
    return ScrollingSection;
  }

  if (isMobileViewport) {
    return WrappingSection;
  }

  if (desktopLayout === DESKTOP_LAYOUT_HORIZONTAL) {
    return HorizontalSection;
  }

  // For now, fallback to a grid section when on desktop
  return hasCSSGridSupport ? GridSection : FallbackGridSection;
}



// WEBPACK FOOTER //
// ./src/js/app/modules/sectionsPage/helpers/getWrapperComponent.js