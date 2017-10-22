import React from 'react';
import { setStatic, wrapDisplayName } from 'recompose';

export default function includeStoryDetails(ComposedComponent) {
  const enhance = setStatic(
    'displayName',
    wrapDisplayName(ComposedComponent, 'includeStoryDetails'),
  );

  return enhance(({ storyDetails, ...props }) => (
    <div>
      {storyDetails}
      <ComposedComponent {...props} />
    </div>
  ));
}



// WEBPACK FOOTER //
// ./src/js/app/modules/stories/higher-order-components/includeStoryDetails.js