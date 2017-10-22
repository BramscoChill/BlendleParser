import React from 'react';
import PropTypes from 'prop-types';
import CSS from './style.scss';

const BlendleReasons = ({ surpriseImage }) => (
  <div className={CSS.reasons}>
    <div className={`${CSS.reason} ${CSS.interests}`}>
      <div className={CSS.illustrationContainer}>
        <img
          role="presentation"
          src="/img/illustrations/premium/hearts_square.png"
          className={CSS.illustration}
        />
      </div>
      <span className={CSS.title}>De verhalen die bij je passen</span>
      <span className={CSS.description}>
        Op basis van je interesses zetten we elke dag de beste stukken op een rij. Hoef je zelf niet
        meer te zoeken.
      </span>
    </div>
    <div className={`${CSS.reason} ${CSS.surprise}`}>
      <div className={CSS.illustrationContainer}>
        <img role="presentation" src={surpriseImage} className={CSS.illustration} />
      </div>
      <span className={CSS.title}>En de verhalen die je verrassen</span>
      <span className={CSS.description}>
        Zo af en toe trekken we ons bewust niks aan van je voorkeuren. Dan verrassen we je met iets
        nieuws.
      </span>
    </div>
    <div className={`${CSS.reason} ${CSS.price}`}>
      <div className={CSS.illustrationContainer}>
        <img
          role="presentation"
          src="/img/illustrations/premium/champagne_square.png"
          className={CSS.illustration}
        />
      </div>
      <span className={CSS.title}>Voor één vaste prijs</span>
      <span className={CSS.description}>
        Niet meer per artikel betalen. Elke dag 20 topverhalen voor een vast bedrag. Stopzetten kan
        wanneer je wilt.
      </span>
    </div>
  </div>
);

BlendleReasons.propTypes = {
  surpriseImage: PropTypes.string,
};

BlendleReasons.defaultProps = {
  surpriseImage: '/img/illustrations/premium/present_square.png',
};

export default BlendleReasons;



// WEBPACK FOOTER //
// ./src/js/app/modules/subscription/components/PremiumSubscriptionPage/BlendleReasons/index.js