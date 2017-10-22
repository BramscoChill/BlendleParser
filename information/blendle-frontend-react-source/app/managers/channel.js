import { defaults } from 'lodash';
import axios from 'axios';
import Settings from 'controllers/settings';
import Channels from 'collections/channels';
import Channel from 'models/channel';
import UsersManager from 'managers/users';
import URI from 'urijs';

export function fetchChannels(options = {}) {
  const url = new URI(Settings.getLink('channels')).addSearch(
    defaults(options, {
      amount: 50,
    }),
  );

  const collection = new Channels(null, {
    url: url.toString(),
    parse: true,
  });

  return collection.fetch().then(() => collection);
}

/**
 * Fetch a channel, with more data
 * @return {Promise}
 */
export function fetchChannel(channelId) {
  return axios
    .get(Settings.getLink('user', { user_id: channelId }))
    .then(response => new Channel(response.data, { parse: true }));
}

/**
 * Follow channels
 * @param  {User} user
 * @param  {Collection|Array|String} channels
 * @return {Promise}
 */
export function follow(user, channels) {
  return UsersManager.followUser(user, channels);
}

/**
 * Unfollow channels
 * @param  {User} user
 * @param  {Collection|Array|String} channels
 * @return {Promise}
 */
export function unfollow(user, channels) {
  return Promise.all(channels.map(channel => UsersManager.unfollowUser(user, channel))).then(
    () => channels,
  );
}



// WEBPACK FOOTER //
// ./src/js/app/managers/channel.js