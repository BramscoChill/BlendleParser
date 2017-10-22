import { curry } from 'lodash/fp';

export const getChannels = channelsState => channelsState.channels.data;

export const getById = curry((channelsState, channelId) =>
  getChannels(channelsState).get(channelId),
);



// WEBPACK FOOTER //
// ./src/js/app/selectors/channels.js