import React, { PureComponent, cloneElement } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { translate } from 'instances/i18n';
import RecommendHeart from 'components/icons/RecommendHeart';
import CommentFormContainer from '../../containers/CommentFormContainer';
import CSS from './style.scss';

function generateSVGAttrs(isActive) {
  return isActive ? {} : { fill: '#fff', stroke: '#FF6255' };
}

function getParticleStyle(isActive, index) {
  if (isActive) {
    return { top: 0, left: 6 };
  }

  const delay = (index + 1) / 10;

  return {
    left: Math.ceil(Math.random() * 200 - 100),
    top: Math.ceil(Math.random() * -70 - 200),
    transitionDelay: `${delay}s`,
    animationDelay: `${delay}s`,
  };
}

class RecommendButtonNew extends PureComponent {
  static propTypes = {
    active: PropTypes.bool.isRequired,
    onToggle: PropTypes.func.isRequired,
    className: PropTypes.string,
    postCount: PropTypes.number,
  };

  state = {
    active: this.props.active,
    count: this.props.postCount,
  };

  componentWillMount() {
    this._generateHeartParticles();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.active !== nextProps.active) {
      // Override state after optimistic update
      this.setState({ active: nextProps.active });
    }

    if (this.props.postCount !== nextProps.postCount) {
      // Override state after optimistic update
      this.setState({ count: nextProps.postCount });
    }
  }

  _generateHeartParticles = () => {
    this._particles = Array.from(Array(8)).map(
      (_particle, index) => <RecommendHeart className={CSS.particle} key={`particle-${index}`} />, // eslint-disable-line react/no-array-index-key, max-len
    );
  };

  _applyParticleStyles = (isActive) => {
    this._particles = this._particles.map((particle, index) => {
      const style = getParticleStyle(isActive, index);
      const className = classNames(CSS.particle, {
        [CSS.particleFade]: !isActive,
      });

      return cloneElement(particle, { style, className });
    });
  };

  _onToggle = (e) => {
    e.preventDefault();

    const { active, count } = this.state;

    // Optimistic update to instantly trigger animation and counter
    this._applyParticleStyles(active);
    this.setState({
      active: !active,
      count: active ? count - 1 : count + 1,
    });

    setTimeout(this.props.onToggle, 1000);
  };

  render() {
    const { active, count } = this.state;
    const punctuation = active ? '!' : '?';
    const counter = count > 0 ? <strong className={CSS.counter}>{count}</strong> : null;
    const buttonClasses = classNames(CSS.button, {
      [CSS.buttonActive]: active,
    });

    return (
      <div className={classNames(CSS.section, this.props.className)}>
        <h3 className={CSS.title}>{translate('recommend.button') + punctuation}</h3>
        <button
          className={buttonClasses}
          onClick={this._onToggle}
          data-test-identifier="recommend-button"
        >
          <RecommendHeart className={CSS.heart} {...generateSVGAttrs(active)} />
          {this._particles}
        </button>
        <br />
        {counter}
        <ReactCSSTransitionGroup
          transitionAppear
          transitionName="comment-form"
          transitionEnterTimeout={0}
          transitionAppearTimeout={0}
          transitionLeaveTimeout={150}
        >
          <CommentFormContainer />
        </ReactCSSTransitionGroup>
      </div>
    );
  }
}

export default RecommendButtonNew;



// WEBPACK FOOTER //
// ./src/js/app/modules/item/components/RecommendButtonNew/index.js