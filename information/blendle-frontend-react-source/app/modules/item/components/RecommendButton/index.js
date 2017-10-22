import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { translate } from 'instances/i18n';
import CommentFormContainer from '../../containers/CommentFormContainer';
import CSS from './style.scss';

class RecommendButton extends PureComponent {
  static propTypes = {
    active: PropTypes.bool.isRequired,
    onToggle: PropTypes.func.isRequired,
    className: PropTypes.string,
  };

  _onToggle = (e) => {
    e.preventDefault();
    this.props.onToggle();
  };

  render() {
    const className = classNames(
      'v-recommend-button',
      CSS.recommendButton,
      this.props.className,
      this.props.active ? 's-active' : 's-inactive',
    );

    /* eslint-disable jsx-a11y/href-no-hash, jsx-a11y/label-has-for */
    return (
      <div className={className}>
        <a
          className="btn btn-recommend"
          href="#"
          onClick={this._onToggle}
          data-test-identifier="recommend-button"
        >
          <label>{translate('recommend.button')}</label>
        </a>

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
    /* eslint-enable jsx-a11y/href-no-hash, jsx-a11y/label-has-for */
  }
}

export default RecommendButton;



// WEBPACK FOOTER //
// ./src/js/app/modules/item/components/RecommendButton/index.js