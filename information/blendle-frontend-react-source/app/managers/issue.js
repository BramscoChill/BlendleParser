const _ = require('lodash');
const ByeBye = require('byebye');
const Settings = require('controllers/settings');
const Issues = require('collections/issues');
const { allProviders, prefillSelector } = require('selectors/providers');

const IssueManager = {
  _issues: new Issues(null, { track: true }),

  getRecommended(user) {
    return new Issues(null, {
      url: Settings.getLink('recommended_issues', { user_id: user.id }),
    });
  },

  fetchIssues(tags) {
    const issues = IssueManager._issues;
    issues.reset();

    return ByeBye.ajax({
      url: Settings.get('publications').get('links').popular.href,
    }).then((resp) => {
      issues.add(resp.data, { parse: true });

      if (_.isArray(tags)) {
        return Promise.resolve(
          _.reduce(
            tags,
            (store, tag) => {
              store[tag] = IssueManager._parseTag(issues, tag);
              return store;
            },
            {},
          ),
        );
      }
      return Promise.resolve(IssueManager._parseTag(issues, tags));
    });
  },

  fetchFavoriteIssues(userId) {
    return ByeBye.ajax({
      url: Settings.getLink('user_favourites', { user_id: userId }),
    }).then(response => response.data._embedded.favourites);
  },

  getIssues(tag) {
    const issues = IssueManager._issues;

    if (issues.length) {
      return Promise.resolve(IssueManager._parseTag(issues, tag));
    }

    return IssueManager.fetchIssues(tag);
  },

  _parseTag(issues, tag) {
    if (!tag) return issues;

    return IssueManager._filterTag(issues, tag);
  },

  _filterTag(issues, tag) {
    const providers = prefillSelector(allProviders)();
    return issues.filter(issue =>
      providers.find(
        provider =>
          issue.get('provider').id === provider.id &&
          provider.tags &&
          provider.tags.find(providerTag => providerTag.name === tag),
      ),
    );
  },
};

module.exports = IssueManager;



// WEBPACK FOOTER //
// ./src/js/app/managers/issue.js