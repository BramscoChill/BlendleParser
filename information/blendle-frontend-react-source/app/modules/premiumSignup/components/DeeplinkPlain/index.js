import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Analytics from 'instances/analytics';
import Link from 'components/Link';
import { getManifestBody, getTitle, getContentAsText } from 'helpers/manifest';
import { getProviderLogoUrl } from 'helpers/providerHelpers';
import SignupFormContainer from 'modules/premiumSignup/containers/SignUpFormContainer';
import { flowRight as compose } from 'lodash';
import SignupDisclaimer from '../SignupDisclaimer';
import CSS from './style.scss';

const itemTitle = compose(getContentAsText, getTitle, getManifestBody);

export default class PlainDeeplink extends PureComponent {
  static propTypes = {
    item: PropTypes.object.isRequired,
    provider: PropTypes.object.isRequired,
  };

  componentDidMount() {
    Analytics.trackItemEvent(
      this.props.item,
      {
        type: 'deeplink',
        referrer: document.referrer,
      },
      'Deeplink Readmore',
    );
  }

  _renderSignUp() {
    const { item } = this.props;

    return (
      <div className={CSS.signupForm}>
        <SignupFormContainer
          itemId={item.get('manifest').id}
          buttonText="Lees dit artikel gratis"
          locationInLayout="inline_form"
        />
        <SignupDisclaimer className={CSS.disclaimerFormVariant} />
      </div>
    );
  }

  render() {
    const { item, provider } = this.props;
    const manifest = item.get('manifest');
    const logo = getProviderLogoUrl(provider.id, 'logo.png');

    return (
      <div className={CSS.plainVariant} data-test-identifier="premium-deeplink">
        <div className={`item item-content provider-${provider.id} ${CSS.noBackground}`}>
          <img className={CSS.providerLogo} src={logo} alt={`logo ${provider.id}`} />
          <h1 className={`item-title ${CSS.title}`}>{itemTitle(manifest)}</h1>
        </div>
        <div className={CSS.signUpContainer}>
          <p className={CSS.introTitle}>
            <strong>
              Dit verhaal + nog veel meer lees je via&nbsp;<Link href="/">Blendle</Link>
            </strong>
          </p>
          {this._renderSignUp()}
        </div>
      </div>
    );
  }
}



// WEBPACK FOOTER //
// ./src/js/app/modules/premiumSignup/components/DeeplinkPlain/index.js