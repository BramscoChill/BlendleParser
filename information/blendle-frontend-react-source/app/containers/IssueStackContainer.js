import React from 'react';
import { string } from 'prop-types';
import AltContainer from 'alt-container';
import IssueStack from 'components/IssueStack';
import IssueActions from 'actions/IssueActions';
import IssuesStore from 'stores/IssuesStore';

function findSrc(latestIssues, providerId) {
  const latestIssue = latestIssues[providerId];

  if (latestIssue) {
    return latestIssue.getCoverURL();
  }

  return null;
}

class IssueStackContainer extends React.Component {
  static propTypes = {
    providerId: string.isRequired,
    src: IssueStack.propTypes.src,
    className: IssueStack.propTypes.className,
  };

  state = {
    src: null,
  };

  componentDidMount() {
    const { providerId, src } = this.props;

    if (!src) {
      IssueActions.fetchLatestIssue.defer(providerId, IssuesStore.getState());
    }
  }

  render() {
    const { src, providerId } = this.props;

    // If we have the src, we don't have to render an alt container
    if (src) {
      return <IssueStack className={this.props.className} src={src} />;
    }

    return (
      <AltContainer
        stores={{ IssuesStore }}
        render={stores => (
          <IssueStack
            className={this.props.className}
            src={findSrc(stores.IssuesStore.latestIssues, providerId)}
          />
        )}
      />
    );
  }
}

export default IssueStackContainer;



// WEBPACK FOOTER //
// ./src/js/app/containers/IssueStackContainer.js