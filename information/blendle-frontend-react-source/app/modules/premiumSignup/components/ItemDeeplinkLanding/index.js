import React, { Component } from 'react';
import PropTypes from 'prop-types';
import withDialogs from '../../higher-order-components/withDialogs';
import DeeplinkSignupPane from '../DeeplinkSignupPane';
import DeeplinkItemPane from '../DeeplinkItemPane';
import DeeplinkPlain from '../DeeplinkPlain';
import Loading from 'components/Loading';
import CSS from './style.scss';

class DeeplinkSignupPage extends Component {
  static propTypes = {
    item: PropTypes.object,
    isLoading: PropTypes.bool.isRequired,
    provider: PropTypes.object,
    sharer: PropTypes.object,
    abVariant: PropTypes.string,
  };

  _renderPanesDeeplink() {
    return (
      <div className={CSS.panesContainer} data-test-identifier="deeplink-premium">
        <DeeplinkItemPane item={this.props.item} />
        <DeeplinkSignupPane />
      </div>
    );
  }

  _renderDeeplinkPlainDeeplink() {
    return (
      <div data-test-identifier="deeplink-premium">
        <DeeplinkPlain
          item={this.props.item}
          provider={this.props.provider}
          sharer={this.props.sharer}
          abVariant={this.props.abVariant}
        />
      </div>
    );
  }

  render() {
    if (this.props.isLoading) {
      return <Loading className={CSS.loading} />;
    }

    // Future AB test
    // return this._renderPanesDeeplink();

    return this._renderDeeplinkPlainDeeplink();
  }
}

export default withDialogs(DeeplinkSignupPage);



// WEBPACK FOOTER //
// ./src/js/app/modules/premiumSignup/components/ItemDeeplinkLanding/index.js