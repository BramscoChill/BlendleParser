import React from 'react';
import PropTypes from 'prop-types';
import { translate } from 'instances/i18n';

const AcquireIssueTooltip = ({ onClose }) => (
  <div className="v-acquire-issue-popover">
    <img src="/img/illustrations/acquire_issue.gif" alt="" />
    <h3 className="title">{translate('tooltips.acquireIssue.title')}</h3>
    <p className="message">{translate('tooltips.acquireIssue.message')}</p>
    <button className="btn btn-dismiss btn-text btn-white" onClick={onClose}>
      {translate('tooltips.acquireIssue.buttonText')}
    </button>
  </div>
);

AcquireIssueTooltip.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default AcquireIssueTooltip;



// WEBPACK FOOTER //
// ./src/js/app/components/AcquireIssueTooltip.js