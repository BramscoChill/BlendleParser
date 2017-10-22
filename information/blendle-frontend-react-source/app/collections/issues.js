import { Collection } from 'byebye';
import Issue from 'models/issue';
import { isProviderHidden, prefillSelector } from 'selectors/providers';

const Issues = Collection.extend({
  model: Issue,
  parse(resp) {
    if (resp._links.self) {
      this.url = resp._links.self.href;
    }

    if (resp._links.next) {
      this.next = resp._links.next.href;
    } else {
      this.next = undefined;
    }

    if (resp._links.prev) {
      this.prev = resp._links.prev.href;
    } else {
      this.prev = undefined;
    }

    let isCategoryNew = false;

    if (resp._links.self.href.toLowerCase().indexOf('most_recent.json') > -1) {
      isCategoryNew = true;
    }

    if (
      resp._links.self.href.toLowerCase().indexOf('popular') === -1 &&
      resp._links.self.href.toLowerCase().indexOf('user') === -1 &&
      resp._embedded.issues
    ) {
      // Reverse when not popular, don't reverse when fetching acquired issues from a user
      resp._embedded.issues = resp._embedded.issues.reverse();
    }

    if (this._favourites) {
      let favourites = [];
      let issues = [];
      let i;

      for (i = 0; i < resp._embedded.issues.length; i++) {
        const favourite = this._favourites.findWhere({
          provider_id: resp._embedded.issues[i].provider.id,
        });

        if (favourite) {
          resp._embedded.issues[i].favourite = true;

          if (isCategoryNew) {
            issues.push(resp._embedded.issues[i]);
          } else {
            favourites.push(resp._embedded.issues[i]);
          }
        } else {
          resp._embedded.issues[i].favourite = false;

          issues.push(resp._embedded.issues[i]);
        }
      }

      if (!isCategoryNew) {
        for (i = favourites.length; i > 0; i--) {
          issues.unshift(favourites[i - 1]);
        }
      }

      resp._embedded.issues = issues;

      favourites = null;
      issues = null;
    }

    const issues = resp._embedded.issues.filter(
      issue => !prefillSelector(isProviderHidden)(issue.provider.id),
    );
    return issues;
  },
});

export default Issues;



// WEBPACK FOOTER //
// ./src/js/app/collections/issues.js