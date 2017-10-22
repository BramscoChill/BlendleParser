import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import Input from 'components/Input';
import Button from 'components/Button';
import AddAlertErrorDialog from './AddAlertErrorDialog';
import { STATUS_ERROR } from 'app-constants';
import { translate, translateElement } from 'instances/i18n';

export default class AlertForm extends React.Component {
  static propTypes = {
    onClickExampleAlert: PropTypes.func.isRequired,
    onClickAdd: PropTypes.func.isRequired,
    onClickShowResults: PropTypes.func.isRequired,
    status: PropTypes.number,
    error: PropTypes.bool,
  };

  _onClickExampleAlert(e) {
    // Allow click on .clickable parts of the OneSky phrase
    if (!e.target.classList.contains('clickable')) {
      return;
    }

    const query = e.target.innerText;
    const input = ReactDOM.findDOMNode(this.refs.input);
    input.value = query;

    this.props.onClickExampleAlert(query);
  }

  _renderError() {
    if (this.props.status !== STATUS_ERROR) {
      return null;
    }

    const input = ReactDOM.findDOMNode(this.refs.input);

    return <AddAlertErrorDialog error={this.props.error} query={input.value} />;
  }

  render() {
    return (
      <div className="v-tile v-alert-settings first tile-explain l-transparent l-edit s-success">
        <div className="explanation">
          {translateElement(<h2 />, 'alerts.text.explanation', false)}
          {translateElement(
            <p className="small-bottom-margin" onClick={this._onClickExampleAlert.bind(this)} />,
            'alerts.text.example',
            false,
          )}
        </div>
        <form className="edit" name="alert" onSubmit={this.props.onClickShowResults}>
          <Input
            ref="input"
            name="query"
            className="inp inp-text inp-keyword"
            placeholder={translate('alerts.text.enter_keyword')}
            onChange={this.props.onChangeQuery}
            autoFocus
          />
          <Button className="btn-text btn-try" onClick={this.props.onClickShowResults}>
            {translate('alerts.buttons.show')}
          </Button>
          <Button className="btn-text btn-add" onClick={this.props.onClickAdd}>
            {translate('alerts.buttons.add')}
          </Button>
        </form>
        {this._renderError()}
      </div>
    );
  }
}



// WEBPACK FOOTER //
// ./src/js/app/modules/alerts/components/AlertForm.js