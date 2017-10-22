import Settings from 'controllers/settings';
import URI from 'urijs';
import IssueModel from 'models/issue';
import countryToLanguages from 'helpers/countryToLanguages';
import moment from 'moment';
import { allProviders, isProviderHidden, prefillSelector } from 'selectors/providers';
import axios from 'axios';
import { get } from 'lodash';

function getIssueByProvider(provider) {
  const url = Settings.getLink('latest_issue', { provider_id: provider.id });
  const issue = new IssueModel();
  return issue.fetch({ url }).then(() => issue);
}

function findProviders(keyword, country) {
  const locales = countryToLanguages(country);
  return prefillSelector(allProviders)().filter((provider) => {
    if (provider.id === 'tst' || prefillSelector(isProviderHidden)(provider.id)) {
      return false;
    }

    const nameMatch = provider.name.toLowerCase().includes(keyword.toLowerCase());
    const idMatch = provider.id.includes(keyword.toLowerCase());
    const localeMatch = locales.includes(provider.language);

    return (idMatch || nameMatch) && localeMatch;
  });
}

function getSearchDateRange(dateRange) {
  const today = moment()
    .startOf('day')
    .unix();
  return {
    min_age:
      today -
      moment(dateRange.from)
        .subtract(1, 'days')
        .unix(),
    max_age: today - dateRange.to.unix(),
  };
}

export function fetchProvidersIssue(keyword, country, limit) {
  const providers = findProviders(keyword, country).splice(0, limit);

  return Promise.all(
    providers.map(
      provider =>
        getIssueByProvider(provider).catch((err) => {
          if (err.status === 404) {
            return Promise.resolve(null);
          }
          return err;
        }), // Filter out issues that could not be found
    ),
  ).then(issues => issues.filter(issue => issue));
}

export function fetchItems(keyword, country, dateRange) {
  const endpointUrl = Settings.getLink('item_search', { query: keyword }, ['b:tiles']);

  const locales = countryToLanguages(country);
  const searchUrl = new URI(endpointUrl);
  locales.forEach((locale) => {
    searchUrl.addSearch({ 'locales[]': locale });
  });

  if (dateRange) {
    searchUrl.addSearch(getSearchDateRange(dateRange));
  }

  return axios
    .get(searchUrl.toString(), {
      headers: {
        accept: 'application/hal+json',
        'X-Tile-Version': 3, // Use new tile endpoint version
      },
    })
    .then(res => ({
      tiles: get(res, 'data._embedded[b:tiles]', []),
      next: res.data._links.next ? res.data._links.next.href : null,
    }));
}



// WEBPACK FOOTER //
// ./src/js/app/managers/search.js