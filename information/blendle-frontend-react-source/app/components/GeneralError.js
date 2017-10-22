import React from 'react';
import PropTypes from 'prop-types';
import { translate, translateElement } from 'instances/i18n';
import zendesk from 'instances/zendesk';

class GeneralError extends React.Component {
  static propTypes = {
    title: PropTypes.string,
    message: PropTypes.string,
  };

  _onContactClick = (e) => {
    e.preventDefault();
    zendesk.execute('activate');

    return false;
  };

  render() {
    return (
      <div className="v-error" style={{ opacity: 1, zIndex: 1 }}>
        <div className="error-wrapper">
          <div className="error-container">
            <h1 className="error-title">{translate('app.error.title')}</h1>
            {translateElement(
              <p className="error-message" onClick={this._onContactClick} />,
              'dialogues.subscription_result.failure_message',
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default GeneralError; // at your service.



// WEBPACK FOOTER //
// ./src/js/app/components/GeneralError.js