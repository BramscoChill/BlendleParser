export const getHash = (userId, itemId) =>
  window.btoa(
    JSON.stringify({
      version: '1',
      uid: userId,
      item_id: itemId,
    }),
  );



// WEBPACK FOOTER //
// ./src/js/app/helpers/sharerHash.js