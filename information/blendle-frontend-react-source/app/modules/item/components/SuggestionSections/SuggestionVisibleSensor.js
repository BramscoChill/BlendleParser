import React from 'react';
import { node, string } from 'prop-types';
import { withHandlers } from 'recompose';
import InitialVisibilitySensor from 'components/InitialVisibilitySensor';
import Analytics from 'instances/analytics';

function logVisibility(type, isVisible) {
  const eventName = `Item Suggestions ${type} ${isVisible ? 'In' : 'Out Of'} Viewport`;

  Analytics.track(eventName);
}

const enhance = withHandlers({
  onVisibilityChanged: ({ type }) => isVisible => logVisibility(type, isVisible),
});

// Ignore onVisibilityChanged propType because it's added by the HOC
/* eslint react/prop-types: ['error', {ignore: ['onVisibilityChanged']}] */
function SuggestionVisibleSensor({ onVisibilityChanged, children }) {
  return (
    <InitialVisibilitySensor onChange={onVisibilityChanged} partialVisibility>
      {children}
    </InitialVisibilitySensor>
  );
}

SuggestionVisibleSensor.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  type: string.isRequired, // Disable unused prop check because it's used by the HOC
  children: node.isRequired,
};

export default enhance(SuggestionVisibleSensor);



// WEBPACK FOOTER //
// ./src/js/app/modules/item/components/SuggestionSections/SuggestionVisibleSensor.js