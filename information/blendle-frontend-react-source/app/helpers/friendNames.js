import { translate } from 'instances/i18n';

/**
 * * @param {Array<Object>} friendPosts
 */
export const getFriendNames = (friendPosts = []) =>
  friendPosts
    .slice(0, 3) // Only get a max of 3 friend posts
    .map(post => post.user.full_name);

/**
 * @param {Array<string>} friendNames
 * @param {number} otherPostCount
 */
export const getFriendPostsString = (friendNames, otherPostCount) => {
  const friendString = friendNames.reduce((result, name, index) => {
    if (index === friendNames.length - 1) {
      return `${result}${name}`;
    }

    if (friendNames.length > 1 && otherPostCount < 1 && index === friendNames.length - 2) {
      return `${result}${name} ${translate('app.likes.and')} `;
    }

    return `${result}${name}, `;
  }, '');

  if (friendString && otherPostCount > 0) {
    return `${friendString} ${translate('app.likes.and')} ${otherPostCount} ${translate(
      'app.likes.others',
    )}`;
  } else if (!friendString && otherPostCount > 0) {
    // return a string every time
    return String(otherPostCount);
  }

  return friendString;
};



// WEBPACK FOOTER //
// ./src/js/app/helpers/friendNames.js