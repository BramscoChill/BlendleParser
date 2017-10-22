import React from 'react';
import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';
import i18n from 'instances/i18n';
import PrevPaneButton from '../PrevPaneButton';
import StickySubmitPaneButton from '../StickySubmitPaneButton';
import formMixin from '../mixins/formMixin';
import { getException } from 'helpers/countryExceptions';
import classNames from 'classnames';

const AboutView = createReactClass({
  displayName: 'AboutView',
  mixins: [formMixin],

  propTypes: {
    disabled: PropTypes.bool,
    onPrev: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
  },

  componentWillReceiveProps(nextProps) {
    // set a timer to show the sticky button after 3 seconds
    if (this.props.disabled !== nextProps.disabled && !nextProps.disabled) {
      this._appearButtonTimer = setTimeout(this._showStickyButton, 3000);
    }
  },

  componentWillUnmount() {
    if (this._appearButtonTimer) {
      clearTimeout(this._appearButtonTimer);
    }
    clearTimeout(this._openTimer);
  },

  componentWillUpdate(nextProps, nextState) {
    if (!this.props.disabled && nextProps.disabled) {
      nextState.open = false;
    }
  },

  _showStickyButton() {
    this.refs.stickySubmit.updateVisiblity();
  },

  _renderTitle() {
    const titleClassNames = classNames({
      'no-count': getException('hideOnboaringUserCount', false),
    });

    return <h1 className={titleClassNames}>{i18n.translateElement('signup.about.title')}</h1>;
  },

  _renderUserCount() {
    if (getException('hideOnboaringUserCount', false)) {
      return null;
    }

    return <div className="user-count">{i18n.translateElement('signup.about.user_count')}</div>;
  },

  render() {
    return (
      <form
        className="v-signup-about slide-animation"
        onSubmit={this.onSubmit}
        onClick={this._showStickyButton}
      >
        {this._renderTitle()}
        {this._renderUserCount()}
        <div className="screenshots">
          <p>{i18n.translate('signup.about.kiosk')}</p>
          <p className="screenshot">
            <img src={`/img/signup/kiosk.${i18n.getIso639_1()}.jpg`} width="575" height="359" />
          </p>

          <p>{i18n.translate('signup.about.timeline')}</p>
          <p className="screenshot">
            <img src={`/img/signup/timeline.${i18n.getIso639_1()}.jpg`} width="575" height="359" />
          </p>
        </div>

        <div
          className="gift"
          dangerouslySetInnerHTML={{
            __html: i18n.translate('signup.about.gift', [i18n.formatCurrency(2.5)]),
          }}
        />

        <div className="v-navigate-next">
          <button type="submit" className="btn" disabled={this.props.disabled}>
            {i18n.translate('supersympathiek')}
            {'!'}
          </button>
        </div>

        <PrevPaneButton onClick={this.props.onPrev} />
        <StickySubmitPaneButton
          ref="stickySubmit"
          disabled={this.props.disabled}
          onClick={this.onSubmit}
        />
      </form>
    );
  },
});

export default AboutView;



// WEBPACK FOOTER //
// ./src/js/app/modules/signup/views/about/About.js