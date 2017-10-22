import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import Input from 'components/Input';
import Button from 'components/Button';
import { translate, translateElement } from 'instances/i18n';

export default class AlertManageForm extends React.Component {
  static propTypes = {
    onClickEdit: PropTypes.func.isRequired,
    onChangeQuery: PropTypes.func.isRequired,
    onClickShowResults: PropTypes.func.isRequired,
    onClickDelete: PropTypes.func.isRequired,
    query: PropTypes.string,
  };

  state = {
    showEdit: false,
    query: this.props.query,
  };

  _onClickShowEdit(e) {
    e.preventDefault();
    this.setState({ showEdit: !this.state.showEdit });
  }

  _onClickEdit() {
    const inp = ReactDOM.findDOMNode(this.refs.query);
    this.props.onClickEdit({ query: inp.value });
  }

  _renderEdit() {
    if (!this.state.showEdit) {
      return null;
    }

    return (
      <form className="edit" name="alert" onSubmit={this.props.onClickShowResults}>
        <Input
          ref="query"
          name="query"
          className="inp inp-text inp-keyword"
          defaultValue={this.props.query}
          onChange={this.props.onChangeQuery}
          autoFocus
        />
        <Button className="btn-text btn-try" onClick={this.props.onClickShowResults}>
          {translate('alerts.buttons.show')}
        </Button>
        <Button className="btn-text btn-update" onClick={() => this._onClickEdit()}>
          {translate('alerts.buttons.edit')}
        </Button>
        <div className="lnk lnk-delete" onClick={this.props.onClickDelete}>
          {translate('alerts.buttons.delete')}
        </div>
      </form>
    );
  }

  render() {
    return (
      <div className="v-tile v-alert-settings l-transparent tile-explain s-success">
        <div className="explanation">
          {translateElement(<h2 />, 'alerts.tiles.settings.explanation', [this.props.query], true)}
        </div>
        <div className="display">
          <a href="#" className="lnk lnk-edit" onClick={this._onClickShowEdit.bind(this)}>
            {translate('alerts.links.edit')}
          </a>
        </div>
        {this._renderEdit()}
      </div>
    );
  }
}



// WEBPACK FOOTER //
// ./src/js/app/modules/alerts/components/AlertManageForm.js