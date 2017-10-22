import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import CSS from './style.scss';

class StepsPanel extends React.Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    stepIndicatorContainerClassName: PropTypes.string,
    stepIndicatorClassName: PropTypes.string,
    activeStepIndicatorClassName: PropTypes.string,
    activeStepIndex: PropTypes.number,
    activeClassName: PropTypes.string,
    showStepIndicator: PropTypes.bool,
  };

  static defaultProps = {
    activeStepIndex: 0,
    showStepIndicator: true,
  };

  _renderStepsIndicator() {
    if (!this.props.showStepIndicator) {
      return null;
    }

    const containerClasses = classNames(
      CSS.stepIndicatorContainer,
      this.props.stepIndicatorContainerClassName,
    );

    return (
      <div className={containerClasses}>
        {React.Children.map(this.props.children, (child, index) => {
          const { stepIndicatorClassName, activeStepIndicatorClassName } = this.props;
          const className = classNames(CSS.stepIndicator, stepIndicatorClassName, {
            [CSS.active]: index === this.props.activeStepIndex,
            [activeStepIndicatorClassName]: index === this.props.activeStepIndex,
          });

          return <span className={className} />;
        })}
      </div>
    );
  }

  _renderSteps() {
    return React.Children.map(this.props.children, (child, index) => {
      const isActive = this.props.activeStepIndex === index;

      return React.cloneElement(child, {
        style: {
          ...child.style,
        },
        className: classNames(child.props.className, CSS.step, {
          [this.props.activeClassName]: this.props.activeClassName && isActive,
          [CSS.active]: isActive,
        }),
      });
    });
  }

  render() {
    return (
      <div className={classNames(this.props.className, CSS.stepsContainer)}>
        {this._renderSteps()}
        {this._renderStepsIndicator()}
      </div>
    );
  }
}

export default StepsPanel;



// WEBPACK FOOTER //
// ./src/js/app/components/StepsPanel/index.js