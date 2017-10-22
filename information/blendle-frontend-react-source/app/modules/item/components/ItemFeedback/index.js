import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { translateElement } from 'instances/i18n';
import classNames from 'classnames';
import CSS from './ItemFeedback.scss';

const onClickLink = callback => (event) => {
  if (event.target.nodeName === 'A') {
    callback(event);
  }
};

class ItemFeedback extends PureComponent {
  static propTypes = {
    onDislike: PropTypes.func.isRequired,
    onRevertDislike: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
    success: PropTypes.bool.isRequired,
  };

  _renderStatus() {
    const { success, onRevertDislike, onDislike } = this.props;

    if (success) {
      return translateElement(
        <span role="presentation" onClick={onClickLink(onRevertDislike)} />,
        'swap.reader.state_success',
      );
    }

    return translateElement(
      <span role="presentation" onClick={onClickLink(onDislike)} />,
      'swap.reader.state_initial',
    );
  }

  render() {
    const feedbackClassName = classNames(CSS.itemFeedback, CSS.centered, {
      [CSS.isLoading]: this.props.loading,
    });

    return (
      <div className={feedbackClassName} data-test-identifier="feedback">
        {this._renderStatus()}
      </div>
    );
  }
}

export default ItemFeedback;



// WEBPACK FOOTER //
// ./src/js/app/modules/item/components/ItemFeedback/index.js