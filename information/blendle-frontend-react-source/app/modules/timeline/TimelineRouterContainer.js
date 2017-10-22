import React from 'react';
import PropTypes from 'prop-types';
import TimelineContainer from './TimelineContainer';

const routeTimelines = ['channel', 'trending', 'pins', 'premium', '_feed'];

function getConfig({ location, params }) {
  const pathname = location.pathname;
  const { details, userId } = params;

  const [firstPart] = pathname.replace(/^\//, '').split('/');
  if (routeTimelines.includes(firstPart)) {
    return {
      name: firstPart,
      options: { details },
    };
  }
  if (pathname.match(/user\/([^\/]+)\/items/)) {
    return {
      name: 'userArchive',
      options: { details: userId },
    };
  }
  if (firstPart === 'user') {
    return {
      name: 'user',
      options: { details: userId },
    };
  }
  return {
    name: 'following',
    options: {},
  };
}

const TimelineRouterContainer = ({ location, params, route }) => {
  const config = getConfig({ location, params });
  return <TimelineContainer timeline={config} moduleName={route.module} />;
};

TimelineRouterContainer.propTypes = {
  location: PropTypes.object.isRequired,
  params: PropTypes.object.isRequired,
  // There are more props than just `module`, but `module` is the only one we're
  // actually using
  route: PropTypes.shape({
    module: PropTypes.string.isRequired,
  }).isRequired,
};

export default TimelineRouterContainer;



// WEBPACK FOOTER //
// ./src/js/app/modules/timeline/TimelineRouterContainer.js