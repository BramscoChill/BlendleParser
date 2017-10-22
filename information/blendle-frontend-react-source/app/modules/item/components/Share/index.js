import React from 'react';
import classNames from 'classnames';
import SharingButtonsContainer from '../../containers/SharingButtonsContainer';
import RecommendButtonContainer from '../../containers/RecommendButtonContainer';
import SharedByOthersContainer from '../../containers/SharedByOthersContainer';
import CSS from './Share.scss';

const Share = () => {
  const className = classNames(CSS.share, CSS.withSharingButtonHeart);

  return (
    <div className={className}>
      <RecommendButtonContainer />
      <div className={CSS.sharedByOthers}>
        <SharedByOthersContainer />
      </div>
      <SharingButtonsContainer />
    </div>
  );
};

export default Share;



// WEBPACK FOOTER //
// ./src/js/app/modules/item/components/Share/index.js