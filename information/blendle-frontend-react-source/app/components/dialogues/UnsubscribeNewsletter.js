import React from 'react';
import PropTypes from 'prop-types';
import Alert from 'components/dialogues/Alert';
import { translate } from 'instances/i18n';
import Link from 'components/Link';
import { history } from 'byebye';

class UnsubscribeNewsletter extends React.Component {
  static propTypes = {
    optOutType: PropTypes.oneOf(['trial_upsell', 'digests', 'master']).isRequired,
    onClose: PropTypes.func.isRequired,
    user: PropTypes.object,
  };

  componentDidMount() {
    if (this.props.optOutType === 'trial_upsell') {
      this._updateNewsletterSettings();
    }
  }

  _updateNewsletterSettings() {
    if (!this.props.user) {
      return;
    }

    const newsletterSettings = [
      'digest_opt_out',
      'weekly_digest_opt_out',
      'magazine_digest_opt_out',
    ];
    newsletterSettings.forEach((newsletterSetting) => {
      this.props.user.saveProperty(newsletterSetting, true);
    });
  }

  _onNavigateToSettings(e) {
    e.preventDefault();

    history.navigate('/settings/emails', { trigger: true, replace: true });
    this.props.onClose();
  }

  _renderEmailUnsubscribeDialogueCopy() {
    if (this.props.optOutType === 'trial_upsell') {
      return <p>{translate('dialogues.upsell_emails_unsubscribe')}</p>;
    }

    if (this.props.optOutType === 'master') {
      return [
        <p key="master-optout-title">{translate('dialogues.master_opt_out.title')}</p>,
        <p key="master-optout-description">{translate('dialogues.master_opt_out.description')}</p>,
      ];
    }

    return <p>{translate('dialogues.newsletter_unsubscribe')}</p>;
  }

  _renderEmailSettingsButton() {
    if (this.props.user) {
      return (
        <Link
          className="btn btn-secondary btn-fullwidth"
          href="/settings/email"
          onClick={this._onNavigateToSettings.bind(this)}
        >
          {translate('app.buttons.email_settings')}
        </Link>
      );
    }

    return null;
  }

  render() {
    return (
      <Alert onClose={this.props.onClose} onConfirm={this.props.onClose}>
        <h2>{translate('app.success.it_worked')}</h2>
        {this._renderEmailUnsubscribeDialogueCopy()}
        <button className="btn btn-fullwidth" onClick={this.props.onClose}>
          {translate('app.buttons.close')}
        </button>
        {this._renderEmailSettingsButton()}
      </Alert>
    );
  }
}

export default UnsubscribeNewsletter;



// WEBPACK FOOTER //
// ./src/js/app/components/dialogues/UnsubscribeNewsletter.js