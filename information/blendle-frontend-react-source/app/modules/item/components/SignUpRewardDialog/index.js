import React from 'react';
import PropTypes from 'prop-types';
import { compose, withState, withHandlers, setPropTypes, pure } from 'recompose';
import { Dialog } from '@blendle/lego';
import StepsPanel from 'components/StepsPanel';
import { formatCurrency } from 'instances/i18n';
import PresentContent from './PresentContent';
import MoneyBackContent from './MoneyBackContent';
import CSS from './style.scss';

const enhance = compose(
  setPropTypes({
    gift: PropTypes.number.isRequired,
    price: PropTypes.number.isRequired,
    userHasPremium: PropTypes.bool.isRequired,
  }),
  withState('step', 'goToStep', 0),
  withState('isOpen', 'setOpen', true),
  withHandlers({
    close: props => () => props.setOpen(false),
    nextStep: props => () => props.goToStep(props.step + 1),
  }),
  pure,
);

const SignUpRewardDialog = enhance(
  ({ isOpen, close, step, nextStep, price, gift, userHasPremium }) => (
    <Dialog
      open={isOpen}
      closeButtonClassName={CSS.closeIcon}
      onClose={close}
      className={CSS.dialog}
      overlayClassName={CSS.overlay}
    >
      <StepsPanel
        showStepIndicator
        activeStepIndex={step}
        className={CSS.stepsContainer}
        stepIndicatorContainerClassName={CSS.stepIndicatorContainerClassName}
      >
        <div>
          <PresentContent
            onNextStep={nextStep}
            className={CSS.body}
            price={formatCurrency(price)}
            gift={formatCurrency(gift)}
            userHasPremium={userHasPremium}
          />
        </div>

        <div>
          <MoneyBackContent close={close} className={CSS.body} />
        </div>
      </StepsPanel>
    </Dialog>
  ),
);

export default SignUpRewardDialog;



// WEBPACK FOOTER //
// ./src/js/app/modules/item/components/SignUpRewardDialog/index.js