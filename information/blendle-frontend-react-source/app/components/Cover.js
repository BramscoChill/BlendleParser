import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Analytics from 'instances/analytics';
import Auth from 'controllers/auth';
import Image from 'components/Image';
import Button from 'components/Button';
import classNames from 'classnames';
import { providerById, prefillSelector } from 'selectors/providers';
import ProviderManager from 'managers/provider';
import BrowserEnvironment from 'instances/browser_environment';
import Link from 'components/Link';

export default class Cover extends Component {
  static propTypes = {
    issue: PropTypes.object.isRequired,
    onClick: PropTypes.func,
    onLoad: PropTypes.func,
  };

  state = {
    ready: false,
  };

  _toggleFavourite(e) {
    e.preventDefault();

    const providerId = this.props.issue.get('provider').id;
    const statsPayload = {
      type: 'kiosk',
      issue_id: this.props.issue.id,
      provider: prefillSelector(providerById)(providerId).name,
    };

    const toggle = !this.props.issue.get('favourite');
    ProviderManager.favorite(Auth.getUser().id, providerId, toggle).then(() => {
      const eventName = toggle ? 'Add Favorite' : 'Remove favorite';
      Analytics.track(eventName, statsPayload);
      this.props.issue.set('favourite', toggle);
      this.forceUpdate();
    });
  }

  _onCoverLoad(ev) {
    this.setState({ ready: true });

    if (this.props.onLoad) {
      this.props.onLoad(ev);
    }
  }

  render() {
    let favourite;
    let className;
    const issue = this.props.issue;

    if (Auth.getUser() && this.state.ready) {
      className = classNames('favourite', {
        'l-favourite': issue.get('favourite'),
      });
      favourite = <Button className={className} onClick={e => this._toggleFavourite(e)} />;
    }

    return (
      <div className="v-cover cover-image">
        <Link onClick={this.props.onClick} href={`/issue/${issue.get('provider').id}/${issue.id}`}>
          <Image
            animate={BrowserEnvironment.isDesktop()}
            src={issue.getCoverURL()}
            width={issue.getCoverWidth()}
            height={issue.getCoverHeight()}
            onLoad={this._onCoverLoad.bind(this)}
          />
        </Link>
        {favourite}
      </div>
    );
  }
}



// WEBPACK FOOTER //
// ./src/js/app/components/Cover.js