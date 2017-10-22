import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import CSS from './style.scss';

const randomSize = () => `${Math.floor(Math.random() * 3) + 10}px`;

const randomColor = colors => colors[Math.floor(Math.random() * colors.length)];

const randomPosition = width => `${Math.floor(Math.random() * width)}px`;

const randomAnimation = animations => animations[Math.floor(Math.random() * animations.length)];

export default class Confetti extends Component {
  static propTypes = {
    limit: PropTypes.number,
    colors: PropTypes.array,
    children: PropTypes.any,
  };

  static defaultProps = {
    limit: Infinity,
    colors: ['#43D6E0', '#FFD338', '#24CF6B', '#D52676'],
  };

  constructor(props) {
    super(props);

    this.state = {
      particles: [],
    };
  }

  componentDidMount() {
    this._startConfetti();
  }

  componentWillUnmount() {
    this._stopConfetti();
  }

  _startConfetti() {
    this._count = 0;
    const width = this._el.offsetWidth;

    this._confettiInterval = setInterval(() => {
      this._count++;

      if (this._count > this.props.limit) {
        return this._stopConfetti();
      }

      return this.setState({
        particles: [
          ...this.state.particles,
          {
            index: this.state.particles.length,
            size: randomSize(),
            color: randomColor(this.props.colors),
            position: randomPosition(width),
            animation: randomAnimation(['slow', 'medium', 'fast']),
          },
        ],
      });
    }, 5);
  }

  _stopConfetti() {
    clearInterval(this._confettiInterval);
  }

  _renderParticles(particles) {
    return particles.filter(({ index }) => index > particles.length - 200).map((particle) => {
      const particleStyle = {
        left: particle.position,
        width: particle.size,
        height: particle.size,
        background: particle.color,
      };

      const className = classNames(CSS.confettiParticle, CSS[particle.animation]);

      return <div key={particle.index} style={particleStyle} className={className} />;
    });
  }

  render() {
    return (
      <div>
        {this.props.children}
        <div className={CSS.confettiContainer} ref={el => (this._el = el)}>
          {this._renderParticles(this.state.particles)}
        </div>
      </div>
    );
  }
}



// WEBPACK FOOTER //
// ./src/js/app/components/SquareConfetti/index.js