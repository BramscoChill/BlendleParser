import _ from 'lodash';
import ByeBye from 'byebye';
import Auth from 'controllers/auth';
import Settings from 'controllers/settings';
import Manifest from 'models/manifest';
import Issue from 'models/issue';
import Acquisition from 'models/acquisition';

const Item = ByeBye.Model.extend({
  autoRefundTimeout: 10, // In seconds
  name: 'item',
  defaults: {
    type: 'item',
    acquirable: true,
  },
  mappings: {
    'b:acquisition': {
      resource: (data, options) => {
        data.id = data._links.self.href;

        return new Acquisition(data, options);
      },
    },
    manifest: { resource: Manifest },
    issue: { resource: Issue },
  },
  initialize(attributes) {
    if (attributes && attributes.id) {
      this.url = Settings.getLink('item', { item_id: attributes.id });
    }

    this.on('change:post_count', () => {
      this.set('posts', this.get('post_count'));
      this.set('posts_count', this.get('post_count'));
    });
  },
  parse(resp) {
    const itemUrl = Settings.getLink('item', { item_id: resp.id });
    let acquisitionUrl = `${itemUrl}/acquisition`;

    if (Auth.getId()) {
      acquisitionUrl += `?user_context=${Auth.getId()}`;
    }

    if (!resp._links) {
      resp._links = {};
    }

    if (!resp._embedded) {
      resp._embedded = {};
    }

    if (!resp.id) {
      resp.id = resp._embedded.manifest.id;
    }

    if (
      Auth.getId() &&
      resp.acquired !== undefined &&
      resp.price !== undefined &&
      resp.refundable !== undefined &&
      resp.subscription !== undefined
    ) {
      resp._embedded['b:acquisition'] = {
        _links: {
          self: {
            href: acquisitionUrl,
          },
          'b:issue-acquisition': {
            href: Settings.getLink('issue_acquisition', {
              user_context: Auth.getId(),
              issue_id: resp._embedded.manifest.issue.id,
            }),
          },
        },
        price: resp.price,
        refundable: resp.refundable,
        subscription: resp.subscription,
        acquired: resp.acquired,
      };
    }

    if (!Auth.getId() && resp.price) {
      resp._embedded['b:acquisition'] = {
        _links: {
          self: {
            href: acquisitionUrl,
          },
          'b:issue-acquisition': {
            href: Settings.getLink('issue_acquisition', {
              issue_id: resp._embedded.manifest.issue.id,
            }),
          },
        },
        price: resp.price,
      };
    }

    if (!resp._links['b:acquisition']) {
      resp._links['b:acquisition'] = {
        href: acquisitionUrl,
      };
    }

    if (Auth.getId() && !resp._links['b:pin']) {
      resp._links['b:pin'] = {
        href: `${Settings.getLink('user', { user_id: Auth.getId() })}/pin/${resp.id}`,
      };
    }

    if (resp.posts) {
      resp.post_count = resp.posts;
      resp.posts_count = resp.posts;
    }

    if (resp.posts_count) {
      resp.posts = resp.posts_count;
      resp.post_count = resp.posts_count;
    }

    if (resp.post_count) {
      resp.posts = resp.post_count;
      resp.posts_count = resp.post_count;
    }

    return this.parseHal(resp);
  },

  /**
   * Get the featured image for this item, if it has one
   *
   * @return {Object} the image or null
   */
  getFeaturedImage() {
    const images = this.get('manifest').get('images');
    return _.find(images, { featured: true });
  },

  /**
   * Check if the item is acquirable
   * @return {Boolean} true if acquirable is explicitly set to false
   */
  isAcquirable() {
    return this.get('acquirable');
  },
});

export default Item;



// WEBPACK FOOTER //
// ./src/js/app/models/item.js