import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ShareContainer from '../../containers/ShareContainer';
import CuratorShareContainer from '../../containers/CuratorShareContainer';
import RefundItemContainer from '../../containers/RefundItemContainer';
import FeedbackContainer from '../../containers/FeedbackContainer';
import ProviderSubscriptionContainer from '../../containers/ProviderSubscriptionContainer';
import SuggestionSectionsContainer from '../../containers/SuggestionSectionsContainer';
import EntitiesContainer from '../../containers/EntitiesContainer';
import CSS from './style.scss';

export default class ArticleFooter extends PureComponent {
  static propTypes = {
    itemId: PropTypes.string.isRequired,
  };

  render() {
    const { itemId } = this.props;

    return (
      <div>
        <EntitiesContainer />
        <div className={CSS.articleFooter}>
          <ShareContainer />
          <CuratorShareContainer itemId={itemId} />
          <RefundItemContainer itemId={itemId} />
          <FeedbackContainer itemId={itemId} />
          <ProviderSubscriptionContainer itemId={itemId} />
        </div>
        <SuggestionSectionsContainer itemId={itemId} />
      </div>
    );
  }
}



// WEBPACK FOOTER //
// ./src/js/app/modules/item/components/ArticleFooter/index.js