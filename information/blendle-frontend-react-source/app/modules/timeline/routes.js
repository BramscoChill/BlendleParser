import React from 'react';
import TimelineNavigation from './TimelineNavigationContainer';
import { createAsyncComponent } from 'helpers/routerHelpers';

const EmptyNavigation = () => <ul className="v-navigation collapsed" />;

const AsyncTimelineComponent = createAsyncComponent((resolve) => {
  require.ensure(
    [],
    () => {
      resolve(require('./TimelineRouterContainer'));
    },
    'timeline',
  );
});

const AsyncModuleCallComponent = createAsyncComponent((resolve, props) => {
  require.ensure(
    [],
    () => {
      resolve(props.handler(require('./module'), props.nextState.params));
    },
    'timeline',
  );
});

function onEnter() {
  document.body.classList.add('m-timeline');
}

function onLeave() {
  document.body.classList.remove('m-timeline');
}

const routeBase = {
  module: 'timeline',
  onEnter,
  onChange: onEnter,
  onLeave,
};

function timelineRoute(path, navigation, dialogHandler, restProps) {
  return {
    ...routeBase,
    path,
    getComponents(nextState, cb) {
      if (dialogHandler) {
        require.ensure(
          [],
          () => {
            dialogHandler(require('./module'), nextState.params);
          },
          'timeline',
        );
      }

      cb(null, {
        content: AsyncTimelineComponent,
        navigation,
        ...restProps,
      });
    },
  };
}

function collapsedNavRoute(path, contentHandler) {
  return {
    ...routeBase,
    path,
    getComponents(nextState, cb) {
      cb(null, {
        content: AsyncModuleCallComponent.bind(null, { handler: contentHandler, nextState }),
        navigation: EmptyNavigation,
      });
    },
  };
}

const openChannelsDropdownRoute = (route) => {
  let timeout;
  route.onEnter = () => {
    timeout = setTimeout(() => document.querySelector('.v-add-channel-button').click(), 500);
    onEnter();
  };

  route.onLeave = () => {
    clearTimeout(timeout);
    onLeave();
  };
  return route;
};

export default [
  timelineRoute('trending(/:details)', TimelineNavigation, null, {
    legoDialog: require('containers/dialogues/PayPerArticleWarningDialogContainer'),
  }),
  timelineRoute('following', TimelineNavigation, null, {
    legoDialog: require('containers/dialogues/PayPerArticleWarningDialogContainer'),
  }),
  timelineRoute('channel/:details', TimelineNavigation, null, {
    legoDialog: require('containers/dialogues/PayPerArticleWarningDialogContainer'),
  }),
  timelineRoute('channel/:details/followers', TimelineNavigation, (mod, params) =>
    mod.openChannelFollowersDialogue(params.details),
  ),
  timelineRoute('pins', EmptyNavigation),
  timelineRoute('_feed', EmptyNavigation),

  timelineRoute('user/:userId', EmptyNavigation),
  timelineRoute('user/:userId/items', EmptyNavigation),
  timelineRoute('user/:userId/followers', EmptyNavigation, (mod, params) =>
    mod.openUserFollowersDialogue(params.userId),
  ),
  timelineRoute('user/:userId/following', EmptyNavigation, (mod, params) =>
    mod.openUserFollowingDialogue(params.userId),
  ),
  timelineRoute('verified', TimelineNavigation, mod => mod.openVerifiedDialogue()),

  collapsedNavRoute('me(/:action)', (mod, params) => mod.rerouteAuthUser(params.action)),
  collapsedNavRoute('archive', mod => mod.rerouteAuthUser('items')),
  collapsedNavRoute('email/verify(/:token)', (mod, params) =>
    mod.openNewsletterSignUpVerify(params.token),
  ),

  openChannelsDropdownRoute(timelineRoute('channels', TimelineNavigation)),
];



// WEBPACK FOOTER //
// ./src/js/app/modules/timeline/routes.js