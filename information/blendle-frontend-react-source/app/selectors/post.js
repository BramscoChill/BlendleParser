import { get } from 'lodash';

export function getAvatarLink(post) {
  return get(post, 'user.avatar.href');
}



// WEBPACK FOOTER //
// ./src/js/app/selectors/post.js