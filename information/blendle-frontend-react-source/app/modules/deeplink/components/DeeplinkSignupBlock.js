import React from 'react';
import { translate } from 'instances/i18n';
import DeeplinkForm from 'modules/deeplink/components/DeeplinkForm';
import ApplicationState from 'instances/application_state';
import CodeModel from 'models/code';
import { setAccessCookie } from 'helpers/internationalLaunch';

class DeeplinkSignupBlock extends React.Component {
  static propTypes = DeeplinkForm.propTypes;

  componentDidMount() {
    const model = new CodeModel();
    model.set('code', 'DL8sh37s');
    ApplicationState.set('signUpCode', model);
    setAccessCookie();
  }

  render() {
    return (
      <div className="launchpage-block-container">
        <p className="launchpage-block-container-body">{translate('deeplink.signup_block.body')}</p>
        <DeeplinkForm {...this.props} />
      </div>
    );
  }
}

export default DeeplinkSignupBlock;



// WEBPACK FOOTER //
// ./src/js/app/modules/deeplink/components/DeeplinkSignupBlock.js