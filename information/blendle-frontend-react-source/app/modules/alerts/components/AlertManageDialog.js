import React from 'react';
import PropTypes from 'prop-types';
import Dialog from 'components/dialogues/Dialogue';
import { translateElement, translate } from 'instances/i18n';

export default class ManageAlertDialog extends React.Component {
  static propTypes = {
    onClose: PropTypes.func.isRequired,
    onClickDelete: PropTypes.func.isRequired,
    alert: PropTypes.object.isRequired,
  };

  render() {
    return (
      <Dialog className="v-edit-alert-dialog" onClose={this.props.onClose}>
        <div>
          {translateElement(
            <span className="header-title" />,
            'alerts.title.mobile_edit',
            [this.props.alert.get('query')],
            false,
          )}
        </div>

        <button className="btn-delete" onClick={this.props.onClickDelete} />

        <div className="row">
          <p className="label">{translate('alerts.label.keyword')}</p>
          <p className="keyword">{this.props.alert.get('query')}</p>
        </div>
      </Dialog>
    );
  }
}



// WEBPACK FOOTER //
// ./src/js/app/modules/alerts/components/AlertManageDialog.js