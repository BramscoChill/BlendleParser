const { Model } = require('byebye');
const Settings = require('controllers/settings');
const Auth = require('controllers/auth');
const Manifest = require('./manifest');
const IssueAcquisition = require('./issueacquisition');

const Issue = Model.extend({
  name: 'issue',
  mappings: {
    manifest: { resource: Manifest },
    'b:manifest': { resource: Manifest },
    'b:issue-acquisition': { resource: IssueAcquisition, options: { track: true } },
    items: {
      resource: (resp, options) => {
        const Items = require('collections/items');

        return new Items(resp, options);
      },
    },
  },

  getCoverURL() {
    return this.getLink(this.getCoverKey());
  },

  getCoverWidth() {
    return this.getLinkAttribute(this.getCoverKey(), 'width');
  },

  getCoverHeight() {
    return this.getLinkAttribute(this.getCoverKey(), 'height');
  },

  getCoverKey() {
    if (this.getLink('cover_image')) {
      return 'cover_image';
    }

    if (this.getLink('page_preview')) {
      return 'page_preview';
    }

    return undefined;
  },

  parse(resp) {
    if (!resp._links) {
      resp._links = {};
    }

    if (!resp._links['b:issue-acquisition']) {
      const params = { issue_id: resp.id };

      if (Auth.getId()) {
        params.user_context = Auth.getId();
      }

      resp._links['b:issue-acquisition'] = { href: Settings.getLink('issue_acquisition', params) };
    }

    if (resp.representations[0] === 'tiles') {
      resp._links.items = { href: Settings.getLink('issue_items', { issue_id: resp.id }) };
    }

    return this.parseHal(resp);
  },
});

export default Issue;



// WEBPACK FOOTER //
// ./src/js/app/models/issue.js