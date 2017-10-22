import React from 'react';
import Error from 'components/Application/Error';
import { translate } from 'instances/i18n';

function PersonalPageError() {
  const message = (
    <p dangerouslySetInnerHTML={{ __html: translate('timeline.bundle.error.body') }} />
  );

  return <Error title={translate('timeline.bundle.error.headline')} message={message} />;
}

export default PersonalPageError;



// WEBPACK FOOTER //
// ./src/js/app/modules/sectionsPage/components/PersonalPageError/index.js