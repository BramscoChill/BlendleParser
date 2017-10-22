import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import withRouter from 'react-router/lib/withRouter';
import Loading from 'components/Loading';
import ItemMetaContainer from '../../containers/ItemMetaContainer';
import ProgressBarContainer from '../../containers/ProgressBarContainer';
import TopBarContainer from '../../containers/TopBarContainer';
import ArticleFooterContainer from '../../containers/ArticleFooterContainer';
import StickySharingContainer from '../../containers/StickySharingContainer';
import RestoreReadingProgressContainer from '../../containers/RestoreReadingProgressContainer';
import JustEnoughBalanceContainer from '../../containers/JustEnoughBalanceContainer';
import PremiumAlmostExpiredContainer from '../../containers/PremiumAlmostExpiredContainer';
import PremiumTrialEndedDialogContainer from '../../containers/PremiumTrialEndedDialogContainer';
import GetPremiumBannerContainer from '../../containers/GetPremiumBannerContainer';
import ImageZoomContainer from '../../containers/ImageZoomContainer';
import SignUpRewardDialogContainer from '../../containers/SignUpRewardDialogContainer';
import ContentBody from '../ContentBody';
import ItemWarning from '../ItemWarning';
import ItemLoading from '../ItemLoading';
import CSS from './styles.scss';

class Reader extends PureComponent {
  static propTypes = {
    content: PropTypes.object,
    dialog: PropTypes.node,
    itemId: PropTypes.string.isRequired,
    paragraphsMeasured: PropTypes.func.isRequired,
    isLoading: PropTypes.bool,
    isContentReady: PropTypes.bool,
  };

  render() {
    const { content, dialog, isContentReady, isLoading, itemId, paragraphsMeasured } = this.props;

    return (
      <div className={CSS.item}>
        <ProgressBarContainer />
        <TopBarContainer />
        <div className={CSS.scrollable} data-test-identifier="scroller">
          <ItemLoading itemId={itemId} isLoading={isLoading} />
          {!isLoading && [
            <ItemMetaContainer key="item-meta" />,
            <ContentBody
              content={content}
              paragraphsMeasured={paragraphsMeasured}
              isContentReady={isContentReady}
              beforeLastParagraphContent={<GetPremiumBannerContainer />}
              key="ContentBody"
            />,
            !isContentReady && <Loading key="article-content-loading" className={CSS.loadMore} />,
          ]}
          {isContentReady && [
            <RestoreReadingProgressContainer key="restore-reading-progress" />,
            <ArticleFooterContainer key="ArticleFooterContainer" />,
          ]}
        </div>
        {!isLoading && [
          <SignUpRewardDialogContainer key="SignUpRewardDialogContainer" />,
          <StickySharingContainer key="StickySharingContainer" />,
        ]}
        <JustEnoughBalanceContainer />
        <PremiumAlmostExpiredContainer />
        <PremiumTrialEndedDialogContainer />
        <ImageZoomContainer />
        <ItemWarning />
        {dialog}
      </div>
    );
  }
}

export default withRouter(Reader);



// WEBPACK FOOTER //
// ./src/js/app/modules/item/components/Reader/index.js