import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import withDialogs from '../../higher-order-components/withDialogs';
import SignupDisclaimer from '../SignupDisclaimer';
import SignupFormContainer from '../../containers/SignUpFormContainer';
import { SIGNUP_TYPE_PAID_ADVERTISEMENT } from 'app-constants';
import CSS from './style.scss';

const titleMap = {
  pieter:
    'Het beste uit Vrij Nederland, Volkskrant, Trouw en 120\u00A0andere kranten en tijdschriften\u00A0op één plek',
  maria:
    'Het beste uit LINDA, Psychologie Magazine, Volkskrant en 120\u00A0andere kranten en tijdschriften\u00A0op één plek',
  mark:
    'Het beste uit Volkskrant, Quest, Vrij Nederland en 120\u00A0andere kranten en tijdschriften\u00A0op één plek',
  default:
    'Het beste uit LINDA, Psychologie Magazine, Volkskrant en 120\u00A0andere kranten en tijdschriften\u00A0op één plek',
};

class PremiumPersonaLanding extends PureComponent {
  static propTypes = {
    personaType: PropTypes.oneOf(Object.keys(titleMap)),
    route: PropTypes.object.isRequired,
  };

  static defaultProps = {
    personaType: 'default',
  };

  render() {
    const { personaType } = this.props;
    const coverClassName = CSS[personaType] || CSS.default;
    const title = titleMap[personaType] || titleMap.default;

    return (
      <div className={CSS.premiumPersonaLanding}>
        <div className={classNames(CSS.coversContainer, coverClassName)} />
        <div className={CSS.content}>
          <h1 className={CSS.title}>{title}</h1>
          <span className={CSS.subtitle}>Speciaal voor jou geselecteerd.</span>
          <div className={CSS.signupForm}>
            <SignupFormContainer
              signUpType={SIGNUP_TYPE_PAID_ADVERTISEMENT}
              locationInLayout="inline_form"
            />
            <span className={CSS.stopsAutomatically}>Stopt vanzelf, je zit nergens aan vast</span>
          </div>
          <SignupDisclaimer className={CSS.disclaimer} />
        </div>
      </div>
    );
  }
}

export default withDialogs(PremiumPersonaLanding);



// WEBPACK FOOTER //
// ./src/js/app/modules/premiumSignup/components/PremiumPersonaLanding/index.js