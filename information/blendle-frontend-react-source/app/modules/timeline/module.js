import { history } from 'byebye';
import React from 'react';
import Auth from 'controllers/auth';
import TimelineContainer from './TimelineContainer';
import DialoguesController from 'controllers/dialogues';
import { getSignUpRewards } from 'managers/signup';
import { STAFFPICKS } from 'app-constants';

function _renderTimeline(timeline) {
  const config = { name: null, options: {}, ...timeline };
  return <TimelineContainer key={JSON.stringify(timeline)} timeline={config} />;
}

function redirectTo(url) {
  setTimeout(() => {
    history.navigate(url, { trigger: true, replace: true });
  });
  return <span />;
}

export function requireAuth() {
  return !Auth.getUser();
}

export function rerouteAuthUser(action) {
  const url = ['/user', Auth.getUser().id, action].filter(path => path).join('/');
  return redirectTo(url);
}

export function openChannelFollowersDialogue(channelId) {
  DialoguesController.openUserFollowers('channel', channelId, `channel/${channelId}`);
}

export function openUserFollowersDialogue(userId) {
  DialoguesController.openUserFollowers('user', userId, `user/${userId}`);
}

export function openUserFollowingDialogue(userId) {
  DialoguesController.openUserFollowing('user', userId, `user/${userId}`);
}

/**
 * verified account dialogue. shown after a signup
 */
export function openVerifiedDialogue() {
  getSignUpRewards(Auth.getUser().id).then((rewards) => {
    DialoguesController.openUserVerified(Auth.getUser(), rewards);
  });
}

/**
 * verified account dialogue. shown after a signup
 */
export function openNewsletterSignUpVerify(token) {
  require.ensure(
    [],
    () => {
      let Container = require('modules/campaigns/NewsletterSignUpVerifyContainer');
      if (!token) {
        Container = require('modules/campaigns/NewsletterSignUpSuccessDialogue');
      }
      setTimeout(() => {
        const closeDialog = DialoguesController.openComponent(
          <Container token={token} onClose={() => closeDialog()} />,
        );
      });
    },
    'campaigns',
  );

  const staffpicksChannels = STAFFPICKS;
  const userCountry = Auth.getUser().attributes.country;
  const channelId = staffpicksChannels[userCountry] || staffpicksChannels.NL;

  return () =>
    _renderTimeline({
      name: 'channel',
      options: {
        details: channelId,
        showStaffpicksExplanation: true,
      },
    });
}



// WEBPACK FOOTER //
// ./src/js/app/modules/timeline/module.js