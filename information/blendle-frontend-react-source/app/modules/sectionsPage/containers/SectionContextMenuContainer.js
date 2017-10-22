import altConnect from 'higher-order-components/altConnect';
import { compose, withHandlers, branch, renderNothing, lifeCycle } from 'recompose';
import { memoize } from 'lodash';
import Analytics from 'instances/analytics';
import { translate } from 'instances/i18n';
import NotificationsActions from 'actions/NotificationsActions';
import ChannelsStore from 'stores/ChannelsStore';
import AuthStore from 'stores/AuthStore';
import ProviderStore from 'stores/ProviderStore';
import FavoriteProvidersStore from 'stores/FavoriteProvidersStore';
import FavoriteProvidersActions from 'actions/FavoriteProvidersActions';
import { getById as getChannelById } from 'selectors/channels';
import { providerById as getProviderById } from 'selectors/providers';
import UserPrefsUpdatedNotification from 'components/notifications/UserPrefsUpdatedNotification';
import { STATUS_OK, STAFFPICKS_CHANNELS } from 'app-constants';
import {
  CONTEXT_MENU_ACTION_UNFOLLOW_CHANNEL,
  CONTEXT_MENU_ACTION_FOLLOW_CHANNEL,
  CONTEXT_MENU_ACTION_UNFOLLOW_PROVIDER,
  CONTEXT_MENU_ACTION_FOLLOW_PROVIDER,
  SECTION_TYPE_CHANNEL,
  SECTION_TYPE_PROVIDER,
  SECTION_TYPE_EDITORIAL,
} from '../constants';
import SectionContextMenuActions from '../actions/SectionContextMenuActions';
import SectionsPageStore from '../stores/SectionsPageStore';
import SectionContextMenu from '../components/SectionContextMenu';

function isStaffpicksChannel(channelId) {
  return STAFFPICKS_CHANNELS.includes(channelId);
}

function getChannelOptions(channel) {
  const isFollowing = channel.get('following');
  const channelId = channel.id;

  // Disable follow/unfollow of staffpicks channels
  if (isStaffpicksChannel(channelId)) {
    return [];
  }

  if (isFollowing) {
    return [
      {
        action: CONTEXT_MENU_ACTION_UNFOLLOW_CHANNEL,
        label: translate('sections.dropdown_options.unfollow', [channel.get('full_name')]),
        payload: {
          channelId,
          isFollowing,
        },
      },
    ];
  }

  return [
    {
      action: CONTEXT_MENU_ACTION_FOLLOW_CHANNEL,
      label: translate('sections.dropdown_options.follow', [channel.get('full_name')]),
      payload: {
        channelId,
        isFollowing,
      },
    },
  ];
}

function getProviderOptions(provider, favoriteProviders) {
  const providerId = provider.id;
  const isFollowing = favoriteProviders.includes(providerId);

  if (isFollowing) {
    return [
      {
        action: CONTEXT_MENU_ACTION_UNFOLLOW_PROVIDER,
        label: translate('sections.dropdown_options.unfollow', [provider.name]),
        payload: {
          providerId,
          isFollowing,
        },
      },
    ];
  }

  return [
    {
      action: CONTEXT_MENU_ACTION_FOLLOW_PROVIDER,
      label: translate('sections.dropdown_options.follow', [provider.name]),
      payload: {
        providerId,
        isFollowing,
      },
    },
  ];
}

function getDefaultAnalyticsPayload(section) {
  return {
    internal_location: 'timeline/premium',
    location_in_layout: 'sections',
    section_id: section.id,
    section_type: section.type,
  };
}

function mapStateToProps(
  { sectionsPageState: { sections }, channelsState, providerState, favoriteProvidersState },
  { id: sectionId },
) {
  const section = sections.get(sectionId);

  // Eventually there'll probably be some default options for each section
  let options = [];
  if (section.type === SECTION_TYPE_CHANNEL) {
    const channelId = section.channel.id;
    const channel = getChannelById(channelsState, channelId);
    options = channel ? getChannelOptions(channel) : options;
  }

  if (section.type === SECTION_TYPE_PROVIDER && favoriteProvidersState.status === STATUS_OK) {
    const providerId = section.provider.id;
    const provider = getProviderById(providerState, providerId);
    options = provider ? getProviderOptions(provider, favoriteProvidersState.favorites) : options;
  }

  if (section.type === SECTION_TYPE_EDITORIAL) {
    options = [];
  }

  return { options };
}

mapStateToProps.stores = {
  SectionsPageStore,
  ChannelsStore,
  ProviderStore,
  FavoriteProvidersStore,
};

const memoizeFetchFavoriteProviders = memoize((userId) => {
  FavoriteProvidersActions.fetchFavoriteProviders.defer(userId);
});

const enhance = compose(
  lifeCycle({
    componentDidMount: () => {
      // We only want to fetch the favorites if they haven't been fetched before. Otherwise each
      // section will send the same request.
      memoizeFetchFavoriteProviders(AuthStore.getState().user.id);
    },
  }),
  withHandlers({
    onClickDropdownOption: ({ id: sectionId }) => option => () => {
      const action = option.action;
      const notificationId = `section-pref-${sectionId}-${action}-${Date.now()}`;
      const notificationProps = {
        onClick: () => NotificationsActions.hideNotification(notificationId),
      };

      const { sections } = SectionsPageStore.getState();
      const section = sections.get(sectionId);

      SectionContextMenuActions.onClickOption(
        AuthStore.getState().user.id,
        option,
        getDefaultAnalyticsPayload(section),
      );

      NotificationsActions.showNotification(
        UserPrefsUpdatedNotification,
        notificationProps,
        notificationId,
        {
          delay: 100,
          duration: 3000,
        },
      );
    },
    onToggleDropdown: ({ id: sectionId }) => (isOpened) => {
      const eventName = `Section Dropdown ${isOpened ? 'Opened' : 'Closed'}`;

      const { sections } = SectionsPageStore.getState();
      const section = sections.get(sectionId);

      Analytics.track(eventName, getDefaultAnalyticsPayload(section));
    },
  }),
  altConnect(mapStateToProps),
  branch(({ options }) => options.length === 0, renderNothing),
);

export default enhance(SectionContextMenu);



// WEBPACK FOOTER //
// ./src/js/app/modules/sectionsPage/containers/SectionContextMenuContainer.js