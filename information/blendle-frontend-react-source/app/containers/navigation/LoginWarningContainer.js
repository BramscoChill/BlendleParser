import { compose, withState, mapProps, branch, renderNothing } from 'recompose';
import withRouter from 'react-router/lib/withRouter';
import LoginWarningDialogue from 'components/dialogues/LoginWarningDialogue';

function propsMapper({ didCloseWarning, setDidCloseWarnig, router }) {
  return {
    showWaring: router.isActive('/login/warning') && !didCloseWarning,
    onClose: () => {
      setDidCloseWarnig(true);
    },
  };
}

const enhance = compose(
  withRouter,
  withState('didCloseWarning', 'setDidCloseWarnig', false),
  mapProps(propsMapper),
  branch(props => !props.showWaring, renderNothing),
);

export default enhance(LoginWarningDialogue);



// WEBPACK FOOTER //
// ./src/js/app/containers/navigation/LoginWarningContainer.js