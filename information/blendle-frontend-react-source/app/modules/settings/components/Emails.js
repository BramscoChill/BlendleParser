import React from 'react';
import PropTypes from 'prop-types';
import { translate } from 'instances/i18n';
import ToggleButton from 'components/buttons/Toggle';
import classNames from 'classnames';
import Button from 'components/Button';

export default class Emails extends React.Component {
  static propTypes = {
    onToggleOption: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired,
    loadingProperties: PropTypes.arrayOf(PropTypes.string).isRequired,
    onToggleKillSwitch: PropTypes.func.isRequired,
    killSwitchLoading: PropTypes.bool.isRequired,
  };

  _renderRow(propertyName) {
    const inactive =
      this.props.user.get('master_opt_out') || this.props.loadingProperties.includes(propertyName);

    return (
      <li className="row">
        <ToggleButton
          checked={!this.props.user.get(propertyName)}
          onToggle={() => this.props.onToggleOption(propertyName)}
          inactive={inactive}
        />
        {translate(`settings.emails.options.${propertyName}`)}
      </li>
    );
  }

  _renderKillSwitch() {
    const optOut = this.props.user.get('master_opt_out');

    const classes = classNames(
      'email-kill-switch-btn s-small btn-green',
      { 'email-kill-switch-btn-off': optOut },
      { 'email-kill-switch-btn-on': !optOut },
    );

    if (optOut) {
      return (
        <div className="email-kill-switch">
          {translate('settings.emails.killswitch.off')}
          <Button className={classes} onClick={() => this.props.onToggleKillSwitch()}>
            {translate('settings.emails.killswitch.turn_on')}
          </Button>
        </div>
      );
    }

    return (
      <div className="email-kill-switch">
        {translate('settings.emails.killswitch.on')}
        <Button className={classes} onClick={() => this.props.onToggleKillSwitch()}>
          {translate('settings.emails.killswitch.turn_off')}
        </Button>
      </div>
    );
  }

  render() {
    return (
      <div className="v-emails pane">
        <div className="container">
          <h2 className="header">{translate('settings.emails.header')}</h2>
          <h3 className="title">{translate('settings.emails.options.title_personal')}</h3>
          <ul>
            {this._renderRow('alerts_opt_out')}
            {this._renderRow('new_edition_opt_out')}
            {this._renderRow('read_later_opt_out')}
            {this._renderRow('digest_opt_out')}
            {this._renderRow('weekly_digest_opt_out')}
            {this._renderRow('magazine_digest_opt_out')}
            {this._renderRow('marketing_opt_out')}
          </ul>
          <h3 className="title">{translate('settings.emails.options.title_social')}</h3>
          <ul>{this._renderRow('followers_opt_out')}</ul>
          <h3 className="title">{translate('settings.emails.options.title_tips')}</h3>
          <ul>
            {this._renderRow('tips_opt_out')}
            {this._renderRow('announcements_opt_out')}
            {this._renderRow('survey_opt_out')}
          </ul>
          {this._renderKillSwitch()}
        </div>
      </div>
    );
  }
}



// WEBPACK FOOTER //
// ./src/js/app/modules/settings/components/Emails.js