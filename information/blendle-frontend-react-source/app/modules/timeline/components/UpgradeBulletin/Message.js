import React from 'react';
import { string, number } from 'prop-types';

function Message({ name, daysLeft }) {
  // Last day, with name
  if (daysLeft === 0 && name) {
    return (
      <div className={CSS.message}>
        <strong>{name}</strong>, let op! Dit is je <strong>laatste dag</strong> gratis Blendle
        Premium. Ook na vandaag toegang&nbsp;houden?
      </div>
    );
  }

  // Countdown with name
  if (daysLeft === 1 && name) {
    return (
      <div className={CSS.message}>
        <strong>{name}</strong>, je leest Blendle Premium nog <strong>{daysLeft} dag</strong>{' '}
        gratis. Ook daarna toegang&nbsp;houden?
      </div>
    );
  }

  // Countdown without name
  if (daysLeft === 1) {
    return (
      <div className={CSS.message}>
        Je leest Blendle Premium nog <strong>{daysLeft} dag</strong> gratis. Ook daarna
        toegang&nbsp;houden?
      </div>
    );
  }

  // Last day, without name
  if (daysLeft === 0) {
    return (
      <div className={CSS.message}>
        Let op! Dit is je <strong>laatste dag</strong> gratis Blendle Premium. Ook na vandaag
        toegang&nbsp;houden?
      </div>
    );
  }

  // Expired
  if (daysLeft < 0) {
    return (
      <div className={CSS.message}>
        Onbeperkt toegang tot al deze artikelen? Dat kan met Blendle Premium.
      </div>
    );
  }

  // Generic countdown with name
  if (name) {
    return (
      <div className={CSS.message}>
        <strong>{name}</strong>, je leest Blendle Premium nog <strong>{daysLeft} dagen</strong>{' '}
        gratis. Ook daarna toegang&nbsp;houden?
      </div>
    );
  }

  // Generic Countdown
  return (
    <div className={CSS.message}>
      Je leest Blendle Premium nog <strong>{daysLeft} dagen</strong> gratis. Ook daarna
      toegang&nbsp;houden?
    </div>
  );
}

Message.propTypes = {
  name: string,
  daysLeft: number.isRequired,
};

Message.defaultProps = {
  name: '',
};

export default Message;



// WEBPACK FOOTER //
// ./src/js/app/modules/timeline/components/UpgradeBulletin/Message.js