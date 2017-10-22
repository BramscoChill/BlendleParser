import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import TweetEmbed from 'react-tweet-embed';
import { throttle } from 'lodash';
import {
  breakLarge,
  isMobileBreakpoint,
  getViewportDimensions,
  isElementInViewport,
  elementTopScrollPosition,
} from 'helpers/viewport';
import LandingCSS from '../style.scss';
import CSS from './style.scss';

class LandingTweets extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
  };

  constructor(props) {
    super(props);

    this.state = { translateXPercentage: 0 };
  }

  componentDidMount() {
    this._setViewportDimensionsToState();

    window.addEventListener('resize', this._setViewportDimensionsToState);
    window.addEventListener('scroll', throttle(this._scrollTweets, 100));
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this._setViewportDimensionsToState);
    window.removeEventListener('scroll', this._scrollTweets);
  }

  _scrollTweets = () => {
    if (!this._container) {
      return;
    }

    const { viewport, isMobile } = this.state;
    const containerTop = elementTopScrollPosition(this._container);
    const inViewport = isElementInViewport(this._container, viewport.height);

    if (!inViewport || isMobile) {
      if (this.state.translateXPercentage) {
        this.setState({ translateXPercentage: 0 });
      }
    } else {
      this.setState({
        translateXPercentage: this._getTranslatePercentage(containerTop),
      });
    }
  };

  _getTranslatePercentage = (containerTop) => {
    const { viewport } = this.state;
    /*
     * "Padding" for viewport so the calculation starts when it scrolled 100 or 150px into view
     */
    const heightAdjustment = viewport.width > breakLarge ? 100 : 150;
    const viewPortHeightAdjusted = viewport.height - heightAdjustment;
    /*
     * Add "padding" to the scroll top position of container
     * also make it a positive number by adding the viewport height
     */
    const containerTopAdjusted = containerTop - heightAdjustment + viewport.height;
    const precentageIntoView = (containerTopAdjusted / (viewPortHeightAdjusted * 2) * 100).toFixed(
      1,
    );

    /*
     * minus 100 because it's negative margin
     * minus 10 because it looks and feels better
     */
    return precentageIntoView - 110;
  };

  _setViewportDimensionsToState = () => {
    this.setState({
      viewport: getViewportDimensions(),
      isMobile: isMobileBreakpoint(),
    });
  };

  render() {
    const { className } = this.props;
    const tweetsContainerClasses = classNames(className, CSS.tweetsContainer);
    const tweetOptions = {
      // https://dev.twitter.com/web/embedded-tweets/parameters
      cards: 'hidden',
      conversation: 'none',
      lang: 'nl',
      dnd: true,
    };

    return (
      <section
        className={tweetsContainerClasses}
        ref={(c) => {
          this._container = c;
        }}
      >
        <div className={LandingCSS.sectionInner}>
          <div>
            <h1 className={CSS.sectionTitle}>Een paar verliefde lezers</h1>
            <span className={CSS.sub}>(en dat zijn er inmiddels meer dan 1 miljoen)</span>
          </div>
          <img
            className={CSS.heartsIcon}
            role="presentation"
            src="/img/illustrations/premium/hearts.png"
            srcSet="/img/illustrations/premium/hearts@2x.png 2x"
            width="179"
            height="124"
          />
          <div className={CSS.tweets}>
            {/* Should animate translateX from 0 to -100% */}
            <ul
              className={CSS.tweetsList}
              style={{
                transform: `translateX(${this.state.translateXPercentage}%)`,
              }}
              ref={(c) => {
                this._tweetsList = c;
              }}
            >
              <li className={CSS.tweet}>
                <TweetEmbed id="819442883178676224" options={tweetOptions} />
              </li>
              <li className={CSS.tweet}>
                <TweetEmbed id="819443264986247168" options={tweetOptions} />
              </li>
              <li className={CSS.tweet}>
                <TweetEmbed id="819453118610108416" options={tweetOptions} />
              </li>
              <li className={CSS.tweet}>
                <TweetEmbed id="819452034705485824" options={tweetOptions} />
              </li>
            </ul>
          </div>
        </div>
      </section>
    );
  }
}

export default LandingTweets;



// WEBPACK FOOTER //
// ./src/js/app/modules/premiumSignup/components/PremiumLanding/LandingTweets/index.js