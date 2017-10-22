import React from 'react';
import PropTypes from 'prop-types';
import { Button, Backdrop } from '@blendle/lego';
import InitialVisibilitySensor from 'components/InitialVisibilitySensor';
import Analytics from 'instances/analytics';
import CSS from './style.scss';

function onChangeVisibility(isVisible, analytics = {}) {
  const eventName = isVisible ? 'Upsell Banner In Viewport' : 'Upsell Banner Out Of ViewPort';

  Analytics.track(eventName, analytics);
}

function onStartUpsell(analytics, onClickCta) {
  Analytics.track('Subscription Upsell Started', {
    internal_location: 'item',
    ...analytics,
  });

  onClickCta();
}

const ReaderBanner = props => (
  <InitialVisibilitySensor onChange={isVisible => onChangeVisibility(isVisible, props.analytics)}>
    <div className={CSS.container}>
      <div className={CSS.textContainer}>
        <h1 className={CSS.title}>{props.titleText}</h1>
        <p className={CSS.body}>{props.bodyText}</p>
      </div>
      <div
        className={CSS.buttonContainer}
        onClick={() => onStartUpsell(props.analytics, props.onClickCta)}
      >
        <Button color={props.ctaColor} className={CSS.button} isLoading={props.isLoading}>
          {props.ctaText}
        </Button>
      </div>
      <Backdrop.SmallBottomRight
        className={CSS.backdrop}
        color={props.backdropColor}
        innerColor={props.backdropInnerColor}
      />
    </div>
  </InitialVisibilitySensor>
);

ReaderBanner.propTypes = {
  titleText: PropTypes.string.isRequired,
  bodyText: PropTypes.string.isRequired,
  ctaText: PropTypes.string.isRequired,
  ctaColor: PropTypes.string.isRequired,
  onClickCta: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  backdropColor: PropTypes.string.isRequired,
  backdropInnerColor: PropTypes.string.isRequired,
  analytics: PropTypes.object,
};

export default ReaderBanner;



// WEBPACK FOOTER //
// ./src/js/app/modules/item/components/ReaderBanner/index.js