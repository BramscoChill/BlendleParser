import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { translate } from 'instances/i18n';

class RecommendCount extends PureComponent {
  static propTypes = {
    amount: PropTypes.number.isRequired,
  };

  render() {
    const { amount } = this.props;

    return (
      <div className="v-like" aria-label={translate('recommendation.count', [amount])}>
        {amount}
      </div>
    );
  }
}

export default RecommendCount;



// WEBPACK FOOTER //
// ./src/js/app/components/RecommendCount.js