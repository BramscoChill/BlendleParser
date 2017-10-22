import { get } from 'lodash';

export const getItem = (sessionState, key) => get(sessionState, `data.${key}`);



// WEBPACK FOOTER //
// ./src/js/app/selectors/sessionState.js