import { branch, renderNothing } from 'recompose';

export default branch(({ isHidden }) => isHidden, renderNothing);



// WEBPACK FOOTER //
// ./src/js/app/higher-order-components/renderNothingIfIsHidden.js