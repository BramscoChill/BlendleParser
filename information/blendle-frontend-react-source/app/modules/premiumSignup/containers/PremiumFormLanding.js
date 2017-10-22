import { compose } from 'recompose';
import withRouter from 'react-router/lib/withRouter';
import AffiliatesStore from 'stores/AffiliatesStore';
import altConnect from 'higher-order-components/altConnect';
import withDialogs from '../higher-order-components/withDialogs';
import withAuthListener from '../higher-order-components/withAuthListener';
import PremiumInlineFormLanding from '../components/PremiumInlineFormLanding';

function mapStateToProps({ affiliatesState }, ownProps) {
  return {
    isAffiliate: !!affiliatesState.affiliate,
    ...ownProps,
  };
}
mapStateToProps.stores = { AffiliatesStore };

const enhance = compose(withRouter, withAuthListener, altConnect(mapStateToProps));

export default enhance(PremiumInlineFormLanding);



// WEBPACK FOOTER //
// ./src/js/app/modules/premiumSignup/containers/PremiumFormLanding.js