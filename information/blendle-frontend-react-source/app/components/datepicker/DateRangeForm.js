import React from 'react';
import PropTypes from 'prop-types';
import ManagedInput from 'components/ManagedInput';
import { translate } from 'instances/i18n';
import classNames from 'classnames';
import Button from 'components/Button';
import { keyCode } from 'app-constants';

export default class DateRangeForm extends React.Component {
  static propTypes = {
    fromDate: PropTypes.object.isRequired,
    toDate: PropTypes.object.isRequired,
    onFocusFrom: PropTypes.func.isRequired,
    onFocusTo: PropTypes.func.isRequired,
    onChangeFrom: PropTypes.func.isRequired,
    onChangeTo: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
    activeField: PropTypes.oneOf(['to', 'from']).isRequired,
  };

  _onKey(e) {
    if (e.ctrlKey) {
      return;
    }

    if (e.keyCode === keyCode.RETURN && !this.props.disabled) {
      this.props.onSubmit({
        from: this.props.fromDate,
        to: this.props.toDate,
      });
    }
  }

  render() {
    const { fromDate, toDate } = this.props;

    const fromInpClassNames = classNames('date-from', {
      's-active': this.props.activeField === 'from',
    });

    const toInpClassNames = classNames('date-to', {
      's-active': this.props.activeField === 'to',
    });

    return (
      <div className="fields">
        <div className="title">{translate('dialogues.daterange.title')}</div>
        <div className={fromInpClassNames}>
          <label className="date-label">{translate('dialogues.daterange.from')}</label>
          <ManagedInput
            className="inp inp-text inp-calendar-from inp-calendar-date"
            value={fromDate.format('l')}
            onChange={this.props.onChangeFrom.bind(this)}
            onFocus={this.props.onFocusFrom.bind(this)}
            onKeyUp={this._onKey.bind(this)}
          />
        </div>
        <div className={toInpClassNames}>
          <label className="date-label">{translate('dialogues.daterange.to')}</label>
          <ManagedInput
            className="inp inp-text inp-calendar-to inp-calendar-date"
            value={toDate.format('l')}
            onChange={this.props.onChangeTo.bind(this)}
            onFocus={this.props.onFocusTo.bind(this)}
            onKeyUp={this._onKey.bind(this)}
          />
        </div>
        <Button
          className="btn-select btn-text"
          disabled={this.props.disabled}
          onClick={() => {
            this.props.onSubmit({
              from: fromDate,
              to: toDate,
            });
          }}
        >
          {translate('dialogues.daterange.select')}
        </Button>
      </div>
    );
  }
}



// WEBPACK FOOTER //
// ./src/js/app/components/datepicker/DateRangeForm.js