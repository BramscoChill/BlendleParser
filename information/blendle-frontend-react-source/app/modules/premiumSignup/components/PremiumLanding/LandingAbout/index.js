import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { throttle } from 'lodash';
import Analytics from 'instances/analytics';
import googleAnalytics from 'instances/google_analytics';
import Scroll from 'helpers/scroll';
import { getViewportDimensions, isElementInViewport } from 'helpers/viewport';
import { track } from 'helpers/premiumOnboardingEvents';
import { getCustomCopy } from 'helpers/affiliates';
import { setLocationInLayout } from 'helpers/locationInLayout';
import AppStoreButton from 'components/buttons/AppStoreButton';
import PlayStoreButton from 'components/buttons/PlayStoreButton';
import Link from 'components/Link';
import LandingCSS from '../style.scss';
import CSS from './style.scss';

function scrollToSection(e) {
  const sectionId = e.currentTarget.href.split('#')[1];

  if (sectionId === null) {
    return;
  }

  e.preventDefault();
  Scroll.verticalToId(sectionId);
}

function onCtaButtonClick() {
  setLocationInLayout('about');
  track(Analytics, 'Open Dialogue');
  googleAnalytics.trackEvent(window.location.pathname, 'button', 'probeer een week gratis');
}

class LandingHeader extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    ctaUrl: PropTypes.string.isRequired,
    affiliate: PropTypes.object,
  };

  constructor(props) {
    super(props);

    this.state = { isVisible: false };
  }

  componentDidMount() {
    this._setViewportDimensionsToState();

    window.addEventListener('resize', this._setViewportDimensionsToState);
    window.addEventListener('scroll', throttle(this._detectInViewportChange, 100));
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this._setViewportDimensionsToState);
    window.removeEventListener('scroll', this._detectInViewportChange);
  }

  _detectInViewportChange = () => {
    const { viewport, isVisible } = this.state;

    if (isVisible) {
      window.removeEventListener('scroll', this._detectInViewportChange);
    }

    if (!this._container || isVisible) {
      return;
    }

    this.setState({ isVisible: isElementInViewport(this._container, viewport.height) });
  };

  _setViewportDimensionsToState = () => {
    this.setState({ viewport: getViewportDimensions() });
  };

  _renderCTA() {
    const animationClass = { [LandingCSS.slideUp]: this.state.isVisible };
    const ctaClasses = classNames('btn', LandingCSS.cta, CSS.cta, animationClass);
    const affiliateCopy = getCustomCopy('about', this.props.affiliate).cta;

    if (affiliateCopy) {
      const url = `/getpremium/actie/${this.props.affiliate.name}#topbanner`;
      return (
        <Link className={ctaClasses} href={url} onClick={scrollToSection}>
          {affiliateCopy}
        </Link>
      );
    }

    return (
      <Link className={ctaClasses} href={this.props.ctaUrl} onClick={onCtaButtonClick}>
        Bekijk jouw selectie
      </Link>
    );
  }

  _renderAppButtons() {
    if (this.props.affiliate) {
      return null;
    }

    const animationClass = { [LandingCSS.slideUp]: this.state.isVisible };

    return (
      <div className={classNames(animationClass)}>
        <AppStoreButton
          className={CSS.storeLink}
          onClick={() =>
            googleAnalytics.trackEvent(window.location.pathname, 'button', 'content_appstore')}
        />
        <PlayStoreButton
          className={CSS.storeLink}
          onClick={() =>
            googleAnalytics.trackEvent(window.location.pathname, 'button', 'content_googleplay')}
        />
      </div>
    );
  }

  render() {
    const { className } = this.props;
    const animationClass = { [LandingCSS.slideUp]: this.state.isVisible };
    const timelineAnimationClass = { [CSS.scrollTimeline]: this.state.isVisible };

    return (
      <section id="about" className={classNames(className, CSS.about)}>
        <div
          ref={(c) => {
            this._container = c;
          }}
        >
          <h1 className={classNames(CSS.sectionTitle, animationClass)}>Wat je krijgt</h1>
          <div className={LandingCSS.sectionInner}>
            <img
              alt="Blendle editors"
              src="https://assets.blendleimg.com/img/backgrounds/landing_editors.jpg?auto=format"
              srcSet="https://assets.blendleimg.com/img/backgrounds/landing_editors.jpg?auto=format 1x, https://assets.blendleimg.com/img/backgrounds/landing_editors@2x.jpg?auto=format 2x"
              className={classNames(CSS.landingPhoto, animationClass)}
            />
            <div className={classNames(CSS.aboutCopy, animationClass)}>
              <h2 className={classNames(CSS.title, animationClass)}>
                De verhalen die bij je passen
              </h2>
              <p className={classNames(CSS.text, animationClass)}>
                Elke ochtend lezen we alle kranten en tijdschriften. Op basis van je interesses
                zetten we de beste verhalen voor je op een rij.
              </p>
              <p className={classNames(CSS.text, animationClass)}>
                Hoef je zelf niet meer te zoeken.
              </p>
              {this._renderCTA()}
            </div>
          </div>
        </div>
        <div className={CSS.secondAboutSection}>
          <div className={classNames(CSS.mobileTimeline, timelineAnimationClass)}>
            <img src="/img/backgrounds/iphone@2x.png" alt="Blendle timeline" />
          </div>
          <div className={LandingCSS.sectionInner}>
            <div className={`${CSS.aboutCopy}`}>
              <h2 className={classNames(CSS.title, animationClass)}>
                De verhalen die je verrassen
              </h2>
              <p className={classNames(CSS.text, animationClass)}>
                Zo af en toe trekken we ons bewust niks aan van je voorkeuren. Dan verrast onze
                redactie je met iets wat je anders had gemist.
              </p>
              <p className={classNames(CSS.text, animationClass)}>Doei filterbubbel.</p>
              {this._renderAppButtons()}
            </div>
          </div>
        </div>
      </section>
    );
  }
}

export default LandingHeader;



// WEBPACK FOOTER //
// ./src/js/app/modules/premiumSignup/components/PremiumLanding/LandingAbout/index.js