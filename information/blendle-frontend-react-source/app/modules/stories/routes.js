import { disableBodyScroll } from 'scssModules.scss';
import { asyncRoute } from 'helpers/routerHelpers';

function onEnterStoryDetails() {
  document.body.classList.add(disableBodyScroll);
}

function onLeaveStoryDetails() {
  document.body.classList.remove(disableBodyScroll);
}

export function storyRoute(path) {
  return {
    path,
    onEnter: onEnterStoryDetails,
    onLeave: onLeaveStoryDetails,
    getComponents: asyncRoute((nextState, cb) => {
      require.ensure([], () => {
        const Container = require('./containers/StoryDetailsContainer');

        cb(null, {
          storyDetails: Container,
        });
      });
    }),
  };
}



// WEBPACK FOOTER //
// ./src/js/app/modules/stories/routes.js