import alt from 'instances/altInstance';

export default alt.createActions({
  setItem: (key, value) => ({ key, value }),
  removeItem: key => ({ key }),
  clear: () => true,
});



// WEBPACK FOOTER //
// ./src/js/app/actions/SessionActions.js