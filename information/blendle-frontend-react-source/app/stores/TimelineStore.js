import { STATUS_PENDING, STATUS_OK, STATUS_ERROR } from 'app-constants';
import alt from 'instances/altInstance';
import TimelineActions from 'actions/TimelineActions';
import KioskActions from 'actions/KioskActions';
import ItemActions from 'actions/ItemActions';
import { getItemId } from 'selectors/item';
import { get, uniq } from 'lodash';

function getTimelineKey(timeline, options = {}) {
  return JSON.stringify({ timeline, options });
}

class TimelineStore {
  constructor() {
    this.bindActions(TimelineActions);
    this.bindAction(ItemActions.pinItem, this.onPinItem);
    this.bindListeners({
      onKioskActive: [
        KioskActions.fetchKiosk,
        KioskActions.fetchAcquiredIssues,
        KioskActions.fetchCategory,
      ],
    });

    this.state = {
      activeTimelineKey: '',
      timelines: new Map(),
    };
  }

  onKioskActive(options) {
    const categoryId = options ? options.categoryId : 'popular';
    const timelines = this.state.timelines;
    timelines.set('kiosk', { name: 'kiosk', categoryId });

    this.setState({
      activeTimelineKey: 'kiosk',
      timelines,
    });
  }

  onFetchTimeline({ name, options }) {
    const key = getTimelineKey(name, options);

    const timeline = this.state.timelines.get(key);
    const timelines = this.state.timelines;
    timelines.set(key, {
      name,
      options,
      status: STATUS_PENDING,
      itemIds: get(timeline, 'itemIds', []),
    });

    this.setState({
      activeTimelineKey: key,
      timelines,
    });
  }

  onFetchTimelineSuccess({ name, items, options, next }) {
    const key = getTimelineKey(name, options);

    const timelines = this.state.timelines;
    const timeline = timelines.get(key);
    timelines.set(key, {
      ...timeline,
      next,
      itemIds: uniq(items.map(item => getItemId(item)).concat(timeline.itemIds)),
      status: STATUS_OK,
    });

    this.setState({ timelines });
  }

  onFetchTimelineError({ name, error, options }) {
    const storeItems = this.items;
    const key = getTimelineKey(name, options);

    storeItems[key] = {
      status: STATUS_ERROR,
      error,
    };

    this.setState({ items: storeItems });
  }

  onFetchNextItems({ name, options }) {
    const key = getTimelineKey(name, options);

    const timelines = this.state.timelines;
    const timeline = timelines.get(key);
    timelines.set(key, {
      ...timeline,
      status: STATUS_PENDING,
    });

    this.setState({ timelines });
  }

  onFetchNextItemsSuccess({ name, items, options, next }) {
    const key = getTimelineKey(name, options);

    const timelines = this.state.timelines;
    const timeline = timelines.get(key);
    timelines.set(key, {
      ...timeline,
      next,
      itemIds: uniq(timeline.itemIds.concat(items.map(item => getItemId(item)))),
      status: STATUS_OK,
    });

    this.setState({ timelines });

    this.preventDefault(); // TilesStore will emit the change
  }

  onFetchNextItemsError({ name, error, options }) {
    const key = getTimelineKey(name, options);

    const timelines = this.state.timelines;
    const timeline = timelines.get(key);
    timelines.set(key, {
      ...timeline,
      status: STATUS_ERROR,
      error,
    });

    this.setState({ timelines });
  }

  // Process unpinned item
  onPinItem({ itemId, pinned }) {
    const key = getTimelineKey('pins');

    const timelines = this.state.timelines;
    const timeline = timelines.get(key);

    if (!pinned && timeline) {
      timelines.set(key, {
        ...timeline,
        itemIds: timeline.itemIds.filter(id => id !== itemId),
      });

      this.setState({ timelines });
    }
  }
}

export default alt.createStore(TimelineStore, 'TimelineStore');



// WEBPACK FOOTER //
// ./src/js/app/stores/TimelineStore.js