export function getPosts(tile) {
  const userPost = tile['user-post'] || null;
  const followedPosts = tile['followed-user-posts'] || [];
  const providerPost = tile['provider-post'] || null;

  return [userPost, ...followedPosts, providerPost].filter(post => post);
}

export function isRead(tile) {
  return tile.item_purchased && tile.opened;
}



// WEBPACK FOOTER //
// ./src/js/app/selectors/tile.js