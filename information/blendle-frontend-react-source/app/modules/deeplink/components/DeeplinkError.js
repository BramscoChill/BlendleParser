import React from 'react';
import { translateElement, translate } from 'instances/i18n';
import Analytics from 'instances/analytics';
import logPerformance from 'helpers/logPerformance';

export default class Deeplink extends React.Component {
  componentDidMount() {
    Analytics.track('Deeplink 404');
    logPerformance.applicationReady('Deeplink 404');
  }

  render() {
    return (
      <div className="v-deeplink-error">
        <h2 className="title">{translate('deeplink.error.title')}</h2>
        <p>{translateElement('deeplink.error.message', false)}</p>
      </div>
    );
  }
}



// WEBPACK FOOTER //
// ./src/js/app/modules/deeplink/components/DeeplinkError.js