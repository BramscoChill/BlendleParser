import React from 'react';
import PropTypes from 'prop-types';
import IssueContainer from './IssueContainer';
import withRouter from 'react-router/lib/withRouter';

const IssueRouterContainer = ({ params, router }) => (
  <IssueContainer
    issueId={params.issueId}
    providerId={params.providerId}
    key={`${params.providerId}-${params.issueId}`}
    section={params.section}
    disabled={false}
    router={router}
  />
);

IssueRouterContainer.propTypes = {
  params: PropTypes.object.isRequired,
  router: PropTypes.object.isRequired,
};

export default withRouter(IssueRouterContainer);



// WEBPACK FOOTER //
// ./src/js/app/modules/issue/containers/IssueRouterContainer.js