import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import formatCurrency from 'helpers/formatcurrency';
import className from 'classnames';
import { translate, translateElement } from 'instances/i18n';
import AcquireIssueTooltip from 'components/AcquireIssueTooltip';

class IssueAcquisition extends PureComponent {
  static propTypes = {
    providerName: PropTypes.string.isRequired,
    percentage: PropTypes.number.isRequired,
    price: PropTypes.string.isRequired,
    confirm: PropTypes.bool.isRequired,
    onClick: PropTypes.func.isRequired,
    acquired: PropTypes.bool.isRequired,
    hideButton: PropTypes.bool.isRequired,
    onCloseTooltip: PropTypes.func.isRequired,
    showTooltip: PropTypes.bool.isRequired,
  };

  componentDidMount() {
    const context = this._canvas.getContext('2d');
    const canvasWidth = 55;

    this._canvas.width = canvasWidth * 2;
    this._canvas.height = canvasWidth * 2;
    this._canvas.style.width = `${canvasWidth}px`;
    this._canvas.style.height = `${canvasWidth}px`;

    context.scale(2, 2);

    context.lineCap = 'square';
    context.lineWidth = 4.0;
    this._drawProgressCircle();
  }

  componentDidUpdate() {
    this._drawProgressCircle();
  }

  _drawProgressCircle() {
    const { percentage } = this.props;

    const context = this._canvas.getContext('2d');
    const radius = 27.5;
    const border = 4;
    const circ = Math.PI * 2;
    const quart = Math.PI / 2;

    context.clearRect(0, 0, radius * 2, radius * 2);

    // Draw grey background circle
    context.strokeStyle = '#eaeaea';
    context.beginPath();
    context.arc(radius, radius, radius - border / 2, -quart, circ - quart, false);
    context.stroke();

    if (percentage > 0) {
      context.strokeStyle = '#20C576';

      context.beginPath();
      context.arc(radius, radius, radius - border / 2, -quart, circ * percentage - quart, false);
      context.stroke();
    }
  }

  _renderButton() {
    if (this.props.acquired || this.props.hideButton) {
      return null;
    }

    const formattedPrice = formatCurrency(Math.max(0, this.props.price));

    const classname = className('btn btn-acquire btn-text', { 's-confirm': this.props.confirm });

    return (
      <button className={classname}>
        <span className="acquire">{translate('app.buttons.acquire_issue_mobile')}</span>
        <span className="confirm">
          {translateElement('app.buttons.confirm_acquire_issue', [formattedPrice])}
        </span>
      </button>
    );
  }

  _renderText() {
    if (!this.props.acquired) {
      return <div className="purchase-issue">{translate('item.text.purchase_issue')}</div>;
    }

    return null;
  }

  _renderTooltip() {
    if (this.props.showTooltip) {
      return (
        <div className="acquire-issue-tooltip">
          <AcquireIssueTooltip onClose={this.props.onCloseTooltip} />
        </div>
      );
    }

    return null;
  }

  render() {
    const formattedPrice = formatCurrency(Math.max(0, this.props.price));

    const classname = className('v-acquire-issue', { 's-acquired': this.props.acquired });

    return (
      <div className="v-issue-acquisition-card">
        <div className={classname}>
          {this._renderText()}
          <div className="acquire-button" onClick={this.props.onClick}>
            <div className="progress">
              <canvas
                ref={(c) => {
                  this._canvas = c;
                }} // eslint-disable-line brace-style
                className="progress-circle"
              />
              <p className="price">
                <span>{formattedPrice}</span>
              </p>
            </div>
            {this._renderButton()}
          </div>
          {this._renderTooltip()}
        </div>
      </div>
    );
  }
}

export default IssueAcquisition;



// WEBPACK FOOTER //
// ./src/js/app/modules/issue/components/IssueAcquisition.js