import { memoize } from 'lodash';
import axios from 'axios';
import Settings from 'controllers/settings';
import { getLink as getTemplatedLink } from 'helpers/hal';

const loadApi = memoize(apiLocation => axios(apiLocation).then(res => res.data));

const getLink = (linkName, templateValues) =>
  loadApi(Settings.getLink('microservice_deep_dives')).then(api =>
    getTemplatedLink(api, linkName, templateValues),
  );

export const fetchOverview = () =>
  getLink('deep_dives')
    .then(deepDivesLink => axios(deepDivesLink))
    .then(res => res.data.deep_dives);

export const fetchDeepDive = deepDiveId =>
  getLink('deep_dive', { deep_dive_id: deepDiveId })
    .then(deepDiveLink => axios(deepDiveLink))
    .then(res => res.data.deep_dive);



// WEBPACK FOOTER //
// ./src/js/app/managers/deepDive.js