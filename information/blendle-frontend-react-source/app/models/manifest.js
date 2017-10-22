import { Model } from 'byebye';
import { map } from 'lodash';
import { allowImages } from 'helpers/itemImages';

const Manifest = Model.extend({
  name: 'manifest',
  parse(resp) {
    if (resp._links && resp._links.self) {
      this.url = resp._links.self.href;
    }

    // filter out images after X days for Dutch publications
    if (resp.images && !allowImages(resp.date, resp.id, resp.provider.id)) {
      resp.images = [];
    }

    if (resp.provider.id === 'telegraaf') {
      resp.body = map(resp.body, (value) => {
        if (value.type === 'hl1') {
          return { type: value.type, content: `<b>${value.content}</b>` };
        }

        return value;
      });
    }

    return this.parseHal(resp);
  },
});
export default Manifest;



// WEBPACK FOOTER //
// ./src/js/app/models/manifest.js