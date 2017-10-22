import { compose } from 'recompose';
import altConnect from 'higher-order-components/altConnect';
import renderNothingIfIsHidden from 'higher-order-components/renderNothingIfIsHidden';
import { translate } from 'instances/i18n';
import { isFirstBundleInTrial } from 'helpers/bundle';
import AuthStore from 'stores/AuthStore';
import PremiumSubscriptionStore from 'stores/PremiumSubscriptionStore';
import SectionsPageStore from '../stores/SectionsPageStore';
import { getTimeOfDay, getTimeOfDayPhraseId } from '../helpers/timeOfDay';
import Intro from '../components/Intro';

const firstDayIntro = `
  <p>
    We hebben vannacht alle kranten en tijdschriften gelezen, en hieronder vind je de beste artikelen die erin stonden. Je kunt ze gratis lezen -- en dat kun je de komende tijd blijven doen.
  </p>
  <p>
    Als je morgen terugkomt hebben we een verse selectie voor je, en zul je zien dat de aanbevelingen nóg beter bij je passen. Hoe meer je Blendle gebruikt, hoe beter het wordt.
  </p>
`;

function mapStateToProps({
  authState: { user },
  sectionsPageState: { intro },
  premiumSubscriptionState: { subscription },
}) {
  if (!intro) {
    return {
      isHidden: true,
    };
  }

  const introDate = intro.created_at;

  const firstName = user.getFirstName();
  const titlePhraseId = getTimeOfDayPhraseId(getTimeOfDay(), firstName);

  return {
    introHtml: isFirstBundleInTrial(introDate, subscription) ? firstDayIntro : intro.content,
    timeOfDayTitle: translate(titlePhraseId, firstName),
    date: introDate,
  };
}

mapStateToProps.stores = { AuthStore, SectionsPageStore, PremiumSubscriptionStore };

const enhance = compose(altConnect(mapStateToProps), renderNothingIfIsHidden);

export default enhance(Intro);



// WEBPACK FOOTER //
// ./src/js/app/modules/sectionsPage/containers/IntroContainer.js