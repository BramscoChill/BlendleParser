import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import ConfettiPart from './ConfettiPart';

class Confetti extends React.Component {
  static propTypes = {
    children: PropTypes.array,
    className: PropTypes.string,
  };

  componentDidMount() {
    this.confetti();
  }

  componentWillUnmount() {
    window.cancelAnimationFrame(this.requestId);
    this.orientationWatch.removeListener(this.orientationWatchListener);
  }

  orientationWatchListener = () => {
    this.canvasW = this.canvas.width = this.canvas.scrollWidth;
    this.canvasH = this.canvas.height = this.canvas.scrollHeight;
  };

  confetti = () => {
    const context = this.canvas.getContext('2d');
    const NUM_CONFETTI = 50;
    const confetti = [];

    this.orientationWatchListener();
    this.orientationWatch = window.matchMedia('(orientation: portrait)');
    this.orientationWatch.addListener(this.orientationWatchListener);

    for (let i = 0; i < NUM_CONFETTI; i++) {
      confetti.push(new ConfettiPart(this));
    }

    const step = () => {
      context.clearRect(0, 0, this.canvasW, this.canvasH);
      for (let i = 0; i < NUM_CONFETTI; i++) {
        const c = confetti[i];
        c.draw(context);
      }
      this.requestId = window.requestAnimationFrame(step);
    };

    this.requestId = window.requestAnimationFrame(step);
  };

  render() {
    const confettiClassNames = classNames('c-confetti', {
      [this.props.className]: this.props.className,
    });

    return (
      <div>
        <canvas
          className={confettiClassNames}
          ref={(c) => {
            this.canvas = c;
          }}
        />
        {this.props.children}
      </div>
    );
  }
}

export default Confetti;



// WEBPACK FOOTER //
// ./src/js/app/components/Confetti/Confetti.js