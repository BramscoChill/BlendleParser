import { branch, renderNothing } from 'recompose';

export default branch(({ isLoading }) => isLoading, renderNothing);



// WEBPACK FOOTER //
// ./src/js/app/higher-order-components/renderNothingIfLoading.js