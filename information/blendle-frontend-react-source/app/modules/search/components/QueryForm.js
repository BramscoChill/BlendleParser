import React from 'react';
import PropTypes from 'prop-types';
import analytics from 'instances/analytics';
import i18n, { translate, translateElement } from 'instances/i18n';
import QueryDateField from './QueryDateField';
import QueryLocaleField from './QueryLocaleField';
import AddAlertContainer from '../AddAlertContainer';
import { blurActiveElement } from 'helpers/activeElement';
import DateRangeContainer from 'containers/DateRangeContainer';

export default class QueryForm extends React.Component {
  static propTypes = {
    query: PropTypes.object,
    onSearch: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      showPicker: false,
      ...this._getQuery(props.query),
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.query === prevProps.query) {
      return;
    }
    this.setState(this._getQuery(this.props.query));
  }

  _getQuery(query) {
    return {
      keyword: query.keyword,
      date: query.date,
      locale: query.locale || i18n.getCountryCode().toLowerCase(),
    };
  }

  _onSearch(ev) {
    ev.preventDefault();
    blurActiveElement();

    if (!this.state.keyword || !this.state.keyword.trim()) {
      return;
    }

    this.props.onSearch({
      keyword: this.state.keyword,
      locale: this.state.locale,
      date: this.state.date,
    });
  }

  _onKeywordChange(ev) {
    this.setState({ keyword: ev.target.value });
  }

  _onOpenPicker() {
    this.setState({
      showPicker: true,
    });
  }

  _onClosePicker() {
    this.setState({
      showPicker: false,
    });
  }

  _onPeriodChange(date) {
    this.setState({
      showPicker: false,
      date,
    });

    if (date && date.from) {
      analytics.track('Refine Search', {
        query: this.state.keyword,
        from: date.from.toDate(),
        to: date.to.toDate(),
      });
    }
  }

  _onLocaleChange(locale) {
    this.setState({ locale });

    analytics.track('Refine Search', {
      query: this.state.keyword,
      locale,
    });
  }

  _renderDatepicker() {
    if (!this.state.showPicker) {
      return null;
    }

    const fromDate = this.state.date ? this.state.date.from : null;
    const toDate = this.state.date ? this.state.date.to : null;

    return (
      <DateRangeContainer
        fromDate={fromDate}
        toDate={toDate}
        onSubmit={this._onPeriodChange.bind(this)}
        onClose={this._onClosePicker.bind(this)}
      />
    );
  }

  render() {
    return (
      <form
        onSubmit={this._onSearch.bind(this)}
        className="v-tile v-search-settings-tile l-transparent tile-explain s-success"
      >
        <div className="explanation">
          {translateElement(<h2 />, 'search.text.explanation', false)}
        </div>

        <div className="search-icon">
          <input
            type="text"
            name="keyword"
            value={this.state.keyword}
            onChange={this._onKeywordChange.bind(this)}
            placeholder={translate('search.text.placeholder')}
            className="inp inp-text inp-keyword"
          />
        </div>
        <div className="search-period">
          <QueryDateField
            date={this.state.date}
            onChange={this._onPeriodChange.bind(this)}
            onOpenPicker={this._onOpenPicker.bind(this)}
          />
          {this._renderDatepicker()}
        </div>
        <div className="search-locale">
          <QueryLocaleField locale={this.state.locale} onChange={this._onLocaleChange.bind(this)} />
        </div>

        <button type="submit" className="btn btn-fullwidth btn-search">
          {translate('search.buttons.search')}
        </button>

        <AddAlertContainer layout="button" alert={this.state.keyword} />

        {translateElement(<p className="info-alert" />, 'search.text.tip', false)}
      </form>
    );
  }
}



// WEBPACK FOOTER //
// ./src/js/app/modules/search/components/QueryForm.js