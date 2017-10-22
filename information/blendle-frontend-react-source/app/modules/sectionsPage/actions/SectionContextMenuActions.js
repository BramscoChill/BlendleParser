import alt from 'instances/altInstance';
import ChannelActions from 'actions/ChannelActions';
import FavoriteProvidersActions from 'actions/FavoriteProvidersActions';
import {
  CONTEXT_MENU_ACTION_UNFOLLOW_CHANNEL,
  CONTEXT_MENU_ACTION_FOLLOW_CHANNEL,
  CONTEXT_MENU_ACTION_UNFOLLOW_PROVIDER,
  CONTEXT_MENU_ACTION_FOLLOW_PROVIDER,
} from '../constants';

class SectionContextMenuActions {
  onClickOption = (userId, option, analytics = {}) => {
    const { action, payload } = option;

    switch (action) {
      case CONTEXT_MENU_ACTION_UNFOLLOW_CHANNEL:
      case CONTEXT_MENU_ACTION_FOLLOW_CHANNEL:
        ChannelActions.followChannel(userId, payload.channelId, !payload.isFollowing, analytics);
        break;
      case CONTEXT_MENU_ACTION_UNFOLLOW_PROVIDER:
      case CONTEXT_MENU_ACTION_FOLLOW_PROVIDER:
        FavoriteProvidersActions.favoriteProvider(
          userId,
          payload.providerId,
          !payload.isFollowing,
          analytics,
        );
        break;
      default:
        break;
    }

    return action;
  };
}

export default alt.createActions(SectionContextMenuActions);



// WEBPACK FOOTER //
// ./src/js/app/modules/sectionsPage/actions/SectionContextMenuActions.js