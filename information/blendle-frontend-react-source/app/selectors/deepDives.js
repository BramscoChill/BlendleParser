import { get, flowRight as compose, map } from 'lodash/fp';

export const picks = get('picks');

export const itemIds = compose(map(get('article_id')), picks);

export const readMoreTitle = get('readmore.title');

export const readMorePicks = get('readmore.picks');



// WEBPACK FOOTER //
// ./src/js/app/selectors/deepDives.js