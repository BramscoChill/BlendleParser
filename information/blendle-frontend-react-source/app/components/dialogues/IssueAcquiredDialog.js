import React from 'react';
import PropTypes from 'prop-types';
import Dialogue from 'components/dialogues/Dialogue';
import { translateElement, translate } from 'instances/i18n';
import IssueStack from 'containers/IssueStackContainer';
import Button from 'components/Button';

class IssueAcquiredDialog extends React.Component {
  static propTypes = {
    onClickClose: PropTypes.func.isRequired,
    onClickBrowse: PropTypes.func.isRequired,
    providerName: PropTypes.string.isRequired,
    dateString: PropTypes.string.isRequired,
    coverUrl: IssueStack.propTypes.src,
  };

  render() {
    const { onClickClose, onClickBrowse, providerName, dateString, coverUrl } = this.props;

    return (
      <Dialogue className="v-issue-acquired" onClose={onClickClose} hideClose>
        <div className="column column-left">
          <IssueStack className="issue-stack" src={coverUrl} />
          {translateElement(<h2 />, 'item.text.read_for_free', [providerName, dateString])}
          {translateElement(<p className="message" />, 'item.text.subtext_all_articles_free')}
          <div className="buttons">
            <Button className="btn-fullwidth btn-green btn-issue" onClick={onClickBrowse}>
              {translate('item.text.browse_issue')}
            </Button>
            <Button className="btn-fullwidth btn-white" onClick={onClickClose}>
              {translate('app.buttons.i_get_it')}
            </Button>
          </div>
        </div>
        <div className="column column-right">
          <IssueStack className="issue-stack" src={coverUrl} />
        </div>
      </Dialogue>
    );
  }
}

export default IssueAcquiredDialog;



// WEBPACK FOOTER //
// ./src/js/app/components/dialogues/IssueAcquiredDialog.js